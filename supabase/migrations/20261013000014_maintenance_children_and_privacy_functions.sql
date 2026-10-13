-- School clubs booking system: 14 - scheduled maintenance, message tracking,
-- child record review and personal-data functions.

-- Minimum enrolment -----------------------------------------------------------
-- Flags clubs whose enrolment deadline has passed with fewer DEFINITE children
-- than their minimum. Checked: published and closed clubs, and unpublished
-- clubs that have at least one confirmed place (a club hidden from parents
-- still has families relying on it). Draft and cancelled clubs are not. Possible duplicate records are not counted as extra
-- children, so a club is never treated as having reached its minimum on the
-- strength of a record that might be a duplicate.
--
-- It ONLY sets the review flag and returns the clubs newly flagged. It never
-- cancels a club, closes bookings, contacts parents or refunds anyone.
-- Running it again changes nothing. An alert for the administrator is added
-- to admin_alerts in the same transaction, so it cannot be lost.

create function booking.flag_under_enrolled_clubs()
returns table (
  club_id uuid,
  title text,
  enrolled_children integer,
  possible_duplicates integer,
  definite_children integer,
  min_children integer
)
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_due record;
begin
  for v_due in
    select c.id as due_id, c.title as due_title, c.min_children as due_min,
           e.enrolled_children as due_enrolled, e.possible_duplicates as due_possible,
           e.definite_children as due_definite
      from booking.clubs c
      join booking.club_enrolment e on e.club_id = c.id
     where (c.status in ('published', 'closed')
            or (c.status = 'unpublished' and e.enrolled_children > 0))
       and c.review_status = 'none'
       and c.enrolment_deadline is not null
       and c.enrolment_deadline <= now()
       and e.definite_children < c.min_children
     order by c.id
  loop
    -- The status check is repeated so two overlapping runs flag a club once.
    update booking.clubs c
       set review_status = 'flagged', review_flagged_at = now()
     where c.id = v_due.due_id
       and c.review_status = 'none';

    if found then
      perform booking._raise_club_alert(v_due.due_id, 'club_below_minimum');
      perform booking.write_audit('club', v_due.due_id, 'club_flagged_under_enrolled', 'system', null,
        jsonb_build_object(
          'enrolled_children', v_due.due_enrolled,
          'possible_duplicates', v_due.due_possible,
          'definite_children', v_due.due_definite,
          'min_children', v_due.due_min));

      club_id := v_due.due_id;
      title := v_due.due_title;
      enrolled_children := v_due.due_enrolled;
      possible_duplicates := v_due.due_possible;
      definite_children := v_due.due_definite;
      min_children := v_due.due_min;
      return next;
    end if;
  end loop;
end;
$$;

-- Message tracking --------------------------------------------------------------
-- SQL never sends email. A Netlify Function sends each message listed in
-- booking.outstanding_messages and then calls the matching function below.
-- Each returns true if it recorded the message as sent, and false if there
-- was nothing owed (already recorded, or no longer applicable), so calling
-- one twice is harmless.
--
-- A message that is sent but whose "sent" record then fails will be offered
-- again. The caller prevents a second copy by giving the email provider the
-- message_key from outstanding_messages as its idempotency key.

create function booking.mark_confirmation_email_sent(p_booking_id uuid)
returns boolean
language plpgsql
set search_path = booking, pg_temp
as $$
begin
  update booking.bookings
     set confirmation_email_sent_at = now()
   where id = p_booking_id
     and status = 'confirmed'
     and confirmation_email_sent_at is null;
  return found;
end;
$$;

-- Marks ONE alert as sent, by its ID. Other alerts for the same booking,
-- including any raised while this one was being sent, are untouched.
create function booking.mark_admin_alert_sent(p_alert_id uuid)
returns boolean
language plpgsql
set search_path = booking, pg_temp
as $$
begin
  update booking.admin_alerts
     set sent_at = now()
   where id = p_alert_id
     and sent_at is null;
  return found;
end;
$$;

-- Retention: contact details left on ended bookings ----------------------------
-- When a booking ends unpaid after Checkout was started, what the parent
-- typed is kept in case a late payment arrives. This removes it once the
-- booking has been ended for unconfirmed_contact_retention_days. It only
-- touches bookings that are expired, failed or cancelled; a booking under
-- review keeps its details until the administrator has dealt with it.
-- Returns how many bookings were cleared.

create function booking.purge_stale_pending_contacts()
returns integer
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_count integer;
begin
  update booking.bookings b
     set pending_contact = null
    from booking.app_config cfg
   where b.pending_contact is not null
     and b.status in ('expired', 'failed', 'cancelled')
     and coalesce(b.ended_at, b.updated_at) < now() - make_interval(days => cfg.unconfirmed_contact_retention_days);
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- The scheduled job's single entry point ---------------------------------------
-- A scheduled Netlify Function should call this every few minutes. It does
-- the database housekeeping that is safe to do on the clock and reports what
-- is left for the function itself to do:
--   awaiting_reconciliation  bookings whose recorded Checkout should have
--                            expired: ask Stripe about each (see
--                            bookings_awaiting_reconciliation)
--   outstanding_messages     emails still owed (see outstanding_messages)
-- It sends nothing, cancels nothing and refunds nothing.

create function booking.run_scheduled_maintenance()
returns jsonb
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_released integer;
  v_flagged integer;
  v_purged integer;
begin
  v_released := booking.release_unattached_holds();
  select count(*) into v_flagged from booking.flag_under_enrolled_clubs();
  v_purged := booking.purge_stale_pending_contacts();

  return jsonb_build_object(
    'holds_released', v_released,
    'clubs_flagged', v_flagged,
    'pending_contacts_purged', v_purged,
    'awaiting_reconciliation', (select count(*) from booking.bookings_awaiting_reconciliation),
    'outstanding_messages', (select count(*) from booking.outstanding_messages)
  );
end;
$$;

-- Child records -----------------------------------------------------------------
-- The system never merges child records. It can only point out pairs that
-- might be the same child (booking.possible_duplicate_children). Everything
-- below is a deliberate action by the administrator.

-- Flags two records for review. Until decided, the pair counts as one
-- definite child in club_enrolment.
create function booking.admin_flag_possible_duplicate(
  p_child_id uuid,
  p_other_child_id uuid,
  p_admin_user_id uuid
)
returns uuid
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_a uuid := least(p_child_id, p_other_child_id);
  v_b uuid := greatest(p_child_id, p_other_child_id);
  v_id uuid;
begin
  perform booking._require_admin(p_admin_user_id);
  if p_child_id is null or p_other_child_id is null or p_child_id = p_other_child_id then
    raise exception 'INVALID_CHILD_PAIR';
  end if;

  insert into booking.child_duplicate_flags (child_a_id, child_b_id, status, source)
  values (v_a, v_b, 'open', 'admin')
  on conflict (child_a_id, child_b_id) do update
    set status = 'open', source = 'admin', decided_by = null, decided_at = null
    where booking.child_duplicate_flags.status <> 'merged'
  returning id into v_id;

  if v_id is null then
    raise exception 'CHILDREN_ALREADY_MERGED';
  end if;

  perform booking.write_audit('child', v_a, 'children_flagged_possible_duplicate', 'admin', p_admin_user_id,
    jsonb_build_object('other_child_id', v_b));
  return v_id;
end;
$$;

-- Records the administrator's decision that two records are different children.
create function booking.admin_mark_children_distinct(
  p_child_id uuid,
  p_other_child_id uuid,
  p_admin_user_id uuid
)
returns void
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_a uuid := least(p_child_id, p_other_child_id);
  v_b uuid := greatest(p_child_id, p_other_child_id);
  v_id uuid;
begin
  perform booking._require_admin(p_admin_user_id);
  if p_child_id is null or p_other_child_id is null or p_child_id = p_other_child_id then
    raise exception 'INVALID_CHILD_PAIR';
  end if;

  insert into booking.child_duplicate_flags (child_a_id, child_b_id, status, source, decided_by, decided_at)
  values (v_a, v_b, 'distinct', 'admin', p_admin_user_id, now())
  on conflict (child_a_id, child_b_id) do update
    set status = 'distinct', source = 'admin', decided_by = excluded.decided_by, decided_at = excluded.decided_at
    where booking.child_duplicate_flags.status <> 'merged'
  returning id into v_id;

  if v_id is null then
    raise exception 'CHILDREN_ALREADY_MERGED';
  end if;

  perform booking.write_audit('child', v_a, 'children_marked_distinct', 'admin', p_admin_user_id,
    jsonb_build_object('other_child_id', v_b));
end;
$$;

-- Merges p_merge_child_id INTO p_keep_child_id because the administrator has
-- decided they are the same child. Every place moves to the kept record; the
-- other record is kept, marked as merged, and never matched again.
-- Refused if the two records have places on the same session (the same child
-- cannot attend one session twice: one of those places must be dealt with
-- first), or if either record is already merged or anonymised.
create function booking.admin_merge_children(
  p_keep_child_id uuid,
  p_merge_child_id uuid,
  p_admin_user_id uuid
)
returns integer
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_usable integer;
  v_moved integer;
begin
  perform booking._require_admin(p_admin_user_id);
  if p_keep_child_id is null or p_merge_child_id is null or p_keep_child_id = p_merge_child_id then
    raise exception 'INVALID_CHILD_PAIR';
  end if;

  -- Lock both records, lower ID first.
  select count(*) into v_usable
    from (
      select ch.id
        from booking.children ch
       where ch.id in (p_keep_child_id, p_merge_child_id)
         and ch.merged_into_child_id is null
         and ch.anonymised_at is null
       order by ch.id
         for update
    ) locked;
  if v_usable <> 2 then
    raise exception 'CHILD_NOT_AVAILABLE_FOR_MERGE';
  end if;

  if exists (
    select 1
      from booking.session_allocations m
      join booking.session_allocations k on k.session_id = m.session_id
     where m.child_id = p_merge_child_id
       and k.child_id = p_keep_child_id
       and (k.booking_id = m.booking_id
            or (m.status in ('held', 'confirmed') and k.status in ('held', 'confirmed')))
  ) then
    raise exception 'CHILDREN_SHARE_A_SESSION';
  end if;

  update booking.session_allocations
     set child_id = p_keep_child_id
   where child_id = p_merge_child_id;
  get diagnostics v_moved = row_count;

  update booking.children
     set merged_into_child_id = p_keep_child_id, merged_at = now()
   where id = p_merge_child_id;

  insert into booking.child_duplicate_flags (child_a_id, child_b_id, status, source, decided_by, decided_at)
  values (least(p_keep_child_id, p_merge_child_id), greatest(p_keep_child_id, p_merge_child_id),
          'merged', 'admin', p_admin_user_id, now())
  on conflict (child_a_id, child_b_id) do update
    set status = 'merged', source = 'admin', decided_by = excluded.decided_by, decided_at = excluded.decided_at;

  perform booking.write_audit('child', p_keep_child_id, 'children_merged', 'admin', p_admin_user_id,
    jsonb_build_object('merged_child_id', p_merge_child_id, 'places_moved', v_moved, 'reason', 'child_records_merged'));

  return v_moved;
end;
$$;

-- Splits one record in two because the administrator has decided it stands
-- for two different children (for example identically named siblings booked
-- in separate checkouts). A new record is created with the same details and
-- the listed places are moved to it. Returns the new child's ID.
create function booking.admin_split_child(
  p_child_id uuid,
  p_allocation_ids uuid[],
  p_admin_user_id uuid
)
returns uuid
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_child booking.children%rowtype;
  v_new_id uuid;
  v_wanted integer;
  v_moved integer;
begin
  perform booking._require_admin(p_admin_user_id);

  select * into v_child from booking.children ch where ch.id = p_child_id for update;
  if not found or v_child.merged_into_child_id is not null or v_child.anonymised_at is not null then
    raise exception 'CHILD_NOT_AVAILABLE_FOR_SPLIT';
  end if;

  select count(distinct x) into v_wanted from unnest(p_allocation_ids) as x where x is not null;
  if coalesce(v_wanted, 0) = 0 then
    raise exception 'NO_PLACES_SELECTED';
  end if;

  insert into booking.children (contact_id, first_name, surname, year_group)
  values (v_child.contact_id, v_child.first_name, v_child.surname, v_child.year_group)
  returning id into v_new_id;

  update booking.session_allocations
     set child_id = v_new_id
   where child_id = p_child_id
     and id = any (p_allocation_ids);
  get diagnostics v_moved = row_count;
  if v_moved <> v_wanted then
    -- Some listed place does not belong to this child: undo everything.
    raise exception 'PLACE_NOT_OWNED_BY_CHILD';
  end if;

  insert into booking.child_duplicate_flags (child_a_id, child_b_id, status, source, decided_by, decided_at)
  values (least(p_child_id, v_new_id), greatest(p_child_id, v_new_id), 'distinct', 'admin', p_admin_user_id, now());

  perform booking.write_audit('child', p_child_id, 'child_split', 'admin', p_admin_user_id,
    jsonb_build_object('new_child_id', v_new_id, 'places_moved', v_moved, 'reason', 'child_record_split'));

  return v_new_id;
end;
$$;

-- Personal data ---------------------------------------------------------------
-- Removes the personal details of one contact and their children while
-- keeping the rows, so bookings, places, payments and the audit log still
-- reconcile. Financial records are not deleted.
--
-- This is PSEUDONYMISATION, not anonymisation. The rows keep their IDs, the
-- booking reference and the Stripe payment IDs, and Stripe still holds the
-- payer's email address against those IDs. Someone with access to both this
-- database and the Stripe account could link the records back to a person.
-- (The function and column names say "anonymise" for brevity only.)
--
-- Refused while the contact still has a booking in progress, under review,
-- or a place on a session that has not yet finished. A live place is looked
-- for both through the contact's own bookings and through the contact's own
-- children, so the check still holds after child records have been merged
-- across two families.

create function booking.anonymise_contact(
  p_contact_id uuid,
  p_actor_type text,
  p_actor_id uuid default null
)
returns void
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_anonymised_at timestamptz;
begin
  if p_actor_type = 'admin' then
    perform booking._require_admin(p_actor_id);
  elsif p_actor_type is distinct from 'system' then
    raise exception 'INVALID_ACTOR';
  end if;

  select c.anonymised_at into v_anonymised_at from booking.contacts c where c.id = p_contact_id for update;
  if not found then
    raise exception 'CONTACT_NOT_FOUND';
  end if;
  if v_anonymised_at is not null then
    return;
  end if;

  if exists (select 1 from booking.bookings b
              where b.contact_id = p_contact_id and b.status in ('pending', 'needs_review')) then
    raise exception 'CONTACT_HAS_OPEN_BOOKINGS';
  end if;
  if exists (
    select 1
      from booking.session_allocations a
      join booking.club_sessions s on s.id = a.session_id
     where a.status in ('held', 'confirmed')
       and s.ends_at > now()
       and (a.booking_id in (select b.id from booking.bookings b where b.contact_id = p_contact_id)
            or a.child_id in (select ch.id from booking.children ch where ch.contact_id = p_contact_id))
  ) then
    raise exception 'CONTACT_HAS_UPCOMING_SESSIONS';
  end if;

  update booking.children
     set first_name = 'Removed', surname = 'Removed', year_group = null, anonymised_at = now()
   where contact_id = p_contact_id;

  -- The administrator's free-text notes about this contact's bookings go too.
  update booking.bookings
     set pending_contact = null, admin_note = null
   where contact_id = p_contact_id;

  update booking.contacts
     set email = 'anonymised-' || id::text || '@anonymised.invalid',
         full_name = null, phone = null, emergency_name = null, emergency_phone = null,
         anonymised_at = now()
   where id = p_contact_id;

  perform booking.write_audit('contact', p_contact_id, 'contact_anonymised', p_actor_type, p_actor_id);
end;
$$;

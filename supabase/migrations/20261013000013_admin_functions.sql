-- School clubs booking system: 13 - administrator functions.
--
-- Every function here takes the Supabase Auth user ID that the calling
-- Netlify Function has already verified from the sign-in token, and checks it
-- against booking.admin_users again. None of them issues a refund, emails a
-- parent or exceeds a session's capacity.
--
-- Reasons are fixed codes from booking.reason_codes. Where a sentence is
-- needed it goes in a note column, never in the audit log.
--
-- Venues, clubs and sessions are saved through the admin_save_* functions.
-- Each sets the transaction-local actor so the audit trigger (migration 08)
-- records WHO made the change, in the same transaction as the change.

create function booking.is_admin(p_user_id uuid)
returns boolean
language sql
stable
set search_path = booking, pg_temp
as $$
  select p_user_id is not null
     and exists (select 1 from booking.admin_users a where a.user_id = p_user_id);
$$;

-- Checks the allowlist and records the administrator as the actor for the
-- rest of this transaction.
create function booking._require_admin(p_user_id uuid)
returns void
language plpgsql
set search_path = booking, pg_temp
as $$
begin
  if not booking.is_admin(p_user_id) then
    raise exception 'NOT_AUTHORISED';
  end if;
  perform set_config('booking.actor_id', p_user_id::text, true);
end;
$$;

-- Venues, clubs and sessions ----------------------------------------------------
-- Each takes a JSON object. With no "id" a new record is created; with an
-- "id" only the fields present in the object are changed. The table
-- constraints validate the values.

create function booking.admin_save_venue(p_admin_user_id uuid, p_venue jsonb)
returns uuid
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_id uuid := (p_venue->>'id')::uuid;
begin
  perform booking._require_admin(p_admin_user_id);

  if v_id is null then
    insert into booking.venues (name, address, postcode)
    values (p_venue->>'name', p_venue->>'address', p_venue->>'postcode')
    returning id into v_id;
  else
    update booking.venues
       set name     = case when p_venue ? 'name' then p_venue->>'name' else name end,
           address  = case when p_venue ? 'address' then p_venue->>'address' else address end,
           postcode = case when p_venue ? 'postcode' then p_venue->>'postcode' else postcode end
     where id = v_id;
    if not found then
      raise exception 'VENUE_NOT_FOUND';
    end if;
  end if;
  return v_id;
end;
$$;

-- Saves a club's details. Status is changed only by admin_set_club_status.
create function booking.admin_save_club(p_admin_user_id uuid, p_club jsonb)
returns uuid
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_id uuid := (p_club->>'id')::uuid;
begin
  perform booking._require_admin(p_admin_user_id);

  if v_id is null then
    insert into booking.clubs (
      venue_id, slug, title, description, activity_type, location_detail,
      price_per_session_pence, block_discount_percent, default_capacity, min_children, enrolment_deadline
    ) values (
      (p_club->>'venue_id')::uuid,
      p_club->>'slug',
      p_club->>'title',
      coalesce(p_club->>'description', ''),
      coalesce(p_club->>'activity_type', ''),
      coalesce(p_club->>'location_detail', ''),
      (p_club->>'price_per_session_pence')::integer,
      coalesce((p_club->>'block_discount_percent')::integer, 0),
      (p_club->>'default_capacity')::integer,
      coalesce((p_club->>'min_children')::integer, 8),
      (p_club->>'enrolment_deadline')::timestamptz
    )
    returning id into v_id;
  else
    update booking.clubs
       set venue_id        = case when p_club ? 'venue_id' then (p_club->>'venue_id')::uuid else venue_id end,
           slug            = case when p_club ? 'slug' then p_club->>'slug' else slug end,
           title           = case when p_club ? 'title' then p_club->>'title' else title end,
           description     = case when p_club ? 'description' then coalesce(p_club->>'description', '') else description end,
           activity_type   = case when p_club ? 'activity_type' then coalesce(p_club->>'activity_type', '') else activity_type end,
           location_detail = case when p_club ? 'location_detail' then coalesce(p_club->>'location_detail', '') else location_detail end,
           price_per_session_pence = case when p_club ? 'price_per_session_pence'
                                          then (p_club->>'price_per_session_pence')::integer else price_per_session_pence end,
           block_discount_percent  = case when p_club ? 'block_discount_percent'
                                          then (p_club->>'block_discount_percent')::integer else block_discount_percent end,
           default_capacity        = case when p_club ? 'default_capacity'
                                          then (p_club->>'default_capacity')::integer else default_capacity end,
           min_children            = case when p_club ? 'min_children'
                                          then (p_club->>'min_children')::integer else min_children end,
           enrolment_deadline      = case when p_club ? 'enrolment_deadline'
                                          then (p_club->>'enrolment_deadline')::timestamptz else enrolment_deadline end
     where id = v_id;
    if not found then
      raise exception 'CLUB_NOT_FOUND';
    end if;
  end if;
  return v_id;
end;
$$;

-- Publishes, unpublishes, closes, cancels or returns a club to draft.
-- Changing the status does nothing else: it does not cancel bookings, free
-- places, contact parents or refund anyone.
-- A club with any held or confirmed place cannot be returned to draft
-- (CLUB_HAS_BOOKINGS): use 'unpublished' to hide it, or 'closed' to stop new
-- bookings.
create function booking.admin_set_club_status(p_club_id uuid, p_status text, p_admin_user_id uuid)
returns void
language plpgsql
set search_path = booking, pg_temp
as $$
begin
  perform booking._require_admin(p_admin_user_id);
  if p_status is null or p_status not in ('draft', 'published', 'unpublished', 'closed', 'cancelled') then
    raise exception 'INVALID_CLUB_STATUS';
  end if;

  update booking.clubs
     set status = p_status,
         published_at = case when p_status = 'published' and published_at is null then now() else published_at end
   where id = p_club_id;
  if not found then
    raise exception 'CLUB_NOT_FOUND';
  end if;
end;
$$;

-- Saves one session. A new session takes the club's default capacity unless
-- one is given. Cancelling a session is done by admin_cancel_session.
-- The date or time of a session with any held or confirmed place cannot be
-- changed (SESSION_HAS_BOOKINGS). To move such a session, cancel it with
-- admin_cancel_session and create a new one; contacting the families and any
-- refund are separate steps for the administrator. Capacity and open/closed
-- status can still be changed.
create function booking.admin_save_session(p_admin_user_id uuid, p_session jsonb)
returns uuid
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_id uuid := (p_session->>'id')::uuid;
  v_club_id uuid := (p_session->>'club_id')::uuid;
begin
  perform booking._require_admin(p_admin_user_id);

  if p_session->>'status' = 'cancelled' then
    raise exception 'USE_ADMIN_CANCEL_SESSION';
  end if;

  if v_id is null then
    insert into booking.club_sessions (club_id, starts_at, ends_at, capacity, status)
    select c.id,
           (p_session->>'starts_at')::timestamptz,
           (p_session->>'ends_at')::timestamptz,
           coalesce((p_session->>'capacity')::integer, c.default_capacity),
           coalesce(p_session->>'status', 'open')
      from booking.clubs c
     where c.id = v_club_id
    returning id into v_id;
    if v_id is null then
      raise exception 'CLUB_NOT_FOUND';
    end if;
  else
    update booking.club_sessions
       set starts_at = case when p_session ? 'starts_at' then (p_session->>'starts_at')::timestamptz else starts_at end,
           ends_at   = case when p_session ? 'ends_at' then (p_session->>'ends_at')::timestamptz else ends_at end,
           capacity  = case when p_session ? 'capacity' then (p_session->>'capacity')::integer else capacity end,
           status    = case when p_session ? 'status' then p_session->>'status' else status end
     where id = v_id
       and status <> 'cancelled';
    if not found then
      raise exception 'SESSION_NOT_FOUND_OR_CANCELLED';
    end if;
  end if;
  return v_id;
end;
$$;

-- Records the administrator's decision on a club's minimum-enrolment review.
-- Recording a decision does nothing else: cancelling the club itself, or
-- refunding, are separate deliberate steps.
create function booking.admin_set_club_review(
  p_club_id uuid,
  p_decision text,
  p_admin_user_id uuid,
  p_note text default null
)
returns void
language plpgsql
set search_path = booking, pg_temp
as $$
begin
  perform booking._require_admin(p_admin_user_id);
  if p_decision is null or p_decision not in ('proceed', 'postponed', 'cancelled') then
    raise exception 'INVALID_REVIEW_DECISION';
  end if;

  update booking.clubs
     set review_status = p_decision,
         review_decided_at = now(),
         review_decided_by = p_admin_user_id,
         review_note = p_note
   where id = p_club_id;
  if not found then
    raise exception 'CLUB_NOT_FOUND';
  end if;
end;
$$;

-- Bookings --------------------------------------------------------------------

-- Removes one child's confirmed place on one session.
create function booking.admin_cancel_allocation(
  p_allocation_id uuid,
  p_admin_user_id uuid,
  p_reason_code text default 'cancelled_by_admin'
)
returns void
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_alloc booking.session_allocations%rowtype;
begin
  perform booking._require_admin(p_admin_user_id);
  perform booking._require_reason_code(p_reason_code);

  select * into v_alloc from booking.session_allocations a where a.id = p_allocation_id for update;
  if not found then
    raise exception 'ALLOCATION_NOT_FOUND';
  end if;
  if v_alloc.status <> 'confirmed' then
    raise exception 'ALLOCATION_NOT_CONFIRMED';
  end if;

  update booking.session_allocations
     set status = 'cancelled', ended_at = now(), ended_reason = p_reason_code
   where id = p_allocation_id;

  perform booking.write_audit('allocation', p_allocation_id, 'allocation_cancelled', 'admin', p_admin_user_id,
    jsonb_build_object('booking_id', v_alloc.booking_id, 'session_id', v_alloc.session_id, 'reason', p_reason_code));
end;
$$;

-- Cancels a confirmed or under-review booking and frees its places.
-- The payment record is not touched. p_note is stored on the booking (where
-- anonymisation can clear it), never in the audit log. Any contact details
-- still waiting on the booking are kept, since the administrator may need
-- them to arrange a refund; the retention process removes them later.
create function booking.admin_cancel_booking(
  p_booking_id uuid,
  p_admin_user_id uuid,
  p_reason_code text default 'booking_cancelled_by_admin',
  p_note text default null
)
returns void
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_status text;
begin
  perform booking._require_admin(p_admin_user_id);
  perform booking._require_reason_code(p_reason_code);

  select b.status into v_status from booking.bookings b where b.id = p_booking_id for update;
  if not found then
    raise exception 'BOOKING_NOT_FOUND';
  end if;
  if v_status not in ('confirmed', 'needs_review') then
    -- A pending booking may still be paid; it ends through Stripe, not here.
    raise exception 'BOOKING_NOT_CANCELLABLE';
  end if;

  update booking.session_allocations
     set status = case when status = 'confirmed' then 'cancelled' else 'released' end,
         ended_at = now(),
         ended_reason = p_reason_code
   where booking_id = p_booking_id
     and status in ('held', 'confirmed');

  update booking.bookings
     set status = 'cancelled', ended_at = now(),
         admin_note = coalesce(p_note, admin_note)
   where id = p_booking_id;

  perform booking.write_audit('booking', p_booking_id, 'booking_cancelled', 'admin', p_admin_user_id,
    jsonb_build_object('previous_status', v_status, 'reason', p_reason_code));
end;
$$;

-- Confirms a booking that was set aside for review. Places are given only if
-- they fit within capacity and the club and sessions have not been cancelled;
-- otherwise the administrator must resolve that first and try again.
create function booking.admin_confirm_reviewed_booking(
  p_booking_id uuid,
  p_admin_user_id uuid
)
returns void
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_status text;
  v_failure text;
begin
  perform booking._require_admin(p_admin_user_id);

  select b.status into v_status from booking.bookings b where b.id = p_booking_id for update;
  if not found then
    raise exception 'BOOKING_NOT_FOUND';
  end if;
  if v_status <> 'needs_review' then
    raise exception 'BOOKING_NOT_UNDER_REVIEW';
  end if;

  v_failure := booking._confirm_booking_allocations(p_booking_id);
  if v_failure is not null then
    raise exception 'PLACES_NOT_AVAILABLE' using detail = v_failure;
  end if;

  update booking.bookings
     set status = 'confirmed', confirmed_at = now(), ended_at = null, review_reason = null
   where id = p_booking_id;
  perform booking._apply_pending_contact(p_booking_id);

  perform booking.write_audit('booking', p_booking_id, 'booking_confirmed_after_review', 'admin', p_admin_user_id);
end;
$$;

-- Cancels one session and its confirmed places. Refused while any place on
-- it is still held, because that parent's Checkout may yet be paid.
create function booking.admin_cancel_session(
  p_session_id uuid,
  p_admin_user_id uuid,
  p_reason_code text default 'session_cancelled'
)
returns integer
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_status text;
  v_cancelled integer;
begin
  perform booking._require_admin(p_admin_user_id);
  perform booking._require_reason_code(p_reason_code);

  select s.status into v_status from booking.club_sessions s where s.id = p_session_id for update;
  if not found then
    raise exception 'SESSION_NOT_FOUND';
  end if;
  if v_status = 'cancelled' then
    return 0;
  end if;
  if exists (select 1 from booking.session_allocations a
              where a.session_id = p_session_id and a.status = 'held') then
    raise exception 'SESSION_HAS_PAYMENTS_IN_PROGRESS';
  end if;

  update booking.session_allocations
     set status = 'cancelled', ended_at = now(), ended_reason = p_reason_code
   where session_id = p_session_id
     and status = 'confirmed';
  get diagnostics v_cancelled = row_count;

  -- The audit trigger on club_sessions records this change and its actor.
  update booking.club_sessions set status = 'cancelled' where id = p_session_id;

  perform booking.write_audit('club_session', p_session_id, 'session_places_cancelled', 'admin', p_admin_user_id,
    jsonb_build_object('places_cancelled', v_cancelled, 'reason', p_reason_code));

  return v_cancelled;
end;
$$;

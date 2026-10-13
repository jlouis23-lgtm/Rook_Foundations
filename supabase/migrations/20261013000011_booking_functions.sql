-- School clubs booking system: 11 - reservation, checkout and hold functions.
--
-- These functions are called by Netlify Functions using the service role.
-- Each call is a single database transaction: it either completes in full or
-- leaves nothing behind. Errors are raised with a short machine-readable
-- message (for example SESSION_FULL); the calling function turns that into
-- wording for the parent and must not pass `detail` values to the browser.
--
-- THE BOOKING SEQUENCE the Netlify Function must follow:
--   1. reserve_booking          holds the places
--   2. begin_checkout           records that Stripe is ABOUT to be called and
--                               returns the latest allowed Checkout expiry
--   3. (Stripe) create the Checkout session with
--        client_reference_id = the booking ID
--        expires_at          = checkout_expires_at_unix (a whole number of
--                              seconds, as Stripe requires; no rounding needed)
--        Idempotency-Key     = stripe_idempotency_key
--      The idempotency key means that if the call times out and is repeated,
--      Stripe returns the SAME Checkout session and never creates a second.
--   4. attach_checkout_session  records the Stripe session ID
--   5. only now give the parent the Checkout address
-- If step 3 fails with a definite error from Stripe, call fail_booking.
-- If step 3 or 4 is uncertain (a timeout, a crash), do nothing: the places
-- stay held until the Checkout deadline has safely passed, and any payment
-- is still matched to the booking by its ID.
--
-- LOCK ORDER, the same in every function, so they cannot deadlock each other:
--   booking row  ->  payment row  ->  session rows (in ID order)

-- Internal helpers ------------------------------------------------------------

create function booking._environment_matches(p_livemode boolean)
returns boolean
language sql
stable
set search_path = booking, pg_temp
as $$
  select (cfg.environment = 'production') = coalesce(p_livemode, false)
    from booking.app_config cfg;
$$;

create function booking._booking_summary(p_booking_id uuid)
returns jsonb
language sql
stable
set search_path = booking, pg_temp
as $$
  select jsonb_build_object(
    'booking_id', b.id,
    'reference', b.reference,
    'status', b.status,
    'booking_type', b.booking_type,
    'club_id', b.club_id,
    'child_count', b.child_count,
    'session_count', b.session_count,
    'unit_price_pence', b.unit_price_pence,
    'discount_percent_applied', b.discount_percent_applied,
    'subtotal_pence', b.subtotal_pence,
    'discount_pence', b.discount_pence,
    'total_pence', b.total_pence,
    'hold_expires_at', b.hold_expires_at,
    'checkout_started', b.checkout_started_at is not null,
    'checkout_deadline_at', b.checkout_deadline_at,
    -- The same deadline as whole seconds since 1970, ready for Stripe's expires_at.
    'checkout_expires_at_unix', extract(epoch from b.checkout_deadline_at)::bigint,
    -- Send this as the Idempotency-Key when creating the Stripe Checkout.
    'stripe_idempotency_key', 'rook-club-checkout-' || b.id::text,
    -- Where this booking stands with Checkout:
    --   not_started      reserved; begin_checkout may be called
    --   hold_expired     reserved, but the short hold ran out before Checkout
    --                    was started; begin_checkout will refuse
    --   open             Checkout started and its deadline has not passed
    --   deadline_passed  Checkout was started but its time has run out. The
    --                    booking is NOT released here: a payment may have
    --                    succeeded and still be on its way.
    --   ended            no longer pending (confirmed, under review, expired,
    --                    failed or cancelled)
    'checkout_state', case
      when b.status <> 'pending' then 'ended'
      when b.checkout_started_at is null and b.hold_expires_at <= now() then 'hold_expired'
      when b.checkout_started_at is null then 'not_started'
      when b.checkout_deadline_at <= now() then 'deadline_passed'
      else 'open'
    end,
    -- True only for 'not_started' and 'open'. When false the caller must not
    -- send the parent to Stripe: there is either nothing to pay for or the
    -- payment session has expired. A replayed request key can return such a
    -- booking.
    'can_proceed_to_checkout',
      b.status = 'pending'
      and (   (b.checkout_started_at is null and b.hold_expires_at > now())
           or (b.checkout_started_at is not null and b.checkout_deadline_at > now()))
  )
  from booking.bookings b
  where b.id = p_booking_id;
$$;

-- One candidate booking reference: RC- followed by 12 characters from an
-- alphabet with no easily confused letters or digits (about 10^18 values).
create function booking._reference_candidate()
returns text
language sql
volatile
set search_path = booking, pg_temp
as $$
  select 'RC-' || string_agg(substr('ABCDEFGHJKMNPQRSTUVWXYZ23456789', 1 + floor(random() * 31)::integer, 1), '')
    from generate_series(1, 12);
$$;

-- A reference that is not already in use. Tries again on a collision.
create function booking._new_booking_reference()
returns text
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_reference text;
  v_attempt integer;
begin
  for v_attempt in 1..10 loop
    v_reference := booking._reference_candidate();
    if not exists (select 1 from booking.bookings b where b.reference = v_reference) then
      return v_reference;
    end if;
  end loop;
  raise exception 'REFERENCE_GENERATION_FAILED';
end;
$$;

-- Records that the administrator needs to be told something about a booking.
-- Each alert is its own row, so a new alert never replaces one that has not
-- been sent. If the same alert is already waiting to be sent for this
-- booking, nothing is added. The email itself is sent later by a Netlify
-- Function (see outstanding_messages).
create function booking._raise_admin_alert(p_booking_id uuid, p_code text)
returns void
language plpgsql
set search_path = booking, pg_temp
as $$
begin
  perform booking._require_reason_code(p_code);
  insert into booking.admin_alerts (alert_code, booking_id)
  values (p_code, p_booking_id)
  on conflict (booking_id, alert_code) where sent_at is null and booking_id is not null
  do nothing;
end;
$$;

-- The same, for an alert about a Stripe event that could not be tied to a booking.
create function booking._raise_event_alert(p_stripe_event_id text, p_code text)
returns void
language plpgsql
set search_path = booking, pg_temp
as $$
begin
  perform booking._require_reason_code(p_code);
  insert into booking.admin_alerts (alert_code, stripe_event_id)
  values (p_code, p_stripe_event_id)
  on conflict (stripe_event_id, alert_code) where stripe_event_id is not null
  do nothing;
end;
$$;

-- The same, for an alert about a club.
create function booking._raise_club_alert(p_club_id uuid, p_code text)
returns void
language plpgsql
set search_path = booking, pg_temp
as $$
begin
  perform booking._require_reason_code(p_code);
  insert into booking.admin_alerts (alert_code, club_id)
  values (p_code, p_club_id)
  on conflict (club_id, alert_code) where sent_at is null and club_id is not null
  do nothing;
end;
$$;

-- Ends an unpaid booking and frees its held places. Only ever called from a
-- step that has established the booking can no longer be paid.
--
-- What the parent typed (pending_contact) is cleared here ONLY if Checkout
-- was never started, because then no payment can ever arrive. If Checkout was
-- started, a late payment could still confirm this booking, and the name,
-- phone number and emergency contact would be needed; they are kept and
-- removed later by the retention process.
create function booking._release_booking(
  p_booking_id uuid,
  p_new_status text,
  p_reason_code text,
  p_actor_type text,
  p_actor_id uuid default null
)
returns void
language plpgsql
set search_path = booking, pg_temp
as $$
begin
  perform booking._require_reason_code(p_reason_code);

  update booking.session_allocations
     set status = 'released', ended_at = now(), ended_reason = p_reason_code
   where booking_id = p_booking_id
     and status = 'held';

  update booking.bookings
     set status = p_new_status,
         ended_at = now(),
         pending_contact = case when checkout_started_at is null then null else pending_contact end
   where id = p_booking_id;

  perform booking.write_audit('booking', p_booking_id, 'booking_' || p_new_status, p_actor_type, p_actor_id,
    jsonb_build_object('reason', p_reason_code));
end;
$$;

-- Copies the details the parent typed onto their contact record. Called only
-- when a booking is confirmed.
create function booking._apply_pending_contact(p_booking_id uuid)
returns void
language plpgsql
set search_path = booking, pg_temp
as $$
begin
  update booking.contacts c
     set full_name       = coalesce(nullif(btrim(b.pending_contact->>'full_name'), ''), c.full_name),
         phone           = coalesce(nullif(btrim(b.pending_contact->>'phone'), ''), c.phone),
         emergency_name  = coalesce(nullif(btrim(b.pending_contact->>'emergency_name'), ''), c.emergency_name),
         emergency_phone = coalesce(nullif(btrim(b.pending_contact->>'emergency_phone'), ''), c.emergency_phone)
    from booking.bookings b
   where b.id = p_booking_id
     and c.id = b.contact_id
     and b.pending_contact is not null
     and c.anonymised_at is null;

  update booking.bookings set pending_contact = null where id = p_booking_id;
end;
$$;

-- Turns a booking's places into confirmed places, or changes nothing.
-- Returns NULL when every place was confirmed. Otherwise returns the reason
-- code explaining why the booking cannot safely be confirmed, having changed
-- nothing:
--   paid_for_cancelled_club_or_session  the club or one of the sessions has
--                                       been cancelled (held places included)
--   paid_child_already_placed           a released place's child now has a
--                                       live place on that session another way
--   paid_after_hold_ended_no_capacity   a released place no longer fits
-- The caller must already hold the booking row lock.
create function booking._confirm_booking_allocations(p_booking_id uuid)
returns text
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_session_ids uuid[];
begin
  perform booking._require_read_committed();

  select array_agg(distinct a.session_id order by a.session_id) into v_session_ids
    from booking.session_allocations a
   where a.booking_id = p_booking_id
     and a.status in ('held', 'released');

  if v_session_ids is null then
    return 'paid_after_hold_ended_no_capacity';
  end if;

  -- Session rows are always locked in ID order.
  perform 1 from booking.club_sessions s
    where s.id = any (v_session_ids)
    order by s.id
      for update;

  -- A cancelled club or session is never confirmed into, even from a hold.
  if exists (
    select 1
      from booking.session_allocations a
      join booking.club_sessions s on s.id = a.session_id
      join booking.clubs c on c.id = s.club_id
     where a.booking_id = p_booking_id
       and a.status in ('held', 'released')
       and (s.status = 'cancelled' or c.status = 'cancelled')
  ) then
    return 'paid_for_cancelled_club_or_session';
  end if;

  if exists (select 1 from booking.session_allocations a
              where a.booking_id = p_booking_id and a.status = 'released') then
    if exists (
      select 1
        from booking.session_allocations mine
        join booking.session_allocations other
          on other.child_id = mine.child_id
         and other.session_id = mine.session_id
         and other.id <> mine.id
         and other.status in ('held', 'confirmed')
       where mine.booking_id = p_booking_id
         and mine.status = 'released'
    ) then
      return 'paid_child_already_placed';
    end if;

    if exists (
      select 1
        from booking.club_sessions s
        join (
          select a.session_id, count(*) as needed
            from booking.session_allocations a
           where a.booking_id = p_booking_id and a.status = 'released'
           group by a.session_id
        ) n on n.session_id = s.id
       where (select count(*) from booking.session_allocations t
               where t.session_id = s.id and t.status in ('held', 'confirmed')) + n.needed > s.capacity
    ) then
      return 'paid_after_hold_ended_no_capacity';
    end if;
  end if;

  update booking.session_allocations
     set status = 'confirmed', confirmed_at = now(), ended_at = null, ended_reason = null
   where booking_id = p_booking_id
     and status in ('held', 'released');

  return null;
end;
$$;

-- reserve_booking -------------------------------------------------------------
-- Reserves a place for every child on every requested session, or reserves
-- nothing. Prices, eligibility and capacity are all decided here from the
-- database's own records; nothing the browser sends about price is used.
--
-- p_contact : { "email", "full_name", "phone", "emergency_name", "emergency_phone" }
-- p_children: [ { "first_name", "surname", "year_group" }, ... ]

create function booking.reserve_booking(
  p_request_key uuid,
  p_club_id uuid,
  p_booking_type text,
  p_session_ids uuid[],
  p_contact jsonb,
  p_children jsonb,
  p_terms_accepted boolean
)
returns jsonb
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_cfg booking.app_config%rowtype;
  v_existing_id uuid;
  v_club booking.clubs%rowtype;
  v_session_ids uuid[];
  v_session_count integer;
  v_locked_count integer;
  v_email text;
  v_contact_id uuid;
  v_pending booking.bookings%rowtype;
  v_child jsonb;
  v_first text;
  v_surname text;
  v_year text;
  v_child_id uuid;
  v_child_ids uuid[] := '{}';
  v_child_count integer;
  v_full_session uuid;
  v_discount_percent integer := 0;
  v_unit integer;
  v_places integer;
  v_subtotal integer;
  v_total integer;
  v_booking_id uuid;
begin
  if p_request_key is null then
    raise exception 'REQUEST_KEY_REQUIRED';
  end if;

  -- A double-click or retry with the same key waits here, then gets the
  -- booking the first request made.
  perform pg_advisory_xact_lock(hashtextextended('booking.reserve:' || p_request_key::text, 0));

  select b.id into v_existing_id from booking.bookings b where b.request_key = p_request_key;
  if found then
    return booking._booking_summary(v_existing_id) || jsonb_build_object('replayed', true);
  end if;

  perform booking._require_read_committed();
  select * into v_cfg from booking.app_config;

  -- 1. Validate the request ----------------------------------------------------
  if p_terms_accepted is not true then
    raise exception 'TERMS_NOT_ACCEPTED';
  end if;
  if p_booking_type is null or p_booking_type not in ('block', 'individual') then
    raise exception 'INVALID_BOOKING_TYPE';
  end if;

  select array_agg(distinct x order by x), count(distinct x)
    into v_session_ids, v_session_count
    from unnest(p_session_ids) as x
   where x is not null;
  if coalesce(v_session_count, 0) = 0 then
    raise exception 'NO_SESSIONS_SELECTED';
  end if;

  v_email := lower(btrim(coalesce(p_contact->>'email', '')));
  if length(v_email) > 254 or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'INVALID_EMAIL';
  end if;
  if length(btrim(coalesce(p_contact->>'full_name', ''))) not between 1 and 120
     or length(btrim(coalesce(p_contact->>'phone', ''))) not between 7 and 30
     or length(btrim(coalesce(p_contact->>'emergency_name', ''))) not between 1 and 120
     or length(btrim(coalesce(p_contact->>'emergency_phone', ''))) not between 7 and 30 then
    raise exception 'INVALID_CONTACT_DETAILS';
  end if;

  if p_children is null or jsonb_typeof(p_children) <> 'array' then
    raise exception 'INVALID_CHILDREN';
  end if;
  v_child_count := jsonb_array_length(p_children);
  if v_child_count < 1 or v_child_count > v_cfg.max_children_per_booking then
    raise exception 'INVALID_CHILD_COUNT';
  end if;

  select * into v_club from booking.clubs c where c.id = p_club_id for share;
  if not found then
    raise exception 'CLUB_NOT_FOUND';
  end if;
  if v_club.status <> 'published' then
    raise exception 'CLUB_NOT_BOOKABLE';
  end if;

  -- 2. Contact -----------------------------------------------------------------
  -- An existing contact is found by email and left exactly as it is.
  insert into booking.contacts (email) values (v_email)
  on conflict (email) do nothing;
  select c.id into v_contact_id from booking.contacts c where c.email = v_email;

  -- 3. An earlier unpaid booking by this contact for this club -------------------
  -- Looked at BEFORE any session is locked (booking first, sessions second).
  select * into v_pending
    from booking.bookings b
   where b.club_id = p_club_id and b.contact_id = v_contact_id and b.status = 'pending'
     for update;
  if found then
    if v_pending.checkout_started_at is null then
      -- Checkout was never started: Stripe has not been called for it, so
      -- there is nothing that could be paid. (If its request is still in
      -- flight, its begin_checkout will now be refused before Stripe is called.)
      perform booking._release_booking(v_pending.id, 'expired', 'superseded_by_new_request', 'system');
    elsif v_pending.hold_expires_at < now()
          and not exists (select 1 from booking.payments p where p.booking_id = v_pending.id) then
      -- Checkout was started but never recorded, and its hold has run out.
      -- This is exactly the case release_unattached_holds releases: any
      -- Checkout had to expire by checkout_deadline_at, at least ten minutes
      -- before the hold ended, so it can no longer be paid. Releasing it here
      -- means the parent is not kept waiting for the scheduled job. (If a
      -- payment did somehow arrive, it would still be matched by booking ID.)
      perform booking._release_booking(v_pending.id, 'expired', 'checkout_never_attached', 'system');
    elsif v_pending.checkout_deadline_at <= now() then
      -- The earlier Checkout's time has run out, so the parent must NOT be
      -- sent back to it. But it is not yet safe to release: a payment may
      -- have succeeded and still be on its way, and Stripe has not yet
      -- confirmed the session expired (or, if it was never recorded, the
      -- safety margin has not yet passed). Nothing is changed. The caller
      -- tells the parent their earlier payment session timed out: if they
      -- paid they will be sent a confirmation, otherwise they can try again
      -- in a few minutes.
      raise exception 'PREVIOUS_CHECKOUT_CLOSING' using detail = v_pending.id::text;
    else
      -- A Stripe Checkout that can still be paid may exist. It is never
      -- released or replaced here. The caller sends the parent back to it.
      raise exception 'PENDING_BOOKING_EXISTS' using detail = v_pending.id::text;
    end if;
  end if;

  -- 4. Lock the sessions, always in the same order -----------------------------
  -- A second request for any of these sessions waits here until this one has
  -- finished, so two parents can never both be given the final place.
  select count(*) into v_locked_count
    from (
      select s.id
        from booking.club_sessions s
       where s.club_id = p_club_id
         and s.id = any (v_session_ids)
       order by s.id
         for update
    ) locked;
  if v_locked_count <> v_session_count then
    raise exception 'SESSION_NOT_IN_CLUB';
  end if;

  if exists (
    select 1 from booking.club_sessions s
     where s.id = any (v_session_ids)
       and (s.status <> 'open' or s.starts_at <= now())
  ) then
    raise exception 'SESSION_NOT_BOOKABLE';
  end if;

  -- 5. Block rules -------------------------------------------------------------
  if p_booking_type = 'block' then
    -- Once any session has started, the discounted block is no longer sold.
    if exists (
      select 1 from booking.club_sessions s
       where s.club_id = p_club_id and s.status <> 'cancelled' and s.starts_at <= now()
    ) then
      raise exception 'BLOCK_NOT_AVAILABLE_CLUB_STARTED';
    end if;
    -- A block is every session of the club, with none left out.
    if exists (
      select 1 from booking.club_sessions s
       where s.club_id = p_club_id and s.status <> 'cancelled' and s.id <> all (v_session_ids)
    ) then
      raise exception 'BLOCK_MUST_INCLUDE_ALL_SESSIONS';
    end if;
    v_discount_percent := v_club.block_discount_percent;
  end if;

  -- 6. Children ----------------------------------------------------------------
  -- Each child in the request becomes (or is matched to) its own record.
  -- A record is reused only when it belongs to this contact AND first name,
  -- surname and year group all match AND it has not been merged away AND it
  -- has not already been used for another child in this same request. Two
  -- identical entries therefore always end up as two different children.
  for v_child in select value from jsonb_array_elements(p_children)
  loop
    v_first := btrim(coalesce(v_child->>'first_name', ''));
    v_surname := btrim(coalesce(v_child->>'surname', ''));
    v_year := btrim(coalesce(v_child->>'year_group', ''));
    if length(v_first) not between 1 and 60
       or length(v_surname) not between 1 and 60
       or length(v_year) not between 1 and 20 then
      raise exception 'INVALID_CHILD_DETAILS';
    end if;

    select ch.id into v_child_id
      from booking.children ch
     where ch.contact_id = v_contact_id
       and ch.anonymised_at is null
       and ch.merged_into_child_id is null
       and lower(ch.first_name) = lower(v_first)
       and lower(ch.surname) = lower(v_surname)
       and lower(ch.year_group) = lower(v_year)
       and ch.id <> all (v_child_ids)
     order by ch.created_at, ch.id
     limit 1;

    if not found then
      insert into booking.children (contact_id, first_name, surname, year_group)
      values (v_contact_id, v_first, v_surname, v_year)
      returning id into v_child_id;
    end if;

    v_child_ids := v_child_ids || v_child_id;
  end loop;

  -- Children entered together in one request with the same name are, by the
  -- parent's own action, different children. Record that, so the pair is not
  -- later presented as a possible duplicate.
  insert into booking.child_duplicate_flags (child_a_id, child_b_id, status, source, decided_at)
  select least(a.id, b.id), greatest(a.id, b.id), 'distinct', 'system', now()
    from booking.children a
    join booking.children b
      on a.id < b.id
     and lower(btrim(a.first_name)) = lower(btrim(b.first_name))
     and lower(btrim(a.surname)) = lower(btrim(b.surname))
   where a.id = any (v_child_ids)
     and b.id = any (v_child_ids)
  on conflict (child_a_id, child_b_id) do nothing;

  -- 7. No child may have two live places on one session ------------------------
  if exists (
    select 1 from booking.session_allocations a
     where a.child_id = any (v_child_ids)
       and a.session_id = any (v_session_ids)
       and a.status in ('held', 'confirmed')
  ) then
    raise exception 'CHILD_ALREADY_BOOKED';
  end if;

  -- 8. Capacity: every session must have room for every child ------------------
  select s.id into v_full_session
    from booking.club_sessions s
   where s.id = any (v_session_ids)
     and (select count(*) from booking.session_allocations a
           where a.session_id = s.id and a.status in ('held', 'confirmed')) + v_child_count > s.capacity
   order by s.starts_at
   limit 1;
  if found then
    raise exception 'SESSION_FULL' using detail = v_full_session::text;
  end if;

  -- 9. Price, from the club's own record ---------------------------------------
  -- The discount is applied to each place and rounded to a whole penny, and
  -- the total is the sum of the places, so the two always agree.
  v_unit := (v_club.price_per_session_pence * (100 - v_discount_percent) + 50) / 100;
  v_places := v_child_count * v_session_count;
  v_subtotal := v_club.price_per_session_pence * v_places;
  v_total := v_unit * v_places;

  -- 10. Write the booking and its held places ----------------------------------
  -- Checkout has not been started, so the hold is the short one.
  insert into booking.bookings (
    reference, request_key, club_id, contact_id, booking_type, status, hold_expires_at,
    child_count, session_count, unit_price_pence, discount_percent_applied,
    subtotal_pence, discount_pence, total_pence, pending_contact, terms_accepted_at
  ) values (
    booking._new_booking_reference(),
    p_request_key, p_club_id, v_contact_id, p_booking_type, 'pending',
    now() + make_interval(mins => v_cfg.unattached_hold_minutes),
    v_child_count, v_session_count, v_unit, v_discount_percent,
    v_subtotal, v_subtotal - v_total, v_total,
    jsonb_build_object(
      'full_name', btrim(p_contact->>'full_name'),
      'phone', btrim(p_contact->>'phone'),
      'emergency_name', btrim(p_contact->>'emergency_name'),
      'emergency_phone', btrim(p_contact->>'emergency_phone')
    ),
    now()
  )
  returning id into v_booking_id;

  insert into booking.session_allocations (booking_id, child_id, session_id, status, unit_price_pence)
  select v_booking_id, c.child_id, s.session_id, 'held', v_unit
    from unnest(v_child_ids) as c (child_id)
   cross join unnest(v_session_ids) as s (session_id);

  perform booking.write_audit('booking', v_booking_id, 'booking_reserved', 'parent', null,
    jsonb_build_object(
      'booking_type', p_booking_type,
      'child_count', v_child_count,
      'session_count', v_session_count,
      'total_pence', v_total
    ));

  return booking._booking_summary(v_booking_id) || jsonb_build_object('replayed', false);
end;
$$;

-- begin_checkout --------------------------------------------------------------
-- Must be called BEFORE Stripe is asked to create the Checkout. It records
-- that a payable Checkout may now exist, sets the latest moment that Checkout
-- may expire, and extends the hold to outlast it. From here the places are
-- not released until that deadline has passed or Stripe has confirmed the
-- Checkout expired.
--
-- The deadline is always counted from this call, so however long ago the
-- places were reserved, Stripe is given its full minimum Checkout time. It is
-- stored as a whole number of seconds, because that is what Stripe accepts:
-- the caller passes checkout_expires_at_unix straight through, with no
-- rounding that could push it past the deadline.
--
-- If Checkout was already started for this booking, nothing changes and
-- `replayed` is true. The caller must then look at can_proceed_to_checkout:
--   true   (checkout_state 'open') it may repeat the Stripe call, ONLY with
--          the same stripe_idempotency_key and the same
--          checkout_expires_at_unix; Stripe returns the original session.
--   false  (checkout_state 'deadline_passed') the payment session has run
--          out. It must not call Stripe or send the parent anywhere; it tells
--          them the session timed out and to try again shortly.
-- It must never create a new Checkout for a booking that already started one.

create function booking.begin_checkout(p_booking_id uuid)
returns jsonb
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_cfg booking.app_config%rowtype;
  v_booking booking.bookings%rowtype;
begin
  select * into v_booking from booking.bookings b where b.id = p_booking_id for update;
  if not found then
    raise exception 'BOOKING_NOT_FOUND';
  end if;
  if v_booking.status <> 'pending' then
    raise exception 'BOOKING_NOT_PENDING';
  end if;
  if v_booking.checkout_started_at is not null then
    return booking._booking_summary(p_booking_id) || jsonb_build_object('replayed', true);
  end if;
  if v_booking.hold_expires_at <= now() then
    -- The short hold ran out before Checkout was started. The places may be
    -- released at any moment, so Stripe must not be called for this booking.
    raise exception 'HOLD_EXPIRED';
  end if;

  select * into v_cfg from booking.app_config;

  update booking.bookings
     set checkout_started_at = now(),
         checkout_deadline_at = date_trunc('second', now() + make_interval(mins => v_cfg.checkout_minutes)),
         hold_expires_at = now() + make_interval(mins => v_cfg.hold_minutes)
   where id = p_booking_id;

  perform booking.write_audit('booking', p_booking_id, 'checkout_started', 'system');

  return booking._booking_summary(p_booking_id) || jsonb_build_object('replayed', false);
end;
$$;

-- attach_checkout_session -----------------------------------------------------
-- Records the Stripe Checkout session created for a booking. Refuses if the
-- amount differs from the booking total, if test/live does not match this
-- database, or if the Checkout could stay open beyond the booking's deadline.
-- If the payment has already been recorded for this session (the webhook
-- arrived first), it simply reports that.

create function booking.attach_checkout_session(
  p_booking_id uuid,
  p_stripe_checkout_session_id text,
  p_amount_pence integer,
  p_livemode boolean,
  p_checkout_expires_at timestamptz
)
returns jsonb
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_booking booking.bookings%rowtype;
  v_payment booking.payments%rowtype;
begin
  select * into v_booking from booking.bookings b where b.id = p_booking_id for update;
  if not found then
    raise exception 'BOOKING_NOT_FOUND';
  end if;

  select * into v_payment
    from booking.payments p
   where p.stripe_checkout_session_id = p_stripe_checkout_session_id;
  if found then
    if v_payment.booking_id <> p_booking_id then
      raise exception 'CHECKOUT_BELONGS_TO_ANOTHER_BOOKING';
    end if;
    return jsonb_build_object('payment_id', v_payment.id, 'replayed', true, 'payment_status', v_payment.status);
  end if;

  if exists (select 1 from booking.payments p where p.booking_id = p_booking_id) then
    raise exception 'CHECKOUT_ALREADY_ATTACHED';
  end if;
  if v_booking.status <> 'pending' then
    raise exception 'BOOKING_NOT_PENDING';
  end if;
  if v_booking.checkout_started_at is null then
    raise exception 'CHECKOUT_NOT_STARTED';
  end if;
  if not booking._environment_matches(p_livemode) then
    raise exception 'ENVIRONMENT_MISMATCH';
  end if;
  if p_amount_pence is distinct from v_booking.total_pence then
    raise exception 'AMOUNT_MISMATCH';
  end if;
  if p_checkout_expires_at is null
     or p_checkout_expires_at <= now()
     or p_checkout_expires_at > v_booking.checkout_deadline_at then
    raise exception 'CHECKOUT_EXPIRY_AFTER_DEADLINE';
  end if;

  insert into booking.payments (
    booking_id, stripe_checkout_session_id, amount_pence, status, livemode, checkout_expires_at
  ) values (
    p_booking_id, p_stripe_checkout_session_id, p_amount_pence, 'created', p_livemode, p_checkout_expires_at
  )
  returning * into v_payment;

  perform booking.write_audit('payment', v_payment.id, 'checkout_attached', 'system', null,
    jsonb_build_object('booking_id', p_booking_id, 'amount_pence', p_amount_pence, 'livemode', p_livemode));

  return jsonb_build_object('payment_id', v_payment.id, 'replayed', false, 'payment_status', v_payment.status);
end;
$$;

-- fail_booking ----------------------------------------------------------------
-- For when Stripe answered with a definite error and NO Checkout was created:
-- the places are freed at once. It must not be called after a timeout or any
-- other uncertain result. (If it ever is called wrongly and a payment arrives,
-- the payment is still matched to the booking and handled as a late payment.)

create function booking.fail_booking(p_booking_id uuid, p_reason_code text default 'checkout_not_created')
returns void
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_status text;
begin
  perform booking._require_reason_code(p_reason_code);

  select b.status into v_status from booking.bookings b where b.id = p_booking_id for update;
  if not found then
    raise exception 'BOOKING_NOT_FOUND';
  end if;
  if v_status = 'failed' then
    return;
  end if;
  if v_status <> 'pending' then
    raise exception 'BOOKING_NOT_PENDING';
  end if;
  if exists (select 1 from booking.payments p where p.booking_id = p_booking_id) then
    raise exception 'CHECKOUT_ALREADY_ATTACHED';
  end if;
  perform booking._release_booking(p_booking_id, 'failed', p_reason_code, 'system');
end;
$$;

-- release_unattached_holds ----------------------------------------------------
-- Frees the places of unpaid bookings that have no recorded Stripe Checkout
-- and whose hold time has passed. Two cases, both safe on time alone:
--   * Checkout never started: Stripe was never called. The hold was the short
--     one (unattached_hold_minutes).
--   * Checkout started but never recorded: a Checkout may have been created,
--     but its expiry cannot be later than checkout_deadline_at, and the hold
--     runs at least ten minutes beyond that. By now it cannot be paid.
-- A booking WITH a recorded Checkout is never released here, whatever the time.
-- Returns how many bookings were released.

create function booking.release_unattached_holds()
returns integer
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_row record;
  v_count integer := 0;
begin
  for v_row in
    select b.id, b.checkout_started_at
      from booking.bookings b
     where b.status = 'pending'
       and b.hold_expires_at < now()
       and not exists (select 1 from booking.payments p where p.booking_id = b.id)
     order by b.id
       for update of b skip locked
  loop
    perform booking._release_booking(v_row.id, 'expired',
      case when v_row.checkout_started_at is null
           then 'hold_lapsed_before_checkout'
           else 'checkout_never_attached' end,
      'system');
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

-- expire_booking_after_stripe_check -------------------------------------------
-- For the scheduled reconciliation job. To be called ONLY after the job has
-- asked Stripe about the Checkout session and Stripe has answered that it is
-- expired and unpaid. (The normal route is the checkout.session.expired
-- webhook; this covers a webhook that never arrived.)

create function booking.expire_booking_after_stripe_check(p_booking_id uuid)
returns void
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_status text;
begin
  select b.status into v_status from booking.bookings b where b.id = p_booking_id for update;
  if not found then
    raise exception 'BOOKING_NOT_FOUND';
  end if;
  if v_status <> 'pending' then
    return;
  end if;

  update booking.payments
     set status = 'expired'
   where booking_id = p_booking_id and status = 'created';

  perform booking._release_booking(p_booking_id, 'expired', 'checkout_expired_verified', 'system');
end;
$$;

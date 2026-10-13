-- School clubs booking system: 06 - bookings and session allocations.

-- bookings --------------------------------------------------------------------
-- One checkout by one contact for one club (any number of children).
-- status:
--   pending       places held, waiting for payment
--   confirmed     paid and every place secured
--   expired       ended unpaid
--   failed        Stripe could not create the Checkout
--   needs_review  money received but the booking could not be confirmed
--                 automatically; the administrator decides what happens
--   cancelled     cancelled by the administrator
--
-- The link between a booking and its Stripe Checkout has three stages:
--   1. reserved            checkout_started_at is null. No call to Stripe has
--                          been made, so nothing can be paid.
--   2. checkout started    checkout_started_at is set BEFORE Stripe is asked
--                          to create the Checkout. From here on a payable
--                          Checkout may exist, whether or not the database
--                          has been told about it yet.
--   3. checkout attached   a payments row records the Stripe session ID.
-- The booking ID is sent to Stripe with the Checkout, so a payment can always
-- be matched to its booking even if stage 3 never happened.

create table booking.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null,
  -- Sent by the server for each form submission so a double-click or retry
  -- returns the same booking instead of creating a second one.
  request_key uuid not null,
  club_id uuid not null references booking.clubs (id) on delete restrict,
  contact_id uuid not null references booking.contacts (id) on delete restrict,
  booking_type text not null,
  status text not null default 'pending',
  review_reason text references booking.reason_codes (code),
  hold_expires_at timestamptz not null,
  checkout_started_at timestamptz,
  -- The latest moment the Stripe Checkout may be set to expire.
  checkout_deadline_at timestamptz,
  -- Price snapshot taken when the places were reserved.
  child_count integer not null,
  session_count integer not null,
  unit_price_pence integer not null,
  discount_percent_applied integer not null default 0,
  subtotal_pence integer not null,
  discount_pence integer not null default 0,
  total_pence integer not null,
  -- What the parent typed (name, phone, emergency contact). Copied to
  -- `contacts` on confirmed payment, then cleared. If the booking ends unpaid
  -- AFTER Checkout was started it is KEPT, because a late payment could still
  -- confirm the booking and the details would be needed; it is then cleared
  -- only by the retention process (purge_stale_pending_contacts or
  -- anonymise_contact). If Checkout was never started it is cleared at once.
  pending_contact jsonb,
  terms_accepted_at timestamptz not null,
  confirmed_at timestamptz,
  ended_at timestamptz,
  -- Emails are sent by Netlify Functions, never by SQL. This column records
  -- whether the parent's confirmation has been sent, so a retry can find one
  -- that was missed. Alerts for the administrator are rows in admin_alerts.
  confirmation_email_sent_at timestamptz,
  -- Free text for the administrator. Cleared by anonymise_contact.
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_reference_unique unique (reference),
  constraint bookings_request_key_unique unique (request_key),
  constraint bookings_type check (booking_type in ('block', 'individual')),
  constraint bookings_status check (status in ('pending', 'confirmed', 'expired', 'failed', 'needs_review', 'cancelled')),
  constraint bookings_counts_positive check (child_count > 0 and session_count > 0),
  constraint bookings_discount_range check (discount_percent_applied between 0 and 99),
  constraint bookings_amounts check (
    unit_price_pence > 0
    and subtotal_pence > 0
    and discount_pence >= 0
    and total_pence > 0
    and subtotal_pence - discount_pence = total_pence
  ),
  constraint bookings_individual_has_no_discount check (booking_type = 'block' or discount_pence = 0),
  constraint bookings_checkout_fields_together check ((checkout_started_at is null) = (checkout_deadline_at is null)),
  constraint bookings_admin_note_length check (coalesce(length(admin_note), 0) <= 2000)
);

-- A contact can have only one unpaid booking in progress per club.
create unique index bookings_one_pending_per_contact_club
  on booking.bookings (club_id, contact_id)
  where status = 'pending';

create index bookings_contact_id_idx on booking.bookings (contact_id);
create index bookings_club_id_status_idx on booking.bookings (club_id, status);
create index bookings_pending_hold_idx on booking.bookings (hold_expires_at) where status = 'pending';

create trigger bookings_set_updated_at
  before update on booking.bookings
  for each row execute function booking.set_updated_at();

-- session_allocations ---------------------------------------------------------
-- One child's place on one session. This is the ONLY place capacity is
-- counted from. Block and individual bookings both write these rows, so they
-- cannot disagree about how full a session is.
-- status:
--   held       reserved while the parent pays; counts towards capacity
--   confirmed  paid; counts towards capacity and towards enrolment
--   released   the hold ended without payment; does not count
--   cancelled  was confirmed, later removed by the administrator; does not count
-- A held place is never freed while a Stripe Checkout for it could still be
-- paid (see the functions and documentation).

create table booking.session_allocations (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references booking.bookings (id) on delete restrict,
  child_id uuid not null references booking.children (id) on delete restrict,
  session_id uuid not null references booking.club_sessions (id) on delete restrict,
  status text not null default 'held',
  -- What this place cost, after any block discount.
  unit_price_pence integer not null,
  confirmed_at timestamptz,
  ended_at timestamptz,
  ended_reason text references booking.reason_codes (code),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint session_allocations_status check (status in ('held', 'confirmed', 'released', 'cancelled')),
  constraint session_allocations_price check (unit_price_pence > 0),
  constraint session_allocations_once_per_booking unique (booking_id, child_id, session_id)
);

-- A child can hold at most one live place on a session, whichever kind of
-- booking it came from.
create unique index session_allocations_one_live_place_per_child
  on booking.session_allocations (child_id, session_id)
  where status in ('held', 'confirmed');

-- Fast "how many places are taken" count.
create index session_allocations_live_by_session_idx
  on booking.session_allocations (session_id)
  where status in ('held', 'confirmed');

create index session_allocations_child_id_idx on booking.session_allocations (child_id);

create trigger session_allocations_set_updated_at
  before update on booking.session_allocations
  for each row execute function booking.set_updated_at();

-- Capacity backstop -----------------------------------------------------------
-- reserve_booking already checks capacity before it writes anything. This
-- trigger is the last line of defence: whatever code writes an allocation, the
-- database itself refuses to let a session hold more live places than its
-- capacity. It locks the session row first, so two transactions competing for
-- the final place are checked one after the other.

create function booking.enforce_session_capacity()
returns trigger
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_capacity integer;
  v_taken integer;
begin
  if new.status not in ('held', 'confirmed') then
    return new;
  end if;
  -- Held -> confirmed on the same session takes no extra place.
  if tg_op = 'UPDATE'
     and old.status in ('held', 'confirmed')
     and old.session_id = new.session_id then
    return new;
  end if;

  perform booking._require_read_committed();

  select s.capacity into v_capacity
    from booking.club_sessions s
   where s.id = new.session_id
     for update;

  select count(*) into v_taken
    from booking.session_allocations a
   where a.session_id = new.session_id
     and a.status in ('held', 'confirmed');

  if v_taken > v_capacity then
    raise exception 'SESSION_FULL' using detail = new.session_id::text;
  end if;
  return new;
end;
$$;

create trigger session_allocations_enforce_capacity
  after insert or update of status, session_id on booking.session_allocations
  for each row execute function booking.enforce_session_capacity();

-- A session's capacity cannot be lowered beneath the places already taken.
create function booking.enforce_capacity_floor()
returns trigger
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_taken integer;
begin
  if new.capacity < old.capacity then
    perform booking._require_read_committed();
    select count(*) into v_taken
      from booking.session_allocations a
     where a.session_id = new.id
       and a.status in ('held', 'confirmed');
    if v_taken > new.capacity then
      raise exception 'CAPACITY_BELOW_PLACES_TAKEN' using detail = v_taken::text;
    end if;
  end if;
  return new;
end;
$$;

create trigger club_sessions_enforce_capacity_floor
  before update of capacity on booking.club_sessions
  for each row execute function booking.enforce_capacity_floor();

-- Protecting families who have booked ---------------------------------------------
-- Two changes are refused outright while a club or session has live places
-- (held or confirmed), whichever code attempts them:
--   * moving a club back to 'draft', which would hide a club people have
--     booked and paid for;
--   * changing the start time, end time or club of a session.
-- Nothing here alters a booking or tells a parent anything. If a session
-- really must move, the administrator cancels it (admin_cancel_session, which
-- is audited and frees its places) and creates a new session; contacting the
-- families and any refund are the administrator's own separate steps.
-- A session with no live places can be changed freely.

create function booking.protect_booked_club()
returns trigger
language plpgsql
set search_path = booking, pg_temp
as $$
begin
  if new.status = 'draft' and old.status <> 'draft' then
    perform booking._require_read_committed();
    if exists (
      select 1
        from booking.session_allocations a
        join booking.club_sessions s on s.id = a.session_id
       where s.club_id = new.id
         and a.status in ('held', 'confirmed')
    ) then
      raise exception 'CLUB_HAS_BOOKINGS';
    end if;
  end if;
  return new;
end;
$$;

create trigger clubs_protect_booked_club
  before update of status on booking.clubs
  for each row execute function booking.protect_booked_club();

create function booking.protect_booked_session_times()
returns trigger
language plpgsql
set search_path = booking, pg_temp
as $$
begin
  if new.starts_at is distinct from old.starts_at
     or new.ends_at is distinct from old.ends_at
     or new.club_id is distinct from old.club_id then
    perform booking._require_read_committed();
    if exists (
      select 1 from booking.session_allocations a
       where a.session_id = old.id
         and a.status in ('held', 'confirmed')
    ) then
      raise exception 'SESSION_HAS_BOOKINGS';
    end if;
  end if;
  return new;
end;
$$;

create trigger club_sessions_protect_booked_times
  before update of starts_at, ends_at, club_id on booking.club_sessions
  for each row execute function booking.protect_booked_session_times();

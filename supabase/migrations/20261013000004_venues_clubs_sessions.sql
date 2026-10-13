-- School clubs booking system: 04 - venues, clubs and club sessions.
-- All money is whole pence. All times are timestamptz (shown in UK time).

-- venues ----------------------------------------------------------------------

create table booking.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  postcode text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint venues_name_not_blank check (length(btrim(name)) between 1 and 200),
  constraint venues_name_unique unique (name)
);

create trigger venues_set_updated_at
  before update on booking.venues
  for each row execute function booking.set_updated_at();

-- clubs -----------------------------------------------------------------------
-- status:
--   draft        being set up; not visible, not bookable
--   published    visible and bookable
--   unpublished  hidden again; not bookable; existing bookings unaffected
--   closed       visible but no new bookings
--   cancelled    will not run (set by the administrator only)
-- review_status records the minimum-enrolment review. It never changes
-- `status`, bookings or payments by itself.
-- review_note is free text for the administrator about the CLUB. It is not
-- cleared by anonymisation, so it must not contain details of a person.

create table booking.clubs (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references booking.venues (id) on delete restrict,
  slug text not null,
  title text not null,
  description text not null default '',
  activity_type text not null default '',
  location_detail text not null default '',
  price_per_session_pence integer not null,
  block_discount_percent integer not null default 0,
  default_capacity integer not null,
  min_children integer not null default 8,
  enrolment_deadline timestamptz,
  status text not null default 'draft',
  published_at timestamptz,
  review_status text not null default 'none',
  review_flagged_at timestamptz,
  review_decided_at timestamptz,
  review_decided_by uuid,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clubs_slug_unique unique (slug),
  constraint clubs_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 80),
  constraint clubs_title_not_blank check (length(btrim(title)) between 1 and 200),
  constraint clubs_price_positive check (price_per_session_pence > 0),
  -- Capped at 99 so a booking total can never be zero.
  constraint clubs_block_discount_range check (block_discount_percent between 0 and 99),
  constraint clubs_default_capacity_positive check (default_capacity > 0),
  constraint clubs_min_children_positive check (min_children >= 1),
  constraint clubs_status check (status in ('draft', 'published', 'unpublished', 'closed', 'cancelled')),
  constraint clubs_review_status check (review_status in ('none', 'flagged', 'proceed', 'postponed', 'cancelled')),
  -- A club cannot leave draft without an enrolment deadline.
  constraint clubs_deadline_required check (status = 'draft' or enrolment_deadline is not null)
);

create index clubs_venue_id_idx on booking.clubs (venue_id);
create index clubs_status_idx on booking.clubs (status);

create trigger clubs_set_updated_at
  before update on booking.clubs
  for each row execute function booking.set_updated_at();

-- club_sessions ---------------------------------------------------------------
-- One dated meeting of a club. A club has as many as it needs; nothing here
-- assumes six. Capacity is per session and is what bookings are counted
-- against.

create table booking.club_sessions (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references booking.clubs (id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity integer not null,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint club_sessions_times check (ends_at > starts_at),
  constraint club_sessions_capacity_positive check (capacity > 0),
  constraint club_sessions_status check (status in ('open', 'closed', 'cancelled')),
  constraint club_sessions_unique_start unique (club_id, starts_at)
);

create index club_sessions_starts_at_idx on booking.club_sessions (starts_at);

create trigger club_sessions_set_updated_at
  before update on booking.club_sessions
  for each row execute function booking.set_updated_at();

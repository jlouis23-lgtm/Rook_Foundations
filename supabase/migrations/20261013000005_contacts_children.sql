-- School clubs booking system: 05 - booking contacts (parents/guardians) and children.
-- Personal data is stored here once and referred to by ID everywhere else.
-- Deliberately absent: medical information, diagnoses, additional needs,
-- dates of birth, photographs.

-- contacts --------------------------------------------------------------------
-- One row per email address. A new booking never changes an existing
-- contact's details: what the parent typed waits on the booking
-- (bookings.pending_contact) and is copied here only once payment is
-- confirmed. A brand-new contact therefore starts with just an email.

create table booking.contacts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text,
  phone text,
  emergency_name text,
  emergency_phone text,
  anonymised_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contacts_email_unique unique (email),
  constraint contacts_email_format check (
    email = lower(email)
    and length(email) <= 254
    and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
  ),
  constraint contacts_field_lengths check (
    coalesce(length(full_name), 0) <= 120
    and coalesce(length(phone), 0) <= 30
    and coalesce(length(emergency_name), 0) <= 120
    and coalesce(length(emergency_phone), 0) <= 30
  )
);

create trigger contacts_set_updated_at
  before update on booking.contacts
  for each row execute function booking.set_updated_at();

-- children --------------------------------------------------------------------
-- Every child is an individual record with its own ID. There is intentionally
-- NO uniqueness rule on names: two siblings with identical names are two rows.
-- Records are never merged automatically. If the administrator decides two
-- records are the same child, admin_merge_children moves the places to one of
-- them and marks the other with merged_into_child_id.

create table booking.children (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references booking.contacts (id) on delete restrict,
  first_name text not null,
  surname text not null,
  year_group text,
  merged_into_child_id uuid references booking.children (id) on delete restrict,
  merged_at timestamptz,
  anonymised_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint children_first_name_length check (length(btrim(first_name)) between 1 and 60),
  constraint children_surname_length check (length(btrim(surname)) between 1 and 60),
  constraint children_year_group_length check (coalesce(length(year_group), 0) <= 20),
  -- Year group is required until the record is anonymised. The explicit
  -- "is not null" matters: a bare length() test passes when the value is NULL.
  constraint children_year_group_present check (
    anonymised_at is not null
    or (year_group is not null and length(btrim(year_group)) >= 1)
  ),
  constraint children_not_merged_into_self check (merged_into_child_id is null or merged_into_child_id <> id),
  constraint children_merge_fields_together check ((merged_into_child_id is null) = (merged_at is null))
);

create index children_contact_id_idx on booking.children (contact_id);

create trigger children_set_updated_at
  before update on booking.children
  for each row execute function booking.set_updated_at();

-- child_duplicate_flags -------------------------------------------------------
-- The administrator's decisions about pairs of child records that might be
-- the same child.
--   open      flagged for review, not yet decided
--   distinct  decided: two different children
--   merged    decided: the same child; the records have been merged
-- source says who created the row: the administrator, or the system when two
-- children with the same name were entered together in ONE booking request
-- (which shows the parent meant two children). The system never creates an
-- 'open' or 'merged' row and never merges anything.

create table booking.child_duplicate_flags (
  id uuid primary key default gen_random_uuid(),
  child_a_id uuid not null references booking.children (id) on delete restrict,
  child_b_id uuid not null references booking.children (id) on delete restrict,
  status text not null default 'open',
  source text not null,
  decided_by uuid,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Always stored lower ID first, so each pair has exactly one row.
  constraint child_duplicate_flags_ordered check (child_a_id < child_b_id),
  constraint child_duplicate_flags_pair_unique unique (child_a_id, child_b_id),
  constraint child_duplicate_flags_status check (status in ('open', 'distinct', 'merged')),
  constraint child_duplicate_flags_source check (source in ('admin', 'system'))
);

create index child_duplicate_flags_child_b_idx on booking.child_duplicate_flags (child_b_id);

create trigger child_duplicate_flags_set_updated_at
  before update on booking.child_duplicate_flags
  for each row execute function booking.set_updated_at();

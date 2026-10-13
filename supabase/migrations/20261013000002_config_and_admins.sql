-- School clubs booking system: 02 - application configuration and administrators.

-- app_config ------------------------------------------------------------------
-- Exactly one row. `environment` is the safety catch that stops test payments
-- being written to the production database (and the reverse): it starts as
-- 'test' everywhere and must be changed by hand to 'production' in the
-- production project only.

create table booking.app_config (
  id boolean primary key default true,
  environment text not null default 'test',
  -- How long a reservation is kept before Stripe Checkout has been started.
  -- Nothing can be paid during this time, so it can be short.
  unattached_hold_minutes integer not null default 10,
  -- How long Stripe Checkout stays open (Stripe's minimum is 30 minutes).
  checkout_minutes integer not null default 35,
  -- How long places are kept once Checkout has been started. Must outlast
  -- Checkout so a hold can never lapse while Stripe can still take payment.
  hold_minutes integer not null default 50,
  max_children_per_booking integer not null default 6,
  -- Used by contacts_eligible_for_anonymisation.
  personal_data_retention_months integer not null default 12,
  unconfirmed_contact_retention_days integer not null default 30,
  -- INFORMATIONAL ONLY. Records the intended retention period for payment
  -- records. Nothing in the database reads it and nothing deletes financial
  -- records.
  financial_retention_years integer not null default 6,
  updated_at timestamptz not null default now(),
  constraint app_config_single_row check (id),
  constraint app_config_environment check (environment in ('test', 'production')),
  constraint app_config_unattached_hold_minutes check (unattached_hold_minutes between 2 and 60),
  constraint app_config_checkout_minutes check (checkout_minutes between 31 and 1440),
  constraint app_config_hold_covers_checkout check (hold_minutes >= checkout_minutes + 10),
  constraint app_config_max_children check (max_children_per_booking between 1 and 20),
  constraint app_config_retention check (
    personal_data_retention_months >= 1
    and unconfirmed_contact_retention_days >= 1
    and financial_retention_years >= 1
  )
);

create trigger app_config_set_updated_at
  before update on booking.app_config
  for each row execute function booking.set_updated_at();

insert into booking.app_config default values;

-- admin_users -----------------------------------------------------------------
-- The allowlist of Supabase Auth users who may administer clubs. There is no
-- sign-up path: a row is added by hand in the SQL editor for each
-- administrator (see the documentation). Being signed in is never enough on
-- its own; every admin action checks this table.

create table booking.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  note text,
  created_at timestamptz not null default now()
);

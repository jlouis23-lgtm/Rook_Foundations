-- School clubs booking system: 01 - schema and baseline privileges.
--
-- Everything for school club bookings lives in a dedicated `booking` schema,
-- kept apart from `public` (which Supabase opens to browser roles by default).
-- Only the server-side `service_role` (used by Netlify Functions) may use it.
-- The browser roles `anon` and `authenticated` get nothing at all.

create schema booking;

comment on schema booking is
  'School clubs booking system. Server-only: reached through Netlify Functions using the service role.';

-- No browser role, and no role by default, may even look inside the schema.
revoke all on schema booking from public;
revoke all on schema booking from anon, authenticated;
grant usage on schema booking to service_role;

-- NO default privileges are set for this schema. A table, view or function
-- added by a later migration therefore starts with no access for anyone but
-- its owner, and that migration must:
--   * enable Row Level Security on any new table,
--   * revoke execute on any new function from PUBLIC (PostgreSQL grants that
--     automatically), and
--   * grant the service role exactly the rights the object needs, no more.
-- The final migration does all of this explicitly for every object created
-- here, and booking.check_schema_security() reports anything that has been
-- missed. Run it after every future migration.

-- Keeps `updated_at` current on any table that has the column.
create function booking.set_updated_at()
returns trigger
language plpgsql
set search_path = booking, pg_temp
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Isolation guard.
-- The capacity rules lock a session row and THEN count the places taken.
-- That is only correct at PostgreSQL's default READ COMMITTED level, where
-- each statement sees what other transactions have committed. At REPEATABLE
-- READ or SERIALIZABLE the count would use an older snapshot and could miss
-- a place another parent has just taken. Rather than assume the level, every
-- function and trigger that counts places calls this first and refuses to
-- run at any other level.
create function booking._require_read_committed()
returns void
language plpgsql
set search_path = booking, pg_temp
as $$
begin
  if current_setting('transaction_isolation') <> 'read committed' then
    raise exception 'WRONG_ISOLATION_LEVEL'
      using detail = current_setting('transaction_isolation');
  end if;
end;
$$;

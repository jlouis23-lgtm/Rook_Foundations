-- School clubs booking system: 15 - privileges.
--
-- Run last. It sets every privilege in the booking schema explicitly, so the
-- result does not depend on default privileges or on which role ran the
-- earlier migrations.
--
-- PostgreSQL lets EVERY role run a new function unless told otherwise. This
-- migration takes that away for everything in the schema.
--
-- The service role is what every Netlify Function connects as, so it is given
-- only what the booking functions actually need. A mistake in any one
-- function therefore cannot:
--   * add or remove an administrator          (admin_users is read-only)
--   * switch between test and production      (app_config is read-only)
--   * delete a booking, a place, a payment, a refund, a contact or a child
--   * change or delete the audit log, or delete a Stripe event record
-- Administrators and the environment are set by hand in the Supabase SQL
-- editor, which runs as the database owner.
--
-- IMPORTANT: any table, view or function added to this schema in a later
-- migration must repeat the relevant revoke and grant for that object.

-- 0. Belt and braces: Row Level Security on every table in the schema -------------
-- Migration 09 names each table. This repeats it for whatever tables exist
-- when this migration runs, so none can be missed.
do $$
declare
  v_table text;
begin
  for v_table in select tablename from pg_tables where schemaname = 'booking'
  loop
    execute format('alter table booking.%I enable row level security', v_table);
  end loop;
end;
$$;

-- A self-check for the schema's security rules. Returns one row per problem;
-- NO ROWS means every rule holds. Run it after applying these migrations and
-- after every later migration:  select * from booking.check_schema_security();
-- It only reads the system catalogues and changes nothing.
create function booking.check_schema_security()
returns table (problem text, object_name text)
language sql
stable
set search_path = booking, pg_temp
as $$
  with tables as (
    select c.oid, c.relname::text as name, c.relkind, c.relrowsecurity, c.reloptions
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'booking' and c.relkind in ('r', 'p', 'v', 'm', 'S')
  ),
  funcs as (
    select p.oid, p.proname::text as name, p.prosecdef, p.proconfig
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'booking'
  ),
  browser as (select unnest(array['anon', 'authenticated']) as role_name)
  select 'table_without_row_level_security', t.name
    from tables t where t.relkind in ('r', 'p') and not t.relrowsecurity
  union all
  select 'row_level_security_policy_exists', pol.tablename::text || '.' || pol.policyname::text
    from pg_policies pol where pol.schemaname = 'booking'
  union all
  select 'browser_role_can_use_schema', b.role_name
    from browser b where has_schema_privilege(b.role_name, 'booking', 'usage, create')
  union all
  select 'browser_role_has_table_privilege', t.name || ' (' || b.role_name || ')'
    from tables t cross join browser b
   where t.relkind in ('r', 'p', 'v', 'm')
     and has_table_privilege(b.role_name, t.oid, 'select, insert, update, delete, truncate, references, trigger')
  union all
  select 'browser_role_can_execute_function', f.name || ' (' || b.role_name || ')'
    from funcs f cross join browser b
   where has_function_privilege(b.role_name, f.oid, 'execute')
  union all
  select 'function_is_security_definer', f.name from funcs f where f.prosecdef
  union all
  select 'function_without_fixed_search_path', f.name
    from funcs f
   where f.proconfig is null
      or not exists (select 1 from unnest(f.proconfig) c where c like 'search_path=%')
  union all
  select 'view_does_not_use_callers_permissions', t.name
    from tables t
   where t.relkind = 'v' and not coalesce(t.reloptions::text ilike '%security_invoker=true%', false)
  union all
  select 'service_role_can_delete', t.name
    from tables t
   where t.relkind in ('r', 'p')
     and t.name not in ('venues', 'clubs', 'club_sessions')
     and has_table_privilege('service_role', t.oid, 'delete')
  union all
  select 'service_role_has_excess_privilege', t.name
    from tables t
   where t.relkind in ('r', 'p', 'v', 'm')
     and has_table_privilege('service_role', t.oid, 'truncate, references, trigger')
  union all
  select 'service_role_can_write_owner_only_table', t.name
    from tables t
   where t.name in ('app_config', 'admin_users', 'reason_codes')
     and has_table_privilege('service_role', t.oid, 'insert, update, delete')
  union all
  select 'service_role_can_change_append_only_table', t.name
    from tables t
   where t.name = 'audit_log'
     and has_table_privilege('service_role', t.oid, 'update, delete');
$$;

-- 1. Nothing for anyone ---------------------------------------------------------
revoke all on all tables in schema booking from public;
revoke all on all tables in schema booking from anon, authenticated, service_role;
revoke all on all sequences in schema booking from public;
revoke all on all sequences in schema booking from anon, authenticated, service_role;
revoke all on all functions in schema booking from public;
revoke all on all functions in schema booking from anon, authenticated, service_role;

-- 2. The service role, and only the service role ---------------------------------
grant usage on schema booking to service_role;
grant execute on all functions in schema booking to service_role;
grant usage, select on all sequences in schema booking to service_role;

-- Read-only: set by hand by the database owner.
grant select on
  booking.app_config,
  booking.admin_users,
  booking.reason_codes
to service_role;

-- Club set-up. Deleting is allowed here (for tidying drafts); a venue, club or
-- session that anything refers to cannot be deleted, and every change is audited.
grant select, insert, update, delete on
  booking.venues,
  booking.clubs,
  booking.club_sessions
to service_role;

-- Booking, payment and personal records: created and updated, never deleted.
grant select, insert, update on
  booking.contacts,
  booking.children,
  booking.child_duplicate_flags,
  booking.bookings,
  booking.session_allocations,
  booking.payments,
  booking.payment_refunds,
  booking.stripe_events,
  booking.admin_alerts
to service_role;

-- Append-only.
grant select, insert on booking.audit_log to service_role;

-- Views are read-only.
grant select on
  booking.session_availability,
  booking.club_enrolled_children,
  booking.possible_duplicate_children,
  booking.club_enrolment,
  booking.bookings_awaiting_reconciliation,
  booking.outstanding_messages,
  booking.reconciliation_issues,
  booking.contacts_eligible_for_anonymisation
to service_role;

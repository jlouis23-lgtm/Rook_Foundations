-- School clubs booking system: 09 - Row Level Security.
--
-- Row Level Security is switched on for every table and NO policies are
-- created. With RLS on and no policy, every row is denied to any role that is
-- subject to RLS. That is the intended result here: the browser roles are
-- never meant to read or write these tables directly.
--
-- RLS alone is not relied on. The browser roles also have no USAGE on the
-- schema (migration 01) and every table, view and function privilege is
-- revoked from them in the final migration.
--
-- The service role (Netlify Functions) bypasses RLS by design; it is the only
-- route in, and the functions are responsible for checking who is asking.

alter table booking.app_config            enable row level security;
alter table booking.admin_users           enable row level security;
alter table booking.reason_codes          enable row level security;
alter table booking.venues                enable row level security;
alter table booking.clubs                 enable row level security;
alter table booking.club_sessions         enable row level security;
alter table booking.contacts              enable row level security;
alter table booking.children              enable row level security;
alter table booking.child_duplicate_flags enable row level security;
alter table booking.bookings              enable row level security;
alter table booking.session_allocations   enable row level security;
alter table booking.payments              enable row level security;
alter table booking.payment_refunds       enable row level security;
alter table booking.stripe_events         enable row level security;
alter table booking.admin_alerts          enable row level security;
alter table booking.audit_log             enable row level security;

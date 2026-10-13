-- School clubs booking system: 07 - payments, refunds and Stripe event records.
-- Stripe takes the money; these tables are the booking system's own record of
-- it, for reconciliation. No card details and no child data are stored here.

-- payments --------------------------------------------------------------------
-- One row per Stripe Checkout session. Normally a booking has exactly one,
-- created by attach_checkout_session. A row can also be created by the
-- webhook when a payment is recognised from its booking reference before the
-- Checkout was recorded (recorded_without_attachment = true). A booking is
-- not limited to one row, so that an unexpected second payment can always be
-- recorded rather than lost; the reconciliation view reports it.
-- status:
--   created             Checkout opened, not yet paid
--   paid                Stripe confirmed payment
--   expired             Checkout expired unpaid (verified with Stripe)
--   partially_refunded  some of the amount has been refunded
--   refunded            the whole amount has been refunded
--   no_payment          Stripe completed the Checkout with NOTHING charged
--                       (no_payment_required). This should never happen: the
--                       booking function must not enable promotion codes or
--                       discounts. It is recorded, never treated as paid, and
--                       the booking goes to the administrator for review.
--   failed              RESERVED, NOT CURRENTLY SET BY ANY FUNCTION. With
--                       card-only Checkout a declined card leaves the session
--                       open for another attempt and it ends as paid or
--                       expired. Kept for a future delayed payment method.
-- Refund statuses only record refunds the administrator issued in Stripe.
-- Nothing in the database issues a refund.
--
-- currency is Stripe's three-letter code in lower case. Every Checkout is
-- created in pounds sterling ('gbp') and that is the only currency a booking
-- is confirmed for. If Stripe ever reports a different one, the payment is
-- still recorded here, with the currency it actually arrived in, and the
-- booking goes to the administrator for review.

create table booking.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references booking.bookings (id) on delete restrict,
  stripe_checkout_session_id text not null,
  stripe_payment_intent_id text,
  amount_pence integer not null,
  amount_received_pence integer,
  refunded_pence integer not null default 0,
  currency text not null default 'gbp',
  status text not null default 'created',
  -- true = real money, false = Stripe test mode.
  livemode boolean not null,
  checkout_expires_at timestamptz,
  recorded_without_attachment boolean not null default false,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payments_checkout_session_unique unique (stripe_checkout_session_id),
  constraint payments_payment_intent_unique unique (stripe_payment_intent_id),
  constraint payments_amount_positive check (amount_pence > 0),
  constraint payments_refunded_range check (refunded_pence >= 0),
  constraint payments_currency_format check (currency ~ '^[a-z]{3}$'),
  constraint payments_status check (status in ('created', 'paid', 'expired', 'failed', 'partially_refunded', 'refunded', 'no_payment'))
);

create index payments_booking_id_idx on booking.payments (booking_id);
create index payments_status_idx on booking.payments (status);

create trigger payments_set_updated_at
  before update on booking.payments
  for each row execute function booking.set_updated_at();

-- payment_refunds -------------------------------------------------------------
-- One row per Stripe refund, holding Stripe's latest status for it. Only
-- refunds with status 'succeeded' count towards a payment's refunded total,
-- so a refund that Stripe later reports as failed stops counting.

create table booking.payment_refunds (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references booking.payments (id) on delete restrict,
  stripe_refund_id text not null,
  amount_pence integer not null,
  status text not null,
  -- Stripe's own fixed reason value (for example requested_by_customer).
  stripe_reason text,
  recorded_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payment_refunds_stripe_refund_unique unique (stripe_refund_id),
  constraint payment_refunds_amount_positive check (amount_pence > 0),
  constraint payment_refunds_status check (status in ('pending', 'requires_action', 'succeeded', 'failed', 'canceled')),
  constraint payment_refunds_reason_format check (stripe_reason is null or stripe_reason ~ '^[a-z_]{1,60}$')
);

create index payment_refunds_payment_id_idx on booking.payment_refunds (payment_id);

create trigger payment_refunds_set_updated_at
  before update on booking.payment_refunds
  for each row execute function booking.set_updated_at();

-- stripe_events ---------------------------------------------------------------
-- Every Stripe webhook event that has been dealt with, keyed by Stripe's own
-- event ID. The row is written in the SAME transaction as the booking and
-- payment changes it causes: if that transaction fails, the row is not kept
-- and Stripe's retry is processed normally. A repeat delivery finds the row
-- and changes nothing. The event body is not stored, so no personal data is
-- copied in.

create table booking.stripe_events (
  stripe_event_id text primary key,
  event_type text not null,
  livemode boolean not null,
  stripe_object_id text,
  booking_id uuid references booking.bookings (id) on delete set null,
  outcome text not null default 'received',
  received_at timestamptz not null default now()
);

create index stripe_events_booking_id_idx on booking.stripe_events (booking_id);

-- admin_alerts ------------------------------------------------------------------
-- One row for each thing the administrator needs to be told. Every alert is
-- its own row with its own ID, so:
--   * a later alert never replaces an earlier one that has not been sent yet;
--   * an alert is marked as sent by its ID (mark_admin_alert_sent), never by
--     comparing timestamps;
--   * the ID is a ready-made idempotency key for the email provider.
-- An alert is about a booking, a club, or (when there is no booking to attach
-- it to) a Stripe event. While an alert is unsent, a second alert with the
-- same subject and code is not added: the email describes the current state.
-- SQL never sends email; a Netlify Function reads booking.outstanding_messages.

create table booking.admin_alerts (
  id uuid primary key default gen_random_uuid(),
  alert_code text not null references booking.reason_codes (code),
  booking_id uuid references booking.bookings (id) on delete restrict,
  club_id uuid references booking.clubs (id) on delete restrict,
  stripe_event_id text references booking.stripe_events (stripe_event_id) on delete restrict,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  constraint admin_alerts_one_subject check (num_nonnulls(booking_id, club_id, stripe_event_id) = 1)
);

create unique index admin_alerts_one_unsent_per_booking_code
  on booking.admin_alerts (booking_id, alert_code)
  where sent_at is null and booking_id is not null;

create unique index admin_alerts_one_unsent_per_club_code
  on booking.admin_alerts (club_id, alert_code)
  where sent_at is null and club_id is not null;

create unique index admin_alerts_one_per_event_code
  on booking.admin_alerts (stripe_event_id, alert_code)
  where stripe_event_id is not null;

create index admin_alerts_unsent_idx on booking.admin_alerts (created_at) where sent_at is null;

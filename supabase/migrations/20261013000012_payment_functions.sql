-- School clubs booking system: 12 - Stripe webhook processing functions.
--
-- The school clubs webhook (a future Netlify Function, separate from the
-- private-booking webhook) verifies Stripe's signature and then makes ONE
-- call to one of these functions per event. Each call is one transaction:
-- the stripe_events row and every booking/payment change are saved together
-- or not at all. So:
--   * a repeat delivery finds the event row and changes nothing;
--   * a failure part-way through leaves no event row, and Stripe's retry is
--     processed from scratch.
-- Nothing here issues a refund, cancels a club or exceeds capacity, and no
-- SQL function sends email.
--
-- HOW A PAYMENT IS MATCHED TO ITS BOOKING
--   1. By the Stripe Checkout session ID recorded by attach_checkout_session.
--   2. If that was never recorded: by p_booking_reference, which the webhook
--      passes EXACTLY as it appears in the Checkout's client_reference_id
--      (plain text, or null). A payment recognised this way is recorded and
--      handled like any other. It is never ignored.
--   3. A session with no recorded Checkout and no reference is not one of
--      ours (for example a private booking paid through the same Stripe
--      account) and is ignored.
--   4. A session whose reference is not a booking this database holds
--      (malformed, or simply unknown) is NOT treated as a booking. Nothing is
--      created; if it was paid, an alert is raised for the administrator.
--      Because the reference is taken as text and checked here, a malformed
--      one never causes an error for Stripe to retry endlessly.
--
-- WHAT COUNTS AS A PAYMENT THAT CONFIRMS A BOOKING
--   payment_status 'paid', in pounds sterling ('gbp'), for exactly the booking
--   total. Anything else that Stripe reports as complete is recorded and sent
--   to the administrator for review, never confirmed automatically:
--     * a different currency, or no currency stated   (currency_mismatch)
--     * a different amount                            (amount_mismatch)
--     * 'no_payment_required' - completed with nothing charged, which should
--       be impossible because the booking function must not enable promotion
--       codes or discounts                 (checkout_completed_without_payment)
--   Any other status (for example 'unpaid') means Stripe has not finished and
--   is ignored until a later event.
--
-- EVERY function returns the same shape, INCLUDING for a repeat delivery:
--   { stripe_event_id, outcome, original_outcome, booking_id, reference,
--     send_confirmation, confirmation_message_key,
--     notify_admin, admin_alerts: [ { alert_id, code, message_key } ] }
-- send_confirmation and admin_alerts are worked out from what is still owed,
-- not from what this call did. So if the first delivery committed but the
-- email was never sent, the retry still says the email is owed. After
-- sending, the caller calls mark_confirmation_email_sent(booking_id) or
-- mark_admin_alert_sent(alert_id). Each message_key is a stable idempotency
-- key for the email provider, so a message sent but not recorded is not sent
-- twice.

-- Records the event. Returns false if it has been seen before.
create function booking._register_stripe_event(
  p_event_id text,
  p_event_type text,
  p_livemode boolean,
  p_object_id text
)
returns boolean
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_rows integer;
begin
  if p_event_id is null or length(btrim(p_event_id)) = 0 then
    raise exception 'EVENT_ID_REQUIRED';
  end if;
  insert into booking.stripe_events (stripe_event_id, event_type, livemode, stripe_object_id)
  values (p_event_id, coalesce(p_event_type, 'unknown'), coalesce(p_livemode, false), p_object_id)
  on conflict (stripe_event_id) do nothing;
  get diagnostics v_rows = row_count;
  return v_rows = 1;
end;
$$;

-- Turns the text of a Checkout's client_reference_id into a booking ID, or
-- null if it is missing or is not in the form of an ID. Never raises.
create function booking._booking_id_from_reference(p_reference text)
returns uuid
language sql
immutable
set search_path = booking, pg_temp
as $$
  select case
    when btrim(coalesce(p_reference, '')) ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
    then btrim(p_reference)::uuid
  end;
$$;

-- What the caller should do now for this event, from the current state.
create function booking._event_result(p_event_id text, p_duplicate boolean default false)
returns jsonb
language sql
stable
set search_path = booking, pg_temp
as $$
  select jsonb_build_object(
    'stripe_event_id', e.stripe_event_id,
    'outcome', case when p_duplicate then 'duplicate_event' else e.outcome end,
    'original_outcome', e.outcome,
    'booking_id', b.id,
    'reference', b.reference,
    'send_confirmation', coalesce(b.status = 'confirmed' and b.confirmation_email_sent_at is null, false),
    'confirmation_message_key', case when b.id is not null then 'booking-confirmation-' || b.id::text end,
    'notify_admin', jsonb_array_length(al.alerts) > 0,
    'admin_alerts', al.alerts
  )
  from booking.stripe_events e
  left join booking.bookings b on b.id = e.booking_id
  cross join lateral (
    select coalesce(
             jsonb_agg(jsonb_build_object(
               'alert_id', a.id,
               'code', a.alert_code,
               'message_key', 'admin-alert-' || a.id::text
             ) order by a.created_at, a.id),
             '[]'::jsonb) as alerts
      from booking.admin_alerts a
     where a.sent_at is null
       and ((b.id is not null and a.booking_id = b.id) or a.stripe_event_id = e.stripe_event_id)
  ) al
  where e.stripe_event_id = p_event_id;
$$;

create function booking._finish_stripe_event(p_event_id text, p_outcome text, p_booking_id uuid)
returns jsonb
language plpgsql
set search_path = booking, pg_temp
as $$
begin
  update booking.stripe_events
     set outcome = p_outcome, booking_id = p_booking_id
   where stripe_event_id = p_event_id;
  return booking._event_result(p_event_id);
end;
$$;

-- Moves a paid booking to needs_review and records that the administrator
-- must be told. Places are left exactly as they are.
create function booking._set_needs_review(p_booking_id uuid, p_reason_code text)
returns void
language plpgsql
set search_path = booking, pg_temp
as $$
begin
  perform booking._require_reason_code(p_reason_code);
  update booking.bookings
     set status = 'needs_review', review_reason = p_reason_code
   where id = p_booking_id;
  perform booking._raise_admin_alert(p_booking_id, p_reason_code);
  perform booking.write_audit('booking', p_booking_id, 'booking_needs_review', 'webhook', null,
    jsonb_build_object('reason', p_reason_code));
end;
$$;

-- process_checkout_completed --------------------------------------------------
-- For checkout.session.completed and checkout.session.async_payment_succeeded.
--   p_currency           the session's `currency`, as Stripe sends it
--   p_booking_reference  the session's client_reference_id, as Stripe sends it

create function booking.process_checkout_completed(
  p_event_id text,
  p_event_type text,
  p_stripe_checkout_session_id text,
  p_stripe_payment_intent_id text,
  p_payment_status text,
  p_amount_total_pence integer,
  p_currency text,
  p_livemode boolean,
  p_booking_reference text default null
)
returns jsonb
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_has_reference boolean := length(btrim(coalesce(p_booking_reference, ''))) > 0;
  v_reference_id uuid := booking._booking_id_from_reference(p_booking_reference);
  v_paid boolean := p_payment_status is not distinct from 'paid';
  v_no_payment boolean := p_payment_status is not distinct from 'no_payment_required';
  v_currency text := lower(btrim(coalesce(p_currency, '')));
  v_booking_id uuid;
  v_payment booking.payments%rowtype;
  v_booking booking.bookings%rowtype;
  v_was_pending boolean;
  v_failure text;
  v_recorded_now boolean := false;
begin
  if not booking._register_stripe_event(p_event_id, p_event_type, p_livemode, p_stripe_checkout_session_id) then
    return booking._event_result(p_event_id, true);
  end if;

  -- A test event must never touch the production database, or the reverse.
  -- Nothing is recorded against any booking. But a PAID event in the wrong
  -- mode means something is misconfigured and money may have been taken with
  -- nothing to show for it, so the administrator is alerted.
  if not booking._environment_matches(p_livemode) then
    if v_paid then
      perform booking._raise_event_alert(p_event_id, 'payment_environment_mismatch');
    end if;
    return booking._finish_stripe_event(p_event_id, 'ignored_environment_mismatch', null);
  end if;

  -- Which booking is this? The recorded Checkout decides if there is one;
  -- otherwise the booking reference that was sent to Stripe with the Checkout.
  select p.booking_id into v_booking_id
    from booking.payments p
   where p.stripe_checkout_session_id = p_stripe_checkout_session_id;
  if not found then
    if not v_has_reference then
      -- Carries no booking association at all: not one of ours.
      return booking._finish_stripe_event(p_event_id, 'ignored_unknown_session', null);
    end if;
    v_booking_id := v_reference_id;   -- null when the reference is malformed
  end if;

  -- Lock order: booking, then payment, then sessions.
  select * into v_booking from booking.bookings b where b.id = v_booking_id for update;
  if not found then
    -- It claims a booking this database does not hold (unknown or malformed).
    -- Do not invent one.
    if v_paid then
      perform booking._raise_event_alert(p_event_id, 'unmatched_payment');
    end if;
    return booking._finish_stripe_event(p_event_id, 'unrecognised_booking_reference', null);
  end if;

  -- Neither paid nor completed-for-nothing: Stripe has not finished with this
  -- Checkout. Nothing changes; a later event will say how it ended.
  if not v_paid and not v_no_payment then
    return booking._finish_stripe_event(p_event_id, 'ignored_not_paid', v_booking.id);
  end if;

  select * into v_payment
    from booking.payments p
   where p.stripe_checkout_session_id = p_stripe_checkout_session_id
     for update;
  if not found then
    -- Completed before attach_checkout_session recorded the Checkout (or it
    -- never did). Create the record now so nothing about it is lost.
    insert into booking.payments (
      booking_id, stripe_checkout_session_id, amount_pence, status, livemode,
      checkout_expires_at, recorded_without_attachment
    ) values (
      v_booking.id, p_stripe_checkout_session_id, v_booking.total_pence, 'created', coalesce(p_livemode, false),
      v_booking.checkout_deadline_at, true
    )
    returning * into v_payment;
    v_recorded_now := true;
    perform booking.write_audit('payment', v_payment.id, 'payment_recognised_by_booking_reference', 'webhook', null,
      jsonb_build_object('booking_id', v_booking.id));
  end if;

  -- Completed with nothing charged -----------------------------------------------
  -- Never treated as paid, and never left waiting: the Checkout is finished,
  -- so it can no longer be paid or expire. The record says so, and a booking
  -- that was waiting goes to the administrator with its places still held.
  if v_no_payment then
    if v_payment.status <> 'created' then
      return booking._finish_stripe_event(p_event_id, 'ignored_checkout_already_settled', v_booking.id);
    end if;

    update booking.payments
       set status = 'no_payment', amount_received_pence = 0
     where id = v_payment.id;
    perform booking.write_audit('payment', v_payment.id, 'checkout_completed_without_payment', 'webhook', null,
      jsonb_build_object('booking_id', v_booking.id, 'recorded_without_attachment', v_recorded_now));

    if v_booking.status = 'pending' then
      perform booking._set_needs_review(v_booking.id, 'checkout_completed_without_payment');
      return booking._finish_stripe_event(p_event_id, 'needs_review_checkout_completed_without_payment', v_booking.id);
    end if;

    -- The booking had already ended or been dealt with: leave it, tell the administrator.
    perform booking._raise_admin_alert(v_booking.id, 'checkout_completed_without_payment');
    return booking._finish_stripe_event(p_event_id, 'no_payment_recorded_booking_unchanged', v_booking.id);
  end if;

  -- A second "paid" event for a payment already recorded as paid.
  if v_payment.status in ('paid', 'partially_refunded', 'refunded') then
    return booking._finish_stripe_event(p_event_id, 'already_paid', v_booking.id);
  end if;

  -- The money has arrived: record that first, whatever happens to the booking.
  -- The currency recorded is the one it actually arrived in.
  update booking.payments
     set status = 'paid',
         stripe_payment_intent_id = coalesce(p_stripe_payment_intent_id, stripe_payment_intent_id),
         amount_received_pence = p_amount_total_pence,
         currency = case when v_currency ~ '^[a-z]{3}$' then v_currency else currency end,
         paid_at = now()
   where id = v_payment.id;

  perform booking.write_audit('payment', v_payment.id, 'payment_received', 'webhook', null,
    jsonb_build_object('booking_id', v_booking.id, 'amount_pence', p_amount_total_pence,
      'currency', case when v_currency ~ '^[a-z]{3}$' then v_currency else 'not_stated' end,
      'recorded_without_attachment', v_recorded_now));

  -- This booking has already been paid through another Checkout.
  if exists (
    select 1 from booking.payments o
     where o.booking_id = v_booking.id
       and o.id <> v_payment.id
       and o.status in ('paid', 'partially_refunded', 'refunded')
  ) then
    perform booking._raise_admin_alert(v_booking.id, 'duplicate_payment');
    perform booking.write_audit('booking', v_booking.id, 'duplicate_payment_recorded', 'webhook', null,
      jsonb_build_object('payment_id', v_payment.id));
    return booking._finish_stripe_event(p_event_id, 'duplicate_payment_recorded', v_booking.id);
  end if;

  -- Paid, but not in pounds sterling (or the currency was not stated). The
  -- number alone cannot be compared with the booking total, so this is
  -- checked before the amount and is never confirmed automatically.
  if v_currency <> 'gbp' then
    perform booking._set_needs_review(v_booking.id, 'currency_mismatch');
    return booking._finish_stripe_event(p_event_id, 'needs_review_currency_mismatch', v_booking.id);
  end if;

  -- Paid, but not the amount this booking was priced at.
  if p_amount_total_pence is distinct from v_booking.total_pence then
    perform booking._set_needs_review(v_booking.id, 'amount_mismatch');
    return booking._finish_stripe_event(p_event_id, 'needs_review_amount_mismatch', v_booking.id);
  end if;

  if v_booking.status in ('pending', 'expired', 'failed') then
    v_was_pending := v_booking.status = 'pending';
    v_failure := booking._confirm_booking_allocations(v_booking.id);

    if v_failure is null then
      update booking.bookings
         set status = 'confirmed', confirmed_at = now(), ended_at = null, review_reason = null
       where id = v_booking.id;
      -- The details the parent typed are still on the booking, even if it
      -- had expired, because Checkout had been started.
      perform booking._apply_pending_contact(v_booking.id);
      perform booking.write_audit('booking', v_booking.id, 'booking_confirmed', 'webhook', null,
        jsonb_build_object('late_payment', not v_was_pending));
      if not v_was_pending then
        perform booking._raise_admin_alert(v_booking.id, 'confirmed_after_hold_ended');
      end if;
      return booking._finish_stripe_event(p_event_id,
        case when v_was_pending then 'confirmed' else 'confirmed_after_hold_ended' end, v_booking.id);
    end if;

    -- Paid, but it cannot safely be confirmed (no room, a cancelled club or
    -- session, or the child already placed). The payment stays recorded, no
    -- extra place is given, and the administrator decides what to do.
    perform booking._set_needs_review(v_booking.id, v_failure);
    return booking._finish_stripe_event(p_event_id, 'needs_review_' || v_failure, v_booking.id);
  end if;

  -- The booking was not waiting for payment (already confirmed, under review
  -- or cancelled) and has no other paid payment. The payment is recorded and
  -- the administrator is told; the booking itself is left as it is.
  perform booking._raise_admin_alert(v_booking.id, 'payment_for_unexpected_state');
  perform booking.write_audit('booking', v_booking.id, 'payment_for_unexpected_state', 'webhook', null,
    jsonb_build_object('booking_status', v_booking.status));
  return booking._finish_stripe_event(p_event_id, 'payment_recorded_booking_unchanged', v_booking.id);
end;
$$;

-- process_checkout_expired ----------------------------------------------------
-- For checkout.session.expired: Stripe's own statement that this Checkout can
-- no longer be paid. This is what releases a held place.

create function booking.process_checkout_expired(
  p_event_id text,
  p_event_type text,
  p_stripe_checkout_session_id text,
  p_livemode boolean,
  p_booking_reference text default null
)
returns jsonb
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_has_reference boolean := length(btrim(coalesce(p_booking_reference, ''))) > 0;
  v_booking_id uuid;
  v_payment booking.payments%rowtype;
  v_booking booking.bookings%rowtype;
  v_has_payment boolean;
begin
  if not booking._register_stripe_event(p_event_id, p_event_type, p_livemode, p_stripe_checkout_session_id) then
    return booking._event_result(p_event_id, true);
  end if;
  if not booking._environment_matches(p_livemode) then
    return booking._finish_stripe_event(p_event_id, 'ignored_environment_mismatch', null);
  end if;

  select p.booking_id into v_booking_id
    from booking.payments p
   where p.stripe_checkout_session_id = p_stripe_checkout_session_id;
  v_has_payment := found;
  if not v_has_payment then
    if not v_has_reference then
      return booking._finish_stripe_event(p_event_id, 'ignored_unknown_session', null);
    end if;
    v_booking_id := booking._booking_id_from_reference(p_booking_reference);
  end if;

  select * into v_booking from booking.bookings b where b.id = v_booking_id for update;
  if not found then
    -- Nothing was paid, so there is nothing to alert about.
    return booking._finish_stripe_event(p_event_id, 'unrecognised_booking_reference', null);
  end if;

  if v_has_payment then
    select * into v_payment
      from booking.payments p
     where p.stripe_checkout_session_id = p_stripe_checkout_session_id
       for update;
    -- Anything other than "still waiting for payment" is left alone: a
    -- booking that has been paid is never undone by a late expiry event.
    if v_payment.status <> 'created' or v_booking.status <> 'pending' then
      return booking._finish_stripe_event(p_event_id, 'ignored_not_pending', v_booking.id);
    end if;
    update booking.payments set status = 'expired' where id = v_payment.id;
    perform booking._release_booking(v_booking.id, 'expired', 'checkout_expired', 'webhook');
    return booking._finish_stripe_event(p_event_id, 'expired', v_booking.id);
  end if;

  -- The expired Checkout was never recorded here. It is this booking's
  -- Checkout only if the booking is still waiting, had Checkout started, and
  -- has no other Checkout recorded.
  if v_booking.status = 'pending'
     and v_booking.checkout_started_at is not null
     and not exists (select 1 from booking.payments p where p.booking_id = v_booking.id) then
    perform booking._release_booking(v_booking.id, 'expired', 'checkout_expired', 'webhook');
    return booking._finish_stripe_event(p_event_id, 'expired', v_booking.id);
  end if;

  return booking._finish_stripe_event(p_event_id, 'ignored_not_pending', v_booking.id);
end;
$$;

-- process_refund --------------------------------------------------------------
-- Records Stripe's latest status for one refund that the administrator issued
-- in Stripe. Call it for every refund event (created, updated, failed), passing
-- the refund's current status. Only refunds with status 'succeeded' count
-- towards the payment's refunded total, so a refund that later fails or is
-- cancelled is taken back out and the payment's status is corrected.
-- It does not cancel places: whether a refunded child keeps a place is the
-- administrator's separate decision.

create function booking.process_refund(
  p_event_id text,
  p_event_type text,
  p_stripe_payment_intent_id text,
  p_stripe_refund_id text,
  p_amount_pence integer,
  p_refund_status text,
  p_stripe_reason text,
  p_livemode boolean
)
returns jsonb
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_booking_id uuid;
  v_payment booking.payments%rowtype;
  v_previous_status text;
  v_refunded integer;
  v_received integer;
  v_alert text;
  v_outcome text;
begin
  if not booking._register_stripe_event(p_event_id, p_event_type, p_livemode, p_stripe_refund_id) then
    return booking._event_result(p_event_id, true);
  end if;
  if not booking._environment_matches(p_livemode) then
    return booking._finish_stripe_event(p_event_id, 'ignored_environment_mismatch', null);
  end if;
  if p_stripe_refund_id is null or p_amount_pence is null or p_amount_pence <= 0
     or p_refund_status is null
     or p_refund_status not in ('pending', 'requires_action', 'succeeded', 'failed', 'canceled') then
    raise exception 'INVALID_REFUND';
  end if;

  select p.booking_id into v_booking_id
    from booking.payments p
   where p.stripe_payment_intent_id = p_stripe_payment_intent_id;
  if not found then
    return booking._finish_stripe_event(p_event_id, 'ignored_unknown_payment', null);
  end if;

  -- Lock order: booking, then payment.
  perform 1 from booking.bookings b where b.id = v_booking_id for update;
  select * into v_payment
    from booking.payments p
   where p.stripe_payment_intent_id = p_stripe_payment_intent_id
     for update;

  select r.status into v_previous_status
    from booking.payment_refunds r
   where r.stripe_refund_id = p_stripe_refund_id;

  if v_previous_status is not distinct from p_refund_status then
    -- The same refund in the same state, reported by a different event.
    return booking._finish_stripe_event(p_event_id, 'refund_unchanged', v_booking_id);
  end if;

  insert into booking.payment_refunds (payment_id, stripe_refund_id, amount_pence, status, stripe_reason)
  values (v_payment.id, p_stripe_refund_id, p_amount_pence, p_refund_status,
          case when p_stripe_reason ~ '^[a-z_]{1,60}$' then p_stripe_reason end)
  on conflict (stripe_refund_id) do update
    set status = excluded.status, amount_pence = excluded.amount_pence;

  select coalesce(sum(r.amount_pence), 0) into v_refunded
    from booking.payment_refunds r
   where r.payment_id = v_payment.id
     and r.status = 'succeeded';
  v_received := coalesce(v_payment.amount_received_pence, v_payment.amount_pence);

  update booking.payments
     set refunded_pence = v_refunded,
         status = case
           when status not in ('paid', 'partially_refunded', 'refunded') then status
           when v_refunded = 0 then 'paid'
           when v_refunded >= v_received then 'refunded'
           else 'partially_refunded'
         end
   where id = v_payment.id;

  if p_refund_status = 'succeeded' then
    v_alert := 'refund_recorded';
    v_outcome := 'refund_recorded';
  elsif p_refund_status in ('failed', 'canceled') then
    v_alert := 'refund_failed';
    v_outcome := 'refund_failure_recorded';
  else
    v_outcome := 'refund_pending_recorded';
  end if;

  if v_alert is not null then
    perform booking._raise_admin_alert(v_booking_id, v_alert);
  end if;

  perform booking.write_audit('payment', v_payment.id, v_outcome, 'webhook', null,
    jsonb_build_object('booking_id', v_booking_id, 'refund_status', p_refund_status,
      'amount_pence', p_amount_pence, 'refunded_total_pence', v_refunded));

  return booking._finish_stripe_event(p_event_id, v_outcome, v_booking_id);
end;
$$;

-- School clubs booking system: 03 - fixed reason codes.
--
-- Every "why did this happen" recorded against a booking, a place or an audit
-- entry is one of the codes below, never free text. That keeps names, phone
-- numbers and other personal details out of records that are kept
-- permanently. Where an administrator needs to write a sentence, it goes in a
-- separate note column that anonymisation clears.

create table booking.reason_codes (
  code text primary key,
  description text not null,
  constraint reason_codes_format check (code ~ '^[a-z][a-z0-9_]{2,59}$')
);

insert into booking.reason_codes (code, description) values
  -- Why an unpaid booking ended
  ('superseded_by_new_request',          'Parent submitted again before Checkout had been started'),
  ('hold_lapsed_before_checkout',        'Reservation was never taken to Checkout'),
  ('checkout_never_attached',            'Checkout was started but never recorded, and its deadline has passed'),
  ('checkout_not_created',               'Stripe could not create the Checkout'),
  ('checkout_expired',                   'Stripe reported the Checkout expired unpaid'),
  ('checkout_expired_verified',          'Reconciliation confirmed with Stripe that the Checkout expired unpaid'),
  -- Why a paid booking needs the administrator
  ('amount_mismatch',                    'Amount paid differs from the booking total'),
  ('currency_mismatch',                  'Paid in a currency other than pounds sterling (gbp), or with no currency stated'),
  ('checkout_completed_without_payment', 'Stripe completed the Checkout with nothing charged (no_payment_required)'),
  ('paid_after_hold_ended_no_capacity',  'Paid after the places were released and the session is now full'),
  ('paid_for_cancelled_club_or_session', 'Paid for a club or session that has been cancelled'),
  ('paid_child_already_placed',          'Paid, but the child now has a place on that session another way'),
  ('payment_for_unexpected_state',       'Payment received for a booking that was not awaiting payment'),
  ('duplicate_payment',                  'A second payment was received for the same booking'),
  ('confirmed_after_hold_ended',         'Confirmed from a payment that arrived after the hold had ended'),
  ('payment_without_checkout_record',    'Payment recognised from its booking reference before Checkout was recorded'),
  ('refund_recorded',                    'A refund issued in Stripe was recorded'),
  ('refund_failed',                      'A refund previously reported by Stripe failed or was cancelled'),
  -- Alerts that are not about one booking
  ('unmatched_payment',                  'A paid Stripe Checkout carried a booking reference this database does not hold'),
  ('payment_environment_mismatch',       'A paid Stripe event arrived in the wrong mode (test or live) for this database'),
  ('club_below_minimum',                 'A club had fewer definite children than its minimum at the enrolment deadline'),
  -- Administrator actions
  ('cancelled_by_admin',                 'Place cancelled by the administrator'),
  ('booking_cancelled_by_admin',         'Booking cancelled by the administrator'),
  ('session_cancelled',                  'Session cancelled by the administrator'),
  ('club_cancelled',                     'Club cancelled by the administrator'),
  ('parent_request',                     'Changed at the parent''s request'),
  ('duplicate_booking',                  'Removed as a duplicate booking'),
  ('administrative_correction',          'Administrative correction'),
  ('child_records_merged',               'Two child records were merged by the administrator'),
  ('child_record_split',                 'A child record was split in two by the administrator'),
  ('other',                              'Other (see the administrator''s note)');

create function booking._require_reason_code(p_code text)
returns void
language plpgsql
stable
set search_path = booking, pg_temp
as $$
begin
  if p_code is null or not exists (select 1 from booking.reason_codes r where r.code = p_code) then
    raise exception 'INVALID_REASON_CODE';
  end if;
end;
$$;

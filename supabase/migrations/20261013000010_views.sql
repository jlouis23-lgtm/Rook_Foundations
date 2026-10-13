-- School clubs booking system: 10 - read-only views.
-- All views run with the caller's own permissions (security_invoker), so they
-- can never be used to read around Row Level Security.

-- Places taken and remaining for every session. Held places count as taken.
create view booking.session_availability
with (security_invoker = true) as
select
  s.id as session_id,
  s.club_id,
  s.starts_at,
  s.ends_at,
  s.status,
  s.capacity,
  coalesce(t.places_taken, 0)::integer as places_taken,
  greatest(s.capacity - coalesce(t.places_taken, 0), 0)::integer as places_remaining
from booking.club_sessions s
left join (
  select a.session_id, count(*) as places_taken
    from booking.session_allocations a
   where a.status in ('held', 'confirmed')
   group by a.session_id
) t on t.session_id = s.id;

-- Every distinct child record with a confirmed place on a session of a club
-- that has not been cancelled.
create view booking.club_enrolled_children
with (security_invoker = true) as
select distinct s.club_id, a.child_id
  from booking.session_allocations a
  join booking.club_sessions s on s.id = a.session_id
 where a.status = 'confirmed'
   and s.status <> 'cancelled';

-- Pairs of enrolled child records in the same club that MIGHT be the same
-- child and have not been decided by the administrator. A pair appears when
--   * both records have the same first name and surname (whatever the year
--     group or the parent's email), or
--   * the administrator has flagged the pair and not yet decided.
-- A pair the administrator has marked 'distinct' no longer appears.
-- This view only points at pairs to look at. Nothing is ever merged from it.
create view booking.possible_duplicate_children
with (security_invoker = true) as
with named as (
  select e.club_id, e.child_id,
         lower(btrim(ch.first_name)) || ' ' || lower(btrim(ch.surname)) as name_key
    from booking.club_enrolled_children e
    join booking.children ch on ch.id = e.child_id
   where ch.anonymised_at is null
)
select n1.club_id, n1.child_id as child_a_id, n2.child_id as child_b_id, 'same_name'::text as source
  from named n1
  join named n2
    on n2.club_id = n1.club_id
   and n2.name_key = n1.name_key
   and n1.child_id < n2.child_id
 where not exists (
   select 1 from booking.child_duplicate_flags f
    where f.child_a_id = n1.child_id and f.child_b_id = n2.child_id
      and f.status in ('distinct', 'merged')
 )
union
select e1.club_id, f.child_a_id, f.child_b_id, 'admin_flag'::text
  from booking.child_duplicate_flags f
  join booking.club_enrolled_children e1 on e1.child_id = f.child_a_id
  join booking.club_enrolled_children e2 on e2.child_id = f.child_b_id and e2.club_id = e1.club_id
 where f.status = 'open';

-- Minimum-enrolment count.
--   enrolled_children     distinct child RECORDS with a confirmed place
--   possible_duplicates   how many of those records might be a second record
--                         for a child already counted (undecided pairs)
--   definite_children     enrolled_children - possible_duplicates
--   count_is_provisional  true while any possible duplicate is undecided
--   meets_minimum         judged on definite_children, so a possible
--                         duplicate is never treated as a definite extra child
-- A child with six sessions counts once; two siblings count as two. Held,
-- released and cancelled places do not count.
create view booking.club_enrolment
with (security_invoker = true) as
select
  c.id as club_id,
  c.min_children,
  c.enrolment_deadline,
  c.review_status,
  coalesce(e.enrolled_children, 0)::integer as enrolled_children,
  coalesce(d.possible_duplicates, 0)::integer as possible_duplicates,
  greatest(coalesce(e.enrolled_children, 0) - coalesce(d.possible_duplicates, 0), 0)::integer as definite_children,
  coalesce(d.possible_duplicates, 0) > 0 as count_is_provisional,
  greatest(coalesce(e.enrolled_children, 0) - coalesce(d.possible_duplicates, 0), 0) >= c.min_children as meets_minimum
from booking.clubs c
left join (
  select club_id, count(*) as enrolled_children
    from booking.club_enrolled_children
   group by club_id
) e on e.club_id = c.id
left join (
  -- Counting the higher-ID record of each undecided pair gives, for a group
  -- of N same-named records, N-1 possible duplicates.
  select club_id, count(distinct child_b_id) as possible_duplicates
    from booking.possible_duplicate_children
   group by club_id
) d on d.club_id = c.id;

-- Unpaid bookings with a recorded Stripe Checkout that should have expired by
-- now but for which no verified outcome has arrived. Their places stay held.
-- The scheduled job must ask Stripe what happened to each one and then call
-- expire_booking_after_stripe_check or the normal payment function.
create view booking.bookings_awaiting_reconciliation
with (security_invoker = true) as
select
  b.id as booking_id,
  b.reference,
  b.club_id,
  b.hold_expires_at,
  p.stripe_checkout_session_id,
  p.checkout_expires_at,
  p.livemode
from booking.bookings b
join booking.payments p on p.booking_id = b.id
where b.status = 'pending'
  and p.status = 'created'
  and p.checkout_expires_at < now();

-- Emails that are owed and have not been recorded as sent. SQL never sends
-- email: a Netlify Function reads this view, sends each message and then
-- calls mark_confirmation_email_sent or mark_admin_alert_sent.
--
-- message_key is a stable, unique key for each message. Pass it to the email
-- provider as its idempotency key: if a message is sent but recording it as
-- sent fails, the retry carries the same key and the provider does not send
-- a second copy.
create view booking.outstanding_messages
with (security_invoker = true) as
select
  'booking_confirmation'::text as message_type,
  'booking-confirmation-' || b.id::text as message_key,
  b.id as booking_id,
  b.club_id,
  null::text as stripe_event_id,
  null::uuid as alert_id,
  null::text as code,
  b.confirmed_at as required_at
from booking.bookings b
where b.status = 'confirmed'
  and b.confirmation_email_sent_at is null
union all
select
  'admin_alert',
  'admin-alert-' || a.id::text,
  a.booking_id,
  coalesce(a.club_id, b.club_id),
  a.stripe_event_id,
  a.id,
  a.alert_code,
  a.created_at
from booking.admin_alerts a
left join booking.bookings b on b.id = a.booking_id
where a.sent_at is null;

-- Material inconsistencies between payments, refunds, bookings and places.
-- An empty result means the records agree. Rows are for the administrator to
-- look at; nothing acts on them automatically.
create view booking.reconciliation_issues
with (security_invoker = true) as
with pay as (
  select
    p.booking_id,
    count(*) filter (where p.status in ('paid', 'partially_refunded', 'refunded')) as paid_payments,
    coalesce(sum(p.amount_received_pence) filter (where p.status in ('paid', 'partially_refunded', 'refunded')), 0) as received_pence,
    coalesce(sum(p.refunded_pence), 0) as refunded_pence
  from booking.payments p
  group by p.booking_id
),
live as (
  select a.booking_id, count(*) as live_places
    from booking.session_allocations a
   where a.status in ('held', 'confirmed')
   group by a.booking_id
),
b as (
  select
    bk.id as booking_id, bk.reference, bk.club_id, bk.status, bk.total_pence,
    coalesce(pay.paid_payments, 0) as paid_payments,
    coalesce(pay.received_pence, 0) as received_pence,
    coalesce(pay.refunded_pence, 0) as refunded_pence,
    coalesce(live.live_places, 0) as live_places
  from booking.bookings bk
  left join pay on pay.booking_id = bk.id
  left join live on live.booking_id = bk.id
)
select 'awaiting_review'::text as issue, booking_id, reference, club_id, status, received_pence, refunded_pence, live_places
  from b where status = 'needs_review'
union all
select 'paid_but_not_confirmed', booking_id, reference, club_id, status, received_pence, refunded_pence, live_places
  from b where status in ('pending', 'expired', 'failed') and paid_payments > 0
union all
select 'cancelled_but_not_fully_refunded', booking_id, reference, club_id, status, received_pence, refunded_pence, live_places
  from b where status = 'cancelled' and paid_payments > 0 and refunded_pence < received_pence
union all
select 'confirmed_without_payment', booking_id, reference, club_id, status, received_pence, refunded_pence, live_places
  from b where status = 'confirmed' and paid_payments = 0
union all
select 'fully_refunded_but_places_kept', booking_id, reference, club_id, status, received_pence, refunded_pence, live_places
  from b where paid_payments > 0 and received_pence > 0 and refunded_pence >= received_pence and live_places > 0
union all
select 'more_than_one_payment', booking_id, reference, club_id, status, received_pence, refunded_pence, live_places
  from b where paid_payments > 1
union all
select 'amount_received_differs_from_total', booking_id, reference, club_id, status, received_pence, refunded_pence, live_places
  from b where paid_payments = 1 and received_pence <> total_pence
union all
select 'places_kept_by_ended_booking', booking_id, reference, club_id, status, received_pence, refunded_pence, live_places
  from b where status in ('expired', 'failed', 'cancelled') and live_places > 0
union all
select 'paid_in_unexpected_currency', bk.id, bk.reference, bk.club_id, bk.status,
       coalesce(sum(p.amount_received_pence), 0), coalesce(sum(p.refunded_pence), 0), 0
  from booking.payments p
  join booking.bookings bk on bk.id = p.booking_id
 where p.status in ('paid', 'partially_refunded', 'refunded')
   and p.currency <> 'gbp'
 group by bk.id, bk.reference, bk.club_id, bk.status
union all
select 'confirmed_place_in_cancelled_club_or_session', bk.id, bk.reference, bk.club_id, bk.status, 0, 0, count(*)
  from booking.session_allocations a
  join booking.bookings bk on bk.id = a.booking_id
  join booking.club_sessions s on s.id = a.session_id
  join booking.clubs c on c.id = s.club_id
 where a.status in ('held', 'confirmed')
   and (s.status = 'cancelled' or c.status = 'cancelled')
 group by bk.id, bk.reference, bk.club_id, bk.status;

-- Contacts whose personal data has passed its retention period. Listing here
-- does not change anything: anonymise_contact must be called for each.
--
-- A contact's "last session" is found two ways and the later one is used:
--   * through the contact's own BOOKINGS (so places they paid for still count
--     after the child record was merged into another family's record), and
--   * through the contact's own CHILDREN (so places another family booked for
--     a child now held under this contact count too).
create view booking.contacts_eligible_for_anonymisation
with (security_invoker = true) as
select
  c.id as contact_id,
  x.last_session_end,
  x.last_booking_at,
  case when x.last_session_end is not null then 'retention_period_elapsed'
       else 'never_confirmed' end as reason
from booking.contacts c
cross join booking.app_config cfg
cross join lateral (
  select
    (select max(s.ends_at)
       from booking.session_allocations a
       join booking.club_sessions s on s.id = a.session_id
      where a.confirmed_at is not null
        and (a.booking_id in (select b.id from booking.bookings b where b.contact_id = c.id)
             or a.child_id in (select ch.id from booking.children ch where ch.contact_id = c.id))
    ) as last_session_end,
    (select max(b.created_at)
       from booking.bookings b
      where b.contact_id = c.id) as last_booking_at
) x
where c.anonymised_at is null
  and not exists (
    select 1 from booking.bookings b
     where b.contact_id = c.id
       and b.status in ('pending', 'needs_review')
  )
  and (
    (x.last_session_end is not null
      and x.last_session_end < now() - make_interval(months => cfg.personal_data_retention_months))
    or
    (x.last_session_end is null
      and coalesce(x.last_booking_at, c.created_at) < now() - make_interval(days => cfg.unconfirmed_contact_retention_days))
  );

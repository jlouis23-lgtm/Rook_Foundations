# School clubs booking database

This document describes the database prepared for the school clubs booking
system. The SQL lives in `supabase/migrations/` and its tests in
`supabase/tests/`.

**Status: prepared, not applied.** These migrations have not been run against
any Supabase project. They have been run only against local, in-memory
PostgreSQL 16, 17 and 18 with stand-ins for the parts Supabase provides (see
[What has and has not been tested](#what-has-and-has-not-been-tested)).
Nothing in the website uses this database yet, and the existing private
booking system is unchanged.

`supabase/schema.sql` is **not** part of this system. It is the schema of the
removed Rook Play feature, kept only as a historical file. Do not run it in the
new project. Deleting a local SQL file never changes a Supabase database, and
editing a migration file after it has been applied does not change the database
either: a change to an applied database always needs a new migration.

The migrations in this folder were revised in place after a review, which was
safe only because they had never been applied anywhere. **Once they have been
applied to any database, do not edit them again; add a new numbered migration
instead.**

## How the pieces fit

- **Supabase PostgreSQL** is the authoritative record of clubs, places,
  bookings and payments.
- **Netlify Functions** are the only way in. They use the Supabase service-role
  key, which stays on the server. Browsers never connect to this database.
- **Stripe** takes payments. The database stores its own record of each
  payment and refund for reconciliation.
- **Emails** are sent by Netlify Functions. No SQL function sends email; the
  database only records what is owed and what has been sent.
- Parents and schools have no accounts. The only sign-in is the administrator's.

## Migrations

Apply in filename order, all as the same database role, by one method only
(either the SQL editor or the Supabase command-line tool, not a mixture).

| # | File | Purpose |
|---|---|---|
| 01 | `…000001_booking_schema_and_privileges.sql` | The `booking` schema, browser roles shut out, no default privileges, the isolation-level guard |
| 02 | `…000002_config_and_admins.sql` | `app_config` (single row of settings) and `admin_users` (allowlist) |
| 03 | `…000003_reason_codes.sql` | The fixed list of reason codes |
| 04 | `…000004_venues_clubs_sessions.sql` | `venues`, `clubs`, `club_sessions` |
| 05 | `…000005_contacts_children.sql` | `contacts`, `children`, `child_duplicate_flags` |
| 06 | `…000006_bookings_allocations.sql` | `bookings`, `session_allocations`, the duplicate-place rule, capacity triggers, protection of booked clubs and sessions |
| 07 | `…000007_payments_refunds_stripe_events.sql` | `payments`, `payment_refunds`, `stripe_events`, `admin_alerts` |
| 08 | `…000008_audit_log.sql` | Append-only `audit_log`, its content rules, and audit triggers for venues, clubs and sessions |
| 09 | `…000009_row_level_security.sql` | Row Level Security on every table |
| 10 | `…000010_views.sql` | Availability, enrolment, duplicates, reconciliation, messages, retention |
| 11 | `…000011_booking_functions.sql` | Reserve, begin Checkout, attach Checkout, release holds |
| 12 | `…000012_payment_functions.sql` | Stripe webhook processing |
| 13 | `…000013_admin_functions.sql` | Administrator actions |
| 14 | `…000014_maintenance_children_and_privacy_functions.sql` | Enrolment flagging, message tracking, retention, the scheduled job's entry point, child record review, pseudonymisation |
| 15 | `…000015_privileges.sql` | Every privilege set explicitly, and the schema's security self-check |

## Tables and relationships

```
venues ──< clubs ──< club_sessions ──< session_allocations >── children >── contacts
                │                              │                  │            │
                └────────< bookings >──────────┘      child_duplicate_flags    │
                              │  └────────────────────────────────────────────┘
                              └──< payments ──< payment_refunds

admin_alerts (about a booking, a club or a Stripe event)
stripe_events   audit_log   reason_codes   admin_users   app_config   (stand-alone)
```

| Table | What one row is |
|---|---|
| `venues` | A school or venue |
| `clubs` | A bookable club: price per session, block discount %, default capacity, minimum children (default 8), enrolment deadline, status, review status |
| `club_sessions` | One dated meeting, with its own capacity and status. A club has as many as it needs |
| `contacts` | A parent or guardian, one per email address |
| `children` | One child: first name, surname, school year group. Nothing else |
| `child_duplicate_flags` | The administrator's decision about a pair of child records that might be the same child |
| `bookings` | One checkout by one contact for one club, for any number of children |
| `session_allocations` | One child's place on one session |
| `payments` | One Stripe Checkout session and its payment |
| `payment_refunds` | One Stripe refund and its latest status |
| `stripe_events` | One Stripe webhook event that has been dealt with |
| `admin_alerts` | One thing the administrator needs to be told, and whether it has been sent |
| `audit_log` | One recorded change (IDs, statuses, codes and amounts only) |
| `reason_codes` | The fixed list of reasons |
| `admin_users` | One authorised administrator |
| `app_config` | The single row of settings |

Money is always whole pence. Times are `timestamptz` and shown in UK time.

### The four things that are easy to confuse

- A **booking** is the transaction a parent made.
- An **allocation** is one seat on one date. Capacity counts these.
- An **enrolled child** is a distinct child with at least one confirmed
  allocation in a club. The minimum threshold counts these.
- A **payment** is the money. It can be refunded without the booking record
  disappearing.

### Statuses

| Record | Statuses |
|---|---|
| Club | `draft`, `published` (visible, bookable), `unpublished` (hidden), `closed` (visible, no new bookings), `cancelled` |
| Club review | `none`, `flagged`, `proceed`, `postponed`, `cancelled` |
| Session | `open`, `closed`, `cancelled` |
| Booking | `pending`, `confirmed`, `expired`, `failed`, `needs_review`, `cancelled` |
| Allocation | `held`, `confirmed`, `released`, `cancelled` |
| Payment | `created`, `paid`, `expired`, `partially_refunded`, `refunded`, `no_payment`, and `failed` (see below) |
| Refund | `pending`, `requires_action`, `succeeded`, `failed`, `canceled` (Stripe's own values) |

**`no_payment`** records a Checkout that Stripe completed with nothing charged.
That should never happen, because the booking function must not enable
promotion codes or discounts. If it does, the payment is never treated as
paid and the booking goes to the administrator for review.

**Unused payment state.** `failed` is reserved and is not set by any function.
With card-only Checkout a declined card leaves the session open for another
attempt, and it ends as `paid` or `expired`. The value is kept for a possible
future payment method that settles later.

### Settings (`app_config`)

| Setting | Default | Meaning |
|---|---|---|
| `environment` | `test` | `test` or `production`. Stops test payments reaching the production database and the reverse |
| `unattached_hold_minutes` | 10 | How long a reservation is kept before Checkout has been started |
| `checkout_minutes` | 35 | How long Stripe Checkout stays open (Stripe's minimum is 30) |
| `hold_minutes` | 50 | How long places are kept once Checkout has been started. Must exceed `checkout_minutes` by at least 10 |
| `max_children_per_booking` | 6 | |
| `personal_data_retention_months` | 12 | Used by the retention view |
| `unconfirmed_contact_retention_days` | 30 | Used by the retention view |
| `financial_retention_years` | 6 | **Informational only.** Nothing reads it and nothing deletes financial records |

## Capacity and allocations

`session_allocations` is the only table capacity is counted from. A place is
"taken" when its status is `held` or `confirmed`. Block bookings and
individual bookings both write the same rows, so they share capacity by
construction.

- A **block booking** must include every session of the club, and is refused
  once any session has started. The club's discount is applied to each place.
- An **individual booking** names specific open sessions that have not
  started, at the standard price.
- The discount is applied per place and rounded to a whole penny; the booking
  total is the sum of its places, so the two always agree.
- Prices come from the club's own record inside the database. Nothing the
  browser sends about price is used.

### How concurrent bookings are protected

`booking.reserve_booking` does the whole reservation in one transaction:

1. It **locks the requested session rows**, always in ID order. A second
   request for any of the same sessions waits until the first has finished.
2. It checks no child already has a live place on any requested session.
3. It checks **every** session has room for **every** child.
4. Only then does it write the booking and one `held` place per child per
   session.

Any failure rolls the whole transaction back, so a request for three children
across six sessions gets eighteen places or none.

Two further guards sit underneath, in case any other code ever writes to the
table:

- a unique index allowing one live place per child per session;
- a trigger that locks the session and refuses any write that would take it
  over capacity.

A session's capacity cannot be lowered below the places already taken.

### Isolation level

Locking a session and then counting its places is correct only at PostgreSQL's
default **read committed** level. At a stricter level the count would use an
older snapshot and could miss a place just taken by someone else. This is not
left as an assumption: `reserve_booking`, the confirmation function and both
capacity triggers call `booking._require_read_committed()` and refuse to run
(`WRONG_ISOLATION_LEVEL`) at any other level. If Supabase's default were ever
changed, bookings would fail loudly instead of overbooking quietly.

### Lock order

Every function takes locks in the same order, so they cannot deadlock each
other:

**booking row → payment row → session rows (in ID order)**

In particular `reserve_booking` looks at the contact's earlier pending booking
*before* it locks any session, and the webhook functions lock the booking
before the payment and the sessions. A parent paying and resubmitting at the
same moment therefore queue behind one another instead of deadlocking.

## The booking and Checkout sequence

The Netlify Function must follow this order:

1. `reserve_booking` holds the places for a short time (10 minutes).
2. `begin_checkout` records that Stripe is **about to be called**, sets the
   latest allowed Checkout expiry (35 minutes from now) and extends the hold
   to 50 minutes from now. It returns `checkout_expires_at_unix` and
   `stripe_idempotency_key`.
3. Stripe: create the Checkout session with
   - `client_reference_id` = the booking ID,
   - `expires_at` = `checkout_expires_at_unix`, passed through unchanged,
   - the `Idempotency-Key` header = `stripe_idempotency_key`,
   - no child names in metadata.
4. `attach_checkout_session` records the Stripe session ID.
5. Only now give the parent the Checkout address.

If Stripe answers step 3 with a definite error, call `fail_booking`. If step 3
or 4 is uncertain (a timeout or a crash), do nothing: the places stay held
until the deadline has safely passed.

Three details make this robust:

- **No rounding.** The deadline is stored as a whole number of seconds, which
  is what Stripe accepts. `checkout_expires_at_unix` goes to Stripe as it is,
  and the value Stripe returns is accepted by `attach_checkout_session`.
- **A retry cannot create a second Checkout.** Because the idempotency key is
  fixed for the booking, repeating the Stripe call after a timeout returns the
  original session. If `begin_checkout` reports `replayed: true`, Checkout was
  already started; the caller may repeat the Stripe call only with the same
  key and the same expiry, and must never create a new one.
- **A fresh deadline every time.** The deadline is counted from
  `begin_checkout`, so a request retried minutes after the places were
  reserved still gives Stripe its full Checkout time.

### Knowing whether a booking can go to Checkout

`reserve_booking` and `begin_checkout` both return `checkout_state` and
`can_proceed_to_checkout`. A repeated request key returns the same booking,
which may have moved on, so the caller must check these every time.

| `checkout_state` | Meaning | `can_proceed_to_checkout` |
|---|---|---|
| `not_started` | Reserved; `begin_checkout` may be called | true |
| `open` | Checkout started and its deadline has not passed | true |
| `hold_expired` | Reserved, but the short hold ran out before Checkout was started | false |
| `deadline_passed` | Checkout was started but its time has run out | false |
| `ended` | Confirmed, under review, expired, failed or cancelled | false |

When it is false the caller must not call Stripe and must not send the parent
to any payment page. A parent is therefore never directed to an expired
payment session.

`deadline_passed` does **not** release the booking. A payment may have
succeeded just before the deadline and still be on its way, so the places stay
held until Stripe confirms what happened (or, for a Checkout that was never
recorded, until the safety margin has passed).

### When a parent tries again

A new booking attempt by a contact who already has an unpaid booking for the
same club gets one of three outcomes:

| Earlier booking | Outcome | What to tell the parent |
|---|---|---|
| Checkout never started; or started, never recorded, and its 50-minute hold has run out | It is released and the new booking proceeds | Nothing; they simply continue |
| Checkout still open | `PENDING_BOOKING_EXISTS`; nothing changes | Send them back to their open Checkout |
| Checkout deadline passed but not yet safe to release | `PREVIOUS_CHECKOUT_CLOSING`; nothing changes | "Your earlier payment session timed out. If you paid, you will receive a confirmation. Otherwise please try again in a few minutes." |

The third case clears as soon as Stripe's expiry event arrives or the
scheduled job reconciles it, normally within minutes of the deadline. For a
Checkout that was never recorded it clears at most 15 minutes after the
deadline.

### A Checkout in Stripe is never an unrecorded payment

There is always a moment when a payable Checkout exists in Stripe but the
database has not yet been told its session ID. Three rules cover it:

- **The booking knows first.** `begin_checkout` marks the booking before
  Stripe is called, so the database always knows a Checkout may exist.
- **A repeated booking never replaces a payable one.** If the contact
  already has a pending booking for the club whose Checkout may still be paid,
  `reserve_booking` raises `PENDING_BOOKING_EXISTS` and changes nothing. It
  replaces an earlier pending booking only when that booking can no longer be
  paid: Checkout was never started, or Checkout was started but never
  recorded and its hold has run out (the same rule the scheduled job uses).
  A booking with a recorded Checkout is never replaced.
- **Payments are matched by booking reference as well as session ID.** The
  webhook passes the Checkout's `client_reference_id` exactly as it appears,
  as text. If no payment row exists for the session, the payment is recorded
  against that booking and handled normally. It is never ignored.

A session with no recorded Checkout and no reference is not one of ours (for
example a private booking on the same Stripe account) and is ignored. A
session whose reference is malformed, or names a booking this database does
not hold, is **not** treated as a booking: nothing is created, no error is
raised for Stripe to retry, and if it was paid an alert is raised for the
administrator.

### What counts as a payment that confirms a booking

A booking is confirmed automatically only by an event with payment status
`paid`, in pounds sterling (Stripe currency code `gbp`), for exactly the
booking total. Anything else Stripe reports as complete is recorded and sent
to the administrator, never confirmed automatically:

| What arrived | Recorded as | Booking |
|---|---|---|
| Paid in another currency, or with no currency stated | Payment `paid`, in the currency it arrived in | `needs_review` (`currency_mismatch`) |
| Paid in pounds but a different amount | Payment `paid` | `needs_review` (`amount_mismatch`) |
| Completed with nothing charged (`no_payment_required`) | Payment `no_payment`, amount 0 | `needs_review` (`checkout_completed_without_payment`), places still held |
| Any other status, for example `unpaid` | Nothing | Unchanged; a later event will say how it ended |

The currency is checked before the amount, because a number in another
currency cannot be compared with the booking total. A booking under review is
not left pending, is not counted towards enrolment, and is not released by the
clock; the administrator confirms or cancels it.

A **paid event in the wrong mode** (a live payment arriving at a database
still set to `test`, or the reverse) is recorded against no booking, and an
alert is raised. This should only happen if the environment setting or the
webhook has been misconfigured.

## Holds, expiry and late payments

A held place is never released while a related Stripe Checkout could still be
paid.

| Situation | What releases the places |
|---|---|
| Checkout never started | `release_unattached_holds`, after `unattached_hold_minutes`. Stripe was never called, so nothing can be paid |
| Checkout started, never recorded | `release_unattached_holds`, only after the 50-minute hold. Any Checkout must have expired at least 10 minutes earlier. The same parent submitting again after that point releases it at once, by the same rule |
| Checkout recorded | Only the verified `checkout.session.expired` webhook, or the reconciliation job after Stripe confirms the session expired unpaid (`expire_booking_after_stripe_check`). Never the clock alone |
| Stripe definitely created nothing | `fail_booking`, at once |

Bookings whose recorded Checkout should have expired but have no verified
outcome are listed in `booking.bookings_awaiting_reconciliation`.

The second row depends on the caller keeping its promise that `expires_at` is
no later than `checkout_deadline_at`. The database cannot check a Checkout it
was never told about. If that promise were ever broken, the payment would
still be matched by booking ID and handled as a late payment below.

**Payment arriving after the places were released:**

1. The payment is recorded as paid.
2. The booking's sessions are locked and its places are taken again only if
   every one still fits within capacity.
3. If they fit, the booking is confirmed, the contact details the parent
   typed are applied (they were kept for this purpose), and the administrator
   is told.
4. If they do not, nothing is allocated and the booking becomes
   `needs_review`. **No refund is issued automatically and capacity is never
   exceeded.**

A payment is also sent to `needs_review`, not confirmed, when:

- the amount differs from the booking total;
- the club or any of its sessions has been cancelled, even if the places were
  still held;
- the child has since been given a place on that session another way.

The administrator can then resolve the cause and confirm
(`admin_confirm_reviewed_booking`), or cancel and refund in Stripe.

A second payment for a booking that has already been paid is recorded as its
own payment row, the booking is left as it is, and the administrator is
alerted.

## Duplicate webhooks, failures and email retries

Each webhook event is handled by one function call, which is one transaction.
The `stripe_events` row and every booking and payment change are saved
together or not at all.

- A repeat delivery finds the event row and changes nothing.
- A failure part-way leaves no event row, so Stripe's retry is processed.
- Checkout session IDs, payment intent IDs and refund IDs are each unique.

**Emails survive a crash.** Every webhook function returns `send_confirmation`
and `admin_alerts` worked out from what is *still owed*, including on a repeat
delivery. If the first delivery committed but the Netlify Function stopped
before sending the email, Stripe's retry still reports the email as owed.

| Message | Owed when | Recorded sent by |
|---|---|---|
| Parent confirmation | Booking is `confirmed` and `confirmation_email_sent_at` is empty | `mark_confirmation_email_sent(booking_id)` |
| Administrator alert | A row in `admin_alerts` with `sent_at` empty | `mark_admin_alert_sent(alert_id)` |

**Each administrator alert is its own record.** An alert is about a booking,
a club, or (when there is no booking to attach it to) a Stripe event.

- A later alert never replaces an earlier one that has not been sent. A
  booking with an amount mismatch followed by a refund has two alerts owed.
- An alert is marked as sent by its ID. Nothing is matched on timestamps.
- While an alert is unsent, a second identical alert for the same booking is
  not added; the email describes the current state. Once it has been sent, a
  new occurrence raises a new alert.

`booking.outstanding_messages` lists everything owed, for the scheduled job.
Each `mark_*` function returns `true` if it recorded the message and `false`
if nothing was owed, so calling one twice is harmless.

**Avoiding duplicate emails.** If an email is sent but recording it as sent
then fails, it will be offered again. Every owed message therefore carries a
stable `message_key` (`booking-confirmation-<booking ID>` or
`admin-alert-<alert ID>`). The Netlify Function must pass it to the email
provider as the idempotency key, so the provider does not send a second copy.
The provider only remembers a key for a limited time (24 hours with Resend),
so a retry after that could still produce a duplicate; an occasional repeated
email is accepted as better than a missing one.

## Refunds

`process_refund` records Stripe's latest status for one refund. It should be
called for every refund event, passing the refund's current status.

- Only refunds with status `succeeded` count towards the refunded total.
- A refund that Stripe later reports as `failed` or `canceled` is taken back
  out, the payment's status is corrected, and the administrator is alerted.
- A refund never cancels places. Whether a refunded child keeps a place is the
  administrator's separate decision.

## Reconciliation

`booking.reconciliation_issues` lists every booking where the money, the
booking status and the places disagree. An empty view means they agree.

| Issue | Meaning |
|---|---|
| `awaiting_review` | Waiting for the administrator (paid, or completed with nothing charged) |
| `paid_but_not_confirmed` | Money received for a booking that is pending, expired or failed |
| `cancelled_but_not_fully_refunded` | Cancelled, with money still held |
| `confirmed_without_payment` | Confirmed with no paid payment |
| `fully_refunded_but_places_kept` | Refunded in full, but places are still held |
| `more_than_one_payment` | Paid more than once |
| `amount_received_differs_from_total` | Amount paid is not the booking total |
| `places_kept_by_ended_booking` | An expired, failed or cancelled booking still holds places |
| `paid_in_unexpected_currency` | A payment was received in a currency other than pounds |
| `confirmed_place_in_cancelled_club_or_session` | Places remain in a cancelled club or session |

Nothing acts on these automatically.

## Children, possible duplicates and minimum enrolment

### How children are identified

Every child has its own record and ID. There is no uniqueness rule on names,
and **records are never merged automatically**.

When a parent books again, an existing record is reused only if it belongs to
the same contact **and** first name, surname and year group all match **and**
it has not been merged away **and** it has not already been used for another
child in the same request. Two identical entries in one request therefore
always become two children, and are recorded as distinct.

### Possible duplicates

The same child can still end up with two records: a year group typed
differently later, a nickname, or two parents booking with different email
addresses. `booking.possible_duplicate_children` lists pairs of enrolled
records in the same club that might be the same child:

- records with the same first name and surname, whatever the year group or the
  parent's email;
- pairs the administrator has flagged with `admin_flag_possible_duplicate`.

This only points at pairs to look at. The administrator then decides:

| Decision | Function | Effect |
|---|---|---|
| Different children | `admin_mark_children_distinct` | The pair stops being listed |
| The same child | `admin_merge_children` | Every place moves to the kept record; the other is marked merged and never matched again |
| One record is really two children | `admin_split_child` | A new record is created and the chosen places move to it |

`admin_merge_children` is refused if the two records have places on the same
session. The same child cannot attend one session twice, so one of those
places must be dealt with first.

### Minimum enrolment

`booking.club_enrolment` reports, for each club:

| Column | Meaning |
|---|---|
| `enrolled_children` | Distinct child records with a confirmed place on a session that has not been cancelled |
| `possible_duplicates` | How many of those records might be a second record for a child already counted |
| `definite_children` | `enrolled_children` minus `possible_duplicates` |
| `count_is_provisional` | True while any possible duplicate is undecided |
| `meets_minimum` | Judged on `definite_children` |

- A child with six sessions counts once. Two siblings count as two.
- Held, released and cancelled places do not count.
- **A possible duplicate is never counted as a definite extra child.** A club
  with eight records, one of which might be a duplicate, has seven definite
  children and does not meet a minimum of eight until the administrator has
  decided the pair.

`booking.flag_under_enrolled_clubs()` flags clubs whose deadline has passed
with fewer definite children than `min_children`. It checks published and
closed clubs, and also unpublished clubs that have at least one confirmed
place, since a club hidden from parents still has families relying on it.
Draft and cancelled clubs are not checked. Flagging adds an alert for the
administrator to `admin_alerts` in the same transaction. It does
nothing else: no cancellation, no closing of bookings, no message to parents,
no refund. Bookings remain open after the deadline unless the administrator
closes the club. The decision is recorded with `admin_set_club_review`
(`proceed`, `postponed` or `cancelled`), which likewise changes nothing else.

### Remaining limits

- Identically named siblings in the same year group, booked in **separate**
  checkouts, are matched to one record. The second cannot be booked onto the
  same session until the administrator splits the record. This is rare and
  cannot be removed without parent accounts.
- A duplicate with a **different name** (a nickname, a spelling change) is not
  detected. It counts as a definite child unless the administrator flags it.
  The admin screen should list enrolled children by name so this can be seen.

## Changes to clubs and sessions that families have booked

Two changes are refused by the database itself, whichever code attempts them,
while a club or session has any held or confirmed place:

| Change | Refused with |
|---|---|
| Returning a club to `draft` | `CLUB_HAS_BOOKINGS` |
| Changing a session's start time, end time or club | `SESSION_HAS_BOOKINGS` |

A booked club can still be unpublished, closed or cancelled, and a booked
session can still have its capacity or open/closed status changed. A session
or club with no live places can be changed freely.

There is deliberately no function that moves a booked session to a new date.
The explicit route is to cancel the session with `admin_cancel_session`
(audited; it cancels the places on it) and create a new session. Nothing moves
a family's booking to the new date, sends them a message or issues a refund:
those are separate steps for the administrator, and no automatic notification
exists yet.

## Audit log

- The audit log is **append-only**: rows cannot be changed or deleted, even by
  the database owner.
- It is kept permanently, so it must not hold personal data. A trigger refuses
  any entry whose detail is not a flat set of code-like values (IDs, status
  words, reason codes, numbers, timestamps). Sentences, email addresses and
  phone numbers are rejected.
- Every reason is a fixed code from `reason_codes`. Functions refuse anything
  else (`INVALID_REASON_CODE`).
- A sentence from the administrator goes in a note column instead:
  `bookings.admin_note`, which pseudonymisation clears, or `clubs.review_note`.
- **Changes to venues, clubs and sessions are audited by triggers**, in the
  same transaction as the change, whichever code made it. Only allow-listed
  columns (statuses, prices, capacities, dates) are copied; titles,
  descriptions, addresses and notes are not. The `admin_save_*` and
  `admin_set_club_status` functions record which administrator made the
  change; a direct table write is recorded with actor `system`.

Limits of the content rule: it stops free text, addresses and numbers, but a
single word that happens to be a surname would pass as "code-like". The real
protection is that functions only ever write fixed codes, statuses and IDs.
`clubs.review_note` is about a club, is not cleared by pseudonymisation, and
must not be used for details of a person.

## Privacy and retention

- Child data is limited to first name, surname and year group.
- A contact's details are not changed by a new booking. What the parent typed
  waits in `bookings.pending_contact` and is copied to `contacts` only when
  payment is confirmed, then cleared.
- If a booking ends unpaid and Checkout was **never started**, the waiting
  details are cleared at once, because no payment can arrive.
- If it ends unpaid **after Checkout was started**, they are kept: a late
  payment could still confirm the booking, and a confirmed place with no
  emergency contact would be worse than keeping the details a little longer.
  `purge_stale_pending_contacts` removes them once the booking has been ended
  for `unconfirmed_contact_retention_days` (30). A booking under review keeps
  them until the administrator has dealt with it.
- Stripe should receive only the booking ID and reference, plus the parent's
  email for the receipt.
- `booking.contacts_eligible_for_anonymisation` lists contacts whose data has
  passed retention: 12 months after the end of their last session, or, if
  they never had a confirmed place, 30 days after their last booking attempt.
  A contact's places are found both through their own bookings and through
  their own children, so the result is still right after child records have
  been merged across two families.
- `booking.anonymise_contact` blanks the contact's and children's personal
  fields and the administrator's booking notes, and keeps the rows. It is
  refused while the contact has a booking in progress, under review, or a
  place on a session that has not finished.
- **Financial records are not deleted.** `payments` and `payment_refunds`
  contain no child data. `financial_retention_years` records the intended
  period only; nothing acts on it.
- Nothing is removed automatically. `anonymise_contact` runs only when a
  scheduled job or admin screen calls it.

### This is pseudonymisation, not anonymisation

After `anonymise_contact`, the rows keep their internal IDs, the booking
reference and the Stripe session and payment IDs. Stripe still holds the
payer's email address against those IDs. Anyone with access to both this
database and the Stripe account could link the records back to a person. The
data is therefore **pseudonymised and remains personal data** under UK GDPR.
The function and column names use "anonymise" for brevity only.

Other limits:

- Retention is applied per family, not per child. One child still attending
  keeps an older sibling's record.
- After a merge across two families, the kept child record belongs to one
  contact while some of its places were paid for by the other. Neither
  contact can be pseudonymised while any of those places is still to come.
- A contact booked under a mistyped email receives another family's
  confirmation, and a booking paid under someone else's email replaces that
  contact's details. Previous details are not kept.
- `CHILD_ALREADY_BOOKED` reveals that a named child has a place on a date to
  anyone who knows the parent's email. The Netlify Function should give a
  generic refusal and limit attempts.

### Unresolved compliance questions

None of these is settled by the code.

1. Whether six years is the right financial retention period for this
   business.
2. Whether 12 months is long enough for children's details and emergency
   contacts, given any safeguarding or insurer requirements for registers and
   incident records.
3. There is no attendance register in this schema.
4. Whether pseudonymised records linked to Stripe need a further step (for
   example redacting the customer in Stripe) to meet an erasure request.
5. The Privacy Policy and Terms & Conditions do not yet describe this system,
   Supabase as a processor, or a minimum-numbers clause.
6. Whether the Supabase project's hosting region is acceptable for UK
   children's data.

## Security

- **Dedicated schema.** Everything is in `booking`, not `public`.
- **No access for browser roles.** `anon` and `authenticated` have no `USAGE`
  on the schema, no table privileges and no function privileges.
- **Row Level Security** is enabled on all 16 tables with **no policies**,
  which denies every row to any role subject to RLS. Enabling RLS is not
  treated as sufficient on its own: the privilege revocations apply as well.
- **Functions** are not executable by `PUBLIC`. PostgreSQL grants that by
  default, so migration 15 revokes it. No function is `SECURITY DEFINER`, each
  pins its `search_path`, and views run with the caller's permissions.
- **Nothing is granted by default.** No default privileges are set for the
  schema, so a table added by a later migration starts with no access for the
  service role or anyone else. Migration 15 then grants each object exactly
  what it needs.
- **The schema can check itself.** `select * from booking.check_schema_security();`
  returns one row for each broken rule and no rows when all hold. It reports a
  table without Row Level Security, any RLS policy, any access for a browser
  role, a function runnable by a browser role, a `SECURITY DEFINER` function,
  a function without a fixed `search_path`, a view that does not use the
  caller's permissions, and any service-role right beyond those intended. Run
  it after applying the migrations and after every later migration. A later
  migration must still enable RLS on new tables, revoke `PUBLIC` execute on
  new functions and grant only what is needed; the check is what tells you if
  it did not.
- **The service role** bypasses RLS by design. It must exist only as a
  server-side Netlify variable, never with a `VITE_` prefix.
- **The service role has only the rights the booking functions need.** Every
  Netlify Function connects as it, so a mistake in any one of them cannot:
  - add, change or remove an administrator (`admin_users` is read-only);
  - switch between test and production, or change any setting (`app_config`
    is read-only);
  - delete a booking, a place, a payment, a refund, a contact, a child, an
    alert or a Stripe event record (no delete right on any of them);
  - change or delete the audit log.

  Administrators and settings are changed by hand in the Supabase SQL editor,
  which runs as the database owner. Venues, clubs and sessions can be deleted
  (for tidying drafts), but not once anything refers to them.
- **Administrator.** `admin_users` is an allowlist of Supabase Auth user IDs.
  Every admin function checks it, in addition to the check the Netlify
  Function makes on the sign-in token.

What the database does **not** enforce, and the Netlify Functions must:

- Verifying the administrator's sign-in token. The database checks the user ID
  it is given; it cannot check that the caller is really that user.
- The service role can still insert and update booking records and edit
  clubs directly. Such a change to a venue, club or session is audited (as
  `system`) but is not checked against the admin allowlist. Admin screens
  should use the `admin_*` functions.
- Rate limiting of booking attempts.
- Never logging request bodies, names or email addresses.
- Not passing database error `detail` values to the browser.
- Everything in [The Netlify Function contract](#the-netlify-function-contract).

### Assumptions to verify in Supabase

None of these has been checked. Each needs confirming on a test project.

1. The roles `anon`, `authenticated` and `service_role` exist, and
   `service_role` bypasses Row Level Security.
2. `auth.users` exists with a UUID `id`.
3. The PostgreSQL version is 15 or later (the views need it). The migrations
   use nothing newer than 15 and are tested locally on 16, 17 and 18, but
   there is no local engine for 15: a project on PostgreSQL 15 must be
   confirmed by applying the migrations to it.
4. The default isolation level is read committed. If it is not, bookings will
   fail with `WRONG_ISOLATION_LEVEL` instead of proceeding unsafely.
5. A function call through the Supabase client is a single transaction.
6. After `booking` is added to "Exposed schemas", the publishable key still
   cannot read any table or call any function. Supabase's own instructions
   for exposing a schema include granting the browser roles access; **that
   must not be done here.**
7. The statement timeout does not cut off a reservation that is waiting for a
   lock.
8. A pasted migration that fails part-way leaves nothing half-applied.

### Supabase settings to complete separately

These are dashboard or SQL-editor steps. None has been done.

1. **Expose the schema to the API.** Project Settings → API → Exposed schemas:
   add `booking`. Do not grant anything to `anon` or `authenticated`. Then run
   `select * from booking.check_schema_security();` in the SQL editor and
   confirm it returns no rows.
2. **Disable public sign-ups.** Authentication → Sign In / Providers.
3. **Create the administrator's login** in Authentication → Users, then
   authorise it by hand in the SQL editor:
   `insert into booking.admin_users (user_id, note) values ('<auth user id>', 'Louis');`
4. **Set the environment** in the production project only:
   `update booking.app_config set environment = 'production';`
   It is `test` by default, so a production database that has not had this
   step refuses live payments.
5. **Keys.** Give Netlify the project URL and service-role key as server-side
   variables. Local `.env` and preview deploys should point at a separate test
   project.

## Function reference

| Function | Called by | Purpose |
|---|---|---|
| `reserve_booking` | Booking function | Reserve all places or none |
| `begin_checkout` | Booking function | Record that Stripe is about to be called; set the Checkout deadline |
| `attach_checkout_session` | Booking function | Record the Stripe session ID |
| `fail_booking` | Booking function | Stripe definitely created nothing; free the places |
| `process_checkout_completed` | Clubs webhook | Record payment; confirm, or flag for review |
| `process_checkout_expired` | Clubs webhook | Verified expiry; release the hold |
| `process_refund` | Clubs webhook | Record a refund's latest status |
| `release_unattached_holds` | Scheduled job | Release holds with no recorded Checkout once it is safe |
| `expire_booking_after_stripe_check` | Scheduled job | Release a hold after Stripe confirms the session expired unpaid |
| `flag_under_enrolled_clubs` | Scheduled job | Flag clubs below the minimum at their deadline |
| `purge_stale_pending_contacts` | Scheduled job | Remove contact details left on long-ended bookings |
| `run_scheduled_maintenance` | Scheduled job | One call that runs the three functions above that are safe on the clock, and reports what is left to do |
| `mark_confirmation_email_sent`, `mark_admin_alert_sent` | Email function | Record a message as sent |
| `check_schema_security` | Anyone applying a migration | Lists any broken security rule; no rows means all hold |
| `is_admin` | Admin functions | Is this user an authorised administrator |
| `admin_save_venue`, `admin_save_club`, `admin_save_session` | Admin | Create or edit, with the administrator recorded in the audit log |
| `admin_set_club_status` | Admin | Publish, unpublish, close, cancel |
| `admin_set_club_review` | Admin | Record proceed / postponed / cancelled |
| `admin_cancel_allocation`, `admin_cancel_booking`, `admin_cancel_session` | Admin | Cancel a place, a booking or a session |
| `admin_confirm_reviewed_booking` | Admin | Confirm a booking under review, within capacity |
| `admin_flag_possible_duplicate`, `admin_mark_children_distinct`, `admin_merge_children`, `admin_split_child` | Admin | Review child records |
| `anonymise_contact` | Admin or scheduled job | Pseudonymise one contact |

Functions whose names begin with an underscore are internal helpers.

Errors are raised with a short code as the message, for example
`SESSION_FULL`, `CHILD_ALREADY_BOOKED`, `PENDING_BOOKING_EXISTS`,
`PREVIOUS_CHECKOUT_CLOSING`, `HOLD_EXPIRED`, `CLUB_HAS_BOOKINGS`,
`SESSION_HAS_BOOKINGS`, `WRONG_ISOLATION_LEVEL`, `INVALID_REASON_CODE`,
`NOT_AUTHORISED`.

## The Netlify Function contract

The Netlify Functions for school clubs do not exist yet. The database's
guarantees depend on them doing the following, and each item is written here
so it can be checked when they are built. The database supports every item;
it cannot enforce them.

**Booking function**

1. Verify nothing about price in the browser; use the totals `reserve_booking`
   returns.
2. Generate one request key per form submission and reuse it on retry.
3. Check `can_proceed_to_checkout` on every result from `reserve_booking`
   and `begin_checkout`. If false, do not call Stripe and do not send the
   parent to any payment page; tell them what `checkout_state` means and, for
   `ended` or `hold_expired`, start a new attempt with a new request key.
4. Call `begin_checkout` before calling Stripe, every time.
5. Create the Stripe Checkout with `client_reference_id` = booking ID,
   `expires_at` = `checkout_expires_at_unix` unchanged, the idempotency key =
   `stripe_idempotency_key`, currency `gbp`, card payments only, and no child
   names.
   **Do not enable promotion codes, coupons or discounts**: do not set
   `allow_promotion_codes` or `discounts`. The price, including the block
   discount, is worked out by the database and sent as the line-item amount.
6. Call `attach_checkout_session` and only then return the Checkout address.
7. On a definite Stripe error, call `fail_booking`. On a timeout or any
   uncertain result, do **not**: either repeat the same Stripe call with the
   same idempotency key and expiry, or leave the places held.
8. On `PENDING_BOOKING_EXISTS`, send the parent back to their open Checkout
   (the idempotent Stripe call returns it). Do not show the booking ID.
   On `PREVIOUS_CHECKOUT_CLOSING`, do not send them anywhere: tell them the
   earlier payment session timed out, that they will get a confirmation if
   they paid, and to try again in a few minutes otherwise.
9. Turn error codes into plain wording, never pass `detail` to the browser,
   give a generic refusal for `CHILD_ALREADY_BOOKED`, and rate-limit attempts.
10. Never log request bodies, names, emails or phone numbers.

**School clubs webhook** (separate from the private-booking webhook)

1. Verify Stripe's signature before anything else.
2. Make exactly one database call per event.
3. Pass `client_reference_id` exactly as received, or null. Do not convert or
   validate it; the database does that and never raises on a malformed value.
   Pass the session's `currency` and `payment_status` exactly as received too,
   including `no_payment_required`; do not filter events by status first.
4. For refund events, call `process_refund` for every event with the refund's
   current status.
5. After the call succeeds, send whatever the result says is owed
   (`send_confirmation`, `admin_alerts`), using each `message_key` as the
   email provider's idempotency key, then call the matching `mark_*` function.
6. If the database call fails, return an error so Stripe retries. If only the
   email fails, the scheduled job will pick it up.
7. Build each administrator email from the booking's current state (status,
   review reason, payments and refunds), not from the alert code alone.

**Scheduled job** (every few minutes; this does not exist yet)

1. Call `run_scheduled_maintenance`.
2. For each row in `bookings_awaiting_reconciliation`, ask Stripe for the
   session. If Stripe says it expired unpaid, call
   `expire_booking_after_stripe_check`. If its status is `complete`, call
   `process_checkout_completed` with its payment status and currency as they
   are. If it is still open, leave it. Never release on the clock alone.
3. Send every row in `outstanding_messages` with its `message_key`, then mark
   it sent.

Until this job exists, a parent's missed confirmation is only re-sent if
Stripe happens to redeliver the event, lapsed reservations are released only
when the same parent tries again, and no club is flagged at its deadline.

**Admin functions**

1. Verify the Supabase sign-in token on the server, then pass the verified
   user ID to the `admin_*` functions.
2. Use the `admin_*` functions for every change, so the administrator is
   recorded in the audit log.
3. Turn `CLUB_HAS_BOOKINGS` and `SESSION_HAS_BOOKINGS` into a clear message
   explaining the alternative (unpublish or close the club; cancel the session
   and add a new one). Do not offer to notify families: nothing sends such a
   message.

## Running the tests

```
npm run test:db        # PostgreSQL 17 (what new Supabase projects run)
npm run test:db:all    # the same suite on PostgreSQL 16, then 17, then 18
```

These run the files in `supabase/tests/` with Vitest. Each file starts its own
in-memory PostgreSQL using PGlite (PostgreSQL compiled to run inside Node),
adds stand-ins for the Supabase roles and `auth.users`, applies every
migration in order, and calls the functions as the service role. Nothing
connects to Supabase, Stripe or any other service. The existing `npm test`
(the leaderboard tests) is unchanged and does not run these.

The three PostgreSQL versions are three releases of the same PGlite package,
installed as development dependencies under the aliases `pglite-pg16`,
`pglite-pg17` and `pglite-pg18`. `BOOKING_TEST_PG=16 npm run test:db` selects
one. There is no PGlite release for PostgreSQL 15.

## What has and has not been tested

**Shown by the local tests**

- The SQL is valid and the 15 migrations apply cleanly in order, on
  PostgreSQL 16, 17 and 18. The whole suite passes on each.
- The migrations contain none of a list of features newer than PostgreSQL 15,
  need no extension, and name only the three Supabase roles and `auth.users`.
- The rules behave as designed when requests arrive one after another:
  pricing, all-or-nothing reservation, shared capacity, duplicate places,
  block rules, the Checkout sequence, holds, expiry, late payments (including
  that contact details survive), cancelled clubs, duplicate events, a failed
  transaction and its retry, email retries with separate alerts, wrong-mode
  and malformed-reference events, refunds including failures, reconciliation,
  child duplicate review, minimum enrolment, administrator authorisation,
  audit content and atomicity, the service role's limited rights, browser
  roles shut out, retention after a cross-family merge, and pseudonymisation.
- The functions refuse to run at the wrong isolation level.
- Each function takes its locks in the documented order (checked from the
  function source).

**Not shown by any test so far**

- **Genuinely simultaneous requests.** PGlite has a single connection, so two
  transactions never ran at the same instant. Row locks were never contended,
  and no deadlock could occur. The last-place guarantee and the lock order are
  reasoned from the design, not demonstrated.
- **PostgreSQL 15.** No local engine exists for it. The migrations avoid
  anything newer and pass on 16, but 15 itself is untested.
- **Applying as Supabase's `postgres` role.** Locally the migrations run as a
  superuser. On Supabase `postgres` is not one, so creating the foreign key to
  `auth.users`, the triggers and the grants is unproven until tried there.
- **Anything on Supabase itself**: role attributes, the exposed-schema
  setting, the API layer, timeouts, and what `check_schema_security` reports
  on a real project.
- **Timestamp precision.** The test engine's clock has millisecond precision;
  real PostgreSQL has microseconds. An earlier design that matched alerts on
  timestamps passed here and would have failed there. Alerts are now matched
  by ID, but the general lesson stands: behaviour that depends on time needs
  checking on real PostgreSQL.
- **Anything involving Stripe**: real Checkout expiry, real webhook delivery,
  retries and ordering.
- The Netlify Functions and the scheduled job, which do not exist yet. Until
  they do, the contract above is a specification, not a tested behaviour.

## Tests still required before accepting payments

On a Supabase **test** project, with real concurrent connections:

- Two simultaneous requests for the final place: exactly one succeeds.
- Many simultaneous requests for a few places: exactly that many succeed.
- Simultaneous requests locking sessions in opposite orders do not deadlock.
- A payment processed at the same moment as a resubmission by the same parent.
- Browser-key access through the real API after the schema is exposed.
- Each item under "Assumptions to verify in Supabase".

With Stripe test mode:

- Checkout expiry and the `checkout.session.expired` event.
- Delayed, duplicated and out-of-order events.
- A Checkout paid before its session ID was recorded.
- Refunds: partial, full and failed.

Regression:

- A private booking still completes and emails as before.
- `npm test` (leaderboard) still passes.

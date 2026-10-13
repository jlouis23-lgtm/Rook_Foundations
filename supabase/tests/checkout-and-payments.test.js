// Checkout, holds, webhook processing, late payments, refunds, reconciliation
// and message retries.

import { beforeAll, describe, expect, it } from 'vitest'
import { createDb } from './helpers/db.js'

let t

beforeAll(async () => {
  t = await createDb()
})

const pastHold = (bookingId) =>
  t.q(`update booking.bookings set hold_expires_at = now() - interval '1 minute' where id = $1`, [bookingId])

describe('starting and recording Checkout', () => {
  let club, ids, b

  beforeAll(async () => {
    ({ club, ids } = await t.mkClub())
    b = await t.reserve(club, 'block', ids, 'co@example.com', t.kids(['Ada', 'Smith', 'Year 3']))
  })

  it('holds a fresh reservation only for the short period', async () => {
    const row = await t.one(`select extract(epoch from (hold_expires_at - created_at))::int as secs, checkout_started_at from booking.bookings where id = $1`, [b.booking_id])
    expect(row.secs).toBe(10 * 60)
    expect(row.checkout_started_at).toBeNull()
    expect(b.checkout_started).toBe(false)
  })

  it('will not record a Checkout before begin_checkout has been called', async () => {
    await expect(t.attach(b.booking_id, 'cs_early', b.total_pence, { expiresInMinutes: 30 })).rejects.toThrow('CHECKOUT_NOT_STARTED')
  })

  it('begin_checkout sets a 35-minute deadline and a 50-minute hold, counted from that moment', async () => {
    const started = await t.beginCheckout(b.booking_id)
    const row = await t.one(`select extract(epoch from (checkout_deadline_at - date_trunc('second', checkout_started_at)))::int as checkout_secs,
                                    extract(epoch from (hold_expires_at - checkout_started_at))::int as hold_secs
                               from booking.bookings where id = $1`, [b.booking_id])
    expect(started.replayed).toBe(false)
    expect(started.checkout_started).toBe(true)
    expect(row.checkout_secs).toBe(35 * 60)
    expect(row.hold_secs).toBe(50 * 60)
  })

  it('gives Stripe a whole-second expiry and a fixed idempotency key, so nothing needs rounding and a retry cannot create a second Checkout', async () => {
    const again = await t.beginCheckout(b.booking_id)
    const row = await t.one(`select extract(microseconds from checkout_deadline_at)::int % 1000000 as fraction,
                                    extract(epoch from checkout_deadline_at)::bigint as unix
                               from booking.bookings where id = $1`, [b.booking_id])
    expect(row.fraction).toBe(0)
    expect(Number.isInteger(again.checkout_expires_at_unix)).toBe(true)
    expect(again.checkout_expires_at_unix).toBe(Number(row.unix))
    expect(again.stripe_idempotency_key).toBe(`rook-club-checkout-${b.booking_id}`)
    expect(again.can_proceed_to_checkout).toBe(true)
    // Stripe echoes the same whole-second value back; attaching with exactly it is accepted (checked below).
  })

  it('begin_checkout a second time changes nothing and says so', async () => {
    const before = await t.bookingRow(b.booking_id)
    const again = await t.beginCheckout(b.booking_id)
    const after = await t.bookingRow(b.booking_id)
    expect(again.replayed).toBe(true)
    expect(after.checkout_deadline_at).toEqual(before.checkout_deadline_at)
  })

  it('refuses a wrong amount, a live payment on a test database, and a Checkout outliving the deadline', async () => {
    await expect(t.attach(b.booking_id, 'cs_1', 9999)).rejects.toThrow('AMOUNT_MISMATCH')
    await expect(t.attach(b.booking_id, 'cs_1', b.total_pence, { live: true })).rejects.toThrow('ENVIRONMENT_MISMATCH')
    await expect(t.attach(b.booking_id, 'cs_1', b.total_pence, { expiresInMinutes: 36 })).rejects.toThrow('CHECKOUT_EXPIRY_AFTER_DEADLINE')
  })

  it('records the Checkout once; a repeat is harmless and a different one is refused', async () => {
    const unix = (await t.beginCheckout(b.booking_id)).checkout_expires_at_unix
    const viaStripe = await t.one(`select booking.attach_checkout_session($1, 'cs_1', $2, false, to_timestamp($3)) as r`, [b.booking_id, b.total_pence, unix])
    expect(viaStripe.r.replayed).toBe(false)
    expect((await t.attach(b.booking_id, 'cs_1', b.total_pence)).replayed).toBe(true)
    await expect(t.attach(b.booking_id, 'cs_other', b.total_pence)).rejects.toThrow('CHECKOUT_ALREADY_ATTACHED')
  })

  it('confirms on payment, applies the contact details, and asks for the confirmation email', async () => {
    const r = await t.completed('evt_1', 'cs_1', b.total_pence, { bookingId: b.booking_id })
    expect(r.outcome).toBe('confirmed')
    expect(r.send_confirmation).toBe(true)
    expect(r.notify_admin).toBe(false)
    const places = await t.one(`select count(*)::int n from booking.session_allocations where booking_id = $1 and status = 'confirmed'`, [b.booking_id])
    expect(places.n).toBe(6)
    const c = await t.one(`select full_name, phone from booking.contacts where email = 'co@example.com'`)
    expect(c).toEqual({ full_name: 'Pat Parent', phone: '07000000000' })
    expect((await t.bookingRow(b.booking_id)).pending_contact).toBeNull()
  })

  it('ignores sessions with no booking association, and events from the wrong environment', async () => {
    expect((await t.completed('evt_private', 'cs_private_booking', 3000)).outcome).toBe('ignored_unknown_session')
    expect((await t.completed('evt_live', 'cs_1', b.total_pence, { live: true })).outcome).toBe('ignored_environment_mismatch')
  })

  it('does not undo a paid booking when a late expiry event arrives', async () => {
    expect((await t.expired('evt_late_exp', 'cs_1')).outcome).toBe('ignored_not_pending')
    expect((await t.bookingRow(b.booking_id)).status).toBe('confirmed')
  })
})

describe('C1: a Checkout that exists in Stripe is never an unrecorded payment', () => {
  it('a repeated booking does not release a booking whose Checkout has been started', async () => {
    const { club, ids } = await t.mkClub({ capacity: 2 })
    const first = await t.reserve(club, 'individual', [ids[0]], 'race@example.com', t.kids(['Ra', 'Ce', 'Year 3']))
    await t.beginCheckout(first.booking_id)
    // Stripe has now created cs_race, but attach_checkout_session has not run.
    await expect(t.reserve(club, 'individual', [ids[0]], 'race@example.com', t.kids(['Ra', 'Ce', 'Year 3']))).rejects.toThrow('PENDING_BOOKING_EXISTS')
    expect((await t.bookingRow(first.booking_id)).status).toBe('pending')
    expect(await t.livePlaces(first.booking_id)).toBe(1)

    // The parent pays cs_race. The webhook carries the booking ID from Stripe.
    const paid = await t.completed('evt_race', 'cs_race', first.total_pence, { bookingId: first.booking_id })
    expect(paid.outcome).toBe('confirmed')
    expect(paid.booking_id).toBe(first.booking_id)
    const payment = await t.one(`select status, recorded_without_attachment, amount_received_pence from booking.payments where stripe_checkout_session_id = 'cs_race'`)
    expect(payment).toEqual({ status: 'paid', recorded_without_attachment: true, amount_received_pence: first.total_pence })
    expect((await t.bookingRow(first.booking_id)).status).toBe('confirmed')
  })

  it('a payment that arrives before its Checkout is recorded is recorded, and the late attach is harmless', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'early@example.com', t.kids(['Ea', 'Rly', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    const paid = await t.completed('evt_early', 'cs_early_pay', b.total_pence, { bookingId: b.booking_id })
    expect(paid.outcome).toBe('confirmed')
    const attached = await t.attach(b.booking_id, 'cs_early_pay', b.total_pence)
    expect(attached).toMatchObject({ replayed: true, payment_status: 'paid' })
    expect((await t.one(`select count(*)::int n from booking.payments where booking_id = $1`, [b.booking_id])).n).toBe(1)
  })

  it('a payment for a booking that was wrongly released is still recorded and handled as a late payment', async () => {
    const { club, ids } = await t.mkClub({ capacity: 1 })
    const b = await t.reserve(club, 'individual', [ids[0]], 'orphan@example.com', t.kids(['Or', 'Phan', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    await t.q(`select booking.fail_booking($1)`, [b.booking_id])   // caller wrongly reported "no Checkout created"
    await t.reserve(club, 'individual', [ids[0]], 'taker@example.com', t.kids(['Ta', 'Ker', 'Year 3']))
    const paid = await t.completed('evt_orphan', 'cs_orphan', b.total_pence, { bookingId: b.booking_id })
    expect(paid.outcome).toBe('needs_review_paid_after_hold_ended_no_capacity')
    expect(paid.notify_admin).toBe(true)
    expect(paid.send_confirmation).toBe(false)
    expect((await t.one(`select status from booking.payments where stripe_checkout_session_id = 'cs_orphan'`)).status).toBe('paid')
    expect(await t.overCapacity()).toEqual([])
  })

  it('a booking reference this database does not hold is not treated as a booking, and the administrator is alerted', async () => {
    const r = await t.completed('evt_bogus', 'cs_bogus', 5000, { bookingId: '00000000-0000-4000-8000-000000000000' })
    expect(r.outcome).toBe('unrecognised_booking_reference')
    expect(r.booking_id).toBeNull()
    expect(r.notify_admin).toBe(true)
    expect(t.alertCodes(r)).toEqual(['unmatched_payment'])
    expect((await t.one(`select count(*)::int n from booking.payments where stripe_checkout_session_id = 'cs_bogus'`)).n).toBe(0)
    const owed = await t.q(`select message_type, code, alert_id from booking.outstanding_messages where stripe_event_id = 'evt_bogus'`)
    expect(owed).toHaveLength(1)
    expect(owed[0]).toMatchObject({ message_type: 'admin_alert', code: 'unmatched_payment' })
    // The repeat delivery still reports it as owed until it is marked as sent.
    expect((await t.completed('evt_bogus', 'cs_bogus', 5000, { bookingId: '00000000-0000-4000-8000-000000000000' })).notify_admin).toBe(true)
    expect((await t.one(`select booking.mark_admin_alert_sent($1) as done`, [owed[0].alert_id])).done).toBe(true)
    expect((await t.one(`select booking.mark_admin_alert_sent($1) as done`, [owed[0].alert_id])).done).toBe(false)
    expect((await t.completed('evt_bogus', 'cs_bogus', 5000, { bookingId: '00000000-0000-4000-8000-000000000000' })).notify_admin).toBe(false)
  })

  it('a malformed booking reference is handled the same way, without raising an error for Stripe to retry', async () => {
    for (const [i, bad] of ['not-a-booking-id', '12345', '   ', 'DROP TABLE'].entries()) {
      const r = await t.completed(`evt_bad_ref_${i}`, `cs_bad_ref_${i}`, 5000, { bookingId: bad })
      if (bad.trim() === '') {
        expect(r.outcome).toBe('ignored_unknown_session')   // blank counts as no reference at all
        expect(r.notify_admin).toBe(false)
      } else {
        expect(r.outcome).toBe('unrecognised_booking_reference')
        expect(t.alertCodes(r)).toEqual(['unmatched_payment'])
      }
    }
    // An unpaid one is recorded but raises no alert.
    const unpaid = await t.completed('evt_bad_ref_unpaid', 'cs_bad_ref_unpaid', 5000, { bookingId: 'nonsense', status: 'unpaid' })
    expect(unpaid).toMatchObject({ outcome: 'unrecognised_booking_reference', notify_admin: false })
    expect((await t.expired('evt_bad_ref_exp', 'cs_bad_ref_exp', { bookingId: 'nonsense' })).outcome).toBe('unrecognised_booking_reference')
  })

  it('fix 4: a PAID event in the wrong mode is recorded against no booking but alerts the administrator', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'wrongmode@example.com', t.kids(['Wr', 'Ong', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    const r = await t.completed('evt_wrongmode', 'cs_wrongmode', b.total_pence, { bookingId: b.booking_id, live: true })
    expect(r.outcome).toBe('ignored_environment_mismatch')
    expect(r.booking_id).toBeNull()
    expect(r.notify_admin).toBe(true)
    expect(t.alertCodes(r)).toEqual(['payment_environment_mismatch'])
    expect((await t.bookingRow(b.booking_id)).status).toBe('pending')
    expect(await t.q(`select 1 from booking.payments where stripe_checkout_session_id = 'cs_wrongmode'`)).toEqual([])
    expect(await t.q(`select code from booking.outstanding_messages where stripe_event_id = 'evt_wrongmode'`)).toEqual([{ code: 'payment_environment_mismatch' }])
    // An unpaid wrong-mode event, and a wrong-mode expiry, raise nothing.
    expect((await t.completed('evt_wrongmode_unpaid', 'cs_wrongmode', b.total_pence, { live: true, status: 'unpaid' })).notify_admin).toBe(false)
    expect((await t.expired('evt_wrongmode_exp', 'cs_wrongmode', { live: true })).notify_admin).toBe(false)
  })

  it('an unstarted earlier booking is replaced, and its own begin_checkout is then refused before Stripe is called', async () => {
    const { club, ids } = await t.mkClub()
    const first = await t.reserve(club, 'individual', [ids[0]], 'again@example.com', t.kids(['Ag', 'Ain', 'Year 3']))
    const second = await t.reserve(club, 'individual', [ids[1]], 'again@example.com', t.kids(['Ag', 'Ain', 'Year 3']))
    expect((await t.bookingRow(first.booking_id)).status).toBe('expired')
    expect(second.status).toBe('pending')
    await expect(t.beginCheckout(first.booking_id)).rejects.toThrow('BOOKING_NOT_PENDING')
  })
})

describe('H1: duplicate events and message retries', () => {
  let b

  beforeAll(async () => {
    const { club, ids } = await t.mkClub()
    b = await t.reserve(club, 'individual', [ids[0]], 'mail@example.com', t.kids(['Ma', 'Il', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    await t.attach(b.booking_id, 'cs_mail', b.total_pence)
    await t.completed('evt_mail', 'cs_mail', b.total_pence, { bookingId: b.booking_id })
  })

  it('a repeat delivery changes nothing but still reports the confirmation email as owed', async () => {
    const dup = await t.completed('evt_mail', 'cs_mail', b.total_pence, { bookingId: b.booking_id })
    expect(dup.outcome).toBe('duplicate_event')
    expect(dup.original_outcome).toBe('confirmed')
    expect(dup.booking_id).toBe(b.booking_id)
    expect(dup.send_confirmation).toBe(true)
    expect((await t.one(`select count(*)::int n from booking.payments where booking_id = $1`, [b.booking_id])).n).toBe(1)
  })

  it('lists the owed confirmation, records it sent once, and then stops asking', async () => {
    const owed = await t.q(`select message_type from booking.outstanding_messages where booking_id = $1`, [b.booking_id])
    expect(owed).toEqual([{ message_type: 'booking_confirmation' }])
    expect((await t.one(`select booking.mark_confirmation_email_sent($1) as done`, [b.booking_id])).done).toBe(true)
    expect((await t.one(`select booking.mark_confirmation_email_sent($1) as done`, [b.booking_id])).done).toBe(false)
    expect(await t.q(`select 1 from booking.outstanding_messages where booking_id = $1`, [b.booking_id])).toEqual([])
    expect((await t.completed('evt_mail', 'cs_mail', b.total_pence)).send_confirmation).toBe(false)
  })

  it('a second paid event for the same session is reported as already paid', async () => {
    expect((await t.completed('evt_mail_2', 'cs_mail', b.total_pence)).outcome).toBe('already_paid')
  })

  it('fixes 2 and 5: each alert is its own record, marked by ID; a later alert never replaces an unsent one', async () => {
    const { club, ids } = await t.mkClub()
    const m = await t.reserve(club, 'individual', [ids[0]], 'alert@example.com', t.kids(['Al', 'Ert', 'Year 3']))
    await t.beginCheckout(m.booking_id)
    await t.attach(m.booking_id, 'cs_alert', m.total_pence)
    const first = await t.completed('evt_alert', 'cs_alert', m.total_pence - 100, { bookingId: m.booking_id })
    expect(first.outcome).toBe('needs_review_amount_mismatch')
    expect(first.notify_admin).toBe(true)
    expect(t.alertCodes(first)).toEqual(['amount_mismatch'])

    // A repeat delivery still reports the alert as owed.
    const dup = await t.completed('evt_alert', 'cs_alert', m.total_pence - 100, { bookingId: m.booking_id })
    expect(dup.outcome).toBe('duplicate_event')
    expect(t.alertCodes(dup)).toEqual(['amount_mismatch'])

    // A refund is recorded BEFORE the first alert has been sent: both are now owed.
    const afterRefund = await t.refund('evt_alert_refund', 'pi_cs_alert', 're_alert', 100)
    expect(t.alertCodes(afterRefund)).toEqual(['amount_mismatch', 'refund_recorded'])
    const owed = await t.owedAlerts(m.booking_id)
    expect(owed.map((a) => a.code)).toEqual(['amount_mismatch', 'refund_recorded'])
    expect(owed[0].message_key).toBe(`admin-alert-${owed[0].alert_id}`)
    expect(new Set(owed.map((a) => a.message_key)).size).toBe(2)

    // Marking one by its ID leaves the other owed; marking twice is harmless.
    expect((await t.one(`select booking.mark_admin_alert_sent($1) as done`, [owed[0].alert_id])).done).toBe(true)
    expect((await t.one(`select booking.mark_admin_alert_sent($1) as done`, [owed[0].alert_id])).done).toBe(false)
    expect((await t.owedAlerts(m.booking_id)).map((a) => a.code)).toEqual(['refund_recorded'])
    expect((await t.one(`select booking.mark_admin_alert_sent($1) as done`, [owed[1].alert_id])).done).toBe(true)
    expect(await t.owedAlerts(m.booking_id)).toEqual([])
    expect((await t.one(`select booking.mark_admin_alert_sent(gen_random_uuid()) as done`)).done).toBe(false)
  })

  it('fix 2: marking does not depend on timestamps, so sub-millisecond precision cannot break it', async () => {
    const { club, ids } = await t.mkClub()
    const m = await t.reserve(club, 'individual', [ids[0]], 'micro@example.com', t.kids(['Mi', 'Cro', 'Year 3']))
    await t.beginCheckout(m.booking_id)
    await t.attach(m.booking_id, 'cs_micro', m.total_pence)
    await t.completed('evt_micro', 'cs_micro', m.total_pence + 1, { bookingId: m.booking_id })
    // Give the alert a creation time with microseconds, as real PostgreSQL would.
    await t.q(`update booking.admin_alerts set created_at = created_at + interval '123 microseconds' where booking_id = $1`, [m.booking_id])
    const [alert] = await t.owedAlerts(m.booking_id)
    expect((await t.one(`select booking.mark_admin_alert_sent($1) as done`, [alert.alert_id])).done).toBe(true)
    expect(await t.owedAlerts(m.booking_id)).toEqual([])
  })

  it('does not pile up identical unsent alerts, but raises the alert again once the first has been sent', async () => {
    const { club, ids } = await t.mkClub()
    const { booking } = await t.bookAndPay(club, 'individual', [ids[0], ids[1]], 'pile@example.com', t.kids(['Pi', 'Le', 'Year 3']), 'cs_pile')
    await t.refund('evt_pile_1', 'pi_cs_pile', 're_pile_1', 100)
    await t.refund('evt_pile_2', 'pi_cs_pile', 're_pile_2', 100)
    const owed = await t.owedAlerts(booking.booking_id)
    expect(owed.map((a) => a.code)).toEqual(['refund_recorded'])
    await t.q(`select booking.mark_admin_alert_sent($1)`, [owed[0].alert_id])
    await t.refund('evt_pile_3', 'pi_cs_pile', 're_pile_3', 100)
    expect((await t.owedAlerts(booking.booking_id)).map((a) => a.code)).toEqual(['refund_recorded'])
    expect((await t.one(`select count(*)::int n from booking.admin_alerts where booking_id = $1`, [booking.booking_id])).n).toBe(2)
  })

  it('gives every owed message a stable key for the email provider', async () => {
    const { club, ids } = await t.mkClub()
    const { booking, result } = await t.bookAndPay(club, 'individual', [ids[0]], 'key@example.com', t.kids(['Ke', 'Y', 'Year 3']), 'cs_key')
    expect(result.confirmation_message_key).toBe(`booking-confirmation-${booking.booking_id}`)
    const owed = await t.one(`select message_key from booking.outstanding_messages where booking_id = $1 and message_type = 'booking_confirmation'`, [booking.booking_id])
    expect(owed.message_key).toBe(`booking-confirmation-${booking.booking_id}`)
    // Asked again (a retry after a crash), the key is the same.
    expect((await t.completed('evt_cs_key', 'cs_key', booking.total_pence)).confirmation_message_key).toBe(owed.message_key)
  })
})

describe('a failed webhook transaction leaves nothing behind and its retry succeeds', () => {
  it('rolls back the event record with everything else', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'fail@example.com', t.kids(['Fa', 'Il', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    await t.attach(b.booking_id, 'cs_fail', b.total_pence)

    // Force a failure deep inside processing: confirming a place raises an error.
    await t.asOwner(() => t.db.exec(`
      create function public.test_forced_failure() returns trigger language plpgsql as $f$
      begin
        if current_setting('test.fail', true) = 'on' and new.status = 'confirmed' then
          raise exception 'FORCED_FAILURE';
        end if;
        return new;
      end $f$;
      create trigger test_forced_failure before update on booking.session_allocations
        for each row execute function public.test_forced_failure();
    `))
    await t.db.exec(`set test.fail = 'on'`)
    await expect(t.completed('evt_fail', 'cs_fail', b.total_pence, { bookingId: b.booking_id })).rejects.toThrow('FORCED_FAILURE')

    expect(await t.q(`select 1 from booking.stripe_events where stripe_event_id = 'evt_fail'`)).toEqual([])
    expect((await t.one(`select status, amount_received_pence from booking.payments where stripe_checkout_session_id = 'cs_fail'`))).toEqual({ status: 'created', amount_received_pence: null })
    expect((await t.bookingRow(b.booking_id)).status).toBe('pending')
    expect((await t.one(`select count(*)::int n from booking.session_allocations where booking_id = $1 and status = 'held'`, [b.booking_id])).n).toBe(1)
    expect(await t.q(`select 1 from booking.audit_log where entity_id = $1 and action = 'booking_confirmed'`, [b.booking_id])).toEqual([])

    // Stripe retries the same event.
    await t.db.exec(`set test.fail = 'off'`)
    const retry = await t.completed('evt_fail', 'cs_fail', b.total_pence, { bookingId: b.booking_id })
    expect(retry.outcome).toBe('confirmed')
    expect((await t.bookingRow(b.booking_id)).status).toBe('confirmed')
    await t.asOwner(() => t.db.exec(`drop trigger test_forced_failure on booking.session_allocations`))
  })
})

describe('holds: released only when no Checkout can still be paid', () => {
  it('releases a reservation that never reached Checkout after the short period', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'short@example.com', t.kids(['Sh', 'Ort', 'Year 3']))
    expect((await t.one(`select booking.release_unattached_holds() as n`)).n).toBe(0)
    await pastHold(b.booking_id)
    await expect(t.beginCheckout(b.booking_id)).rejects.toThrow('HOLD_EXPIRED')
    expect((await t.one(`select booking.release_unattached_holds() as n`)).n).toBe(1)
    const row = await t.one(`select b.status, a.ended_reason from booking.bookings b join booking.session_allocations a on a.booking_id = b.id where b.id = $1`, [b.booking_id])
    expect(row).toEqual({ status: 'expired', ended_reason: 'hold_lapsed_before_checkout' })
    expect((await t.availability(ids[0])).places_taken).toBe(0)
  })

  it('keeps a started-but-unrecorded Checkout held until its long hold has passed', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'started@example.com', t.kids(['St', 'Art', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    // 20 minutes on: past the short period, but the Checkout could still be paid.
    await t.q(`update booking.bookings set checkout_started_at = checkout_started_at - interval '20 minutes',
                 checkout_deadline_at = checkout_deadline_at - interval '20 minutes',
                 hold_expires_at = hold_expires_at - interval '20 minutes' where id = $1`, [b.booking_id])
    expect((await t.one(`select booking.release_unattached_holds() as n`)).n).toBe(0)
    expect(await t.livePlaces(b.booking_id)).toBe(1)
    // 51 minutes on: the Checkout deadline passed 16 minutes ago.
    await t.q(`update booking.bookings set checkout_started_at = checkout_started_at - interval '31 minutes',
                 checkout_deadline_at = checkout_deadline_at - interval '31 minutes',
                 hold_expires_at = hold_expires_at - interval '31 minutes' where id = $1`, [b.booking_id])
    const due = await t.one(`select checkout_deadline_at < now() as deadline_passed from booking.bookings where id = $1`, [b.booking_id])
    expect(due.deadline_passed).toBe(true)
    expect((await t.one(`select booking.release_unattached_holds() as n`)).n).toBe(1)
    expect((await t.one(`select ended_reason from booking.session_allocations where booking_id = $1`, [b.booking_id])).ended_reason).toBe('checkout_never_attached')
  })

  it('never releases a recorded Checkout on time alone; it waits for Stripe', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'attached@example.com', t.kids(['At', 'Tached', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    await t.attach(b.booking_id, 'cs_attached', b.total_pence)
    await t.q(`update booking.bookings set hold_expires_at = now() - interval '1 hour' where id = $1`, [b.booking_id])
    await t.q(`update booking.payments set checkout_expires_at = now() - interval '70 minutes' where booking_id = $1`, [b.booking_id])
    expect((await t.one(`select booking.release_unattached_holds() as n`)).n).toBe(0)
    expect(await t.livePlaces(b.booking_id)).toBe(1)
    expect(await t.q(`select 1 from booking.bookings_awaiting_reconciliation where booking_id = $1`, [b.booking_id])).toHaveLength(1)
    await t.q(`select booking.expire_booking_after_stripe_check($1)`, [b.booking_id])
    expect((await t.bookingRow(b.booking_id)).status).toBe('expired')
    expect(await t.livePlaces(b.booking_id)).toBe(0)
  })

  it('frees places at once when Stripe definitely created nothing', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'nostripe@example.com', t.kids(['No', 'Stripe', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    await t.q(`select booking.fail_booking($1)`, [b.booking_id])
    expect((await t.bookingRow(b.booking_id)).status).toBe('failed')
    expect((await t.availability(ids[0])).places_taken).toBe(0)
  })

  it('fix 7: a parent retrying is not blocked by their own started-but-unrecorded booking once its hold has run out', async () => {
    const { club, ids } = await t.mkClub({ capacity: 1 })
    const first = await t.reserve(club, 'individual', [ids[0]], 'retry@example.com', t.kids(['Re', 'Try', 'Year 3']))
    await t.beginCheckout(first.booking_id)   // Stripe timed out; nothing was ever recorded

    // While the Checkout could still be paid, the retry is turned away and the place stays held.
    await expect(t.reserve(club, 'individual', [ids[0]], 'retry@example.com', t.kids(['Re', 'Try', 'Year 3']))).rejects.toThrow('PENDING_BOOKING_EXISTS')
    // Its Checkout deadline has passed but the safety margin has not: the parent is told the
    // earlier session is closing (not sent back to it), and the place is still held.
    await t.q(`update booking.bookings set checkout_started_at = now() - interval '40 minutes', checkout_deadline_at = date_trunc('second', now() - interval '5 minutes'),
                 hold_expires_at = now() + interval '10 minutes' where id = $1`, [first.booking_id])
    await expect(t.reserve(club, 'individual', [ids[0]], 'retry@example.com', t.kids(['Re', 'Try', 'Year 3']))).rejects.toThrow('PREVIOUS_CHECKOUT_CLOSING')
    expect(await t.livePlaces(first.booking_id)).toBe(1)

    // Once the hold itself has run out (at least 10 minutes after any Checkout expired), the retry goes through.
    await t.q(`update booking.bookings set hold_expires_at = now() - interval '1 minute' where id = $1`, [first.booking_id])
    const second = await t.reserve(club, 'individual', [ids[0]], 'retry@example.com', t.kids(['Re', 'Try', 'Year 3']))
    expect(second.status).toBe('pending')
    const old = await t.one(`select b.status, a.ended_reason from booking.bookings b join booking.session_allocations a on a.booking_id = b.id where b.id = $1`, [first.booking_id])
    expect(old).toEqual({ status: 'expired', ended_reason: 'checkout_never_attached' })
    expect(await t.overCapacity()).toEqual([])

    // If the old Checkout were somehow paid after all, the money is still recorded, not lost.
    // It goes to review because the same child now holds the place through the retry.
    const late = await t.completed('evt_retry_late', 'cs_retry_late', first.total_pence, { bookingId: first.booking_id })
    expect(late.outcome).toBe('needs_review_paid_child_already_placed')
    expect(late.notify_admin).toBe(true)
    expect((await t.one(`select status from booking.payments where stripe_checkout_session_id = 'cs_retry_late'`)).status).toBe('paid')
    expect(await t.overCapacity()).toEqual([])
  })

  it('fix 7: a retry NEVER releases a booking whose Checkout has been recorded, however old', async () => {
    const { club, ids } = await t.mkClub()
    const first = await t.reserve(club, 'individual', [ids[0]], 'retry-rec@example.com', t.kids(['Re', 'Rec', 'Year 3']))
    await t.beginCheckout(first.booking_id)
    await t.attach(first.booking_id, 'cs_retry_rec', first.total_pence)
    await t.q(`update booking.bookings set hold_expires_at = now() - interval '2 hours' where id = $1`, [first.booking_id])
    await expect(t.reserve(club, 'individual', [ids[1]], 'retry-rec@example.com', t.kids(['Re', 'Rec', 'Year 3']))).rejects.toThrow('PENDING_BOOKING_EXISTS')
    expect((await t.bookingRow(first.booking_id)).status).toBe('pending')
    expect(await t.livePlaces(first.booking_id)).toBe(1)
  })

  it('a replayed request key says plainly when its booking can no longer go to Checkout', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'replay-end@example.com', t.kids(['Re', 'End', 'Year 3']))
    expect(b.can_proceed_to_checkout).toBe(true)
    const key = (await t.bookingRow(b.booking_id)).request_key
    await t.q(`select booking.fail_booking($1)`, [b.booking_id])
    const replay = await t.reserve(club, 'individual', [ids[0]], 'replay-end@example.com', t.kids(['Re', 'End', 'Year 3']), { key })
    expect(replay).toMatchObject({ replayed: true, status: 'failed', can_proceed_to_checkout: false })
    await expect(t.beginCheckout(b.booking_id)).rejects.toThrow('BOOKING_NOT_PENDING')
  })

  it('the scheduled job has one entry point that does the safe housekeeping and reports what is left', async () => {
    const fresh = await createDb()
    const { club, ids } = await fresh.mkClub({ min: 3 })
    const lapsed = await fresh.reserve(club, 'individual', [ids[0]], 'job1@example.com', fresh.kids(['Jo', 'One', 'Year 3']))
    await fresh.q(`update booking.bookings set hold_expires_at = now() - interval '1 minute' where id = $1`, [lapsed.booking_id])
    const stuck = await fresh.reserve(club, 'individual', [ids[1]], 'job2@example.com', fresh.kids(['Jo', 'Two', 'Year 3']))
    await fresh.beginCheckout(stuck.booking_id)
    await fresh.attach(stuck.booking_id, 'cs_job2', stuck.total_pence)
    await fresh.q(`update booking.payments set checkout_expires_at = now() - interval '5 minutes' where booking_id = $1`, [stuck.booking_id])
    await fresh.bookAndPay(club, 'individual', [ids[2]], 'job3@example.com', fresh.kids(['Jo', 'Three', 'Year 3']), 'cs_job3')
    await fresh.q(`update booking.clubs set enrolment_deadline = now() - interval '1 minute' where id = $1`, [club])

    const first = (await fresh.one(`select booking.run_scheduled_maintenance() as r`)).r
    expect(first).toEqual({ holds_released: 1, clubs_flagged: 1, pending_contacts_purged: 0, awaiting_reconciliation: 1, outstanding_messages: 2 })
    const types = (await fresh.q(`select message_type, code from booking.outstanding_messages order by message_type`))
    expect(types).toEqual([{ message_type: 'admin_alert', code: 'club_below_minimum' }, { message_type: 'booking_confirmation', code: null }])
    // Running it again does the housekeeping once only; what is owed stays owed.
    const second = (await fresh.one(`select booking.run_scheduled_maintenance() as r`)).r
    expect(second).toEqual({ holds_released: 0, clubs_flagged: 0, pending_contacts_purged: 0, awaiting_reconciliation: 1, outstanding_messages: 2 })
    expect((await fresh.bookingRow(stuck.booking_id)).status).toBe('pending')   // never released by the clock
  })

  it('a repeated reservation long after the first still gets a full Checkout deadline', async () => {
    const { club, ids } = await t.mkClub()
    const first = await t.reserve(club, 'individual', [ids[0]], 'slow@example.com', t.kids(['Sl', 'Ow', 'Year 3']))
    // Eight minutes pass before the parent's request is retried with the same key.
    await t.q(`update booking.bookings set created_at = created_at - interval '8 minutes', hold_expires_at = hold_expires_at - interval '8 minutes' where id = $1`, [first.booking_id])
    const key = (await t.bookingRow(first.booking_id)).request_key
    const replay = await t.reserve(club, 'individual', [ids[0]], 'slow@example.com', t.kids(['Sl', 'Ow', 'Year 3']), { key })
    expect(replay.replayed).toBe(true)
    expect(replay.checkout_deadline_at).toBeNull()
    const started = await t.beginCheckout(first.booking_id)
    const left = await t.one(`select extract(epoch from ($1::timestamptz - now()))::int as secs`, [started.checkout_deadline_at])
    expect(left.secs).toBeGreaterThanOrEqual(34 * 60)   // Stripe needs at least 30 minutes
  })
})

describe('expired Checkout and late payments', () => {
  it('a verified expiry releases the places, once', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0], ids[1]], 'exp@example.com', t.kids(['Ex', 'P', 'Year 3'], ['Ey', 'P', 'Year 4']))
    await t.beginCheckout(b.booking_id)
    await t.attach(b.booking_id, 'cs_exp', b.total_pence)
    expect((await t.expired('evt_exp', 'cs_exp')).outcome).toBe('expired')
    expect((await t.expired('evt_exp', 'cs_exp')).outcome).toBe('duplicate_event')
    expect(await t.livePlaces(b.booking_id)).toBe(0)
  })

  it('fix 1: keeps what the parent typed when a started Checkout expires, so a late payment confirms a complete booking', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'late-new@example.com', t.kids(['La', 'New', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    await t.attach(b.booking_id, 'cs_late_new', b.total_pence)
    await t.expired('evt_late_new_exp', 'cs_late_new')
    expect((await t.bookingRow(b.booking_id)).pending_contact).toMatchObject({ full_name: 'Pat Parent', emergency_phone: '07111111111' })
    // The contact record itself is still untouched while unpaid.
    expect((await t.one(`select full_name from booking.contacts where email = 'late-new@example.com'`)).full_name).toBeNull()

    const r = await t.completed('evt_late_new_paid', 'cs_late_new', b.total_pence)
    expect(r.outcome).toBe('confirmed_after_hold_ended')
    expect(await t.one(`select full_name, phone, emergency_name, emergency_phone from booking.contacts where email = 'late-new@example.com'`))
      .toEqual({ full_name: 'Pat Parent', phone: '07000000000', emergency_name: 'Em Contact', emergency_phone: '07111111111' })
    expect((await t.bookingRow(b.booking_id)).pending_contact).toBeNull()
  })

  it('fix 1: also keeps them for a booking sent to review, and when Checkout creation was reported as failed', async () => {
    const { club, ids } = await t.mkClub({ capacity: 1 })
    const b = await t.reserve(club, 'individual', [ids[0]], 'review-keep@example.com', t.kids(['Re', 'Keep', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    await t.q(`select booking.fail_booking($1)`, [b.booking_id])
    expect((await t.bookingRow(b.booking_id)).pending_contact).not.toBeNull()
    await t.reserve(club, 'individual', [ids[0]], 'review-taker@example.com', t.kids(['Ta', 'Ker', 'Year 3']))
    const r = await t.completed('evt_review_keep', 'cs_review_keep', b.total_pence, { bookingId: b.booking_id })
    expect(r.outcome).toBe('needs_review_paid_after_hold_ended_no_capacity')
    expect((await t.bookingRow(b.booking_id)).pending_contact).toMatchObject({ phone: '07000000000' })
  })

  it('fix 1: clears them at once when Checkout was never started, since no payment can ever arrive', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'unstarted@example.com', t.kids(['Un', 'Started', 'Year 3']))
    await pastHold(b.booking_id)
    await t.q(`select booking.release_unattached_holds()`)
    expect((await t.bookingRow(b.booking_id))).toMatchObject({ status: 'expired', pending_contact: null })
  })

  it('fix 1: the retention process removes kept details from ended bookings after the retention period, and not before', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'purge@example.com', t.kids(['Pu', 'Rge', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    await t.attach(b.booking_id, 'cs_purge', b.total_pence)
    await t.expired('evt_purge', 'cs_purge')
    await t.q(`select booking.purge_stale_pending_contacts()`)
    expect((await t.bookingRow(b.booking_id)).pending_contact).not.toBeNull()
    await t.q(`update booking.bookings set ended_at = now() - interval '31 days' where id = $1`, [b.booking_id])
    expect((await t.one(`select booking.purge_stale_pending_contacts() as n`)).n).toBeGreaterThanOrEqual(1)
    expect((await t.bookingRow(b.booking_id)).pending_contact).toBeNull()

    // A booking still under review keeps its details however old it is.
    const review = await t.reserve(club, 'individual', [ids[1]], 'purge-review@example.com', t.kids(['Pu', 'Review', 'Year 3']))
    await t.beginCheckout(review.booking_id)
    await t.attach(review.booking_id, 'cs_purge_review', review.total_pence)
    await t.completed('evt_purge_review', 'cs_purge_review', review.total_pence + 1)
    await t.q(`update booking.bookings set ended_at = now() - interval '90 days', updated_at = now() - interval '90 days' where id = $1`, [review.booking_id])
    await t.q(`select booking.purge_stale_pending_contacts()`)
    expect((await t.bookingRow(review.booking_id)).pending_contact).not.toBeNull()
  })

  it('an expiry for a Checkout that was never recorded releases its booking by the booking ID', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'expun@example.com', t.kids(['Ex', 'Un', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    expect((await t.expired('evt_exp_un', 'cs_never_attached', { bookingId: b.booking_id })).outcome).toBe('expired')
    expect((await t.bookingRow(b.booking_id)).status).toBe('expired')
  })

  it('late payment with room is confirmed and the administrator is told', async () => {
    const { club, ids } = await t.mkClub({ capacity: 4 })
    const b = await t.reserve(club, 'individual', ids.slice(0, 2), 'lateok@example.com', t.kids(['La', 'Te', 'Year 6']))
    await t.beginCheckout(b.booking_id)
    await t.attach(b.booking_id, 'cs_lateok', b.total_pence)
    await t.expired('evt_lateok_exp', 'cs_lateok')
    const r = await t.completed('evt_lateok_paid', 'cs_lateok', b.total_pence)
    expect(r.outcome).toBe('confirmed_after_hold_ended')
    expect(r.send_confirmation).toBe(true)
    expect(r.notify_admin).toBe(true)
    expect(t.alertCodes(r)).toEqual(['confirmed_after_hold_ended'])
  })

  it('late payment with no room is recorded, given no place, and sent for review without a refund', async () => {
    const { club, ids } = await t.mkClub({ capacity: 2 })
    const b = await t.reserve(club, 'individual', [ids[0]], 'latefull@example.com', t.kids(['La', 'Full', 'Year 6'], ['Lb', 'Full', 'Year 4']))
    await t.beginCheckout(b.booking_id)
    await t.attach(b.booking_id, 'cs_latefull', b.total_pence)
    await t.expired('evt_latefull_exp', 'cs_latefull')
    await t.reserve(club, 'individual', [ids[0]], 'tookit@example.com', t.kids(['To', 'Ok', 'Year 1'], ['Tp', 'Ok', 'Year 3']))

    const r = await t.completed('evt_latefull_paid', 'cs_latefull', b.total_pence)
    expect(r.outcome).toBe('needs_review_paid_after_hold_ended_no_capacity')
    expect(r.notify_admin).toBe(true)
    expect(r.send_confirmation).toBe(false)
    expect((await t.one(`select status from booking.payments where stripe_checkout_session_id = 'cs_latefull'`)).status).toBe('paid')
    expect(await t.livePlaces(b.booking_id)).toBe(0)
    expect(await t.overCapacity()).toEqual([])
    expect(await t.q(`select 1 from booking.payment_refunds r join booking.payments p on p.id = r.payment_id where p.booking_id = $1`, [b.booking_id])).toEqual([])

    await expect(t.q(`select booking.admin_confirm_reviewed_booking($1, $2)`, [b.booking_id, t.ADMIN])).rejects.toThrow('PLACES_NOT_AVAILABLE')
    await t.q(`update booking.club_sessions set capacity = 4 where id = $1`, [ids[0]])
    await t.q(`select booking.admin_confirm_reviewed_booking($1, $2)`, [b.booking_id, t.ADMIN])
    expect((await t.bookingRow(b.booking_id)).status).toBe('confirmed')
    expect((await t.availability(ids[0])).places_taken).toBe(4)
  })

  it('a not-paid completion event changes nothing', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'notpaid@example.com', t.kids(['No', 'Tpaid', 'Year 2']))
    await t.beginCheckout(b.booking_id)
    await t.attach(b.booking_id, 'cs_notpaid', b.total_pence)
    expect((await t.completed('evt_notpaid', 'cs_notpaid', b.total_pence, { status: 'unpaid' })).outcome).toBe('ignored_not_paid')
    expect((await t.bookingRow(b.booking_id)).status).toBe('pending')
  })
})

describe('L12: payment for a cancelled club or session is never confirmed', () => {
  it('a held booking paid after the club was cancelled goes to review and keeps its record', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'cancelclub@example.com', t.kids(['Ca', 'Ncel', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    await t.attach(b.booking_id, 'cs_cancelclub', b.total_pence)
    await t.q(`select booking.admin_set_club_status($1, 'cancelled', $2)`, [club, t.ADMIN])

    const r = await t.completed('evt_cancelclub', 'cs_cancelclub', b.total_pence)
    expect(r.outcome).toBe('needs_review_paid_for_cancelled_club_or_session')
    expect(r.notify_admin).toBe(true)
    expect(r.send_confirmation).toBe(false)
    expect((await t.bookingRow(b.booking_id)).review_reason).toBe('paid_for_cancelled_club_or_session')
    expect((await t.one(`select status from booking.payments where booking_id = $1`, [b.booking_id])).status).toBe('paid')
    expect(await t.q(`select 1 from booking.session_allocations where booking_id = $1 and status = 'confirmed'`, [b.booking_id])).toEqual([])
    await expect(t.q(`select booking.admin_confirm_reviewed_booking($1, $2)`, [b.booking_id, t.ADMIN])).rejects.toThrow('PLACES_NOT_AVAILABLE')
  })

  it('the same applies when just one of its sessions was cancelled', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0], ids[1]], 'cancelsess@example.com', t.kids(['Ca', 'Sess', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    await t.attach(b.booking_id, 'cs_cancelsess', b.total_pence)
    await t.q(`update booking.club_sessions set status = 'cancelled' where id = $1`, [ids[1]])
    expect((await t.completed('evt_cancelsess', 'cs_cancelsess', b.total_pence)).outcome).toBe('needs_review_paid_for_cancelled_club_or_session')
  })
})

describe('refunds, including failed refunds', () => {
  let b

  beforeAll(async () => {
    const { club, ids } = await t.mkClub()
    ;({ booking: b } = await t.bookAndPay(club, 'block', ids, 'refund@example.com', t.kids(['Re', 'Fund', 'Year 3']), 'cs_refund'))
  })

  const payment = () => t.one(`select status, refunded_pence from booking.payments where stripe_checkout_session_id = 'cs_refund'`)

  it('records a partial refund and tells the administrator', async () => {
    const r = await t.refund('evt_r1', 'pi_cs_refund', 're_1', 630)
    expect(r.outcome).toBe('refund_recorded')
    expect(r.notify_admin).toBe(true)
    expect(await payment()).toEqual({ status: 'partially_refunded', refunded_pence: 630 })
  })

  it('records the same refund once when a different event reports it again', async () => {
    expect((await t.refund('evt_r1b', 'pi_cs_refund', 're_1', 630)).outcome).toBe('refund_unchanged')
    expect((await payment()).refunded_pence).toBe(630)
  })

  it('does not count a pending refund until it succeeds', async () => {
    expect((await t.refund('evt_r2a', 'pi_cs_refund', 're_2', 3150, 'pending')).outcome).toBe('refund_pending_recorded')
    expect(await payment()).toEqual({ status: 'partially_refunded', refunded_pence: 630 })
    expect((await t.refund('evt_r2b', 'pi_cs_refund', 're_2', 3150, 'succeeded')).outcome).toBe('refund_recorded')
    expect(await payment()).toEqual({ status: 'refunded', refunded_pence: 3780 })
  })

  it('takes a refund back out when Stripe reports it failed, and alerts the administrator', async () => {
    const r = await t.refund('evt_r2c', 'pi_cs_refund', 're_2', 3150, 'failed')
    expect(r.outcome).toBe('refund_failure_recorded')
    expect(r.notify_admin).toBe(true)
    expect(t.alertCodes(r)).toContain('refund_failed')
    expect(await payment()).toEqual({ status: 'partially_refunded', refunded_pence: 630 })
    await t.refund('evt_r1c', 'pi_cs_refund', 're_1', 630, 'canceled')
    expect(await payment()).toEqual({ status: 'paid', refunded_pence: 0 })
  })

  it('never removes places because of a refund', async () => {
    expect(await t.livePlaces(b.booking_id)).toBe(6)
  })

  it('ignores a refund for a payment it does not know', async () => {
    expect((await t.refund('evt_r_unknown', 'pi_unknown', 're_x', 100)).outcome).toBe('ignored_unknown_payment')
  })
})

describe('reconciliation view', () => {
  const issues = async (bookingId) => (await t.q(`select issue from booking.reconciliation_issues where booking_id = $1 order by issue`, [bookingId])).map((r) => r.issue)

  it('reports nothing for a normal paid, confirmed booking', async () => {
    const { club, ids } = await t.mkClub()
    const { booking } = await t.bookAndPay(club, 'individual', [ids[0]], 'clean@example.com', t.kids(['Cl', 'Ean', 'Year 3']), 'cs_clean')
    expect(await issues(booking.booking_id)).toEqual([])
  })

  it('reports a fully refunded booking that still holds places, and stops once the places are cancelled and it is refunded', async () => {
    const { club, ids } = await t.mkClub()
    const { booking } = await t.bookAndPay(club, 'individual', [ids[0]], 'recon1@example.com', t.kids(['Re', 'Con', 'Year 3']), 'cs_recon1')
    await t.refund('evt_recon1', 'pi_cs_recon1', 're_recon1', booking.total_pence)
    expect(await issues(booking.booking_id)).toEqual(['fully_refunded_but_places_kept'])
    await t.q(`select booking.admin_cancel_booking($1, $2, 'parent_request')`, [booking.booking_id, t.ADMIN])
    expect(await issues(booking.booking_id)).toEqual([])
  })

  it('reports a cancelled booking that has not been refunded', async () => {
    const { club, ids } = await t.mkClub()
    const { booking } = await t.bookAndPay(club, 'individual', [ids[0]], 'recon2@example.com', t.kids(['Re', 'Two', 'Year 3']), 'cs_recon2')
    await t.q(`select booking.admin_cancel_booking($1, $2)`, [booking.booking_id, t.ADMIN])
    expect(await issues(booking.booking_id)).toEqual(['cancelled_but_not_fully_refunded'])
  })

  it('reports a second payment for one booking, records both, and alerts the administrator', async () => {
    const { club, ids } = await t.mkClub()
    const { booking } = await t.bookAndPay(club, 'individual', [ids[0]], 'recon3@example.com', t.kids(['Re', 'Three', 'Year 3']), 'cs_recon3')
    const second = await t.completed('evt_recon3_again', 'cs_recon3_second', booking.total_pence, { bookingId: booking.booking_id })
    expect(second.outcome).toBe('duplicate_payment_recorded')
    expect(second.notify_admin).toBe(true)
    expect(t.alertCodes(second)).toEqual(['duplicate_payment'])
    expect((await t.one(`select count(*)::int n from booking.payments where booking_id = $1 and status = 'paid'`, [booking.booking_id])).n).toBe(2)
    expect((await t.bookingRow(booking.booking_id)).status).toBe('confirmed')
    expect(await issues(booking.booking_id)).toEqual(['more_than_one_payment'])
  })

  it('reports a booking under review, and a paid amount that differs from the total', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'recon4@example.com', t.kids(['Re', 'Four', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    await t.attach(b.booking_id, 'cs_recon4', b.total_pence)
    await t.completed('evt_recon4', 'cs_recon4', b.total_pence + 50)
    expect(await issues(b.booking_id)).toEqual(['amount_received_differs_from_total', 'awaiting_review'])
  })

  it('reports places left in a cancelled club', async () => {
    const { club, ids } = await t.mkClub()
    const { booking } = await t.bookAndPay(club, 'individual', [ids[0]], 'recon5@example.com', t.kids(['Re', 'Five', 'Year 3']), 'cs_recon5')
    await t.q(`select booking.admin_set_club_status($1, 'cancelled', $2)`, [club, t.ADMIN])
    expect(await issues(booking.booking_id)).toEqual(['confirmed_place_in_cancelled_club_or_session'])
  })
})

describe('H3: one lock order (booking, then payment, then sessions)', () => {
  // With a single connection a deadlock cannot be provoked, so these check
  // the order in which each function takes its locks.
  const source = async (name) => (await t.asOwner(() => t.one(`select pg_get_functiondef(p.oid) as def from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'booking' and p.proname = $1`, [name]))).def

  it('reserve_booking looks at the contact\'s pending booking before it locks any session', async () => {
    const def = await source('reserve_booking')
    expect(def.indexOf('PENDING_BOOKING_EXISTS')).toBeGreaterThan(0)
    expect(def.indexOf('PENDING_BOOKING_EXISTS')).toBeLessThan(def.indexOf('SESSION_NOT_IN_CLUB'))
    expect(def.indexOf("b.status = 'pending'")).toBeLessThan(def.indexOf('from booking.club_sessions s'))
  })

  it('process_checkout_completed locks the booking before the payment and before any session', async () => {
    const def = await source('process_checkout_completed')
    const bookingLock = def.indexOf('from booking.bookings b where b.id = v_booking_id for update')
    const paymentLock = def.lastIndexOf('for update')
    const sessions = def.indexOf('_confirm_booking_allocations')
    expect(bookingLock).toBeGreaterThan(0)
    expect(bookingLock).toBeLessThan(paymentLock)
    expect(paymentLock).toBeLessThan(sessions)
  })

  it('a resubmission while payment is being processed is turned away without touching the paid booking', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'resub@example.com', t.kids(['Re', 'Sub', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    await t.attach(b.booking_id, 'cs_resub', b.total_pence)
    await expect(t.reserve(club, 'individual', [ids[0]], 'resub@example.com', t.kids(['Re', 'Sub', 'Year 3']))).rejects.toThrow('PENDING_BOOKING_EXISTS')
    expect((await t.completed('evt_resub', 'cs_resub', b.total_pence, { bookingId: b.booking_id })).outcome).toBe('confirmed')
    await expect(t.reserve(club, 'individual', [ids[0]], 'resub@example.com', t.kids(['Re', 'Sub', 'Year 3']))).rejects.toThrow('CHILD_ALREADY_BOOKED')
    expect((await t.availability(ids[0])).places_taken).toBe(1)
  })
})

describe('issue 2: a started Checkout whose deadline has passed', () => {
  const passDeadline = (bookingId, { holdAlsoPassed = false } = {}) =>
    t.q(`update booking.bookings set checkout_started_at = now() - interval '40 minutes',
           checkout_deadline_at = date_trunc('second', now() - interval '5 minutes'),
           hold_expires_at = now() ${holdAlsoPassed ? '-' : '+'} interval '10 minutes' where id = $1`, [bookingId])

  it('reports each stage of Checkout, and can_proceed_to_checkout is true only when the parent may be sent to Stripe', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'stages@example.com', t.kids(['St', 'Ages', 'Year 3']))
    expect(b).toMatchObject({ checkout_state: 'not_started', can_proceed_to_checkout: true })
    const key = (await t.bookingRow(b.booking_id)).request_key
    const replay = () => t.reserve(club, 'individual', [ids[0]], 'stages@example.com', t.kids(['St', 'Ages', 'Year 3']), { key })

    const open = await t.beginCheckout(b.booking_id)
    expect(open).toMatchObject({ checkout_state: 'open', can_proceed_to_checkout: true })
    expect(await replay()).toMatchObject({ replayed: true, checkout_state: 'open', can_proceed_to_checkout: true })

    await passDeadline(b.booking_id)
    const stale = await t.beginCheckout(b.booking_id)
    expect(stale).toMatchObject({ replayed: true, checkout_state: 'deadline_passed', can_proceed_to_checkout: false })
    expect(stale.checkout_expires_at_unix * 1000).toBeLessThan(Date.now())
    expect(await replay()).toMatchObject({ replayed: true, checkout_state: 'deadline_passed', can_proceed_to_checkout: false })
    // Asking did not change or release anything.
    expect((await t.bookingRow(b.booking_id)).status).toBe('pending')
    expect(await t.livePlaces(b.booking_id)).toBe(1)

    await t.q(`select booking.fail_booking($1)`, [b.booking_id])
    expect(await replay()).toMatchObject({ checkout_state: 'ended', can_proceed_to_checkout: false })
  })

  it('says a reservation whose short hold ran out before Checkout cannot proceed', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'shorthold@example.com', t.kids(['Sh', 'Hold', 'Year 3']))
    const key = (await t.bookingRow(b.booking_id)).request_key
    await pastHold(b.booking_id)
    const replay = await t.reserve(club, 'individual', [ids[0]], 'shorthold@example.com', t.kids(['Sh', 'Hold', 'Year 3']), { key })
    expect(replay).toMatchObject({ replayed: true, checkout_state: 'hold_expired', can_proceed_to_checkout: false })
    await expect(t.beginCheckout(b.booking_id)).rejects.toThrow('HOLD_EXPIRED')
  })

  it('will not record a Checkout once the deadline has passed, so its address is never handed out', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'lateattach@example.com', t.kids(['La', 'Attach', 'Year 3']))
    const started = await t.beginCheckout(b.booking_id)
    await passDeadline(b.booking_id)
    await expect(t.one(`select booking.attach_checkout_session($1, 'cs_lateattach', $2, false, to_timestamp($3)) as r`,
      [b.booking_id, b.total_pence, started.checkout_expires_at_unix])).rejects.toThrow('CHECKOUT_EXPIRY_AFTER_DEADLINE')
    expect(await t.q(`select 1 from booking.payments where booking_id = $1`, [b.booking_id])).toEqual([])
  })

  it('a new attempt is told the earlier session is closing: not sent back to it, and nothing is released', async () => {
    const { club, ids } = await t.mkClub({ capacity: 1 })
    const b = await t.reserve(club, 'individual', [ids[0]], 'closing@example.com', t.kids(['Cl', 'Osing', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    await t.attach(b.booking_id, 'cs_closing', b.total_pence)
    // Still open: the parent is sent back to their Checkout.
    await expect(t.reserve(club, 'individual', [ids[0]], 'closing@example.com', t.kids(['Cl', 'Osing', 'Year 3']))).rejects.toThrow('PENDING_BOOKING_EXISTS')

    // Deadline passed, Stripe has not yet confirmed what happened. Even long after the
    // hold time, a RECORDED Checkout is not released by a retry.
    await passDeadline(b.booking_id, { holdAlsoPassed: true })
    await t.q(`update booking.payments set checkout_expires_at = now() - interval '5 minutes' where booking_id = $1`, [b.booking_id])
    await expect(t.reserve(club, 'individual', [ids[0]], 'closing@example.com', t.kids(['Cl', 'Osing', 'Year 3']))).rejects.toThrow('PREVIOUS_CHECKOUT_CLOSING')
    expect((await t.bookingRow(b.booking_id)).status).toBe('pending')
    expect(await t.livePlaces(b.booking_id)).toBe(1)
    expect(await t.q(`select 1 from booking.bookings_awaiting_reconciliation where booking_id = $1`, [b.booking_id])).toHaveLength(1)

    // The payment had in fact succeeded and now arrives: the booking is confirmed, not lost.
    const paid = await t.completed('evt_closing', 'cs_closing', b.total_pence, { bookingId: b.booking_id })
    expect(paid.outcome).toBe('confirmed')
    expect((await t.availability(ids[0])).places_taken).toBe(1)
  })

  it('once Stripe confirms the session expired, the parent can book again straight away', async () => {
    const { club, ids } = await t.mkClub({ capacity: 1 })
    const b = await t.reserve(club, 'individual', [ids[0]], 'recover@example.com', t.kids(['Re', 'Cover', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    await t.attach(b.booking_id, 'cs_recover', b.total_pence)
    await passDeadline(b.booking_id)
    await expect(t.reserve(club, 'individual', [ids[0]], 'recover@example.com', t.kids(['Re', 'Cover', 'Year 3']))).rejects.toThrow('PREVIOUS_CHECKOUT_CLOSING')
    await t.expired('evt_recover', 'cs_recover')
    const again = await t.reserve(club, 'individual', [ids[0]], 'recover@example.com', t.kids(['Re', 'Cover', 'Year 3']))
    expect(again).toMatchObject({ status: 'pending', checkout_state: 'not_started', can_proceed_to_checkout: true })
  })
})

describe('issue 5: a Checkout that Stripe completed with nothing charged (no_payment_required)', () => {
  it('is never treated as paid and never left pending: it is recorded and sent for review with places still held', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0], ids[1]], 'free@example.com', t.kids(['Fr', 'Ee', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    await t.attach(b.booking_id, 'cs_free', b.total_pence)

    const r = await t.completed('evt_free', 'cs_free', 0, { bookingId: b.booking_id, status: 'no_payment_required' })
    expect(r.outcome).toBe('needs_review_checkout_completed_without_payment')
    expect(r.send_confirmation).toBe(false)
    expect(t.alertCodes(r)).toEqual(['checkout_completed_without_payment'])

    const row = await t.bookingRow(b.booking_id)
    expect(row).toMatchObject({ status: 'needs_review', review_reason: 'checkout_completed_without_payment' })
    expect(row.pending_contact).not.toBeNull()
    expect(await t.one(`select status, amount_received_pence, paid_at from booking.payments where booking_id = $1`, [b.booking_id]))
      .toEqual({ status: 'no_payment', amount_received_pence: 0, paid_at: null })
    expect(await t.livePlaces(b.booking_id)).toBe(2)
    expect(await t.q(`select 1 from booking.session_allocations where booking_id = $1 and status = 'confirmed'`, [b.booking_id])).toEqual([])
    // Not waiting on Stripe any more, and not counted as money received.
    expect(await t.q(`select 1 from booking.bookings_awaiting_reconciliation where booking_id = $1`, [b.booking_id])).toEqual([])
    expect((await t.q(`select issue from booking.reconciliation_issues where booking_id = $1`, [b.booking_id])).map((x) => x.issue)).toEqual(['awaiting_review'])
    expect((await t.one(`select enrolled_children from booking.club_enrolment where club_id = $1`, [club])).enrolled_children).toBe(0)
    // The hold is not released by the clock, and a repeat delivery changes nothing.
    await t.q(`update booking.bookings set hold_expires_at = now() - interval '1 day' where id = $1`, [b.booking_id])
    await t.q(`select booking.release_unattached_holds()`)
    expect((await t.bookingRow(b.booking_id)).status).toBe('needs_review')
    expect((await t.completed('evt_free', 'cs_free', 0, { status: 'no_payment_required' })).outcome).toBe('duplicate_event')
    expect(await t.livePlaces(b.booking_id)).toBe(2)
  })

  it('the administrator then decides: confirming shows up as confirmed without payment; cancelling frees the places', async () => {
    const { club, ids } = await t.mkClub()
    const give = await t.reserve(club, 'individual', [ids[0]], 'free-give@example.com', t.kids(['Fr', 'Give', 'Year 3']))
    await t.beginCheckout(give.booking_id)
    await t.attach(give.booking_id, 'cs_free_give', give.total_pence)
    await t.completed('evt_free_give', 'cs_free_give', 0, { status: 'no_payment_required' })
    await t.q(`select booking.admin_confirm_reviewed_booking($1, $2)`, [give.booking_id, t.ADMIN])
    expect((await t.bookingRow(give.booking_id)).status).toBe('confirmed')
    expect((await t.q(`select issue from booking.reconciliation_issues where booking_id = $1`, [give.booking_id])).map((x) => x.issue)).toEqual(['confirmed_without_payment'])

    const take = await t.reserve(club, 'individual', [ids[1]], 'free-take@example.com', t.kids(['Fr', 'Take', 'Year 3']))
    await t.beginCheckout(take.booking_id)
    await t.attach(take.booking_id, 'cs_free_take', take.total_pence)
    await t.completed('evt_free_take', 'cs_free_take', 0, { status: 'no_payment_required' })
    await t.q(`select booking.admin_cancel_booking($1, $2, 'administrative_correction')`, [take.booking_id, t.ADMIN])
    expect(await t.livePlaces(take.booking_id)).toBe(0)
    expect(await t.q(`select issue from booking.reconciliation_issues where booking_id = $1`, [take.booking_id])).toEqual([])
  })

  it('is recognised by its booking reference even if the Checkout was never recorded', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'free-unrec@example.com', t.kids(['Fr', 'Unrec', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    const r = await t.completed('evt_free_unrec', 'cs_free_unrec', 0, { bookingId: b.booking_id, status: 'no_payment_required' })
    expect(r.outcome).toBe('needs_review_checkout_completed_without_payment')
    expect(await t.one(`select status, recorded_without_attachment from booking.payments where booking_id = $1`, [b.booking_id]))
      .toEqual({ status: 'no_payment', recorded_without_attachment: true })
  })

  it('does not disturb a booking that has already been paid, and an ordinary unpaid event is still just ignored', async () => {
    const { club, ids } = await t.mkClub()
    const { booking } = await t.bookAndPay(club, 'individual', [ids[0]], 'free-paid@example.com', t.kids(['Fr', 'Paid', 'Year 3']), 'cs_free_paid')
    expect((await t.completed('evt_free_paid_2', 'cs_free_paid', 0, { status: 'no_payment_required' })).outcome).toBe('ignored_checkout_already_settled')
    expect((await t.bookingRow(booking.booking_id)).status).toBe('confirmed')
    expect((await t.one(`select status from booking.payments where booking_id = $1`, [booking.booking_id])).status).toBe('paid')

    const waiting = await t.reserve(club, 'individual', [ids[1]], 'free-unpaid@example.com', t.kids(['Fr', 'Unpaid', 'Year 3']))
    await t.beginCheckout(waiting.booking_id)
    await t.attach(waiting.booking_id, 'cs_free_unpaid', waiting.total_pence)
    expect((await t.completed('evt_free_unpaid', 'cs_free_unpaid', waiting.total_pence, { status: 'unpaid' })).outcome).toBe('ignored_not_paid')
    expect((await t.bookingRow(waiting.booking_id)).status).toBe('pending')
  })

  it('a reference this database does not hold raises no alert when nothing was paid', async () => {
    const r = await t.completed('evt_free_bogus', 'cs_free_bogus', 0, { bookingId: '00000000-0000-4000-8000-000000000001', status: 'no_payment_required' })
    expect(r).toMatchObject({ outcome: 'unrecognised_booking_reference', notify_admin: false })
  })
})

describe('issue 7: the payment must be in pounds sterling (gbp) as well as the right amount', () => {
  const ready = async (email, sessionId) => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], email, t.kids(['Cu', 'Rrency', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    await t.attach(b.booking_id, sessionId, b.total_pence)
    return { club, ids, b }
  }
  const issues = async (bookingId) => (await t.q(`select issue from booking.reconciliation_issues where booking_id = $1 order by issue`, [bookingId])).map((r) => r.issue)

  it('confirms an ordinary gbp payment, whatever the letter case', async () => {
    const { b } = await ready('gbp@example.com', 'cs_gbp')
    expect((await t.completed('evt_gbp', 'cs_gbp', b.total_pence, { currency: 'GBP' })).outcome).toBe('confirmed')
    expect((await t.one(`select currency from booking.payments where booking_id = $1`, [b.booking_id])).currency).toBe('gbp')
    expect(await issues(b.booking_id)).toEqual([])
  })

  it('records a payment in another currency, in that currency, and sends the booking for review instead of confirming it', async () => {
    const { b, ids } = await ready('usd@example.com', 'cs_usd')
    const r = await t.completed('evt_usd', 'cs_usd', b.total_pence, { currency: 'usd' })
    expect(r.outcome).toBe('needs_review_currency_mismatch')
    expect(r.send_confirmation).toBe(false)
    expect(t.alertCodes(r)).toEqual(['currency_mismatch'])
    expect((await t.bookingRow(b.booking_id))).toMatchObject({ status: 'needs_review', review_reason: 'currency_mismatch' })
    expect(await t.one(`select status, currency, amount_received_pence from booking.payments where booking_id = $1`, [b.booking_id]))
      .toEqual({ status: 'paid', currency: 'usd', amount_received_pence: b.total_pence })
    expect(await t.q(`select 1 from booking.session_allocations where booking_id = $1 and status = 'confirmed'`, [b.booking_id])).toEqual([])
    expect((await t.availability(ids[0])).places_taken).toBe(1)   // still held for the administrator to decide
    expect(await issues(b.booking_id)).toEqual(['awaiting_review', 'paid_in_unexpected_currency'])
  })

  it('treats a missing, blank or malformed currency the same way: never confirmed', async () => {
    for (const [i, currency] of [null, '', '   ', 'pounds', '£'].entries()) {
      const { b } = await ready(`nocur${i}@example.com`, `cs_nocur_${i}`)
      const r = await t.completed(`evt_nocur_${i}`, `cs_nocur_${i}`, b.total_pence, { currency })
      expect(r.outcome, String(currency)).toBe('needs_review_currency_mismatch')
      expect((await t.bookingRow(b.booking_id)).status).toBe('needs_review')
      expect((await t.one(`select status from booking.payments where booking_id = $1`, [b.booking_id])).status).toBe('paid')
    }
  })

  it('checks the currency before the amount, so the same number in another currency is not mistaken for the right amount', async () => {
    const { b } = await ready('eur@example.com', 'cs_eur')
    expect((await t.completed('evt_eur', 'cs_eur', b.total_pence + 1, { currency: 'eur' })).outcome).toBe('needs_review_currency_mismatch')
    const { b: wrongAmount } = await ready('gbpamount@example.com', 'cs_gbpamount')
    expect((await t.completed('evt_gbpamount', 'cs_gbpamount', wrongAmount.total_pence + 1, { currency: 'gbp' })).outcome).toBe('needs_review_amount_mismatch')
  })

  it('applies to a late payment too: wrong currency after expiry is recorded and reviewed, and takes no place', async () => {
    const { b, ids } = await ready('latecur@example.com', 'cs_latecur')
    await t.expired('evt_latecur_exp', 'cs_latecur')
    const r = await t.completed('evt_latecur', 'cs_latecur', b.total_pence, { currency: 'usd' })
    expect(r.outcome).toBe('needs_review_currency_mismatch')
    expect((await t.availability(ids[0])).places_taken).toBe(0)
    expect((await t.one(`select status, currency from booking.payments where booking_id = $1`, [b.booking_id]))).toEqual({ status: 'paid', currency: 'usd' })
  })

  it('applies to a payment recognised by booking reference before the Checkout was recorded', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'refcur@example.com', t.kids(['Re', 'Fcur', 'Year 3']))
    await t.beginCheckout(b.booking_id)
    const r = await t.completed('evt_refcur', 'cs_refcur', b.total_pence, { bookingId: b.booking_id, currency: 'usd' })
    expect(r.outcome).toBe('needs_review_currency_mismatch')
    expect(await t.one(`select status, currency, recorded_without_attachment from booking.payments where booking_id = $1`, [b.booking_id]))
      .toEqual({ status: 'paid', currency: 'usd', recorded_without_attachment: true })
  })

  it('the administrator can still confirm or cancel a booking held for a currency mismatch', async () => {
    const { b } = await ready('curadmin@example.com', 'cs_curadmin')
    await t.completed('evt_curadmin', 'cs_curadmin', b.total_pence, { currency: 'usd' })
    await t.q(`select booking.admin_confirm_reviewed_booking($1, $2)`, [b.booking_id, t.ADMIN])
    expect((await t.bookingRow(b.booking_id)).status).toBe('confirmed')
    expect(await issues(b.booking_id)).toEqual(['paid_in_unexpected_currency'])   // stays visible
  })
})

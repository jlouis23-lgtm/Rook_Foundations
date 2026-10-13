// Administrator authorisation, atomic audit records, audit-log personal-data
// protection, child duplicate review, and minimum enrolment.

import { beforeAll, describe, expect, it } from 'vitest'
import { createDb } from './helpers/db.js'

let t

beforeAll(async () => {
  t = await createDb()
})

const audit = (entityId) => t.q(`select action, actor_type, actor_id, detail from booking.audit_log where entity_id = $1 order by id`, [entityId])

describe('administrator authorisation', () => {
  it('recognises only users on the allowlist', async () => {
    const r = await t.one(`select booking.is_admin($1) as admin, booking.is_admin($2) as stranger, booking.is_admin(null) as nobody`, [t.ADMIN, t.STRANGER])
    expect(r).toEqual({ admin: true, stranger: false, nobody: false })
  })

  it('refuses every admin function for a signed-in non-admin and for a missing user', async () => {
    const { club, ids } = await t.mkClub()
    const { booking } = await t.bookAndPay(club, 'individual', [ids[0]], 'auth@example.com', t.kids(['Au', 'Th', 'Year 3']), 'cs_auth')
    const alloc = (await t.one(`select id, child_id from booking.session_allocations where booking_id = $1`, [booking.booking_id]))
    const calls = [
      [`select booking.admin_save_venue($1, '{"name":"X"}'::jsonb)`, []],
      [`select booking.admin_save_club($1, '{"title":"X"}'::jsonb)`, []],
      [`select booking.admin_save_session($1, '{}'::jsonb)`, []],
      [`select booking.admin_set_club_status($2, 'closed', $1)`, [club]],
      [`select booking.admin_set_club_review($2, 'cancelled', $1)`, [club]],
      [`select booking.admin_cancel_allocation($2, $1)`, [alloc.id]],
      [`select booking.admin_cancel_booking($2, $1)`, [booking.booking_id]],
      [`select booking.admin_confirm_reviewed_booking($2, $1)`, [booking.booking_id]],
      [`select booking.admin_cancel_session($2, $1)`, [ids[0]]],
      [`select booking.admin_flag_possible_duplicate($2, $3, $1)`, [alloc.child_id, alloc.child_id]],
      [`select booking.admin_mark_children_distinct($2, $3, $1)`, [alloc.child_id, alloc.child_id]],
      [`select booking.admin_merge_children($2, $3, $1)`, [alloc.child_id, alloc.child_id]],
      [`select booking.admin_split_child($2, $3::uuid[], $1)`, [alloc.child_id, `{${alloc.id}}`]],
      [`select booking.anonymise_contact($2, 'admin', $1)`, [(await t.bookingRow(booking.booking_id)).contact_id]]
    ]
    for (const [sql, extra] of calls) {
      await expect(t.q(sql, [t.STRANGER, ...extra]), sql).rejects.toThrow('NOT_AUTHORISED')
      await expect(t.q(sql, [null, ...extra]), sql).rejects.toThrow('NOT_AUTHORISED')
    }
    expect((await t.bookingRow(booking.booking_id)).status).toBe('confirmed')
  })

  it('will not cancel a booking that may still be paid, or a session with a payment in progress', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'inprogress@example.com', t.kids(['In', 'Prog', 'Year 3']))
    await expect(t.q(`select booking.admin_cancel_booking($1, $2)`, [b.booking_id, t.ADMIN])).rejects.toThrow('BOOKING_NOT_CANCELLABLE')
    await expect(t.q(`select booking.admin_cancel_session($1, $2)`, [ids[0], t.ADMIN])).rejects.toThrow('SESSION_HAS_PAYMENTS_IN_PROGRESS')
  })

  it('cancels a session and its confirmed places, and a booking without touching the payment', async () => {
    const { club, ids } = await t.mkClub()
    const { booking } = await t.bookAndPay(club, 'individual', [ids[0], ids[1]], 'cancel@example.com', t.kids(['Ca', 'Ncel', 'Year 3']), 'cs_cancel')
    expect((await t.one(`select booking.admin_cancel_session($1, $2) as n`, [ids[0], t.ADMIN])).n).toBe(1)
    expect((await t.one(`select status from booking.club_sessions where id = $1`, [ids[0]])).status).toBe('cancelled')
    await t.q(`select booking.admin_cancel_booking($1, $2, 'parent_request', 'Asked by phone to cancel')`, [booking.booking_id, t.ADMIN])
    expect(await t.livePlaces(booking.booking_id)).toBe(0)
    expect((await t.one(`select status from booking.payments where booking_id = $1`, [booking.booking_id])).status).toBe('paid')
  })
})

describe('H6: venue, club and session changes are audited in the same transaction', () => {
  it('records who created and changed a club, with code-like values only', async () => {
    const venue = (await t.one(`select booking.admin_save_venue($1, $2::jsonb) as id`, [t.ADMIN, JSON.stringify({ name: 'Audit School', address: '1 High Street', postcode: 'CM6 1AA' })])).id
    const club = (await t.one(`select booking.admin_save_club($1, $2::jsonb) as id`, [t.ADMIN, JSON.stringify({
      venue_id: venue, slug: 'audit-club', title: 'Audit Club', description: 'Run by Mrs Example',
      price_per_session_pence: 700, block_discount_percent: 10, default_capacity: 12,
      enrolment_deadline: '2030-01-01T09:00:00Z'
    })])).id
    await t.q(`select booking.admin_save_club($1, $2::jsonb)`, [t.ADMIN, JSON.stringify({ id: club, price_per_session_pence: 750, title: 'Audit Club (renamed)' })])
    await t.q(`select booking.admin_set_club_status($1, 'published', $2)`, [club, t.ADMIN])

    const venueAudit = await audit(venue)
    expect(venueAudit.map((r) => r.action)).toEqual(['venue_created'])
    expect(venueAudit[0]).toMatchObject({ actor_type: 'admin', actor_id: t.ADMIN })
    expect(JSON.stringify(venueAudit[0].detail)).not.toMatch(/High Street|CM6|Audit School/)

    const clubAudit = await audit(club)
    expect(clubAudit.map((r) => r.action)).toEqual(['club_created', 'club_updated', 'club_updated'])
    expect(clubAudit.every((r) => r.actor_type === 'admin' && r.actor_id === t.ADMIN)).toBe(true)
    expect(clubAudit[1].detail.changed).toEqual(['price_per_session_pence', 'title'])
    expect(clubAudit[1].detail.price_per_session_pence).toBe(750)
    expect(clubAudit[2].detail).toMatchObject({ status: 'published', op: 'update' })
    expect(clubAudit[2].detail.changed).toEqual(['published_at', 'status'])
    expect(JSON.stringify(clubAudit)).not.toMatch(/Mrs Example|renamed|Audit Club/)
  })

  it('audits sessions, including capacity changes and cancellation', async () => {
    const { club } = await t.mkClub({ capacity: 9, sessions: 0 })
    const session = (await t.one(`select booking.admin_save_session($1, $2::jsonb) as id`, [t.ADMIN, JSON.stringify({ club_id: club, starts_at: '2030-02-01T15:30:00Z', ends_at: '2030-02-01T16:30:00Z' })])).id
    expect((await t.one(`select capacity from booking.club_sessions where id = $1`, [session])).capacity).toBe(9)
    await t.q(`select booking.admin_save_session($1, $2::jsonb)`, [t.ADMIN, JSON.stringify({ id: session, capacity: 12 })])
    await t.q(`select booking.admin_cancel_session($1, $2)`, [session, t.ADMIN])
    const rows = await audit(session)
    expect(rows.map((r) => r.action)).toEqual(['club_session_created', 'club_session_updated', 'club_session_updated', 'session_places_cancelled'])
    expect(rows[1].detail).toMatchObject({ capacity: 12, changed: ['capacity'] })
    expect(rows[2].detail).toMatchObject({ status: 'cancelled', changed: ['status'] })
    expect(rows.every((r) => r.actor_type === 'admin')).toBe(true)
  })

  it('still audits a change made by a direct table write, as the system', async () => {
    const { club } = await t.mkClub()
    await t.q(`update booking.clubs set default_capacity = 20 where id = $1`, [club])
    const rows = await audit(club)
    expect(rows.at(-1)).toMatchObject({ action: 'club_updated', actor_type: 'system', actor_id: null })
  })

  it('writes no audit row when the change itself fails, and no change when the audit row fails', async () => {
    const { club } = await t.mkClub()
    const before = (await audit(club)).length
    await expect(t.q(`select booking.admin_save_club($1, $2::jsonb)`, [t.ADMIN, JSON.stringify({ id: club, price_per_session_pence: 0 })])).rejects.toThrow('clubs_price_positive')
    expect((await audit(club)).length).toBe(before)

    // Make the audit insert fail: the club change must be rolled back with it.
    await t.asOwner(() => t.db.exec(`alter table booking.audit_log add constraint test_block_audit check (action <> 'club_updated') not valid`))
    try {
      await expect(t.q(`select booking.admin_save_club($1, $2::jsonb)`, [t.ADMIN, JSON.stringify({ id: club, price_per_session_pence: 999 })])).rejects.toThrow('test_block_audit')
      expect((await t.one(`select price_per_session_pence as p from booking.clubs where id = $1`, [club])).p).toBe(700)
    } finally {
      await t.asOwner(() => t.db.exec(`alter table booking.audit_log drop constraint test_block_audit`))
    }
  })

  it('records the club review decision without changing the club status', async () => {
    const { club } = await t.mkClub()
    await t.q(`select booking.admin_set_club_review($1, 'proceed', $2, 'Enough interest from Year 4')`, [club, t.ADMIN])
    const row = await t.one(`select status, review_status, review_note from booking.clubs where id = $1`, [club])
    expect(row).toEqual({ status: 'published', review_status: 'proceed', review_note: 'Enough interest from Year 4' })
    expect(JSON.stringify(await audit(club))).not.toMatch(/Enough interest/)
  })
})

describe('H5: no free text or personal details in the permanent audit log', () => {
  it('functions accept only fixed reason codes', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'reason@example.com', t.kids(['Re', 'Ason', 'Year 3']))
    await expect(t.q(`select booking.fail_booking($1, 'Mrs Example rang 07000 111222 to say her card was declined')`, [b.booking_id])).rejects.toThrow('INVALID_REASON_CODE')
    expect((await t.bookingRow(b.booking_id)).status).toBe('pending')

    const { booking } = await t.bookAndPay(club, 'individual', [ids[1]], 'reason2@example.com', t.kids(['Re', 'Two', 'Year 3']), 'cs_reason')
    await expect(t.q(`select booking.admin_cancel_booking($1, $2, 'She moved house')`, [booking.booking_id, t.ADMIN])).rejects.toThrow('INVALID_REASON_CODE')
    const alloc = (await t.one(`select id from booking.session_allocations where booking_id = $1`, [booking.booking_id])).id
    await expect(t.q(`select booking.admin_cancel_allocation($1, $2, 'ill today')`, [alloc, t.ADMIN])).rejects.toThrow('INVALID_REASON_CODE')
  })

  it('keeps the administrator\'s note on the booking, not in the audit log', async () => {
    const { club, ids } = await t.mkClub()
    const { booking } = await t.bookAndPay(club, 'individual', [ids[0]], 'note@example.com', t.kids(['No', 'Te', 'Year 3']), 'cs_note')
    await t.q(`select booking.admin_cancel_booking($1, $2, 'parent_request', 'Mrs Example rang 07000 111222')`, [booking.booking_id, t.ADMIN])
    expect((await t.bookingRow(booking.booking_id)).admin_note).toBe('Mrs Example rang 07000 111222')
    const rows = await audit(booking.booking_id)
    expect(rows.at(-1).detail).toEqual({ previous_status: 'confirmed', reason: 'parent_request' })
    expect(JSON.stringify(rows)).not.toMatch(/Example|07000/)
  })

  it('the audit table itself rejects sentences, emails, phone numbers and nested values', async () => {
    const insert = (detail) => t.q(`select booking.write_audit('booking', gen_random_uuid(), 'test_entry', 'system', null, $1::jsonb)`, [JSON.stringify(detail)])
    await expect(insert({ note: 'Mrs Example rang to cancel' })).rejects.toThrow('AUDIT_DETAIL_NOT_ALLOWED')
    await expect(insert({ email: 'parent@example.com' })).rejects.toThrow('AUDIT_DETAIL_NOT_ALLOWED')
    await expect(insert({ phone: '07000111222' })).rejects.toThrow('AUDIT_DETAIL_NOT_ALLOWED')
    await expect(insert({ phone: '+447000111222' })).rejects.toThrow('AUDIT_DETAIL_NOT_ALLOWED')
    await expect(insert({ nested: { name: 'x' } })).rejects.toThrow('AUDIT_DETAIL_NOT_ALLOWED')
    await expect(insert({ list: ['ok_code', 'two words'] })).rejects.toThrow('AUDIT_DETAIL_NOT_ALLOWED')
    await expect(t.q(`insert into booking.audit_log (entity_type, action, actor_type, detail) values ('booking', 'test_entry', 'system', '"just a string"'::jsonb)`)).rejects.toThrow('AUDIT_DETAIL_NOT_ALLOWED')
    await insert({ reason: 'parent_request', amount_pence: 700, late: true, when: '2026-10-13T10:00:00+00:00', id: '00000000-0000-4000-8000-000000000000', changed: ['status', 'capacity'] })
  })

  it('is append-only, even for the owner', async () => {
    await expect(t.q(`update booking.audit_log set action = 'changed'`)).rejects.toThrow('permission denied')
    await expect(t.q(`delete from booking.audit_log`)).rejects.toThrow('permission denied')
    await t.asOwner(async () => {
      await expect(t.q(`update booking.audit_log set action = 'changed'`)).rejects.toThrow('AUDIT_LOG_IS_APPEND_ONLY')
      await expect(t.q(`delete from booking.audit_log`)).rejects.toThrow('AUDIT_LOG_IS_APPEND_ONLY')
      await expect(t.q(`truncate booking.audit_log`)).rejects.toThrow('AUDIT_LOG_IS_APPEND_ONLY')
    })
  })

  it('after a full run of bookings, holds no names, emails or phone numbers', async () => {
    const leaks = await t.q(`select id from booking.audit_log where detail::text ~* '(example\\.com|Pat Parent|Em Contact|07000000000|07111111111|Smith|Jones)'`)
    expect(leaks).toEqual([])
    expect((await t.one(`select count(*)::int n from booking.audit_log`)).n).toBeGreaterThan(30)
  })
})

describe('possible duplicate children, reviewed and resolved by the administrator', () => {
  let club, ids
  const enrolment = () => t.one(`select enrolled_children, possible_duplicates, definite_children, count_is_provisional, meets_minimum from booking.club_enrolment where club_id = $1`, [club])
  const childOf = async (email, first) => (await t.one(`select ch.id from booking.children ch join booking.contacts c on c.id = ch.contact_id where c.email = $1 and ch.first_name = $2 and ch.merged_into_child_id is null order by ch.created_at limit 1`, [email, first])).id

  beforeAll(async () => {
    ({ club, ids } = await t.mkClub({ capacity: 20, sessions: 6, min: 3 }))
    await t.bookAndPay(club, 'individual', [ids[0], ids[2], ids[4]], 'mum@example.com', t.kids(['Alex', 'Reed', 'Year 3']), 'cs_d1')
    await t.bookAndPay(club, 'individual', [ids[0]], 'other@example.com', t.kids(['Bea', 'Stone', 'Year 2']), 'cs_d2')
  })

  it('counts a child once however many sessions, and a different child separately', async () => {
    expect(await enrolment()).toEqual({ enrolled_children: 2, possible_duplicates: 0, definite_children: 2, count_is_provisional: false, meets_minimum: false })
  })

  it('does not count a held (unpaid) place', async () => {
    await t.reserve(club, 'individual', [ids[1]], 'heldonly@example.com', t.kids(['Held', 'Only', 'Year 2']))
    expect((await enrolment()).enrolled_children).toBe(2)
  })

  it('a same-named child booked by a different parent is a POSSIBLE duplicate, not a definite extra child', async () => {
    // Dad books the same child for a different session using his own email.
    await t.bookAndPay(club, 'individual', [ids[1]], 'dad@example.com', t.kids(['Alex', 'Reed', 'Year 3']), 'cs_d3')
    const e = await enrolment()
    expect(e).toEqual({ enrolled_children: 3, possible_duplicates: 1, definite_children: 2, count_is_provisional: true, meets_minimum: false })
    const pairs = await t.q(`select source from booking.possible_duplicate_children where club_id = $1`, [club])
    expect(pairs).toEqual([{ source: 'same_name' }])
    // Nothing was merged automatically.
    expect((await t.one(`select count(*)::int n from booking.children where merged_into_child_id is not null`)).n).toBe(0)
  })

  it('a different year group later is also only a possible duplicate', async () => {
    const yr = await t.mkClub({ capacity: 20, min: 2 })
    await t.bookAndPay(yr.club, 'individual', [yr.ids[0]], 'year@example.com', t.kids(['Cy', 'Year', 'Year 3']), 'cs_y1')
    await t.bookAndPay(yr.club, 'individual', [yr.ids[1]], 'year@example.com', t.kids(['Cy', 'Year', 'Year 4']), 'cs_y2')
    const e = await t.one(`select enrolled_children, definite_children, meets_minimum from booking.club_enrolment where club_id = $1`, [yr.club])
    expect(e).toEqual({ enrolled_children: 2, definite_children: 1, meets_minimum: false })
  })

  it('the deadline check uses the definite count, so a possible duplicate cannot hide a shortfall', async () => {
    // 3 records but only 2 definite children against a minimum of 3.
    await t.q(`update booking.clubs set enrolment_deadline = now() - interval '1 minute' where id = $1`, [club])
    const flagged = (await t.q(`select * from booking.flag_under_enrolled_clubs()`)).filter((r) => r.club_id === club)
    expect(flagged).toHaveLength(1)
    expect(flagged[0]).toMatchObject({ enrolled_children: 3, possible_duplicates: 1, definite_children: 2, min_children: 3 })
    expect((await t.q(`select * from booking.flag_under_enrolled_clubs()`)).filter((r) => r.club_id === club)).toHaveLength(0)
    const c = await t.one(`select status, review_status from booking.clubs where id = $1`, [club])
    expect(c).toEqual({ status: 'published', review_status: 'flagged' })
    expect((await t.one(`select count(*)::int n from booking.bookings where club_id = $1 and status = 'cancelled'`, [club])).n).toBe(0)
  })

  it('the review alert is owed once and marking it sent is idempotent', async () => {
    const owed = await t.q(`select message_type, code, alert_id from booking.outstanding_messages where club_id = $1 and message_type = 'admin_alert' and code = 'club_below_minimum'`, [club])
    expect(owed).toHaveLength(1)
    expect((await t.one(`select booking.mark_admin_alert_sent($1) as done`, [owed[0].alert_id])).done).toBe(true)
    expect((await t.one(`select booking.mark_admin_alert_sent($1) as done`, [owed[0].alert_id])).done).toBe(false)
    expect(await t.q(`select 1 from booking.outstanding_messages where club_id = $1 and code = 'club_below_minimum'`, [club])).toEqual([])
  })

  it('bookings stay open after the deadline', async () => {
    expect((await t.reserve(club, 'individual', [ids[5]], 'afterdeadline@example.com', t.kids(['Af', 'Ter', 'Year 5']))).status).toBe('pending')
  })

  it('the administrator can decide the two records are different children', async () => {
    const mum = await childOf('mum@example.com', 'Alex')
    const dad = await childOf('dad@example.com', 'Alex')
    await t.q(`select booking.admin_mark_children_distinct($1, $2, $3)`, [mum, dad, t.ADMIN])
    expect(await enrolment()).toMatchObject({ enrolled_children: 3, possible_duplicates: 0, definite_children: 3, count_is_provisional: false, meets_minimum: true })
    // ...and can re-open the question.
    await t.q(`select booking.admin_flag_possible_duplicate($1, $2, $3)`, [dad, mum, t.ADMIN])
    expect(await enrolment()).toMatchObject({ possible_duplicates: 1, definite_children: 2, count_is_provisional: true })
  })

  it('the administrator can merge them: places move to one record and the count becomes definite', async () => {
    const mum = await childOf('mum@example.com', 'Alex')
    const dad = await childOf('dad@example.com', 'Alex')
    const moved = (await t.one(`select booking.admin_merge_children($1, $2, $3) as n`, [mum, dad, t.ADMIN])).n
    expect(moved).toBe(1)
    expect(await enrolment()).toMatchObject({ enrolled_children: 2, possible_duplicates: 0, definite_children: 2, count_is_provisional: false })
    const merged = await t.one(`select merged_into_child_id, first_name from booking.children where id = $1`, [dad])
    expect(merged).toEqual({ merged_into_child_id: mum, first_name: 'Alex' })
    expect((await t.one(`select count(*)::int n from booking.session_allocations where child_id = $1 and status = 'confirmed'`, [mum])).n).toBe(4)
    await expect(t.q(`select booking.admin_merge_children($1, $2, $3)`, [mum, dad, t.ADMIN])).rejects.toThrow('CHILD_NOT_AVAILABLE_FOR_MERGE')
    await expect(t.q(`select booking.admin_mark_children_distinct($1, $2, $3)`, [mum, dad, t.ADMIN])).rejects.toThrow('CHILDREN_ALREADY_MERGED')
  })

  it('a merged-away record is never matched again: dad\'s next booking creates a new record for review', async () => {
    await t.bookAndPay(club, 'individual', [ids[3]], 'dad@example.com', t.kids(['Alex', 'Reed', 'Year 3']), 'cs_d4')
    expect((await t.one(`select count(*)::int n from booking.children ch join booking.contacts c on c.id = ch.contact_id where c.email = 'dad@example.com'`)).n).toBe(2)
    expect(await enrolment()).toMatchObject({ enrolled_children: 3, possible_duplicates: 1, definite_children: 2 })
  })

  it('refuses to merge two records that have places on the same session', async () => {
    const m = await t.mkClub({ capacity: 20 })
    await t.bookAndPay(m.club, 'individual', [m.ids[0]], 'p1@example.com', t.kids(['Kit', 'Same', 'Year 3']), 'cs_m1')
    await t.bookAndPay(m.club, 'individual', [m.ids[0]], 'p2@example.com', t.kids(['Kit', 'Same', 'Year 3']), 'cs_m2')
    const a = await childOf('p1@example.com', 'Kit')
    const b = await childOf('p2@example.com', 'Kit')
    await expect(t.q(`select booking.admin_merge_children($1, $2, $3)`, [a, b, t.ADMIN])).rejects.toThrow('CHILDREN_SHARE_A_SESSION')
    expect((await t.availability(m.ids[0])).places_taken).toBe(2)
  })

  it('identically named siblings booked in separate checkouts can be split into two records', async () => {
    const s = await t.mkClub({ capacity: 20, min: 2 })
    await t.bookAndPay(s.club, 'individual', [s.ids[0]], 'sib@example.com', t.kids(['Sam', 'Lee', 'Year 3']), 'cs_s1')
    // The twin, booked separately for another session, is matched to the same record...
    await t.bookAndPay(s.club, 'individual', [s.ids[1]], 'sib@example.com', t.kids(['Sam', 'Lee', 'Year 3']), 'cs_s2')
    const sEnrol = () => t.one(`select enrolled_children, definite_children, possible_duplicates from booking.club_enrolment where club_id = $1`, [s.club])
    expect(await sEnrol()).toEqual({ enrolled_children: 1, definite_children: 1, possible_duplicates: 0 })

    // ...until the administrator splits it.
    const original = await childOf('sib@example.com', 'Sam')
    const place = (await t.one(`select id from booking.session_allocations where child_id = $1 and session_id = $2`, [original, s.ids[1]])).id
    const twin = (await t.one(`select booking.admin_split_child($1, $2::uuid[], $3) as id`, [original, `{${place}}`, t.ADMIN])).id
    expect(twin).not.toBe(original)
    expect(await sEnrol()).toEqual({ enrolled_children: 2, definite_children: 2, possible_duplicates: 0 })
    await expect(t.q(`select booking.admin_split_child($1, $2::uuid[], $3)`, [original, `{${place}}`, t.ADMIN])).rejects.toThrow('PLACE_NOT_OWNED_BY_CHILD')
    expect((await t.one(`select count(*)::int n from booking.children ch join booking.contacts c on c.id = ch.contact_id where c.email = 'sib@example.com'`)).n).toBe(2)
  })

  it('siblings entered together are never shown as possible duplicates', async () => {
    const s = await t.mkClub({ capacity: 20, min: 2 })
    await t.bookAndPay(s.club, 'individual', [s.ids[0]], 'together@example.com', t.kids(['Jo', 'Twin', 'Year 3'], ['Jo', 'Twin', 'Year 3']), 'cs_tw')
    expect(await t.one(`select enrolled_children, definite_children, possible_duplicates, meets_minimum from booking.club_enrolment where club_id = $1`, [s.club]))
      .toEqual({ enrolled_children: 2, definite_children: 2, possible_duplicates: 0, meets_minimum: true })
  })
})

describe('issue 6: a club or session that families have booked cannot be quietly changed', () => {
  let club, ids, booking

  beforeAll(async () => {
    ({ club, ids } = await t.mkClub())
    ;({ booking } = await t.bookAndPay(club, 'individual', [ids[0]], 'protect@example.com', t.kids(['Pr', 'Otect', 'Year 3']), 'cs_protect'))
  })

  const snapshot = async () => ({
    club: await t.one(`select status from booking.clubs where id = $1`, [club]),
    session: await t.one(`select starts_at, ends_at, club_id from booking.club_sessions where id = $1`, [ids[0]]),
    booking: (await t.bookingRow(booking.booking_id)).status,
    places: await t.livePlaces(booking.booking_id),
    audit: (await t.one(`select count(*)::int n from booking.audit_log`)).n,
    alerts: (await t.one(`select count(*)::int n from booking.admin_alerts`)).n
  })

  it('refuses to move a club with a confirmed booking back to draft, by function or by direct write', async () => {
    const before = await snapshot()
    await expect(t.q(`select booking.admin_set_club_status($1, 'draft', $2)`, [club, t.ADMIN])).rejects.toThrow('CLUB_HAS_BOOKINGS')
    await expect(t.q(`update booking.clubs set status = 'draft' where id = $1`, [club])).rejects.toThrow('CLUB_HAS_BOOKINGS')
    expect(await snapshot()).toEqual(before)   // nothing changed, nothing audited, no alert invented
  })

  it('still allows the statuses that do not hide a booked club from its own records', async () => {
    for (const status of ['unpublished', 'closed', 'published']) {
      await t.q(`select booking.admin_set_club_status($1, $2, $3)`, [club, status, t.ADMIN])
      expect((await t.one(`select status from booking.clubs where id = $1`, [club])).status).toBe(status)
    }
  })

  it('refuses to change the date, time or club of a session with a confirmed booking', async () => {
    const before = await snapshot()
    const other = await t.mkClub()
    const attempts = [
      [`select booking.admin_save_session($1, $2::jsonb)`, [t.ADMIN, JSON.stringify({ id: ids[0], starts_at: '2031-01-01T15:00:00Z', ends_at: '2031-01-01T16:00:00Z' })]],
      [`select booking.admin_save_session($1, $2::jsonb)`, [t.ADMIN, JSON.stringify({ id: ids[0], ends_at: '2031-06-01T16:00:00Z' })]],
      [`update booking.club_sessions set starts_at = starts_at + interval '1 hour', ends_at = ends_at + interval '1 hour' where id = $1`, [ids[0]]],
      [`update booking.club_sessions set starts_at = starts_at - interval '1 minute' where id = $1`, [ids[0]]],
      [`update booking.club_sessions set club_id = $2 where id = $1`, [ids[0], other.club]]
    ]
    for (const [sql, params] of attempts) {
      await expect(t.q(sql, params), sql).rejects.toThrow('SESSION_HAS_BOOKINGS')
    }
    const after = await snapshot()
    expect(after.session).toEqual(before.session)
    expect(after.booking).toBe('confirmed')
    expect(after.places).toBe(1)
    expect(after.alerts).toBe(before.alerts)
  })

  it('protects a session while a payment is in progress too', async () => {
    const p = await t.mkClub()
    await t.reserve(p.club, 'individual', [p.ids[0]], 'protect-held@example.com', t.kids(['Pr', 'Held', 'Year 3']))
    await expect(t.q(`update booking.club_sessions set starts_at = starts_at + interval '1 day', ends_at = ends_at + interval '1 day' where id = $1`, [p.ids[0]])).rejects.toThrow('SESSION_HAS_BOOKINGS')
    await expect(t.q(`select booking.admin_set_club_status($1, 'draft', $2)`, [p.club, t.ADMIN])).rejects.toThrow('CLUB_HAS_BOOKINGS')
  })

  it('still allows capacity and open/closed changes on a booked session, and saving it with unchanged times', async () => {
    const same = await t.one(`select starts_at, ends_at from booking.club_sessions where id = $1`, [ids[0]])
    await t.q(`select booking.admin_save_session($1, $2::jsonb)`, [t.ADMIN, JSON.stringify({ id: ids[0], capacity: 15, status: 'closed', starts_at: same.starts_at, ends_at: same.ends_at })])
    expect(await t.one(`select capacity, status from booking.club_sessions where id = $1`, [ids[0]])).toEqual({ capacity: 15, status: 'closed' })
  })

  it('leaves a session nobody has booked, and a club nobody has booked, free to change', async () => {
    await t.q(`select booking.admin_save_session($1, $2::jsonb)`, [t.ADMIN, JSON.stringify({ id: ids[3], starts_at: '2031-03-01T15:00:00Z', ends_at: '2031-03-01T16:00:00Z' })])
    expect((await t.one(`select extract(year from starts_at)::int y from booking.club_sessions where id = $1`, [ids[3]])).y).toBe(2031)
    const empty = await t.mkClub()
    await t.q(`select booking.admin_set_club_status($1, 'draft', $2)`, [empty.club, t.ADMIN])
    expect((await t.one(`select status from booking.clubs where id = $1`, [empty.club])).status).toBe('draft')
  })

  it('the explicit route for moving a booked session is to cancel it, which is audited, and add a new one', async () => {
    const m = await t.mkClub()
    const { booking: mb } = await t.bookAndPay(m.club, 'individual', [m.ids[0]], 'protect-move@example.com', t.kids(['Pr', 'Move', 'Year 3']), 'cs_protect_move')
    expect((await t.one(`select booking.admin_cancel_session($1, $2, 'session_cancelled') as n`, [m.ids[0], t.ADMIN])).n).toBe(1)
    const replacement = (await t.one(`select booking.admin_save_session($1, $2::jsonb) as id`, [t.ADMIN, JSON.stringify({ club_id: m.club, starts_at: '2031-04-01T15:00:00Z', ends_at: '2031-04-01T16:00:00Z' })])).id
    expect(replacement).not.toBe(m.ids[0])
    // The family's place was cancelled openly; it was not silently moved to the new date.
    expect(await t.one(`select status, ended_reason from booking.session_allocations where booking_id = $1`, [mb.booking_id])).toEqual({ status: 'cancelled', ended_reason: 'session_cancelled' })
    expect((await t.availability(replacement)).places_taken).toBe(0)
    expect((await audit(m.ids[0])).map((r) => r.action)).toContain('session_places_cancelled')
    // The payment is untouched and now shows up for the administrator to deal with.
    expect((await t.one(`select status from booking.payments where booking_id = $1`, [mb.booking_id])).status).toBe('paid')
    // A cancelled session with no live places can no longer be edited at all.
    await expect(t.q(`select booking.admin_save_session($1, $2::jsonb)`, [t.ADMIN, JSON.stringify({ id: m.ids[0], capacity: 5 })])).rejects.toThrow('SESSION_NOT_FOUND_OR_CANCELLED')
  })
})

describe('issue 4: unpublished clubs are still checked at their enrolment deadline', () => {
  const flaggedNow = async (club) => (await t.q(`select * from booking.flag_under_enrolled_clubs()`)).filter((r) => r.club_id === club)
  const pastDeadline = (club) => t.q(`update booking.clubs set enrolment_deadline = now() - interval '1 minute' where id = $1`, [club])

  it('flags an unpublished club that has a confirmed booking and is below its minimum, and raises the alert', async () => {
    const { club, ids } = await t.mkClub({ min: 3 })
    const { booking } = await t.bookAndPay(club, 'individual', [ids[0]], 'unpub@example.com', t.kids(['Un', 'Pub', 'Year 3']), 'cs_unpub')
    await t.q(`select booking.admin_set_club_status($1, 'unpublished', $2)`, [club, t.ADMIN])
    await pastDeadline(club)

    const flagged = await flaggedNow(club)
    expect(flagged).toHaveLength(1)
    expect(flagged[0]).toMatchObject({ enrolled_children: 1, definite_children: 1, min_children: 3 })
    expect(await flaggedNow(club)).toEqual([])   // once only
    expect(await t.q(`select code from booking.outstanding_messages where club_id = $1 and message_type = 'admin_alert' and booking_id is null`, [club])).toEqual([{ code: 'club_below_minimum' }])

    // Nothing was cancelled, closed or refunded.
    expect(await t.one(`select status, review_status from booking.clubs where id = $1`, [club])).toEqual({ status: 'unpublished', review_status: 'flagged' })
    expect((await t.bookingRow(booking.booking_id)).status).toBe('confirmed')
    expect(await t.livePlaces(booking.booking_id)).toBe(1)
    expect(await t.q(`select 1 from booking.payment_refunds r join booking.payments p on p.id = r.payment_id where p.booking_id = $1`, [booking.booking_id])).toEqual([])
  })

  it('does not flag an unpublished club that meets its minimum', async () => {
    const { club, ids } = await t.mkClub({ min: 1 })
    await t.bookAndPay(club, 'individual', [ids[0]], 'unpub-ok@example.com', t.kids(['Un', 'Ok', 'Year 3']), 'cs_unpub_ok')
    await t.q(`select booking.admin_set_club_status($1, 'unpublished', $2)`, [club, t.ADMIN])
    await pastDeadline(club)
    expect(await flaggedNow(club)).toEqual([])
  })

  it('does not flag an unpublished club nobody has a confirmed place in, even with a payment in progress', async () => {
    const { club, ids } = await t.mkClub({ min: 3 })
    await t.reserve(club, 'individual', [ids[0]], 'unpub-held@example.com', t.kids(['Un', 'Held', 'Year 3']))
    await t.q(`select booking.admin_set_club_status($1, 'unpublished', $2)`, [club, t.ADMIN])
    await pastDeadline(club)
    expect(await flaggedNow(club)).toEqual([])
  })

  it('never flags a draft or a cancelled club, and still flags published and closed ones', async () => {
    const draft = await t.mkClub({ min: 3 })
    await t.q(`select booking.admin_set_club_status($1, 'draft', $2)`, [draft.club, t.ADMIN])
    await pastDeadline(draft.club)
    expect(await flaggedNow(draft.club)).toEqual([])

    const cancelled = await t.mkClub({ min: 3 })
    await t.bookAndPay(cancelled.club, 'individual', [cancelled.ids[0]], 'cancelled-club@example.com', t.kids(['Ca', 'Club', 'Year 3']), 'cs_cancelled_club')
    await t.q(`select booking.admin_set_club_status($1, 'cancelled', $2)`, [cancelled.club, t.ADMIN])
    await pastDeadline(cancelled.club)
    expect(await flaggedNow(cancelled.club)).toEqual([])

    for (const status of ['published', 'closed']) {
      const c = await t.mkClub({ min: 3 })
      await t.q(`select booking.admin_set_club_status($1, $2, $3)`, [c.club, status, t.ADMIN])
      await pastDeadline(c.club)
      expect(await flaggedNow(c.club), status).toHaveLength(1)
    }
  })
})

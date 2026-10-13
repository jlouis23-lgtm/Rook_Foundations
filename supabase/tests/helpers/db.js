// Shared set-up for the school clubs database tests.
//
// createDb() starts a fresh in-memory PostgreSQL (PGlite), adds stand-ins for
// the things Supabase provides (the anon / authenticated / service_role roles
// and auth.users), applies every file in supabase/migrations in name order,
// and returns helpers that call the booking functions as the service role,
// exactly as the Netlify Functions will.
//
// PGlite has ONE connection. These tests therefore prove the rules when
// requests arrive one after another. They cannot prove behaviour when two
// requests run at the same instant.
//
// The PostgreSQL version is chosen with the BOOKING_TEST_PG environment
// variable: 16, 17 (the default, and what new Supabase projects run) or 18.
// Each is the same PGlite package at a different release, installed under an
// alias. Supabase also supports PostgreSQL 15, for which no local engine
// exists; the migrations avoid anything newer than 15, and a test checks for
// the obvious newer syntax, but 15 itself can only be confirmed on Supabase.

import { readdirSync, readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const MIGRATIONS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../migrations')

export const migrationFiles = () => readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort()
export const migrationSql = (file) => readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8')

const ENGINES = { 16: 'pglite-pg16', 17: 'pglite-pg17', 18: 'pglite-pg18' }
export const PG_MAJOR = Number(process.env.BOOKING_TEST_PG || 17)

async function loadEngine() {
  const name = ENGINES[PG_MAJOR]
  if (!name) throw new Error(`BOOKING_TEST_PG must be one of ${Object.keys(ENGINES).join(', ')}; got ${process.env.BOOKING_TEST_PG}`)
  return (await import(name)).PGlite
}

export async function createDb() {
  const PGlite = await loadEngine()
  const db = new PGlite()

  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin bypassrls;
    create schema auth;
    create table auth.users (id uuid primary key);
  `)
  for (const file of migrationFiles()) {
    await db.exec(readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8'))
  }

  const ADMIN = randomUUID()
  const STRANGER = randomUUID()
  await db.exec(`
    insert into auth.users (id) values ('${ADMIN}'), ('${STRANGER}');
    insert into booking.admin_users (user_id, note) values ('${ADMIN}', 'test admin');
    set role service_role;
  `)

  const q = async (sql, params = []) => (await db.query(sql, params)).rows
  const one = async (sql, params = []) => (await q(sql, params))[0]

  // Runs fn as the database owner (for test set-up the service role may not do).
  const asOwner = async (fn) => {
    await db.exec('reset role')
    try {
      return await fn()
    } finally {
      await db.exec('set role service_role')
    }
  }
  const asRole = async (role, fn) => {
    await db.exec(`set role ${role}`)
    try {
      return await fn()
    } finally {
      await db.exec('set role service_role')
    }
  }

  let slugCounter = 0
  const venueId = (await one(`insert into booking.venues (name, address) values ('Test Primary', '1 Test Road') returning id`)).id

  // A published club with `sessions` weekly sessions starting a week from now.
  const mkClub = async ({ capacity = 10, sessions = 6, discount = 10, min = 8, price = 700 } = {}) => {
    const slug = `club-${++slugCounter}`
    const club = (await one(
      `insert into booking.clubs (venue_id, slug, title, price_per_session_pence, block_discount_percent,
                                  default_capacity, min_children, enrolment_deadline, status)
       values ($1, $2, $3, $4, $5, $6, $7, now() + interval '5 days', 'published') returning id`,
      [venueId, slug, `Club ${slug}`, price, discount, capacity, min]
    )).id
    const ids = []
    for (let i = 1; i <= sessions; i++) {
      ids.push((await one(
        `insert into booking.club_sessions (club_id, starts_at, ends_at, capacity)
         values ($1, now() + ($2 || ' days')::interval, now() + ($2 || ' days')::interval + interval '1 hour', $3)
         returning id`,
        [club, String(7 * i), capacity]
      )).id)
    }
    return { club, ids }
  }

  const contact = (email, overrides = {}) => JSON.stringify({
    email,
    full_name: 'Pat Parent',
    phone: '07000000000',
    emergency_name: 'Em Contact',
    emergency_phone: '07111111111',
    ...overrides
  })
  const kids = (...list) => JSON.stringify(
    list.map(([first_name, surname, year_group]) => ({ first_name, surname, year_group }))
  )

  const reserve = async (club, type, sessionIds, email, children, { key = randomUUID(), terms = true, contactOverrides } = {}) =>
    (await one(
      `select booking.reserve_booking($1, $2, $3, $4::uuid[], $5::jsonb, $6::jsonb, $7) as r`,
      [key, club, type, `{${sessionIds.join(',')}}`, contact(email, contactOverrides), children, terms]
    )).r

  const beginCheckout = async (bookingId) =>
    (await one(`select booking.begin_checkout($1) as r`, [bookingId])).r

  // Records the Stripe Checkout, expiring at the booking's deadline unless told otherwise.
  const attach = async (bookingId, sessionId, amount, { live = false, expiresInMinutes } = {}) =>
    (await one(
      `select booking.attach_checkout_session($1, $2, $3, $4,
         coalesce(now() + ($5 || ' minutes')::interval,
                  (select checkout_deadline_at from booking.bookings where id = $1))) as r`,
      [bookingId, sessionId, amount, live, expiresInMinutes == null ? null : String(expiresInMinutes)]
    )).r

  // `currency` defaults to what Stripe sends for a Checkout created in pounds.
  const completed = async (eventId, sessionId, amount, { bookingId = null, intent = `pi_${sessionId}`, status = 'paid', live = false, currency = 'gbp' } = {}) =>
    (await one(
      `select booking.process_checkout_completed($1, 'checkout.session.completed', $2, $3, $4, $5, $6, $7, $8) as r`,
      [eventId, sessionId, intent, status, amount, currency, live, bookingId]
    )).r

  const expired = async (eventId, sessionId, { bookingId = null, live = false } = {}) =>
    (await one(
      `select booking.process_checkout_expired($1, 'checkout.session.expired', $2, $3, $4) as r`,
      [eventId, sessionId, live, bookingId]
    )).r

  const refund = async (eventId, intent, refundId, amount, status = 'succeeded') =>
    (await one(
      `select booking.process_refund($1, 'refund.updated', $2, $3, $4, $5, 'requested_by_customer', false) as r`,
      [eventId, intent, refundId, amount, status]
    )).r

  // The full happy path: reserve -> begin checkout -> attach -> paid.
  const bookAndPay = async (club, type, sessionIds, email, children, sessionId) => {
    const booking = await reserve(club, type, sessionIds, email, children)
    await beginCheckout(booking.booking_id)
    await attach(booking.booking_id, sessionId, booking.total_pence)
    const result = await completed(`evt_${sessionId}`, sessionId, booking.total_pence, { bookingId: booking.booking_id })
    return { booking, result }
  }

  const availability = async (sessionId) =>
    one(`select capacity, places_taken, places_remaining from booking.session_availability where session_id = $1`, [sessionId])
  const bookingRow = async (bookingId) => one(`select * from booking.bookings where id = $1`, [bookingId])
  const livePlaces = async (bookingId) =>
    (await one(`select count(*)::int as n from booking.session_allocations where booking_id = $1 and status in ('held','confirmed')`, [bookingId])).n
  const overCapacity = async () => q(`select session_id from booking.session_availability where places_taken > capacity`)
  // Moves a club's sessions back in time, to test things that depend on a
  // session being in the past. The database refuses to change the time of a
  // session that has bookings, so this is done as the owner with that one
  // protection switched off for the duration.
  const shiftSessions = async (clubId, interval) => asOwner(async () => {
    await db.exec(`alter table booking.club_sessions disable trigger club_sessions_protect_booked_times`)
    try {
      await q(`update booking.club_sessions set starts_at = starts_at - $2::interval, ends_at = ends_at - $2::interval where club_id = $1`, [clubId, interval])
    } finally {
      await db.exec(`alter table booking.club_sessions enable trigger club_sessions_protect_booked_times`)
    }
  })

  // Codes of the administrator alerts a webhook result says are still owed.
  const alertCodes = (result) => (result.admin_alerts || []).map((a) => a.code).sort()
  // Administrator alerts still owed for a booking, oldest first.
  const owedAlerts = async (bookingId) =>
    q(`select alert_id, code, message_key from booking.outstanding_messages
        where booking_id = $1 and message_type = 'admin_alert' order by required_at, alert_id`, [bookingId])

  return {
    db, q, one, asOwner, asRole, ADMIN, STRANGER, venueId,
    mkClub, contact, kids, reserve, beginCheckout, attach, completed, expired, refund, bookAndPay,
    availability, bookingRow, livePlaces, overCapacity, alertCodes, owedAlerts, shiftSessions
  }
}

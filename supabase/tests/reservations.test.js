// Reserving places: pricing, capacity, all-or-nothing, duplicates, block rules,
// isolation level, booking references.

import { beforeAll, describe, expect, it } from 'vitest'
import { randomUUID } from 'node:crypto'
import { createDb, migrationFiles, migrationSql, PG_MAJOR } from './helpers/db.js'

let t

beforeAll(async () => {
  t = await createDb()
})

describe('migrations', () => {
  it('are the expected 15 files, applied in name order', () => {
    expect(migrationFiles()).toHaveLength(15)
    expect(migrationFiles()[0]).toMatch(/000001_booking_schema_and_privileges\.sql$/)
    expect(migrationFiles()[14]).toMatch(/000015_privileges\.sql$/)
  })
})

describe('block and individual pricing', () => {
  it('applies the block discount per place and totals the places', async () => {
    const { club, ids } = await t.mkClub({ capacity: 5, sessions: 6, discount: 10 })
    const b = await t.reserve(club, 'block', ids, 'One@Example.com', t.kids(['Ada', 'Smith', 'Year 3']))
    expect(b.unit_price_pence).toBe(630)
    expect(b.subtotal_pence).toBe(4200)
    expect(b.discount_pence).toBe(420)
    expect(b.total_pence).toBe(3780)
    expect(await t.livePlaces(b.booking_id)).toBe(6)
  })

  it('rounds to a whole penny and keeps the total equal to the sum of places', async () => {
    const { club, ids } = await t.mkClub({ sessions: 3, discount: 15, price: 555 })
    const b = await t.reserve(club, 'block', ids, 'round@example.com', t.kids(['O', 'D', 'Year 2'], ['P', 'D', 'Year 4']))
    const sum = (await t.one(`select sum(unit_price_pence)::int as s from booking.session_allocations where booking_id = $1`, [b.booking_id])).s
    expect(b.unit_price_pence).toBe(472)
    expect(b.total_pence).toBe(sum)
    expect(b.total_pence).toBe(472 * 6)
  })

  it('charges the standard price for individual sessions and multiplies by children', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0], ids[1]], 'two@example.com', t.kids(['Ben', 'Jones', 'Year 2'], ['Cal', 'Jones', 'Year 4']))
    expect(b.total_pence).toBe(2 * 2 * 700)
    expect(b.discount_pence).toBe(0)
    expect(await t.livePlaces(b.booking_id)).toBe(4)
  })

  it('stores the email in lower case and leaves a new contact without details until payment', async () => {
    const c = await t.one(`select email, full_name from booking.contacts where email = 'one@example.com'`)
    expect(c.email).toBe('one@example.com')
    expect(c.full_name).toBeNull()
  })

  it('refuses a block that leaves a session out, and unaccepted terms', async () => {
    const { club, ids } = await t.mkClub()
    await expect(t.reserve(club, 'block', ids.slice(0, 5), 'x@example.com', t.kids(['X', 'Y', 'Year 1']))).rejects.toThrow('BLOCK_MUST_INCLUDE_ALL_SESSIONS')
    await expect(t.reserve(club, 'individual', [ids[0]], 'x@example.com', t.kids(['X', 'Y', 'Year 1']), { terms: false })).rejects.toThrow('TERMS_NOT_ACCEPTED')
  })

  it('returns the same booking for the same request key', async () => {
    const { club, ids } = await t.mkClub()
    const key = randomUUID()
    const first = await t.reserve(club, 'individual', [ids[0]], 'replay@example.com', t.kids(['R', 'P', 'Year 1']), { key })
    const again = await t.reserve(club, 'individual', [ids[0]], 'replay@example.com', t.kids(['R', 'P', 'Year 1']), { key })
    expect(again.booking_id).toBe(first.booking_id)
    expect(again.replayed).toBe(true)
    expect((await t.availability(ids[0])).places_taken).toBe(1)
  })
})

describe('capacity shared by block and individual bookings', () => {
  let club, ids

  beforeAll(async () => {
    ({ club, ids } = await t.mkClub({ capacity: 3, sessions: 6 }))
    await t.reserve(club, 'block', ids, 'cap1@example.com', t.kids(['Ada', 'Smith', 'Year 3']))
    await t.reserve(club, 'individual', [ids[0], ids[1]], 'cap2@example.com', t.kids(['Ben', 'Jones', 'Year 2'], ['Cal', 'Jones', 'Year 4']))
  })

  it('counts both kinds of booking against the same session', async () => {
    expect((await t.availability(ids[0])).places_remaining).toBe(0)
    expect((await t.availability(ids[2])).places_remaining).toBe(2)
  })

  it('refuses the request once the last place has gone', async () => {
    await expect(t.reserve(club, 'individual', [ids[0]], 'cap3@example.com', t.kids(['Dee', 'Khan', 'Year 1']))).rejects.toThrow('SESSION_FULL')
  })

  it('reserves nothing at all when any one session is full', async () => {
    const before = await t.one(`select (select count(*) from booking.bookings)::int b, (select count(*) from booking.session_allocations)::int a,
                                       (select count(*) from booking.contacts)::int c, (select count(*) from booking.children)::int ch`)
    await expect(t.reserve(club, 'individual', [ids[2], ids[0]], 'cap3@example.com', t.kids(['Dee', 'Khan', 'Year 1']))).rejects.toThrow('SESSION_FULL')
    await expect(t.reserve(club, 'individual', [ids[2]], 'cap4@example.com', t.kids(['E', 'F', 'Year 1'], ['G', 'F', 'Year 2'], ['H', 'F', 'Year 5']))).rejects.toThrow('SESSION_FULL')
    const after = await t.one(`select (select count(*) from booking.bookings)::int b, (select count(*) from booking.session_allocations)::int a,
                                      (select count(*) from booking.contacts)::int c, (select count(*) from booking.children)::int ch`)
    expect(after).toEqual(before)
  })

  it('never exceeds capacity', async () => {
    expect(await t.overCapacity()).toEqual([])
  })

  it('blocks a direct write beyond capacity and a capacity cut below places taken', async () => {
    await expect(t.q(`update booking.club_sessions set capacity = 1 where id = $1`, [ids[0]])).rejects.toThrow('CAPACITY_BELOW_PLACES_TAKEN')
    const b = (await t.one(`select id from booking.bookings where club_id = $1 limit 1`, [club])).id
    const spare = await t.q(`insert into booking.children (contact_id, first_name, surname, year_group)
                             select contact_id, 'Extra', 'Child', 'Year 1' from booking.bookings where id = $1 returning id`, [b])
    await expect(t.q(`insert into booking.session_allocations (booking_id, child_id, session_id, status, unit_price_pence)
                      values ($1, $2, $3, 'held', 700)`, [b, spare[0].id, ids[0]])).rejects.toThrow('SESSION_FULL')
  })
})

describe('duplicate places and child identity', () => {
  it('will not give the same child a second place on a session', async () => {
    const { club, ids } = await t.mkClub()
    await t.bookAndPay(club, 'individual', [ids[0]], 'dup@example.com', t.kids(['Ada', 'Smith', 'Year 3']), 'cs_dup')
    // Same child (matched despite different capitals), same session.
    await expect(t.reserve(club, 'individual', [ids[0]], 'dup@example.com', t.kids(['ada', 'SMITH', 'year 3']))).rejects.toThrow('CHILD_ALREADY_BOOKED')
    const n = (await t.one(`select count(*)::int n from booking.children ch join booking.contacts c on c.id = ch.contact_id where c.email = 'dup@example.com'`)).n
    expect(n).toBe(1)
  })

  it('treats two identical entries in one request as two children, recorded as distinct', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'twins@example.com', t.kids(['Sam', 'Lee', 'Year 3'], ['Sam', 'Lee', 'Year 3']))
    const kidsUsed = await t.q(`select distinct child_id from booking.session_allocations where booking_id = $1`, [b.booking_id])
    expect(kidsUsed).toHaveLength(2)
    const flag = await t.one(`select status, source from booking.child_duplicate_flags
                               where child_a_id = least($1::uuid, $2::uuid) and child_b_id = greatest($1::uuid, $2::uuid)`,
      [kidsUsed[0].child_id, kidsUsed[1].child_id])
    expect(flag).toEqual({ status: 'distinct', source: 'system' })
  })

  it('blocks a duplicate live place written directly', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'direct@example.com', t.kids(['Di', 'Rect', 'Year 3']))
    const a = await t.one(`select child_id, session_id from booking.session_allocations where booking_id = $1`, [b.booking_id])
    const other = (await t.reserve(club, 'individual', [ids[1]], 'direct2@example.com', t.kids(['Ot', 'Her', 'Year 3']))).booking_id
    await expect(t.q(`insert into booking.session_allocations (booking_id, child_id, session_id, status, unit_price_pence)
                      values ($1, $2, $3, 'held', 700)`, [other, a.child_id, a.session_id])).rejects.toThrow('session_allocations_one_live_place_per_child')
  })

  it('rejects a child with no year group, in the function and in the table', async () => {
    const { club, ids } = await t.mkClub()
    await expect(t.reserve(club, 'individual', [ids[0]], 'noyear@example.com', JSON.stringify([{ first_name: 'No', surname: 'Year' }]))).rejects.toThrow('INVALID_CHILD_DETAILS')
    const c = (await t.one(`insert into booking.contacts (email) values ('yg@example.com') returning id`)).id
    await expect(t.q(`insert into booking.children (contact_id, first_name, surname, year_group) values ($1, 'A', 'B', null)`, [c])).rejects.toThrow('children_year_group_present')
    await expect(t.q(`insert into booking.children (contact_id, first_name, surname, year_group) values ($1, 'A', 'B', '   ')`, [c])).rejects.toThrow('children_year_group_present')
  })
})

describe('block bookings stop once the club has started', () => {
  it('sells remaining sessions individually at full price only', async () => {
    const { club, ids } = await t.mkClub({ sessions: 4 })
    await t.q(`update booking.club_sessions set starts_at = now() - interval '2 hours', ends_at = now() - interval '1 hour' where id = $1`, [ids[0]])
    await expect(t.reserve(club, 'block', ids, 'st@example.com', t.kids(['S', 'T', 'Year 3']))).rejects.toThrow('SESSION_NOT_BOOKABLE')
    await expect(t.reserve(club, 'block', ids.slice(1), 'st@example.com', t.kids(['S', 'T', 'Year 3']))).rejects.toThrow('BLOCK_NOT_AVAILABLE_CLUB_STARTED')
    await expect(t.reserve(club, 'individual', [ids[0]], 'st2@example.com', t.kids(['S', 'U', 'Year 3']))).rejects.toThrow('SESSION_NOT_BOOKABLE')
    const b = await t.reserve(club, 'individual', ids.slice(1), 'st@example.com', t.kids(['S', 'T', 'Year 3']))
    expect(b.total_pence).toBe(3 * 700)
    expect(b.discount_pence).toBe(0)
  })

  it('takes no bookings for a closed, unpublished or cancelled club', async () => {
    const { club, ids } = await t.mkClub()
    for (const status of ['closed', 'unpublished', 'cancelled']) {
      await t.q(`update booking.clubs set status = $2 where id = $1`, [club, status])
      await expect(t.reserve(club, 'individual', [ids[0]], 'closed@example.com', t.kids(['C', 'L', 'Year 3']))).rejects.toThrow('CLUB_NOT_BOOKABLE')
    }
  })
})

describe('isolation level', () => {
  // The capacity count is only correct at READ COMMITTED. Rather than assume
  // it, the functions and triggers refuse to run at any other level.
  for (const level of ['repeatable read', 'serializable']) {
    it(`refuses to reserve places inside a ${level} transaction`, async () => {
      const { club, ids } = await t.mkClub()
      await t.db.exec(`begin isolation level ${level}`)
      try {
        await expect(t.reserve(club, 'individual', [ids[0]], 'iso@example.com', t.kids(['I', 'S', 'Year 3']))).rejects.toThrow('WRONG_ISOLATION_LEVEL')
      } finally {
        await t.db.exec('rollback')
      }
      expect((await t.availability(ids[0])).places_taken).toBe(0)
    })
  }

  it('refuses a direct place write and a capacity cut at the wrong level too', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'iso2@example.com', t.kids(['I', 'T', 'Year 3']))
    const child = (await t.one(`select child_id from booking.session_allocations where booking_id = $1`, [b.booking_id])).child_id

    await t.db.exec('begin isolation level repeatable read')
    try {
      await expect(t.q(`insert into booking.session_allocations (booking_id, child_id, session_id, status, unit_price_pence)
                        values ($1, $2, $3, 'held', 700)`, [b.booking_id, child, ids[1]])).rejects.toThrow('WRONG_ISOLATION_LEVEL')
    } finally {
      await t.db.exec('rollback')
    }
    await t.db.exec('begin isolation level repeatable read')
    try {
      await expect(t.q(`update booking.club_sessions set capacity = 5 where id = $1`, [ids[0]])).rejects.toThrow('WRONG_ISOLATION_LEVEL')
    } finally {
      await t.db.exec('rollback')
    }
  })

  it('works at the default level, which is read committed', async () => {
    expect((await t.one(`show transaction_isolation`)).transaction_isolation).toBe('read committed')
  })
})

describe('booking references', () => {
  it('are RC- plus 12 unambiguous characters', async () => {
    const { club, ids } = await t.mkClub()
    const b = await t.reserve(club, 'individual', [ids[0]], 'ref@example.com', t.kids(['R', 'F', 'Year 3']))
    expect(b.reference).toMatch(/^RC-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{12}$/)
  })

  it('tries again when a candidate collides, and fails cleanly if it never finds a free one', async () => {
    const fresh = await createDb()
    const { club, ids } = await fresh.mkClub()
    // Make the generator predictable: the first three candidates are identical.
    await fresh.asOwner(() => fresh.db.exec(`
      create sequence public.test_ref_seq;
      grant usage on schema public to service_role;
      grant usage on sequence public.test_ref_seq to service_role;
      create or replace function booking._reference_candidate() returns text language sql volatile
        set search_path = booking, pg_temp
        as $f$ select case when nextval('public.test_ref_seq') <= 3 then 'RC-COLLISION0001' else 'RC-UNIQUE000001' end $f$;
    `))
    const first = await fresh.reserve(club, 'individual', [ids[0]], 'c1@example.com', fresh.kids(['C', 'One', 'Year 3']))
    const second = await fresh.reserve(club, 'individual', [ids[0]], 'c2@example.com', fresh.kids(['C', 'Two', 'Year 3']))
    expect(first.reference).toBe('RC-COLLISION0001')
    expect(second.reference).toBe('RC-UNIQUE000001')

    // Now every candidate collides.
    await fresh.asOwner(() => fresh.db.exec(`
      create or replace function booking._reference_candidate() returns text language sql volatile
        set search_path = booking, pg_temp as $f$ select 'RC-COLLISION0001'::text $f$;
    `))
    await expect(fresh.reserve(club, 'individual', [ids[0]], 'c3@example.com', fresh.kids(['C', 'Three', 'Year 3']))).rejects.toThrow('REFERENCE_GENERATION_FAILED')
    expect((await fresh.one(`select count(*)::int n from booking.bookings`)).n).toBe(2)
    expect((await fresh.availability(ids[0])).places_taken).toBe(2)
  })
})

describe('issue 1: PostgreSQL version compatibility', () => {
  it('is running on the PostgreSQL version that was asked for', async () => {
    const major = Math.floor(Number((await t.one(`select current_setting('server_version_num') as n`)).n) / 10000)
    expect([16, 17, 18]).toContain(PG_MAJOR)
    expect(major).toBe(PG_MAJOR)
  })

  it('uses nothing in the migrations that PostgreSQL 15 does not have', () => {
    // Syntax and functions introduced after PostgreSQL 15. This is a guard
    // against the obvious cases; only a real PostgreSQL 15 can confirm the rest.
    const newerThan15 = [
      [/\bany_value\s*\(/i, 'any_value() (16)'],
      [/\bjson_table\s*\(/i, 'JSON_TABLE (17)'],
      [/\bjson_(scalar|serialize|exists|query|value)\s*\(/i, 'SQL/JSON functions (16-17)'],
      [/\bis\s+(not\s+)?json\b/i, 'IS JSON (16)'],
      [/\bmerge\s+into\b[\s\S]*?\breturning\b/i, 'MERGE ... RETURNING (17)'],
      [/\breturning\s+(old|new)\./i, 'RETURNING old/new (18)'],
      [/\buuidv[47]\s*\(/i, 'uuidv4()/uuidv7() (18)'],
      [/\bgenerated\s+always\s+as\s*\([^)]*\)\s*virtual\b/i, 'virtual generated columns (18)'],
      [/\bwithout\s+overlaps\b/i, 'temporal constraints (18)'],
      [/\bnot\s+enforced\b/i, 'NOT ENFORCED constraints (18)'],
      [/\brandom_normal\s*\(/i, 'random_normal() (16)'],
      [/\barray_(shuffle|sample)\s*\(/i, 'array_shuffle()/array_sample() (16)'],
      [/\bcreate\s+event\s+trigger\b/i, 'event triggers (need superuser on Supabase)'],
      [/\bsecurity\s+definer\b/i, 'SECURITY DEFINER (not used by design)'],
      [/\bcreate\s+extension\b/i, 'extensions (none are needed)']
    ]
    for (const file of migrationFiles()) {
      const sql = migrationSql(file).replace(/--.*$/gm, '')
      for (const [pattern, what] of newerThan15) {
        expect(pattern.test(sql), `${file} uses ${what}`).toBe(false)
      }
    }
  })

  it('needs only what Supabase provides: three roles and auth.users, and no extension', async () => {
    const extensions = await t.asOwner(() => t.q(`select extname from pg_extension where extname <> 'plpgsql'`))
    expect(extensions).toEqual([])
    const sql = migrationFiles().map(migrationSql).join('\n').replace(/--.*$/gm, '')
    const roles = new Set((sql.match(/\b(?:to|from)\s+([a-z_, ]+?)\s*;/gi) || [])
      .flatMap((m) => m.replace(/^(to|from)\s+/i, '').replace(';', '').split(',').map((r) => r.trim())))
    expect([...roles].sort()).toEqual(['anon', 'authenticated', 'public', 'service_role'])
    expect(sql).toMatch(/references auth\.users \(id\)/)
  })
})

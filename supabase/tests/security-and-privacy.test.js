// Browser-role access, function privileges, table constraints, retention and
// pseudonymisation.

import { beforeAll, describe, expect, it } from 'vitest'
import { createDb } from './helpers/db.js'

let t

const TABLES = [
  'app_config', 'admin_users', 'reason_codes', 'venues', 'clubs', 'club_sessions', 'contacts', 'children',
  'child_duplicate_flags', 'bookings', 'session_allocations', 'payments', 'payment_refunds', 'stripe_events', 'admin_alerts', 'audit_log'
]
const VIEWS = [
  'session_availability', 'club_enrolled_children', 'possible_duplicate_children', 'club_enrolment',
  'bookings_awaiting_reconciliation', 'outstanding_messages', 'reconciliation_issues', 'contacts_eligible_for_anonymisation'
]

beforeAll(async () => {
  t = await createDb()
})

describe('what exists', () => {
  it('has exactly the expected tables and views, all with Row Level Security and no policies', async () => {
    await t.asOwner(async () => {
      const tables = (await t.q(`select tablename from pg_tables where schemaname = 'booking' order by 1`)).map((r) => r.tablename)
      expect(tables).toEqual([...TABLES].sort())
      const views = (await t.q(`select viewname from pg_views where schemaname = 'booking' order by 1`)).map((r) => r.viewname)
      expect(views).toEqual([...VIEWS].sort())
      expect(await t.q(`select tablename from pg_tables where schemaname = 'booking' and not rowsecurity`)).toEqual([])
      expect(await t.q(`select 1 from pg_policies where schemaname = 'booking'`)).toEqual([])
    })
  })

  it('has no SECURITY DEFINER function, and every function pins its search_path', async () => {
    await t.asOwner(async () => {
      expect(await t.q(`select p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'booking' and p.prosecdef`)).toEqual([])
      expect(await t.q(`select p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                         where n.nspname = 'booking'
                           and (p.proconfig is null or not exists (select 1 from unnest(p.proconfig) c where c like 'search_path=%'))`)).toEqual([])
    })
  })

  it('every view runs with the caller\'s permissions', async () => {
    await t.asOwner(async () => {
      expect(await t.q(`select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
                         where n.nspname = 'booking' and c.relkind = 'v'
                           and not coalesce(c.reloptions::text ilike '%security_invoker=true%', false)`)).toEqual([])
    })
  })
})

describe('browser roles can do nothing', () => {
  for (const role of ['anon', 'authenticated']) {
    it(`${role} cannot read any table or view`, async () => {
      await t.asRole(role, async () => {
        for (const name of [...TABLES, ...VIEWS]) {
          await expect(t.q(`select * from booking.${name} limit 1`), name).rejects.toThrow('permission denied')
        }
      })
    })

    it(`${role} cannot write a row or call a function`, async () => {
      await t.asRole(role, async () => {
        await expect(t.q(`insert into booking.contacts (email) values ('hack@example.com')`)).rejects.toThrow('permission denied')
        await expect(t.q(`update booking.app_config set environment = 'production'`)).rejects.toThrow('permission denied')
        await expect(t.q(`select booking.reserve_booking(gen_random_uuid(), gen_random_uuid(), 'block', '{}'::uuid[], '{}'::jsonb, '[]'::jsonb, true)`)).rejects.toThrow('permission denied')
        await expect(t.q(`select booking.is_admin(gen_random_uuid())`)).rejects.toThrow('permission denied')
        await expect(t.q(`select booking.process_checkout_completed('e', 't', 'cs', 'pi', 'paid', 1, false, null)`)).rejects.toThrow('permission denied')
        await expect(t.q(`select booking.mark_confirmation_email_sent(gen_random_uuid())`)).rejects.toThrow('permission denied')
        await expect(t.q(`select booking.admin_merge_children(gen_random_uuid(), gen_random_uuid(), gen_random_uuid())`)).rejects.toThrow('permission denied')
      })
    })
  }

  it('no privilege of any kind is held by anon, authenticated or PUBLIC', async () => {
    await t.asOwner(async () => {
      expect(await t.q(`select p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                         where n.nspname = 'booking'
                           and (has_function_privilege('anon', p.oid, 'execute') or has_function_privilege('authenticated', p.oid, 'execute'))`)).toEqual([])
      expect(await t.q(`select grantee, table_name from information_schema.role_table_grants
                         where table_schema = 'booking' and grantee in ('anon', 'authenticated', 'PUBLIC')`)).toEqual([])
      const usage = await t.one(`select has_schema_privilege('anon', 'booking', 'usage') as anon, has_schema_privilege('authenticated', 'booking', 'usage') as auth`)
      expect(usage).toEqual({ anon: false, auth: false })
    })
  })

  it('fix 3: the service role cannot add an administrator or switch between test and production', async () => {
    await expect(t.q(`insert into booking.admin_users (user_id) values ($1)`, [t.STRANGER])).rejects.toThrow('permission denied')
    await expect(t.q(`delete from booking.admin_users`)).rejects.toThrow('permission denied')
    await expect(t.q(`update booking.admin_users set note = 'x'`)).rejects.toThrow('permission denied')
    await expect(t.q(`update booking.app_config set environment = 'production'`)).rejects.toThrow('permission denied')
    await expect(t.q(`update booking.app_config set hold_minutes = 500`)).rejects.toThrow('permission denied')
    // It can still read both, which the functions need.
    expect((await t.one(`select booking.is_admin($1) as a`, [t.ADMIN])).a).toBe(true)
    expect((await t.one(`select environment from booking.app_config`)).environment).toBe('test')
  })

  it('fix 3: the service role cannot delete bookings, places, payments, refunds, contacts, children or alerts', async () => {
    const { club, ids } = await t.mkClub()
    const { booking } = await t.bookAndPay(club, 'individual', [ids[0]], 'nodelete@example.com', t.kids(['No', 'Delete', 'Year 3']), 'cs_nodelete')
    await t.refund('evt_nodelete', 'pi_cs_nodelete', 're_nodelete', 100)
    for (const table of ['payment_refunds', 'payments', 'session_allocations', 'bookings', 'children', 'contacts', 'child_duplicate_flags', 'admin_alerts', 'stripe_events', 'audit_log', 'reason_codes']) {
      await expect(t.q(`delete from booking.${table}`), table).rejects.toThrow('permission denied')
      await expect(t.q(`truncate booking.${table}`), table).rejects.toThrow('permission denied')
    }
    expect((await t.one(`select count(*)::int n from booking.payment_refunds r join booking.payments p on p.id = r.payment_id where p.booking_id = $1`, [booking.booking_id])).n).toBe(1)
  })

  it('fix 3: the service role keeps exactly the rights the booking functions need', async () => {
    await t.asOwner(async () => {
      const rights = await t.q(`select table_name, string_agg(privilege_type, ',' order by privilege_type) as p
                                  from information_schema.role_table_grants
                                 where table_schema = 'booking' and grantee = 'service_role' and table_name = any ($1)
                                 group by table_name order by table_name`, [TABLES])
      const byTable = Object.fromEntries(rights.map((r) => [r.table_name, r.p]))
      expect(byTable).toEqual({
        admin_users: 'SELECT', app_config: 'SELECT', reason_codes: 'SELECT',
        audit_log: 'INSERT,SELECT',
        venues: 'DELETE,INSERT,SELECT,UPDATE', clubs: 'DELETE,INSERT,SELECT,UPDATE', club_sessions: 'DELETE,INSERT,SELECT,UPDATE',
        contacts: 'INSERT,SELECT,UPDATE', children: 'INSERT,SELECT,UPDATE', child_duplicate_flags: 'INSERT,SELECT,UPDATE',
        bookings: 'INSERT,SELECT,UPDATE', session_allocations: 'INSERT,SELECT,UPDATE',
        payments: 'INSERT,SELECT,UPDATE', payment_refunds: 'INSERT,SELECT,UPDATE',
        stripe_events: 'INSERT,SELECT,UPDATE', admin_alerts: 'INSERT,SELECT,UPDATE'
      })
    })
    await expect(t.q(`insert into booking.reason_codes (code, description) values ('made_up_reason', 'x')`)).rejects.toThrow('permission denied')
    await expect(t.q(`update booking.audit_log set action = 'x'`)).rejects.toThrow('permission denied')
  })
})

describe('table constraints', () => {
  it('refuses bad prices, discounts and configuration', async () => {
    const { club } = await t.mkClub()
    await expect(t.q(`update booking.clubs set price_per_session_pence = 0 where id = $1`, [club])).rejects.toThrow('clubs_price_positive')
    await expect(t.q(`update booking.clubs set block_discount_percent = 100 where id = $1`, [club])).rejects.toThrow('clubs_block_discount_range')
    // Settings can only be changed by the database owner, and even then within limits.
    await t.asOwner(async () => {
      await expect(t.q(`insert into booking.app_config (id) values (false)`)).rejects.toThrow('app_config_single_row')
      await expect(t.q(`update booking.app_config set hold_minutes = 40`)).rejects.toThrow('app_config_hold_covers_checkout')
      await expect(t.q(`update booking.app_config set checkout_minutes = 30, hold_minutes = 60`)).rejects.toThrow('app_config_checkout_minutes')
    })
  })

  it('starts in the test environment, with a short unattached hold', async () => {
    const cfg = await t.one(`select environment, unattached_hold_minutes, checkout_minutes, hold_minutes from booking.app_config`)
    expect(cfg).toEqual({ environment: 'test', unattached_hold_minutes: 10, checkout_minutes: 35, hold_minutes: 50 })
  })
})

describe('contact details are not changed by an unpaid booking', () => {
  it('keeps the existing details until a later booking is paid', async () => {
    const { club, ids } = await t.mkClub()
    await t.bookAndPay(club, 'individual', [ids[0]], 'keep@example.com', t.kids(['Ke', 'Ep', 'Year 3']), 'cs_keep')
    const b = await t.reserve(club, 'individual', [ids[1]], 'keep@example.com', t.kids(['Ke', 'Ep', 'Year 3']),
      { contactOverrides: { full_name: 'Someone Else', phone: '07999999999' } })
    expect(await t.one(`select full_name, phone from booking.contacts where email = 'keep@example.com'`)).toEqual({ full_name: 'Pat Parent', phone: '07000000000' })
    await t.beginCheckout(b.booking_id)
    await t.attach(b.booking_id, 'cs_keep2', b.total_pence)
    await t.completed('evt_keep2', 'cs_keep2', b.total_pence)
    expect(await t.one(`select full_name, phone from booking.contacts where email = 'keep@example.com'`)).toEqual({ full_name: 'Someone Else', phone: '07999999999' })
  })
})

describe('retention and pseudonymisation', () => {
  let club, ids, contactId, bookingId

  beforeAll(async () => {
    ({ club, ids } = await t.mkClub({ sessions: 2 }))
    const { booking } = await t.bookAndPay(club, 'block', ids, 'retain@example.com', t.kids(['Re', 'Tain', 'Year 3'], ['Ro', 'Tain', 'Year 5']), 'cs_retain')
    bookingId = booking.booking_id
    contactId = (await t.bookingRow(bookingId)).contact_id
    await t.q(`select booking.admin_cancel_allocation((select id from booking.session_allocations where booking_id = $1 limit 1), $2, 'parent_request')`, [bookingId, t.ADMIN])
    await t.q(`update booking.bookings set admin_note = 'Spoke to Mrs Tain on 07000 111222' where id = $1`, [bookingId])
  })

  const eligible = () => t.q(`select reason from booking.contacts_eligible_for_anonymisation where contact_id = $1`, [contactId])

  it('is refused while the family still has sessions to come, and is not yet listed', async () => {
    await expect(t.q(`select booking.anonymise_contact($1, 'system')`, [contactId])).rejects.toThrow('CONTACT_HAS_UPCOMING_SESSIONS')
    expect(await eligible()).toEqual([])
  })

  it('becomes eligible 12 months after the last session', async () => {
    await t.shiftSessions(club, '16 months')
    expect(await eligible()).toEqual([{ reason: 'retention_period_elapsed' }])
  })

  it('lists a contact who never paid after 30 days, but not while a booking is still in progress', async () => {
    const u = await t.mkClub()
    const b = await t.reserve(u.club, 'individual', [u.ids[0]], 'never@example.com', t.kids(['Ne', 'Ver', 'Year 3']))
    const never = (await t.bookingRow(b.booking_id)).contact_id
    await t.q(`update booking.bookings set created_at = created_at - interval '40 days' where id = $1`, [b.booking_id])
    expect(await t.q(`select 1 from booking.contacts_eligible_for_anonymisation where contact_id = $1`, [never])).toEqual([])
    await t.q(`update booking.bookings set hold_expires_at = now() - interval '1 minute' where id = $1`, [b.booking_id])
    await t.q(`select booking.release_unattached_holds()`)
    expect(await t.q(`select reason from booking.contacts_eligible_for_anonymisation where contact_id = $1`, [never])).toEqual([{ reason: 'never_confirmed' }])
  })

  it('removes personal details and the administrator\'s notes, keeping the rows', async () => {
    await t.q(`select booking.anonymise_contact($1, 'admin', $2)`, [contactId, t.ADMIN])
    const c = await t.one(`select email, full_name, phone, emergency_name, emergency_phone, anonymised_at is not null as done from booking.contacts where id = $1`, [contactId])
    expect(c).toMatchObject({ full_name: null, phone: null, emergency_name: null, emergency_phone: null, done: true })
    expect(c.email).toMatch(/@anonymised\.invalid$/)
    const children = await t.q(`select first_name, surname, year_group from booking.children where contact_id = $1`, [contactId])
    expect(children).toEqual([{ first_name: 'Removed', surname: 'Removed', year_group: null }, { first_name: 'Removed', surname: 'Removed', year_group: null }])
    expect((await t.bookingRow(bookingId)).admin_note).toBeNull()
    await t.q(`select booking.anonymise_contact($1, 'admin', $2)`, [contactId, t.ADMIN])   // harmless to repeat
  })

  it('keeps payments, bookings, places and enrolment history', async () => {
    expect((await t.one(`select status, amount_received_pence from booking.payments where booking_id = $1`, [bookingId])).status).toBe('paid')
    expect((await t.bookingRow(bookingId)).status).toBe('confirmed')
    expect((await t.one(`select enrolled_children, possible_duplicates from booking.club_enrolment where club_id = $1`, [club]))).toEqual({ enrolled_children: 2, possible_duplicates: 0 })
  })

  it('is pseudonymisation: the booking reference and Stripe IDs remain and could link back', async () => {
    const left = await t.one(`select b.reference, p.stripe_checkout_session_id, p.stripe_payment_intent_id
                                from booking.bookings b join booking.payments p on p.booking_id = b.id where b.id = $1`, [bookingId])
    expect(left.reference).toMatch(/^RC-/)
    expect(left.stripe_checkout_session_id).toBe('cs_retain')
    expect(left.stripe_payment_intent_id).toBe('pi_cs_retain')
  })

  it('fix 6: after a merge across two families, each contact\'s live booking still blocks removal of their details', async () => {
    const m = await t.mkClub()
    await t.bookAndPay(m.club, 'individual', [m.ids[0]], 'merge-mum@example.com', t.kids(['Kit', 'Merge', 'Year 3']), 'cs_merge_mum')
    const { booking: dadBooking } = await t.bookAndPay(m.club, 'individual', [m.ids[1]], 'merge-dad@example.com', t.kids(['Kit', 'Merge', 'Year 3']), 'cs_merge_dad')
    const child = async (email) => (await t.one(`select ch.id from booking.children ch join booking.contacts c on c.id = ch.contact_id where c.email = $1`, [email])).id
    const contactOf = async (email) => (await t.one(`select id from booking.contacts where email = $1`, [email])).id
    await t.q(`select booking.admin_merge_children($1, $2, $3)`, [await child('merge-mum@example.com'), await child('merge-dad@example.com'), t.ADMIN])
    const mum = await contactOf('merge-mum@example.com')
    const dad = await contactOf('merge-dad@example.com')

    // Dad's record now has no places of its own, but his paid booking has an upcoming session.
    await t.q(`update booking.bookings set created_at = created_at - interval '40 days' where id = $1`, [dadBooking.booking_id])
    expect(await t.q(`select 1 from booking.contacts_eligible_for_anonymisation where contact_id = $1`, [dad])).toEqual([])
    await expect(t.q(`select booking.anonymise_contact($1, 'system')`, [dad])).rejects.toThrow('CONTACT_HAS_UPCOMING_SESSIONS')
    // Mum's child now holds the place dad paid for; that blocks her removal too.
    await expect(t.q(`select booking.anonymise_contact($1, 'system')`, [mum])).rejects.toThrow('CONTACT_HAS_UPCOMING_SESSIONS')

    // 16 months on, both are past retention and are listed for the right reason.
    await t.shiftSessions(m.club, '16 months')
    expect(await t.q(`select reason from booking.contacts_eligible_for_anonymisation where contact_id = $1`, [dad])).toEqual([{ reason: 'retention_period_elapsed' }])
    expect(await t.q(`select reason from booking.contacts_eligible_for_anonymisation where contact_id = $1`, [mum])).toEqual([{ reason: 'retention_period_elapsed' }])
    await t.q(`select booking.anonymise_contact($1, 'system')`, [dad])
    expect((await t.one(`select anonymised_at is not null as done from booking.contacts where id = $1`, [dad])).done).toBe(true)
  })

  it('lets the same email book again as a new contact', async () => {
    const n = await t.mkClub()
    expect((await t.reserve(n.club, 'individual', [n.ids[0]], 'retain@example.com', t.kids(['New', 'Start', 'Year 1']))).status).toBe('pending')
    expect((await t.one(`select count(*)::int n from booking.contacts where email = 'retain@example.com'`)).n).toBe(1)
  })
})

describe('issue 3: nothing is granted by default, and the schema can check itself', () => {
  it('sets no default privileges for the booking schema', async () => {
    await t.asOwner(async () => {
      expect(await t.q(`select 1 from pg_default_acl d join pg_namespace n on n.oid = d.defaclnamespace where n.nspname = 'booking'`)).toEqual([])
    })
  })

  it('reports no problems for the migrations as written, to the service role as well as the owner', async () => {
    expect(await t.q(`select * from booking.check_schema_security()`)).toEqual([])
    await t.asOwner(async () => {
      expect(await t.q(`select * from booking.check_schema_security()`)).toEqual([])
    })
    await t.asRole('anon', async () => {
      await expect(t.q(`select * from booking.check_schema_security()`)).rejects.toThrow('permission denied')
    })
  })

  it('a table added later gets no access for the service role or browser roles, and the self-check points out the missing Row Level Security', async () => {
    await t.asOwner(() => t.db.exec(`create table booking.later_table (id integer primary key)`))
    try {
      await expect(t.q(`select * from booking.later_table`)).rejects.toThrow('permission denied')
      await expect(t.q(`insert into booking.later_table values (1)`)).rejects.toThrow('permission denied')
      await expect(t.q(`delete from booking.later_table`)).rejects.toThrow('permission denied')
      await t.asRole('anon', async () => {
        await expect(t.q(`select * from booking.later_table`)).rejects.toThrow('permission denied')
      })
      await t.asOwner(async () => {
        const rights = await t.q(`select grantee from information_schema.role_table_grants where table_schema = 'booking' and table_name = 'later_table' and grantee in ('service_role', 'anon', 'authenticated', 'PUBLIC')`)
        expect(rights).toEqual([])
      })
      expect(await t.q(`select * from booking.check_schema_security()`)).toEqual([{ problem: 'table_without_row_level_security', object_name: 'later_table' }])
    } finally {
      await t.asOwner(() => t.db.exec(`drop table booking.later_table`))
    }
    expect(await t.q(`select * from booking.check_schema_security()`)).toEqual([])
  })

  it('the self-check catches each kind of mistake a later migration could make', async () => {
    const problems = async () => (await t.q(`select problem, object_name from booking.check_schema_security() order by problem, object_name`)).map((r) => `${r.problem}: ${r.object_name}`)
    await t.asOwner(() => t.db.exec(`
      create table booking.later_table (id integer primary key);
      alter table booking.later_table enable row level security;
      grant select on booking.later_table to anon;
      grant select, insert, update, delete, truncate on booking.later_table to service_role;
      create policy later_open on booking.later_table for select using (true);
      create view booking.later_view as select id from booking.later_table;
      grant select on booking.later_view to service_role;
      create function booking.later_function() returns integer language sql as 'select 1';
      create function booking.later_definer() returns integer language sql security definer set search_path = booking, pg_temp as 'select 1';
      revoke all on function booking.later_definer() from public;
      grant update on booking.app_config to service_role;
      grant delete on booking.payments to service_role;
    `))
    try {
      expect(await problems()).toEqual([
        'browser_role_can_execute_function: later_function (anon)',
        'browser_role_can_execute_function: later_function (authenticated)',
        'browser_role_has_table_privilege: later_table (anon)',
        'function_is_security_definer: later_definer',
        'function_without_fixed_search_path: later_function',
        'row_level_security_policy_exists: later_table.later_open',
        'service_role_can_delete: later_table',
        'service_role_can_delete: payments',
        'service_role_can_write_owner_only_table: app_config',
        'service_role_has_excess_privilege: later_table',
        'view_does_not_use_callers_permissions: later_view'
      ])
    } finally {
      await t.asOwner(() => t.db.exec(`
        drop view booking.later_view;
        drop function booking.later_function();
        drop function booking.later_definer();
        drop table booking.later_table;
        revoke update on booking.app_config from service_role;
        revoke delete on booking.payments from service_role;
      `))
    }
    expect(await problems()).toEqual([])
  })

  it('reports a browser role being given use of the schema', async () => {
    await t.asOwner(() => t.db.exec(`grant usage on schema booking to authenticated`))
    try {
      expect(await t.q(`select * from booking.check_schema_security()`)).toEqual([{ problem: 'browser_role_can_use_schema', object_name: 'authenticated' }])
    } finally {
      await t.asOwner(() => t.db.exec(`revoke usage on schema booking from authenticated`))
    }
  })
})

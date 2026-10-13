-- School clubs booking system: 08 - audit log.
-- An append-only history of important booking, payment and administrative
-- changes. It is kept permanently, so it must never hold personal data.
-- `detail` is therefore restricted to code-like values (IDs, status words,
-- reason codes, numbers, timestamps). Sentences, email addresses and phone
-- numbers are rejected by a trigger. Administrator notes belong in the note
-- columns on the records themselves, which anonymisation can clear.

create table booking.audit_log (
  id bigint generated always as identity primary key,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  actor_type text not null,
  actor_id uuid,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint audit_log_entity_type check (
    entity_type in ('venue', 'club', 'club_session', 'booking', 'allocation', 'payment', 'contact', 'child', 'config', 'admin')
  ),
  constraint audit_log_actor_type check (actor_type in ('system', 'webhook', 'admin', 'parent')),
  constraint audit_log_action_format check (action ~ '^[a-z][a-z0-9_]{2,59}$')
);

create index audit_log_entity_idx on booking.audit_log (entity_type, entity_id);
create index audit_log_created_at_idx on booking.audit_log (created_at);

-- Is this text a code-like value (and not a sentence, an address or a number
-- that could be a phone number)?
create function booking._is_code_like(p_value text)
returns boolean
language sql
immutable
set search_path = booking, pg_temp
as $$
  select p_value is not null
     and p_value ~ '^[A-Za-z0-9_.:+-]{1,80}$'
     and p_value !~ '^\+?[0-9]{6,}$';
$$;

-- Refuses any audit row whose detail is not a flat object of code-like values.
create function booking.audit_log_validate_detail()
returns trigger
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_key text;
  v_value jsonb;
  v_type text;
begin
  if jsonb_typeof(new.detail) <> 'object' then
    raise exception 'AUDIT_DETAIL_NOT_ALLOWED' using detail = 'detail must be an object';
  end if;

  for v_key, v_value in select key, value from jsonb_each(new.detail)
  loop
    v_type := jsonb_typeof(v_value);
    if v_type in ('number', 'boolean', 'null') then
      continue;
    elsif v_type = 'string' then
      if not booking._is_code_like(v_value #>> '{}') then
        raise exception 'AUDIT_DETAIL_NOT_ALLOWED' using detail = v_key;
      end if;
    elsif v_type = 'array' then
      if exists (
        select 1 from jsonb_array_elements(v_value) e
         where jsonb_typeof(e) <> 'string' or not booking._is_code_like(e #>> '{}')
      ) then
        raise exception 'AUDIT_DETAIL_NOT_ALLOWED' using detail = v_key;
      end if;
    else
      raise exception 'AUDIT_DETAIL_NOT_ALLOWED' using detail = v_key;
    end if;
  end loop;

  return new;
end;
$$;

create trigger audit_log_validate_detail
  before insert on booking.audit_log
  for each row execute function booking.audit_log_validate_detail();

-- Rows can be added but never changed or removed, even by the service role.
create function booking.audit_log_is_append_only()
returns trigger
language plpgsql
set search_path = booking, pg_temp
as $$
begin
  raise exception 'AUDIT_LOG_IS_APPEND_ONLY';
end;
$$;

create trigger audit_log_no_update_or_delete
  before update or delete on booking.audit_log
  for each row execute function booking.audit_log_is_append_only();

create trigger audit_log_no_truncate
  before truncate on booking.audit_log
  for each statement execute function booking.audit_log_is_append_only();

-- The one way functions write audit rows.
create function booking.write_audit(
  p_entity_type text,
  p_entity_id uuid,
  p_action text,
  p_actor_type text,
  p_actor_id uuid default null,
  p_detail jsonb default '{}'::jsonb
)
returns void
language sql
set search_path = booking, pg_temp
as $$
  insert into booking.audit_log (entity_type, entity_id, action, actor_type, actor_id, detail)
  values (p_entity_type, p_entity_id, p_action, p_actor_type, p_actor_id, coalesce(p_detail, '{}'::jsonb));
$$;

-- Atomic audit of venues, clubs and sessions ------------------------------------
-- Every insert, update and delete on these tables writes its audit row from a
-- trigger, inside the same transaction as the change itself. The change and
-- its audit record therefore succeed or fail together, whichever code made
-- the change.
--
-- The trigger records which columns changed and the new values of the
-- allow-listed columns passed as trigger arguments (statuses, prices,
-- capacities, dates). Free-text columns such as titles, descriptions,
-- addresses and notes are never copied.
--
-- The administrator is identified by a transaction-local setting,
-- booking.actor_id, which the admin_* functions set after checking the
-- allowlist. A change made any other way is recorded with actor 'system'.

create function booking.audit_entity_change()
returns trigger
language plpgsql
set search_path = booking, pg_temp
as $$
declare
  v_entity_type text := tg_argv[0];
  v_new jsonb;
  v_old jsonb;
  v_row jsonb;
  v_changed text[];
  v_detail jsonb;
  v_actor_setting text := nullif(current_setting('booking.actor_id', true), '');
  v_actor_id uuid;
begin
  if tg_op = 'DELETE' then
    v_row := to_jsonb(old);
  else
    v_row := to_jsonb(new);
  end if;

  if tg_op = 'UPDATE' then
    v_new := to_jsonb(new);
    v_old := to_jsonb(old);
    select array_agg(n.key order by n.key) into v_changed
      from jsonb_each(v_new) n
     where n.key <> 'updated_at'
       and n.value is distinct from (v_old -> n.key);
    if v_changed is null then
      return null;
    end if;
  end if;

  select coalesce(jsonb_object_agg(k, v_row -> k), '{}'::jsonb) into v_detail
    from unnest(tg_argv[1:]) as k
   where v_row ? k;

  v_detail := v_detail || jsonb_build_object('op', lower(tg_op));
  if v_changed is not null then
    v_detail := v_detail || jsonb_build_object('changed', to_jsonb(v_changed));
  end if;

  if v_actor_setting ~ '^[0-9a-fA-F-]{36}$' then
    v_actor_id := v_actor_setting::uuid;
  end if;

  insert into booking.audit_log (entity_type, entity_id, action, actor_type, actor_id, detail)
  values (
    v_entity_type,
    (v_row ->> 'id')::uuid,
    v_entity_type || '_' || case tg_op when 'INSERT' then 'created' when 'UPDATE' then 'updated' else 'deleted' end,
    case when v_actor_id is null then 'system' else 'admin' end,
    v_actor_id,
    v_detail
  );
  return null;
end;
$$;

create trigger venues_audit
  after insert or update or delete on booking.venues
  for each row execute function booking.audit_entity_change('venue');

create trigger clubs_audit
  after insert or update or delete on booking.clubs
  for each row execute function booking.audit_entity_change(
    'club', 'venue_id', 'status', 'review_status', 'price_per_session_pence', 'block_discount_percent',
    'default_capacity', 'min_children', 'enrolment_deadline');

create trigger club_sessions_audit
  after insert or update or delete on booking.club_sessions
  for each row execute function booking.audit_entity_change(
    'club_session', 'club_id', 'status', 'capacity', 'starts_at', 'ends_at');

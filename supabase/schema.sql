-- Rook Play schema for Supabase.
-- Run this once in the Supabase dashboard: Project -> SQL Editor -> New query -> paste -> Run.

create extension if not exists pgcrypto;

-- child_profiles -------------------------------------------------------------

create table if not exists public.child_profiles (
  id uuid primary key default gen_random_uuid(),
  parent_user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_color text,
  avatar_emoji text,
  age_band text check (age_band in ('5-7', '8-9', '10-12')),
  friend_code text not null unique,
  created_at timestamptz not null default now()
);

alter table public.child_profiles enable row level security;

create policy "parents manage own children"
  on public.child_profiles
  for all
  using (parent_user_id = auth.uid())
  with check (parent_user_id = auth.uid());

create policy "parents view accepted friends basic profile"
  on public.child_profiles
  for select
  using (
    exists (
      select 1 from public.friend_links fl
      where fl.status = 'accepted'
        and (
          (fl.requester_child_id = child_profiles.id and fl.target_child_id in (
            select id from public.child_profiles where parent_user_id = auth.uid()
          ))
          or
          (fl.target_child_id = child_profiles.id and fl.requester_child_id in (
            select id from public.child_profiles where parent_user_id = auth.uid()
          ))
        )
    )
  );

-- Friend-code lookup without exposing the whole table (used by the
-- "add friend by code" flow). Returns only non-sensitive display fields.
create or replace function public.find_child_by_friend_code(code text)
returns table (id uuid, display_name text, avatar_color text, avatar_emoji text)
language sql
security definer
set search_path = public
as $$
  select id, display_name, avatar_color, avatar_emoji
  from public.child_profiles
  where friend_code = upper(code)
  limit 1;
$$;

grant execute on function public.find_child_by_friend_code(text) to authenticated;

-- game_progress ----------------------------------------------------------------

create table if not exists public.game_progress (
  id uuid primary key default gen_random_uuid(),
  child_profile_id uuid not null references public.child_profiles(id) on delete cascade,
  game_id text not null,
  best_score integer,
  stars integer,
  times_played integer default 0,
  last_played_date timestamptz,
  created_at timestamptz not null default now(),
  unique (child_profile_id, game_id)
);

alter table public.game_progress enable row level security;

create policy "parents manage own childrens progress"
  on public.game_progress
  for all
  using (
    exists (select 1 from public.child_profiles cp where cp.id = game_progress.child_profile_id and cp.parent_user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.child_profiles cp where cp.id = game_progress.child_profile_id and cp.parent_user_id = auth.uid())
  );

-- friend_links ------------------------------------------------------------------

create table if not exists public.friend_links (
  id uuid primary key default gen_random_uuid(),
  requester_child_id uuid not null references public.child_profiles(id) on delete cascade,
  target_child_id uuid not null references public.child_profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now()
);

alter table public.friend_links enable row level security;

create policy "parents view own childrens friend links"
  on public.friend_links
  for select
  using (
    exists (select 1 from public.child_profiles cp where cp.id = friend_links.requester_child_id and cp.parent_user_id = auth.uid())
    or exists (select 1 from public.child_profiles cp where cp.id = friend_links.target_child_id and cp.parent_user_id = auth.uid())
  );

create policy "parents send requests from their own children"
  on public.friend_links
  for insert
  with check (
    exists (select 1 from public.child_profiles cp where cp.id = friend_links.requester_child_id and cp.parent_user_id = auth.uid())
  );

create policy "only the recipient can accept or decline"
  on public.friend_links
  for update
  using (
    exists (select 1 from public.child_profiles cp where cp.id = friend_links.target_child_id and cp.parent_user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.child_profiles cp where cp.id = friend_links.target_child_id and cp.parent_user_id = auth.uid())
  );

-- challenges ----------------------------------------------------------------------

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  from_child_id uuid not null references public.child_profiles(id) on delete cascade,
  to_child_id uuid not null references public.child_profiles(id) on delete cascade,
  game_id text not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'declined', 'expired')),
  from_score integer,
  to_score integer,
  winner_child_id uuid references public.child_profiles(id),
  created_at timestamptz not null default now()
);

alter table public.challenges enable row level security;

create policy "parents view own childrens challenges"
  on public.challenges
  for select
  using (
    exists (select 1 from public.child_profiles cp where cp.id = challenges.from_child_id and cp.parent_user_id = auth.uid())
    or exists (select 1 from public.child_profiles cp where cp.id = challenges.to_child_id and cp.parent_user_id = auth.uid())
  );

create policy "parents send challenges from their own children"
  on public.challenges
  for insert
  with check (
    exists (select 1 from public.child_profiles cp where cp.id = challenges.from_child_id and cp.parent_user_id = auth.uid())
  );

create policy "only the challenged side can record a result or decline"
  on public.challenges
  for update
  using (
    exists (select 1 from public.child_profiles cp where cp.id = challenges.to_child_id and cp.parent_user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.child_profiles cp where cp.id = challenges.to_child_id and cp.parent_user_id = auth.uid())
  );

-- Turf memberships: one active membership per user at a time
-- Historical memberships kept for the record (is_active = false)

create table if not exists public.turf_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  faction_slug text not null,
  joined_at timestamptz not null default now(),
  join_method text not null default 'ritual',
  drift_score_at_join integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Partial unique: one active membership per user
create unique index idx_turf_memberships_active_user
  on public.turf_memberships(user_id)
  where (is_active = true);

create index idx_turf_memberships_faction
  on public.turf_memberships(faction_slug);

create index idx_turf_memberships_active_faction
  on public.turf_memberships(faction_slug)
  where (is_active = true);

alter table public.turf_memberships enable row level security;

-- Users can read their own membership
create policy "Users can read own membership"
  on public.turf_memberships
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can insert own membership
create policy "Users can insert own membership"
  on public.turf_memberships
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can update own membership (deactivate when switching)
create policy "Users can update own membership"
  on public.turf_memberships
  for update
  to authenticated
  using (auth.uid() = user_id);

-- Public read for faction member counts
create policy "Anyone can count active members"
  on public.turf_memberships
  for select
  using (is_active = true);

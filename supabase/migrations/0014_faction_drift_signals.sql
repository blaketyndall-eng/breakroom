-- Persist faction drift signals from localStorage to Supabase
-- Signals are append-only: no UPDATE or DELETE for regular users

create table if not exists public.faction_drift_signals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  faction_slug text not null,
  source text not null,
  weight integer not null default 1,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.faction_drift_signals enable row level security;

-- Users can read their own drift signals
create policy "Users can read own drift signals"
  on public.faction_drift_signals
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can insert their own drift signals
create policy "Users can insert own drift signals"
  on public.faction_drift_signals
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Index for user's drift history
create index idx_faction_drift_signals_user_id
  on public.faction_drift_signals(user_id);

-- Index for faction-level queries
create index idx_faction_drift_signals_faction
  on public.faction_drift_signals(faction_slug);

-- Composite for dedup checks (user + faction + source + time window)
create index idx_faction_drift_signals_dedup
  on public.faction_drift_signals(user_id, faction_slug, source, recorded_at desc);

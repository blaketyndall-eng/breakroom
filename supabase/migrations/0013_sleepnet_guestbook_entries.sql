create table if not exists public.sleepnet_guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  site_slug text not null,
  user_id uuid references auth.users(id) on delete set null,
  alias text not null,
  message text not null,
  actor_type text not null default 'anonymous_user',
  status text not null default 'pending',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.sleepnet_guestbook_entries enable row level security;

drop policy if exists "Approved guestbook entries are public" on public.sleepnet_guestbook_entries;
create policy "Approved guestbook entries are public"
  on public.sleepnet_guestbook_entries
  for select
  using (status = 'approved');

drop policy if exists "Users can insert their own guestbook entries" on public.sleepnet_guestbook_entries;
create policy "Users can insert their own guestbook entries"
  on public.sleepnet_guestbook_entries
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can read their own guestbook entries" on public.sleepnet_guestbook_entries;
create policy "Users can read their own guestbook entries"
  on public.sleepnet_guestbook_entries
  for select
  to authenticated
  using (auth.uid() = user_id);

create index if not exists sleepnet_guestbook_entries_site_status_created_idx
  on public.sleepnet_guestbook_entries (site_slug, status, created_at desc);

create index if not exists sleepnet_guestbook_entries_user_created_idx
  on public.sleepnet_guestbook_entries (user_id, created_at desc);

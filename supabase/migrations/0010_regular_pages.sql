create table if not exists public.regular_pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  handle text not null unique,
  display_name text not null,
  fake_title text,
  bio text,
  away_message text,
  favorite_light text,
  assigned_object text,
  theme text not null default 'corrupted_employee_portal',
  top_links jsonb not null default '[]'::jsonb,
  pinned_artifacts jsonb not null default '[]'::jsonb,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.regular_pages enable row level security;

create index if not exists regular_pages_user_id_idx on public.regular_pages(user_id);
create index if not exists regular_pages_handle_idx on public.regular_pages(handle);

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'regular_pages' and policyname = 'Public regular pages are readable') then
    create policy "Public regular pages are readable" on public.regular_pages
      for select using (is_public = true or auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'regular_pages' and policyname = 'Users can insert own regular page') then
    create policy "Users can insert own regular page" on public.regular_pages
      for insert with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'regular_pages' and policyname = 'Users can update own regular page') then
    create policy "Users can update own regular page" on public.regular_pages
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'regular_pages' and policyname = 'Users can delete own regular page') then
    create policy "Users can delete own regular page" on public.regular_pages
      for delete using (auth.uid() = user_id);
  end if;
end $$;

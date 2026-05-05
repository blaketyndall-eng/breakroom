create table if not exists public.sleepnet_sites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  slug text not null unique,
  title text not null,
  site_type text not null default 'faux_company',
  neighborhood text not null default 'corporate_ruins',
  tagline text,
  description text,
  theme text not null default 'two_thousand_three_local_business',
  sections jsonb not null default '[]'::jsonb,
  search_text text,
  status text not null default 'draft',
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sleepnet_sites enable row level security;

create unique index if not exists sleepnet_sites_slug_unique_idx on public.sleepnet_sites(slug);
create index if not exists sleepnet_sites_user_id_idx on public.sleepnet_sites(user_id);
create index if not exists sleepnet_sites_public_status_idx on public.sleepnet_sites(is_public, status, updated_at desc);
create index if not exists sleepnet_sites_search_text_idx on public.sleepnet_sites(search_text);

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'sleepnet_sites' and policyname = 'sleepnet_public_read') then
    create policy sleepnet_public_read on public.sleepnet_sites
      for select using ((is_public = true and status = 'published') or auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'sleepnet_sites' and policyname = 'sleepnet_owner_insert') then
    create policy sleepnet_owner_insert on public.sleepnet_sites
      for insert with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'sleepnet_sites' and policyname = 'sleepnet_owner_update') then
    create policy sleepnet_owner_update on public.sleepnet_sites
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'sleepnet_sites' and policyname = 'sleepnet_owner_delete') then
    create policy sleepnet_owner_delete on public.sleepnet_sites
      for delete using (auth.uid() = user_id);
  end if;
end $$;

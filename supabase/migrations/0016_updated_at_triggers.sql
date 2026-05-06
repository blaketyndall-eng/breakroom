-- Reusable updated_at trigger function
-- Apply to all tables that have an updated_at column

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply to turf_memberships
create trigger set_updated_at
  before update on public.turf_memberships
  for each row execute function public.handle_updated_at();

-- Apply to regular_pages (existing table, missing trigger)
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'set_updated_at' and tgrelid = 'public.regular_pages'::regclass
  ) then
    create trigger set_updated_at
      before update on public.regular_pages
      for each row execute function public.handle_updated_at();
  end if;
exception when undefined_table then
  null;
end $$;

-- Apply to sleepnet_sites (existing table, missing trigger)
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'set_updated_at' and tgrelid = 'public.sleepnet_sites'::regclass
  ) then
    create trigger set_updated_at
      before update on public.sleepnet_sites
      for each row execute function public.handle_updated_at();
  end if;
exception when undefined_table then
  null;
end $$;

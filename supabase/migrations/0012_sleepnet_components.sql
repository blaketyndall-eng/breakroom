alter table public.sleepnet_sites
  add column if not exists components jsonb not null default '[]'::jsonb,
  add column if not exists related_object_slugs text[] not null default '{}',
  add column if not exists related_agent_slug text,
  add column if not exists faction_affinity text[] not null default '{}',
  add column if not exists weirdness_level int not null default 3,
  add column if not exists reality_status text not null default 'indexed_noise',
  add column if not exists canonical_weight int not null default 0,
  add column if not exists stuff_shelf_enabled boolean not null default true,
  add column if not exists guestbook_enabled boolean not null default true,
  add column if not exists gallery_enabled boolean not null default true,
  add column if not exists jukebox_enabled boolean not null default true;

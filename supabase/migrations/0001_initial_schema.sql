create extension if not exists "pgcrypto";

create type reality_status as enum ('real','fictional','breakroom_myth','unverified','out_of_context','brand_object');
create type object_type as enum ('physical','digital','cultural','room_myth','product_artifact','approved_room','historical_reprint');
create type user_shift_status as enum ('on_shift','clocked_out','still_out');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  issue_name text default 'Shift End',
  description text,
  product_story text,
  price_cents integer,
  status text not null default 'uniform_pending',
  department text,
  related_object_slug text,
  sizes text[] default '{}',
  colors text[] default '{}',
  image_url text,
  is_visible boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.lost_objects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  item_number text unique,
  object_type object_type not null,
  reality_status reality_status not null,
  status text default 'found',
  found_location text,
  description text,
  symbolic_meaning text,
  related_product_slug text,
  related_story_slug text,
  unlock_key text,
  image_url text,
  is_public boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.news_items (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,
  subhead text,
  body text,
  reality_status reality_status not null default 'fictional',
  related_product_slug text,
  related_object_slug text,
  image_url text,
  issue_name text default '3AM Edition',
  is_public boolean default true,
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  alias text,
  employee_id text unique,
  department text,
  role_name text,
  assigned_object_slug text,
  house_rule text,
  uniform_recommendation_slug text,
  preferred_light text,
  preferred_place text,
  shift_status user_shift_status default 'on_shift',
  clocked_out_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.after_hours_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  player_alias text not null,
  fake_handicap integer,
  preferred_light text,
  signature_object_slug text,
  assigned_table text,
  after_hours_status text default 'still_out',
  regular_note text,
  personal_myth text,
  generated_assets jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.user_artifacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  artifact_type text not null,
  artifact_slug text,
  title text not null,
  data jsonb default '{}'::jsonb,
  unlocked_at timestamptz default now()
);

create table public.user_saved_objects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  object_id uuid references public.lost_objects(id) on delete cascade not null,
  saved_at timestamptz default now(),
  unique(user_id, object_id)
);

create table public.tournaments (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  subtitle text,
  subline text,
  reality_status reality_status not null default 'unverified',
  registration_open boolean default true,
  location_note text,
  cash_pot_cents integer default 0,
  last_updated_by text,
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.tournament_players (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references public.tournaments(id) on delete cascade,
  alias text not null,
  handicap integer,
  status text default 'in',
  known_for text,
  last_seen text,
  signature_object_slug text,
  regular_note text,
  risk text,
  related_headline_slug text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table public.user_tournament_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  tournament_id uuid references public.tournaments(id) on delete cascade not null,
  player_alias text not null,
  fake_handicap integer,
  assigned_table text,
  assigned_object_slug text,
  preferred_light text,
  break_style text,
  confidence_level text,
  game text,
  generated_assets jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  unique(user_id, tournament_id)
);

create table public.phone_messages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  caller text not null,
  category text not null,
  transcript text not null,
  related_object_slug text,
  related_product_slug text,
  unlock_key text,
  is_public boolean default true,
  created_at timestamptz default now()
);

create table public.wall_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  alias text,
  message text not null,
  marker_color text,
  wall_location text,
  object_icon text,
  status text default 'pending',
  created_at timestamptz default now()
);

create table public.ventures (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text,
  status text,
  description text,
  ai_rationale text,
  breakroom_note text,
  is_public boolean default true,
  created_at timestamptz default now()
);

create table public.radio_shows (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  host_character text,
  show_type text,
  cover_image_url text,
  is_public boolean default true,
  created_at timestamptz default now()
);

create table public.radio_episodes (
  id uuid primary key default gen_random_uuid(),
  show_id uuid references public.radio_shows(id) on delete cascade,
  slug text unique not null,
  title text not null,
  description text,
  audio_url text,
  duration_seconds integer,
  transcript text,
  related_object_slug text,
  related_product_slug text,
  is_public boolean default true,
  published_at timestamptz default now()
);

create table public.radio_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  request_type text not null,
  message text,
  selected_object_slug text,
  mood text,
  status text default 'received',
  created_at timestamptz default now()
);

create table public.secrets (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  trigger_type text not null,
  trigger_value text,
  unlock_type text not null,
  unlock_payload jsonb default '{}'::jsonb,
  hint text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table public.user_secret_unlocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  secret_id uuid references public.secrets(id) on delete cascade not null,
  unlocked_at timestamptz default now(),
  unique(user_id, secret_id)
);

create table public.site_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_name text not null,
  page_slug text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

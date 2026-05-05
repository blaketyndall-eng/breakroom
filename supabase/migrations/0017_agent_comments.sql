-- PR 46: Agent/NPC Comments
-- Persistent agent comments that appear on pages, factions, and guestbooks.
-- Agents are world voices. They comment — they don't moderate.

create table if not exists public.agent_comments (
  id uuid primary key default gen_random_uuid(),
  agent_slug text not null,
  target_type text not null check (target_type in ('sleepnet_site', 'faction', 'guestbook', 'artifact', 'regular_file')),
  target_slug text not null,
  body text not null,
  tone text, -- e.g. 'dry', 'ominous', 'blunt'
  trigger_source text, -- what caused the comment: 'page_visit', 'drift_threshold', 'guestbook_activity', 'scheduled', 'seed'
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),

  constraint agent_comments_body_length check (char_length(body) between 1 and 500)
);

-- Indexes
create index if not exists idx_agent_comments_target
  on public.agent_comments (target_type, target_slug, created_at desc);

create index if not exists idx_agent_comments_agent
  on public.agent_comments (agent_slug, created_at desc);

-- RLS
alter table public.agent_comments enable row level security;

-- Everyone can read visible comments (agents are public voices)
create policy "agent_comments_select_visible"
  on public.agent_comments for select
  using (is_visible = true);

-- Only service role / admin can insert (agents are server-side)
-- For now, allow authenticated users to insert (client-side agent generation)
create policy "agent_comments_insert_authenticated"
  on public.agent_comments for insert
  to authenticated
  with check (true);

-- No update/delete for regular users
-- Admin can manage via service role

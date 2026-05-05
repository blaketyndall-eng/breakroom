# Faction Drift

Faction Drift is the first reputation signal layer for The Breakroom.

## Product idea

```txt
Drift = the room noticed where you stood
Join = you chose where to stand
```

PR 44 only implements Drift. Joining Turf remains a separate conscious ritual.

## Files

```txt
src/lib/factionDrift.ts
src/components/factions/FactionDriftTracker.tsx
src/components/factions/FactionDriftPanel.tsx
src/components/factions/FactionDriftPageMarker.astro
src/components/ads/FakeAdBlock.astro
src/components/stuff/SaveStuffButton.tsx
src/pages/factions/[slug].astro
src/pages/locker.astro
src/styles/faction-drift.css
```

## Local storage

```txt
breakroom.faction-signals.v1
```

## Signal sources

```txt
visit_turf_page
visit_faction_page
click_faction_ad
sign_faction_guestbook
save_faction_stuff
view_faction_stuff_file
search_faction_phrase
create_faction_page
agent_mention
```

## V1 signal hooks

```txt
- Visiting a faction detail page records visit_faction_page.
- Clicking a faction-linked fake ad records click_faction_ad.
- Saving faction-linked Stuff records save_faction_stuff.
- Guestbook components support sign_faction_guestbook when factionSlug is supplied.
- Locker shows a Turf Signals panel.
```

## Drift language

```txt
The Players -> You’ve been seen near the table.
Lot Racers -> Your file picked up exhaust.
Night Drinkers -> You’ve been counted among the stools.
The Smokers -> Fence talk has your name in it.
Cowboys -> Cooler opened. Hat noticed.
```

## Rules

```txt
- Drift is local-first.
- Drift is not joining.
- Multiple/rival faction drift is allowed.
- Drift should be subtle and atmospheric.
- No restrictions, locks, or hard identity claims are created in V1.
```

## Future Supabase table

```sql
create table if not exists public.user_faction_signals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  faction_slug text not null,
  source text not null,
  weight int not null default 1,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
```

## Product truth

The room can notice you without asking you to sign anything.

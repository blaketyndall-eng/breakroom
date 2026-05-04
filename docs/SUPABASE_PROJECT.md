# Supabase Project Truth

This is the current source of truth for The Breakroom Supabase backend.

## Project

```txt
Project name: the-breakroom
Project ref: bfinjvvtornltgytsvai
Region: us-east-1
Project URL: https://bfinjvvtornltgytsvai.supabase.co
Plan: Free
Status when created: ACTIVE_HEALTHY
Created: 2026-05-04
```

## Public frontend environment

Use these values locally and in Cloudflare Pages.

```txt
PUBLIC_SUPABASE_URL=https://bfinjvvtornltgytsvai.supabase.co
PUBLIC_SUPABASE_ANON_KEY=<use Supabase publishable or anon browser key>
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_RADIO_STREAM_URL=
```

Production Pages should use:

```txt
PUBLIC_SITE_URL=https://thebreakroom.pages.dev
```

Do not expose or commit the Supabase service role key.

## Applied migrations

The live Supabase project has the following migration concepts applied:

```txt
initial_breakroom_schema
rls_policies
seed_v1_content
fix_set_updated_at_search_path
```

The `set_updated_at` function was patched to use a fixed `search_path = public` after the Supabase advisor flagged a mutable search path warning.

## Tables

Public content tables:

```txt
products
lost_objects
news_items
tournaments
phone_messages
ventures
radio_logs
secrets
wall_posts
```

User-owned tables:

```txt
user_profiles
after_hours_profiles
saved_artifacts
tournament_registrations
user_secrets
site_events
```

## Seed data currently loaded

```txt
products: 6
lost_objects: 4
news_items: 3
tournaments: 1
phone_messages: 3
ventures: 3
secrets: 2
```

## RLS truth

All V1 tables have Row Level Security enabled.

Public read policies exist for public/lore tables where `is_public = true` or equivalent.

User-owned tables allow users to read/write their own rows using `auth.uid()`.

## Product truth

Supabase is not just storage for accounts. It is the memory layer of the world.

For V1, the user journey is:

1. User signs up.
2. User is accidentally hired by OmniShift.
3. User receives a stored employee profile.
4. User clocks out.
5. Clock-out state persists.
6. After Hours unlocks.
7. Later systems can save artifacts, tournament registration, phone events, wall posts, secrets, and radio logs.

## Known next work

```txt
- Add auth redirect/callback handling if magic links need a dedicated callback route.
- Add sign-out behavior to the portal.
- Persist After Hours persona from Idle Hands registration.
- Connect Cloudflare Pages env vars.
- Configure Supabase Auth dashboard redirect URLs.
- Add branded auth email templates.
- Add admin-only content management later.
```

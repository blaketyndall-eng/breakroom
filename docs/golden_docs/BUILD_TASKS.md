# Build Tasks for V1 Development

This document tracks the current V1 build state and remaining work for AI developers.

## Completed foundation

```txt
- Astro + React + TypeScript + PNPM scaffold
- Cloudflare Pages deployment config
- Supabase project created: bfinjvvtornltgytsvai
- Initial schema, RLS policies, seed content, and clocked_out_at migration applied
- Supabase auth client and env helpers added
- Auth callback route added
- Employee profile persistence added
- Clock-out persistence added
- Idle Hands registration persistence added
- After Hours persona persistence added
- Claude design parity audit added
- First visual parity pass complete
- Rack/Lost/Idle second visual parity pass complete
```

## Completed routes

```txt
/
/sleeper-net
/breakroom
/signup
/auth/callback
/portal
/portal/after-hours-profile
/clock-out
/after-hours
/rack
/rack/[slug]
/lost-found
/lost-found/[slug]
/newsstand
/newsstand/[slug]
/phone
/sign-the-wall
/ventures
/radio
/idle-hands
/idle-hands/player/[slug]
/staff-only
/house-rules
/404
```

## Sprint A — Data reconciliation

Next recommended branch:

```txt
feature/claude-data-reconciliation
```

Tasks:

```txt
- Compare design/claude/html/data.js against live static data.
- Compare static data against Supabase seed migration.
- Add missing products, objects, phone messages, headlines, player notes, ventures, and search terms.
- Keep schema stable unless a clear additive field is needed.
- Add a new additive seed migration if needed.
- Update docs after the data pass.
```

## Sprint B — Detail page visual polish

Tasks:

```txt
- Product file page parity: /rack/[slug]
- Object file page parity: /lost-found/[slug]
- News item page parity: /newsstand/[slug]
- Player bio page parity: /idle-hands/player/[slug]
- Ensure every detail page links back into the world.
```

## Sprint C — Portal and signup visual polish

Tasks:

```txt
- Increase OmniShift portal density.
- Add more fake HR/AI corporate language.
- Add profile identity artifact blocks.
- Improve signup/interview visual rhythm.
- Improve transition from signup to portal to clock out.
```

## Sprint D — Secrets and saved artifacts

Tasks:

```txt
- Implement save object/product/artifact behavior.
- Implement first secret unlock triggers.
- Add Room 8 teaser route or hidden unlock shell.
- Add user_secrets write/read helpers.
- Add visible but mysterious unlock feedback.
```

## Sprint E — Sign The Wall

Tasks:

```txt
- Persist wall posts to Supabase.
- Keep public approved posts visible.
- Add local preview fallback.
- Add moderation status language.
- Preserve bathroom-wall/marker feel.
```

## Sprint F — Radio

Tasks:

```txt
- Add real stream provider embed when chosen.
- Use PUBLIC_RADIO_STREAM_URL.
- Add show schedule and station IDs.
- Add fake ads and radio logs.
- Link radio messages to Phone and Newsstand.
```

## Sprint G — Cloudflare production setup

Manual unless Cloudflare connector is enabled:

```txt
- Connect Pages project to GitHub.
- Add PUBLIC_SUPABASE_URL.
- Add PUBLIC_SUPABASE_ANON_KEY.
- Add PUBLIC_SITE_URL.
- Add PUBLIC_RADIO_STREAM_URL later.
- Validate production build and auth callback.
```

## Sprint H — Supabase dashboard setup

Manual unless Supabase auth config tooling becomes available:

```txt
- Add auth redirect URLs.
- Confirm email provider settings.
- Add Google OAuth credentials later.
- Add branded email templates later.
```

## Product truth

The Breakroom is not just a site. It is a functioning world that uses website mechanics as lore mechanics.

Every build task should either:

```txt
- Make the site more useful.
- Make the world feel more real.
- Make the user profile/persona more persistent.
- Make the old-web fiction more interactive.
```

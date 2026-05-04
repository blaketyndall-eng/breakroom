# AGENTS.md — AI Developer Operating Rules

This repository is built for Codex and other AI developers. Treat `docs/golden_docs/` as the single source of truth.

## Non-negotiables

- Do not turn this into a normal B2C brand site.
- Preserve the old-web structure, after-hours voice, and corrupted corporate layer.
- Products are issued goods, object files, sightings, and inventory disagreements.
- Keep lore canonical: 1:47 AM, Motel Key No. 8, Miss September, OmniShift AI, Idle Hands Invitational.
- Add new story ideas to the Golden Docs before deeply implementing them.
- Never publish real venue claims without verification and approval.

## Build style

- Astro pages for mostly-static old-web pages.
- React islands for interactivity.
- Local seed data first; Supabase for auth/user-specific actions.
- Keep components small and reusable.
- Use `src/content/data/breakroom.ts` as the V1 data source.

## Branching

Use feature branches:

- `feature/base-scaffold`
- `feature/sleepernet-v1`
- `feature/rack-v1`
- `feature/clock-out-flow`

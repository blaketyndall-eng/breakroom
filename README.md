# The Breakroom

A corrupted after-hours brand world: SleeperNet search, OmniShift employee portal, Clock Out gate, After Hours takeover, The Rack, Lost & Found, 3AM Edition, Idle Hands Invitational, Sign The Wall, Phone Behind The Bar, and Breakroom Radio.

## Stack

- Astro + React islands + TypeScript + Tailwind
- PNPM
- Cloudflare Pages
- Supabase Auth/Postgres/RLS

## Quick start

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env` before wiring Supabase or radio streams.

## Source of truth

Read these first:

- `docs/golden_docs/PROJECT_SOURCE_OF_TRUTH.md`
- `docs/golden_docs/STYLE_GUIDE.md`
- `docs/golden_docs/ROUTE_MAP.md`
- `docs/golden_docs/DATA_MODEL.md`
- `docs/golden_docs/BUILD_TASKS.md`
- `docs/golden_docs/CLAUDE_DESIGN_HANDOFF.md`

## Claude Design intake

The original Claude Design ZIP has been preserved in `design/claude/`. The implementation files are separate. Do not overwrite the Claude originals when translating them into components.

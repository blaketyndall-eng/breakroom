# The Breakroom

The creative internet hiding underneath the controlled one.

Part website builder, part fake internet, part worldbuilding engine, part zine machine, part social object, part after-hours marketplace, part shared hallucination with rules.

Users are not just posting into a world. They are making the world.

## What it is

The Breakroom gives users a place to build worlds, identities, pages, products, crews, factions, stories, objects, events, and strange little artifacts outside the standard templates, platform rules, corporate gloss, algorithmic sameness, and sterile brand systems that flatten everything online.

The style, lore, pages, products, jokes, factions, objects, characters, hidden doors, public myths, private files, and things that become real can all be shaped by the people inside it.

## How it feels

> "I can make something here that would not belong anywhere else."
> "I can build a world instead of just posting into one."
> "I can turn a joke, object, brand, crew, story, or style into a place people can enter."

A stranger should want to send it to a friend before they fully understand it.

## World layers

- **SleepNet** — after-hours search portal / weird internet
- **OmniShift** — fake corporate parent layer
- **Regular Files** — user identity / profile layer
- **Stuff** — objects, inventory, fake goods, future product candidates
- **Drawer** — saved Stuff / personal inventory
- **Turf / Factions** — world factions (The Players, Lot Racers, Night Drinkers, The Smokers, Cowboys)
- **Crews** — user-created groups
- **Agents / NPCs** — page clerks, locals, weird friends, fake support reps
- **Districts** — world geography / old-web directory zones
- **Events** — fake/maybe-real happenings and archives
- **Radio 1:47** — broadcast layer
- **Hidden Doors** — secret unlocks and rabbit holes
- **The Rack** — official goods / real commerce boundary
- **Wire Room** — admin / ops layer
- **World Ledger** — continuity engine / event log

## Stack

- Astro + React islands + TypeScript + Tailwind
- PNPM
- Cloudflare Pages
- Supabase Auth / Postgres / RLS
- Local-first localStorage with seeded data patterns

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

## Design philosophy

The Breakroom is where users clock out of the corporate internet and start making the room themselves. The fake/real boundary is the product's entire tension.

## Claude Design intake

The original Claude Design ZIP has been preserved in `design/claude/`. The implementation files are separate. Do not overwrite the Claude originals when translating them into components.

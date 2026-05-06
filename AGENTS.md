# AGENTS.md — AI Developer Operating Rules

This repository is built for Codex and other AI developers. Treat `docs/golden_docs/` as the single source of truth.

## North Star

The Breakroom is the creative internet hiding underneath the controlled one. Users are not just posting into a world — they are making the world.

It should feel like part website builder, part fake internet, part worldbuilding engine, part zine machine, part social object, part after-hours marketplace, and part shared hallucination with rules.

The user should feel: "I can make something here that would not belong anywhere else. I can build a world instead of just posting into one."

## Non-negotiables

- Do not turn this into a normal B2C brand site, social network, or generic AI app.
- Preserve the old-web structure, after-hours voice, and corrupted corporate layer.
- Users create pages, worlds, identities, objects, crews, factions, stories, and artifacts. Enable that.
- Products are issued goods, object files, sightings, and inventory disagreements.
- Keep lore canonical: 1:47 AM, Motel Key No. 8, Miss September, OmniShift AI, Idle Hands Invitational.
- Add new story ideas to the Golden Docs before deeply implementing them.
- Never publish real venue claims without verification and approval.
- No likes, followers, karma, engagement metrics, or feed algorithms.
- The bit can be weird. The boundary (fake vs real, public vs private, AI vs admin) must be clear.

## Build style

- Astro pages for mostly-static old-web pages.
- React islands for interactivity (client:load for critical, client:idle for deferred).
- Local-first localStorage with seeded data patterns; Supabase for auth/persistence when ready.
- Keep components small and reusable.
- Seed data lives in `src/content/data/`. Lib functions in `src/lib/`.
- Graceful empty states — never blank dead ends.
- Every new system should consider: Does it connect to SleepNet? Stuff? Regular Files? Turf? Does it need privacy controls? Admin controls? Future hooks for search, Radio, Hidden Doors, or World Ledger?

## World systems

| System | Purpose | Lib file |
|--------|---------|----------|
| SleepNet | After-hours search portal | `sleepnetSearch.ts`, `sleepnetSites.ts` |
| Regular Files | User identity/profile | `regularFiles.ts` |
| Stuff / Drawer | Objects and saved inventory | `stuff.ts`, `savedStuff.ts` |
| Turf / Factions | World factions + drift | `factions.ts`, `factionDrift.ts`, `turfMembership.ts` |
| Crews | User-created groups | `crews.ts` |
| Events | Happenings and archives | `events.ts` |
| Radio 1:47 | Broadcast layer | `radio.ts` |
| Hidden Doors | Secret unlocks | `hiddenDoors.ts` |
| World Ledger | Continuity engine | `worldLedger.ts`, `continuityChecks.ts` |
| Agents/NPCs | World voices | `agents.ts`, `agentComments.ts` |
| Districts | World geography | `districts.ts` |
| Top 8 / Seen Around | Social marks | `topEight.ts` |
| Lot Weather | Real weather in Breakroom voice | `lotWeather.ts` |
| Wire Room | Admin/ops | `wireRoom.ts` |

## Branching

Use feature branches per PR batch. Current branch: `feat/turf-join-drift-persistence`.

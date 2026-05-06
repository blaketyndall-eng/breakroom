# The Breakroom — Project Source of Truth

This document is the single source of truth for the public V1 build.

## North Star

The Breakroom is the creative internet hiding underneath the controlled one.

It gives users a place to build worlds, identities, pages, products, crews, factions, stories, objects, events, and strange little artifacts outside the standard templates, platform rules, corporate gloss, algorithmic sameness, and sterile brand systems that flatten everything online.

Users are not just posting into a world. They are making the world.

The user should feel: "I can make something here that would not belong anywhere else. I can build a world instead of just posting into one. I can turn a joke, object, brand, crew, story, or style into a place people can enter."

## Stack

- Astro + React islands + TypeScript + Tailwind
- Cloudflare Pages for hosting/deployment
- Supabase for Auth, Postgres, user profiles, saved objects, tournament registrations, radio metadata, wall posts, secrets/unlocks
- GitHub as repo and review workflow
- Local-first localStorage with seeded data patterns

## Build Principle

We are not building a normal brand site. We are building a fake after-hours internet where a user can search, create weird pages, build identities, collect objects, join factions, form crews, and slowly become part of a world they shape.

The experience should feel like part website builder, part fake internet, part worldbuilding engine, part zine machine, part social object, part after-hours marketplace, and part shared hallucination with rules.

## World Layers

1. SleeperNet — public after-hours search engine.
2. OmniShift — fake AI-run corporate layer.
3. The Breakroom — underground human layer beneath the corporate shell.
4. Clock Out — ritual gate into After Hours.
5. After Hours — complete site takeover mode.
6. The Rack — 2003 online inventory/shop page.
7. Lost & Found — object archive and lore unlock system.
8. Newsstand / 3AM Edition — headlines, classifieds, corrections, public notices.
9. Idle Hands Invitational — hidden old-school pool tournament page.
10. Phone Behind The Bar — text-based messages, rides, food deliveries, invites, weird voicemails.
11. Sign The Wall — bathroom wall / old guestbook community surface.
12. OmniShift Ventures — AI-generated acquisitions and business lines.
13. Breakroom Radio — Channel 1:47.

## Main Storyline

OmniShift’s AI has taken over the company. Executives cannot explain what it is doing, but they blindly trust the dashboards. The AI keeps hiring users, inventing departments, assigning objects, acquiring fake businesses, and routing people into The Breakroom.

The Breakroom might be a glitch, a resistance cell, a rogue employee edit, or the one part of the system the AI cannot understand. Do not answer which.

## V1 Conversion

Primary: account creation / OmniShift Employee Profile.
Secondary: Clock Out unlock, Idle Hands registration, object saves, wall post, product file request/notify.

## User Identity Layers

### OmniShift Employee Profile
Created after signup.

Includes:
- Employee ID
- Department
- Role
- Assigned Object
- House Rule
- Uniform Recommendation
- First Phone Message
- Clock Out button

### After Hours Persona Profile
Created after Idle Hands Invitational registration.

Includes:
- Player Alias
- Fake Handicap
- Preferred Light
- Signature Object
- Table Assignment
- After Hours Status
- Regular’s Note
- Personal Myth
- Phone Message
- Tournament Receipt
- Profile Card / Badge

## V1 Required Routes

- `/` — SleeperNet Search
- `/breakroom` — Employee Resources / Breakroom
- `/portal` — OmniShift Employee Profile
- `/portal/after-hours-profile` — After Hours Persona Profile
- `/clock-out` — Clock Out transition
- `/after-hours` — After Hours takeover page
- `/rack` — 2003 shopping / inventory page
- `/rack/[slug]` — product file page
- `/lost-found` — object archive
- `/lost-found/[slug]` — object file page
- `/newsstand` — 3AM Edition
- `/newsstand/[slug]` — article/clipping page
- `/idle-hands` — Idle Hands Invitational
- `/idle-hands/player/[slug]` — player bio
- `/phone` — Phone Behind The Bar
- `/radio` — Breakroom Radio / Channel 1:47
- `/sign-the-wall` — bathroom wall / guestbook
- `/ventures` — OmniShift Ventures
- `/house-rules` — House Rules
- `/staff-only` — locked teaser
- `/404` — Room Not Found

## Visual Style

The Breakroom is lo-fi baroque after-hours Americana: Westside Gunn / Griselda luxury-in-decay blended with 2003 old-web nostalgia, dive bars, pool hall DNA, motel lots, lowriders, burnt coffee, matchbooks, fuzzy dice, wall clocks stuck at 1:47, fake corporate memos, underground newspaper clippings, and lost-and-found artifacts.

It should feel like a corrupted employee portal, old pool tournament website, Craigslist board, bar bulletin wall, and hidden brand shop all at once. Dry, deadpan, gritty, funny, useful, haunted, and never polished.

Products are issued goods, redacted files, found objects, uniforms, product sightings, and things removed from the rack.

## Design System Direction

Use Tailwind plus custom old-web CSS classes:

- `.table-box`
- `.status-strip`
- `.old-web-link`
- `.red-stamp`
- `.memo-box`
- `.inventory-row`
- `.newsprint-card`
- `.visitor-counter`
- `.old-button`
- `.thumbnail`

Core palette:

- Ash black
- Nicotine beige
- Felt green
- Dashboard green
- Beer-sign red
- Motel blue
- Chrome silver
- Old hyperlink blue
- Stamp red

## Claude Design Intake

Claude Design ZIP files should be placed under:

`/design/claude/`

Expected subfolders:

- `/design/claude/screenshots/`
- `/design/claude/html/`
- `/design/claude/css/`
- `/design/claude/notes/`
- `/design/claude/assets/`

Each imported design should map to a route or component in `/docs/CLAUDE_DESIGN_HANDOFF.md`.

## First Build Priority

1. Repo scaffold and old-web design system.
2. SleeperNet Search first working preview.
3. Breakroom page second.
4. The Rack third.
5. Supabase auth/profile integration.
6. Clock Out and After Hours gate.
7. Lost & Found, Newsstand, Idle Hands, Radio, Sign The Wall, Ventures.

## V1 Success Test

After three minutes, a visitor should say:

- I don’t fully know what this is, but I want in.
- I found something hidden.
- This feels like a real world.
- I need to send this to someone.
- I want the hoodie/cap when this drops.

# Claude Design Parity Audit

This audit maps the Claude design archive to the live Astro/React site.

Goal: make sure the design archive is not just stored in the repo, but actively governing the live build.

## Current status

The project has strong route coverage. Most Claude page concepts have live route equivalents. The next gap is visual parity: making each live route feel closer to the Claude design files in density, object language, old-web structure, page-specific motifs, and hidden-internet behavior.

## Design archive files reviewed

```txt
design/claude/html/app.jsx
design/claude/html/components.jsx
design/claude/html/data.js
design/claude/css/styles.css
design/claude/html/signup.jsx
design/claude/html/SleeperNet.html
design/claude/html/page-breakroom.jsx
design/claude/html/page-afterhours.jsx
design/claude/html/page-afterhours-v1.jsx
design/claude/html/page-rack.jsx
design/claude/html/page-rack-v1.jsx
design/claude/html/page-lost.jsx
design/claude/html/page-lost-v1.jsx
design/claude/html/page-phone.jsx
design/claude/html/page-newsstand.jsx
design/claude/html/page-idlehands.jsx
design/claude/html/page-staff.jsx
design/claude/html/page-sleeper.jsx
design/claude/html/page-portal.jsx
```

## Route parity map

| Claude file | Live route/component | Status |
|---|---|---|
| `page-breakroom.jsx` | `/breakroom` | Implemented, needs visual parity pass |
| `page-afterhours.jsx` | `/after-hours` | Implemented, needs heavier takeover/room feel |
| `page-afterhours-v1.jsx` | `/after-hours` | Partial reference, not fully reconciled |
| `page-rack.jsx` | `/rack`, `/rack/[slug]` | Implemented, needs product-row parity |
| `page-rack-v1.jsx` | `/rack`, `/rack/[slug]` | Partial reference, not fully reconciled |
| `page-lost.jsx` | `/lost-found`, `/lost-found/[slug]` | Implemented, needs richer object archive feel |
| `page-lost-v1.jsx` | `/lost-found`, `/lost-found/[slug]` | Partial reference, not fully reconciled |
| `page-phone.jsx` | `/phone` | Implemented, needs deeper phone/voicemail interaction |
| `page-newsstand.jsx` | `/newsstand`, `/newsstand/[slug]` | Implemented, needs old newspaper archive density |
| `page-idlehands.jsx` | `/idle-hands`, `/idle-hands/player/[slug]` | Implemented and now persistent, needs bracket/roster parity |
| `page-staff.jsx` | `/staff-only` | Implemented, needs stronger fake internal portal feel |
| `page-portal.jsx` | `/portal` | Implemented, now auth-aware, needs employee mainframe polish |
| `signup.jsx` | `/signup` | Implemented, now auth-aware, needs design copy/spacing polish |
| `page-sleeper.jsx` | no direct route | Missing or folded into broader site |
| `SleeperNet.html` | no direct route | Missing or folded into broader site |
| `components.jsx` | shared components | Partial, should be mined into reusable components |
| `app.jsx` | site shell/reference | Partial, should be checked against layouts |
| `data.js` | `src/lib/breakroomData.ts` / Supabase seed data | Partial, should be reconciled |
| `styles.css` | global/oldweb/auth styles | Partial, should be reconciled |

## Missing or unresolved routes

### SleeperNet

Claude includes both `page-sleeper.jsx` and `SleeperNet.html`, but there is no direct live route yet.

Recommendation:

```txt
/sleeper-net
```

Potential role:

A hidden after-hours search/index page. It should feel like a late-night dystopian Google, an old directory page, an employee internet mirror, and a weird internal link maze. It can become the connective tissue between Breakroom pages, secrets, object archives, fake ventures, radio, phone messages, and newspaper entries.

This is highly aligned with the product direction: an internet within the internet.

## Visual parity priorities

### 1. Breakroom entry

Live route exists. Needs sharper rogue-mainframe feel.

Add/check:

```txt
- More overwritten corporate UI
- More red stamps and defaced memo language
- Stronger title treatment for “A bunch of bull sh*t, right?”
- Hidden links that look like broken old web clutter
- Better bridge from fake company to real room underneath
```

### 2. After Hours

Live route exists. Needs stronger complete-takeover feeling.

Add/check:

```txt
- Dive bar / Westside Gunn / odd normalcy object grid
- More sacred-criminal object pairings
- More phone, radio, fake bar, and secret society hooks
- More page-level feeling that work has ended and the real internet opened
```

### 3. Rack

Live route exists. Needs 2003 shopping page parity.

Add/check:

```txt
- Product rows feel like old catalog/database listings
- Blanked-out products feel intentional, not empty
- More product-as-issued-good language
- More item numbers, status stamps, fake inventory notes
```

### 4. Lost & Found

Live route exists. Needs deeper lore-object behavior.

Add/check:

```txt
- Objects should feel real, culturally funny, and digitally haunted
- Add unlock/inspection feel
- More object archive language
- More links between objects and other site pages
```

### 5. Idle Hands

Live route exists and registration persistence has been added.

Add/check:

```txt
- Bracket module
- More player card personality
- More old pool tournament website texture
- More “unclear if real” tournament status cues
- More personalized digital asset output after registration
```

### 6. Newsstand

Live route exists. Needs old archive/newspaper density.

Add/check:

```txt
- Better issue/archive structure
- More fake local newspaper UI
- More tiny links, dates, printer-friendly cues
- More crosslinks into objects, ventures, and phone messages
```

### 7. Phone

Live route exists. Needs more interaction.

Add/check:

```txt
- Voicemail player styling
- Ubers, food delivery, weird calls, invites, missed calls
- “company phone” framing
- Gender/after-hours persona hooks later
```

### 8. Portal / Signup

Live route exists and auth works structurally.

Add/check:

```txt
- More Claude design spacing and old portal density
- More fake HR/AI corporate language
- More profile identity artifacts
- Better visual transition from intake to portal to clock out
```

## Component extraction opportunities

Mine `components.jsx` and `styles.css` into durable reusable components:

```txt
OldWebWindow
RedStamp
VisitorCounter
ClassifiedCard
ArchiveIndex
ObjectInspectionCard
ProductInventoryRow
InternalMemo
LinkMazeBlock
VoicemailCard
RosterCard
BracketBox
```

## Data reconciliation opportunities

`design/claude/html/data.js` should be compared against:

```txt
src/lib/breakroomData.ts
supabase/migrations/0003_seed_v1_content.sql
```

Goal:

```txt
- No strong object/motif from Claude design gets lost
- Supabase seed data becomes the durable source for live content
- Static data remains useful for fallback/demo mode only
```

## Recommended next branch

```txt
feature/claude-visual-parity-pass
```

Suggested scope for that branch:

```txt
- Add SleeperNet route or document why it stays archived
- Reconcile Claude CSS/style tokens with live CSS
- Update Breakroom, After Hours, Rack, Lost & Found, Idle Hands, Phone, Newsstand visual density
- Extract 3-5 reusable old-web components from Claude components
- Keep logic stable; focus on visual/layout parity
```

## Product truth

The Claude designs are not decoration. They are evidence of the world.

The live site should not look like a normal B2C site with weird copy. It should feel like a corrupted company intranet, a pool hall website, a newspaper archive, a Craigslist board, a dive bar bulletin wall, and a late-night hidden search engine all sharing one bad server.

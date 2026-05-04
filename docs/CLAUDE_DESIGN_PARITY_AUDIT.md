# Claude Design Parity Audit

This audit maps the Claude design archive to the live Astro/React site.

Goal: make sure the design archive is not just stored in the repo, but actively governs the live build.

## Current status

Route coverage is strong and the first two visual parity passes are complete.

Completed parity work:

```txt
- Added /sleeper-net as the SleeperNet directory / link maze route.
- Added reusable LinkMaze component.
- Added reusable ObjectEvidenceGrid component.
- Added reusable CatalogRail component.
- Added reusable BracketBoard component.
- Increased Breakroom rogue-mainframe density.
- Increased After Hours takeover/object-shrine density.
- Increased Phone page voicemail/call-log density.
- Increased Newsstand masthead/archive density.
- Increased Rack 2003 catalog/inventory density.
- Increased Lost & Found evidence drawer/object archive density.
- Increased Idle Hands old pool tournament/bracket density.
```

Remaining parity work is now mostly refinement, not route creation.

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
| `page-breakroom.jsx` | `/breakroom` | Implemented + visual parity pass complete |
| `page-afterhours.jsx` | `/after-hours` | Implemented + visual parity pass complete |
| `page-afterhours-v1.jsx` | `/after-hours` | Reconciled as reference language/object density |
| `page-rack.jsx` | `/rack`, `/rack/[slug]` | Implemented + catalog parity pass complete |
| `page-rack-v1.jsx` | `/rack`, `/rack/[slug]` | Reconciled into catalog/product-file direction |
| `page-lost.jsx` | `/lost-found`, `/lost-found/[slug]` | Implemented + archive parity pass complete |
| `page-lost-v1.jsx` | `/lost-found`, `/lost-found/[slug]` | Reconciled into evidence drawer direction |
| `page-phone.jsx` | `/phone` | Implemented + voicemail/call-log parity pass complete |
| `page-newsstand.jsx` | `/newsstand`, `/newsstand/[slug]` | Implemented + masthead/archive parity pass complete |
| `page-idlehands.jsx` | `/idle-hands`, `/idle-hands/player/[slug]` | Implemented + registration persistence + bracket parity complete |
| `page-staff.jsx` | `/staff-only` | Implemented, needs future staff portal expansion |
| `page-portal.jsx` | `/portal` | Implemented + auth-aware, needs deeper employee mainframe polish |
| `signup.jsx` | `/signup` | Implemented + auth-aware, needs design copy/spacing polish |
| `page-sleeper.jsx` | `/`, `/sleeper-net` | Implemented via search homepage and directory mirror |
| `SleeperNet.html` | `/sleeper-net` | Implemented as SleeperNet directory route |
| `components.jsx` | shared components | Partially mined into LinkMaze, ObjectEvidenceGrid, CatalogRail, BracketBoard |
| `app.jsx` | site shell/reference | Partially reconciled against BaseLayout/OldWebLayout |
| `data.js` | `src/content/data/breakroom`, Supabase seed data | Still needs data reconciliation pass |
| `styles.css` | global/oldweb/auth/claude styles | Partially reconciled; more style cleanup can happen later |

## SleeperNet resolution

Claude included both `page-sleeper.jsx` and `SleeperNet.html`. This is now represented by:

```txt
/              SleeperNet search landing
/sleeper-net   SleeperNet directory / link maze mirror
```

SleeperNet should become the connective tissue between Breakroom pages, secrets, object archives, fake ventures, radio, phone messages, and newspaper entries.

## Visual parity completed by page

### Breakroom

Completed:

```txt
- Rogue-mainframe employee resource feel
- Corporate overwrite block
- Link maze for approved/unapproved employee portal links
- Evidence-object grid
- Stronger bridge from fake company to real room underneath
```

Next refinement:

```txt
- More portal-style glitch states
- More personalized profile hooks after signup
```

### After Hours

Completed:

```txt
- Stronger room takeover feeling
- Sacred/stupid object grid
- More phone/radio/fake venture/secret hooks
- Deeper after-hours link maze
```

Next refinement:

```txt
- More live radio integration
- More fake bar/location modules
```

### Rack

Completed:

```txt
- 2003 catalog rail
- Stronger inventory page language
- More item numbers/status stamps/file-only product framing
```

Next refinement:

```txt
- Individual product file visual parity
- Future checkout/notify-me behavior
```

### Lost & Found

Completed:

```txt
- Evidence drawer grid
- Stronger object archive language
- Cross-referenced drawer links
- Object cards styled as evidence files
```

Next refinement:

```txt
- Individual object file visual parity
- Save-object behavior
- Secret unlock hooks
```

### Idle Hands

Completed:

```txt
- Registration persists to Supabase
- After Hours persona persists/loads
- Printable bracket module
- Stronger roster/table assignment presentation
- Old pool tournament site links
```

Next refinement:

```txt
- Player bio parity
- Personalized downloadable/digital player assets
- More match schedule texture
```

### Newsstand

Completed:

```txt
- Masthead
- Archive columns
- Classifeds/corrections texture
- Printer-friendly/archive link cues
- Crosslinks to objects, phone, ventures, and room
```

Next refinement:

```txt
- Individual news item parity
- Issue archive/pagination
```

### Phone

Completed:

```txt
- Voicemail drawer styling
- Recent call table
- Phone menu links
- Company phone framing
```

Next refinement:

```txt
- Real audio/voicemail player behavior later
- Persona-specific messages later
```

### Portal / Signup

Current:

```txt
- Auth-aware
- Supabase-connected
- Clock-out flow persistent
- Local preview fallback
```

Next refinement:

```txt
- More Claude design spacing and old portal density
- More fake HR/AI corporate language
- More profile identity artifacts
- Better visual transition from intake to portal to clock out
```

## Component extraction status

Completed reusable components:

```txt
LinkMaze
ObjectEvidenceGrid
CatalogRail
BracketBoard
```

Still worth extracting later:

```txt
VoicemailCard
ClassifiedCard
RosterCard
ProductInventoryRow
InternalMemo
ObjectInspectionCard
```

## Data reconciliation opportunities

`design/claude/html/data.js` should be compared against:

```txt
src/content/data/breakroom.ts or equivalent static data file
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
feature/claude-data-reconciliation
```

Suggested scope:

```txt
- Compare Claude data.js to static Breakroom data and Supabase seed data
- Add missing motifs, objects, phone messages, products, headlines, player notes, and venture ideas
- Keep schema stable unless clearly needed
- Update seed migration or add a new additive seed migration
- Update source-of-truth docs after data pass
```

## Product truth

The Claude designs are not decoration. They are evidence of the world.

The live site should not look like a normal B2C site with weird copy. It should feel like a corrupted company intranet, a pool hall website, a newspaper archive, a Craigslist board, a dive bar bulletin wall, and a late-night hidden search engine all sharing one bad server.

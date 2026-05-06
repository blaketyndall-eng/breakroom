# PR Batch 60–65: Pocket Mode & Daily Stickiness Engine

## Thesis

The Breakroom can't only be a "sit down and create for an hour" place. It needs five-minute rituals. Little doors. Something to check while coffee brews.

The daily experience should usually be shallow but satisfying:
- Check the phone
- Save a thing
- Answer an NPC
- Sign a page
- Get lost once
- Make one fake ad
- Read one radio transmission
- See if the room changed

A user should open it for two minutes and leave with the feeling:
**"Something happened. I added a mark. The room remembered."**

## Five Habit Loops (Architecture Spine)

Every feature in this batch serves one or more:

| Loop | Feeling | Systems |
|------|---------|---------|
| **Check** | Did anything happen while I was gone? | Phone, Radio, Weather, Drawer status, World Ticks |
| **Collect** | Did I find anything worth keeping? | Stuff, Drawer, Objects, Codes, Hidden Doors |
| **Make** | Can I add one weird thing quickly? | Fake ad, object, rumor, classified, agent line, page seed |
| **Share** | Can I send this to someone? | Share Cards, Radio lines, fake ads, Regular File cards |
| **Mystery** | Is there another door? | Hidden Doors, codes, dead links, rumors, weather triggers |

## What To Avoid

The mobile version should NOT become:
- a feed
- a task manager / dashboard
- a notification trap
- a content calendar
- a marketplace
- a generic social app
- a productivity app pretending to be fun

No streak guilt. No "complete your profile." No "you missed 14 updates."

Better copy:
> The room changed. You can check it or not.

---

## PR 60: Pocket Mode Shell + Core Daily Hub

**Branch:** `feat/pocket-mode`
**Goal:** Create `/pocket` as the daily mobile hub — a field device, not a stripped-down site.

### New Route
- `/pocket` — Pocket Mode home (Astro page + React islands)

### Layout
Mobile-first. Feels like checking a weird Tamagotchi / old phone / bar message board.

```
SLEEPERNET POCKET ACCESS
signal: 2 bars / emotionally unstable

PHONE BEHIND THE BAR
2 slips waiting

LOT CONDITIONS
Hoodie Index: later
Bad Decision Pressure: rising

RADIO 1:47
Very Good Burger denies being open.

QUICK ACTIONS
[Get Lost] [Search] [Enter Code] [Leave Mark] [Make One Thing]

DRAWER
Very Good Hat / Not For You Yet
Receipt With No Total / Found

SEEN AROUND
The Players noticed you.
```

### Components (React islands)

| Component | Island Strategy | Source Lib |
|-----------|----------------|------------|
| `PocketPhoneSlips.tsx` | `client:load` | New: `src/lib/pocketSlips.ts` |
| `PocketLotConditions.tsx` | `client:idle` | Existing: `lotWeather.ts` |
| `PocketRadioLine.tsx` | `client:idle` | Existing: `radio.ts` |
| `PocketQuickActions.tsx` | `client:load` | New: routes + actions |
| `PocketDrawerPreview.tsx` | `client:idle` | Existing: `savedStuff.ts` |
| `PocketSeenAround.tsx` | `client:idle` | Existing: `topEight.ts` (SeenAround) |
| `PocketSignalBar.tsx` | `client:load` | New: computed from world state |

### New Lib: `src/lib/pocketSlips.ts`

The "slips waiting" system — aggregates world changes since last visit:
- New phone messages (from seeded content rotation)
- Door moved (new hidden door unlocked)
- Guestbook signed (someone signed your page — future)
- Faction noticed you (drift event occurred)
- Drawer item status changed

```typescript
type PocketSlip = {
  id: string;
  type: 'phone' | 'door' | 'guestbook' | 'faction' | 'drawer' | 'radio' | 'world_tick';
  headline: string;
  body?: string;
  href?: string;
  timestamp: string;
  read: boolean;
};
```

Storage key: `breakroom.pocket-slips.v1`
Last-visit key: `breakroom.pocket-last-visit.v1`

### New Lib: `src/lib/getLost.ts`

Random destination picker. Pulls from:
- SleepNet seeded sites (random page)
- Stuff items (random object file)
- Dead links (from search system)
- District rumors
- Event archives
- Hidden door teasers
- Fake ad landing pages

```typescript
export type LostDestination = {
  href: string;
  label: string;
  category: 'page' | 'stuff' | 'dead_link' | 'district' | 'event' | 'door_teaser' | 'ad';
  flavor: string; // "You ended up here. Nobody asked."
};

export function getLostDestination(): LostDestination;
```

### Pocket CSS
New file: `src/styles/pocket.css`
- Terminal/field-device aesthetic
- Monospace headers
- Status bars with world-state indicators
- Compact card layouts for mobile
- Import into global.css chain

### Acceptance Criteria
- [ ] `/pocket` renders on mobile with all widget zones
- [ ] Phone slips aggregate from localStorage world state
- [ ] Lot Conditions fetches real weather via existing `lotWeather.ts`
- [ ] Radio shows latest transmission from seeded data
- [ ] Quick Actions navigate to correct routes
- [ ] Drawer preview shows saved items with status
- [ ] Seen Around shows faction drift state
- [ ] Signal bar reflects computed world engagement
- [ ] Page is usable at 375px width
- [ ] No streak/guilt/notification language anywhere

---

## PR 61: Get Lost + Code Entry + NPC Ask

**Branch:** `feat/pocket-interactions`
**Goal:** Three core daily interaction mechanics — the "smoke break," the "scanner," and the "creativity sparker."

### 1. Get Lost

Route: triggered from Pocket Quick Actions → navigates to random destination.

Component: `GetLostButton.tsx` (client:load)
- Single click → random destination from `getLost.ts`
- Brief interstitial: "Finding somewhere..." (200ms delay for drama)
- Then redirect

### 2. Code Entry

Component: `CodeEntry.tsx` (client:load on `/pocket`)

```typescript
type CodeResult = {
  valid: boolean;
  type?: 'hidden_door' | 'stuff_unlock' | 'page_reveal' | 'radio_shoutout' | 'event_ticket';
  message: string;
  href?: string;
};
```

Lib: `src/lib/codes.ts`
- Registry of valid codes (seeded, expandable)
- Codes can appear in: Instagram posts, flyers, share cards, zines, screenshots, hidden site text
- Validates against registry → triggers appropriate unlock
- Fires hidden door events or saves stuff

Seed codes:
- `VGB-008` — unlocks Very Good Burger menu page
- `ROOM-8` — teases Room 8 (no actual unlock yet)
- `QTR-147` — adds a quarter to Drawer as Stuff
- `IDLE-BRK` — reveals Idle Hands bracket link
- `CLOCK-OUT` — alternative Clock Out trigger

### 3. NPC Ask (Agent Check-In)

Component: `NPCAsk.tsx` (client:load)

Uses existing `agentComments.ts` → `generateAgentComment()` but in a new "ask" mode:

```typescript
type NPCAskResult = {
  agent: BreakroomAgent;
  response: string;
  category: 'page_idea' | 'direction' | 'hint' | 'opinion' | 'creation_prompt';
};
```

Lib addition to `agentComments.ts`:
```typescript
export function askAgent(agentSlug: string, questionType: NPCAskCategory): NPCAskResult;
```

Agents available for Ask:
- Pool Table Oracle — fate/object advice
- 7/11 Clerk — blunt truth/food warnings
- Random Friend — creation sparks
- Night Manager — rule/page guidance

UI: Dropdown select agent → tap Ask → get one-line response + optional action link.

### Acceptance Criteria
- [ ] Get Lost navigates to random valid destination
- [ ] Code Entry validates against seeded registry
- [ ] Valid codes trigger appropriate unlocks (door, stuff, page)
- [ ] Invalid codes show in-world rejection ("Code not recognized. The register shrugged.")
- [ ] NPC Ask returns contextual one-liners from seeded agent data
- [ ] All three work at mobile viewport
- [ ] Cooldown on NPC Ask (reuses existing 10min dedup)

---

## PR 62: Make One Thing (Micro-Creation Engine)

**Branch:** `feat/micro-creation`
**Goal:** One-minute creation prompts. Users add tiny world pieces without building a full page.

### Micro-Creation Types

| Type | Output | Storage |
|------|--------|---------|
| Fake Ad | `FakeAd` object | localStorage → future Wire Room review |
| Object | `StuffItem` seed | localStorage → Drawer |
| Rumor | Short text + district tag | localStorage → future canon review |
| Classified | Title + body + contact style | localStorage → future classifieds page |
| Agent Line | Quote + attributed agent | localStorage → future agent expansion |
| Guestbook Mark | One-liner | localStorage → guestbook system |

### Component: `MakeOneThing.tsx` (client:load)

Flow:
1. User sees card: "MAKE ONE THING" with type buttons
2. Taps type → gets minimal form (1-3 fields max)
3. Submits → item saved locally + receipt generated
4. Receipt shows: "Filed. The room may notice."

### Forms by Type

**Fake Ad:**
- Headline (required, 50 char max)
- Body (required, 140 char max)
- Style select: banner | classified | coupon | flyer

**Object:**
- Name (required)
- Where found (optional, select from districts)
- One sentence about it (optional)

**Rumor:**
- The rumor (required, 200 char max)
- District (optional select)

**Classified:**
- Title (required)
- Body (required, 200 char max)
- Contact method: "call the bar" | "slip under door" | "show up" | "don't"

**Agent Line:**
- The line (required, 140 char max)
- Which agent said it (select from roster)

**Guestbook Mark:**
- One line (required, 100 char max)
- Target page (select from known pages, or "the wall")

### Lib: `src/lib/microCreation.ts`

```typescript
type MicroCreationType = 'fake_ad' | 'object' | 'rumor' | 'classified' | 'agent_line' | 'guestbook_mark';

type MicroCreation = {
  id: string;
  type: MicroCreationType;
  data: Record<string, string>;
  createdAt: string;
  status: 'draft' | 'filed' | 'noticed' | 'promoted';
};

export function saveMicroCreation(creation: Omit<MicroCreation, 'id' | 'createdAt' | 'status'>): MicroCreation;
export function getMicroCreations(type?: MicroCreationType): MicroCreation[];
export function getMicroCreationCount(): number;
```

Storage key: `breakroom.micro-creations.v1`

### Pocket Integration
- Make One Thing button on Pocket Quick Actions
- Creation count shows in Pocket ("3 things filed")
- Creations appear in Drawer as special "made" items

### Acceptance Criteria
- [ ] All 6 creation types have minimal working forms
- [ ] Submissions save to localStorage with proper typing
- [ ] Receipt feedback uses in-world language (no "Success!" toasts)
- [ ] Creations appear in user's micro-creation list
- [ ] Forms work cleanly at 375px
- [ ] No creation requires more than 3 fields
- [ ] Each form has placeholder text in Breakroom voice

---

## PR 63: Share Cards + Daily Radio

**Branch:** `feat/share-cards-radio`
**Goal:** Share habit + Check habit. Cards for sending things to friends. Daily rotating radio content.

### Share Cards

Component: `ShareCard.tsx` + `ShareCardGenerator.tsx`

Shareable items:
- Regular File card (identity)
- Stuff item card
- Radio transmission
- Fake ad (user-made)
- Lot Conditions snapshot
- Get Lost result
- Micro-creation

Card format: OG-image-style HTML card rendered as image or link preview.

```typescript
type ShareCard = {
  type: 'regular_file' | 'stuff' | 'radio' | 'fake_ad' | 'weather' | 'lost' | 'creation';
  title: string;
  body: string;
  footer: string; // "thebreakroom.world / pocket access"
  style: 'receipt' | 'memo' | 'classified' | 'evidence' | 'transmission';
};
```

Actions:
- Copy link (with OG metadata for previews)
- Download as image (canvas → PNG)
- Native share (Web Share API where available)

### Daily Radio Transmission

Lib addition to `radio.ts`:
```typescript
export function getDailyTransmission(): RadioEntry;
```

Logic: deterministic daily rotation through seeded radio entries + time-based generation for days that exceed seed count.

Pocket widget shows today's transmission. User can:
- Read it
- Save it to Drawer
- Share as card
- Reply with a shoutout (→ micro-creation of type 'radio_shoutout')

### Acceptance Criteria
- [ ] Share cards render for all 7 shareable types
- [ ] Web Share API works on mobile (fallback: copy link)
- [ ] Download as image produces readable 1200x630 card
- [ ] Daily radio rotates deterministically (same content all day)
- [ ] Radio widget on Pocket shows today's line
- [ ] Share card visual style matches old-web aesthetic (receipt/memo/evidence)

---

## PR 64: Privacy Controls + Drawer Status Engine

**Branch:** `feat/privacy-drawer-status`
**Goal:** Identity habit + Collect habit. Control what's visible. Make objects feel alive.

### Privacy Controls

Lib: `src/lib/privacySettings.ts`

```typescript
type PrivacyLevel = 'public' | 'regulars_only' | 'hidden' | 'staff_only';

type PrivacySettings = {
  regularFile: PrivacyLevel;
  drawer: PrivacyLevel;
  topEight: PrivacyLevel;
  microCreations: PrivacyLevel;
  factionMembership: PrivacyLevel;
  crewMembership: PrivacyLevel;
};
```

Storage key: `breakroom.privacy.v1`

Component: `PrivacyPanel.tsx` on Locker page.
- Simple per-section visibility toggles
- In-world labels: "Public" / "Regulars Only" / "Hidden From The Room" / "Staff Only"
- No "privacy settings" language — use "Who can see this: everyone / known faces / nobody / staff"

### Drawer Status Engine

Objects in the Drawer should feel like they have lives. New system:

Lib addition to `savedStuff.ts`:
```typescript
type DrawerItemStatus = 
  | 'filed'          // just saved
  | 'found'          // confirmed in world
  | 'moved'          // location changed
  | 'not_for_you_yet' // teaser state
  | 'noticed'        // world acknowledged it
  | 'connected'      // linked to a hidden door or event
  | 'removed_by_management'; // gone (joke state)

type DrawerStatusEvent = {
  itemSlug: string;
  oldStatus: DrawerItemStatus;
  newStatus: DrawerItemStatus;
  message: string;
  timestamp: string;
};
```

Status transitions happen:
- On page visit (check if conditions changed)
- On hidden door unlock (items become "connected")
- On time passage (items drift to "noticed" after 3 days)
- Deterministically (some items have scheduled status arcs)

Pocket Drawer widget shows status badges and change indicators.

### Acceptance Criteria
- [ ] Privacy settings persist to localStorage
- [ ] Privacy levels affect what's shown on public Regular File view
- [ ] Drawer items show status badges
- [ ] Status transitions generate pocket slips ("1 item moved")
- [ ] At least 5 seeded items have status arc definitions
- [ ] Privacy panel uses in-world language throughout
- [ ] Works at mobile viewport

---

## PR 65: Pocket Polish + World Tick Engine

**Branch:** `feat/pocket-polish-world-ticks`
**Goal:** Make it feel alive. The room should change while you're gone.

### World Tick Engine

Lib: `src/lib/worldTicks.ts`

A "tick" is a small world change that happens between visits:
- A new fake ad appears in rotation
- A radio transmission posts
- An agent comments on something
- Weather changes lot conditions
- A faction's territory note updates
- A dead link resolves (or breaks further)
- A stuff item's reality_status shifts

```typescript
type WorldTick = {
  id: string;
  type: 'ad_rotation' | 'radio_post' | 'agent_comment' | 'weather_shift' | 'faction_move' | 'link_change' | 'stuff_shift';
  summary: string;
  timestamp: string;
  affectsSlug?: string;
};

export function generateTicksSinceLastVisit(lastVisit: string): WorldTick[];
```

Ticks are deterministic (seeded by date + existing content) so they're consistent per day but feel dynamic between visits.

### Pocket Polish
- Signal bar reflects: unread slips count, world ticks since last visit, drawer changes
- "signal: 2 bars / emotionally unstable" — computed from engagement state
- Smooth transitions between states
- Pull-to-refresh gesture (mobile)
- Haptic feedback on actions (Vibration API where supported)

### "The Room Changed" Notification
Not push notifications. Not badges. Just:
- On Pocket open: "The room changed." if ticks > 0
- Below it: compact list of what happened
- User can dismiss or explore each tick

### Acceptance Criteria
- [ ] World ticks generate deterministically from date
- [ ] Pocket shows tick summary on open
- [ ] Signal bar computation works across world state
- [ ] No push notifications or native badges
- [ ] "The room changed" copy — never "You have 3 notifications"
- [ ] At least 10 distinct tick templates seeded
- [ ] Pull-to-refresh regenerates weather + checks ticks

---

## Dependency Graph

```
PR 60 (Pocket Shell)
  ├── PR 61 (Get Lost + Code Entry + NPC Ask) — depends on 60's Quick Actions
  ├── PR 62 (Make One Thing) — depends on 60's Pocket integration
  ├── PR 63 (Share Cards + Radio) — depends on 60's Radio widget
  └── PR 64 (Privacy + Drawer Status) — depends on 60's Drawer preview
        └── PR 65 (World Ticks + Polish) — depends on 60's slip system + 64's status engine
```

PRs 61-63 can run in parallel after 60 ships.
PR 64 can start after 60.
PR 65 requires 60 + 64.

## Implementation Order

1. **PR 60** — Pocket Mode shell (the frame everything lives in)
2. **PR 61** — Get Lost + Code Entry + NPC Ask (core interactions)
3. **PR 62** — Make One Thing (micro-creation)
4. **PR 63** — Share Cards + Daily Radio (share + check loops)
5. **PR 64** — Privacy + Drawer Status (identity + collect loops)
6. **PR 65** — World Ticks + Polish (alive feeling)

## Files Created/Modified Per PR

### PR 60
**New:**
- `src/pages/pocket.astro`
- `src/components/pocket/PocketPhoneSlips.tsx`
- `src/components/pocket/PocketLotConditions.tsx`
- `src/components/pocket/PocketRadioLine.tsx`
- `src/components/pocket/PocketQuickActions.tsx`
- `src/components/pocket/PocketDrawerPreview.tsx`
- `src/components/pocket/PocketSeenAround.tsx`
- `src/components/pocket/PocketSignalBar.tsx`
- `src/lib/pocketSlips.ts`
- `src/lib/getLost.ts`
- `src/styles/pocket.css`

**Modified:**
- `src/styles/global.css` (add pocket import)

### PR 61
**New:**
- `src/components/pocket/GetLostButton.tsx`
- `src/components/pocket/CodeEntry.tsx`
- `src/components/pocket/NPCAsk.tsx`
- `src/lib/codes.ts`
- `src/content/data/codes.ts` (seed registry)

**Modified:**
- `src/lib/agentComments.ts` (add `askAgent` function)
- `src/pages/pocket.astro` (wire new components)

### PR 62
**New:**
- `src/components/pocket/MakeOneThing.tsx`
- `src/components/pocket/MicroCreationForm.tsx`
- `src/lib/microCreation.ts`

**Modified:**
- `src/pages/pocket.astro` (add Make One Thing to Quick Actions)
- `src/lib/pocketSlips.ts` (add creation count to slips)

### PR 63
**New:**
- `src/components/pocket/ShareCard.tsx`
- `src/components/pocket/ShareCardGenerator.tsx`
- `src/lib/shareCards.ts`

**Modified:**
- `src/lib/radio.ts` (add `getDailyTransmission`)
- `src/components/pocket/PocketRadioLine.tsx` (add share + save actions)
- Various item pages (add share card trigger)

### PR 64
**New:**
- `src/components/regulars/PrivacyPanel.tsx`
- `src/lib/privacySettings.ts`
- `src/lib/drawerStatus.ts`

**Modified:**
- `src/lib/savedStuff.ts` (add status types + transitions)
- `src/pages/locker.astro` (add PrivacyPanel)
- `src/components/pocket/PocketDrawerPreview.tsx` (show status badges)

### PR 65
**New:**
- `src/lib/worldTicks.ts`
- `src/components/pocket/WorldTickSummary.tsx`

**Modified:**
- `src/components/pocket/PocketSignalBar.tsx` (wire tick count)
- `src/lib/pocketSlips.ts` (integrate world ticks as slip source)
- `src/pages/pocket.astro` (add WorldTickSummary zone)
- `src/styles/pocket.css` (polish + animations)

---

## Voice / Copy Guidelines for This Batch

**Good (in-world, low-pressure):**
- "The room changed."
- "2 slips waiting."
- "Filed. The room may notice."
- "Code not recognized. The register shrugged."
- "signal: 2 bars / emotionally unstable"
- "1 item moved."
- "Someone signed your page."
- "A door moved."

**Bad (app-like, guilt-inducing):**
- "You have 3 new notifications!"
- "Complete your profile to unlock features"
- "You missed 14 updates"
- "Come back tomorrow for your streak bonus"
- "Share with friends to earn points"
- "Your engagement score: 42%"

---

## Stickiest V1 Mobile Features (Priority Order)

If we had to ship only 7 from this batch:

1. **Phone Behind The Bar** (slips waiting) — strongest return mechanic
2. **Get Lost** — simplest habit, one click
3. **Radio 1:47** (daily transmission) — tiny content without doomscrolling
4. **Lot Conditions** — real-world reason to open
5. **Drawer** (with status) — weird attachment to objects
6. **Enter Code** — trains users to look for doors
7. **Make One Thing** — creation without commitment

Those make The Breakroom casually useful without making it normal.

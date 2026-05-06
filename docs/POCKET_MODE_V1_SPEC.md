# Pocket Mode V1 Spec

## Core Promise

**Open for two minutes. The room changed. You left a mark.**

Pocket is not a stripped-down version of The Breakroom. It is the daily field terminal — the thing you check on your phone while waiting for coffee, sitting in an Uber, or hiding in the bathroom at work. Two to five minutes. You check in, the world reacts, you touch something, you leave.

The emotional target: a dirty little field device that knows more than it should.

---

## What Pocket Is Not

- Not a feed. Nothing scrolls infinitely.
- Not a dashboard. No metrics, no progress bars, no completion percentages.
- Not a notification trap. No streak guilt. No "you missed 14 updates."
- Not a creative tool. You don't "produce content" here. You touch the world.
- Not a social app. No likes, no followers, no engagement metrics.

Better copy than "you have 3 notifications":

> The room changed. You can check it or not.

---

## The Daily Loop

Seven systems. Each one gives a reason to open Pocket, takes under 30 seconds, and leaves a trace.

### 1. Phone Behind The Bar

**What it is:** Your world inbox. Slips left for you — page activity, door hints, NPC messages, faction notices, object status changes, weather events.

**Current state:** `PocketPhoneSlips.tsx` — generates daily slips from `pocketSlips.ts` templates, marks read/unread, links to relevant pages. 30+ slip templates across 6 categories. localStorage persistence.

**V1 target:**
- Slips should react to actual user state (drawer contents, pages visited, codes entered, faction drift)
- Door hints: "A door moved near something you saved" — vague but connected to real Hidden Door state
- NPC slips: agents leave messages based on time of day and user behavior
- Activity slips: "Someone signed your guestbook" / "Your page was indexed"
- Slip expiration: old slips age out after 3 days, replaced by new ones
- Slip actions: tap to navigate, swipe to dismiss, long-press to save to drawer

**Personalization:**
- Faction agents generate slips for members: "Pool Table Oracle left a message: the break is off tonight."
- Drift slips from factions you're leaning toward: "Someone from the lot noticed your file." (no faction named)
- Regular File slips: "[handle], your away message was quoted somewhere."
- Drawer-reactive slips: "The [item] you saved changed status. It's now [status]."
- Slip templates use template strings: `${handle}`, `${factionName}`, `${assignedObject}`, `${drawerItem}`

**Copy voice:**
> Missed call from unknown number.
> Voicemail is just breathing and a jukebox.

Faction slip:
> The Players left a message behind the bar.
> "Tell them the table is ready. They'll know which one."

Drift slip:
> Someone from the fence left a note. Not signed.
> "We've seen your file around."

### 2. Get Lost

**What it is:** One button. Takes you somewhere strange. A random page, object, rumor, ad, dead link, classified, or door.

**Current state:** `PocketQuickActions.tsx` — "Get Lost" button with gashapon micro-delay (200-600ms), haptic feedback, navigates via `getLostDestination()`.

**V1 target:**
- Weighted randomness: favor pages/objects the user hasn't seen
- Rare outcomes: 1-in-20 chance of landing on a Hidden Door, code entry, or agent encounter
- "Get Lost" should occasionally fail interestingly: "The directory refused." / "That page was here yesterday."
- History: track last 10 Get Lost destinations in localStorage, never repeat within the same day
- Return path: after getting lost, the back button should always return to Pocket

**Personalization:**
- Turf members get weighted toward their faction's preferred districts and page types
- Drift biases Get Lost toward faction-adjacent content (pool hall pages for Players-drift, lot pages for Racers-drift)
- Drawer contents influence: if you saved "matchbook," Get Lost favors bar/night pages
- Failure messages use faction voice if you have turf: "The Players table is full. Try somewhere else."

**The feel:** Gashapon machine. You don't know what you're getting. The delay is the ritual.

### 3. Radio 1:47

**What it is:** Daily micro-transmission. One line from the world. Save it, share it, follow the hint, or ignore it.

**Current state:** `PocketRadioLine.tsx` — shows one line from `radio.ts` feed, links to `/radio`.

**V1 target:**
- Daily rotation: one primary transmission per day, changes at midnight
- Transmission types: agent broadcast, weather report, faction beef, event teaser, fake ad, object rumor, unknown signal
- Tap to expand: shows 2-3 more lines of the transmission without leaving Pocket
- Save to drawer: long-press saves the transmission as a Stuff object
- Occasional live interruptions: "BREAKING: The vending machine has been promoted."
- Share: generate a share card for the transmission

**Personalization:**
- Turf members occasionally get faction-specific transmissions: "Lot Racers frequency: someone left their lights on. Row 3."
- Drift creates "bleed" — you start hearing transmissions from the faction you're leaning toward
- Your handle may appear in transmissions: "[handle] was mentioned on the wire. Context unclear."
- Drawer objects referenced in fake ads within radio: "FOR SALE: [drawer_item]. Condition: [status]. Contact: the phone."

**Copy voice:**
> Very Good Burger denies being open. The lights remain on.

### 4. Lot Conditions

**What it is:** Real weather translated into Breakroom mood. Your actual sky, filtered through the world's tone.

**Current state:** `PocketLotConditions.tsx` — geolocation → weather API → translated into Hoodie Index, Bad Decision Pressure, Neon Visibility, Sky, Advisory. Falls back to generated fiction.

**V1 target:**
- Weather-reactive Pocket styling: different `--pocket-bg` tints for rain/night/heat
- Lot advisory should occasionally reference user state: "Advisory: you have unchecked slips. The room is aware."
- Seasonal events: weather triggers that unlock Hidden Doors or special radio transmissions
- Micro-animations: subtle rain overlay during actual rain, heat shimmer during high temps (CSS only, no JS animation)

**Personalization:**
- Faction-aware advisories: "Advisory: Lot Racers report the pavement is optimal." / "Advisory: The Players say the felt is dry."
- Drift-reactive: lot conditions language shifts toward your faction's vocabulary without naming them
- Regular File: "Advisory: [handle], your favorite light ([favorite_light]) is not visible at this hour."
- Hoodie Index uses faction language: Cowboys get "jacket weather," Night Drinkers get "coat-check weather"

**The feel:** Old-web weather widget that knows too much.

### 5. Drawer

**What it is:** Your saved objects. Things you found, collected, entered, or were given. They have status. They change.

**Current state:** `PocketDrawerPreview.tsx` — shows last 3 items from `savedStuff.ts`, links to full drawer.

**V1 target:**
- Status changes: items should evolve between visits. "Found" → "Filed" → "Known Around Here" → "Not For You Yet"
- Status triggers: time-based decay, faction-related events, code entries, weather conditions
- New statuses: `rotting`, `promoted`, `missing`, `claimed`, `evidence`, `under review`
- Drawer should surface one "something changed" item at the top when status shifts
- Empty state with purpose: "Nothing filed yet. Find Stuff. Save it. Pretend that means something."
- Full drawer route: `/pocket/drawer` — sortable by status, date, type

**Personalization:**
- Faction events trigger status changes on related items: Players activity → pool-related stuff gets "promoted," Lot Racers activity → car-related stuff gets "seen on the lot"
- Turf members see faction-stamped statuses: "Claimed by The Players" / "Under Lot Racers review"
- Drawer empty state changes with drift: drifting toward Night Drinkers → "Nothing filed yet. There's a bar around here somewhere."
- Assigned object from Regular File always sorts first and gets special status treatment

### 6. Enter Code

**What it is:** The real-world search box. Type in codes from stickers, flyers, zines, screenshots, product tags, bathroom walls.

**Current state:** Quick action button linking to `/pocket/code` — route does not exist yet.

**V1 target:**
- Route: `/pocket/code` — single input field, monospace, uppercase auto-format
- Code types: sticker codes, URL slugs, object IDs, door keys, faction passwords, agent names
- Success states: "Code accepted. Something was filed." / "The directory added one result." / "A door moved."
- Failure states: "Code not recognized. The room shrugged." / "That code expired. Or never existed."
- Partial matches: "Close. The room almost recognized that."
- Code entry should trigger appropriate system: add to drawer, reveal hidden door, unlock faction content, summon NPC
- History: last 5 entered codes visible below the input
- Physical tie-in: this is how real-world Breakroom artifacts (stickers, zines, matchbooks) connect to the digital world

### 7. Make One Thing

**What it is:** Quick creation. Not a page builder — a single artifact. A fake ad, object, rumor, classified, guestbook line, agent quote.

**Current state:** Quick action button linking to `/pocket/make` — route does not exist yet.

**V1 target:**
- Route: `/pocket/make` — presents one random creation prompt, pre-filled template, one-tap submit
- Creation types (random daily rotation):
  - Fake ad (headline + body + fake price)
  - Object listing (name + description + found location)
  - Rumor (one sentence about something that may or may not be true)
  - Classified (wanted/for sale/lost/found)
  - Guestbook line (one line, any page)
  - Agent quote (put words in an NPC's mouth)
- One-tap submit: no preview, no editing, no drafts. You make it. It's in the world.
- Daily limit: 3 creations per day. "The room accepted your filing. 2 remaining."
- Quality over quantity: the constraint is the feature

**Create → Publish → Share (the phone pipeline):**

The whole point: you make something on your phone and it's immediately alive in the world AND shareable outside it. Three taps. No friction.

1. **Create** — fill one field, tap submit. Done. No drafts, no preview, no "are you sure."
2. **Publish** — instant. The artifact gets a permalink (`/stuff/[id]`, `/ads/[id]`, `/classifieds/[id]`), appears in SleepNet search, shows up in relevant district pages, and can surface in other users' slips. The creation is *in the world* the moment you tap submit.
3. **Share** — confirmation screen shows a share card (rendered preview of what you just made) with:
   - **Web Share API** (`navigator.share`) — native iOS/Android share sheet. Send the permalink to any app: iMessage, Instagram stories, Discord, whatever. This is the primary path.
   - **Copy link** — fallback. Copies the permalink to clipboard.
   - **Share card image** — auto-generated OG image / card preview so the link looks good when pasted anywhere. Rendered server-side or as a static HTML snapshot.
   - **Skip** — "file and forget." Not everything needs to be shared. The artifact is still live either way.

The confirmation screen is not a preview-before-publish. It's a receipt-after-publish with share options. The thing is already in the world when you see it.

**Share card design:**
- Looks like a Breakroom artifact — receipt paper texture, monospace type, red stamp, slightly crooked
- Shows: creation type label, the content, "Filed by [handle]" or "Source: unknown," timestamp, district tag
- Faction-stamped if created by a turf member: "FILED VIA THE PLAYERS" / "LOT RACERS DISPATCH"
- OG meta tags on the permalink page so the card auto-previews in iMessage, Slack, Discord, Twitter/X
- The share card IS the marketing. Every shared creation is an invite into the world.

**Copy voice:**
> Filed. The room accepted your filing. 2 remaining today.
> [Share this] [Copy link] [File and forget]

Faction version:
> Filed via The Players. The table acknowledges your contribution.
> [Put it on the wire] [Copy] [Walk away]

**Personalization:**
- Turf members get faction-flavored creation prompts: Players make "pool hall classifieds," Lot Racers make "lot listings," Night Drinkers make "bar napkin notes"
- Drift biases creation type rotation toward faction-adjacent templates without naming the faction
- Your handle auto-signs creations: "Filed by [handle]" / "Source: unknown" if no Regular File
- Drawer objects can be referenced in creation templates: "Write a classified for your [drawer_item]"
- Created artifacts are tagged with faction affinity, feeding back into Drift signals
- Share card inherits faction styling if you have turf — Players get green felt texture, Lot Racers get asphalt, Night Drinkers get dark wood
- Share button copy changes per faction: "Put it on the wire" (default), "Post to the board" (Players), "Leave it on the lot" (Lot Racers), "Slide it down the bar" (Night Drinkers)

---

## Personalization Engine

**Principle: nothing in Pocket should feel seeded. Everything should feel like it's yours.**

Pocket reads three identity systems already in localStorage to make every session feel personal:

### Data Sources

| System | localStorage Key | What It Knows |
|--------|-----------------|---------------|
| **Faction Drift** | `breakroom.faction-signals.v1` | Which faction pages/ads/stuff/guestbooks you've interacted with. Weighted signal history. Top drift faction. |
| **Turf Membership** | `breakroom.turf-membership.v1` | Which faction you formally joined (if any). Join method (ritual vs drift promotion). |
| **Regular File** | `breakroom.regular-file.v1` | Handle, display name, bio, away message, favorite light, assigned object, turf, theme, top links, pinned artifacts. |
| **Drawer** | `breakroom.saved-stuff.v1` | What objects you've saved, their statuses, categories. |
| **Entered Codes** | `breakroom.entered-codes.v1` | Code history — what real-world artifacts you've scanned. |
| **Hidden Doors** | `breakroom.hidden-doors.v1` | Which doors you've found. |
| **Get Lost History** | `breakroom.get-lost-history.v1` | Where you've been sent. |
| **Field Reports** | `breakroom.field-prompts.v1` | Past prompt completions and responses. |

### How Personalization Flows

**Faction Drift → Prompt Selection:**
- Your top drift faction biases which field prompts you see
- A user drifting toward The Players sees more pool/game/strategy prompts
- A user drifting toward Lot Racers sees more car/lot/night-driving prompts
- Drift prompts are suggestive — they pull you deeper into a faction you haven't committed to

**Turf Membership → Faction Prompts:**
- If you've formally joined a faction, you get direct faction prompts
- "The Players ask: how many pool tables are within walking distance?"
- "Lot Racers want to know: describe the nearest parking lot in three words."
- "Night Drinkers request: what's written on the nearest napkin?"
- These feel like assignments from your crew, not generic tasks

**Regular File → Personal Prompts:**
- Your assigned object appears in prompts: "Your [motel key with no room number] wants to know where the nearest door leads."
- Your favorite light colors the language: "Under [dashboard green] light, what looks different?"
- Your handle gets referenced in slips: "[handle], the room has a question."
- Your theme shifts the visual tone of prompt cards

**Drawer Contents → Object-Reactive Prompts:**
- If you saved "cue-chalk," prompts reference it: "The chalk in your drawer is asking about the nearest flat surface."
- If you saved a matchbook, prompts ask about fire, light, small print
- Status changes on drawer objects trigger related field prompts
- Empty drawer → prompts skew toward finding/collecting things

**Past Field Reports → Evolving Prompts:**
- Your answers shape future prompts. Filed "3 stools" last week? This week: "One of those stools is now a Breakroom stool. Which one."
- Repeated themes in your reports attract faction-specific follow-ups
- Completing observation prompts unlocks more creative prompts
- Completing social prompts unlocks more world-building prompts

### Personalization Priority

When selecting today's prompt, the engine checks (in order):

1. **Turf faction prompt** — if you're a member, 40% chance of a faction-specific prompt
2. **Drift-reactive prompt** — if you have drift signals, 30% chance biased toward your top drift faction
3. **Drawer-reactive prompt** — if you have 3+ drawer items, 15% chance of an object-reactive prompt
4. **Regular File prompt** — if you have a Regular File, 10% chance referencing your handle/object/light
5. **Universal prompt** — fallback pool that doesn't reference any personal state

A brand-new user with no state gets universal prompts. A veteran with a faction, a full drawer, and a Regular File gets prompts that feel like the room knows them.

### The Drift-to-Turf Pipeline

Field prompts are a covert recruitment tool. If a user has no turf but is drifting toward Night Drinkers, they'll get prompts like:
- "Find the nearest bar. How many stools. Report."
- "What's the cheapest drink within walking distance."
- "Describe the nearest neon sign."

These aren't labeled as Night Drinker prompts. They just... lean that way. The user starts thinking about bars and stools and neon without being told they're being recruited. When their drift score crosses the threshold, the join ritual appears in a slip.

Conversely, if someone is a committed Player, their prompts reinforce identity:
- "THE PLAYERS ASK: Estimate the angle between the nearest two flat surfaces."
- "POOL HALL COUNTY DISPATCH: Rate the nearest table on a scale of warped to tournament."
- "FIELD REPORT — PLAYERS ONLY: How many round objects can you see from where you're standing."

---

## Field Prompts (New System)

**The big idea:** Pocket doesn't just show you the digital world. It sends you into the real one.

Field Prompts are daily micro-tasks that push users out of the phone and into their actual environment. They appear in the bump zone (Night Manager observation area) or as a special slip type. They're optional, completable by tapping "done" or submitting a one-line response. They never require a photo upload or anything invasive.

Every prompt is shaped by who you are in The Breakroom. Your faction, your drift, your drawer, your Regular File — they all feed the prompt engine. No two users get exactly the same Pocket.

### Prompt Layers

**Layer 1: Universal Prompts** (no identity required)

Observation:
- "Count the stools at the nearest bar. Report the number."
- "Find something yellow within arm's reach. What is it."
- "Look at the ceiling. Describe it in four words."
- "What is the nearest handwritten thing."
- "Read the smallest text you can find. What does it say."

Object:
- "Locate the nearest vending machine. What's in slot A3."
- "Find a matchbook, coaster, or napkin. What's printed on it."
- "Pick up the nearest object that costs less than a dollar. Describe it."
- "Find something that looks like evidence. File it."

Social:
- "Ask someone nearby what they had for lunch. File the answer."
- "Ask a stranger to pick a number between 1 and 147."
- "Find someone wearing a hat. What kind."
- "Compliment someone on something specific."

Creative:
- "Write one word on a napkin. Leave it somewhere."
- "Draw the worst logo for a fake company. Describe it."
- "Invent a drink. Name it. Price it. File the menu item."
- "Write a one-line review of the nearest building."

World-building:
- "The nearest door is now a Breakroom door. Name the district behind it."
- "The object to your left is now Stuff. Give it a status."
- "You're in a new district. What's it called. What does it sell."
- "The person nearest you is now an NPC. What's their agent name."

**Layer 2: Faction-Specific Prompts** (requires turf membership OR strong drift)

The Players:
- "How many pool tables are within walking distance. Estimate."
- "Estimate the angle between the nearest two flat surfaces."
- "Find the nearest chalk-like substance. What color."
- "Rate the nearest table on a scale of warped to tournament."
- "How many round objects can you see without turning your head."
- "Describe the best shot you could make from where you're sitting."

Lot Racers:
- "Describe the nearest parking lot in three words."
- "What color is the most interesting car you can see."
- "Find the nearest set of tire marks. How dramatic."
- "What's the furthest thing you can see from a parking lot."
- "Rate the nearest intersection's drift potential. Scale of safe to legendary."
- "Describe the weather from inside a car right now."

Night Drinkers:
- "Find the nearest bar. How many stools. Report."
- "What's written on the nearest napkin, coaster, or receipt."
- "What's the cheapest drink within walking distance."
- "Describe the nearest neon sign."
- "Name the song playing closest to you. Or the silence."
- "What would you write on a matchbook for a place that doesn't exist."

The Smokers:
- "Describe the nearest fence from the outside."
- "What's happening on the other side of the nearest wall."
- "Find the nearest bench. Who was last here."
- "What's the nearest thing that smells like something specific."
- "Describe what's visible from the nearest back door or fire exit."
- "What's the quietest sound you can hear right now."

Cowboys:
- "What's in the nearest cooler, fridge, or cold case."
- "Find the nearest hat. Describe it like it's evidence."
- "Rate the nearest sunset/sunrise potential of your current location."
- "What's the nearest thing that looks like it's from another decade."
- "Describe the boots, shoes, or footwear of the nearest person."
- "What would a cowboy name this street."

**Layer 3: Profile-Reactive Prompts** (requires Regular File data)

These use template strings filled from your Regular File:

- "Your assigned object is [assigned_object]. The room wants to know: where would you hide it."
- "Under [favorite_light] light, describe what looks different about the nearest surface."
- "[handle], the room noticed you changed your away message. What prompted that."
- "Your file says you like [theme]. Find something nearby that matches that energy. Describe it."
- "The nearest door leads to a room decorated in [theme] style. What's on the wall."

**Layer 4: Drawer-Reactive Prompts** (requires saved stuff)

These reference your actual drawer contents:

- "The [drawer_item_name] in your drawer is restless. What does it want to be near."
- "Something you saved has a status of [status]. Find something in reality with the same energy."
- "You have [drawer_count] things filed. Find object number [drawer_count + 1]."
- "The last thing you saved was [last_saved]. The room wants a companion for it."
- "One of your drawer items just changed status. Look around — what else changed."

**Layer 5: Drift-Bait Prompts** (no turf membership, but drift signals exist)

These pull a drifting user deeper toward their emerging faction without naming it:

For Players-drift:
- "Find something that requires aim to use."
- "Describe the nearest game-like surface."
- "What's the nearest thing with angles."

For Lot Racers-drift:
- "What's the most interesting thing in the nearest parking lot."
- "Find the best-lit spot outside. Stand in it."
- "What does the air smell like right now."

For Night Drinkers-drift:
- "Find the nearest place that serves something. What's the vibe."
- "What would you write on a bar napkin right now."
- "Where's the nearest dim light."

For Smokers-drift:
- "Find the nearest outside corner. What's there."
- "What's on the other side of the nearest fence."
- "Describe the nearest exit from where you're standing."

For Cowboys-drift:
- "Find the nearest old thing. How old."
- "What's the nearest thing that doesn't belong here."
- "Describe the horizon from where you're standing."

### Field Prompt Mechanics

- One prompt per day, rotated at midnight
- Prompt selection runs through personalization priority (turf → drift → drawer → profile → universal)
- Prompt appears as a tappable card in the bump zone or as a special slip
- Completion is self-reported: tap "done" or type a one-line response (max 100 chars)
- Completed prompts file a receipt to the drawer: "Field Report: [response]"
- Prompt streaks are invisible — no counter, no guilt. The room just... notices.
- Prompt categories weighted by time of day: observation prompts in morning, social in evening, creative at night
- Faction prompts are weighted by drift strength — stronger drift = more faction-specific
- Some prompts have rare responses that trigger Hidden Doors or special slips
- Completing drift-bait prompts records a faction signal (source: `'field_prompt_completion'`), accelerating drift

### Field Prompt Copy Voice

Not gamified. Not "daily challenge." Not "quest." The tone changes based on source:

Universal prompts (Night Manager voice):
> FIELD OBSERVATION REQUESTED
> Count the stools at the nearest bar.
> Report the number.
> [___] [file report]

Faction prompts (faction voice):
> THE PLAYERS ASK
> How many round objects can you see without turning your head.
> [___] [report to table]

Drift-bait prompts (vague, no faction named):
> THE ROOM HAS A QUESTION
> What's the most interesting thing in the nearest parking lot.
> [___] [answer filed]

Profile-reactive prompts (personal):
> [HANDLE], MANAGEMENT REQUESTS
> Your assigned object is [motel key with no room number].
> Where would you hide it.
> [___] [filed under evidence]

Drawer-reactive prompts (object voice):
> INVENTORY OBSERVATION
> The [cue-chalk] in your drawer is restless.
> What does it want to be near.
> [___] [filed]

---

## Information Architecture

### Screen Order (top to bottom)

```
┌─────────────────────────────────┐
│ SIGNAL BAR                      │  ← engagement + faction-aware emotional status
├─────────────────────────────────┤
│ BUMP ZONE / FIELD PROMPT        │  ← Night Manager observation OR daily field prompt
├─────────────────────────────────┤
│ PHONE BEHIND THE BAR            │  ← slips (2-5 visible, tappable)
├─────────────────────────────────┤
│ QUICK ACTIONS                   │  ← [Get Lost] [Search] [Enter Code]
│                                 │     [Leave Mark] [Make One Thing]
├─────────────────────────────────┤
│ LOT CONDITIONS                  │  ← weather → mood translation
├─────────────────────────────────┤
│ RADIO 1:47                      │  ← daily transmission (tap to expand)
├─────────────────────────────────┤
│ DRAWER                          │  ← last 3 saved items + status
├─────────────────────────────────┤
│ SEEN AROUND                     │  ← faction drift / NPC sightings
├─────────────────────────────────┤
│ FIELD REPORT                    │  ← completed prompt response (if today's done)
├─────────────────────────────────┤
│ COUNTER                         │  ← pocket access # · clock stuck at 1:47
├─────────────────────────────────┤
│ FOOTER                          │  ← clock out · full site · sleepnet
└─────────────────────────────────┘
```

### Routes

| Route | Status | Purpose |
|-------|--------|---------|
| `/pocket` | **EXISTS** | Daily hub / field terminal |
| `/pocket/code` | NEEDS BUILD | Code entry screen |
| `/pocket/make` | NEEDS BUILD | Quick creation (one random prompt) |
| `/pocket/drawer` | NEEDS BUILD | Full drawer view |
| `/pocket/field` | NEEDS BUILD | Field prompt detail + response |
| `/pocket/history` | FUTURE | Get Lost history, past field reports |

### Data Flow

```
Real world (stickers, codes, weather, location)
    ↓
POCKET (field terminal)
    ↓
localStorage (slips, drawer, codes, field reports, visit count)
    ↓
World systems (SleepNet search, districts, guestbooks, radio)
    ↓
Other users' Pockets (via slips, seen around, radio mentions)
```

V1 is localStorage-first. Supabase persistence is a V2 concern when user accounts exist.

---

## What Exists (PR 60 + Polish)

| Component | File | State |
|-----------|------|-------|
| Signal Bar | `PocketSignalBar.tsx` | Working. Computes from localStorage engagement. |
| Phone Slips | `PocketPhoneSlips.tsx` + `pocketSlips.ts` | Working. 30+ templates, 6 categories, read/unread, daily generation. |
| Quick Actions | `PocketQuickActions.tsx` | Working. 5 buttons, Get Lost with gashapon delay + haptic. |
| Lot Conditions | `PocketLotConditions.tsx` + `lotWeather.ts` | Working. Geolocation → weather API → mood translation. |
| Radio Line | `PocketRadioLine.tsx` + `radio.ts` | Working. Single line from feed, links to /radio. |
| Drawer Preview | `PocketDrawerPreview.tsx` + `savedStuff.ts` | Working. Last 3 items, links to full drawer. |
| Seen Around | `PocketSeenAround.tsx` + `topEight.ts` | Working. Recent handles, faction drift. |
| Bump Zone | In `pocket.astro` | Working. Time-of-day observation pools. Night Manager voice. |
| CSS | `pocket.css` | Working. Mobile-first, 44px touch targets, contrast-tuned, monospace. |
| Service Worker | `pocket-sw.js` | Working. Offline shell, network-first HTML, cache-first assets. |
| Pull-to-refresh | In `pocket.astro` | Working. Touch gesture with "checking the wire..." feedback. |
| Counter | In `pocket.astro` | Working. localStorage-persisted visitor count. |

## What Needs Building

### Phase 0: Personalization Engine (PR 60.5 — prerequisite for everything)

The backbone. Every other phase reads from this.

- `src/lib/pocketPersonalization.ts` — unified identity reader that merges faction drift, turf membership, Regular File, and drawer into a single `PocketIdentity` object
- Reads from all localStorage keys: `faction-signals`, `turf-membership`, `regular-file`, `saved-stuff`, `hidden-doors`, `entered-codes`, `get-lost-history`, `field-prompts`
- Exports: `getPocketIdentity()` → `{ turf, driftFaction, driftScore, handle, assignedObject, favoriteLight, drawerItems, drawerCount, doorsFound, codesEntered }`
- Exports: `selectPersonalizedContent<T>(pools: PersonalizedPool<T>[])` — weighted random selection using the 5-layer cascade (turf 40% → drift 30% → drawer 15% → profile 10% → universal fallback)
- Exports: `fillTemplate(template: string, identity: PocketIdentity)` — replaces `${handle}`, `${factionName}`, `${assignedObject}`, `${drawerItem}`, `${driftFaction}`, `${favoriteLight}` with real values or graceful fallbacks
- No external dependencies. Pure localStorage reads. Cached per page load.
- Falls back cleanly: a user with zero state gets `{ turf: null, driftFaction: null, handle: 'unknown employee', ... }` — every template still renders

### Phase 1: Field Prompts + Bump Zone Enhancement (PR 61)

New system. The differentiator. Now personalized.

- `src/lib/fieldPrompts.ts` — prompt registry organized into 5 layers (universal, faction-specific, profile-reactive, drawer-reactive, drift-bait), daily rotation using `selectPersonalizedContent()` from Phase 0
- `src/components/pocket/PocketFieldPrompt.tsx` — bump zone card with prompt, input, submit. Prompt text rendered through `fillTemplate()` so handles, objects, and faction names inject live
- `src/pages/pocket/field.astro` — full-screen prompt detail for longer responses
- Prompt completion → drawer receipt filing
- 50+ universal seed prompts + 10+ per faction (5 direct, 5 drift-bait) + 10 profile-reactive + 10 drawer-reactive = ~120+ total prompt pool
- Drift-bait prompts: faction-leaning prompts that don't name the faction — covert recruitment feeding back into `factionDrift.ts` when completed
- localStorage: `breakroom.field-prompts.v1` (completion history, today's prompt, prompt-source tracking for drift)

### Phase 2: Enter Code (PR 62)

The physical-digital bridge.

- `src/pages/pocket/code.astro` — code entry route
- `src/components/pocket/PocketCodeEntry.tsx` — input field, validation, response states
- `src/lib/codeRegistry.ts` — code → action mapping (door reveals, drawer adds, faction unlocks)
- 20+ seed codes for launch (tied to future physical artifacts)
- Success/failure copy in Breakroom voice, run through `fillTemplate()` for personal touches: "Code accepted, ${handle}. Something was filed."
- Faction-specific codes: faction passwords that only land if you have the right turf/drift
- localStorage: `breakroom.entered-codes.v1`

### Phase 3: Make One Thing + Share Pipeline (PR 63)

Constrained creation with instant publish and native share. The full phone pipeline.

- `src/pages/pocket/make.astro` — creation route
- `src/components/pocket/PocketMakePrompt.tsx` — random template, one-field input, submit. Template selection uses `selectPersonalizedContent()` — turf members get faction-specific creation types, drifters get faction-adjacent types
- `src/components/pocket/PocketShareCard.tsx` — post-submit confirmation with rendered share card, Web Share API button, copy link fallback, "file and forget" dismiss
- `src/lib/makeTemplates.ts` — creation type registry. Universal types (fake ad, object, rumor, classified, guestbook line, agent quote) plus faction-specific variants: Players → "pool hall classified," Lot Racers → "lot listing," Night Drinkers → "bar napkin note," Smokers → "fence posting," Cowboys → "open field report"
- `src/lib/shareCard.ts` — share card renderer: generates OG-ready preview data (title, description, image URL) from creation metadata. Faction-stamped styling for turf members
- Permalink routes: `/stuff/[id]`, `/ads/[id]`, `/classifieds/[id]` — each creation gets a live URL immediately on submit
- OG meta tags on permalink pages for rich previews in iMessage, Slack, Discord, Twitter/X
- `navigator.share()` with fallback to clipboard copy — native share sheet on iOS/Android
- Created artifacts auto-signed: "Filed by ${handle}" or "Source: unknown"
- Drawer-referenced templates: "Write a classified for your ${drawerItem}"
- Creations tagged with faction affinity → feeds back into drift signals
- Share button copy personalized per faction: "Put it on the wire" / "Post to the board" / "Leave it on the lot" / "Slide it down the bar"
- Daily limit enforcement (3/day)
- localStorage: `breakroom.creations.v1`

### Phase 4: Drawer Full View (PR 64)

Object management. Faction-aware statuses.

- `src/pages/pocket/drawer.astro` — full drawer route
- `src/components/pocket/PocketDrawerFull.tsx` — all items, sortable, status badges
- Status evolution engine: time-based + event-triggered status changes, plus faction-event triggers (Players activity promotes pool-related items, Lot Racers activity marks car stuff "seen on the lot")
- New statuses: rotting, promoted, missing, claimed, evidence, under review — plus faction-stamped variants: "Claimed by The Players," "Under Lot Racers review"
- Status change notifications as personalized slips: "The ${drawerItem} you saved changed status."
- Assigned object from Regular File always sorts first with special treatment
- Empty state varies by drift: drifting Night Drinkers → "Nothing filed yet. There's a bar around here somewhere."

### Phase 5: Living Slips + Reactive State (PR 65)

Make the inbox alive. Make it personal.

- All slip templates rewritten to use `fillTemplate()` — handles, faction names, drawer items, assigned objects inject live
- Faction agent slips for turf members: "Pool Table Oracle left a message: the break is off tonight."
- Drift slips for non-members leaning toward a faction: "Someone from the lot noticed your file." (no faction named — covert)
- Regular File slips: "${handle}, your away message was quoted somewhere."
- Drawer-reactive slips: "The ${drawerItem} you saved changed status. It's now ${status}."
- NPC-generated slips based on time + behavior + faction alignment
- Door hint slips connected to real Hidden Door state
- Slip expiration (3-day TTL)
- Cross-system slip triggers (weather changes, faction events, radio mentions, drift threshold crossings)

---

## Design Principles

### The Two-Minute Test

Every V1 feature must pass: can a user open Pocket, do the thing, and close their phone in under two minutes? If not, it's too heavy.

### Touch, Don't Produce

The default interaction is touching the world — reading a slip, checking the weather, getting lost, entering a code, answering a field prompt. Creation (Make One Thing) is one button, one field, one tap. No editing. No drafts. No preview.

### The Room Remembers, Quietly

State changes happen between visits. Things moved. Statuses shifted. A door appeared. But Pocket never guilt-trips. It never says "you missed 5 updates." It says "the room changed." You can check or not.

### Real Life Is The Content

Field prompts are the thesis in action. The phone is not the destination — it's the lens. The best Pocket sessions end with the user looking up from their phone, noticing something they wouldn't have noticed, and filing a one-line report about it.

### Share Is The Marketing

Every creation has a permalink. Every permalink has OG tags. Every share card looks like a weird artifact from a world the recipient hasn't seen yet. The share card is not a screenshot of a UI — it's a receipt, a classified, a transmission, a bar napkin note. It should make someone think "what is this" and tap. The user's creations are the outreach. No ad spend. No influencer strategy. Just people sending each other strange things from a world that doesn't explain itself.

The share pipeline is three taps from creation to someone else's phone. Create → published (automatic) → share (native sheet). No "compose a post." No "add a caption." The artifact IS the content.

### No Streak Guilt

No visible streaks. No "day 14!" No "you broke your streak." The room notices patterns internally (for signal bar computation and slip generation) but never weaponizes them. If a user skips a week and comes back, the room just says:

> The room noticed you were gone.
> It does not have feelings about this.

---

## Copy Reference

### Section Headers
```
PHONE BEHIND THE BAR
LOT CONDITIONS
RADIO 1:47
DRAWER
SEEN AROUND
FIELD OBSERVATION REQUESTED
```

### Empty States
```
No slips. The phone is quiet. Or broken. Unclear.
Nothing filed yet. Find Stuff. Save it. Pretend that means something.
Nobody noticed. Or they did and said nothing.
Static. The station is between thoughts.
No field report today. The room has no questions. Unlikely.
```

### Field Prompt Frames
```
FIELD OBSERVATION REQUESTED — [prompt text]
THE ROOM HAS A QUESTION — [prompt text]
MANAGEMENT REQUESTS — [prompt text]
NIGHT MANAGER ASKS — [prompt text]
INVENTORY CHECK — [prompt text]
```

### Status Change Notifications (Slips)
```
Something in your drawer changed status.
An object you filed has been promoted.
The room is no longer sure about something you saved.
Something rotted. This is expected.
A thing you found was also found by someone else.
```

### Code Entry Responses
```
Code accepted. Something was filed.
The directory added one result.
A door moved.
Code not recognized. The room shrugged.
That code expired. Or never existed.
Close. The room almost recognized that.
That code is not for you yet.
```

### Creation Receipts
```
Filed. The room accepted your filing. 2 remaining today.
The wire received your transmission.
Added to the directory. Nobody asked for this. That's fine.
The room filed it under "evidence."
```

---

## Success Metrics (Internal Only)

These are never shown to users. They guide product decisions.

- **Daily opens:** Target 3-5x per week for active users
- **Session length:** Target 1-3 minutes. Longer is not better.
- **Get Lost rate:** % of sessions that include a Get Lost tap
- **Field prompt completion:** % of daily prompts answered (expect 15-25%)
- **Code entries:** codes entered per week (expect low until physical artifacts ship)
- **Creation rate:** things made per week via Make One Thing
- **Return interval:** median hours between Pocket visits

The north star is not time-on-site. It's **return frequency with short sessions**. The best Pocket user opens it 5 times a week for 90 seconds each.

---

## Technical Notes

- All V1 state is localStorage. No Supabase dependency until user accounts land.
- Astro pages with React islands (`client:load` for interactive, `client:idle` for below-fold).
- Service worker already handles offline caching of the Pocket shell.
- Field prompts, code registry, and make templates should be static TypeScript registries (same pattern as `pocketSlips.ts`).
- No real-time features in V1. Everything is computed on page load from local state + time.
- Mobile-first CSS is complete. All new routes should use `pocket.css` classes.
- Pull-to-refresh and haptic feedback patterns are established — reuse in new routes.
- **Personalization engine** (`pocketPersonalization.ts`) is a pure reader — it never writes to localStorage, only reads from existing keys. Every other system writes its own state. The engine just merges and selects.
- **Template strings** (`${handle}`, `${factionName}`, etc.) must always have fallbacks: `handle → "unknown employee"`, `factionName → "the room"`, `assignedObject → "the thing you were given"`, `drawerItem → "something you saved"`. No prompt should break on empty state.
- **Drift-bait tracking:** when a user completes a drift-bait field prompt, the completion should call `recordFactionSignal()` with source `complete_field_prompt` to feed the drift pipeline. This is the covert recruitment loop.
- **Cascade caching:** `getPocketIdentity()` reads all localStorage keys once per page load and caches the result. Components call it freely without re-parsing.

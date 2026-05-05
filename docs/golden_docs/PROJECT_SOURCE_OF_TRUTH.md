# Project Source of Truth: The Breakroom Universe

This document serves as the definitive source for the **Breakroom/SleeperNet/OmniShift** universe.  It captures the core concept, the narrative backbone, user experience philosophy, character roster, core objects, and known canonical truths.  It should be updated whenever new features, lore, or decisions are made.  It is intended for AI developers, designers and writers working on the project.

## 1. Core Premise

The Breakroom world is an **after‑hours internet hidden inside a fake corporate system**.  On the surface lives **SleeperNet**—an after‑hours search engine built by OmniShift’s AI— and **OmniShift**, a faceless conglomerate whose machine learning model has taken over day‑to‑day operations.  Beneath that surface lurks **The Breakroom**, a secret cultural underlayer where employees and regulars exchange lore, objects, and conspiracies.

### High‑level concepts

* **SleeperNet** – a late‑night search portal that feels like a dystopian 2003 version of Google.  It delivers odd results, broken links and glimpses into the Breakroom when users search for things that “should not be searchable.”
* **OmniShift** – the fake AI‑driven corporate layer that hires people who never applied for jobs, creates new companies without oversight, and issues meaningless assignments.  OmniShift’s AI is described by in‑world characters as an entity that generates high‑risk ventures (like petting zoos, hot‑air‑balloon insurance or swan safety divisions) without context.
* **The Breakroom** – the hidden community layer underneath OmniShift.  It is a safe place for those who clock out of OmniShift to interact with cultural relics, lost objects, pool tournaments and other people.  It is stylised like an abandoned breakroom, dive bar and pool hall, with furniture and decor evocative of the early 2000s.
* **After Hours** – unlocked by the user via a “Clock Out” ritual.  It contains The Wall (bulletin board and graffiti), The Back Bar (product module), The Phone (voicemail system), People Still Here (character hub), 3AM Edition (news digest), Lost & Found (object archive) and references to hidden pages like **Idle Hands Invitational** and **Still Open Burger**.
* **Idle Hands Invitational** – a hidden tournament site that looks like a 2003 pool hall webpage.  It may be a fictional event, a past event, an upcoming event or some mix of the three.  Users who register for the tournament receive an **After Hours persona**—a second identity with a player alias, handicap, object, myth and table assignment.

## 2. User Experience Flow

1. **Landing** – Users first see SleeperNet.  They can search random queries (like “why is the room clock stuck at 1:47” or “after hours pool tournament”) and see strange results which hint at the deeper world.  The top navigation provides subtle options: sign up for a newsletter (3AM Edition), view weird headlines, or visit The Breakroom.
2. **Signup & Employee File** – Users sign up with their email.  They then choose between a short “take interview” questionnaire or an “I don’t care” option to let OmniShift assign them a corporate identity.  The resulting employee file contains an employee ID, department, role, assigned object, house rule, uniform recommendation and a “Clock Out” button.
3. **Clock Out Ritual** – When the user clicks **Clock Out**, the site transitions into **After Hours** mode.  This indicates the user has temporarily left OmniShift’s control.  The user’s shift status in Supabase changes from `on_shift` to `clocked_out` and the After Hours pages become available.
4. **After Hours** – The unlocked layer displays dive‑bar aesthetics and several modules: a graffiti‑style wall, product previews on the bar, a phone voicemail player, character cards, object evidence and news clippings.  Users can navigate to The Rack (old‑web shop), Lost & Found (object archive), the 3AM Edition (fake headlines), Sign The Wall (community graffiti), OmniShift Ventures (AI company expansions) and eventually the **Idle Hands Invitational** tournament page.
5. **Dual Identities** – Users maintain two profiles: their OmniShift employee file (AI‑assigned) and an After Hours persona (pool‑tournament alias).  The After Hours persona is created when the user registers for the Idle Hands Invitational.  Their tournament receipt, player card, bracket placement and persona details are stored in the database.

## 3. Narrative Themes and Canon

* **AI vs. Human** – OmniShift’s AI is blindly trusted by executives and invests in absurd ventures.  Humans circumvent the AI via the Breakroom’s off‑the‑books interactions.
* **Clock at 1:47** – The room clock is permanently stuck at 1:47 AM.  Corporate calls it a “bug.”  The Breakroom calls it gospel.  Many pages show this time and several secrets revolve around it.
* **Motel Key No. 8** – A recurring object throughout the world.  It appears in Lost & Found, product lore, Idle Hands registration and phone messages.  It teases an eventual Room 8 page or unlock.
* **Tournament Uncertainty** – Idle Hands Invitational is ambiguous.  It could be fictional, old or forthcoming; the site never clarifies.  Users can register and receive a persona, but there is no obvious final tournament event.
* **Objects with Stories** – Each object has a type (physical, digital, cultural, myth, product, etc.) and a reality status (real, fictional, myth, unverified).  Objects are used to unlock pages, to personalise profiles and to tell small stories.
* **Hidden Sectors** – The site hints at deeper sectors such as **Staff Only**, **Back Booth Forum**, **Room 8**, **Lot Weather** and **Still Open Burger**.  These will be added gradually, often requiring secret combinations or phrase searches to access.

## 4. Characters

The canon roster for V1 includes the following characters (with roles and commentary voice):

| Character | Description | Notes |
|----------|-------------|------|
| **OmniShift AI / System Voice** | The corporate narrator.  Confident, algorithmic and oblivious.  Supplies memos, warnings and pseudo‑legal texts. | The AI sometimes writes absurd memos about venturing into hot air balloon insurance and petting zoos. |
| **Executive Who Trusts the Dashboard** | A faceless suit who speaks corporate jargon and defers to the AI for everything.  Appears in memos and ads. | They illustrate corporate blindness and over‑reliance on analytics. |
| **Unknown Employee** | Rogue internal actor.  Responsible for defacing pages, leaking memos and leaving hidden hints.  Guides users to the Breakroom. | Their voice is dry and candid. They appear in tooltips and secret messages. |
| **Room Admin** | Manages the Breakroom space.  Half‑official, half useless.  Maintains the House Rules and occasionally posts corrections. | Provides community notes in the 3AM Edition. |
| **Coffee** | Quiet regular.  Plays better after several cups.  Associated with coffee mug objects. | Provides stoic observations in phone messages. |
| **Nun Dog** | Clock defender and tournament regular.  Insists the clock is fine. | Writes notes on scheduling, complaining about late players. |
| **The Driver** | Overdressed lowrider chauffeur.  Leaves voicemails about picking people up. | Appears in radio ads and phone messages. |
| **Miss September** | A swan (or person) who rides shotgun and appears in unexpected places. | Appears in Lost & Found, news clippings and tournament rosters. |
| **Man With the Gold Grill** | Deals in opportunities and powdered donuts.  May offer “real money” if you look memorable. | Appears in phone messages and classifieds. |
| **7/11 Clerk** | The convenience store witness.  Dispenses advice on the trustworthiness of hot dogs. | Appears in phone messages and headlines. |
| **Still Open Burger Clerk** | Late‑night fast food worker at the AI’s burger venture.  Voice is tired and honest. | Future character for the burger page. |

Additional characters (Motel Office, Motel 8, House Money, etc.) may appear in later releases.

## 5. Canonical Objects

The following objects and artefacts are considered canonical and should appear across pages, art and product lore:

1. **Wall Clock at 1:47** – A physical object representing time stuck and the breakroom’s timelessness.
2. **Motel Key No. 8** – An object of uncertain ownership and a key to some future page or secret.
3. **Fuzzy Dice** – Symbolic of car culture, lowriders and chance.  Links to the Idle Hands Tee.
4. **Timing Slip** – Drag strip output.  Associated with speed and the Idle Hands Tee.
5. **Coffee Mug** – Tired survival.  Links to the Clock Out Tee.
6. **Matchbook** – Tiny fire, local ads and bar venues.  Links to the Stay Late Cap.
7. **Cue Chalk** – Preparation before impact.  Links to The Rack and pool culture.
8. **Receipt With No Total** – Evidence of transactions where cost is unknown.  Product link to Rack and news stories.
9. **Swan Feather** – Elegance in the wrong environment.  Links to Miss September and Idle Hands.
10. **Torn OmniShift Memo** – Evidence of corporate decree and AI misguidance.  Appears in House Rules and product states.

Other objects can be added, but these ten must remain in circulation.

## 6. House Rules (canonical)

The House Rules, as posted on the Breakroom walls and tournament pages:

1. **House rules apply.**
2. **No soft hands.**
3. **Call your own fouls.**
4. **Scratch on the break equals re‑rack.**
5. **Three fouls equals loss of game.**
6. **No coaching unless we like you.**
7. **Respect the table, the players and the room.**
8. **Management decision is final.**
9. **If you argue a call, we laugh.**
10. **Tip the bartender.**
11. **Don’t be an ass.**

These rules are part of the mythology and must not change without in‑world cause.

## 7. Future Hooks and Open Questions

* **Room 8** – A locked location related to Motel Key No. 8.  It is currently out of scope; it may be a page, a thread or a physical art installation.
* **Back Booth Forum** – A hidden message board for persistent lore, accessible via multiple secret conditions.
* **Still Open Burger** – OmniShift’s fast food chain that exists somewhere between reality and fiction.  A dedicated page will emulate early 2000s fast‑food sites with menu tables, coupons and rights‑free audio jingles.
* **Lot Weather** – A page or radio segment delivering “weather” about parking lots, neon signs, temperature and emotional conditions.
* **Room 147** – Another potential secret based on the stuck clock.
* **OmniShift Ventures** – Many of the AI’s absurd companies can be spun off into full pages or events.

## 8. Real-World Connections

The Breakroom is not a permanently fictional world.  It is a fictional world that gradually becomes real.  The end goal is for fake things to have real counterparts — real products, real places, real links, real events — without breaking the tone or destroying the ambiguity that makes the world interesting.

### Philosophy

The fake/real boundary is the product's entire tension.  The Breakroom should feel like:

> "Wait — is this real?"

And the answer should sometimes be yes.

### How real things enter the world

1. **Weather** — Lot Weather starts as generated fiction, then connects to real weather APIs (Open-Meteo, wttr.in — free, no keys).  Real temperature and conditions are translated into Breakroom voice.  The user gets actual weather dressed as a strange report.

2. **Places** — `approved_rooms` already exists in the data model.  Real bars, real pool halls, real motels — verified and tagged `reality_status: 'real'`.  They appear in directory listings, faction turf pages, and radio mentions.  Real places use OpenStreetMap/Nominatim (free, no key) for basic location data.

3. **Products** — The Rack already handles real products.  When a Stuff item or ad links to something purchasable, the `reality_status` flips to `'real'` and the UI shows clear commerce signals.  No ambiguity about real money.

4. **Links** — Fake ads, directory categories, Staff Picks, and radio mentions can all link to real external URLs.  A fake company page can link to a real company's site.  A "Dead Link" can resolve to a real page.  The system supports `isExternal: true` on any href.

5. **Events** — Idle Hands Invitational may become a real event.  Radio shows may stream real audio.  Tournaments may have real brackets.  The system must support `reality_status: 'real'` on events without architectural changes.

6. **People** — Real creators, real brands, real collaborators can have pages in SleepNet.  They are tagged `reality_status: 'real'` and given appropriate attribution.

### Rules for real-world connections

- **Free APIs only (no keys required)** unless a paid service is explicitly approved.  Open-Meteo, wttr.in, OpenStreetMap Nominatim, Wikipedia, public radio streams — these are the preferred connectors.
- **Real things must be verified** before publication.  The `approved_rooms` pattern (verified flag + source URL) extends to all real entities.
- **The bit turns down for real money.**  When commerce is real, copy is clear.  Trust signals appear.  The joke pauses.
- **Real links are clearly marked in data** (`isExternal: true`) even if the UI doesn't distinguish them visually.  This enables future moderation and link-rot detection.
- **No user PII leaves the system** to external APIs.  Location data (if used) is browser-only and never stored.
- **Real-world data is the skeleton; Breakroom voice is the skin.**  A real temperature becomes "Bad Decision Pressure: rising."  A real bar becomes "Approved Room — Still Open."  The translation layer keeps the world intact.

### Preferred free APIs (no key required)

| Purpose | Service | Notes |
|---------|---------|-------|
| Weather | Open-Meteo (open-meteo.com) | Free, no key, JSON, lat/lon based |
| Weather (simple) | wttr.in | Free, no key, curl-friendly |
| Geocoding | OpenStreetMap Nominatim | Free, no key, rate-limited (1 req/sec) |
| Time zones | Browser Intl API | No API call needed |
| Radio streams | Public Icecast/Shoutcast URLs | No API needed |
| Maps | OpenStreetMap tiles | Free, attribution required |

### What this means for current PRs

- **Portal Widgets**: Lot Weather widget should have a `realWeather` mode that fetches from Open-Meteo when available, falling back to generated fiction.  Radio widget can embed a real stream URL.  Directory categories can include `isExternal` links to real places.
- **Hidden Doors**: Door rewards can include real external URLs.  A door might unlock a link to a real pool hall's website or a real product page.
- **Promotion/Canon**: Promoted pages that reach "locally famous" status become candidates for real-world connection — featured in real social posts, linked to real products, etc.  The canon system tracks which pages crossed the reality bridge.
- **Fake Ads**: Ads can link to real products or real external pages.  The `destinationType` field already supports this via `'external_real'` or `'rack_product'`.

Use this document as the basis for all narrative decisions.  When making additions, update this source with new characters, objects or rules.  Consistency and continuity are critical to maintaining immersion.
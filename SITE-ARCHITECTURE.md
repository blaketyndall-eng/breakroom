# The Breakroom — Site Architecture Map

## DRAFT — May 2026

This document maps the two-world structure of The Breakroom and defines where every page lives, what moves, what merges, and what dies.

---

## The Two Worlds

### OMNISHIFT (The Corporate Shell)
The daytime internet. Polished, monitored, bureaucratic. OmniShift is the fake corporation. SleepNet is their approved search engine. Everything here is audited, canned, controlled. This is the world you clock INTO.

**Visual identity:** SharePoint 2001 / IBM 2001 / Oracle Portal 2002. Corporate blues, tab navigation, portlets.
**CSS prefix:** `os-*`
**Section attr:** `data-section="omnishift"` (portal), `data-section="sleepnet"` (search)
**Account name:** OmniShift Employee File

### VOID SIGNAL (The Underground Network)
The real internet. The signal that persists after OmniShift signs off. This is where users actually live — profiles, messaging, page creation, crews, objects, guestbooks, events, radio, phone. Dive bar meets Cartoon Network meets MySpace meets Craigslist. Different sections feel like different corners.

**Slang:** "the Void," "VS," "the Signal"
**Visual identity:** TBD — needs its own design language. MySpace 2004 / Adult Swim / late-night Cartoon Network / lo-fi underground. Dark, warm, neon-adjacent but not cyberpunk.
**CSS prefix:** `vs-*`
**Section attr:** `data-section="voidsignal"` (main), plus sub-sections
**Account name:** Regular File

---

## User Journey

```
FIRST VISIT:
  Landing page → OmniShift Employee Intake (signup)
  → Employee Quiz/Interview → Employee File issued
  → Portal shows corporate world + small leaks to Void Signal
  → User finds their way to Void Signal

RETURNING USER (desktop):
  Lands in Void Signal (home)
  → Can navigate to OmniShift/SleepNet from nav
  → Full access to both worlds

RETURNING USER (mobile / Pocket Mode):
  Lands in Void Signal (Pocket Mode)
  → Optimized for After Hours experience
  → OmniShift accessible but not primary
```

---

## Page Map: OMNISHIFT SIDE

### `/` — Landing / Entry Point
**Current:** SleepNet Google-style search homepage (index.astro)
**Proposed:** Keep as the entry point, but frame it as the OmniShift-branded gateway. The first thing you see is corporate — then you clock out.
**Section:** `sleepnet`

### `/portal` — OmniShift Employee Portal
**Current:** SharePoint-style corporate intranet with employee file, policy notices, announcements
**Proposed:** Keep. This is the corporate dashboard. The "Google Account" hub.
**Contains links to:**
- Employee File (inline)
- Employee Quiz/Interview (new — `/portal/interview`)
- Ventures (`/ventures`)
- Issued Goods / The Rack (`/rack`)
- Company News / Newsstand (`/newsstand`)
- SleepNet Search (`/sleepnet`)
- Clock Out (`/clock-out`)
**Section:** `omnishift`

### `/portal/interview` — Employee Quiz (NEW)
**Current:** Does not exist
**Proposed:** New page. The "intake interview" — a weird corporate personality quiz that determines your employee assignment, department, object, house rule. Replaces the auto-generation that currently happens silently in EmployeePortal.tsx.
**Section:** `omnishift`

### `/signup` — Employee Intake
**Current:** Sign-up form
**Proposed:** Keep. This is OmniShift onboarding. After signup → interview → portal.
**Section:** `omnishift`

### `/sleepnet` — SleepNet Portal (Search + Directory)
**Current:** Full portal with search, directory categories, site of the night, weather, radio widget, ads
**Proposed:** Keep. This is the corporate-approved search engine. Only shows OmniShift-approved sites. Canned, curated, monitored. Small leaks/easter eggs hint at Void Signal.
**Section:** `sleepnet`

### `/sleepnet/create` — Create SleepNet Page
**Current:** Page creator for SleepNet sites
**Proposed:** Keep but clarify — these are the "approved" sites that live on the corporate search engine. Void Signal has its own page creation.
**Section:** `sleepnet`

### `/sleepnet/[slug]` — Individual SleepNet Sites
**Current:** Dynamic site viewer
**Proposed:** Keep.
**Section:** `sleepnet`

### `/ventures` — OmniShift Ventures
**Current:** AI-generated corporate ventures table
**Proposed:** Keep under OmniShift. Ventures appear in OmniShift Portal ("Our Companies"), searchable in SleepNet, written up in SleepNews as business articles, and as ads across both SleepNet and SleepNews.
**Parody layer:** Each venture (e.g. Very Good Burger) also has a Void Signal parody site — user/AI-created pages that satirize, review, expose, or riff on the corporate venture. Corporate press release up top, bathroom wall graffiti underneath.
**Section:** `omnishift`

### `/newsstand` — SleepNews (Company News)
**Current:** ABC News '97 / BBC / Fox News styled news portal (formerly "3AM Edition")
**Brand:** SleepNews — OmniShift's official media arm. Part of the SleepNet ecosystem (SleepNet = search, SleepNews = media). Fox News overlord energy.
**Sections:** Front Page, Business (venture announcements), Classifieds (Lost & Found merge), Corrections, Notices
**Venture coverage:** Corporate press releases, quarterly reports, acquisition announcements
**Section:** `newsstand`
**Sub-pages:** `/newsstand/[slug]` (individual articles)
**Contains:** Lost & Found as classifieds/object reports section within SleepNews

### `/rack` — The Rack
**Current:** Official goods shell — where fake goods become real commerce
**Proposed:** Keep under OmniShift. The corporate-approved merchandise. "Issued Goods" in portal language.
**Section:** `omnishift` or own section
**Sub-pages:** `/rack/[slug]`

### `/clock-out` — Clock Out
**Current:** Clock out request page
**Proposed:** Keep. This is the transition point — you clock out of OmniShift and enter Void Signal. The doorway between worlds.
**Section:** `omnishift`

---

## Page Map: VOID SIGNAL SIDE

### `/void` — Void Signal Home (NEW)
**Current:** Does not exist (currently `/after-hours` serves this role poorly)
**Build:** The main Void Signal landing page. The real homepage for returning users. MySpace homepage meets underground portal — profile summary, recent activity, radio status, phone notifications, crew activity, events. Different from the corporate SleepNet portal in every way.
**Section:** `voidsignal`
**Route:** `/void`

### `/profile` or `/locker` — Your Regular File (Profile Hub)
**Current:** `/locker` — combines Regular File editor, Saved Stuff drawer, Faction Drift, Top 8, Seen Around
**Proposed:** Rename/rebrand as the Void Signal profile. This is YOUR page — the MySpace profile, the identity layer. Contains:
- Regular File editor (identity)
- Saved Stuff / Drawer (your objects)
- Top 8 (your people)
- Faction Drift / Turf signals
- Seen Around (where you've been)
- Crew memberships
- Guestbook (people who visited your profile)
- Page links (sites you've made)
**Section:** `voidsignal`

### `/regulars/[handle]` — Public Profile View
**Current:** Public-facing profile page
**Proposed:** Keep. This is how other people see your Regular File. The public MySpace page.
**Section:** `voidsignal`

### `/idle-hands` — Idle Hands Invitational
**Current:** Pool tournament page with brackets, registration, player bios
**Proposed:** Keep as its own section within Void Signal. This is the pool hall — a corner of the underground internet. Has its own vibe (old pool tournament website energy).
**Section:** `voidsignal` sub-section (or own section `idlehands`)
**Sub-pages:** `/idle-hands/player/[slug]`

### `/phone` — Phone Behind The Bar
**Current:** Voicemails, calls, messages, DoorDash orders
**Proposed:** Move fully into Void Signal. This IS the Void Signal messaging system. The phone behind the bar is how you get messages, NPC interactions, notifications. Could evolve into the primary notification/messaging hub.
**Section:** `voidsignal`

### `/radio` — Radio 1:47
**Current:** Broadcasting, station IDs, music, lot weather, fake ads
**Proposed:** Keep in Void Signal. The broadcast layer. Radio 1:47 is the Void Signal's broadcast network — the signal you tune into.
**Section:** `voidsignal`

### `/sign-the-wall` — Guestbook / Bathroom Wall
**Current:** Sign the wall — wood-paneled bathroom wall with markers
**Proposed:** Keep in Void Signal. This is a core social feature — the guestbook, the graffiti wall. Could be both a global wall AND per-profile guestbooks.
**Section:** `voidsignal`

### `/stuff` — Stuff Shelf
**Current:** Objects, fake products, printable artifacts, denied merch
**Proposed:** Keep in Void Signal. Stuff is the object gallery — what populates fake stores, product sheets, profile decorations. Users add Stuff to their profile/drawer. Stuff is the INVENTORY of the underground economy.
**Section:** `voidsignal`
**Sub-pages:** `/stuff/[slug]`
**Cross-reference:** Objects from Lost & Found (Newsstand) can appear as Stuff. Stuff populates fake stores in SleepNet ventures.

### `/artifacts` — Evidence Drawer
**Current:** Badges, receipts, station IDs, marker slips
**Proposed:** Merge INTO the profile/locker. Artifacts are things the room gives you — they belong in your Regular File, not a separate page. Could still have a dedicated view but it's a sub-section of your profile.
**Section:** `voidsignal`

### `/factions` — Turf / Factions
**Current:** Official faction directory with faction pages
**Proposed:** Keep in Void Signal. Factions are social identity — The Players, Lot Racers, Night Drinkers, The Smokers, Cowboys.
**Section:** `voidsignal`
**Sub-pages:** `/factions/[slug]`

### `/crews` — Crews
**Current:** User-created groups directory
**Proposed:** Keep in Void Signal. Crews are user-made organizations — the clubs, teams, gangs of the underground.
**Section:** `voidsignal`
**Sub-pages:** `/crews/[slug]`

### `/districts` — District Directory
**Current:** World geography / directory zones
**Proposed:** Keep in Void Signal. Districts are the geography of the underground internet — the neighborhoods of the Void.
**Section:** `voidsignal`
**Sub-pages:** `/districts/[slug]`

### `/events` — Events
**Current:** Fake/maybe-real happenings
**Proposed:** Keep in Void Signal.
**Section:** `voidsignal`
**Sub-pages:** `/events/[slug]`

---

## Page Map: SHARED / UTILITY

### `/pocket` — Pocket Mode (Mobile)
**Current:** Mobile-optimized view with signal bar, phone slips, lot conditions, radio, quick actions
**Proposed:** Keep. This is the mobile Void Signal experience. All After Hours, all the time.
**Section:** `voidsignal` (pocket variant)

### `/back-office` — SleepNet Owner Dashboard
**Current:** Manage your SleepNet pages
**Proposed:** Keep but clarify — this manages your CORPORATE side pages (SleepNet sites). Void Signal page creation is separate.
**Section:** `sleepnet`

### `/wire-room` — Admin/Ops
**Current:** Staff-only admin dashboard
**Proposed:** Keep. Meta/admin layer. Not part of either world — it's behind both.
**Section:** `admin`

### `/house-rules` — House Rules
**Current:** Simple list of pool hall rules
**Proposed:** Keep in Void Signal. These are the rules of the underground, not corporate policy.
**Section:** `voidsignal`

### `/dead-link-cemetery` — Dead Link Cemetery
**Current:** Archive of dead links
**Proposed:** Could live in either world. Thematically it's a SleepNet/directory feature (dead links from the search engine) but with Void Signal energy.
**Section:** TBD

### `/ledger` — World Ledger
**Current:** Public ledger view
**Proposed:** Keep as shared utility — the ledger records everything across both worlds.
**Section:** Neutral

### `/404` — Not Found
**Current:** Custom 404
**Proposed:** Keep. Should be in-world.
**Section:** Neutral

---

## Pages to REMOVE

### `/sleeper-net` — Old SleeperNet Mirror
**Status:** Dead weight from earlier version. Uses old `BaseLayout`, references `SleeperNet` (old spelling).
**Action:** DELETE. All SleepNet functionality lives at `/sleepnet`.

### `/after-hours` — Old After Hours Page
**Status:** Will be replaced by Void Signal home (`/void` or similar). Content can be harvested for the new VS landing page.
**Action:** REPLACE with Void Signal home once built.

### `/portal/after-hours-profile` — After Hours Profile
**Status:** Will be replaced by the Void Signal profile page. Currently orphaned under `/portal` which is the wrong world.
**Action:** REPLACE — profile lives at `/profile` or `/locker` in Void Signal.

---

## Pages to MERGE

### `/lost-found` → INTO `/newsstand`
Lost & Found becomes a section of Newsstand — the classified/reports section of the corporate news conglomerate. Objects reported missing, found, or filed. Newsstand already has news article energy; Lost & Found reports fit as a subsection.

### `/artifacts` → INTO `/profile` (or `/locker`)
Artifacts/evidence drawer becomes a tab or section of your Regular File. They're personal — they belong with your identity, not as a standalone page.

---

## Resolved Decisions

### 1. Void Signal URL
**Answer:** `/void` is the Void Signal home. Returning users land here. Mobile users start here. OmniShift/SleepNet accessible from nav but VS is the primary world.

### 2. Page Creation Rules
**SleepNet pages** = AI-generated and admin-generated ONLY. These are the corporate-approved, monitored, canned sites. The walled garden.
**Void Signal pages** = User-created + AI-generated + admin-created. The open internet. GeoCities energy. The world unlocked.

### 3. Void Signal Search / Discovery
Multiple coexisting methods — NOT one clean search engine:
- **Janky search bar** — works, sort of, finds things it wants you to find
- **District browsing** — explore by neighborhood/zone
- **Phone / Radio discovery** — things surface through the phone and radio broadcasts
- **Word of mouth** — guestbooks, crews, Seen Around, social signals
- **Recommendations** — "More Like This, Unfortunately"
- **Hidden Doors** — secret unlocks that reveal new content

### 4. Cross-World Discovery (The Breakroom as Omega Mart Fridge Door)
**The Breakroom page (`/breakroom`)** is the lobby between worlds — the Omega Mart fridge door moment. It sits in the OmniShift portal nav but looks boring (employee break room, who cares). When you visit:
- Office drama, rumors, vague signs
- Bulletin board with "clock out" hints everywhere
- The more you read, the more it points you toward clocking out
- Clock Out links are hidden everywhere across OmniShift/SleepNet too — not just in The Breakroom

**Action:** KILL the current `/breakroom` page entirely. Redesign as the transitional lobby — the moment between corporate and underground. The fridge door you open and find a whole world behind it.

### 5. User Journey (Refined)

```
FIRST VISIT:
  Landing page (SleepNet search, corporate-branded)
  → Sign Up (OmniShift Employee Intake)
  → Employee Quiz/Interview (personality, assignment, house rule)
  → OmniShift Portal (corporate dashboard)
  → Portal nav includes "The Breakroom" (looks boring)
  → The Breakroom page = office drama, rumors, clock out hints
  → User finds Clock Out
  → Clock Out → lands in Void Signal (/void)
  → "Wait, there's a whole world here?"

RETURNING USER (desktop):
  Lands in Void Signal (/void)
  → Full access to both worlds from nav
  → OmniShift/SleepNet accessible but not primary

RETURNING USER (mobile / Pocket Mode):
  Lands in Void Signal (Pocket Mode)
  → All After Hours, all the time
  → OmniShift accessible but secondary
```

---

## Resolved: SleepNews Brand

The Newsstand IS SleepNews — OmniShift's official media arm. Naming hierarchy:
- **OmniShift Media Holdings** (parent — Fox Corp equivalent)
- **SleepNews** (flagship newspaper — Fox News equivalent)
- Sub-brands possible later: radio news desk, business wire, local section

SleepNews covers:
- **Front Page** — world events, OmniShift announcements, room events
- **Business** — venture announcements, quarterly reports, acquisitions
- **Classifieds** — Lost & Found merge lives here (object reports, missing items filed like classified ads, police blotter energy: "Item reported missing from counter. Item denies being missing.")
- **Corrections** — retractions that make things worse
- **Notices** — corporate legal notices nobody reads

The name creates a coherent ecosystem: SleepNet (search), SleepNews (media). Same corporate branding consistency that makes real conglomerates feel oppressive.

---

## Resolved: Ventures in Both Worlds

Ventures exist simultaneously in BOTH worlds with completely different energy:

**OmniShift side** (Portal + SleepNet + SleepNews):
- Ventures appear as corporate entities in Portal ("Our Companies")
- Searchable in SleepNet as approved sites
- Written up in SleepNews as business articles, quarterly reports, expansion announcements
- Very Good Burger has a polished corporate SleepNet page (admin-generated, press-release energy)

**Void Signal side** (Parody sites, user-generated):
- Users and AI create parody/commentary pages of OmniShift ventures
- Very Good Burger gets a Void Signal page: Yelp review nightmare, employee confession wall, "what's actually in the burger" conspiracy page
- Not officially sanctioned — underground commentary on the corporate world above
- Corporate press release up top, bathroom wall graffiti underneath

Same entity, two completely different presentations. This is the core creative tension.

---

## Resolved: Two-Desktop Concept (Navigation + Visual Identity)

The site wraps in a DESKTOP ENVIRONMENT that changes based on Clock In/Out state. Not just a nav bar — the entire page chrome transforms.

### OmniShift Desktop (Clocked In)
The site looks and feels like a **Windows 2000/XP corporate work computer**.

**Elements:**
- **Taskbar** (top or bottom): grey `#d4d0c8`, beveled borders, Start button labeled "OmniShift"
- **Clock** in system tray: always reads 1:47 (or actual time, glitching to 1:47)
- **Notification area**: small icons — SleepNet, Employee File, network status
- **Windows-style title bars** on content sections: blue gradient `#0054e3`→`#0544a0`, white text, minimize/maximize/close buttons (non-functional or weird)
- **Dialog boxes** for notifications: "Reminder" popups — "Shift 3 begins. Participation is monitored."
- **Loading animation** on page load: Windows booting energy

The whole OmniShift experience = using a work computer. SleepNet is Internet Explorer with a different skin. Portal is the corporate intranet. Every page has the grey-blue institutional wrapper.

### Void Signal Desktop (Clocked Out)
The page chrome changes completely. Now it looks like **YOUR computer** — customized at 2AM.

**Elements:**
- **No taskbar** — or a completely reskinned one (warm/dark, personal)
- **Clock** says whatever it wants: 1:47, "???", "late", or disappears
- **Content sections** lose Windows title bars — each page has its own energy (guestbook = handwritten, crews = GeoCities fan club, phone = Nokia screen)
- **Background** shifts from corporate grey/blue to darker, warmer (cloud-background anime homepage energy, deep dark green)
- **Custom cursors** possible — old personal homepage culture
- **Visitor counter** in footer instead of corporate copyright

### The Toggle (Clock In / Clock Out)
- **On OmniShift (clocked in):** "Clock Out" option in the taskbar/Start menu. Could be a desktop shortcut icon, hidden behind a dialog.
- **Transition:** Screen flickers/goes dark → corporate chrome dissolves → Void Signal chrome loads → message: "Shift ended. Nobody noticed."
- **Clock In (from VS):** Warm world hardens back into grey corporate chrome → "Welcome back. Your absence was logged."

### Leaks (While Clocked In)
The OmniShift desktop has subtle visual glitches that hint at Void Signal:
- Green text flickers amber for a frame
- `SHIFT 3` briefly reads `SHIFT ███` or `SIGNAL DETECTED`
- Clock sticks at `1:47` before correcting
- "CLOCK OUT →" text pulses slightly on some page loads

Not links — visual noise that makes you WANT to clock out.

### Anonymous Visitors (No Account)
No account bar/taskbar. They see the site cold — just OldHeader bookmarks and content. The desktop chrome is a reward for creating an account. First appearance after signup:
```
[SHIFT ASSIGNED] · Employee File Created · Welcome to the company. Or whatever this is. · [CLOCK OUT →]
```

### Visual References (Pinterest: ghosttowngoods/brkrm)
The full board maps to the two desktops:
- **OmniShift pool:** Windows 98/XP dialogs, Regional Settings, login screens, Apple Store (beige Power Macs), BET.com portal, PBS logo, "10PM Do You Know Where Your Children Are?" bumpers, CD Player app — institutions, broadcast, infrastructure
- **Void Signal pool:** Anime homepages with cloud backgrounds, VampireFreaks profiles, "About Me!!" pages, Neat Stuff Menu, rainbow Welcome pages, Neopets, The Sims community sites, kawaii pixel art — people making weird things on the internet

---

## Open Questions (Remaining)

1. **Lost & Found framing detail:** "Classifieds" section is confirmed — but specific visual treatment within SleepNews (separate tab? column? page section?) TBD.

2. **Desktop implementation phasing:** Do we build the full two-desktop system first, or start with just the account bar (time-clock strip) and evolve toward full desktop transformation? Recommended: start with account bar, layer desktop chrome incrementally.

3. **Void Signal sub-section visual variety:** Each VS section (phone, radio, idle hands, crews, factions) should feel like a different corner of the internet. How much visual divergence per section vs. shared VS chrome?

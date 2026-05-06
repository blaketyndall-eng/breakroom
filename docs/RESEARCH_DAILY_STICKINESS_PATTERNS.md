# Research: Daily Stickiness Patterns from Entertainment & Old Tech

How other things make people come back without making them feel bad about it.

---

## 1. Tamagotchi — The Care Creature (1996)

**What it does:** A small device that requires brief check-ins (~once an hour). Feed it, play with it, clean it. Takes 30 seconds. Creates emotional attachment to a tiny digital thing.

**Why it works:**
- **Variable interval needs** — the creature doesn't need you on a schedule. It needs you at irregular intervals. This is "variable ratio reinforcement" — the same psychology as slot machines, but ethical because you're caring for something rather than gambling.
- **Moral dimension** — ignoring a Tamagotchi isn't just missing entertainment; it's failing a dependent creature. This creates stronger behavioral reinforcement than fun alone.
- **Tiny emotional rewards** — when care needs are met, the creature shows happiness animations. Small dopamine delivery. Not an achievement badge. A creature responding.
- **Real-time persistence** — the world keeps going whether you're watching or not.

**What The Breakroom should steal:**
- The room exists whether you check or not. Things happen. Objects move. Status changes.
- The feeling is "checking on something alive" not "opening an app."
- Pocket slips should arrive at **irregular intervals** — not a daily digest at 9am.
- When you do something (save an object, sign a wall), the response should be **tiny and alive** — "The room filed it." Not "Success! Item saved."
- **No guilt.** Tamagotchi's biggest flaw was death/guilt. The Breakroom should say "The room changed. You can check it or not." Never "You missed 14 updates."

**Specific enhancement to PR 60:**
- `PocketSignalBar` should feel like checking a pet's mood indicator — "signal: 2 bars / emotionally unstable" is already perfect.
- Drawer items should have status arcs that feel like watching a small creature evolve: "filed" → "noticed" → "connected" (PR 64).
- Slip arrival timing should use a pseudo-random schedule seeded by user activity, not clock time.

---

## 2. Animal Crossing — The 15-Minute Island (2001–present)

**What it does:** A life sim designed for 15-minute daily sessions. Check on villagers, pick fruit, dig fossils, water flowers. The world runs on real-time — seasons change, villagers move, events happen on calendar dates.

**Why it works:**
- **Short manageable sessions** — designed for brief daily visits, not marathon play.
- **Emotional investment in neighbors** — if you don't visit, a villager might leave. That's personal.
- **Completion checklists without pressure** — museum collections, flower breeding, furniture catalogs. You can complete them or ignore them.
- **Calendar-driven events** — fishing tournaments, holidays, seasonal changes give reasons to return on specific days.
- **The world moved** — you open the game and things are different. A new neighbor arrived. A weed grew. A fossil appeared.

**What The Breakroom should steal:**
- The "world moved while you were gone" feeling is the strongest daily hook.
- World Ticks (PR 65) should be **the first thing you see** on Pocket open — not buried below widgets.
- Objects in the Drawer should have the same emotional weight as Animal Crossing villagers — you form attachment through small daily observations.
- **No marathon required.** If it takes more than 5 minutes to "complete" a daily visit, it's too much.
- **Calendar hooks** — certain events, transmissions, or door hints should be date-specific. Not holidays. Weird dates. "Every 8th of the month, the clock shows something different."

**Specific enhancement to PR 65:**
- World Ticks should include "neighbor-equivalent" changes: an NPC said something new, a faction made a move, a page got promoted. Make it feel like checking on a community, not reading a changelog.
- Add date-seeded special content: certain radio transmissions only appear on specific dates. Not announced. Discoverable.

---

## 3. Adult Swim Bumps — The Authorial Voice Between Things (2001–present)

**What it does:** Black cards with white text appear between shows. They comment on current events, crack jokes, talk directly to the audience, share staff opinions, or say something absurd. They ARE the identity of the network — more than any single show.

**Why it works:**
- **The voice feels like a person** — not a brand. A tired, funny, weird person who's up at 2am with you.
- **Between-things content** — bumps exist in the gaps. They make transitions feel inhabited.
- **Low effort, high character** — black background, white text. No animation. No production value. Pure voice.
- **Community feeling** — "like a community message board" and "cable access." The bumps make viewers feel like they're part of a late-night club.
- **The curator is invested** — the voice positions itself as someone who cares about what you're watching, not just selling it.

**What The Breakroom should steal:**
- **Radio 1:47 IS the bump system.** Daily transmissions are the voice between things. They should feel like Adult Swim bumps — short, direct, funny, alive, speaking to you at 2am.
- NPC comments throughout the site are bumps. They exist in the margins. They comment. They notice.
- **The Pocket home screen text is a bump.** "signal: 2 bars / emotionally unstable" is bump writing. Every piece of status text should be this.
- Agent Ask (PR 61) responses should feel like bump writing — one line, deadpan, weirdly personal.
- **Black card aesthetic** for certain Pocket moments — just text on dark background. No UI chrome. Pure voice.

**Specific enhancement to PR 60-61:**
- Add a "bump zone" to Pocket — a single rotating text line at the top that changes daily. Not a notification. A comment. From the room. About nothing in particular.
- Format: dark background, monospace text, no chrome. The Night Manager's daily observation.
- Example: "Management denies the smell. Staff confirms the smell. The dashboard shows no smell."

---

## 4. Wordle — The Shared Daily Puzzle (2021)

**What it does:** One word puzzle per day. Same word for everyone. Takes 3 minutes. You either solve it or you don't. Then you share your result as a grid of colored squares.

**Why it works:**
- **Scarcity** — one per day. Can't binge. Each puzzle feels special.
- **Universal experience** — everyone gets the same puzzle. Creates conversation.
- **3-minute commitment** — you know exactly how much time it takes.
- **Sharable result** — the colored grid is a social object. You don't share the answer. You share your performance pattern.
- **No punishment** — fail today? Tomorrow is a fresh puzzle.
- **Anticipation builds** — the word updates once a day. Between puzzles, you're just... waiting. That waiting creates desire.

**What The Breakroom should steal:**
- **Daily Radio 1:47 is the Wordle equivalent** — same transmission for everyone, once per day. You read it, maybe share it. Done.
- **Share Cards (PR 63) should be as simple as Wordle's grid** — a visual social object that conveys something without explaining everything.
- **One "daily thing" per system** — one radio line, one lot condition, one world tick summary. Not a feed. A single artifact.
- **Universal experience matters** — all users should see the same daily radio line. This creates "did you see today's transmission?" conversations.
- **Fresh start daily** — no rolling notifications. Each day the Pocket resets. What's here is today's room.

**Specific enhancement to PR 63:**
- Daily Radio transmission should be truly universal — same for all users, deterministic by date.
- Share Cards for radio lines should work like Wordle grids — compact, visual, shareable without context.
- Add a "today" concept to Pocket — the page should feel different each day, not like a static dashboard.

---

## 5. Neko Atsume — The Surprise Visit Collector (2014)

**What it does:** You place food and toys in a virtual yard, close the app, and when you return, cats have visited. Different cats have different preferences. Rare cats require specific items. You photograph them.

**Why it works:**
- **Progress only happens when you're gone** — cats never visit while you're watching. You must leave and return.
- **The surprise of who showed up** — opening the app is like checking a trap. What did you catch?
- **Collection without pressure** — there's a catalog of all cats. You're filling it. No timer. No deadline.
- **Setup → away → reward** — the loop is: arrange things, leave, come back, see what happened.
- **Gifts left behind** — cats leave small presents (fish currency). The visit itself is the reward, but there's also a tangible trace.

**What The Breakroom should steal:**
- **Drawer items should gain status while you're away.** Like cats visiting — you set something up (save an object), leave, come back, and something happened to it. "1 item moved." "1 item is not for you yet."
- **The surprise-on-return mechanic is crucial.** Pocket should always have at least one thing that changed since your last visit. Even if it's small.
- **Hidden Doors should partially work like rare cats** — you set conditions (save certain objects, visit certain pages) and doors open while you're away. Check back. See if a door moved.
- **No watching = no progress.** Some things should only change between visits. Never show a live ticker or real-time update. The room changes when you're not looking.

**Specific enhancement to PR 64-65:**
- Drawer Status transitions should ONLY happen between visits. Never animate in real-time. You leave, you return, the status changed.
- Hidden Door unlocks from object combinations should resolve asynchronously — save the objects, come back later, "A door moved."
- World Ticks only generate on page load, computed against last-visit timestamp. Never stream in.

---

## 6. ARGs — The Breadcrumb Trail (2001–present)

**What they do:** Alternate Reality Games distribute clues across real websites, phone numbers, physical locations, and social media. Players collaborate to solve puzzles. The story unfolds gradually across days/weeks.

**Key examples:**
- **I Love Bees (2004)** — GPS coordinates pointed to real payphones. At scheduled times, they rang with story fragments. Players physically went to phones.
- **Marble Hornets** — cryptic response videos from an anonymous account. You had to find them.
- **lonelygirl15** — blurred the line between fiction and reality so completely that discovering "it's fake" was itself part of the experience.

**Why it works:**
- **Distributed clues create obsessive checking** — the next breadcrumb could appear anywhere.
- **Real-world bleed** — when fiction touches real objects/places, the mystery deepens exponentially.
- **Collaborative discovery** — finding something hidden feels like an accomplishment. Sharing the find creates community.
- **The rabbit hole is the reward** — there's no prize at the end. The hunt IS the experience.
- **Ambiguity is fuel** — is this real? Is this part of the game? The uncertainty keeps you engaged.

**What The Breakroom should steal:**
- **Code Entry (PR 61) is the ARG mechanic made daily.** Codes appear in real-world contexts (Instagram, stickers, screenshots). Users learn to look.
- **Hidden Doors are breadcrumbs.** They should occasionally point to each other — one door's reward hints at another door's trigger.
- **Real-world bleed is already in the project DNA** (Lot Weather uses real weather, approved_rooms will be real bars). Lean into this harder in Pocket.
- **"Is this real?" should be a frequent feeling.** The radio transmission mentions a real event. A code from a real flyer works. A door leads to a real website.
- **Collaborative discovery** — when a user finds a code or door, the World Ledger could note it anonymously: "Someone found a door." Others wonder which one.

**Specific enhancement to PR 61:**
- Code Entry should show a "codes found by the room" counter — not who, just how many. Creates FOMO-without-guilt: "47 codes found. You've found 3."
- Some codes should only work on certain dates (ARG-style time-gating).
- Add "breadcrumb chains" — entering one code gives a clue to the next code's location.

---

## 7. GTA Eyefind — The Fake Internet That Feels Real (2008–present)

**What it does:** 83 fully-designed fake websites inside GTA V. Parody search engines, classified sites, dating apps, fast food chains, corporate pages. Each one is detailed enough to explore.

**Why it works:**
- **Every site feels authored** — someone wrote fake copy for a fake company. That effort creates believability.
- **The search engine works** — you can search for things and get results. The fake internet has depth.
- **Satire makes it engaging** — the humor rewards exploration. Each site has jokes buried in it.
- **Interconnection** — sites reference each other. Ads on one site link to another. The fake internet has an ecosystem.
- **Discovery is voluntary** — you don't have to explore the internet. It's there if you want it. This makes finding things feel like your choice.

**What The Breakroom should steal:**
- **SleepNet already IS Eyefind.** But it should lean harder into the "every page references other pages" interconnection.
- **Fake Ads should link to other pages in the world** — already typed for this (`destinationType`). Make every ad a portal to somewhere else.
- **The search engine should reward exploration** — searching strange phrases should give strange results. Some results should be one-time-only or time-gated.
- **Effort = believability.** The more detailed each fake page is, the more the world feels inhabited.

**Specific enhancement to PR 60:**
- Pocket's "Get Lost" should feel like clicking random links in GTA's internet — you never know where you'll end up, and wherever it is feels complete.
- Each Get Lost destination should have interconnections — a link or reference to somewhere else. Never dead-end.

---

## 8. Omega Mart / Meow Wolf — Hidden Rooms Behind Products (2021)

**What it does:** A fake grocery store where products on shelves are art pieces. Behind certain shelves and refrigerator doors are portals to other worlds. 60+ rooms. A mystery narrative runs through interactive displays.

**Why it works:**
- **The mundane hides the extraordinary** — it looks like a grocery store. Then a fridge door leads to a cave.
- **Physical exploration as puzzle** — you have to look at everything. Touch things. Pull things. Open things.
- **The discoveries feel endless** — every surface hides a possibility.
- **Layered experience** — casual visitors see a weird store. Committed explorers find the full narrative.
- **Products as world-building** — fake products (exotic meats, interdimensional mayonnaise) ARE the content.

**What The Breakroom should steal:**
- **Stuff items should feel like Omega Mart products** — weird objects that are funny on the surface but connect to deeper lore underneath.
- **Hidden Doors should be Omega Mart's refrigerator portals** — mundane page elements that reveal other worlds when clicked/triggered.
- **Layered depth** — casual users see a weird search engine. Committed explorers find the whole universe underneath.
- **Every product/object is world-building.** Nothing is just decoration.

**Specific enhancement to PR 62:**
- "Make One Thing" objects should have a hidden Omega Mart quality — the user names an object, and the system gives it unexpected properties or connections. "You made: Bad Advice Jar. Status: The room is watching this one."

---

## 9. Old Web Portals (My Yahoo, iGoogle) — The Personal Dashboard (1996–2013)

**What they did:** Customizable home pages with widget zones — weather, email count, news headlines, stock tickers, horoscopes, bookmarks. You arranged them yourself. You opened this page every morning.

**Why they worked:**
- **Personalized daily glance** — everything you needed in one view.
- **Customization = ownership** — you built your page. It was yours.
- **Widget-based** — each zone was independent. Weather didn't need to know about stocks.
- **20 million monthly users (iGoogle)** — people loved having a personal starting point.
- **Themes boosted engagement** — visual customization encouraged frequent returns.

**What The Breakroom should steal:**
- **Pocket IS a portal page.** It has widget zones (Phone, Weather, Radio, Drawer, Quick Actions). This is the right structure.
- **But don't let users customize the layout** — that turns it into a productivity tool. The Breakroom picks what you see. The room decides.
- **The portal should feel like "my weird homepage" not "my dashboard."**
- **Glanceability is key** — all widget zones should be readable in 2 seconds. No scrolling required for the core information.

**Specific enhancement to PR 60:**
- Design Pocket as a single-viewport experience at mobile width. Everything visible without scroll on a standard phone. If it requires scrolling, it's too much.
- The "signal bar" at the top IS the My Yahoo weather widget equivalent — your daily glance at world state.

---

## 10. Pagers / Beepers — The Anticipation Device (1990s)

**What they did:** Receive short numeric or text messages. One-way communication. You check it, you see a number or code. Then you go find a phone to call back. The beep is the ritual.

**Why they worked:**
- **The beep = anticipation** — you don't know what the message is until you look.
- **Brevity forced creativity** — 143 = "I love you." Numeric codes became language.
- **No expectation of instant response** — unlike texting, a page meant "when you get a chance." Patience built in.
- **Status symbol** — having a pager meant you were connected. Being paged meant you were wanted.
- **Check ritual** — pull from pocket, glance at screen, decide whether to respond.

**What The Breakroom should steal:**
- **Phone Behind The Bar IS the pager.** Short messages. Codes. You check when you want.
- **Pocket slips should feel like pager messages** — brief, slightly cryptic, requiring interpretation.
- **No expectation of response** — slips don't demand action. You can ignore them.
- **The check-glance-decide loop** — pull out phone, open Pocket, glance at slips, decide what to explore.
- **Codes as language** — pager culture invented numeric shorthand. The Breakroom should have its own code language that develops over time.

**Specific enhancement to PR 60-61:**
- Phone slips should be **pager-brief** — one line, maybe a code. "VGB called. Left a number. Number isn't a phone number."
- Code Entry codes should feel like pager codes — alphanumeric, short, meaningful to insiders.
- Slip count display should feel like a pager screen — just a number. "3 slips." Not a description.

---

## 11. Desert Golfing — The Endless Unpressured Thing (2014)

**What it does:** Infinite procedurally generated golf holes. No score tracking (just a stroke counter that never resets). No levels. No completion. No leaderboards. No pause screen. You flick the ball. It goes in the hole. Next hole. Forever.

**Why it works:**
- **No pressure to perform** — no leaderboard comparing you to others.
- **No completion possible** — you can never "finish." This removes the stress of falling behind.
- **Meditative repetition** — the same simple action, slightly different each time.
- **Environmental storytelling** — subtle color palette shifts hint at time passing. No announcement.
- **Zero UI** — nothing between you and the action. No menus. No settings. No chrome.

**What The Breakroom should steal:**
- **"Get Lost" is Desert Golfing** — one click, one strange place, then another. No goal. No completion.
- **The counter that never resets** — "3 things filed. 47 pages visited. 2 doors found." Not achievements. Just a quiet count of your existence in the world.
- **No completion state.** There is no "100% Breakroom." The world is endless.
- **Subtle environmental shifts** — time of day, season, or weather should shift the visual palette of Pocket. Not announced. Just different.
- **Zero chrome between you and the world** — Pocket's quick actions should be immediate. Tap Get Lost → you're somewhere. No interstitial. No loading screen.

**Specific enhancement to PR 60-61:**
- Get Lost should NOT have a loading interstitial. Instant transport. Desert Golfing never pauses between holes.
- Add a quiet running counter somewhere in Pocket: "visited: 23 rooms." No fanfare. Just exists.
- Pocket's background color should shift based on real time of day (use browser time). Subtle. Never announced.

---

## 12. Jukebox — The Communal Selection Ritual (1940s–present)

**What it does:** A coin-operated machine in a bar. You choose a song. Everyone hears it. Your selection shapes the room's mood. The ritual is: approach, browse, select, wait for your turn, hear your song play for everyone.

**Why it works:**
- **Democratic curation** — your choice affects everyone. This is power without authority.
- **The ritual of selection** — browsing the catalog IS the experience. Not just hearing the song.
- **Shared atmosphere** — a jukebox makes individuals into a temporary community. Everyone is hearing the same thing.
- **The quarter is commitment** — it costs something (even symbolic). This makes the choice feel weighty.
- **Anticipation between selection and play** — you choose, then wait for your song to come up. That gap is pleasurable.

**What The Breakroom should steal:**
- **Radio 1:47 requests are jukebox selections** — you submit something, it enters a queue, eventually it "plays" (appears in the radio log). The gap between submission and appearance is the anticipation.
- **"Promote" is a quarter in the jukebox** — promoting a page is making a choice that affects what others see. Democratic curation.
- **Make One Thing → filing it = putting a quarter in.** Your creation enters the room. Others might encounter it.
- **The catalog browse IS the experience** — Get Lost, browsing Stuff, reading the directory. The wandering is the point.

**Specific enhancement to PR 62-63:**
- Radio requests should have a visible queue or "coming up" indicator. You submitted → it's pending → it aired. The wait is part of it.
- Promote actions should say "You put this in front of the room." Not "Promoted!" The language of choosing a jukebox song.
- Micro-creations should have a "filed → pending → noticed by the room" progression. Like waiting for your song to play.

---

## 13. Gashapon / Capsule Machines — The Random Reward Ritual (1960s–present)

**What they do:** Insert a coin, turn a crank, receive a random capsule containing one of a set of collectibles. You can't choose which one you get. Collecting the full set requires repeated pulls.

**Why they work:**
- **Physical ritual** — the coin, the crank, the clunk of the capsule. Tactile satisfaction.
- **Random reward** — you don't know what you'll get. This is inherently exciting.
- **Set completion** — there are N items in the set. You want them all. But you can't choose.
- **Trading** — duplicates create social interaction. "I have two of the blue one, want to trade?"
- **Low stakes** — each pull costs ~$1-3. It's cheap enough to be impulse-driven.

**What The Breakroom should steal:**
- **Get Lost IS a capsule machine** — one click, random destination. You don't choose. The room chooses for you.
- **Code Entry is the coin slot** — you input a code (insert quarter), you get a random-ish reward.
- **Stuff collection has gashapon energy** — you find objects in the world, you can't control which ones appear, you're building a set.
- **The crank feeling** — there should be a tiny moment of anticipation between action and result. Tap → brief pause → reveal. Not instant. Not long. The capsule dropping.
- **Trading potential (future)** — duplicate objects could eventually be tradeable between users.

**Specific enhancement to PR 61:**
- Get Lost should have a ~500ms "cranking" moment — a brief text flash ("Finding somewhere...") before the destination reveals. Like the capsule dropping.
- Code Entry should have a similar micro-ritual: type code → brief pause → result reveals. The crank.
- Consider a "daily capsule" — one random object/page/fact delivered per day. Like a gashapon you get for showing up. No streak. Just: "today's capsule."

---

## 14. GeoCities / Neocities — The Personal Page (1994–present)

**What they did:** Free web hosting where anyone could make a page. No templates (or very ugly templates). Pure creative expression. GIFs, colored backgrounds, midi music, visitor counters, guestbooks. Organized into "neighborhoods."

**Why they worked:**
- **Zero gatekeeping** — anyone could make anything. No approval. No algorithm.
- **Neighborhoods** — sites were organized geographically (SunsetStrip, WallStreet, Area51). Browsing a neighborhood = discovering peers.
- **Visitor counters** — the simplest possible social proof. "You are visitor #847."
- **Guestbooks** — the lowest-friction social interaction. Sign and leave.
- **Personal expression without rules** — "people put whatever they wanted on a webpage because it was their space."
- **The vernacular web** — a grassroots folk art style. Celebrated precisely because it wasn't professional.

**What The Breakroom should steal:**
- **SleepNet neighborhoods = Districts.** Browsing a district should feel like browsing a GeoCities neighborhood.
- **Visitor counters on pages** — already conceptually present. Make them visible. "Seen by 12 people. Most of them suspicious."
- **Guestbooks are THE low-friction social layer** — already in the plan. They should be as easy as GeoCities guestbooks: name (optional), message, submit. Done.
- **No gatekeeping on creation** — Make One Thing (PR 62) should have zero approval friction. You make it. It exists. Maybe the room notices later.
- **The vernacular aesthetic** — user-created content should look amateur, personal, weird. Not polished.

**Specific enhancement to PR 62:**
- Micro-creations should immediately "exist" — no review queue for the creator's own view. Others might see them later (Wire Room review for public visibility), but for the creator, it's instant.
- Add a simple visitor counter concept to user-created things: "Seen by: 0. Filed by: you." This ticks up over time.

---

## Synthesis: The 7 Principles for Breakroom Daily Stickiness

From all of the above, the universal patterns are:

### 1. THE WORLD MOVES WITHOUT YOU (Animal Crossing, Tamagotchi, Neko Atsume)
Things happen between visits. You return to discover what changed. This is the fundamental hook. Everything else supports this.

**Implementation:** World Ticks (PR 65) + Drawer Status (PR 64) + Pocket Slips (PR 60). These MUST be the first thing visible on Pocket open.

### 2. ONE THING PER DAY IS ENOUGH (Wordle, Desert Golfing, Adult Swim)
Don't overwhelm. One radio line. One weather report. One world tick summary. One action. Leave. The daily experience should take under 3 minutes.

**Implementation:** Daily Radio (PR 63) + "Today's" framing on all Pocket widgets. Everything is singular, not plural.

### 3. THE RANDOM REWARD (Gashapon, Neko Atsume, Get Lost)
Insert action → receive unpredictable result. The unpredictability is the pleasure. Keep it cheap (low effort) and frequent (available anytime).

**Implementation:** Get Lost (PR 61) + Code Entry (PR 61) + Daily Capsule concept. Always available, never the same twice.

### 4. THE COMMUNITY JUKEBOX (Jukebox, Wordle, Adult Swim)
Your action affects what others experience. This creates communal ownership without requiring direct interaction.

**Implementation:** Promote system + Radio requests (PR 63) + Micro-creations entering the world (PR 62). "You put something in front of the room."

### 5. THE BREADCRUMB TRAIL (ARGs, Omega Mart, Hidden Doors)
Clues that point to other clues. Discoveries that hint at further discoveries. The rabbit hole never ends.

**Implementation:** Hidden Door chains + Code breadcrumbs (PR 61) + interconnected Fake Ads + SleepNet search Easter eggs. Every answer should contain a new question.

### 6. ZERO GUILT, ZERO PRESSURE (Desert Golfing, Neko Atsume, Pagers)
No streaks. No completion percentage. No "you missed X." The room exists. You can visit or not. It's fine either way.

**Implementation:** Language discipline across ALL PRs. Never "notifications." Never "you have X waiting." Always "the room changed" or "X slips filed." The difference is framing: the room's state vs. your obligation.

### 7. THE PERSONAL PORTAL THAT ISN'T A DASHBOARD (My Yahoo, GeoCities, Pagers)
A place that's yours, that you glance at daily, that reflects your existence in the world — but is NOT a productivity tool, NOT a metrics dashboard, NOT a to-do list.

**Implementation:** Pocket design (PR 60). One viewport. Glanceable. Personal (your drawer, your factions, your counter). Never "optimize" language. Never "insights." Just: what's here. What changed. What you can do in 30 seconds.

---

## Enhancements to Add to PR Batch 60-65

Based on this research, these specific additions should be integrated:

### PR 60 additions:
- [ ] **Bump zone** — single rotating daily text line at top. Night Manager's observation. Black card style.
- [ ] **Time-of-day palette shift** — Pocket background hue shifts with browser time. Subtle. Unannounced.
- [ ] **Single-viewport design** — core Pocket visible without scrolling on 375px screen.
- [ ] **Running counter** — "visited: 23 / filed: 7 / doors: 2" — quiet existence proof. Not gamified.
- [ ] **Slip timing** — pseudo-random intervals, not clock-based. Seeded by user activity patterns.

### PR 61 additions:
- [ ] **Gashapon micro-delay** — 500ms "cranking" pause on Get Lost + Code Entry before result.
- [ ] **Zero interstitial on Get Lost** — after the brief crank, instant transport. No loading page.
- [ ] **Code breadcrumb chains** — entering one code hints at the next code's location.
- [ ] **Codes found counter** — "47 codes found by the room. You: 3." Anonymous community progress.
- [ ] **Date-gated codes** — some codes only work on certain days (ARG-style).

### PR 62 additions:
- [ ] **Instant existence** — micro-creations exist immediately for the creator. No approval queue for personal view.
- [ ] **"Seen by" counter** — starts at 0, ticks up over time as the world encounters it.
- [ ] **System-generated personality** — when you name an object, the system gives it an unexpected trait or status note.
- [ ] **Filing → pending → noticed** — jukebox-style progression. Your creation enters the queue of the world.

### PR 63 additions:
- [ ] **Universal daily radio** — same line for all users on a given day. Wordle-style shared experience.
- [ ] **Radio queue visibility** — submitted requests show "pending → aired" progression.
- [ ] **Compact share cards** — Wordle-grid-simple. Visual without explanation. Receipt/memo/evidence format.
- [ ] **"Today" framing** — Pocket should feel different each day. Not a static dashboard.

### PR 64 additions:
- [ ] **Status changes only between visits** — Neko Atsume rule. Never animate in real-time. You leave, you return, something changed.
- [ ] **Asynchronous door unlocks** — save objects, come back later, door moved. Not instant.
- [ ] **Item "personalities"** — drawer items gain quirky one-line status notes over time, like watching a creature develop.

### PR 65 additions:
- [ ] **"The room changed" as first-visible element** — not buried. THE thing you see on open.
- [ ] **NPC movement in ticks** — "The Night Manager said something." "The 7/11 Clerk left a note." Villager energy.
- [ ] **Date-specific content** — certain ticks/radio/doors only on specific calendar dates. Discoverable, not announced.
- [ ] **Daily capsule** — one random object/page/fact per day. No streak. Just: "today's thing."

---

## The Anti-Patterns (What All These Things Avoid)

Every example above succeeds by NOT doing these:

| Anti-Pattern | Why It Kills Return | Breakroom Rule |
|---|---|---|
| Streaks | Creates guilt → resentment → quit | Never track consecutive visits |
| Notifications | Trains users to ignore → eventually uninstall | No push. No badges. "The room changed" on open only. |
| Completion % | Creates "I'm behind" feeling | No total. Just quiet counters. |
| Leaderboards | Makes most users feel like losers | No rankings. "Known around here" is max. |
| Daily quests | Turns play into obligation | No tasks. Only possibilities. |
| "Come back tomorrow" | Explicitly creates FOMO | The room is always there. It doesn't ask you to return. |
| Tutorial/onboarding | Breaks immersion + assumes user is stupid | No tutorial. Just world. Figure it out. |
| Progress bars | Creates urgency where none should exist | No progress. Just accumulation. |

---

## Final Design Principle

The Breakroom's daily stickiness should feel like:

**A pager from a weird world that you check because you're curious, not because you're obligated.**

It should NOT feel like:
- A game you're behind in
- An app you forgot to open
- A feed you need to scroll
- A notification you need to clear
- A streak you need to maintain

The room is open. Things happened. You can look or not.

That's it.

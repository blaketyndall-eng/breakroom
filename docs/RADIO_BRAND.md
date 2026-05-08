# Breakroom Radio — Brand Bible v1

Status: **LOCKED 2026-05-08.** Visual redesign of `/radio` reads from `src/content/data/radioBrand.ts`, which mirrors this doc. Update both together.

---

## Station identity

**Name on air:** *Breakroom Radio* (also said as *Channel 1:47*, also said as *KLOT*, also said as *the station*)

**Callsign(s):** **KLOT-147** is the most-used. Sometimes **WBRK**, sometimes **K147**, sometimes **KOTL**. The host decides. Nobody enforces. The drift is the joke. Not a real FCC pattern.

**Dial position:** *147 megacycles*. This isn't a real frequency. AM is 535–1605 kHz, FM is 88–108 MHz, and there is no commercial 147 anything. The station is broadcasting somewhere the receiver isn't looking for it. Shortwave hobbyists log it occasionally and don't trust their notes.

**Slogans:**

> Broadcasting from somewhere behind the bar.
>
> Unlicensed but undisputed.
>
> If the lot weather changes, we'll say so.
>
> Dead air is approved.

**License status:** None. Several cease-and-desist letters from the FCC, all read on air as bedtime stories. The most recent compliance memo from OmniShift said *"your station does not exist according to our records — please cease broadcasting"* — read on air, station did not stop.

---

## Origin

The station has been broadcasting at 1:47 AM since before the building was the Breakroom. The transmitter is described as "behind the bar." The console is in a room nobody can quite locate. Most shows are pre-taped. Some aren't. Nobody on staff can reliably tell which.

When OmniShift acquired SleepNet, the radio came with it — accidentally, attached to the deal as a footnote. OmniShift has never figured out how to monetize a station that broadcasts one hour a night to people who weren't supposed to be listening. So they leave it alone. Once a quarter they send a compliance memo. The station reads the memo on air. Then continues unchanged.

There is a legal pad behind the console with the name of every person who has ever called in. Nobody updates it. Nobody removes anyone. The list just gets longer.

---

## The signal

**Broadcast hours:** 1:47 AM to "sunrise." Sunrise is not defined. Used to sign off at 5:30, has been creeping later. Currently signing off around 6:00. The reason has not been disclosed.

**Audience:** The station does not measure audience. Listeners are presumed to be one of three things: driving, smoking outside, or trying not to fall asleep on the back booth. Nobody listens during the day. Nobody is supposed to.

**Programming policy (one line):**

> If the lot weather changes, we say so. If the phone rings, we put it on the wire. If you call in, you become evidence.

---

## The hosts (rotating)

Each is an existing NPC in the world, except where noted.

**The Driver** — *Lot Weather (1:47).* Knows what the asphalt feels like, what the moths are doing, where the wind is coming from. Reads weather like it's a guilty plea. Never says it's nice out, even when it is.

**Room Admin** — *Phone Behind The Bar (2:13).* Plays voicemails left at the bar that week. Refuses to interpret them. Will say "filed" after each.

**System Voice** — *OmniShift Compliance Hour (3:00).* Reads OmniShift compliance memos in monotone. Has been doing this for years. Has read the same memo three times in the same hour and not noticed.

**Coffee** — *Back Booth Mix (4:11).* Plays whatever was on the cassette in the back booth that week. Sometimes it's music. Sometimes it's a guy talking about timing belts.

**Pool Oracle** — *Faction Beef Hour (4:47).* Adjudicates faction disputes between The Players, Lot Racers, Night Drinkers, Smokers, and Cowboys. Always rules: *settle it on the table.*

**Anonymous** — *Truckers' Open Line (5:30).* Different host every night. Sometimes the same host announcing themselves differently. Has occasionally been The Driver pretending to be someone else.

**Phil Behind The Bar** *(new NPC)* — *Sign-off / Static Until 1:47 (6:00).* Doesn't usually say anything. Plays a shortwave-style tone test for forty seconds and then static.

**Night Manager** — Does occasional station IDs between shows. Reads FCC cease-and-desist letters as bedtime stories. Will, without warning, do a 30-second monologue about a person he met in 1996.

---

## Current storyline (the active arc, rolling)

Things in the world the station is currently dealing with — slow background plot, not breaking news. Broadcast can reference them in passing without explaining them.

1. **Carl's hoodies.** A caller named *Carl* has been calling in every night for three months asking if anyone has seen his hoodies. The free-hoodies popup is the radio noticing him.
2. **The asphalt is sticky.** Lot weather has been "off" for two weeks. The Driver has noticed. He has stopped saying it's normal.
3. **The sign-off is creeping.** Used to be 5:30. Now 6:00. The reason has not been disclosed.
4. **The Cowboys are calling but the line keeps dropping.** A new faction is trying to get on Faction Beef Hour. The phone won't connect. Pool Oracle has not commented.
5. **OmniShift says we don't exist.** This quarter's compliance memo. Station read it on air. Did not stop.
6. **Channel 1:47 has been showing up on receivers it isn't supposed to.** Listeners are submitting evidence to the request line that they've heard the station at 4 PM in the afternoon, on devices that were unplugged. The station does not address this on air.

These plot threads do not resolve. They drift. New ones replace old ones. The story is the drift, not the resolution.

---

## The schedule (one full broadcast cycle, 1:47 to sign-off)

| TIME | SHOW                          | HOST                  | NOTE                                       |
|------|-------------------------------|-----------------------|--------------------------------------------|
| 1:47 | Lot Weather                   | The Driver            | Cold open. No theme music. Just begins.    |
| 2:13 | Phone Behind The Bar          | Room Admin            | Voicemails. No interpretation.             |
| 3:00 | OmniShift Compliance Hour     | System Voice          | Required. Probably.                        |
| 4:11 | Back Booth Mix                | Coffee                | Whatever was on the cassette.              |
| 4:47 | Faction Beef Hour             | Pool Oracle           | Disputes. *Settle it on the table.*        |
| 5:30 | Truckers' Open Line           | Anonymous             | Different host every night.                |
| 6:00 | Sign-off / Static Until 1:47  | Phil Behind The Bar   | Tone test, then static for 19h47m.         |

*Schedule subject to faction interruption.*

---

## Bumpers / station IDs (the loops)

These play between shows, on a tape that's been wearing out for years.

> You're listening to Breakroom Radio. Channel 1:47. Broadcasting from somewhere behind the bar.

> If the lot weather changes, we'll say so.

> The station does not take requests. It takes evidence.

> Compliance has been notified. Compliance is not listening.

> Tonight's broadcast is brought to you by nobody. We have no sponsors. We have no advertisers. We have a coffee pot.

> We are unlicensed but undisputed.

> If you can hear this, that's already a problem.

> The phone behind the bar is open. Don't call. Some people will anyway.

---

## Connection to the rest of the world (the radio's edges)

- **Phone Behind The Bar (`/phone`)** — voicemails left at the bar feed directly into Phone Behind The Bar at 2:13 AM. What's in `/phone` becomes the show.
- **Districts (`/districts`)** — Pool Hall County submits dispute reports. Motel Row submits noise complaints. Parking Lot West submits the lot weather raw feed.
- **Factions (`/factions`)** — Faction Beef Hour resolves (or refuses to resolve) disputes. The Players and Lot Racers historically called in the most.
- **Newsstand / 3AM Edition (`/newsstand`)** — radio reports get re-reported the next morning, badly. *"WBRK reportedly aired"* is the standard hedge.
- **Lost & Found (`/lost-found`)** — objects found in the lot get added to the Lot Weather report.
- **Idle Hands (`/idle-hands`)** — the Bracket Break (sports segment, embedded in Faction Beef Hour) reports table disputes from the tournament.
- **The Rack (`/rack`)** — the only "sponsor" the station has. Bumpers occasionally end with: *"If you've enjoyed this broadcast, look in the Rack."*
- **OmniShift (`/portal`)** — quarterly compliance memos. System Voice reads them. Station ignores them.

---

## Things to NOT explain (deliberate)

- Where the transmitter physically is
- Why 1:47 AM specifically
- Whether shows are live or pre-taped
- What the Night Manager does during the day
- Why the sign-off is creeping later
- How the station's signal reaches devices that are unplugged

---

## Visual register (locked direction for redesign)

**Option A — Coast-to-Coast AM / Art Bell era + WinAmp 2.x.** Midnight blue page (`#0a1628`), cigarette-amber serif type for headlines (`#f5d135`), lime-green LED readouts (`#33ff66`) for the player chrome, blinking red on-air dot (`#ff3a3a`). CSS prefix `r147-*`. The station chrome should feel like a 1999 late-night talk-radio website that takes lot weather as seriously as Coast-to-Coast took shadow people.

Reference websites:
- Coast-to-Coast AM (Art Bell era, 1999–2002)
- Phil Hendrie Show, early 2000s
- WinAmp 2.x player skin
- Late-night AM physical studios (dim green lights, neon ON AIR sign, paper schedules taped to wall)

---

## Update protocol

- **Hosts and schedule are stable.** Don't change them without confirming the world-coherence implications first (each host appears in other surfaces).
- **The arc rotates.** Update `CURRENT_ARC` in the data file independently of the rest. Old arcs can be archived in this doc as historical context if useful.
- **Bumpers can be added.** Try not to subtract — they're cheap detail and the marquee benefits from a longer pool.
- **The deliberate non-explanations are not bugs.** Don't add explanations to satisfy completeness.

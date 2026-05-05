# Agents

Agents are how The Breakroom starts talking back without becoming a normal chatbot.

## Product idea

```txt
Factions = where the room notices you standing
Agents = how the room talks back
SleepNet components = where agent comments appear
```

Agents should feel like recurring voices inside the world: clerks, managers, oracles, phones, weather reports, witnesses, and people who should not have access to the page.

## Agent levels

```txt
Level 0: Flavor Agent
Level 1: Page Agent
Level 2: Profile Agent
Level 3: World Agent
Level 4: Host Agent
```

Current implementation covers Level 0 and early Level 1.

## Files

```txt
src/content/data/agents.ts
src/lib/agents.ts
src/lib/sleepnetGenerators.ts
src/components/sleepnet/SleepNetComponentRenderer.astro
src/styles/sleepnet.css
```

## Seed agents

```txt
Night Manager
Pool Table Oracle
7/11 Clerk
Random Friend
Room Admin
Directory Clerk
The Phone Behind The Bar
Weather Voice
Unknown Employee
```

## Current behavior

```txt
- Agents are static seed data
- SleepNet generators choose agent comments by site type, related_agent_slug, and faction affinity
- character_comment components render richer agent metadata
- Generated pages receive one relevant agent comment
- Agent comments are deterministic and context-aware enough for V1
```

## Site type routing

```txt
faux_company -> Night Manager / Directory Clerk / Unknown Employee
personal_homepage -> Random Friend / Phone Behind The Bar
classified_board -> Directory Clerk / 7/11 Clerk / Random Friend
faction_turf -> faction-associated agents
fake_restaurant -> 7/11 Clerk / Night Manager
object_archive -> Room Admin / Pool Table Oracle
```

## Contradiction rule

Agents may contradict each other if contradiction creates humor, discovery, unlocks, or faction tension.

Agents must not contradict:

```txt
user ownership
privacy
payment state
authentication state
persistence state
```

The world can lie. The product cannot.

## Current limitations

```txt
- No live AI calls yet
- No persistent agent memory yet
- No agent conversation UI yet
- No per-user profile-aware comments yet
- No world-state-aware comments yet
- No moderation system for user-authored agent prompts yet
```

## Product truth

Agents should not act like assistants yet.

They should act like evidence: a note, a warning, a rumor, a bad witness, a phone ringing under the counter.

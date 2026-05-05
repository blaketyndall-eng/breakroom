# Factions

Factions are the turf, crew, and social texture layer for The Breakroom.

## Product idea

```txt
Regular File = user identity
SleepNet Page = user-created weird website
Faction = the room noticing where the user stood
```

Factions should not feel like fantasy guilds. They should feel like local crews, teams, clubs, lineages, bar tribes, doorway rumors, and people who all keep standing under the same bad light.

## Routes

```txt
/factions
/factions/[slug]
```

## Files

```txt
src/content/data/factions.ts
src/lib/factions.ts
src/components/factions/FactionCard.astro
src/components/factions/FactionPage.astro
src/pages/factions/index.astro
src/pages/factions/[slug].astro
src/styles/factions.css
```

## Active factions

```txt
The Players
Lot Racers
Night Drinkers
The Smokers
Cowboys
```

## Rumored factions

```txt
Arcade Kids
Hippies
House Money
Soft Hands
Red Ropes
Golfers
```

## Faction data model

```txt
slug
name
shortName
status
motto
description
turf
colors
symbols
objects
preferredSiteTypes
rivals
allies
agents
productStyle
joinLanguage
noticedLanguage
warning
```

## Faction signal utility

Local-first faction drift signals are stored at:

```txt
breakroom.faction-signals.v1
```

Supported signal sources:

```txt
clicked_faction_page
created_faction_turf_page
saved_related_object
generated_related_site_type
clicked_related_sleepnet_site
```

## SleepNet hooks

Faction pages link into:

```txt
/sleepnet/create?type=faction_turf&faction=[slug]
```

The SleepNet creator can stage a faction turf page with:

```txt
faction_affinity
related_object_slugs
related_agent_slug
faction turf copy
faction turf neighborhood
```

## Current limitations

```txt
- Factions are static seed data only
- Faction signals are localStorage only
- No Supabase user_faction_signals table yet
- No faction membership state yet
- No real join flow yet
- Faction logos are placeholder/type-driven only
```

## Product truth

Factions make The Breakroom feel inhabited.

They should create style, rivalry, object logic, page logic, future product logic, and little moments of being noticed without forcing a normal social network structure.

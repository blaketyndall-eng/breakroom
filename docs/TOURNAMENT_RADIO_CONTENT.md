# Tournament + Radio Content Truth

This doc tracks the current Idle Hands and Radio 1:47 content seed layer.

## Live Supabase migration

Applied to live project:

```txt
Project: the-breakroom
Project ref: bfinjvvtornltgytsvai
Migration: seed_tournament_radio_content
Repo file: supabase/migrations/0007_seed_tournament_radio_content.sql
```

## Radio logs seeded

```txt
Channel 1:47 Station ID
The Lot Weather Report
Applause Money Market Minute
Idle Hands Bracket Break
Water Burger Night Window Ad
Motel Sainthood Legal Notice
```

## Tournament / radio news items seeded

```txt
NUN DOG VS TIME STILL ONGOING
MUGSY LATE AGAIN, TABLE CHANGED WITHOUT HIM
RADIO 1:47 HEARD INSIDE VENDING MACHINE
MISS SEPTEMBER DECLINES INTERVIEW THROUGH FEATHER
TABLE FOUR DENIES LEANING DESPITE TESTIMONY
```

## Phone messages seeded

```txt
Nun Dog
Mugsy Late Again
The Driver
Miss September
Channel 1:47 Request Line
```

## Secret hooks seeded

```txt
nun-dog-vs-time
radio-vending-machine
table-four-lean
miss-september-feather-statement
```

## Why this migration uses existing tables

The live Supabase project currently has the simpler V1 table set:

```txt
radio_logs
news_items
phone_messages
secrets
tournaments
tournament_registrations
after_hours_profiles
```

It does not yet have dedicated `tournament_players`, `radio_shows`, or `radio_episodes` tables. This pass intentionally uses existing tables to deepen the world without changing schema.

## Next schema work, later

When needed, add dedicated tables:

```txt
tournament_players
radio_shows
radio_episodes
radio_requests
```

Do that in a separate schema migration branch so the app and generated Supabase types can be updated carefully.

## Product truth

Idle Hands and Radio 1:47 should feel connected.

The radio reports on the tournament, the phone receives tournament messages, Newsstand misreports both, and secrets use all three as unlock surfaces.

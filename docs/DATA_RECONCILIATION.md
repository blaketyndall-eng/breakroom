# Data Reconciliation Notes

This pass compares Claude design content against the live static data and Supabase seed data.

## Source files

```txt
design/claude/html/data.js
src/content/data/breakroom.ts
supabase/migrations/0003_seed_v1_content.sql
supabase/migrations/0005_seed_claude_reconciled_content.sql
supabase/migrations/0006_seed_deeper_breakroom_world_objects.sql
docs/OBJECT_AND_LORE_BANK.md
```

## Current finding

`src/content/data/breakroom.ts` already carries most of the Claude data pool for frontend fallback/search behavior.

The bigger gap was live Supabase seed coverage. The live database had core V1 content, but not all of the richer Claude motifs from the design file or the newer Breakroom object language.

## Added in migration 0005

Products:

```txt
Stay Late Cap
Night Shift Hoodie
```

Lost objects:

```txt
Wall Clock Stuck At 1:47
Matchbook From The Wrong Coat
Receipt With No Total
Coffee Mug Chipped And Active
Hotline Poster With Unreadable Numbers
```

News items:

```txt
EMPLOYEE DENIES APPLYING FOR JOB, ACCEPTS ROLE ANYWAY
LOWRIDER REPORTED BREATHING NEAR VACANCY SIGN
COFFEE FRESHNESS COULD NOT BE VERIFIED
CORRECTION: APPLAUSE MONEY IS NOT TAXABLE
CORRECTION: THE ROOM IS NOT LISTENING TO YOU SPECIFICALLY
PUBLIC ADVISED TO STOP THANKING THE ROOM
UPDATED HOUSE RULES NOW AVAILABLE IN WEARABLE FORMAT
TIMING SLIP DISCOVERED INSIDE MOTEL BIBLE
```

Phone messages:

```txt
OmniShift HR unclear/active voicemail
The Driver hoodie voicemail
Miss September silence/feather voicemail
7/11 Clerk hot dog warning
Room Manager stop thanking room voicemail
Night Shift performance review voicemail
Kid With The Mop voicemail
```

Ventures:

```txt
OmniShift Idle Company
Lot Weather
Applause Recovery
```

Secrets:

```txt
do-not-trust-hot-dogs
applause-money
motel-key-clock
```

## Added in migration 0006

Migration `0006_seed_deeper_breakroom_world_objects.sql` deepens the object language beyond direct Claude parity and into the fuller Breakroom style system.

Lost objects:

```txt
Rosary With Broken Clasp
Cracked Nokia With Voicemail Light
Pawn Ticket From Amber Case
Single Boxing Glove Hung Like A Relic
Saint Card From Cash Drawer
Motel Lamp Pull Chain
Title Belt With Takeout Grease
White Dog Hair Under Glass Counter
Lowrider Air Freshener Shaped Like A Crown
Printer-Friendly Prayer Card
Vending Machine Quarter From 1979
Fur Coat Claim Check
```

News/world items:

```txt
PAWN SHOP WINDOW DECLARED TEMPORARY CHAPEL
FINANCE DENIES KNOWLEDGE OF HOT AIR BALLOON INSURANCE DIVISION
BAR MIRROR RETURNS DIFFERENT MAN THAN ONE PROVIDED
POOL TABLE HOLDS PRIVATE SERVICE FOR MISSING EIGHT BALL
MOTEL OFFICE ACCUSED OF SELLING SAINTHOOD BY THE HOUR
DELIVERY DRIVER REFUSES TO ENTER AFTER HOURS, LEAVES FOOD WITH CLOCK
AI ANNOUNCES BYOB PETTING ZOO STILL UNDER SPIRITUAL REVIEW
CASH DRAWER FOUND PRAYING UNDER AMBER LIGHT
```

Phone messages:

```txt
Unknown Woman At The Counter
Pawnshop Owner
Motel Front Desk
Breathing Under Counter
OmniShift AI
Water Burger Night Window
Radio 1:47 Station ID
```

Ventures:

```txt
OmniShift Motel Sainthood Program
Vertical Liability Group
Water Burger Night Window
Glass Counter Custody
Applause Money Clearinghouse
```

Secrets:

```txt
rosary-nokia-counter
title-belt-takeout
white-dog-under-glass
motel-lamp-room-147
printer-prayer-sleepernet
```

## Live Supabase state

Both additive migrations were applied to the live Supabase project:

```txt
Project: the-breakroom
Project ref: bfinjvvtornltgytsvai
```

## Notes

This was an additive data pass. It did not change schema.

The current app still primarily uses static fallback data on many public pages. The live Supabase tables now carry more of the same world material so future work can move pages from static content toward database-backed content without losing the Claude motifs or newer object mythology.

## Recommended next data work

```txt
- Add tournament player seed rows to Supabase.
- Add radio show / episode seed rows.
- Add a route-data helper for public content tables.
- Move one public page at a time from static fallback to Supabase-backed rendering.
- Reconcile individual detail pages with Supabase slugs.
```

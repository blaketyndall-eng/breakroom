# Data Reconciliation Notes

This pass compares Claude design content against the live static data and Supabase seed data.

## Source files

```txt
design/claude/html/data.js
src/content/data/breakroom.ts
supabase/migrations/0003_seed_v1_content.sql
supabase/migrations/0005_seed_claude_reconciled_content.sql
```

## Current finding

`src/content/data/breakroom.ts` already carries most of the Claude data pool for frontend fallback/search behavior.

The bigger gap was live Supabase seed coverage. The live database had core V1 content, but not all of the richer Claude motifs from the design file.

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

## Live Supabase state

The `seed_claude_reconciled_content` migration was applied to the live Supabase project:

```txt
Project: the-breakroom
Project ref: bfinjvvtornltgytsvai
```

## Notes

This was an additive data pass. It did not change schema.

The current app still primarily uses static fallback data on many public pages. The live Supabase tables now carry more of the same world material so future work can move pages from static content toward database-backed content without losing the Claude motifs.

## Recommended next data work

```txt
- Add tournament player seed rows to Supabase.
- Add radio show / episode seed rows.
- Add a route-data helper for public content tables.
- Move one public page at a time from static fallback to Supabase-backed rendering.
- Reconcile individual detail pages with Supabase slugs.
```

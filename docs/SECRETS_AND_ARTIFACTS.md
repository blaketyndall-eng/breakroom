# Secrets + Artifacts Loop

This document tracks the first progression loop in The Breakroom.

## Goal

The site should start behaving like a world that notices user movement.

```txt
visit a room -> trigger a secret -> file an artifact -> show it in /artifacts
```

## Current files

```txt
src/lib/secrets.ts
src/lib/artifacts.ts
src/components/breakroom/SecretTrigger.tsx
src/components/breakroom/ArtifactGrid.tsx
src/pages/artifacts.astro
src/styles/artifacts.css
supabase/migrations/0009_seed_initial_artifact_unlock_loop.sql
```

## Initial artifact definitions

```txt
After Hours Badge
Dial Tone Slip
Radio 1:47 Station ID
Bathroom Wall Witness Card
Pending Marker Receipt
Object Evidence Card
Issued Goods Request
Double Shift Receipt
```

## Initial triggers

```txt
visit:/after-hours
visit:/phone
visit:/radio
visit:/sign-the-wall
submit:wall_post
visit:/lost-found/[slug]
visit:/rack/[slug]
combo:double-shift
```

## Double Shift combo

The first combo unlock uses local visit memory.

```txt
visit:/after-hours
visit:/phone
visit:/radio
```

When all three have happened in the same browser storage context, the user gets:

```txt
Double Shift Receipt
```

## Artifact feedback polish

The unlock loop now includes:

```txt
- receipt-style artifact toast
- evidence drawer count
- live artifact drawer sync via breakroom:artifact event
- duplicate-safe saved_artifacts lookup before insert
- improved locked/unlocked card styling
```

## Persistence model

Local-first:

```txt
localStorage: breakroom.secrets.v1
localStorage: breakroom.artifacts.v1
localStorage: breakroom.visits.v1
```

Authenticated persistence:

```txt
saved_artifacts
site_events
```

## Why local-first

The Breakroom should still feel alive before sign-in.

Authenticated users can carry evidence between sessions when saved_artifacts writes are allowed by RLS.

## Current limitations

```txt
- user_secrets table is seeded conceptually but not fully written from the client yet.
- saved_artifacts stores artifact_slug/type/notes without a dedicated artifacts table.
- unlocks are trigger matches plus one local combo, not a full rules engine.
- toast state is client-side and intentionally ephemeral.
```

## Product truth

Artifacts should not feel like achievements.

They should feel like receipts, badges, slips, cards, and small pieces of evidence that the user probably should not have.

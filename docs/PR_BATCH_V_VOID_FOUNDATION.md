# PR Batch V — Void Foundation: Seal The Seams + Profile Loop + First VS Pages

## Thesis

The Void Signal world has chrome (browser bar, taskbar, links bar), a homepage (`/void`), a working profile editor (`/locker`), and a public profile view (`/regulars/[handle]`). The foundation is laid.

But the homepage lies. Every left-nav link is `href="#"`. The search bar doesn't search. The poll has no submit. "Recently Indexed" pages (`moths.afterhours`, `lostgloves.afterhours`, `timing-slips.bible`) link to nowhere. The "Site Tonight" feature has no destination.

Profile loop is missing the social return: there's no per-profile guestbook, visiting a profile doesn't get logged anywhere, and the link surface between `/void` and `/regulars/[handle]` is still fictional.

This batch closes those gaps and ships the first batch of canonical VS pages so the homepage stops being a beautiful storefront with locked doors.

## Five Goals

1. **Every link on `/void` leads somewhere real** — to a working route or to a graceful in-world fallback ("the directory may have changed its mind") that still feels like part of the world.
2. **`/void` is interactive** — search bar searches, poll votes persist, "Site Tonight" has a real target.
3. **Profile loop closes** — public `/regulars/[handle]` has a guestbook anyone can sign, visiting a profile fires Seen Around, profile guestbook signatures persist.
4. **First three Void Signal sites are real pages** — `moths.afterhours`, `timing-slips.bible`, `lostgloves.afterhours` exist as actual routes with real content under `/sleepnet/[slug]` (or VS-side `/sites/[slug]`).
5. **Login / logout / "create a regular file" route to the real auth flow** — the chrome already has these. The homepage left-nav should match.

## What this batch is NOT

- Not a Pocket Mode build (PR 60–65 stays staged for a separate batch).
- Not a section visual redesign (Idle Hands → Stuff → Factions queue stays separate).
- Not a chrome rebuild (taskbar/browser bar already work).
- Not a desktop-toggle implementation (clock-in/clock-out chrome transition is a separate effort).
- Not a real money / commerce change.

---

## PR V1 — Seal The Seams: Wire `/void` Homepage Links

See main branch commit. Ships:
- Every `href="#"` on /void replaced with real route
- New soft-shell pages: /void/{about,games,flag,webrings,dmca,missing,search}, /void/feed.xml, /clock-in
- /sites/[slug] dynamic route + placeholder template + voidSites registry
- VoidPollCard React island with persistent voting
- worldMap registers `sites` and `voidshell` as voidsignal sections

## PR V2 — Profile Loop: Per-Profile Guestbook + Visit Tracking + Visual Upgrade

- Per-profile guestbook table (Supabase migration + local-first fallback)
- Visiting a profile fires Seen Around
- Top 8 reciprocity hint + add-to-Top-8 button
- Visual upgrade for /regulars/[handle] — theme-aware backgrounds, visitor count, pinned artifacts, Top 8 grid, faction drift signals, guestbook
- /locker polish: Public View button, visitor count, recent guestbook entries, visibility toggle
- /void welcome strip becomes data-driven for logged-in users

## PR V3 — First Five Void Signal Sites (Real Pages)

Replace placeholder template with five hand-built site templates:
- moths.afterhours — featured Site Tonight, 1999-style nature-enthusiast page
- timing-slips.bible — drag strip lore, 1996 Geocities personal
- lostgloves.afterhours — glove archive, 2002 evidence-locker aesthetic
- onenight.poolhall — single tournament that may or may not have happened
- whoateit.classifieds — items reported missing from the counter

Each reuses V2's ProfileGuestbook component (per-site keyed). Each visit fires SeenAround.

## Build order + dependencies

```
PR V1 (seal seams)
   ↓ blocks
PR V2 (profile loop) — independent of V1 routes, can land in parallel
   ↓ guestbook component is reused by ↓
PR V3 (first 5 sites) — depends on V2's ProfileGuestbook component
```

Recommended sequence: V1 → V2 → V3.

## Out of scope (later batches)

- PR Batch 60–65 (Pocket Mode + daily stickiness)
- Section visual redesigns (Idle Hands → Stuff → Factions → Rack → Radio → Districts)
- Two-desktop chrome transitions / clock-in clock-out animations
- Lost & Found → Newsstand merge
- Hidden Doors + Codes (could become PR V4)
- /sleeper-net deletion + /breakroom redesign as fridge-door lobby

## Verification gates

After each PR:
1. `pnpm build` passes locally.
2. Manual click-through of /void (V1), /locker + /regulars/[demo-handle] (V2), all 5 /sites/[slug] routes (V3).
3. Push via GitHub MCP `push_files` to `main`.
4. Cloudflare Pages auto-deploy succeeds.

## Voice / copy guardrails

Per project instructions and AGENTS.md:
- Soft-404s say "the directory may have changed its mind" — never "page not found."
- Empty guestbooks say "Nobody signed yet. Or they did and it didn't count."
- Visitor counts include "approximate" or "broken" disclaimers.
- No streak / engagement / notification language.
- Fictional sites stay fictional — no implied real commerce, no real venue claims.

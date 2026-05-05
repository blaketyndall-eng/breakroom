# Breakroom Route Map

This document outlines the canonical routes for the Breakroom web app. Each route corresponds to a page or feature in the universe. These routes exist as Astro pages in the repository (`src/pages`) and should follow the structure described here.

## Top-Level Routes

| Path | Description | Access Level | Status |
|------|-------------|-------------|--------|
| `/` | **SleeperNet Search** – Public landing page styled like a late-night search engine. Returns lore-filled results pointing to internal pages. | Public | Implemented |
| `/sleeper-net` | **SleeperNet Directory** – Hidden/mirror directory page for the after-hours internet, old link maze, and internal page index. | Public | Implemented in visual parity pass |
| `/breakroom` | **Employee Resources / Breakroom** – The fake corporate resource page partially defaced by rogue employees. Contains sign-up and object nav. | Public | Implemented + visual parity pass |
| `/signup` | **OmniShift Intake** – Signup/auth page for employee profile creation. | Public | Implemented + Supabase auth |
| `/auth/callback` | **Auth Callback Desk** – Supabase magic link/OAuth callback route. Restores or creates employee profile, then redirects to `/portal`. | Public callback | Implemented |
| `/portal` | **OmniShift Employee Profile** – Displays corporate identity: ID, department, role, assigned object, house rule, uniform recommendation. Provides Clock Out button. | Sign-in recommended; local preview fallback | Implemented + Supabase profile persistence |
| `/portal/after-hours-profile` | **After Hours Persona** – Shows tournament alias, fake handicap, preferred light, signature object, table assignment, and lore notes. | Works locally; Supabase profile when signed in | Implemented + Idle Hands persistence |
| `/clock-out` | **Clock Out Gate** – Ritual page that transitions the user from corporate On Shift to Clocked Out status. | User profile/session preferred; local fallback | Implemented + persisted timestamp |
| `/after-hours` | **After Hours** – The main page of the underground world. Contains phone, rack, lost objects, radio, ventures, Idle Hands, and other links. | Clock-out gated in UI | Implemented + visual parity pass |
| `/rack` | **The Rack** – 2003 style shopping/inventory page. Displays available, removed, and redacted products. | Public view | Implemented + catalog parity pass |
| `/rack/[slug]` | **Product File** – Individual product page with details, lore, related objects, and redacted file framing. | Public view | Implemented; needs future visual polish |
| `/lost-found` | **Lost & Found** – Object archive page listing seeded objects. | Public view | Implemented + evidence archive parity pass |
| `/lost-found/[slug]` | **Object File** – Detailed page for a specific object. | Public view | Implemented; needs future visual polish |
| `/newsstand` | **3AM Edition** – Newsstand index with headlines, classifieds, public notices, corrections, staff memos, and venture news. | Public view | Implemented + archive parity pass |
| `/newsstand/[slug]` | **News Item** – Detailed news article page with full story text. | Public view | Implemented; needs future visual polish |
| `/phone` | **Phone Behind The Bar** – Central message log for rides, food deliveries, voicemails, invites, and OmniShift interruptions. | Public view for V1 | Implemented + voicemail parity pass |
| `/sign-the-wall` | **Sign The Wall** – Bathroom wall / guestbook page. | Public view; posting later | Implemented placeholder |
| `/ventures` | **OmniShift Ventures** – Page listing AI-created/owned businesses and expansions. | Public view | Implemented |
| `/radio` | **Breakroom Radio** – Streaming radio page featuring Channel 1:47. | Public view | Implemented placeholder/player structure |
| `/idle-hands` | **Idle Hands Invitational** – Old pool tournament page with bracket, roster, house rules, and registration. | Discoverable through After Hours | Implemented + Supabase registration persistence + bracket parity |
| `/idle-hands/player/[slug]` | **Player Bio** – Detailed biography for a tournament participant. | Public view | Implemented; needs future visual polish |
| `/staff-only` | **Staff Only** – Teaser page for future hidden content. | Public view | Implemented |
| `/house-rules` | **House Rules** – Rules/memo page. | Public view | Implemented |
| `/404` | **Room Not Found** – Custom error page. | Public view | Implemented |

## SleepNet Portal (PR 48)

The SleepNet portal (`/sleepnet`) transforms from a single search island into a full old-web portal layout with multiple widget zones.  The portal is Astro-rendered with React islands for interactive elements.

| Route / Widget | Description | Real-World Connection |
|----------------|-------------|----------------------|
| `/sleepnet` | Full portal page: search bar, Lot Weather, Site of the Night, Recently Indexed, Directory Categories, Fake Ads, Radio Status | Multiple (see below) |
| Lot Weather widget | Parking lot conditions in Breakroom voice | Open-Meteo (free, no key) for real temp/conditions; falls back to generated fiction |
| Radio Status widget | Compact radio indicator; can embed real stream URL | Public Icecast/Shoutcast URLs (no key) |
| Directory Categories | Grouped site index; categories can include `isExternal` links to real places | External links marked `isExternal: true` |
| Fake Ads | Contextual ads; can link to real products or external pages | `destinationType: 'external_real'` or `'rack_product'` |
| Site of the Night | Featured page from seed/user content; candidates for real-world promotion | `reality_status` on featured sites |

## Hidden Doors (PR 49)

Hidden Doors are secret unlocks scattered across pages.  They use a static registry (authored content) and localStorage for user unlock state.  Door rewards can include real external URLs.

| Route / Component | Description | Real-World Connection |
|-------------------|-------------|----------------------|
| Hidden Door triggers | Embedded on existing pages; trigger on object_combination, search_phrase, or behaviour | None (trigger mechanism is internal) |
| Door reward pages | Unlocked content: could be a page, a message, an object, or a URL | Rewards can link to real pool halls, real product pages, real external URLs |
| `/sleepnet?door=...` | Search results that appear only after a door opens | Added results can point to real sites |

## Promotion / Canon Signals (PR 50)

Promotion tracks how pages gain visibility within the world.  Not likes/upvotes — signals like "Pass this around" and "The room noticed."  Promoted pages become candidates for real-world connection.

| Route / Component | Description | Real-World Connection |
|-------------------|-------------|----------------------|
| Promotion signals | User actions: passing pages around, room notices, guestbook density, search appearances | None (internal tracking) |
| Canon status | Pages graduate: `unknown` → `seen_around` → `locally_famous` → `canon` | `locally_famous`+ pages become candidates for real social posts, real product links |
| `canonical_weight` field | Already exists on SleepNetSite; PR 50 adds calculation logic | Higher weight = higher placement in directory, search, and real-world consideration |

## Conditional / Hidden Pages

These are planned pages that may appear once users meet certain conditions or as future releases. They are not all visible to everyone in V1:

- **Back Booth Forum** (`/back-booth`) – An old forum/guestbook for deeper community discussion.
- **Room 8** (`/room-8`) – A hidden room associated with motel keys and wall clocks.
- **Lot Weather** (`/lot-weather`) – A weather page forecasting parking lot conditions.  Uses real weather from Open-Meteo (free, no key) translated into Breakroom voice; falls back to deterministic fiction when offline or fetch fails.
- **Classifieds** (`/classifieds`) – A dedicated classifieds page listing fake services, items, rides, and missed connections.  May include `isExternal` links to real services.
- **Downloads** (`/downloads`) – Printable flyers, player cards, tournament forms, and other resources.
- **Web Ring** (`/webring`) – Curated late-night sites within the universe.  Can link to real external sites tagged `reality_status: 'real'`.
- **Message Board** (`/message-board`) – Simple forum for extended discussion once moderation exists.

## Real-World Route Principles

Routes that connect to external systems follow these rules:

1. **Free APIs only** — no keys required unless explicitly approved.  Open-Meteo, wttr.in, Nominatim, public streams.
2. **Graceful fallback** — every real-data widget must work without network.  Generated fiction fills the gap.
3. **External links marked in data** — `isExternal: true` on any href leaving The Breakroom.
4. **Real commerce is unmistakable** — when a route involves real money, trust signals appear and the bit turns down.
5. **Verification before publication** — real places, real products, real events must be verified (`is_verified: true`, `source_url` populated) before they appear on any route.

## Route philosophy

The site should not feel like a normal ecommerce or B2C site. It should feel like a working old web directory, a corrupted employee portal, a pool hall tournament page, a newspaper archive, a product catalog, and a hidden after-hours room sharing one bad server.  Where the fake world connects to the real world, the seams should be invisible — real temperature dressed as lot conditions, real bars listed as approved rooms, real links hiding among dead ones.

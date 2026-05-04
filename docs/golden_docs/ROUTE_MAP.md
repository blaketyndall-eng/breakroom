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

## Conditional / Hidden Pages

These are planned pages that may appear once users meet certain conditions or as future releases. They are not all visible to everyone in V1:

- **Back Booth Forum** (`/back-booth`) – An old forum/guestbook for deeper community discussion.
- **Room 8** (`/room-8`) – A hidden room associated with motel keys and wall clocks.
- **Lot Weather** (`/lot-weather`) – A fictitious weather page forecasting parking lot conditions.
- **Classifieds** (`/classifieds`) – A dedicated classifieds page listing fake services, items, rides, and missed connections.
- **Downloads** (`/downloads`) – Printable flyers, player cards, tournament forms, and other resources.
- **Web Ring** (`/webring`) – Curated late-night sites within the universe.
- **Message Board** (`/message-board`) – Simple forum for extended discussion once moderation exists.

## Route philosophy

The site should not feel like a normal ecommerce or B2C site. It should feel like a working old web directory, a corrupted employee portal, a pool hall tournament page, a newspaper archive, a product catalog, and a hidden after-hours room sharing one bad server.

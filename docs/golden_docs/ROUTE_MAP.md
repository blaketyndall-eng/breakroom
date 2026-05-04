# Breakroom Route Map

This document outlines the canonical routes for the Breakroom web app.  Each route corresponds to a page or feature in the universe.  These routes exist as Astro pages in the repository (`src/pages`) and should follow the structure described here.  Some routes are gated by the user's state (e.g. Clock Out, After Hours) and should enforce permissions accordingly.

## Top‑Level Routes

| Path | Description | Access Level | Notes |
|------|-------------|-------------|------|
| `/` | **SleeperNet Search** – Public landing page styled like a late‑night search engine. Returns lore‑filled results pointing to internal pages (Newsstand, Lost & Found, etc.). | Public | Starting point. Should encourage sign‑up without forcing it. |
| `/breakroom` | **Employee Resources / Breakroom** – The fake corporate resource page partially defaced by rogue employees. Contains sign‑up and object nav. | Public | Publicly viewable. Sign‑up for an OmniShift profile starts here. |
| `/portal` | **OmniShift Employee Profile** – Displays user’s corporate identity: ID, department, role, assigned object, house rule, uniform recommendation. Provides Clock Out button. | Requires sign‑in | Must only be accessible after user login. |
| `/portal/after-hours-profile` | **After Hours Persona** – Shows the user’s tournament alias, fake handicap, preferred light, signature object, table assignment, and lore notes. | Requires user to Clock Out and register for Idle Hands. | Locked until user completes Idle Hands registration. |
| `/clock-out` | **Clock Out Gate** – Ritual page that transitions the user from corporate “On Shift” to “Clocked Out” status. | Requires sign‑in | After completion, user is redirected to `/after-hours`. |
| `/after-hours` | **After Hours** – The main page of the underground world. Contains The Wall, Back Bar (product module), Phone Behind The Bar, People Still Here, 3AM Edition preview, Lost & Found snippets, and radio link. | Requires user to be clocked out | Acts as the hub for all underground activities. |
| `/rack` | **The Rack** – 2003 style shopping / inventory page. Displays available, removed, and redacted products. | Public view, sign‑in to interact | Some items require Clock Out or sign‑in to view; sold out items remain visible. |
| `/rack/[slug]` | **Product File** – Individual product page with details, lore, related objects, and redacted images. | Public view | Use slug to route to each product. |
| `/lost-found` | **Lost & Found** – Object archive page listing all seeded objects. Users can save objects to their file (requires sign‑in). | Public view; sign‑in to save | Objects link to product pages or hidden content. |
| `/lost-found/[slug]` | **Object File** – Detailed page for a specific object, with description, meaning, related products, story snippets, and unlock hints. | Public view | Some objects may be hidden or restricted. |
| `/newsstand` | **3AM Edition** – Newsstand index with fake/true headlines, classifieds, public notices, corrections, staff memos, product sightings, and OmniShift venturing news. | Public view | Daily/weekly updates. |
| `/newsstand/[slug]` | **News Item** – Detailed news article page with full story text and links to objects/products. | Public view | Use slug to route to each story. |
| `/phone` | **Phone Behind The Bar** – Central message log. View fake rides, food deliveries, voicemails from characters, and invites. | Requires Clock Out | Text only, no audio. |
| `/sign-the-wall` | **Sign The Wall** – Bathroom wall / guestbook page for users to leave short notes with icons and colours. | Public view; sign‑in to post | Moderated by staff or automated checks. |
| `/ventures` | **OmniShift Ventures** – Page listing AI‑created/owned businesses and expansions. Organised by category (Essential, Lifestyle, Experimental, Under Review). | Public view | Links to news items and corporate memos. |
| `/radio` | **Breakroom Radio** – Streaming radio page featuring Channel 1:47. Includes live player (powered by an external streaming provider), schedule, fake ads, and show descriptions. | Public view | For V1, use a Live365 embed or placeholder. |
| `/idle-hands` | **Idle Hands Invitational** – Hidden tournament page accessible only after Clock Out. Contains bracket, roster, schedule, bios, registration form, personalised asset generator, and live results. | Requires Clock Out | Must not be linked from main navigation; link appears in After Hours. |
| `/idle-hands/player/[slug]` | **Player Bio** – Detailed biography for a tournament participant. | Public view | Hidden until user discovers the link. |
| `/staff-only` | **Staff Only** – Teaser page for future hidden content. States “Access denied. You are employed, not trusted.” | Public view; sign‑in to display note | Hidden clues may be embedded here. |
| `/404` | **Room Not Found** – Custom error page with themed messages (“The page left. It did not clock out.”). | Public view | Provide helpful links back to Search, Breakroom, or Lost & Found. |

## Conditional / Hidden Pages

These are planned pages that may appear once users meet certain conditions or as future releases.  They are not visible to everyone in V1:

- **Back Booth Forum** (`/back-booth`) – An old forum/guestbook for deeper community discussion.  Unlocked by a combination of actions (registering for Idle Hands, signing the wall, saving certain objects).
- **Room 8** (`/room-8`) – A hidden room associated with Motel Key No. 8 and the wall clock.  Unlocked by saving specific objects.
- **Lot Weather** (`/lot-weather`) – A fictitious weather page forecasting conditions in the parking lot.
- **Classifieds** (`/classifieds`) – A dedicated classifieds page listing fake services, items, rides, and missed connections.
- **Downloads** (`/downloads`) – A repository for printable flyers, player cards, tournament forms, and other resources.
- **Web Ring** (`/webring`) – A nostalgic collection of curated late‑night sites within the universe.
- **Message Board** (`/message-board`) – A simple forum for extended discussion.  Planned once moderation workflow is in place.

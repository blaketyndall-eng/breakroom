# Data Model for The Breakroom

This document describes the primary database schema for The Breakroom universe using Supabase (PostgreSQL).  Each table supports the world’s features, from product inventory to user identities, object archives, news stories, tournament participation, radio scheduling, and secret unlocking.  Row‑level security (RLS) policies are enabled on all tables so that public content is publicly readable while user‑specific data is only visible to the owner.

## Enumerations

- **`reality_status`**: defines the truthfulness of a record (real, fictional, breakroom_myth, unverified, out_of_context, brand_object).
- **`object_type`**: categorises lost objects (physical, digital, cultural, room_myth, product_artifact, approved_room, historical_reprint).
- **`item_status`**: states the current state of a lost object (found, claimed, unclaimed, under_review, missing_again, redacted, for_sale, unlockable, staff_only).
- **`product_status`**: used for product listings (available_for_issue, removed_from_rack, uniform_pending, clock_out_to_view, item_removed_by_management, seen_around, last_seen_after_hours).
- **`user_shift_status`**: tracks the user’s current state (on_shift, clocked_out, still_out).

## Public Content Tables

### `products`
Stores all merchandise items (e.g., tees, hoodies, caps).  Each product includes a unique slug, name, descriptive copy, price (in cents), status, department (e.g., “Fluorescent Operations”), related object slug (linking to `lost_objects`), available sizes and colours, and visibility flag.  Products are visible to everyone when `is_visible` is true.

**Relationships:**
- Related object via `related_object_slug` → `lost_objects.slug`.

### `lost_objects`
Represents the archive of objects found in the universe: motel keys, fuzzy dice, printed receipts, torn memos, digital screenshots, and more.  Each object has a slug, name, item number, type, reality status, status, found location, description, symbolic meaning, related product slug (optional), related story slug (optional), unlock key for secret unlocking, image URL, public visibility, and sort order.

**Relationships:**
- Many objects point to a single product via `related_product_slug` → `products.slug`.
- Users can save objects in `user_saved_objects`.

### `news_items`
Contains news articles, fake headlines, classifieds, corrections, staff memos, and product sightings published in the 3AM Edition.  Each entry has a slug, title, category (e.g., “Breaking”), subhead, body, reality status, related product or object slug, image URL, and publication timestamp.  Public content is controlled via `is_public`.

**Relationships:**
- A news item may reference a product (`related_product_slug`) or object (`related_object_slug`) by slug.

### `phone_messages`
Stores the transcripts of “Phone Behind The Bar” messages.  Each record includes caller, category (e.g., ride, food, invite, VOICEMAIL), transcript text, an optional related object or product slug, and an unlock key for secrets.  Only `is_public` messages are visible.

**Relationships:**
- Unlock keys tie into the `secrets` table.

### `approved_rooms`
Reserved for real bars or dive rooms that may be approved in future releases.  This table holds factual information about the venue (name, location, verification status), why it fits the universe, Breakroom notes, and source URLs.  In V1 this table is not exposed to the public (set `is_public = false`).  Real places must be researched and verified before publication.

### `tournaments`, `tournament_players`, `tournament_matches`
Defines the Idle Hands Invitational (and future events).  `tournaments` holds meta information (slug, name, reality status).  `tournament_players` lists alias entries with handicap, signature object, last seen, and regular’s notes.  `tournament_matches` tracks matchups, round names, table numbers, scores, winners, notes, and scheduling.

**Relationships:**
- `tournament_players.tournament_id` → `tournaments.id`.
- `tournament_matches.tournament_id` → `tournaments.id`.

## User Tables

### `user_profiles`
Extends Supabase’s `auth.users` table with fields for each user’s OmniShift identity: alias, employee ID, department, role, assigned object slug, house rule, uniform recommendation, preferred light and place, shift status, and timestamp of last clock out.

**RLS:**  Users can read and update only their own profile.

### `after_hours_profiles`
Stores each user’s second identity after registering for Idle Hands.  Includes alias, fake handicap, preferred light, signature object, assigned table, after hours status, regular’s note, personal myth, generated assets (JSON), and timestamps.

**RLS:**  Only the owner can view or edit their after hours profile.

### `user_artifacts`
Captures any digital assets or lore fragments generated for a user (e.g., player cards, receipts, memoranda).  Each entry records the type (badge, receipt, file), slug, title, data (JSON), and the unlock timestamp.

### `user_saved_objects`
Associates users with objects they have “saved” in the Lost & Found.  Contains a composite unique key (`user_id`, `object_id`).  Enables unlocking secrets when certain combinations are saved.

### `user_tournament_registrations`
Tracks each user’s entry in tournaments.  Stores the alias, fake handicap, table assignment, assigned object slug, preferences, break style, game selection, confidence level, generated assets (JSON), and timestamps.

## Radio Tables

### `radio_shows`
Defines the programmes broadcast on Breakroom Radio / Channel 1:47.  Each show has a slug, title, description, host character, type (e.g., Lot Weather, 3AM Edition), cover image, and visibility flag.

### `radio_episodes`
Individual episodes of a show, with slug, title, description, audio URL (stream file), duration, transcript, related object and product slugs, publication timestamp, and public flag.

### `radio_requests`
Records user requests for songs, messages, or moods for Breakroom Radio.  Includes the request type, message content, selected object slug, mood, status (received, queued, played), and timestamps.

## Venturing Table

### `ventures`
Captures all OmniShift “investments” and business units, such as **Still Open Burger**, **Hot Air Balloon Insurance**, or **Fluorescent Operations**.  Each record lists name, category (Essential, Lifestyle, Experimental, Under Review), status, AI rationale for acquiring/creating the venture, Breakroom commentary, and publication status.

## Secrets Tables

### `secrets`
Defines hidden triggers in the site.  Each secret has a slug, human‑friendly name, trigger type (object_combination, search_phrase, behaviour), trigger value, unlock type (page, message, item), payload (JSON), hint, active flag, and creation timestamp.

### `user_secret_unlocks`
Many‑to‑many table linking users to secrets they’ve unlocked.  Records the secret ID, user ID, and time of unlocking.

**RLS:**  Users can only see their own unlocks.

## Wall Posts Table

### `wall_posts`
Stores user messages left on the **Sign The Wall** page.  Each post includes the user ID, alias, message text, marker color, wall location (stall door, tile, mirror), object icon, status (pending, approved, hidden), and timestamps.

**RLS:**  Users can create posts; only approved posts are publicly visible.

## Site Events Table

### `site_events`
Captures miscellaneous user actions for analytics: page visits, secret unlocks, product requests, registration completions, etc.  Each event stores the user ID (nullable for anonymous), event name, page slug, metadata (JSON), and timestamp.  This helps measure engagement and refine the story triggers.

## Reality Bridge

The Breakroom's long-term goal is to connect the fake world to the real world.  Fake weather becomes real weather.  Fake restaurants sit alongside real restaurants.  Fake products become real products.  The system must support this transition gracefully.

### Design principles

1. **Every entity has a `reality_status`.**  The existing enum (`real`, `fictional`, `breakroom_myth`, `unverified`, `out_of_context`, `brand_object`) already covers the spectrum.  When a fictional entity becomes real, its status updates — the system does not create a separate "real" table.

2. **Real data enters through external connectors (free APIs, no keys required).**  The Breakroom prefers APIs that need no authentication:
   - **Weather**: [Open-Meteo](https://open-meteo.com/) (free, no key, JSON) or [wttr.in](https://wttr.in/) (free, no key, text/JSON)
   - **Time/location**: browser Intl APIs and navigator.geolocation (optional, user-consented)
   - **Music/Radio**: public stream URLs, no API needed
   - **Maps/places**: OpenStreetMap Nominatim (free, no key, rate-limited)
   - **Links**: plain `<a href>` to real businesses, real events, real places — no API needed

3. **Real links live alongside fake links.**  A fake ad can link to a real product page.  A directory category can mix fictional SleepNet pages with real external URLs.  The `href` field on ads, directory entries, and navigation already supports absolute URLs.

4. **The `approved_rooms` table pattern extends to any real-world entity.**  Real bars, real restaurants, real events, real products — all require verification before publication.  The data model uses `is_verified: boolean` and `source_url: text` to track provenance.

5. **The bit turns down for real money.**  When something is real and purchasable, the copy gets clear.  The `reality_status = 'real'` flag triggers UI changes: trust signals, clear pricing, no ambiguity about what the user is getting.

### External data flow

```
Free API (no key) → src/lib/externalData.ts → transformed into Breakroom voice → rendered in widget
```

Example: Open-Meteo returns `{ temperature: 72, weathercode: 3 }`.  The Breakroom transforms this into:

```
LOT CONDITIONS (REAL)
Temperature: 72F — hoodie optional
Sky: overcast — good for schemes
Bad Decision Pressure: moderate (based on actual barometric)
```

The real data is the skeleton; the Breakroom voice is the skin.

### Reality status on links and references

Any entity that links to the real world should include:

```ts
{
  href: string;              // the actual URL
  isExternal: boolean;       // true = leaves The Breakroom
  realityStatus: 'real' | 'fictional' | 'unverified';
  verifiedAt?: string;       // ISO date of last verification
  sourceNote?: string;       // "Real bar in Austin, TX" or "Actually sells hats"
}
```

This metadata helps the system (and future admin tools) distinguish between fake rabbit-hole links and real-world destinations.

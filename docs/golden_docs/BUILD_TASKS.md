# Build Tasks for V1 Development

This document breaks down the tasks required to deliver the public V1 of The Breakroom.  Tasks are grouped by sprint and indicate priorities, dependencies, and high‑level steps.  Use this as a roadmap for AI developers working on the project.

## Sprint 0 – Repository & Infrastructure

1. **Initialize the repo** (on `feature/base-scaffold`):
   - Set up PNPM, Astro, TypeScript, and Tailwind.
   - Create `.env.example` with placeholders for Supabase keys and streaming URLs.
   - Commit `README.md`, basic project description, license, gitignore.

2. **Add core layouts**:
   - `BaseLayout.astro` for global wrapper and meta tags.
   - `OldWebLayout.astro` for old‑web look (tables, headers, links).
   - `PortalLayout.astro` for corporate pages.
   - `ProductLayout.astro` for individual product pages.
   - `ArchiveLayout.astro` for listing pages (Lost & Found, Newsstand).

3. **Create styles**:
   - Global resets and typography.
   - Old‑web CSS classes (tables, links, stamps, icons).
   - Colour variables from style guide.

4. **Set up Supabase**:
   - Create a new Supabase project (if not already existing).
   - Run initial schema migrations (see `/supabase/migrations`).
   - Enable Row Level Security (RLS) on all tables.
   - Generate service role key for server‑side functions and store securely (not in repo).

## Sprint 1 – SleeperNet & Sign Up

1. **Homepage** (`/`):
   - Build search bar component (`SearchBox.tsx`) with placeholder rotation.
   - Fake search results component (`SearchResults.tsx`) using local seeded data.
   - Trending searches sidebar.
   - Links into Newsstand, Lost & Found, Rack, Breakroom, Radio.

2. **Sign‑up flow**:
   - Create signup form on `/breakroom` or use external modal.
   - Implement Supabase Auth magic link plus email/password option.
   - Create `user_profiles` row after successful sign‑up.
   - Present the **Take Interview** or **I Don’t Care** choice.
   - Generate employee assignment (department, role, object) and save to `user_profiles`.

3. **Employee Portal** (`/portal`):
   - Show employee ID, department, role, assigned object, house rule, uniform recommendation.
   - Display first phone message (static for now).  Save message data to `phone_messages` if needed.
   - Provide **Clock Out** button linking to `/clock-out`.

## Sprint 2 – Clock Out & After Hours

1. **Clock Out** (`/clock-out`):
   - Show short loading sequence (“Ending approved session… Supervisor connection lost… Clock discrepancy detected…”).
   - Set `shift_status = 'clocked_out'` in `user_profiles` with the timestamp.
   - Redirect to `/after-hours`.

2. **After Hours** (`/after-hours`):
   - Build hero (dive bar collage: lowrider glow, motel key, swan feather, wall clock, receipts).  Can be static image initially.
   - The Wall: vertical feed of news items, classifieds, public notices, and lore.  Use static seed data for now.
   - Back Bar: show product previews (available + redacted) with call to view more in `/rack`.
   - Phone Behind The Bar preview: show three messages; link to full log.
   - People Still Here: list a few characters with short intros (e.g., Nun Dog, The Driver).
   - Radio preview: show current show name and link to `/radio`.
   - Lost & Found snippets: show three objects; link to `/lost-found`.
   - Link to Idle Hands Invitational (visible only after Clock Out).

3. **Phone Behind The Bar** (`/phone`):
   - Load static messages from local seed or Supabase table.
   - Render categories: rides, deliveries, weird voicemails, invites, OmniShift interruptions.
   - Provide easy navigation back to After Hours.

## Sprint 3 – The Rack & Objects

1. **Rack page** (`/rack`):
   - Build status strip (Available, Removed, etc.).  Use local seed data for product list.
   - Render a table of products.  Each row includes thumbnail, name, status badge, price, department, related object, description, size dropdown (disabled), and a “File Request” or “Notify Me” link.
   - Implement redacted rows with black bars and “Clock Out to view” labels.
   - Sorting and filters: use simple dropdowns for issue type, shift, status, colour, size.

2. **Product file** (`/rack/[slug]`):
   - Use `ProductLayout.astro` to display product details, story, object metadata, and purchase buttons (disabled for V1 if no checkout).  Show redacted image if product is hidden.

3. **Lost & Found** (`/lost-found`):
   - Show object cards using data from `lost_objects` (local JSON or Supabase).  Each card includes image, name, item number, status, reality label, location, meaning, related product, and link.
   - Provide filter controls (type, location, reality status, status).
   - Users can click **Save** on objects if logged in; call a function to add `user_saved_objects` row.  Display saved state in UI.

4. **Object file** (`/lost-found/[slug]`):
   - Detailed view: long description, meaning, related product, story fragment, unlock hint.  If object unlocks secrets, show requirements (“Combine with Fuzzy Dice to find Room 8”).

## Sprint 4 – Newsstand & Ventures & Wall

1. **Newsstand** (`/newsstand`):
   - Render front page layout with multiple columns (Headlines, Public Notices, Classifieds, Corrections, Staff Memos, Product Sightings, OmniShift ventures).  Use static seed data.
   - Provide pagination or load more.
   - Each news item links to `/newsstand/[slug]` for full story.

2. **News item** (`/newsstand/[slug]`):
   - Show headline, subhead, body text, related objects/products, image if available, and a “Return to Newsstand” link.

3. **OmniShift Ventures** (`/ventures`):
   - Simple table listing ventures: name, category, status, AI rationale, Breakroom note.  Use local seed.
   - Each venture can link to a news story or product if relevant.

4. **Sign The Wall** (`/sign-the-wall`):
   - Create wall posts table (`wall_posts`).  Show public approved posts.  Provide submission form with fields: alias (optional), message, marker colour, wall location (stall, tile, mirror), object icon.  On submission, insert a `pending` post; will need manual or automated approval logic later.

5. **Moderation**:  For V1, hide unapproved posts by default.  Later we can add a simple review UI (internal only).

## Sprint 5 – Idle Hands Invitational & Personas

1. **Tournament page** (`/idle-hands`):
   - Build old‑web styled bracket.  Use seeded bracket for now.
   - List players with alias and handicap.  Link to player bios.
   - Display match schedule table.  Use fake times (e.g., 7:30 PM, 8:45 PM).  Include notes about clock disputes.
   - Provide House Rules and Pot sections.
   - Provide registration form with fields described in the Route Map.  Save registration to `user_tournament_registrations` and generate After Hours persona in `after_hours_profiles`.
   - On submission, display personalised assets (player card, receipt, bracket placement, phone message).  Also update user portal with new `after_hours_profile`.

2. **Player bios** (`/idle-hands/player/[slug]`):
   - Render known fields: alias, handicap, known for, last seen, signature object, Regular’s Note, Risk, related headline.
   - Show object icons linking to Lost & Found pages.

3. **After Hours Persona Profile** (`/portal/after-hours-profile`):
   - Show After Hours data for the user.  Mirror some Employee Profile layout but with the dive‑bar style.  Include generated assets and an **Invite** link to share the tournament page.

## Sprint 6 – Breakroom Radio

1. **Radio page** (`/radio`):
   - Use a Live365 embed or placeholder audio player.  Show Now Playing metadata, listeners count, and a schedule grid.
   - List shows with times and hosts.  Provide sample station IDs and fake ads.  For V1, audio can be a loop of original soundscapes and station IDs if the Live365 streaming plan is not yet active.
   - Create tables: `radio_shows`, `radio_episodes`, `radio_requests`.  Use seed data for initial shows.

2. **Integrate radio into other pages**:  Show now‑playing bar on After Hours, display upcoming shows in Idle Hands page, and allow requests via the Phone page or forms.

## Sprint 7 – Secrets & Final QA

1. **Secret system**:  Build triggers (object combinations, search queries, behaviours) using `secrets` and `user_secret_unlocks`.  Example triggers: Save Motel Key + Wall Clock → unlock Room 8 teaser; search “miss september” → swan phone message; click clock multiple times → open Clock File.

2. **404 page**:  Create custom error page with on‑brand copy (“The page left. It did not clock out.”) and helpful links back.

3. **Staff Only teaser**:  Build locked page with hint text.  No content yet.

4. **Performance and SEO**:  Ensure pages load quickly.  Pre‑render content where possible.  Clean up meta tags and OG tags.

5. **Accessibility**:  Alt tags on images, keyboard navigation, legible fonts.  Ensure forms are labelled.

6. **Final QA**:  Test sign‑up flows, Clock Out, object saving, tournament registration, radio playback, secret triggers.  Validate user sessions and data saving.

## Future Sprints

These tasks are for later releases:

- Build Staff Only portal with deep secrets and staff files.
- Add approved real dive bars (pending research and legal compliance).
- Expand tournament system to allow real or virtual tournaments.
- Build Back Booth Forum and moderated message board.
- Add a full classifieds page with user listings.
- Integrate real e‑commerce checkout (POD) when product designs are finalised.
- Develop mobile app or PWA version.

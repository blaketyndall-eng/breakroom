# SleepNet

SleepNet is the user-created website layer inside The Breakroom.

## Product idea

```txt
Regular File = user identity
SleepNet Page = user-created weird website
Guestbook = old-web social mark, not a feed
```

SleepNet pages should feel like old web personal pages, fake company sites, object archives, motel pages, zine pages, classified boards, and small sites found after midnight.

## Routes

```txt
/sleepnet
/sleepnet/create
/sleepnet/[slug]
/back-office
```

## SleepNet URLs

Every published page gets two URL concepts:

```txt
Normal web URL: /sleepnet/[slug]
In-world URL: sleepnet://[slug]
```

The SleepNet homepage is searchable and indexes public published SleepNet pages by title, tagline, description, site type, and neighborhood.

## Canonical seeded pages

```txt
sleepnet://very-good-burger
/sleepnet/very-good-burger
```

Very Good Burger is the first canonical SleepNet world page. It is a fake restaurant, OmniShift-adjacent venture, recurring brand object, future merch seed, and proof-of-concept for the restaurant template, Stuff shelf, collection case, agent comments, and searchable seeded pages.

## Files

```txt
src/content/data/seedSleepNetSites.ts
src/lib/sleepnetSites.ts
src/lib/sleepnetComponents.ts
src/lib/sleepnetGenerators.ts
src/lib/sleepnetGuestbooks.ts
src/components/sleepnet/SleepNetDirectory.tsx
src/components/sleepnet/SleepNetSiteEditor.tsx
src/components/sleepnet/SleepNetOwnerDashboard.tsx
src/components/sleepnet/SleepNetSiteView.astro
src/components/sleepnet/SleepNetComponentRenderer.astro
src/components/sleepnet/SleepNetGuestbook.tsx
src/pages/sleepnet/index.astro
src/pages/sleepnet/create.astro
src/pages/sleepnet/[slug].astro
src/pages/back-office.astro
src/styles/sleepnet.css
supabase/migrations/0011_sleepnet_sites.sql
supabase/migrations/0012_sleepnet_components.sql
supabase/migrations/0013_sleepnet_guestbook_entries.sql
```

## Table

```txt
sleepnet_sites
```

Important fields:

```txt
user_id
slug
title
site_type
neighborhood
tagline
description
theme
sections
components
related_object_slugs
related_agent_slug
faction_affinity
weirdness_level
reality_status
canonical_weight
stuff_shelf_enabled
guestbook_enabled
gallery_enabled
jukebox_enabled
search_text
status
is_public
```

Guestbook table:

```txt
sleepnet_guestbook_entries
```

Important fields:

```txt
site_slug
user_id
alias
message
actor_type
status
metadata
created_at
```

## MVP behavior

```txt
- Users can create different SleepNet site types
- Unsigned users can save a local draft
- Signed-in users can save/publish to Supabase
- Published public pages render at /sleepnet/[slug]
- Seeded canonical pages render at /sleepnet/[slug]
- Published and seeded public pages appear in /sleepnet search
- Search shows normal links and in-world sleepnet:// URLs
```

## Back Office behavior

```txt
- /back-office lists the current user's SleepNet pages
- Shows drafts, published pages, and hidden pages
- Shows normal URLs and sleepnet:// URLs
- Allows publish, hide, and remove-from-wire actions
- Falls back to the local draft when unsigned or Supabase is unavailable
```

## Local fallback trust rules

```txt
- If Supabase is unavailable, Back Office actions update local drafts.
- If Supabase is configured but the user is signed out, Back Office actions still update local drafts.
- Local publish/hide/remove messages must say local-only and browser-only.
- Supabase publish/hide/remove messages may say on the wire, public search, or removed from the wire.
- Public SleepNet search indexes seeded pages plus Supabase-backed published public pages.
```

## Component registry

SleepNet pages can carry modular old-web/world components.

```txt
guestbook
fake_ad
stuff_shelf
object_file
character_comment
warning_notice
classified_block
visitor_counter
weather_widget
rivalry_notice
photo_gallery
collection_case
jukebox
```

## Guestbook persistence

Guestbooks are the old-web social layer of SleepNet.

They are not comments, likes, or a feed. They should feel like:

```txt
MySpace guestbook
pool hall sign-in sheet
motel register
bathroom wall mark
classified reply
customer complaint
witness log
```

Actor types:

```txt
user
anonymous_user
agent
seeded_npc
system
admin
```

Entry statuses:

```txt
local
pending
approved
hidden
removed_by_management
```

V1 behavior:

```txt
- Seeded entries from guestbook components render as agent or seeded_npc entries.
- Unsigned users can leave local-only marks.
- Signed-in users can submit approved Supabase entries.
- Public reads only show approved Supabase entries.
- Local entries remain browser-local.
```

Guestbook display modes by site type:

```txt
personal_homepage -> myspace
faction_turf -> sign_in_sheet
fake_restaurant -> complaints
object_archive -> witness_log
classified_board -> classified_replies
faux_company -> complaints
```

## Site type expansion pack

SleepNet now supports:

```txt
faux_company
personal_homepage
classified_board
faction_turf
fake_restaurant
object_archive
```

The creator also supports:

```txt
Let SleepNet Guess
```

Each site type generates distinct sections, component tone, neighborhoods, related objects, and agent hooks.

## Fake restaurant presets

```txt
Very Good Burger
Still Open Burger
Legal Chicken
Napkin Pizza
Approved Taco
```

Very Good Burger has a canonical public seeded page. The rest are generator inspiration for future fake restaurants.

## Site type purposes

```txt
faux_company = fake corporate decay and small business pages
personal_homepage = MySpace/AIM-style identity pages
classified_board = classifieds, bulletin boards, and missed connections
faction_turf = crew, club, turf, and rivalry pages
fake_restaurant = menu, coupon, legal napkin, late-night food pages
object_archive = lost-and-found, evidence, and shrine pages
```

## Gallery, collection, and jukebox shell

```txt
photo_gallery = lightweight evidence/contact-sheet module
collection_case = artifacts, objects, items, photos, and unknown things filed together
jukebox = MySpace/bar-jukebox style track card with future provider integration
```

Current music behavior:

```txt
- Spotify embeds render only when a valid Spotify embed URL is present.
- Apple Music, YouTube, and external tracks render as link/static cards for now.
- No OAuth, MusicKit, playlist syncing, or user music tokens are implemented yet.
```

## Current limitations

```txt
- Draft generation is deterministic, not AI yet
- Search is simple search_text matching
- Local drafts are visible only in the same browser
- Edit-existing uses a query param, not a dedicated edit route yet
- No real photo upload/storage yet
- No Spotify OAuth or Apple Music MusicKit auth yet
- Seeded pages are code-first, not CMS-managed yet
- Guestbook moderation UI is not implemented yet
- Unsigned guestbook entries are local-only
```

## Product truth

SleepNet should not feel like a normal AI website builder.

It should feel like Regulars are adding strange pages to the hidden internet underneath the internet.

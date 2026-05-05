# SleepNet

SleepNet is the user-created website layer inside The Breakroom.

## Product idea

```txt
Regular File = user identity
SleepNet Page = user-created weird website
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

## Files

```txt
src/lib/sleepnetSites.ts
src/lib/sleepnetComponents.ts
src/lib/sleepnetGenerators.ts
src/components/sleepnet/SleepNetDirectory.tsx
src/components/sleepnet/SleepNetSiteEditor.tsx
src/components/sleepnet/SleepNetOwnerDashboard.tsx
src/components/sleepnet/SleepNetSiteView.astro
src/components/sleepnet/SleepNetComponentRenderer.astro
src/pages/sleepnet/index.astro
src/pages/sleepnet/create.astro
src/pages/sleepnet/[slug].astro
src/pages/back-office.astro
src/styles/sleepnet.css
supabase/migrations/0011_sleepnet_sites.sql
supabase/migrations/0012_sleepnet_components.sql
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

## MVP behavior

```txt
- Users can create different SleepNet site types
- Unsigned users can save a local draft
- Signed-in users can save/publish to Supabase
- Published public pages render at /sleepnet/[slug]
- Published public pages appear in /sleepnet search
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
- Public SleepNet search only indexes Supabase-backed published public pages.
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
- No real guestbook persistence yet
- No real photo upload/storage yet
- No Spotify OAuth or Apple Music MusicKit auth yet
- Component editing is preview/regenerate only
- Faction data is not fully seeded yet
```

## Product truth

SleepNet should not feel like a normal AI website builder.

It should feel like Regulars are adding strange pages to the hidden internet underneath the internet.

# SleepNet

SleepNet is the user-created website layer inside The Breakroom.

## Product idea

```txt
Regular File = user identity
SleepNet Page = user-created weird website
```

SleepNet pages should feel like:

```txt
- 2003 local business pages
- fake company websites
- object archives
- motel pages
- zine pages
- classified boards
- small sites found after midnight
```

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

The SleepNet homepage is searchable and indexes public published SleepNet pages by:

```txt
title
tagline
description
site_type
neighborhood
```

## Files

```txt
src/lib/sleepnetSites.ts
src/components/sleepnet/SleepNetDirectory.tsx
src/components/sleepnet/SleepNetSiteEditor.tsx
src/components/sleepnet/SleepNetOwnerDashboard.tsx
src/components/sleepnet/SleepNetSiteView.astro
src/pages/sleepnet/index.astro
src/pages/sleepnet/create.astro
src/pages/sleepnet/[slug].astro
src/pages/back-office.astro
src/styles/sleepnet.css
supabase/migrations/0011_sleepnet_sites.sql
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
search_text
status
is_public
```

## MVP behavior

```txt
- Users can create a Faux Company draft
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

## Polish pass

The polish layer adds:

```txt
- prompt scraps for faster Faux Company generation
- edit existing page loading from /sleepnet/create?slug=[slug]
- Back Office filters for all/draft/published/hidden
- clearer status cards for published and hidden pages
- neighborhood labels instead of raw enum text
- safer owned-page lookup before editing
- local fallback mutation fixes for unsigned users
- clearer local-only / on-the-wire status messaging
- Regular File share widget hydration
```

## First site type

```txt
Faux Company
```

This is the best first SleepNet template because it naturally fits:

```txt
- fake corporate decay
- OmniShift logic
- weird local business pages
- humor without becoming random
- user-generated world expansion
```

## Current limitations

```txt
- Draft generation is deterministic, not AI yet
- Search is simple search_text matching
- Local drafts are visible only in the same browser
- Edit-existing uses a query param, not a dedicated edit route yet
- No guestbook persistence yet
- Only Faux Company is implemented
```

## Product truth

SleepNet should not feel like a normal AI website builder.

It should feel like Regulars are adding strange pages to the hidden internet underneath the internet.

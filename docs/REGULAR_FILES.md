# Regular Files

Regular Files are the user identity layer for The Breakroom.

## Product idea

```txt
Clock out -> become a Regular -> edit your Regular File -> share the page
```

This is not a normal social profile. It should feel like:

```txt
- MySpace profile
- old employee record
- AIM away message
- pool hall player card
- bar regular plaque
- lost-and-found witness file
```

## Routes

```txt
/locker
/regulars/[handle]
```

## Files

```txt
src/lib/regularFiles.ts
src/components/regulars/RegularFileEditor.tsx
src/components/regulars/RegularFileView.tsx
src/components/regulars/RegularFileShare.tsx
src/pages/locker.astro
src/pages/regulars/[handle].astro
src/styles/regulars.css
supabase/migrations/0010_regular_pages.sql
```

## Table

```txt
regular_pages
```

Important fields:

```txt
user_id
handle
display_name
fake_title
bio
away_message
favorite_light
assigned_object
theme
top_links
pinned_artifacts
is_public
```

## MVP behavior

```txt
- /locker edits a Regular File
- signed-in users save to Supabase
- unsigned/local users save to localStorage preview
- /regulars/[handle] renders a public file by handle
- missing handles show a preview file instead of a dead page
- pinned artifacts can come from the local artifact drawer
```

## Polish layer

The polish pass adds:

```txt
- public/private clarity strip in the Locker
- share/copy block on public Regular Files
- stronger theme visual differences
- visitor counter shell
- Top 8 Regulars placeholder
- guestbook shell
- Create SleepNet Page teaser
- stronger pinned evidence presentation
```

## Theme presets

```txt
corrupted_employee_portal
pool_hall_personal_page
motel_shrine
bathroom_wall_lite
two_thousand_three_local_webpage
```

## Next layer

```txt
- real guestbook persistence
- real Top 8 Regulars relationships
- richer theme modules
- SleepNet pages owned by this Regular
- artifact pinning from remote saved_artifacts, not only local artifacts
```

## Product truth

The Regular File is the self before SleepNet is the creation layer.

Users should feel like they have a place in the room before they start building pages inside the hidden internet.

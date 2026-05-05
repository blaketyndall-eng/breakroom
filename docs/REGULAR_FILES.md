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

## Next layer

```txt
- guestbook shell
- theme presets with stronger visual differences
- public/private clarity
- Top 8 Regulars
- SleepNet pages owned by this Regular
```

## Product truth

The Regular File is the self before SleepNet is the creation layer.

Users should feel like they have a place in the room before they start building pages inside the hidden internet.

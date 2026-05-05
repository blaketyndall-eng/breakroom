# Public Content Loader

This doc tracks the first step toward moving public pages from static fallback data to Supabase-backed content.

## First page converted

```txt
/phone
```

The Phone Behind The Bar page now uses:

```txt
src/lib/publicContent.ts
getPublicPhoneMessages()
```

## Behavior

When Supabase is configured and reachable:

```txt
- Load public rows from phone_messages
- Filter to is_public = true
- Order by unlock_level and created_at
- Render the database-backed voicemail drawer
```

When Supabase is not configured, unreachable, or returns no rows:

```txt
- Fall back to BREAKROOM_DATA.voicemails
- Keep the page functional in local preview mode
- Show fallback notice only if there was a load error
```

## Why Phone first

Phone was the safest first public content migration because:

```txt
- It already has a simple static data shape
- Supabase has enough seeded phone_messages rows
- It does not require route generation or slug-level static paths
- It proves the pattern without touching auth/profile logic
```

## Next candidates

```txt
/newsstand
/lost-found
/radio
```

Move one page at a time.

## Product truth

Database-backed public content lets the world keep growing after deploy. Static fallback keeps the room open if the wire gets cut.

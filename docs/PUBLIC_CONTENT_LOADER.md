# Public Content Loader

This doc tracks the move from static fallback data to Supabase-backed public content.

## Converted pages

```txt
/phone
/newsstand
/lost-found
/radio
```

## Shared helper

```txt
src/lib/publicContent.ts
```

Current helpers:

```txt
getPublicPhoneMessages()
getPublicNewsItems()
groupNewsItems()
getPublicLostObjects()
getPublicRadioLogs()
```

## Phone behavior

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

## Newsstand behavior

When Supabase is configured and reachable:

```txt
- Load public rows from news_items
- Filter to is_public = true
- Order by published_at
- Group by category
- Render the database-backed 3AM Edition index
```

When Supabase is not configured, unreachable, or returns no rows:

```txt
- Fall back to BREAKROOM_DATA.headlines
- Preserve old Claude design headline/category structure
- Keep the page functional in local preview mode
```

## Lost & Found behavior

When Supabase is configured and reachable:

```txt
- Load public rows from lost_objects
- Filter to is_public = true
- Order by created_at
- Render the database-backed evidence drawer and object cards
```

When Supabase is not configured, unreachable, or returns no rows:

```txt
- Fall back to BREAKROOM_DATA.objects
- Preserve the object archive and evidence drawer feel
- Keep the page functional in local preview mode
```

## Radio behavior

When Supabase is configured and reachable:

```txt
- Load rows from radio_logs
- Order by aired_at
- Render transmission log entries beside the player and schedule
```

When Supabase is not configured, unreachable, or returns no rows:

```txt
- Fall back to static Channel 1:47 transmission logs
- Keep PUBLIC_RADIO_STREAM_URL support through RadioPlayer
- Keep the page functional in local preview mode
```

## Why Phone first

Phone was the safest first public content migration because:

```txt
- It already had a simple static data shape
- Supabase had enough seeded phone_messages rows
- It did not require route generation or slug-level static paths
- It proved the pattern without touching auth/profile logic
```

## Why Newsstand second

Newsstand is a high-value second migration because:

```txt
- It benefits from the deeper Supabase seed content
- New lore/headlines can go live without static code changes later
- It is still an index page, so no dynamic route generation is required yet
```

## Why Lost & Found third

Lost & Found is core to the Breakroom world because objects are the memory layer.

```txt
- Supabase now has a deeper lost_objects seed bank
- Object cards can expand without static code changes later
- It proves the same loader pattern across a different content shape
```

## Why Radio fourth

Radio connects Phone, Newsstand, Idle Hands, and After Hours.

```txt
- Supabase now has radio_logs seed content
- The player can stay environment-driven while logs become database-backed
- It deepens the broadcast layer without adding schema yet
```

## Next candidates

```txt
/newsstand/[slug]
/lost-found/[slug]
/rack
```

Move one page at a time.

## Product truth

Database-backed public content lets the world keep growing after deploy. Static fallback keeps the room open if the wire gets cut.

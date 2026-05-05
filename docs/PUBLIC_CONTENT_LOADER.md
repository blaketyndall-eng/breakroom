# Public Content Loader

This doc tracks the move from static fallback data to Supabase-backed public content.

## Converted pages

```txt
/phone
/newsstand
/newsstand/[slug]
/lost-found
/lost-found/[slug]
/radio
/rack
/rack/[slug]
/ventures
```

## Shared helper

```txt
src/lib/publicContent.ts
```

Current helpers:

```txt
getPublicPhoneMessages()
getPublicNewsItems()
getPublicNewsItemBySlug()
groupNewsItems()
getPublicLostObjects()
getPublicLostObjectBySlug()
getPublicRadioLogs()
getPublicProducts()
getPublicProductBySlug()
getPublicVentures()
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
- Detail pages load news_items by slug
```

When Supabase is not configured, unreachable, or returns no matching row:

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
- Detail pages load lost_objects by slug
```

When Supabase is not configured, unreachable, or returns no matching row:

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

## Rack behavior

When Supabase is configured and reachable:

```txt
- Load public rows from products
- Filter to is_public = true
- Order by sort_order
- Render the database-backed catalog rail and inventory table
- Detail pages load products by slug
```

When Supabase is not configured, unreachable, or returns no matching row:

```txt
- Fall back to BREAKROOM_DATA.products
- Preserve the 2003 catalog/inventory page feel
- Keep the page functional in local preview mode
```

## Ventures behavior

When Supabase is configured and reachable:

```txt
- Load public rows from ventures
- Filter to is_public = true
- Order by created_at
- Render the AI venture desk from database content
```

When Supabase is not configured, unreachable, or returns no rows:

```txt
- Fall back to static OmniShift venture rows
- Preserve the fake business portfolio feel
- Keep the page functional in local preview mode
```

## Detail page note

Dynamic detail pages use Supabase by slug when possible while keeping the existing static route behavior stable.

```txt
/newsstand/[slug]
/lost-found/[slug]
/rack/[slug]
```

Important limitation:

```txt
Static paths are still generated from BREAKROOM_DATA.
New Supabase-only slugs may not have build-time routes until dynamic route generation is revisited.
```

## Next candidates

```txt
/sign-the-wall
saved artifacts / secret unlock helpers
```

Move one page at a time.

## Product truth

Database-backed public content lets the world keep growing after deploy. Static fallback keeps the room open if the wire gets cut.

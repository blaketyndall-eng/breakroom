# Sign The Wall

This doc tracks the Sign The Wall feature.

## Visual direction

The wall should feel like a real bathroom wall from a dive bar or pool room:

```txt
- stained vertical wood paneling
- red ceiling paint
- black, blue, gray, red, and white marker scrawls
- peace signs
- half-legible old names
- legal warnings
- pool-room threats
- crude but not polished
- layered marks that feel accumulated over years
```

The page should not feel like a clean guestbook. It should feel like the wall already existed and the site is letting you write on it.

## Current implementation

```txt
src/pages/sign-the-wall.astro
src/components/breakroom/SignWall.tsx
src/styles/oldweb.css
supabase/migrations/0008_seed_bathroom_wall_posts.sql
```

## Live Supabase behavior

The feature uses the existing `wall_posts` table.

Current table shape:

```txt
id
user_id
alias
body
x
y
rotation
is_approved
created_at
```

Read behavior:

```txt
- Loads approved wall posts only
- Orders by created_at descending
- Limits to 40 posts
```

Write behavior:

```txt
- User writes a short wall message
- Message appears locally immediately
- Message is inserted into Supabase with is_approved = false
- It will only become wall history after approval
```

## Seeded posts

The live migration adds bathroom-wall seed posts with x/y/rotation values so the wall feels physically arranged, not list-like.

```txt
READY AND WILLING TO MESS IT UP
THIS ISN’T HELL BUT WE KNOW WHAT IT LOOKS LIKE
NO EDDY THE POOL NOT EDDY THE MAN
NO WAR / RACK EM ANYWAY
573% legal maybe ask the table
EAT CHILI
ADAMS WAS HERE BUT NOT ENOUGH TO MATTER
The wall remembers better than the bartender
```

## Moderation stance

V1 keeps submitted posts pending by default.

```txt
is_approved = false
```

This lets the wall feel participatory without turning it into an unmoderated chaos board.

## Product truth

The wall is a memory surface. It should collect tiny fragments, not essays.

The best posts feel overheard, half-true, and written by somebody who left before the sink stopped running.

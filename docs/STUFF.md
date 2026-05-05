# Stuff

Stuff is the dormant commerce and lore shelf inside The Breakroom.

## Product idea

```txt
SleepNet Page = room
Stuff Shelf = objects and goods inside the room
Stuff Item = fake product, found object, printable artifact, future merch, or removed rack item
Drawer Save = the user saying I found this and the room remembered
Editable Stuff Shelf = page owner arranging the objects on their own counter
```

Stuff should not feel like normal ecommerce yet. It should feel like a lost-and-found drawer, product archive, fake shop, evidence shelf, and future merch system all sharing the same counter.

## Routes

```txt
/stuff
/stuff/[slug]
```

## Files

```txt
src/content/data/stuff.ts
src/lib/stuff.ts
src/lib/savedStuff.ts
src/components/stuff/StuffCard.astro
src/components/stuff/StuffPage.astro
src/components/stuff/SaveStuffButton.tsx
src/components/stuff/SavedStuffDrawerPreview.tsx
src/components/sleepnet/SleepNetStuffShelfEditor.tsx
src/pages/stuff/index.astro
src/pages/stuff/[slug].astro
src/styles/stuff.css
src/styles/sleepnet-stuff-editor.css
```

## Statuses

Registry statuses:

```txt
fake
coming_soon
removed_by_management
found
official_later
not_for_you_yet
printable
available
```

Editable SleepNet shelf statuses:

```txt
fake
coming_soon
removed_by_management
found
official_later
not_for_you_yet
printable
under_review
ask_at_counter
discontinued_before_release
```

## Item kinds

```txt
object
artifact
uniform
menu_item
paper_good
sticker
apparel
unknown
```

## Seed items

```txt
Very Good Hat
Legal Napkin Pack
Burger Receipt Tee
Good Sauce Sticker
Receipt With No Total
Dial Tone Slip
Wrong Employee Badge
Jukebox Quarter
```

## SleepNet hooks

Stuff shelf components link registry-backed shelf items to registry routes:

```txt
/stuff/[slug]
```

Page owners can also create custom fake Stuff inside the SleepNet creator. Custom Stuff is page-local in V1. It does not create a global /stuff/[slug] page.

Editable shelf item fields:

```txt
name
status
note
priceLabel
imageState
buttonLabel
relatedFactionSlug
relatedObjectSlug
source: registry | custom
officialStatus: registry_item | fake_listing
```

Very Good Burger uses the Stuff registry for its shelf:

```txt
very-good-hat
legal-napkin-pack
burger-receipt-tee
good-sauce-sticker
```

## Drawer saves

Saved Stuff is local-first in V1.

```txt
localStorage key: breakroom.saved-stuff.v1
```

The save loop:

```txt
Find Stuff
Open Stuff file or SleepNet shelf
Save To Drawer
Receipt Generated
Locker shows saved Stuff preview
```

Saved record shape:

```txt
stuffSlug
sku
name
status
sourceSiteSlug
relatedFactionSlug
relatedObjectSlug
savedAt
visibility
category
metadata
```

Supported V1 actions:

```txt
Save To Drawer
Already In Drawer
Remove From Drawer
Receipt Generated
Drawer Could Not Open
```

V1 does not sync saved Stuff to Supabase. A future table can persist account-level Drawer saves:

```sql
create table if not exists public.saved_stuff_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  stuff_slug text not null,
  sku text not null,
  name text not null,
  status text not null,
  source_site_slug text,
  related_faction_slug text,
  related_object_slug text,
  visibility text not null default 'private',
  category text not null default 'saved',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(user_id, stuff_slug)
);
```

## Commerce boundary

V1 does not include checkout.

Allowed language:

```txt
coming soon
removed by management
official later
not for you yet
printable
found
fake
under review
ask at counter
discontinued before release
Save To Drawer
Receipt Generated
```

Avoid implying a real purchase flow unless an item is explicitly official and connected to a future product system.

Forbidden until commerce exists:

```txt
Add to cart
Buy now
Checkout
Purchase
Inventory available
Payment
```

## Future expansion

```txt
stuff_items table
stuff_shelves table
saved_stuff_items table
sleepnet_site_stuff join table
waitlist/request action
printable artifact downloads
official product distinction
inventory/commerce provider integration
global user-created Stuff registry with moderation
```

## Product truth

Stuff is where lore becomes almost-commerce.

The shelf can lie about the object, but it cannot lie about checkout.

# Stuff

Stuff is the dormant commerce and lore shelf inside The Breakroom.

## Product idea

```txt
SleepNet Page = room
Stuff Shelf = objects and goods inside the room
Stuff Item = fake product, found object, printable artifact, future merch, or removed rack item
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
src/components/stuff/StuffCard.astro
src/components/stuff/StuffPage.astro
src/pages/stuff/index.astro
src/pages/stuff/[slug].astro
src/styles/stuff.css
```

## Statuses

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

Stuff shelf components can now link shelf items to registry routes:

```txt
/stuff/[slug]
```

Very Good Burger now uses the Stuff registry for its shelf:

```txt
very-good-hat
legal-napkin-pack
burger-receipt-tee
good-sauce-sticker
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
```

Avoid implying a real purchase flow unless an item is explicitly official and connected to a future product system.

## Future expansion

```txt
stuff_items table
stuff_shelves table
sleepnet_site_stuff join table
waitlist/request action
printable artifact downloads
official product distinction
inventory/commerce provider integration
```

## Product truth

Stuff is where lore becomes almost-commerce.

The shelf can lie about the object, but it cannot lie about checkout.

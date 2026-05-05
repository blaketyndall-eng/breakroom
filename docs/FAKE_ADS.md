# Fake Ads

Fake Ads are the rabbit-hole link system for SleepNet and The Breakroom.

## Product idea

```txt
Fake Ad = parody noise + clickable door
```

Fake ads should not be real adtech. They should feel like old-web banner ads, local coupon flyers, pawn shop classifieds, gas station counter cards, OmniShift corporate lies, faction recruitment flyers, and removed offers that still point somewhere.

## Routes

```txt
/dead-link-cemetery
/dead-link-cemetery?ad=[fake-ad-slug]
```

## Files

```txt
src/content/data/fakeAds.ts
src/lib/fakeAds.ts
src/components/ads/FakeAdBlock.astro
src/components/ads/FakeAdStrip.astro
src/components/ads/FakeAdGrid.astro
src/components/ads/FakeAdSidebar.astro
src/pages/dead-link-cemetery.astro
src/styles/fake-ads.css
```

## Destination types

```txt
sleepnet_page
stuff_file
faction_page
search_query
hidden_door
dead_link
external_none
```

## Styles

```txt
banner
sidebar
classified
coupon
stamp
flyer
button
broken_image
```

## Seed categories

```txt
food_burger_gas_station
fake_products
pawn_cash_for_stuff
weird_wellness
productivity_decay
hotline_complaint_desk
events_live_music_tournaments
faction_recruitment
anti_fitness_make_you_worse
legal_scams
dead_links
```

## Current render locations

```txt
/sleepnet homepage
/sleepnet/[slug] pages
/stuff/[slug] pages
/dead-link-cemetery recovered fragments
```

## Components

```txt
FakeAdBlock = single ad card
FakeAdStrip = horizontal/small contextual strip
FakeAdGrid = larger directory/gallery block
FakeAdSidebar = stack for later page sidebars
```

## Selection behavior

Contextual ads score from:

```txt
site type
faction slug
stuff slug
tags
seed weight
deterministic noise
```

The noise is deterministic so rendering stays stable enough while avoiding every context feeling too perfectly sorted.

## Current boundaries

```txt
- No real adtech
- No tracking pixels
- No external monetization
- No payment flow
- No checkout
- No sponsor accounts
```

## Product truth

Fake ads are doors, not monetization.

They should make SleepNet feel bigger than the page the user is on.

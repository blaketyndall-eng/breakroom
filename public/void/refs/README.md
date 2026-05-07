# VOID Style Anchors

This folder holds reference images that drive image-to-image generation
(FLUX Kontext) and define the canonical look of VOID characters.

These files are **served publicly** via Cloudflare Pages — anything dropped
in here is reachable at `/void/refs/<filename>` from the live site, AND
read from disk by `scripts/regen-void-images.mjs` and base64-encoded as
the `input_image` for FLUX Kontext.

## Required anchors

To run the current `pnpm regen-images theRegularSeated` or
`pnpm regen-images theDriver` workflows, drop these files here:

- **`the-regular-black.jpg`** — the canonical THE REGULAR (black knit
  balaclava + white hoodie + white shorts + Mickey-style chunky white boots
  and gloves, glowing red eye-slot, saturated purple background, dotted
  floor shadows). This is the ChatGPT-locked reference.

- **`the-regular-white.jpg`** — the alt "stealth" variant (white knit
  balaclava version, same outfit otherwise). Locked from ChatGPT alt output.

## Also commit `public/void/theRegular.jpg`

The slot `theRegular` in `src/lib/nanoPrompts.ts` is `provider: 'static-asset'`
— it serves directly from `public/void/theRegular.jpg`. Save the
black-mask ChatGPT canonical there too. You can use the same JPG as both
the served asset AND the anchor (just drop it in two places, or symlink).

## Adding a new anchor

1. Save your reference JPG here (e.g. `public/void/refs/the-driver.jpg`)
2. Add an entry to `STYLE_ANCHORS` in `src/lib/nanoPrompts.ts`
3. Mirror the entry in the `STYLE_ANCHORS` constant in
   `scripts/regen-void-images.mjs`
4. Reference it from new slots via `anchorKey: 'yourNewAnchor'`

## Why the duplication between .ts and .mjs?

The regen script is intentionally zero-dependency Node ESM — it can't import
TypeScript directly. So the `STYLE_ANCHORS` and `SLOTS` mirrors in
`scripts/regen-void-images.mjs` need to be updated in lockstep with
`src/lib/nanoPrompts.ts`. This is a known cost of keeping the script
fast and free of build setup.

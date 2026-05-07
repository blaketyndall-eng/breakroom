#!/usr/bin/env node
/**
 * regen-void-images.mjs — Regenerate Replicate-tier VOID slots
 *
 * Usage:
 *   pnpm regen-images                 # regen ALL replicate-* slots
 *   pnpm regen-images theRegular      # regen one slot by key
 *   pnpm regen-images theRegular --staging   # save to void-images-replicate/ only (don't overwrite live /public/void/)
 *
 * Requires REPLICATE_API_TOKEN in env or .env.local at project root.
 *
 * Output paths:
 *   void-images-replicate/<key>.jpg          (review staging — gitignored, Blake reviews here)
 *   public/void/<key>.jpg                    (live serving — committed, served to clients)
 *
 * Default behavior writes BOTH so the next deploy picks up the new image.
 * Pass --staging to write ONLY to review staging — useful when iterating
 * prompts and not yet ready to overwrite the live binary.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// 1. Load token from env or .env.local
// ---------------------------------------------------------------------------
function loadToken() {
  if (process.env.REPLICATE_API_TOKEN) return process.env.REPLICATE_API_TOKEN;
  const envLocalPath = resolve(PROJECT_ROOT, '.env.local');
  if (existsSync(envLocalPath)) {
    const lines = readFileSync(envLocalPath, 'utf8').split('\n');
    for (const line of lines) {
      const m = line.match(/^\s*REPLICATE_API_TOKEN\s*=\s*(.+?)\s*$/);
      if (m) return m[1].replace(/^["']|["']$/g, '');
    }
  }
  return null;
}

const TOKEN = loadToken();
if (!TOKEN) {
  console.error('\n[regen] Missing REPLICATE_API_TOKEN.');
  console.error('  Either: export REPLICATE_API_TOKEN=r8_xxxxx');
  console.error('  Or:     echo "REPLICATE_API_TOKEN=r8_xxxxx" >> .env.local');
  console.error('  Get a fresh token at https://replicate.com/account/api-tokens\n');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 2. Slot definitions (mirror of src/lib/nanoPrompts.ts replicate-flux-pro slots)
// ---------------------------------------------------------------------------
// Kept zero-dependency by mirroring rather than importing the .ts source.
// When slots change in src/lib/nanoPrompts.ts, mirror them below.

const SLOTS = [
  {
    key: 'theRegular',
    // V Pro 3 — locked direction from ChatGPT reference outputs.
    // Black knit balaclava with vertical ribbing + single horizontal eye-slot
    // showing red eyes + white hoodie + white shorts + Mickey-style boots/gloves
    // + purple background + dotted floor shadows.
    width: 1152,
    height: 864,
    seed: 3142,
    prompt: [
      'A counterculture outlaw cartoon character standing in a slight three-quarter side stance with one foot forward and a hint of swagger lean, isolated against a flat saturated purple background (no other elements, no scenery).',
      'He wears a thick black knit wool balaclava covering the entire head, with clearly visible vertical knit ribbing texture rendered as parallel vertical stitch line strokes drawn throughout the mask fabric.',
      'The balaclava has ONE single elongated horizontal almond-shaped eye-slot opening — a wide narrow horizontal cutout (NOT separate circular holes) revealing two glowing solid bright red eyes side by side, with an angry downward-slanted brow tilt at the inner corners.',
      'The mouth and chin area of the mask is fully covered by knit fabric — no mouth hole, no lips visible, no chin showing.',
      'Below the mask he wears a baggy plain white pullover hoodie with the hood bunched at the back of the neck (small hood bunching visible at the collar), totally flat solid white fill with absolutely no shading and no fold creases — only a single thin black outline indicating the hoodie hem at the waist and a thin outline showing the front kangaroo pocket curve.',
      'Below the hoodie he wears baggy mid-thigh white shorts (or short pants), totally flat white fill, NO crease lines, NO interior shading, NO leg muscle definition.',
      'He has big bulbous rounded white cartoon mitten gloves with NO finger separation lines (just a single curved cuff line indicating the wrist).',
      'He wears big chunky bulbous white Mickey-Mouse-style boots with rounded almost-spherical toes, NO visible laces, NO eyelets, NO shadow lines on the boot surface — just the silhouette outline.',
      'The ground beneath him is suggested ONLY by 3 to 5 small dark grey oval shadow dots scattered loosely on the ground plane around his feet (NOT one connected cast shadow shape, NOT a single ellipse — discrete tiny dots).',
      'Drawn in the exact style of Markus Magnusson\'s "Sneaky" character animation series: extremely thick chunky hand-drawn black ink outlines (heavy 10-pixel-equivalent line weight, much heavier than fine vector linework), confident curved lines with a subtle hand-animated wobble, flat 2D vector cartoon illustration, ZERO gradients, ZERO crosshatching, ZERO interior shading lines anywhere on the body or clothing.',
      '1920s-1930s rubberhose animation lineage — Felix the Cat, early Mickey Mouse, Cuphead — but rendered with a modern motion-design flat finish on a solid saturated purple background.',
    ].join(' '),
    negative: [
      'no separate round eye holes, no two-circle eye holes, no three-hole balaclava, no mouth hole, no visible mouth, no visible chin,',
      'no white-sclera eyes, no eye whites, no black pupils on white (the eyes must be solid glowing red ovals with no white showing),',
      'no smooth painted dome mask without knit texture, no two-tone printed mask pattern, no domino mask, no superhero mask, no goggles, no glasses,',
      'no jumpsuit, no coveralls, no zip-up suit, no boiler suit, no onesie, no full-body uniform,',
      'no separated fingers on gloves, no realistic five-finger hands, no flesh-tone hands,',
      'no detailed boot laces, no eyelets, no boot shadow lines, no foot creases,',
      'no thin vector lines, no fine detail linework, no manga, no anime, no shojo,',
      'no fabric folds, no hoodie wrinkles, no body shading, no muscle definition, no contour shading,',
      'no Mickey Mouse ears, no panda ears, no animal ears of any kind,',
      'no Pixar 3D render, no plastic AI sheen, no photorealism, no gradient shading,',
      'no isolated white background, no plain background, no studio backdrop, no scenery, no street, no buildings,',
      'no single connected cast shadow under the figure (only discrete dot shadows)',
    ].join(' '),
  },
];

// ---------------------------------------------------------------------------
// 3. CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const stagingOnly = args.includes('--staging');
const positional = args.filter((a) => !a.startsWith('--'));
const slotFilter = positional[0]; // optional: 'theRegular' or undefined

const targetSlots = slotFilter
  ? SLOTS.filter((s) => s.key === slotFilter)
  : SLOTS;

if (targetSlots.length === 0) {
  console.error(`[regen] No slot matches "${slotFilter}".`);
  console.error(`  Available: ${SLOTS.map((s) => s.key).join(', ')}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 4. Replicate API call (sync via Prefer: wait=60)
// ---------------------------------------------------------------------------
/**
 * Derive a FLUX-supported aspect_ratio string from slot dimensions.
 * FLUX 1.1 Pro accepts: '1:1', '16:9', '21:9', '3:2', '2:3', '4:5', '5:4',
 * '3:4', '4:3', '9:16', '9:21'. We pick the closest match by ratio so a
 * 1152×864 slot maps to '4:3', an 864×1152 slot maps to '3:4', etc.
 */
function deriveAspectRatio(width, height) {
  const candidates = [
    ['1:1', 1 / 1],
    ['16:9', 16 / 9],
    ['21:9', 21 / 9],
    ['3:2', 3 / 2],
    ['2:3', 2 / 3],
    ['4:5', 4 / 5],
    ['5:4', 5 / 4],
    ['3:4', 3 / 4],
    ['4:3', 4 / 3],
    ['9:16', 9 / 16],
    ['9:21', 9 / 21],
  ];
  const target = width / height;
  let best = candidates[0];
  let bestDiff = Math.abs(best[1] - target);
  for (const c of candidates) {
    const d = Math.abs(c[1] - target);
    if (d < bestDiff) {
      bestDiff = d;
      best = c;
    }
  }
  return best[0];
}

async function generate(slot) {
  const aspectRatio = deriveAspectRatio(slot.width, slot.height);
  console.log(`[regen] ${slot.key} — calling Replicate FLUX 1.1 Pro (${aspectRatio}, seed ${slot.seed})…`);

  const res = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        Prefer: 'wait=60',
      },
      body: JSON.stringify({
        input: {
          prompt: slot.prompt,
          aspect_ratio: aspectRatio,
          output_format: 'jpg',
          output_quality: 90,
          safety_tolerance: 5,
          prompt_upsampling: false,
          seed: slot.seed,
        },
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Replicate ${res.status}: ${body}`);
  }

  const data = await res.json();
  if (data.status === 'failed') throw new Error(`Generation failed: ${data.error}`);

  const imageUrl = Array.isArray(data.output) ? data.output[0] : data.output;
  if (!imageUrl) throw new Error(`No output URL in response: ${JSON.stringify(data)}`);

  console.log(`[regen] ${slot.key} — downloading ${imageUrl}`);
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error(`Image download ${imgRes.status}`);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  return buf;
}

// ---------------------------------------------------------------------------
// 5. Save to staging (+ live, unless --staging)
// ---------------------------------------------------------------------------
function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

async function main() {
  for (const slot of targetSlots) {
    try {
      const buf = await generate(slot);

      const stagingDir = resolve(PROJECT_ROOT, 'void-images-replicate');
      ensureDir(stagingDir);
      const stagingPath = resolve(stagingDir, `${slot.key}.jpg`);
      writeFileSync(stagingPath, buf);
      console.log(`[regen] ✓ staging  → ${stagingPath} (${buf.length} bytes)`);

      if (!stagingOnly) {
        const liveDir = resolve(PROJECT_ROOT, 'public', 'void');
        ensureDir(liveDir);
        const livePath = resolve(liveDir, `${slot.key}.jpg`);
        writeFileSync(livePath, buf);
        console.log(`[regen] ✓ live     → ${livePath}`);
      }
    } catch (err) {
      console.error(`[regen] ✗ ${slot.key}:`, err.message);
      process.exitCode = 1;
    }
  }

  console.log('\n[regen] done.');
  if (!stagingOnly) {
    const slotKeys = targetSlots.map((s) => s.key).join(', ');
    console.log('  Next: review staging image, then commit /public/void/ binaries:');
    console.log(`  git add public/void/ && git commit -m "regen: ${slotKeys}"`);
  } else {
    console.log('  Staging-only run. When happy, rerun without --staging to update /public/void/.');
  }
}

main();

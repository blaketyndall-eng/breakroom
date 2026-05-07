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
    width: 896,
    height: 1152,
    seed: 2287,
    prompt: [
      'A 1930s rubberhose cartoon character wearing a thick knit white wool balaclava ski mask covering the entire head.',
      'The balaclava has THREE distinct circular cutout openings: two round eye holes on the upper face revealing only the eyes inside (small black dot pupils on white sclera), and one round mouth hole on the lower face revealing only solid darkness inside.',
      'The knit wool fabric is clearly visible — chunky stitched texture, slightly fuzzy edges around each cutout opening, the holes are real holes cut into fabric (not painted-on shapes).',
      'Below the mask he wears a baggy plain white loose-fitting jumpsuit, totally flat white fill with no creases, no fold lines, no pleats, no shading, no contour lines on the body.',
      'White cuffed gloves, simple white work boots with NO visible laces and NO shadow lines on the boot surface.',
      'Standing relaxed in a slight contrapposto pose, full body shot, isolated on pure white background with one soft cast shadow on the ground beneath the boots.',
      'Drawn in the exact style of Markus Magnusson\'s "Sneaky" character animation series: thick chunky hand-drawn black ink outlines (heavy 8-pixel-equivalent line weight), confident curved lines with slight hand-animated wobble, flat 2D vector cartoon illustration, NO gradients, NO interior detail lines, NO crosshatching.',
      '1920s-1930s rubberhose animation lineage — Felix the Cat, early Mickey Mouse, Cuphead inspiration — but rendered with modern motion-design flat finish.',
    ].join(' '),
    negative: [
      'no Mickey Mouse ears, no panda ears, no animal ears of any kind,',
      'no domino mask, no superhero mask, no goggles, no glasses, no eye paint,',
      'no smooth dome head, no plain white blob, no Baymax, no marshmallow figure,',
      'no hood, no hoodie, no pulled-up shirt collar covering the face,',
      'no jumpsuit creases, no fabric folds, no body shading, no foot shadows,',
      'no thin vector lines, no fine detail linework, no manga style, no anime,',
      'no photorealism, no 3D render, no Pixar fur, no plastic AI sheen,',
      'no skin tone visible anywhere, no exposed face, no mouth lips visible,',
      'no two-tone mask printed pattern (the mask must be solid white knit wool with three real cutout holes)',
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
async function generate(slot) {
  console.log(`[regen] ${slot.key} — calling Replicate FLUX 1.1 Pro…`);

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
          aspect_ratio: '3:4',
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
    console.log('  Next: review staging image, then commit /public/void/ binaries:');
    console.log('  git add public/void/ && git commit -m "regen: theRegular V Pro 2"');
  }
}

main();

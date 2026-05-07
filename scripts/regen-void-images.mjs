#!/usr/bin/env node
/**
 * regen-void-images.mjs — Regenerate VOID image slots
 *
 * Supports four generation providers:
 *   - replicate-flux-pro          text-to-image (FLUX 1.1 Pro)
 *   - replicate-flux-kontext-pro  image-to-image (FLUX Kontext Pro, requires anchorKey)
 *   - replicate-recraft-v3        text-to-image (Recraft V3, native flat-illustration prior)
 *   - static-asset                no generation — slot just serves a committed binary
 *
 * Usage:
 *   pnpm regen-images                 # regen ALL non-static slots
 *   pnpm regen-images theDriver       # regen one slot by key
 *   pnpm regen-images theDriver --staging   # save to staging only
 *
 * Requires REPLICATE_API_TOKEN in env or .env.local at project root.
 *
 * Output paths:
 *   void-images-replicate/<key>.jpg          (review staging — gitignored)
 *   public/void/<key>.jpg                    (live serving — committed)
 *
 * Anchors live at public/void/refs/<anchor-name>.jpg and are read from disk,
 * base64-encoded, and sent as input_image to Kontext.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// 1. Load token
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

// ---------------------------------------------------------------------------
// 2. STYLE_ANCHORS (mirror of src/lib/nanoPrompts.ts)
// ---------------------------------------------------------------------------
const STYLE_ANCHORS = {
  theRegularBlack: {
    diskPath: 'public/void/refs/the-regular-black.jpg',
    description: 'THE REGULAR canonical — black knit balaclava + white hoodie',
  },
  theRegularWhite: {
    diskPath: 'public/void/refs/the-regular-white.jpg',
    description: 'THE REGULAR alt — white knit balaclava + white hoodie',
  },
};

// ---------------------------------------------------------------------------
// 3. SLOTS (mirror of src/lib/nanoPrompts.ts)
// ---------------------------------------------------------------------------
// Update this in lockstep with NANO_PROMPTS in nanoPrompts.ts. Static-asset
// slots are intentionally omitted here — they don't need regeneration.
//
const SLOTS = [
  {
    key: 'theRegularSeated',
    provider: 'replicate-flux-kontext-pro',
    anchorKey: 'theRegularBlack',
    width: 1152,
    height: 864,
    seed: 3143,
    prompt: [
      'Same exact character from the reference image — black knit balaclava with red eye-slot, white hoodie, white shorts, chunky white boots and gloves.',
      'Now seated on a metal fire escape ledge in a slumped relaxed pose, one knee up, the other leg dangling off the edge.',
      'A lit cigarette held between two gloved fingers in his right hand, faint thin grey smoke trailing upward.',
      'Same flat 2D Markus Magnusson Sneaky-style cartoon rendering, same thick black ink outlines, same flat fill colors, same saturated purple background, same dotted floor shadows.',
    ].join(' '),
  },
  {
    key: 'theDriver',
    provider: 'replicate-flux-kontext-pro',
    anchorKey: 'theRegularBlack',
    width: 1152,
    height: 864,
    seed: 4011,
    prompt: [
      'Drawn in EXACTLY the same Markus Magnusson Sneaky cartoon style as the reference image — same thick black ink outlines, same flat fill, same chunky proportions, same saturated purple background, same dotted floor shadows.',
      'But this is a DIFFERENT character: a chauffeur. He wears a black peaked chauffeur cap pulled low over his face, a black knit balaclava with a single red eye-slot underneath the cap, a buttoned-up dark grey double-breasted chauffeur jacket with brass buttons, dark grey trousers, polished black shoes.',
      'He stands in a stiff three-quarter side stance holding a single brass car key dangling from one gloved finger.',
      'Same chunky white cartoon mitten gloves and same Mickey-style bulbous shoes as the reference (just black/dark instead of white).',
    ].join(' '),
  },
];

// ---------------------------------------------------------------------------
// 4. CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const stagingOnly = args.includes('--staging');
const positional = args.filter((a) => !a.startsWith('--'));
const slotFilter = positional[0];

const targetSlots = slotFilter
  ? SLOTS.filter((s) => s.key === slotFilter)
  : SLOTS;

if (targetSlots.length === 0) {
  console.error(`[regen] No slot matches "${slotFilter}".`);
  console.error(`  Available: ${SLOTS.map((s) => s.key).join(', ')}`);
  process.exit(1);
}

if (!TOKEN) {
  console.error('\n[regen] Missing REPLICATE_API_TOKEN.');
  console.error('  Either: export REPLICATE_API_TOKEN=r8_xxxxx');
  console.error('  Or:     echo "REPLICATE_API_TOKEN=r8_xxxxx" >> .env.local');
  console.error('  Get a fresh token at https://replicate.com/account/api-tokens\n');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 5. Helpers
// ---------------------------------------------------------------------------
function deriveAspectRatio(width, height) {
  const candidates = [
    ['1:1', 1], ['16:9', 16/9], ['21:9', 21/9], ['3:2', 1.5], ['2:3', 2/3],
    ['4:5', 0.8], ['5:4', 1.25], ['3:4', 0.75], ['4:3', 4/3],
    ['9:16', 9/16], ['9:21', 9/21],
  ];
  const target = width / height;
  let best = candidates[0];
  let bd = Math.abs(best[1] - target);
  for (const c of candidates) {
    const d = Math.abs(c[1] - target);
    if (d < bd) { bd = d; best = c; }
  }
  return best[0];
}

/** Read an anchor file and return a base64 data URL Replicate can ingest. */
function loadAnchorAsDataUrl(anchorKey) {
  const anchor = STYLE_ANCHORS[anchorKey];
  if (!anchor) throw new Error(`Unknown anchor key: ${anchorKey}`);
  const fullPath = resolve(PROJECT_ROOT, anchor.diskPath);
  if (!existsSync(fullPath)) {
    throw new Error(
      `Anchor file missing at ${anchor.diskPath}. ` +
      `Save your reference JPG to that path first, then rerun.`
    );
  }
  const buf = readFileSync(fullPath);
  const ext = anchor.diskPath.split('.').pop().toLowerCase();
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

// ---------------------------------------------------------------------------
// 6. Provider-specific generators
// ---------------------------------------------------------------------------

async function generateFluxPro(slot) {
  const aspectRatio = deriveAspectRatio(slot.width, slot.height);
  console.log(`[regen] ${slot.key} — FLUX 1.1 Pro (${aspectRatio}, seed ${slot.seed})…`);
  const res = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', Prefer: 'wait=60' },
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
  return handlePrediction(res);
}

async function generateFluxKontextPro(slot) {
  if (!slot.anchorKey) throw new Error(`${slot.key}: kontext slot requires anchorKey`);
  const inputImage = loadAnchorAsDataUrl(slot.anchorKey);
  console.log(`[regen] ${slot.key} — FLUX Kontext Pro (anchor: ${slot.anchorKey}, seed ${slot.seed})…`);
  const res = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', Prefer: 'wait=60' },
      body: JSON.stringify({
        input: {
          prompt: slot.prompt,
          input_image: inputImage,
          // 'match_input_image' preserves the anchor's framing — critical for
          // character continuity. Override only when intentionally reframing.
          aspect_ratio: 'match_input_image',
          output_format: 'jpg',
          output_quality: 90,
          safety_tolerance: 5,
          seed: slot.seed,
        },
      }),
    }
  );
  return handlePrediction(res);
}

async function generateRecraftV3(slot) {
  // Recraft V3 takes a literal pixel `size` string, not aspect_ratio. Closest
  // supported sizes: 1024x1024, 1365x1024, 1707x1024, 2048x1024, 1024x1365,
  // 1024x1707, 1024x2048. Pick the closest to slot dims.
  const supported = [
    '1024x1024', '1365x1024', '1707x1024', '2048x1024',
    '1024x1365', '1024x1707', '1024x2048',
  ];
  const slotRatio = slot.width / slot.height;
  const size = supported
    .map((s) => {
      const [w, h] = s.split('x').map(Number);
      return { s, diff: Math.abs(w / h - slotRatio) };
    })
    .sort((a, b) => a.diff - b.diff)[0].s;

  const style = slot.recraftStyle || 'digital_illustration';
  console.log(`[regen] ${slot.key} — Recraft V3 (${size}, ${style})…`);
  const res = await fetch(
    'https://api.replicate.com/v1/models/recraft-ai/recraft-v3/predictions',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', Prefer: 'wait=60' },
      body: JSON.stringify({ input: { prompt: slot.prompt, size, style } }),
    }
  );
  return handlePrediction(res);
}

async function handlePrediction(res) {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Replicate ${res.status}: ${body}`);
  }
  const data = await res.json();
  if (data.status === 'failed') throw new Error(`Generation failed: ${data.error}`);
  const imageUrl = Array.isArray(data.output) ? data.output[0] : data.output;
  if (!imageUrl) throw new Error(`No output URL: ${JSON.stringify(data)}`);
  console.log(`[regen]   downloading ${imageUrl.slice(0, 60)}…`);
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error(`Image download ${imgRes.status}`);
  return Buffer.from(await imgRes.arrayBuffer());
}

async function generate(slot) {
  switch (slot.provider) {
    case 'replicate-flux-pro': return generateFluxPro(slot);
    case 'replicate-flux-kontext-pro': return generateFluxKontextPro(slot);
    case 'replicate-recraft-v3': return generateRecraftV3(slot);
    default: throw new Error(`Unsupported provider: ${slot.provider}`);
  }
}

// ---------------------------------------------------------------------------
// 7. Main
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

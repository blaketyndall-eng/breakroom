#!/usr/bin/env node
/**
 * scripts/regen-void-images.mjs
 * --------------------------------------------------------------------------
 * Generate VOID hero illustrations via Replicate (FLUX 1.1 Pro). Saves
 * to public/void/<key>.jpg, then you commit + push.
 *
 * Usage:
 *   REPLICATE_API_TOKEN=r8_xxx pnpm regen-images
 * Or with a .env.local file containing REPLICATE_API_TOKEN.
 *
 * Slots are duplicated inline below (rather than imported from
 * src/lib/nanoPrompts.ts) to avoid a TS runtime dependency on this
 * standalone script. When you flip a slot's `provider` to 'replicate-
 * flux-pro' in nanoPrompts.ts, also add it to SLOTS here.
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const OUT_DIR = join(PROJECT_ROOT, 'public', 'void');

// Best-effort .env.local loader (no dotenv dependency).
try {
  const envPath = join(PROJECT_ROOT, '.env.local');
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  }
} catch { /* ignore */ }

const TOKEN = process.env.REPLICATE_API_TOKEN;
if (!TOKEN) {
  console.error('Error: REPLICATE_API_TOKEN env var is required.');
  console.error('  Run: REPLICATE_API_TOKEN=r8_xxx pnpm regen-images');
  console.error('  Or add it to .env.local at the project root.');
  process.exit(1);
}

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// Shared style suffix — must match COMPRESSED_STYLE in nanoPrompts.ts
const SHARED = ' Style anchors: 2001 Neopets pet portrait, Cartoon Network 2001 character bumper, Brain Dead hand-drawn shirt graphic, Beanie Babies hangtag, Adult Swim bumper. Technique: bold black outline 3px, flat two-tone cel shading, no gradients, no glow, hand-drawn wobble, off-balance composition, vector-imperfect, MS Paint feel. Era: 2001-2003 web mascot, low-fi internet kid-portal energy. Cream background.';

// Slots routed to replicate-flux-pro. Add new entries when flipping a slot.
const SLOTS = [
  {
    key: 'mothie',
    aspect: '4:3',
    seed: 11,
    prompt: 'MOTHIE the recurring VOID mascot. A chubby kawaii moth, body roughly as tall as wide. Two big rounded eyes with a single shiny highlight dot in each. Two perky antennae with little curl tips. Fluffy luna-moth-shaped wings spread (dusty pale-lavender wing tops with neon-cyan eye-spot patterns near the edges). One tiny hand raised in a small wave. Warm cream cheek-blush dots under the eyes. Friendly tired-3am personality.' + SHARED,
  },
  {
    key: 'mothStreet',
    aspect: '21:9',
    seed: 66,
    prompt: 'Wide cinematic horizontal scene. A single wistful slim moth with half-closed eyes hovering in front of a glowing streetlight on a tall pole at the right side of frame, casting yellow cone of light onto dark empty asphalt parking lot. Stars in night sky. Faint silhouette of a parked car in distance on left. Quiet cinematic atmospheric mood. Palette: night sky deep indigo to near-black gradient, streetlight halo electric yellow fading to warm orange, asphalt cool gray, moth body warm cream with magenta wing accents.' + SHARED,
  },
  // Add more slots here as you flip them to replicate-flux-pro
];

async function generate(slot) {
  console.log(`\n[${slot.key}] generating via FLUX 1.1 Pro (seed ${slot.seed}, ${slot.aspect})...`);
  const t0 = Date.now();
  const res = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait=60',
      },
      body: JSON.stringify({
        input: {
          prompt: slot.prompt,
          aspect_ratio: slot.aspect,
          output_format: 'jpg',
          output_quality: 90,
          safety_tolerance: 5,
          prompt_upsampling: false,
          seed: slot.seed,
        },
      }),
    }
  );
  const data = await res.json();
  if (data.status !== 'succeeded' || !data.output) {
    console.error(`  FAIL (${data.status}): ${data.error || 'unknown error'}`);
    if (data.logs) console.error(`  logs (tail): ${(data.logs || '').slice(-200)}`);
    return false;
  }
  const url = Array.isArray(data.output) ? data.output[0] : data.output;
  console.log(`  generated in ${Math.round((Date.now() - t0) / 100) / 10}s`);
  console.log(`  fetching: ${url}`);
  const imgRes = await fetch(url);
  if (!imgRes.ok) {
    console.error(`  failed to download image: ${imgRes.status}`);
    return false;
  }
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const dest = join(OUT_DIR, `${slot.key}.jpg`);
  writeFileSync(dest, buf);
  console.log(`  saved ${(buf.length / 1024).toFixed(1)}KB → ${dest.replace(PROJECT_ROOT, '.')}`);
  return true;
}

(async () => {
  console.log(`Regenerating ${SLOTS.length} VOID illustrations via Replicate FLUX 1.1 Pro\n`);
  let ok = 0, fail = 0;
  for (const slot of SLOTS) {
    if (await generate(slot)) ok++;
    else fail++;
  }
  console.log(`\nDone. ${ok} succeeded, ${fail} failed.`);
  if (ok > 0) {
    console.log('\nNext step: commit the new images:');
    console.log('  git add public/void/');
    console.log('  git commit -m "feat(void): regenerate hero images via Replicate FLUX 1.1 Pro"');
    console.log('  git push');
  }
  process.exit(fail > 0 ? 1 : 0);
})();

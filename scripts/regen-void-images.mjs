#!/usr/bin/env node
/**
 * scripts/regen-void-images.mjs
 * --------------------------------------------------------------------------
 * Generate VOID hero illustrations via Replicate (FLUX 1.1 Pro). Saves to
 * public/void/<key>.jpg, then you commit + push.
 *
 * Usage:
 *   REPLICATE_API_TOKEN=r8_xxx pnpm regen-images
 * Or with .env.local at project root containing REPLICATE_API_TOKEN.
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

// Slots routed to replicate-flux-pro. Add new entries when flipping a slot
// in nanoPrompts.ts to use this provider.
const SLOTS = [
  // ============== THE REGULAR — Sneaky-style mascot ==============
  // Self-contained prompt (no SHARED_STYLE suffix) because Sneaky style
  // is anchored on Markus Magnusson's published character series.
  {
    key: 'theRegular',
    aspect: '3:4',
    seed: 1147,
    prompt: `Cartoon character illustration in the EXACT style of Markus Magnusson's 'Sneaky' character series (Dribbble shot 14218415-sneaky) and his 'Magic of Walk Cycles' course illustrations. Rubberhose 1930s-1940s classic animation register — the Cuphead / Felix the Cat / Mickey Mouse / Fleischer Studios aesthetic with modern motion-design clean execution. Bold smooth confident black outlines (4px hand-animated curves, perfectly weighted, NOT vector-stiff and NOT marker-bleed messy — just cartoon-clean). Flat solid color blocks ONLY — NO gradients, NO cel shading, NO interior texture, NO grain. Pure white background.

A single chunky cartoon character standing upright facing forward in a casual neutral pose, arms hanging straight down at sides.

Outfit: plain solid white from head to toe — a single uniform all-white jumpsuit / coverall covering the entire body. Solid white throughout, no scarf, no cuffs, no colored pants, no accessories of any kind.

Head: smooth round dome silhouette with NO ears, NO peaks, NO points. The whole head is wrapped in plain white knit fabric with TWO ROUND COIN-SIZED CIRCLE EYE OPENINGS (two distinct separate circles cut into the white fabric, NOT a band, NOT a visor, NOT goggles — two individual round holes). One small horizontal mouth slit below. Two simple oval YELLOW eyes with slightly angled tops peer through the round eye openings (just yellow eye-color visible, no goggle lenses).

Hands: white four-fingered cartoon-glove hands at sides (Mickey-Mouse-style classic cartoon glove proportions).
Feet: big chunky plain white marshmallow-style cartoon shoes (rounded toe, plain solid white, NOT skates with blades, NOT ski boots, plain rubberhose cartoon shoes).
Ground: small simple black oval ground shadow under feet.

The character is a Markus Magnusson 'Sneaky' character mascot in disguise — same body geometry, head/body/shoe ratio, four-finger glove hands, smooth marshmallow shoes, perfectly weighted black outlines, flat color blocks. Same artist's hand. Just dressed in disguise.`,
  },
  // (Add more entries here as we flip slots to replicate-flux-pro)
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
  console.log(`Regenerating ${SLOTS.length} VOID illustration(s) via Replicate FLUX 1.1 Pro\n`);
  let ok = 0, fail = 0;
  for (const slot of SLOTS) {
    if (await generate(slot)) ok++;
    else fail++;
  }
  console.log(`\nDone. ${ok} succeeded, ${fail} failed.`);
  if (ok > 0) {
    console.log('\nNext step: commit the new images:');
    console.log('  git add public/void/');
    console.log('  git commit -m "feat(void): regenerate via Replicate FLUX 1.1 Pro"');
    console.log('  git push');
  }
  process.exit(fail > 0 ? 1 : 0);
})();

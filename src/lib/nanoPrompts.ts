/**
 * nanoPrompts.ts
 * --------------------------------------------------------------------------
 * Single source of truth for VOID-side illustration prompts + image-URL
 * dispatcher across multiple generators (free + paid).
 *
 * Each prompt has a `provider` field that picks which model generates it.
 * The page calls one master function — imageUrl(p) — and never has to
 * know which backend actually produced the image. Swap a slot's provider
 * to upgrade quality without touching any other code.
 *
 * Free providers (no auth, runtime URL):
 *   pollinations-flux         — default FLUX schnell, best for cartoon
 *   pollinations-flux-realism — photoreal-tuned FLUX, for cinematic scenes
 *   pollinations-turbo        — SDXL turbo, fastest
 *   pollinations-gptimage     — GPT-image-1, only free model with legible text
 *
 * Paid providers (pre-generated, served from /public/void/<key>.jpg):
 *   replicate-flux-pro    — FLUX 1.1 Pro for hero quality
 *   replicate-sdxl-lora   — SDXL + Civitai LoRA for style-specific
 *                           (MF DOOM cartoon, MS Paint, etc.)
 *   replicate-ideogram    — Ideogram 2.0 for posters with real typography
 *   luma-dream            — Luma Dream Machine for image→looping GIF (TODO)
 *
 * Replicate-routed slots use static images committed to /public/void/.
 * Run `pnpm regen-images` (with REPLICATE_API_TOKEN in env) to regenerate.
 * See scripts/regen-void-images.mjs.
 */

export type Provider =
  | 'pollinations-flux'
  | 'pollinations-flux-realism'
  | 'pollinations-turbo'
  | 'pollinations-gptimage'
  | 'replicate-flux-pro'
  | 'replicate-sdxl-lora'
  | 'replicate-ideogram'
  | 'luma-dream';

export interface NanoPrompt {
  key: string;
  subject: string;
  width: number;
  height: number;
  animated?: boolean;
  seed: number;
  provider?: Provider;
  prompt: string;
}

const SHARED_STYLE = `
Style anchors (cite all of them so the result averages between them):
  • Neopets pet portrait illustration (2001 Studio art, soft cel shading,
    big rounded eyes with single highlight)
  • Cartoon Network 2001 character bumper (chunky cute, thick black ink,
    flat color fills)
  • Brain Dead / Online Ceramics shirt graphic (hand-drawn ink with
    deliberate wobble, slightly uncanny, never vector-perfect)
  • Beanie Babies hangtag illustration (commercial-cute, soft palette,
    hangtag composition framing)
  • A24 prop archive (faux-period commerce object, slightly worn,
    period-correct down to small details)
  • Adult Swim character bumper (deadpan weird friend, expression
    carries 60% of the appeal)

Technique: bold black outline ~3px equivalent, intentional slight wobble
(drawn slow, NOT vector traced). Two-tone cel shading: one highlight +
one shadow over a flat base. No gradient mesh. No airbrush. No glow
effects beyond a single soft halo where called for. Off-balance
compositions are a feature.

Palette (restrict to this family; pick 3-5 per illustration):
  Magenta #cc0099, hot pink #ff3d8a, neon green #4cff4c, electric
  yellow #ffe000, toxic cyan #45e8ff, warm purple #b25fff, deep indigo
  #1d2891, dusty pink #ffaad0, pale lavender #c9a8ff, off-cream #fff8d0,
  warm cream #fff5b0, near-black ink #1a0a2e.

Background: transparent or soft cream #fff8d0. Era: 2001-2003 web
mascot. Avoid AI-image tells: extra fingers, smooth gradient meshes,
hyperdetailed micro-rendering, symmetrical-to-the-pixel eyes, generic
clip-art Web 2.0 vector mascot feel, drop-shadow glow / bevel-and-emboss
/ chrome filters, modern flat-design aesthetic.
`.trim();

const COMPRESSED_STYLE = ' Style anchors: 2001 Neopets pet portrait, Cartoon Network 2001 character bumper, Brain Dead hand-drawn shirt graphic, Beanie Babies hangtag, Adult Swim bumper. Technique: bold black outline 3px, flat two-tone cel shading, no gradients, no glow, hand-drawn wobble, off-balance composition, vector-imperfect, MS Paint feel. Era: 2001-2003 web mascot, low-fi internet kid-portal energy. Cream background.';

function brief(slot: string): string {
  return `${slot.trim()}\n\n${SHARED_STYLE}`;
}

function briefForUrl(p: NanoPrompt, maxChars = 700): string {
  const idx = p.prompt.indexOf('Style anchors (cite');
  let brief = idx > 0 ? p.prompt.slice(0, idx).trim() : p.prompt.trim();
  if (brief.length > maxChars) {
    brief = brief.slice(0, maxChars).replace(/\s+\S*$/, '') + '.';
  }
  return brief;
}

// =====================================================================
// FREE PROVIDERS — Pollinations.ai (no auth, runtime URL)
// =====================================================================
const POLLINATIONS_BASE = 'https://image.pollinations.ai/prompt/';

function buildPollinationsUrl(p: NanoPrompt, model: string): string {
  const briefShort = briefForUrl(p);
  const fullPrompt = briefShort + COMPRESSED_STYLE;
  const encoded = encodeURIComponent(fullPrompt);
  const w = Math.min(p.width * 4, 1024);
  const h = Math.min(p.height * 4, 1024);
  return `${POLLINATIONS_BASE}${encoded}?width=${w}&height=${h}&seed=${p.seed}&model=${model}&nologo=true`;
}

export function pollinationsFluxUrl(p: NanoPrompt): string {
  return buildPollinationsUrl(p, 'flux');
}
export function pollinationsRealismUrl(p: NanoPrompt): string {
  return buildPollinationsUrl(p, 'flux-realism');
}
export function pollinationsTurboUrl(p: NanoPrompt): string {
  return buildPollinationsUrl(p, 'turbo');
}
export function pollinationsGptImageUrl(p: NanoPrompt): string {
  return buildPollinationsUrl(p, 'gptimage');
}

// =====================================================================
// PAID PROVIDERS — pre-generated, served from /public/void/<key>.jpg
// =====================================================================
//
// These return a LOCAL FILE PATH. The actual image must be generated
// ahead of time via `pnpm regen-images` (see scripts/regen-void-images.mjs)
// and committed to public/void/. If the file doesn't exist, the browser
// will show a broken-image icon — fall back to pollinations until the
// asset is committed.

function replicateFluxProUrl(p: NanoPrompt): string {
  return `/void/${p.key}.jpg`;
}
function replicateSdxlLoraUrl(p: NanoPrompt): string {
  return `/void/${p.key}.jpg`;
}
function replicateIdeogramUrl(p: NanoPrompt): string {
  return `/void/${p.key}.jpg`;
}
function lumaDreamUrl(p: NanoPrompt): string {
  // GIF served from public/. When wired, regen script will save .gif
  // instead of .jpg — ext switch happens here.
  return `/void/${p.key}.gif`;
}

// =====================================================================
// MASTER DISPATCHER
// =====================================================================
export function imageUrl(p: NanoPrompt): string {
  const provider = p.provider ?? 'pollinations-flux';
  switch (provider) {
    case 'pollinations-flux':         return pollinationsFluxUrl(p);
    case 'pollinations-flux-realism': return pollinationsRealismUrl(p);
    case 'pollinations-turbo':        return pollinationsTurboUrl(p);
    case 'pollinations-gptimage':     return pollinationsGptImageUrl(p);
    case 'replicate-flux-pro':        return replicateFluxProUrl(p);
    case 'replicate-sdxl-lora':       return replicateSdxlLoraUrl(p);
    case 'replicate-ideogram':        return replicateIdeogramUrl(p);
    case 'luma-dream':                return lumaDreamUrl(p);
  }
}

/**
 * Backwards-compat alias. /void/index.astro imports `pollinationsUrl` and
 * we want the page to honor each slot's `provider` field without touching
 * the page. Dispatch via imageUrl() so per-slot routing takes effect.
 */
export function pollinationsUrl(p: NanoPrompt): string {
  return imageUrl(p);
}

// =====================================================================
// THE 10 VOID HOMEPAGE SLOTS
// =====================================================================
export const NANO_PROMPTS: Record<string, NanoPrompt> = {
  mothie: {
    key: 'mothie',
    subject: 'MOTHIE — VOID mascot',
    width: 140, height: 110, seed: 11, animated: true,
    provider: 'pollinations-flux', // flip to 'replicate-flux-pro' after public/void/mothie.jpg is committed
    prompt: brief(`MOTHIE the recurring VOID mascot. A chubby kawaii moth, body roughly as tall as wide. Two big rounded eyes with a single shiny highlight dot in each (slightly off-center for hand-drawn feel). Two perky antennae with little curl tips, sticking straight up. Fluffy luna-moth-shaped wings spread (dusty pale-lavender wing tops with neon-cyan eye-spot patterns near the edges). One tiny hand raised in a small wave. Warm cream cheek-blush dots under the eyes. Personality: the friendly tired friend at 3am. Specific palette: dusty pink fur (#ffaad0), pale lavender wings (#c9a8ff), neon cyan eye-spots (#5ff0ff), warm cream cheek-blush. Background: soft cream oval. Composition: 3/4 front view, slight lean.`),
  },
  newsSwan: {
    key: 'newsSwan',
    subject: 'Swan reading newspaper',
    width: 110, height: 110, seed: 22,
    provider: 'pollinations-gptimage',
    prompt: brief(`A long-necked white swan wearing thick black wayfarer sunglasses, holding up a folded broadsheet newspaper with both wings. Newspaper masthead reads "VOIDEAN TIMES" in chunky display type. Visible front-page headline reads "SWAN DENIES EVERYTHING." Swan beak just visible above the paper, deeply unimpressed expression. Hint of a beat-up red 1990s diner-booth back. A coffee cup with steam in one corner. Palette: white swan, black sunglasses, cream newspaper with deep indigo ink, red booth.`),
  },
  signupBulb: {
    key: 'signupBulb',
    subject: 'Lightbulb with moth',
    width: 70, height: 64, seed: 33, animated: true,
    provider: 'pollinations-flux',
    prompt: brief(`A vintage Edison-style hanging lightbulb (visible filament, classic pear shape) hanging by a black cord from the top of the frame. A tiny silhouette moth circles the bulb. The bulb radiates a warm yellow halo with 4 short triangular rays. Bulb electric yellow with hot white core and warm orange shadow at the base. Black cord, near-black moth silhouette.`),
  },
  wheelOutcomes: {
    key: 'wheelOutcomes',
    subject: 'Wheel of Outcomes',
    width: 70, height: 64, seed: 44,
    provider: 'pollinations-gptimage',
    prompt: brief(`A chunky carnival prize wheel divided into 6 pie-slice sections, each a different bright color (magenta, hot pink, neon green, electric yellow, toxic cyan, warm purple). Each slice has a tiny hand-lettered phrase clearly readable: "GO HOME", "DON'T", "ASK MOM", "MAYBE LATER", "JUST DRIVE", "NEVER". A red pointer arrow at the top. Wheel sits on a small wooden tripod stand. Slight tilt for hand-drawn feel.`),
  },
  scratchcards: {
    key: 'scratchcards',
    subject: 'Scratch-off ticket stack',
    width: 70, height: 64, seed: 55,
    provider: 'pollinations-flux',
    prompt: brief(`A messy fanned stack of 4-5 lottery scratch-off tickets, each a different pastel color (pink, yellow, green, cyan). Partially scratched silver coating revealing different shapes: a star, question mark, the word NO, coffee cup silhouette, swan silhouette. Top ticket has the heading "SCRATCH AND SUFFER" in chunky bubble letters. Coin scrapers visible at the bottom.`),
  },
  mothStreet: {
    key: 'mothStreet',
    subject: 'Moth at streetlight',
    width: 220, height: 100, seed: 66,
    provider: 'pollinations-flux-realism', // flip to 'replicate-flux-pro' after public/void/mothStreet.jpg is committed
    prompt: brief(`Wide cinematic horizontal scene. A single wistful slim moth with half-closed eyes hovering in front of a glowing streetlight on a tall pole at the right side of frame, casting yellow cone of light onto dark empty asphalt parking lot. Stars in night sky. Faint silhouette of a parked car in distance on left. Mood: quieter cinematic atmospheric, like a still from a slow-pan shot in a 90s music video. Palette: night sky deep indigo to near-black gradient, streetlight halo electric yellow fading to warm orange, asphalt cool gray, moth body warm cream with magenta wing accents.`),
  },
  weatherSun: {
    key: 'weatherSun',
    subject: 'Weather sun-with-shades',
    width: 56, height: 48, seed: 77,
    provider: 'pollinations-flux',
    prompt: brief(`A round friendly sun face wearing thick black wayfarer sunglasses, slight asymmetric smile. Yellow body, 8 short triangle rays radiating outward. Single black mole on one cheek for character. Slight orange shadow on the lower face. Tiny icon, max 4 colors, simple shapes only.`),
  },
  voidpoints: {
    key: 'voidpoints',
    subject: 'Coin stack with eyes',
    width: 56, height: 48, seed: 88,
    provider: 'pollinations-flux',
    prompt: brief(`A small stack of 3 gold coins each with a "VP" stamp on the face. The middle coin has two big cute eyes peeking out of a horizontal slit. Top coin tilted at a lazy angle. Bottom coin sits flat. Palette: light gold body, darker amber edge shadow, eyes near-black with white highlights.`),
  },
  voideanTimes: {
    key: 'voideanTimes',
    subject: 'Folded newspaper',
    width: 56, height: 48, seed: 99,
    provider: 'pollinations-gptimage',
    prompt: brief(`A folded broadsheet newspaper at -10 degree diagonal angle. Visible masthead reads "VOIDEAN TIMES" in chunky display type. Below the masthead, 3 faint horizontal lines of body text and one small headline reading "SWAN DENIES". Small fold shadow at the crease. Cream paper with deep indigo ink. Tiny icon, paper takes 80% of frame.`),
  },
  voidpedia: {
    key: 'voidpedia',
    subject: 'Encyclopedia book with question mark',
    width: 56, height: 48, seed: 110,
    provider: 'pollinations-flux',
    prompt: brief(`A thick old-school encyclopedia-style hardcover book, deep purple with gold trim and a gold spine label reading "V". Closed at -8 degree diagonal angle. A floating yellow question mark hovers above-right of the book, slightly tilted. Mysterious-friendly library reference mood.`),
  },
};

export type NanoPromptKey = keyof typeof NANO_PROMPTS;

export function getNanoPrompt(key: NanoPromptKey): NanoPrompt {
  const p = NANO_PROMPTS[key];
  if (!p) throw new Error(`Unknown nano-prompt key: ${key}`);
  return p;
}

export const ALL_NANO_KEYS = Object.keys(NANO_PROMPTS) as NanoPromptKey[];

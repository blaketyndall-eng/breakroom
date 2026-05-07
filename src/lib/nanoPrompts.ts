/**
 * nanoPrompts.ts
 * --------------------------------------------------------------------------
 * Single source of truth for VOID-side illustration prompts. Each prompt is
 * a fully-briefed art direction, not a one-line description, so the 10
 * illustrations on /void read as ONE artist's work — not 10 different AI
 * passes.
 *
 * Two ways the prompts are consumed:
 *
 *   1. The library's `prompt` field is the FULL art brief (subject +
 *      SHARED_STYLE block) intended for high-budget generators like
 *      nanobanana / Gemini 2.5 Flash Image Preview when those land.
 *
 *   2. The `pollinationsUrl(p)` helper trims that to a URL-friendly version
 *      using COMPRESSED_STYLE_SUFFIX (same anchors, fewer words) so it
 *      fits the ~1700 char Pollinations URL ceiling. Used by /void/index
 *      .astro right now to render real images via Pollinations.ai.
 *
 * When self-hosted images land in public/void/<key>.jpg later, swap
 * `pollinationsUrl(p)` for `localUrl(p)` in the page. The data model stays.
 */

export interface NanoPrompt {
  /** Stable key referenced from /void/index.astro via data-nano-key. */
  key: string;
  /** Short label shown in the placeholder fallback when image fails. */
  subject: string;
  /** Output dimensions in pixels (display size). */
  width: number;
  height: number;
  /** True if an animated GIF is preferred over a static PNG. */
  animated?: boolean;
  /** Stable seed for reproducible Pollinations cache hits. */
  seed: number;
  /** The full art brief fed to the image model. */
  prompt: string;
}

/**
 * SHARED_STYLE — the global art-direction floor. Every prompt below
 * appends this so the palette, technique, era, and anti-AI-slop rules
 * are consistent across all 10 slots.
 */
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

Technique:
  • Bold black outline, ~3px equivalent line weight, with intentional
    slight wobble (drawn slow with a patient hand, NOT vector traced).
  • Two-tone cel shading: one highlight tone + one shadow tone over a
    flat base color. No gradient mesh. No airbrush. No glow effects
    beyond a single soft halo where called for.
  • Off-balance compositions are a feature, not a bug — hand-drawn
    energy. Don't center mathematically.

Palette (restrict to this family; pick 3-5 per illustration, never all
of them at once):
  Magenta #cc0099, hot pink #ff3d8a, neon green #4cff4c, electric
  yellow #ffe000, toxic cyan #45e8ff, warm purple #b25fff, deep indigo
  #1d2891, dusty pink #ffaad0, pale lavender #c9a8ff, off-cream #fff8d0,
  warm cream #fff5b0, near-black ink #1a0a2e.

Background: transparent PNG (or a soft cream #fff8d0 circle) so the
image drops cleanly onto the yellow #fff5b0 page background.

Era: 2001-2003 web mascot. Low-fi internet, kid-portal energy, knowing
but friendly.

Avoid (these are the AI-image tells that betray a generator):
  • Extra fingers, six-fingered hands, fused digits.
  • Smooth gradient meshes or photo-real shading.
  • Hyperdetailed micro-rendering on tiny icons.
  • Symmetrical-to-the-pixel eyes (the wobble is the point).
  • Generic clip-art "Web 2.0 vector mascot" feel.
  • Drop-shadow glow / bevel-and-emboss / chrome filters.
  • Modern flat-design aesthetic. We are 2002, on purpose.
`.trim();

/**
 * URL-friendly compressed version of SHARED_STYLE. Same anchors, less
 * verbose. Used by `pollinationsUrl()` to keep total URL length under
 * ~1700 chars (Pollinations ceiling).
 */
const COMPRESSED_STYLE_SUFFIX = ' Style anchors: 2001 Neopets pet portrait, Cartoon Network 2001 character bumper, Brain Dead hand-drawn shirt graphic, Beanie Babies hangtag, Adult Swim bumper. Technique: bold black outline 3px, flat two-tone cel shading, no gradients, no glow, no airbrush, intentional hand-drawn wobble in the lines, off-balance composition, vector-imperfect, MS Paint feel. Era: 2001-2003 web mascot, low-fi internet kid-portal energy. Cream background.';

/** Pollinations.ai public no-auth endpoint base. */
const POLLINATIONS_BASE = 'https://image.pollinations.ai/prompt/';

/**
 * Compose the SHARED_STYLE block onto a per-slot brief.
 */
function brief(slot: string): string {
  return `${slot.trim()}\n\n${SHARED_STYLE}`;
}

/**
 * Compute the live image URL for a slot. Strips the verbose SHARED_STYLE
 * from the stored prompt, replaces with COMPRESSED_STYLE_SUFFIX, encodes,
 * and renders at 4x display size (capped at 1024px) so the browser
 * downscales for sharpness on 2x DPI screens.
 */
export function pollinationsUrl(p: NanoPrompt): string {
  const idx = p.prompt.indexOf('Style anchors (cite');
  const briefOnly = idx > 0 ? p.prompt.slice(0, idx).trim() : p.prompt.trim();
  const fullPrompt = briefOnly + COMPRESSED_STYLE_SUFFIX;
  const encoded = encodeURIComponent(fullPrompt);
  const w = Math.min(p.width * 4, 1024);
  const h = Math.min(p.height * 4, 1024);
  return `${POLLINATIONS_BASE}${encoded}?width=${w}&height=${h}&seed=${p.seed}&model=flux&nologo=true`;
}

/**
 * The 10 VOID homepage illustration slots. Keys are referenced from
 * /void/index.astro via data-nano-key.
 */
export const NANO_PROMPTS: Record<string, NanoPrompt> = {
  mothie: {
    key: 'mothie',
    subject: 'MOTHIE — VOID mascot',
    width: 140, height: 110, seed: 11, animated: true,
    prompt: brief(`MOTHIE — the recurring VOID mascot. A chubby kawaii moth, body roughly as tall as wide. Two big rounded eyes with a single shiny highlight dot in each (slightly off-center for hand-drawn feel). Two perky antennae with little curl tips, sticking straight up. Fluffy wings spread outward (luna-moth-shaped wings: dusty pale-lavender wing tops, with neon-cyan eye-spot patterns near the wing edges, like a Beanie Baby crossed with a luna moth). One tiny hand raised in a small wave. Warm cream cheek-blush dots under the eyes. Personality: the friendly tired friend at 3 a.m. who's always at the table when you sit down. Specific palette: dusty pink fur (#ffaad0), pale lavender wings (#c9a8ff), neon cyan eye-spots (#5ff0ff), warm cream cheek-blush (#ffd6a0). Background: soft cream #fff8d0 oval, very light, or fully transparent. Animation hint (for GIF version): MOTHIE bobs up and down 4px every 1.5 seconds; antennae sway slightly out of phase; cyan eye-spots on wings pulse gently brighter once per cycle. Composition: 3/4 front view, slight lean to one side. Off-balance, like a kid drew it carefully in MS Paint.`),
  },
  newsSwan: {
    key: 'newsSwan',
    subject: 'Swan reading newspaper (newsflash)',
    width: 110, height: 110, seed: 22,
    prompt: brief(`A long-necked white swan wearing thick black wayfarer sunglasses, holding up a folded broadsheet newspaper with both wings. The newspaper masthead reads "VOIDEAN TIMES" in chunky display type. A partial visible front-page headline reads "SWAN DENIES EVERYTHING." The swan's beak is just visible above the paper, slight downturn — deeply unimpressed reading expression. Background: hint of a beat-up red 1990s diner-booth back behind the swan (just suggested, not detailed). A coffee cup with steam rising in one corner. Specific palette: white swan body (#fff8d0 highlights, #d4c8a0 shadows), black sunglasses, cream newspaper with deep indigo #1d2891 ink, red booth #c01060. Composition: 3/4 view, swan in the middle ground, paper in the foreground occupying the lower 40% of the frame.`),
  },
  signupBulb: {
    key: 'signupBulb',
    subject: 'Lightbulb with moth (sign up)',
    width: 70, height: 64, seed: 33, animated: true,
    prompt: brief(`A vintage Edison-style hanging lightbulb (visible filament, classic pear shape) hanging by a black cord from the top of the frame. A tiny silhouette moth (small dark shape) circles the bulb. The bulb radiates a warm yellow halo — 4 short triangular rays around it. Specific palette: bulb electric yellow #ffe000 with a hot white core and warm orange #ff8800 shadow at the base. Black cord, near-black moth silhouette. Animation hint: moth orbits the bulb once every 2 seconds, halo rays pulse slightly. Composition: bulb dead center vertically, hangs from top edge, moth at 3 o'clock position frozen mid-orbit. Tiny scale — keep it readable at 70x64.`),
  },
  wheelOutcomes: {
    key: 'wheelOutcomes',
    subject: 'Wheel of Outcomes (game tile)',
    width: 70, height: 64, seed: 44,
    prompt: brief(`A chunky carnival prize wheel (Wheel-of-Fortune style) divided into 6 pie-slice sections, each a different VOID-palette color. Each slice has a tiny hand-lettered phrase: "GO HOME", "DON'T", "ASK MOM", "MAYBE LATER", "JUST DRIVE", "NEVER". A red pointer arrow at the top of the wheel. The wheel sits on a small wooden tripod stand. Specific palette: 6 slices use magenta / hot pink / neon green / electric yellow / toxic cyan / warm purple. Wood stand warm brown #8b5a2b. Red arrow #c01060. Composition: front-on view, slight tilt to one side for hand-drawn feel.`),
  },
  scratchcards: {
    key: 'scratchcards',
    subject: 'Scratch-off ticket stack (game tile)',
    width: 70, height: 64, seed: 55,
    prompt: brief(`A messy fanned stack of 4-5 lottery scratch-off tickets, each a different pastel color (pink, yellow, green, cyan). Each ticket has been partially scratched off, revealing different shapes through the silver coating: a star, a question mark, the word "NO", a coffee cup silhouette, a swan silhouette. The top ticket reads "SCRATCH & SUFFER!" in chunky bubble letters across the top. A few small coin scrapers (US dimes/quarters with worn edges) are visible at the bottom of the frame, suggesting recent scratching. Specific palette: tickets in pastel pink #ffaad0 / electric yellow #ffe000 / neon green #4cff4c / toxic cyan #45e8ff. Silver scratch coating in cool gray. Coins in warm gray. Composition: tickets fanned diagonally lower-left to upper-right, off-center, slight chaos.`),
  },
  mothStreet: {
    key: 'mothStreet',
    subject: 'Moth at streetlight (Site Tonight feature)',
    width: 220, height: 100, seed: 66,
    prompt: brief(`A wide cinematic horizontal scene. A single moth (DIFFERENT from MOTHIE — this one is wistful, slimmer, eyes half-closed) hovers in front of a glowing streetlight on a tall pole. The streetlight is at the right side of the frame, casting a yellow cone of light downward onto a dark empty asphalt parking lot. Stars visible in the night sky. The faint silhouette of a parked car visible in the distance on the left. A few moths visible as tiny dots circling the light farther up. Mood: quieter, more cinematic, more atmospheric than the spot illustrations. This is the page's narrator-moth in repose. Like a still from a slow-pan shot in a 90s music video. Specific palette: night sky deep indigo #1d2891 to near-black #1a0a2e gradient, streetlight halo electric yellow #ffe000 fading to warm orange #ff8800, asphalt cool gray #404040, moth body warm cream #fff8d0 with magenta #cc0099 wing accents.`),
  },
  weatherSun: {
    key: 'weatherSun',
    subject: 'Weather sun-with-shades',
    width: 56, height: 48, seed: 77,
    prompt: brief(`A round friendly sun face wearing thick black wayfarer sunglasses, slight smile (one corner higher than the other for hand-drawn feel). Yellow body, 8 short triangle rays radiating outward (don't fill the frame edges; leave breathing room). Single black mole on one cheek for character. Specific palette: yellow body #ffe000, sunglasses near-black, mole near-black, slight orange #ff8800 shadow on the lower edge of the face for cel shading. Composition: tiny icon — max 4 colors, simple shapes only.`),
  },
  voidpoints: {
    key: 'voidpoints',
    subject: 'Coin stack with eyes (Voidpoints)',
    width: 56, height: 48, seed: 88,
    prompt: brief(`A small stack of 3 gold coins (each with a "VP" stamp on its face). The middle coin has two big cute eyes peeking out of a horizontal slit, looking up and slightly off to one side. Top coin tilted at a lazy angle, like it's about to slip off. Bottom coin sits flat. Specific palette: light gold #ffd700, darker amber edge #cc9900 shadow, eyes near-black with white highlights. Composition: stack centered, eyes peeking out of the middle. Tiny icon.`),
  },
  voideanTimes: {
    key: 'voideanTimes',
    subject: 'Folded newspaper (Voidean Times)',
    width: 56, height: 48, seed: 99,
    prompt: brief(`A folded broadsheet newspaper at a slight diagonal angle. Visible masthead reads "VOIDEAN TIMES". Below the masthead, 3 faint horizontal lines suggesting body text, and one small headline visible reading "SWAN DENIES." A small fold shadow at the crease. Specific palette: cream paper #fff8d0, deep indigo #1d2891 ink, soft gray fold-shadow #d4c8a0. Composition: paper at -10° angle, takes up 80% of the frame.`),
  },
  voidpedia: {
    key: 'voidpedia',
    subject: 'Encyclopedia book with question mark',
    width: 56, height: 48, seed: 110,
    prompt: brief(`A thick old-school encyclopedia-style book, hardcover, deep purple #6b2d8c with gold trim and spine label "V". A floating yellow question mark hovers above the closed book. Slight diagonal angle. Specific palette: book cover deep purple #6b2d8c, gold trim and label #ffd700, question mark electric yellow #ffe000. Composition: book takes up 75% of the frame at -8° angle, question mark floats above-right.`),
  },
};

export type NanoPromptKey = keyof typeof NANO_PROMPTS;

export function getNanoPrompt(key: NanoPromptKey): NanoPrompt {
  const p = NANO_PROMPTS[key];
  if (!p) throw new Error(`Unknown nano-prompt key: ${key}`);
  return p;
}

export const ALL_NANO_KEYS = Object.keys(NANO_PROMPTS) as NanoPromptKey[];

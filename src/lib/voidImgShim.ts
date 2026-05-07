/**
 * Void Image Shim — re-exports `NANO_PROMPTS` and `pollinationsUrl` for
 * /void/index.astro, but with legacy slot keys (`newsSwan`, `signupBulb`,
 * `wheelOutcomes`, `scratchcards`, `mothStreet`, `weatherSun`, `voidpoints`,
 * `voideanTimes`, `voidpedia`) transparently mapped to existing committed
 * binaries in /public/void/.
 *
 * Why this file exists
 * --------------------
 * The void homepage was authored against an early nano-banana slot register
 * that was rewritten across PR-G/PR-H/PR-I/PR-J/PR-K. The new nanoPrompts.ts
 * dropped those legacy keys, but /void/index.astro was never updated. Each
 * `N.newsSwan` etc. resolved to `undefined` at SSR, and `pollinationsUrl(undefined)`
 * crashed the dispatcher → /void returned HTTP 500.
 *
 * Rather than churn nanoPrompts.ts (canonical slot library, 1.2k lines of
 * locked-direction prompts) or rewrite /void/index.astro's 10 image
 * call-sites, this shim does the smallest possible thing: wraps the slot
 * registry in a Proxy that returns a synthetic stub `NanoPrompt` for each
 * legacy key, where the stub's `key` field points at an existing
 * /void/<existing>.jpg binary. The real `imageUrl()` dispatcher in
 * nanoPrompts.ts then routes the stub through `staticAssetUrl()` and
 * returns `/void/<existing>.jpg` — no crash, no missing image.
 *
 * Use site
 * --------
 * /void/index.astro imports from this file instead of @/lib/nanoPrompts:
 *
 *   import { NANO_PROMPTS, pollinationsUrl } from '@/lib/voidImgShim';
 *
 * Everything downstream (`N.mothie.subject`, `pollinationsUrl(N.foo)`)
 * works unchanged because the Proxy returns NanoPrompt-shaped objects.
 */

import {
  NANO_PROMPTS as REAL_NANO_PROMPTS,
  pollinationsUrl as realPollinationsUrl,
  type NanoPrompt,
} from './nanoPrompts';

/**
 * Legacy void-homepage slot keys mapped to the existing nanoPrompts key
 * whose committed image we reuse. Each pairing was chosen so the vibe of
 * the existing image fits the slot's surrounding copy in /void/index.astro.
 *
 * If we ever want bespoke art for any of these tiles, promote the slot to a
 * real entry in NANO_PROMPTS (with its own /void/<key>.jpg) and remove the
 * line below.
 */
const VOID_LEGACY_FALLBACK_MAP: Record<
  string,
  { targetKey: string; subject: string; width: number; height: number }
> = {
  newsSwan: {
    targetKey: 'foundReptileCouch',
    subject: 'newsflash header — cursed found-photo stand-in',
    width: 240,
    height: 240,
  },
  signupBulb: {
    targetKey: 'theRegular',
    subject: 'signup CTA mascot — THE REGULAR stand-in',
    width: 240,
    height: 240,
  },
  wheelOutcomes: {
    targetKey: 'factionPlayers',
    subject: 'Wheel of Outcomes — pool-hall stand-in',
    width: 200,
    height: 200,
  },
  scratchcards: {
    targetKey: 'districtPoolHall',
    subject: 'Scratchcard Kiosk — pool-hall stand-in',
    width: 200,
    height: 200,
  },
  mothStreet: {
    targetKey: 'districtMotelRow',
    subject: 'moths.afterhours — motel-row stand-in',
    width: 480,
    height: 240,
  },
  weatherSun: {
    targetKey: 'districtParkingLotWest',
    subject: 'Weather Voidean — open-sky lot stand-in',
    width: 160,
    height: 160,
  },
  voidpoints: {
    targetKey: 'factionLotRacers',
    subject: 'Voidpoints rewards — lowrider stand-in',
    width: 160,
    height: 160,
  },
  voideanTimes: {
    targetKey: 'slpnewsHeroIncident',
    subject: 'Voidean Times — newspaper stand-in',
    width: 160,
    height: 160,
  },
  voidpedia: {
    targetKey: 'omnishiftHeroBoardroom',
    subject: 'Voidpedia — corporate-info stand-in',
    width: 160,
    height: 160,
  },
};

function makeStub(
  legacyKey: string,
  fb: { targetKey: string; subject: string; width: number; height: number },
): NanoPrompt {
  return {
    key: fb.targetKey, // staticAssetUrl reads .key → /void/<targetKey>.jpg
    subject: fb.subject,
    width: fb.width,
    height: fb.height,
    seed: 0,
    provider: 'static-asset',
    prompt: `STUB: legacy /void key '${legacyKey}' → reuses /void/${fb.targetKey}.jpg`,
  };
}

/**
 * Proxy-wrapped NANO_PROMPTS. Real keys pass through; legacy keys return a
 * synthetic stub NanoPrompt; truly unknown keys return `undefined` (preserving
 * prior behavior for any code that already guards against missing slots).
 */
export const NANO_PROMPTS: typeof REAL_NANO_PROMPTS = new Proxy(
  REAL_NANO_PROMPTS,
  {
    get(target, prop: string | symbol) {
      if (typeof prop !== 'string') return Reflect.get(target, prop);
      const real = target[prop];
      if (real) return real;
      const fb = VOID_LEGACY_FALLBACK_MAP[prop];
      if (fb) return makeStub(prop, fb);
      return undefined;
    },
  },
);

/**
 * Defensive wrapper around the real `pollinationsUrl` (== imageUrl). If a
 * caller hands us `undefined` (which the original would crash on), return a
 * transparent 1×1 GIF — page renders, missing image is silent.
 */
export function pollinationsUrl(p: NanoPrompt | undefined): string {
  if (!p) {
    return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }
  return realPollinationsUrl(p);
}

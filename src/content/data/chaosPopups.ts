/**
 * ChaosPopups — content pool for the broken-link catastrophe cascade.
 *
 * The CatastropheCascade island picks 4-5 of these at random per render.
 * Six interaction archetypes:
 *
 *   1. statement    — title + body + optional image. No choices, just [×].
 *   2. prompt       — title + body + N labeled buttons; click swaps body
 *                     to the matching response, then auto-closes after a beat.
 *   3. rude-prompt  — like prompt but ANY answer fires the same dismissive
 *                     comeback ("that's very nice, but I did not ask").
 *   4. rps          — rigged rock-paper-scissors. Computer always picks rock
 *                     and gloats. User can lose-only.
 *   5. oregon-trail — multi-stage gag: terminal "thinking" dots → "disgusting"
 *                     → RPS appears → any pick → "Honestly, I don't even
 *                     want to anymore." → close.
 *   6. loyalty-card — animated 10-punch card that fills in then voids itself.
 *
 * Voice rules (per project instructions):
 *   - dry, deadpan, slightly damaged
 *   - useful but broken
 *   - no SaaS/ad-buzzword copy
 *   - if a sentence commits to a bit, commit fully
 *
 * Adding lines: keep most under ~80 chars. The popup is narrow.
 *
 * Random rotation: pickRandomPopups(n) draws N distinct entries with rules:
 *   - At most 1 special-interactive (rps / oregon-trail / loyalty-card) per pick
 *   - At most 1 rude-prompt per pick
 *   - Statements + prompts can repeat-class as long as titles differ
 */

export type ChaosPopupKind =
  | 'statement'
  | 'prompt'
  | 'rude-prompt'
  | 'rps'
  | 'oregon-trail'
  | 'loyalty-card';

export interface PromptChoice {
  /** What the user clicks. Keep short, lowercase usually. */
  label: string;
  /** What the body changes to after the user picks this option. */
  response: string;
}

export interface ChaosPopupBase {
  /** Stable id used as React key + for "seen this one" dedup if we add it later. */
  id: string;
  /** Window-titlebar text. Faux URL keeps the IE6 vibe. */
  title: string;
}

export interface StatementPopupVariant extends ChaosPopupBase {
  kind: 'statement';
  body: string;
  /** Optional sub-line in smaller serif italic, like ad fine-print. */
  sub?: string;
  /** Optional Replicate-generated image at /void/<imageKey>.jpg. Falls back
   *  to typography-only if the image doesn't load. */
  imageKey?: string;
  /** Optional 'mood' style hint — drives background color. */
  mood?: 'pulp' | 'cardboard' | 'caution' | 'paperback' | 'lowfi';
}

export interface PromptPopupVariant extends ChaosPopupBase {
  kind: 'prompt';
  body: string;
  choices: PromptChoice[];
  /** Closing time after a choice is picked, in ms. Default 900. */
  closeAfterMs?: number;
}

export interface RudePromptPopupVariant extends ChaosPopupBase {
  kind: 'rude-prompt';
  body: string;
  /** Just labels — every choice triggers the same comeback. */
  choices: string[];
  comeback: string;
}

export interface RpsPopupVariant extends ChaosPopupBase {
  kind: 'rps';
  body: string;
  /** Verdict text shown after user picks. The computer always picks rock. */
  verdict: string;
}

export interface OregonTrailPopupVariant extends ChaosPopupBase {
  kind: 'oregon-trail';
  /** Optional opening question. Defaults to "Let's settle this like adults". */
  body?: string;
}

export interface LoyaltyCardPopupVariant extends ChaosPopupBase {
  kind: 'loyalty-card';
  /** Card brand line, e.g. "VERY GOOD BURGER · LOYALTY". */
  brand: string;
  /** Big stamped headline once all punches fill in. */
  unlocked: string;
  /** The "but actually" overstamp that voids the reward. */
  voided: string;
}

export type ChaosPopupVariant =
  | StatementPopupVariant
  | PromptPopupVariant
  | RudePromptPopupVariant
  | RpsPopupVariant
  | OregonTrailPopupVariant
  | LoyaltyCardPopupVariant;

/* ------------------------------------------------------------------------- */
/*  THE POOL                                                                  */
/* ------------------------------------------------------------------------- */

export const CHAOS_POPUPS: ChaosPopupVariant[] = [
  // ── statements ─────────────────────────────────────────────────────────
  {
    id: 'have-you-seen-this-man',
    kind: 'statement',
    title: 'milk-carton.va',
    body: 'HAVE YOU SEEN THIS MAN?',
    sub: 'Last filed: about now. We have not been told who this is.',
    imageKey: 'adMissingMan',
    mood: 'paperback',
  },
  {
    id: 'work-in-progress',
    kind: 'statement',
    title: 'wip.txt',
    body: 'WORK IN PROGRESS',
    sub: 'this popup never finished. that is fine.',
    mood: 'cardboard',
  },
  {
    id: 'please-wake-up',
    kind: 'statement',
    title: 'anonymous.bpc',
    body: 'please wake up',
    sub: '— anonymous',
    mood: 'lowfi',
  },
  {
    id: 'lsd-prostitute',
    kind: 'statement',
    title: 'pulppress.va — sponsored',
    body: 'LSD MADE ME A PROSTITUTE',
    sub: 'a TRUE confession. Tell-All paperback. $1.99 at participating drugstores.',
    imageKey: 'adLsdPaperback',
    mood: 'pulp',
  },
  {
    id: 'ahhhhhh-statement',
    kind: 'statement',
    title: 'system.bpc',
    body: 'Ahhhhh!',
    sub: '(continued from a previous popup, possibly)',
    mood: 'caution',
  },
  {
    id: 'free-hoodies',
    kind: 'statement',
    title: 'HEY, CARL!',
    body: 'FREE HOODIES',
    sub: '(none claimed)',
    mood: 'lowfi',
  },

  // ── prompts (Y/N or labeled) ───────────────────────────────────────────
  {
    id: 'expanding-mind',
    kind: 'prompt',
    title: 'a question.bpc',
    body: 'Are you expanding your mind?',
    choices: [
      { label: 'Y', response: 'noted.' },
      { label: 'N', response: 'noted.' },
    ],
  },
  {
    id: 'mature-theme',
    kind: 'prompt',
    title: 'parental-discretion.bpc',
    body: 'Due to Mature theme, parental discretion advised. Do your thing.',
    choices: [
      { label: 'Y', response: 'Filed.' },
      { label: 'N', response: 'Also filed.' },
    ],
  },
  {
    id: 'juice',
    kind: 'prompt',
    title: 'beverage.bpc',
    body: 'Juice that makes you explode. Drink?',
    choices: [
      { label: 'yes', response: 'you exploded.' },
      { label: 'no', response: 'you exploded anyway.' },
    ],
  },
  {
    id: 'only-way-out',
    kind: 'prompt',
    title: 'system.bpc',
    body: 'The only way out is through. Continue?',
    choices: [
      { label: 'y', response: 'continuing.' },
      { label: 'n', response: 'continuing.' },
    ],
  },
  {
    id: 'get-out-of-head',
    kind: 'prompt',
    title: 'tools.bpc',
    body: 'Get out of your head.',
    choices: [
      { label: 'yes', response: 'you are still in your head.' },
      { label: 'no', response: 'you remain in your head.' },
    ],
  },
  {
    id: 'hot-and-single',
    kind: 'prompt',
    title: 'casual.bpc — sponsored',
    body: 'Hot and Single?',
    choices: [
      { label: 'y', response: 'filed.' },
      { label: 'n', response: 'filed anyway.' },
    ],
  },
  {
    id: 'need-a-stimulant',
    kind: 'prompt',
    title: 'pharmacy.bpc',
    body: 'Need a stimulant?',
    choices: [
      { label: 'yes', response: 'we are out.' },
      { label: 'no', response: 'we are still out.' },
    ],
  },
  {
    id: 'ahhhhhh-prompt',
    kind: 'prompt',
    title: 'voicemail.bpc',
    body: 'Ahhhhh!',
    choices: [
      { label: 'continue', response: 'ahhh continued.' },
      { label: 'ahhhhhhh!', response: 'yes.' },
    ],
  },
  {
    id: 'sure-go-ahead',
    kind: 'prompt',
    title: 'permission.bpc',
    body: 'sure sure, go ahead',
    choices: [
      { label: 'go', response: 'going.' },
      { label: 'a head?', response: 'ah.' },
    ],
  },
  {
    id: 'sick-savage-sensual',
    kind: 'prompt',
    title: 'rating.bpc',
    body: "It's SICK, SAVAGE, and SENSUAL!",
    choices: [
      { label: 'sick', response: 'filed under sick.' },
      { label: 'savage', response: 'filed under savage.' },
      { label: 'sensual?', response: 'savage.' },
    ],
  },

  // ── rude prompts (any answer triggers the same dismissive comeback) ─────
  {
    id: 'hows-your-day',
    kind: 'rude-prompt',
    title: 'small-talk.bpc',
    body: "How's your day been?",
    choices: ['good', 'bad'],
    comeback: "that's very nice, but I did not ask",
  },
  {
    id: 'do-you-like-it-here',
    kind: 'rude-prompt',
    title: 'survey.bpc',
    body: 'Do you like it here?',
    choices: ['yes', 'no'],
    comeback: 'nobody is collecting answers.',
  },

  // ── rigged rock-paper-scissors ────────────────────────────────────────
  {
    id: 'rps-classic',
    kind: 'rps',
    title: 'fairplay.bpc',
    body: 'A fair and fast competition. Best of one. Pick.',
    verdict: 'I picked rock. I am the winner.',
  },

  // ── Oregon Trail multi-stage gag ───────────────────────────────────────
  {
    id: 'settle-like-adults',
    kind: 'oregon-trail',
    title: 'arbitration.bpc',
    body: "Let's settle this like adults.",
  },

  // ── loyalty card ───────────────────────────────────────────────────────
  {
    id: 'very-good-burger-loyalty',
    kind: 'loyalty-card',
    title: 'rewards.bpc',
    brand: 'VERY GOOD BURGER · LOYALTY',
    unlocked: 'FREE BURGER UNLOCKED',
    voided: 'KITCHEN CLOSED FOREVER',
  },
];

/* ------------------------------------------------------------------------- */
/*  Random picker                                                             */
/* ------------------------------------------------------------------------- */

/**
 * Draw N popups at random, with rules to prevent overload:
 *   - at most one rps/oregon-trail/loyalty-card variant per pick
 *   - at most one rude-prompt per pick
 *   - the same popup never appears twice
 *
 * N typically = 4-5 (cascade Phase 2 + 3 budget).
 */
export function pickRandomPopups(n: number): ChaosPopupVariant[] {
  // Stable random sample without replacement.
  const pool = [...CHAOS_POPUPS];
  const out: ChaosPopupVariant[] = [];
  let usedSpecial = false;
  let usedRude = false;

  const isSpecial = (v: ChaosPopupVariant) =>
    v.kind === 'rps' || v.kind === 'oregon-trail' || v.kind === 'loyalty-card';

  // Single pass. Shuffle, then take in order with the cap rules.
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  for (const candidate of pool) {
    if (out.length >= n) break;
    if (isSpecial(candidate)) {
      if (usedSpecial) continue;
      usedSpecial = true;
    }
    if (candidate.kind === 'rude-prompt') {
      if (usedRude) continue;
      usedRude = true;
    }
    out.push(candidate);
  }

  return out;
}

/** Pick one specific popup by id — handy for stable testing or seeded URLs. */
export function pickPopupById(id: string): ChaosPopupVariant | undefined {
  return CHAOS_POPUPS.find((p) => p.id === id);
}

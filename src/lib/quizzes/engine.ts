/**
 * Quiz engine — runtime contracts and scoring.
 *
 * One engine, two output modes:
 *   - Foundational quizzes:  full-scale stat contribution → write to
 *                            user_profiles.quiz_outcome and recompute
 *                            derived assignment.
 *   - Scattered quizzes:     0.4× scaled contribution → append to
 *                            quiz_results table; profile recomputes
 *                            from accumulated drift over time.
 *
 * The engine never persists. Callers (signup flow / quiz pages) wire
 * scoring outputs into the supabase client.
 */

import {
  type StatKey,
  type StatVector,
  emptyStats,
  addStats,
  scaleStats,
  clampStats,
} from './stats';

export type QuizKind = 'foundational' | 'scattered';
export type QuizWorld = 'omnishift' | 'voidsignal';

export interface QuizOption {
  id: string;             // 'a' .. 'f'
  text: string;           // shown in VCR menu row
  /** Stat deltas applied if this option is selected. Partial — missing
   *  axes are 0. Range typical ±1 to ±3 for foundational, ±0.5 to ±2
   *  for scattered. */
  stats: Partial<StatVector>;
}

export interface QuizQuestion {
  id: string;             // 'q1' .. 'qN'
  prompt: string;         // shown above the option list
  options: QuizOption[];
  /** Optional. If true, skipping/finalizing without answering this
   *  question is silently allowed (default true — every question
   *  is skippable to honor the "as much or as little effort" rule). */
  skippable?: boolean;
}

export interface Quiz {
  slug: string;           // 'employee-intake', 'bathroom-mirror', etc.
  kind: QuizKind;
  world: QuizWorld;
  /** Long title shown on the directory page and result card. */
  title: string;          // 'EMPLOYEE INTAKE / SHIFT 1'
  /** Short title used in the title bar during the quiz. */
  shortTitle: string;     // 'EMPLOYEE INTAKE'
  /** One-line blurb in directory listings. Keep terse. */
  blurb: string;
  /** Tonal channel color (hex) for the question screens. Foundational
   *  defaults to OmniShift institutional blue or VS warm-dark depending
   *  on world. */
  toneColor?: string;
  questions: QuizQuestion[];
}

export interface QuizAnswers {
  /** questionId → selectedOptionId. Missing entries = unanswered. */
  selected: Record<string, string>;
}

export interface QuizScore {
  /** Stat contribution from this single quiz attempt. NOT yet merged
   *  into the user's profile. */
  contribution: StatVector;
  /** Map of questionId → optionId actually used (filled in if user
   *  finalized early — original answers + deterministic fills). */
  resolvedAnswers: Record<string, string>;
  /** How many questions the user actually answered (vs filled). */
  answeredCount: number;
  totalQuestions: number;
}

// ============================================================
// Scoring
// ============================================================

/**
 * Score a quiz from the user's selected option ids.
 *
 * Behavior:
 *   - Walks every question. For answered questions, applies that option's
 *     stat deltas. For unanswered questions:
 *       - If `fillSeed` is provided, uses fillUnansweredDeterministic
 *         to pick a stable pseudo-random option (seeded by user id).
 *       - If `fillSeed` is null, the question contributes nothing.
 *   - Sums all deltas, then scales by quiz.kind:
 *       foundational → ×1.0
 *       scattered    → ×0.4
 *   - Clamps the final vector to STAT_MIN..STAT_MAX.
 *
 * The scale factor is intentional. A single scattered quiz cannot
 * radically reshape a user's profile, but a steady stream of them can
 * meaningfully drift identity. Foundational quizzes set the spine.
 */
export function scoreQuiz(
  quiz: Quiz,
  answers: QuizAnswers,
  fillSeed: string | null = null,
): QuizScore {
  const totalQuestions = quiz.questions.length;
  let answeredCount = 0;

  const resolvedAnswers: Record<string, string> =
    fillSeed === null
      ? { ...answers.selected }
      : fillUnansweredDeterministic(quiz, answers.selected, fillSeed);

  let raw = emptyStats();
  const scale = quiz.kind === 'foundational' ? 1.0 : 0.4;

  for (const q of quiz.questions) {
    const selId = resolvedAnswers[q.id];
    if (!selId) continue;
    if (answers.selected[q.id]) answeredCount++;
    const opt = q.options.find((o) => o.id === selId);
    if (!opt) continue;
    raw = addStats(raw, scaleStats(opt.stats, scale));
  }

  return {
    contribution: clampStats(raw),
    resolvedAnswers,
    answeredCount,
    totalQuestions,
  };
}

// ============================================================
// Optional-flow: deterministic auto-fill for skipped questions
// ============================================================

/**
 * Deterministic pseudo-random fill for unanswered questions.
 * Same seed → same fills → stable across reloads / re-finalizes.
 *
 * The seed is typically the user's auth uid; pre-auth flows can use
 * a session id. Either way, two users with the same answer set get
 * different fill outcomes (their seeds differ).
 */
export function fillUnansweredDeterministic(
  quiz: Quiz,
  selected: Record<string, string>,
  seed: string,
): Record<string, string> {
  const out = { ...selected };
  let h = simpleHash(seed + '|' + quiz.slug);
  for (const q of quiz.questions) {
    if (out[q.id]) continue;
    h = (h * 9301 + 49297) % 233280;
    const idx = h % q.options.length;
    out[q.id] = q.options[idx].id;
  }
  return out;
}

// Tiny LCG-style hash for stable pseudo-random fills. Good enough for
// quiz fills; not for anything security-adjacent.
function simpleHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

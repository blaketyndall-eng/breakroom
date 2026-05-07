/**
 * Quiz stat axes — the 10 dimensions every quiz outcome is scored against.
 *
 * Treat outcomes as a vector, not a label. "Sink Light Saint" and
 * "Receipt Auditor" aren't stored anywhere as canonical types; they're
 * derived from threshold rules over the stat vector at read time.
 *
 * Edit this file to add/remove/rename axes. The engine, profileSeed,
 * and quiz data files all consume StatKey from here.
 */

export type StatKind = 'skill' | 'personality' | 'tendency' | 'social';

export interface StatAxis {
  key: StatKey;
  label: string;       // SCREEN-CASE for VCR UI
  kind: StatKind;
  desc: string;        // one-liner shown in stat tooltip / share card
}

export const STAT_AXES = [
  // tendencies — what you do when nobody asked
  { key: 'late_hours',    label: 'LATE HOURS',    kind: 'tendency',    desc: 'Time on the books. Comfort after midnight.' },
  { key: 'lot_hours',     label: 'LOT HOURS',     kind: 'tendency',    desc: 'Sitting in a lot for no reason.' },
  { key: 'exit_instinct', label: 'EXIT INSTINCT', kind: 'tendency',    desc: 'How fast you leave when it gets weird.' },

  // personality — internal weather
  { key: 'compliance',    label: 'COMPLIANCE',    kind: 'personality', desc: 'Rule-following. Corporate alignment.' },
  { key: 'witnessing',    label: 'WITNESSING',    kind: 'personality', desc: 'What you notice but don\'t say.' },
  { key: 'warmth',        label: 'WARMTH',        kind: 'personality', desc: 'How cold you would let it get.' },

  // skill — competence-under-conditions
  { key: 'chalk',         label: 'CHALK',         kind: 'skill',       desc: 'Cue aim. Competence under low light.' },
  { key: 'coin',          label: 'COIN',          kind: 'skill',       desc: 'Patience for slow systems.' },

  // social — what the room thinks of you
  { key: 'applause',      label: 'APPLAUSE',      kind: 'social',      desc: 'Earned non-money. Compensation that isn\'t.' },
  { key: 'room_rec',      label: 'ROOM REC',      kind: 'social',      desc: 'Whether the room knows you.' },
] as const satisfies readonly StatAxis[];

export type StatKey = (typeof STAT_AXES)[number]['key'];
export type StatVector = Record<StatKey, number>;

export const STAT_KEYS: readonly StatKey[] = STAT_AXES.map((a) => a.key);
export const STAT_LABELS: Record<StatKey, string> = Object.fromEntries(
  STAT_AXES.map((a) => [a.key, a.label]),
) as Record<StatKey, string>;

export const STAT_MIN = 0;
export const STAT_MAX = 10;

/** Empty / mid-range starting vectors. */
export function emptyStats(): StatVector {
  return Object.fromEntries(STAT_KEYS.map((k) => [k, 0])) as StatVector;
}
export function midStats(): StatVector {
  return Object.fromEntries(STAT_KEYS.map((k) => [k, 5])) as StatVector;
}

/** Clamp every axis into the valid range. Quiz scoring is allowed to push
 *  beyond bounds during accumulation; clamp at persist time. */
export function clampStats(v: Partial<StatVector>): StatVector {
  const out = emptyStats();
  for (const k of STAT_KEYS) {
    const raw = (v[k] ?? 0) as number;
    out[k] = Math.max(STAT_MIN, Math.min(STAT_MAX, Math.round(raw)));
  }
  return out;
}

/** Add b into a (immutable). b can be a partial — missing axes are 0. */
export function addStats(a: StatVector, b: Partial<StatVector>): StatVector {
  const out = { ...a };
  for (const k of STAT_KEYS) {
    if (b[k] !== undefined) out[k] = (out[k] ?? 0) + (b[k] as number);
  }
  return out;
}

/** Scale every axis of a vector by a factor (used for scattered-quiz
 *  contribution dampening — see engine.scoreQuiz). */
export function scaleStats(v: Partial<StatVector>, factor: number): Partial<StatVector> {
  const out: Partial<StatVector> = {};
  for (const k of STAT_KEYS) {
    if (v[k] !== undefined) out[k] = (v[k] as number) * factor;
  }
  return out;
}

/** Top-N axes by value (ties broken by stat-key order). Used to derive
 *  dominant Department/Role/Object from a final vector. */
export function topN(v: StatVector, n: number): StatKey[] {
  return [...STAT_KEYS]
    .sort((a, b) => (v[b] - v[a]) || STAT_KEYS.indexOf(a) - STAT_KEYS.indexOf(b))
    .slice(0, n);
}

/** Distance between two stat vectors — squared Euclidean.
 *  Useful for picking the closest preset persona / department from a list. */
export function statDistance(a: StatVector, b: StatVector): number {
  let total = 0;
  for (const k of STAT_KEYS) {
    const d = a[k] - b[k];
    total += d * d;
  }
  return total;
}

/** Pick the entry from a list of {target, payload} whose target vector is
 *  closest to the given vector. Used to map stats → department, etc. */
export function nearest<T>(
  v: StatVector,
  candidates: Array<{ target: Partial<StatVector>; payload: T }>,
): T | null {
  if (candidates.length === 0) return null;
  let best = candidates[0];
  let bestDist = statDistance(v, clampStats(candidates[0].target));
  for (let i = 1; i < candidates.length; i++) {
    const d = statDistance(v, clampStats(candidates[i].target));
    if (d < bestDist) {
      best = candidates[i];
      bestDist = d;
    }
  }
  return best.payload;
}

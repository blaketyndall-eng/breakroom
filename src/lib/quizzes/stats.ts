/**
 * Quiz stat axes — the 8 dimensions every quiz outcome is scored against.
 *
 * Universal RPG-style stats that apply to any quiz topic, not just
 * Breakroom-specific scenarios. Edit this file to add/remove/rename
 * axes; the engine, profileSeed, and quiz data files all consume
 * StatKey from here.
 */

export type StatKind = 'skill' | 'personality' | 'social' | 'chance' | 'aesthetic';

export interface StatAxis {
  key: StatKey;
  label: string;       // SCREEN-CASE for VCR UI
  kind: StatKind;
  desc: string;        // one-liner for tooltip / share card
}

export const STAT_AXES = [
  { key: 'aim',    label: 'AIM',    kind: 'skill',       desc: 'Precision. Follow-through under pressure.' },
  { key: 'nerve',  label: 'NERVE',  kind: 'personality', desc: 'Boldness. Willing to do the thing.' },
  { key: 'wit',    label: 'WIT',    kind: 'personality', desc: 'Observation. Picking up signals.' },
  { key: 'cool',   label: 'COOL',   kind: 'personality', desc: 'Composure. Keeps it together.' },
  { key: 'heart',  label: 'HEART',  kind: 'personality', desc: 'Emotional weight. Capacity to feel.' },
  { key: 'charm',  label: 'CHARM',  kind: 'social',      desc: 'Social pull. Presence in a room.' },
  { key: 'luck',   label: 'LUCK',   kind: 'chance',      desc: 'Grace under chance.' },
  { key: 'taste',  label: 'TASTE',  kind: 'aesthetic',   desc: 'Discernment. Knowing what is good.' },
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

/** Top-N axes by value (ties broken by stat-key order). */
export function topN(v: StatVector, n: number): StatKey[] {
  return [...STAT_KEYS]
    .sort((a, b) => (v[b] - v[a]) || STAT_KEYS.indexOf(a) - STAT_KEYS.indexOf(b))
    .slice(0, n);
}

/** Squared Euclidean distance between two stat vectors. */
export function statDistance(a: StatVector, b: StatVector): number {
  let total = 0;
  for (const k of STAT_KEYS) {
    const d = a[k] - b[k];
    total += d * d;
  }
  return total;
}

/** Pick the entry whose target vector is closest to the given vector.
 *  Used to map stats → department / role / etc. via fingerprint match. */
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

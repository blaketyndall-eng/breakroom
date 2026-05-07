/**
 * Profile seeding & derivation — bridge between quiz stats and user-
 * profile fields.
 *
 * Two entry points:
 *   - generateProvisionalProfile(userId): runs once at signup, hashes
 *     the user id to a mid-range stat vector + derived assignment.
 *   - applyContribution(currentStats, contribution, userId): merges
 *     a quiz score into existing stats and returns new vector +
 *     recomputed assignment. Caller persists.
 *
 * Derivation rules use *nearest preset* matching against canonical
 * breakroom.ts fixtures — no new content is invented here.
 */

import {
  type StatVector,
  emptyStats,
  addStats,
  clampStats,
  topN,
  nearest,
} from './stats';
import { BREAKROOM_DATA } from '@/content/data/breakroom';

export interface DerivedAssignment {
  department: string;
  role: string;
  assigned_object: string;
  house_rule: string;
  uniform: string;
  preferred_light: string;
  preferred_place: string;
}

export interface ProvisionalProfile {
  stats: StatVector;
  assignment: DerivedAssignment;
}

// ============================================================
// Provisional generator — runs at signup, no quiz required.
// ============================================================

/**
 * Deterministic stat vector from a user id.
 * Each axis lands in 3..7 (mid-range) so the foundational quiz has
 * room to push in any direction.
 */
export function generateProvisionalProfile(userId: string): ProvisionalProfile {
  const stats = emptyStats();
  let h = simpleHash(userId);
  for (const k of Object.keys(stats) as Array<keyof StatVector>) {
    h = (h * 9301 + 49297) % 233280;
    stats[k] = 3 + (h % 5); // 3..7
  }
  const assignment = deriveAssignment(stats, userId);
  return { stats, assignment };
}

// ============================================================
// Contribution application — runs after every quiz finalize.
// ============================================================

/**
 * Zero-mean a contribution vector across all 8 axes.
 *
 * Without this, every quiz answer's option deltas are all positive (e.g.
 * "option C: AIM +2, NERVE +3"), so 10 answered questions push every
 * touched axis toward 10 — ceiling stats. Subtracting the mean per axis
 * preserves the *shape* of preference (which axes won vs. lost) while
 * making the total stat change per question net to zero. Skip-all then
 * stays near the provisional baseline; pick-a-pattern shifts the profile
 * in that pattern's direction without ceilinging.
 */
function zeroMeanContribution(contribution: Partial<StatVector>): Partial<StatVector> {
  const axes = Object.keys(emptyStats()) as Array<keyof StatVector>;
  const total = axes.reduce((sum, k) => sum + (contribution[k] ?? 0), 0);
  const mean = total / axes.length;
  if (mean === 0) return contribution; // nothing to subtract; skip allocation

  const result: Partial<StatVector> = {};
  for (const k of axes) {
    const v = contribution[k] ?? 0;
    // Round so stats stay integer-clean after addStats + clampStats.
    result[k] = Math.round((v - mean) * 10) / 10;
  }
  return result;
}

export function applyContribution(
  current: StatVector,
  contribution: Partial<StatVector>,
  userId: string,
): ProvisionalProfile {
  const normalized = zeroMeanContribution(contribution);
  const merged = clampStats(addStats(current, normalized));
  return { stats: merged, assignment: deriveAssignment(merged, userId) };
}

// ============================================================
// Derivation rules — stats → canonical breakroom.ts pool picks.
// ============================================================

/**
 * Department fingerprints. Each department's "target" is a partial vector
 * describing what a person filed there typically looks like. nearest()
 * picks the closest match for the user's actual vector.
 */
const DEPARTMENT_FINGERPRINTS: Array<{ target: Partial<StatVector>; payload: string }> = [
  { target: { wit: 8, taste: 6, charm: 4 },              payload: 'Fluorescent Operations' },
  { target: { cool: 8, nerve: 4, heart: 5 },             payload: 'Lot Hours' },
  { target: { wit: 7, cool: 7, nerve: 3 },               payload: 'Night Audit' },
  { target: { wit: 8, nerve: 3, charm: 4 },              payload: 'Compliance & Felt' },
  { target: { cool: 7, heart: 3, nerve: 5 },             payload: 'Cold Lots, Bad Coffee' },
  { target: { charm: 8, luck: 4, heart: 6 },             payload: 'Applause Recovery' },
  { target: { cool: 7, aim: 6, wit: 5 },                 payload: 'Idle Engine Sciences' },
  { target: { wit: 7, heart: 7, taste: 6 },              payload: 'Room Acoustics' },
  { target: { nerve: 8, luck: 6, cool: 4 },              payload: 'Vacancy Logistics' },
  { target: { aim: 9, cool: 6, taste: 4 },               payload: 'Chalk & Aim' },
  { target: { taste: 8, heart: 6, charm: 5 },            payload: 'Coat Inventory' },
  { target: { wit: 6, nerve: 7, luck: 6, taste: 5 },     payload: 'After-Hours Cartography' },
];

/**
 * Role fingerprints. Lower stat-count targets so role can fit alongside
 * any department.
 */
const ROLE_FINGERPRINTS: Array<{ target: Partial<StatVector>; payload: string }> = [
  { target: { wit: 8, cool: 6 },               payload: 'Junior Observer' },
  { target: { cool: 9 },                       payload: 'Lead Idler' },
  { target: { taste: 8, heart: 6 },            payload: 'Acting Custodian of Tone' },
  { target: { aim: 7, taste: 5 },              payload: 'Light Operator (Probationary)' },
  { target: { wit: 7, cool: 6, charm: 3 },     payload: 'Receipt Auditor' },
  { target: { heart: 8, charm: 7 },            payload: 'Swan Liaison' },
  { target: { taste: 7, charm: 5, wit: 5 },    payload: 'Hold Music Specialist' },
  { target: { aim: 9 },                        payload: 'Cue Chalker, 2nd Class' },
  { target: { nerve: 8, cool: 6 },             payload: 'Apprentice Closer' },
  { target: { heart: 7, nerve: 3, charm: 4 },  payload: 'Door-Holder, Unrated' },
  { target: { wit: 9, charm: 3 },              payload: 'Witness on Retainer' },
  { target: { taste: 7, nerve: 6 },            payload: 'Hot Dog Inspector' },
];

export function deriveAssignment(stats: StatVector, userId: string): DerivedAssignment {
  const top = topN(stats, 3);

  const department = nearest(stats, DEPARTMENT_FINGERPRINTS) ?? 'Idle Engine Sciences';
  const role = nearest(stats, ROLE_FINGERPRINTS) ?? 'Junior Observer';

  const objects = BREAKROOM_DATA.objectsForHire;
  const assigned_object = objects[stableIndex(userId, top.join(''), objects.length)];

  const house_rule = pickHouseRule(stats);

  const uniformIdx = stableIndex(userId, role, BREAKROOM_DATA.uniforms.length);
  const uniform = BREAKROOM_DATA.uniforms[uniformIdx];

  const preferred_light = pickPreferredLight(stats);
  const preferred_place = pickPreferredPlace(stats);

  return {
    department,
    role,
    assigned_object,
    house_rule,
    uniform,
    preferred_light,
    preferred_place,
  };
}

// ============================================================
// Threshold pickers (direct stat → string lookups)
// ============================================================

function pickHouseRule(stats: StatVector): string {
  const rules = BREAKROOM_DATA.houseRules;
  if (stats.wit >= 7 && stats.charm <= 5) return rules[0]; // Do not thank
  if (stats.aim >= 7) return rules[1]; // Pool is in the DNA
  if (stats.nerve >= 7) return rules[2]; // Clock out. Chalk up.
  if (stats.wit >= 8) return rules[3]; // If the swan is in the passenger seat
  if (stats.heart <= 3) return rules[4]; // Coffee is not fresh
  if (stats.cool >= 7) return rules[5]; // Compliance is observation in a polite shirt
  if (stats.cool >= 6 && stats.heart >= 6) return rules[6]; // You may leave. You may not go home.
  if (stats.wit >= 6 && stats.charm >= 5) return rules[7]; // Room hears you
  if (stats.heart <= 5) return rules[8]; // Bring a hoodie
  return rules[9]; // Applause money
}

function pickPreferredLight(stats: StatVector): string {
  if (stats.wit >= 7 && stats.heart <= 4) return 'fluorescent';
  if (stats.cool >= 7) return 'taillight from across the lot';
  if (stats.heart >= 7) return 'motel sign red';
  if (stats.luck >= 7) return 'vending machine blue';
  if (stats.aim >= 7) return 'dashboard green';
  return 'the one in the bathroom';
}

function pickPreferredPlace(stats: StatVector): string {
  if (stats.cool >= 8) return 'parking lot, parked';
  if (stats.nerve >= 8) return 'one block away';
  if (stats.heart >= 8) return 'motel row';
  if (stats.charm >= 7) return 'phone behind the bar';
  if (stats.heart <= 3) return 'inside, somewhere with vending';
  return 'the lot, but driving';
}

function stableIndex(seed: string, salt: string, modulo: number): number {
  return simpleHash(seed + '|' + salt) % modulo;
}

function simpleHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

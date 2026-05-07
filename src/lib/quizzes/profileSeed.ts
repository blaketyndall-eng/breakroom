/**
 * Profile seeding & derivation — the bridge between quiz stats and
 * user-profile fields.
 *
 * Two entry points:
 *   - generateProvisionalProfile(userId)
 *       Runs once at signup. Hashes the user id into a mid-range stat
 *       vector and derives an assignment. The user lands at /portal
 *       with everything pre-filled — no quiz required.
 *
 *   - applyContribution(currentStats, contribution)
 *       Merges a quiz score (foundational or scattered) into the
 *       user's existing stat vector and returns the new clamped
 *       vector + recomputed assignment. Caller persists to
 *       user_profiles.
 *
 * Derivation rules use *nearest preset* matching against the existing
 * breakroom.ts fixtures — no new content is invented here. Department,
 * role, and object names all come from the canonical pools that
 * ship with the data fixtures.
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
 * Each axis lands in 3..7 (mid-range, no extremes) so the foundational
 * quiz has room to push in any direction.
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
 * Merge a quiz contribution into existing stats. Returns new stats +
 * recomputed assignment. Caller persists.
 *
 * Foundational quizzes overwrite a lot. Scattered quizzes nudge
 * (engine.scoreQuiz already applied the 0.4× scale factor before
 * this is called).
 */
export function applyContribution(
  current: StatVector,
  contribution: Partial<StatVector>,
  userId: string,
): ProvisionalProfile {
  const merged = clampStats(addStats(current, contribution));
  return { stats: merged, assignment: deriveAssignment(merged, userId) };
}

// ============================================================
// Derivation rules — stats → canonical breakroom.ts pool picks.
// ============================================================

/**
 * Canonical mapping from stat vector to user_profile fields.
 *
 * Each derived field uses one of two strategies:
 *   - threshold-based: top-N stats select from a curated department/
 *     role/object pool with stat-fingerprint targets
 *   - direct: a single dominant stat picks from a list (preferred light,
 *     preferred place)
 *
 * The userId is mixed in only as a tiebreaker — two users with
 * identical stats still get slightly different uniforms / objects so
 * the world doesn't feel like an algorithm output.
 */
export function deriveAssignment(stats: StatVector, userId: string): DerivedAssignment {
  const top = topN(stats, 3);

  // Department: nearest of these stat-fingerprints.
  // Targets are partial — only the axes that define each department.
  const department =
    nearest(stats, [
      { target: { compliance: 8, room_rec: 6 },                        payload: 'Fluorescent Operations' },
      { target: { lot_hours: 8, exit_instinct: 4 },                    payload: 'Lot Hours' },
      { target: { late_hours: 8, coin: 7 },                            payload: 'Night Audit' },
      { target: { compliance: 7, witnessing: 6, chalk: 5 },             payload: 'Compliance & Felt' },
      { target: { warmth: 3, coin: 5, late_hours: 7 },                  payload: 'Cold Lots, Bad Coffee' },
      { target: { applause: 8, room_rec: 7 },                          payload: 'Applause Recovery' },
      { target: { lot_hours: 7, witnessing: 6, exit_instinct: 3 },      payload: 'Idle Engine Sciences' },
      { target: { witnessing: 8, room_rec: 4 },                        payload: 'Room Acoustics' },
      { target: { exit_instinct: 8, late_hours: 4 },                   payload: 'Vacancy Logistics' },
      { target: { chalk: 9, compliance: 5 },                           payload: 'Chalk & Aim' },
      { target: { warmth: 4, witnessing: 5, applause: 3 },             payload: 'Coat Inventory' },
      { target: { witnessing: 7, exit_instinct: 6, late_hours: 6 },     payload: 'After-Hours Cartography' },
    ]) ?? 'Idle Engine Sciences';

  // Role from primary axis kind.
  const role =
    nearest(stats, [
      { target: { compliance: 8 }, payload: 'Junior Observer' },
      { target: { lot_hours: 8 },  payload: 'Lead Idler' },
      { target: { warmth: 3 },     payload: 'Acting Custodian of Tone' },
      { target: { room_rec: 8 },   payload: 'Light Operator (Probationary)' },
      { target: { coin: 8 },       payload: 'Receipt Auditor' },
      { target: { witnessing: 9 }, payload: 'Swan Liaison' },
      { target: { applause: 7 },   payload: 'Hold Music Specialist' },
      { target: { chalk: 9 },      payload: 'Cue Chalker, 2nd Class' },
      { target: { exit_instinct: 8 }, payload: 'Apprentice Closer' },
      { target: { compliance: 4, witnessing: 6 }, payload: 'Door-Holder, Unrated' },
      { target: { witnessing: 8, applause: 4 }, payload: 'Witness on Retainer' },
      { target: { late_hours: 9 }, payload: 'Hot Dog Inspector' },
    ]) ?? 'Junior Observer';

  // Object — paired with role energy. Tiebreaker by userId hash.
  const objects = BREAKROOM_DATA.objectsForHire;
  const objIdx = stableIndex(userId, top.join(''), objects.length);
  const assigned_object = objects[objIdx];

  // House rule — pick by dominant personality stat.
  const house_rule = pickHouseRule(stats);

  // Uniform — picked from canonical list, paired with role.
  const uniformIdx = stableIndex(userId, role, BREAKROOM_DATA.uniforms.length);
  const uniform = BREAKROOM_DATA.uniforms[uniformIdx];

  // Preferred light — direct from quiz Q4 in foundational, else inferred.
  const preferred_light = pickPreferredLight(stats);

  // Preferred place — derived from lot/exit pattern.
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
// Field-specific picker helpers
// ============================================================

function pickHouseRule(stats: StatVector): string {
  const rules = BREAKROOM_DATA.houseRules;
  // Map dominant personality stat → rule index.
  if (stats.compliance >= 7 && stats.witnessing >= 5) return rules[0]; // Do not thank
  if (stats.chalk >= 7) return rules[1]; // Pool is in the DNA
  if (stats.exit_instinct >= 7) return rules[2]; // Clock out. Chalk up.
  if (stats.witnessing >= 8) return rules[3]; // If the swan is in passenger seat
  if (stats.warmth <= 3) return rules[4]; // Coffee is not fresh
  if (stats.compliance >= 6) return rules[5]; // Compliance is observation in polite shirt
  if (stats.lot_hours >= 7) return rules[6]; // You may leave. You may not go home.
  if (stats.witnessing >= 5 && stats.room_rec >= 5) return rules[7]; // Room hears you
  if (stats.warmth <= 5) return rules[8]; // Bring a hoodie
  return rules[9]; // Applause money
}

function pickPreferredLight(stats: StatVector): string {
  if (stats.compliance >= 7) return 'fluorescent';
  if (stats.lot_hours >= 7) return 'taillight from across the lot';
  if (stats.late_hours >= 8) return 'motel sign red';
  if (stats.coin >= 7) return 'vending machine blue';
  if (stats.witnessing >= 7) return 'dashboard green';
  return 'the one in the bathroom';
}

function pickPreferredPlace(stats: StatVector): string {
  if (stats.lot_hours >= 8) return 'parking lot, parked';
  if (stats.exit_instinct >= 8) return 'one block away';
  if (stats.late_hours >= 8) return 'motel row';
  if (stats.coin >= 7) return 'phone behind the bar';
  if (stats.warmth <= 3) return 'inside, somewhere with vending';
  return 'the lot, but driving';
}

// Stable index from a string seed — used to break ties without
// introducing genuine randomness (ensures the same user always
// gets the same uniform / object for the same stat profile).
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

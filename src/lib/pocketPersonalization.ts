/**
 * Pocket Personalization Engine
 *
 * Read-only aggregator. Merges faction drift, turf membership, Regular File,
 * drawer contents, and behavioral history into a single PocketIdentity.
 * Never writes to localStorage — each system owns its own key.
 *
 * Used by: field prompts, slips, radio, lot conditions, Make One Thing,
 * share cards, bump zone, signal bar.
 *
 * Design: cached per page load. Call getPocketIdentity() freely from any component.
 */

import { loadLocalRegularFile, type RegularFile } from '@/lib/regularFiles';
import { getTopFactionDrift, getFactionSignalSummary, type FactionSignalSummary } from '@/lib/factionDrift';
import { getLocalMembership, type TurfMembership } from '@/lib/turfMembership';
import { getSavedStuffItems, type SavedStuffItem } from '@/lib/savedStuff';

// --- Types ---

export type PocketIdentity = {
  // Turf (formal faction membership)
  turf: string | null;
  turfMembership: TurfMembership | null;

  // Drift (informal faction signals)
  driftFaction: string | null;
  driftScore: number;
  driftSummary: FactionSignalSummary[];

  // Regular File (identity)
  handle: string;
  displayName: string;
  assignedObject: string;
  favoriteLight: string;
  bio: string;
  awayMessage: string;
  theme: string;
  hasRegularFile: boolean;

  // Drawer (inventory)
  drawerItems: SavedStuffItem[];
  drawerCount: number;
  recentDrawerItem: string | null;

  // Behavioral history
  doorsFound: number;
  codesEntered: number;
  getLostCount: number;
  fieldReportsCompleted: number;
  visitCount: number;
};

export type PersonalizedPool<T> = {
  layer: 'turf' | 'drift' | 'drawer' | 'profile' | 'universal';
  /** Faction slug this pool targets, if applicable */
  factionSlug?: string;
  items: T[];
};

// --- Defaults (graceful fallbacks for empty state) ---

const DEFAULTS = {
  handle: 'unknown employee',
  displayName: 'unknown employee',
  assignedObject: 'the thing you were given',
  favoriteLight: 'fluorescent hum',
  bio: '',
  awayMessage: 'not available',
  theme: 'corrupted_employee_portal',
  factionName: 'the room',
  drawerItem: 'something you saved',
  driftFaction: 'the room',
} as const;

// --- Cache ---

let _cachedIdentity: PocketIdentity | null = null;
let _cacheTimestamp = 0;
const CACHE_TTL = 30_000; // 30 seconds — covers a typical Pocket session

// --- Safe localStorage readers ---

function safeReadJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function safeReadArray(key: string): unknown[] {
  return safeReadJSON<unknown[]>(key, []);
}

// --- Core: Build Identity ---

function buildIdentity(): PocketIdentity {
  // Turf
  const turfMembership = getLocalMembership();
  const turf = turfMembership?.factionSlug ?? null;

  // Drift
  const driftSummary = getFactionSignalSummary();
  const topDrift = getTopFactionDrift();
  const driftFaction = topDrift?.factionSlug ?? null;
  const driftScore = topDrift?.total ?? 0;

  // Regular File
  const regularFile = loadLocalRegularFile();
  const hasRegularFile = regularFile !== null;

  // Drawer
  let drawerItems: SavedStuffItem[] = [];
  try {
    drawerItems = getSavedStuffItems();
  } catch {
    drawerItems = [];
  }
  const recentDrawerItem = drawerItems.length > 0 ? drawerItems[0].name : null;

  // Behavioral counts
  const doors = safeReadArray('breakroom.hidden-doors.v1');
  const codes = safeReadArray('breakroom.entered-codes.v1');
  const getLostHistory = safeReadArray('breakroom.get-lost-history.v1');
  const fieldReports = safeReadJSON<Record<string, unknown>>('breakroom.field-prompts.v1', {});
  const visitCountRaw = safeReadJSON<number>('breakroom.pocket-visits', 0);

  return {
    turf,
    turfMembership,
    driftFaction,
    driftScore,
    driftSummary,
    handle: regularFile?.handle ?? DEFAULTS.handle,
    displayName: regularFile?.display_name ?? DEFAULTS.displayName,
    assignedObject: regularFile?.assigned_object ?? DEFAULTS.assignedObject,
    favoriteLight: regularFile?.favorite_light ?? DEFAULTS.favoriteLight,
    bio: regularFile?.bio ?? DEFAULTS.bio,
    awayMessage: regularFile?.away_message ?? DEFAULTS.awayMessage,
    theme: regularFile?.theme ?? DEFAULTS.theme,
    hasRegularFile,
    drawerItems,
    drawerCount: drawerItems.length,
    recentDrawerItem,
    doorsFound: doors.length,
    codesEntered: codes.length,
    getLostCount: getLostHistory.length,
    fieldReportsCompleted: Array.isArray(fieldReports) ? fieldReports.length : Object.keys(fieldReports).length,
    visitCount: visitCountRaw,
  };
}

// --- Public API ---

/**
 * Get the current user's Pocket identity.
 * Cached per page load (30s TTL). Safe to call from any component.
 */
export function getPocketIdentity(): PocketIdentity {
  const now = Date.now();
  if (_cachedIdentity && (now - _cacheTimestamp) < CACHE_TTL) {
    return _cachedIdentity;
  }
  _cachedIdentity = buildIdentity();
  _cacheTimestamp = now;
  return _cachedIdentity;
}

/** Force-refresh the cached identity (call after a state-changing action). */
export function invalidateIdentityCache(): void {
  _cachedIdentity = null;
  _cacheTimestamp = 0;
}

/**
 * Fill template strings with identity values.
 * Supports: ${handle}, ${factionName}, ${assignedObject}, ${drawerItem},
 *           ${driftFaction}, ${favoriteLight}, ${displayName}, ${awayMessage},
 *           ${bio}, ${theme}
 *
 * All templates have graceful fallbacks — no template breaks on empty state.
 */
export function fillTemplate(template: string, identity?: PocketIdentity): string {
  const id = identity ?? getPocketIdentity();

  // Resolve faction name from turf or drift
  let factionName = DEFAULTS.factionName;
  if (id.turf) {
    // Will be resolved to display name by caller if needed,
    // but slug is the reliable key
    factionName = id.turf;
  } else if (id.driftFaction) {
    factionName = id.driftFaction;
  }

  const replacements: Record<string, string> = {
    handle: id.handle,
    displayName: id.displayName,
    factionName,
    assignedObject: id.assignedObject,
    favoriteLight: id.favoriteLight,
    drawerItem: id.recentDrawerItem ?? DEFAULTS.drawerItem,
    driftFaction: id.driftFaction ?? DEFAULTS.driftFaction,
    awayMessage: id.awayMessage,
    bio: id.bio,
    theme: id.theme,
    drawerCount: String(id.drawerCount),
    doorsFound: String(id.doorsFound),
    visitCount: String(id.visitCount),
  };

  return template.replace(/\$\{(\w+)\}/g, (match, key) => {
    return replacements[key] ?? match;
  });
}

/**
 * Select content from personalized pools using the 5-layer cascade.
 *
 * Priority: turf (40%) → drift (30%) → drawer (15%) → profile (10%) → universal (fallback)
 *
 * If the matching pool for a layer is empty or the layer doesn't apply,
 * falls through to the next. Universal is always the final fallback.
 */
export function selectPersonalizedContent<T>(
  pools: PersonalizedPool<T>[],
  identity?: PocketIdentity,
): T {
  const id = identity ?? getPocketIdentity();

  // Organize pools by layer
  const byLayer: Record<string, PersonalizedPool<T>[]> = {};
  for (const pool of pools) {
    if (!byLayer[pool.layer]) byLayer[pool.layer] = [];
    byLayer[pool.layer].push(pool);
  }

  // Helper: pick random item from matching pools
  function pickFrom(layerPools: PersonalizedPool<T>[] | undefined, factionFilter?: string | null): T | null {
    if (!layerPools || layerPools.length === 0) return null;

    let candidates: T[] = [];
    for (const pool of layerPools) {
      if (factionFilter && pool.factionSlug && pool.factionSlug !== factionFilter) continue;
      candidates = candidates.concat(pool.items);
    }

    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  const roll = Math.random();

  // Layer 1: Turf (40%) — requires formal membership
  if (roll < 0.4 && id.turf) {
    const result = pickFrom(byLayer['turf'], id.turf);
    if (result) return result;
  }

  // Layer 2: Drift (30%) — requires drift signals
  if (roll < 0.7 && id.driftFaction && id.driftScore >= 2) {
    const result = pickFrom(byLayer['drift'], id.driftFaction);
    if (result) return result;
  }

  // Layer 3: Drawer (15%) — requires 3+ items
  if (roll < 0.85 && id.drawerCount >= 3) {
    const result = pickFrom(byLayer['drawer']);
    if (result) return result;
  }

  // Layer 4: Profile (10%) — requires Regular File
  if (roll < 0.95 && id.hasRegularFile) {
    const result = pickFrom(byLayer['profile']);
    if (result) return result;
  }

  // Layer 5: Universal (fallback — always works)
  const universal = pickFrom(byLayer['universal']);
  if (universal) return universal;

  // Absolute fallback: pick from any pool
  const allItems = pools.flatMap(p => p.items);
  return allItems[Math.floor(Math.random() * allItems.length)];
}

/**
 * Check if the user has enough identity for personalized content.
 * Returns a tier: 'veteran' | 'regular' | 'drifter' | 'newcomer'
 */
export function getIdentityTier(identity?: PocketIdentity): 'veteran' | 'regular' | 'drifter' | 'newcomer' {
  const id = identity ?? getPocketIdentity();

  if (id.turf && id.hasRegularFile && id.drawerCount >= 3) return 'veteran';
  if (id.hasRegularFile || id.turf) return 'regular';
  if (id.driftFaction && id.driftScore >= 2) return 'drifter';
  return 'newcomer';
}

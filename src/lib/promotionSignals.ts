/**
 * Promotion / Canon Signals (PR 50)
 *
 * Tracks how SleepNet pages gain visibility within the world.
 * Not likes/upvotes. Signals like "Pass this around" and "The room noticed."
 *
 * Canon status levels:
 *   unknown → seen_around → locally_famous → canon
 *
 * Signals that contribute:
 *   - pass_around: user explicitly shares/recommends a page
 *   - guestbook_density: guestbook entries accumulate
 *   - search_appearance: page appears in search results
 *   - door_connection: page is connected to a hidden door
 *   - agent_mention: an NPC/agent references the page
 *   - visit_frequency: repeated visits from different sessions
 */

export type CanonStatus = 'unknown' | 'seen_around' | 'locally_famous' | 'canon';

export type PromotionSignalType =
  | 'pass_around'
  | 'guestbook_density'
  | 'search_appearance'
  | 'door_connection'
  | 'agent_mention'
  | 'visit_frequency';

export type PromotionSignal = {
  siteSlug: string;
  signalType: PromotionSignalType;
  weight: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
};

export type SitePromotionState = {
  siteSlug: string;
  totalWeight: number;
  canonStatus: CanonStatus;
  signals: PromotionSignal[];
  lastSignalAt: string | null;
};

const PROMOTION_STORAGE_KEY = 'breakroom.promotion-signals.v1';
const PROMOTION_EVENT = 'breakroom:promotion-signal';

// Thresholds for canon status progression
const THRESHOLDS = {
  seen_around: 5,
  locally_famous: 15,
  canon: 40,
} as const;

// Signal weights (default if not specified)
const DEFAULT_WEIGHTS: Record<PromotionSignalType, number> = {
  pass_around: 5,
  guestbook_density: 2,
  search_appearance: 1,
  door_connection: 8,
  agent_mention: 3,
  visit_frequency: 1,
};

// --- Storage ---

function readSignalMap(): Record<string, PromotionSignal[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(PROMOTION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeSignalMap(map: Record<string, PromotionSignal[]>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PROMOTION_STORAGE_KEY, JSON.stringify(map));
}

// --- Public API ---

/**
 * Record a promotion signal for a site.
 */
export function recordPromotionSignal(input: {
  siteSlug: string;
  signalType: PromotionSignalType;
  weight?: number;
  metadata?: Record<string, unknown>;
}): SitePromotionState {
  const { siteSlug, signalType, metadata } = input;
  const weight = input.weight ?? DEFAULT_WEIGHTS[signalType];

  const signal: PromotionSignal = {
    siteSlug,
    signalType,
    weight,
    timestamp: new Date().toISOString(),
    metadata,
  };

  const map = readSignalMap();
  const existing = map[siteSlug] ?? [];

  // Dedup: don't record same signal type more than once per 10 minutes
  const tenMinAgo = Date.now() - 10 * 60 * 1000;
  const isDuplicate = existing.some(
    (s) => s.signalType === signalType && new Date(s.timestamp).getTime() > tenMinAgo
  );

  if (!isDuplicate) {
    map[siteSlug] = [...existing, signal].slice(-100); // Keep last 100 signals per site
    writeSignalMap(map);

    // Dispatch event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(PROMOTION_EVENT, { detail: { signal, state: getPromotionState(siteSlug) } }));
    }
  }

  return getPromotionState(siteSlug);
}

/**
 * Get the current promotion state for a site.
 */
export function getPromotionState(siteSlug: string): SitePromotionState {
  const map = readSignalMap();
  const signals = map[siteSlug] ?? [];
  const totalWeight = signals.reduce((sum, s) => sum + s.weight, 0);
  const lastSignalAt = signals.length ? signals[signals.length - 1].timestamp : null;

  return {
    siteSlug,
    totalWeight,
    canonStatus: calculateCanonStatus(totalWeight),
    signals,
    lastSignalAt,
  };
}

/**
 * Calculate canon status from total weight.
 */
export function calculateCanonStatus(totalWeight: number): CanonStatus {
  if (totalWeight >= THRESHOLDS.canon) return 'canon';
  if (totalWeight >= THRESHOLDS.locally_famous) return 'locally_famous';
  if (totalWeight >= THRESHOLDS.seen_around) return 'seen_around';
  return 'unknown';
}

/**
 * Get canonical weight for a site (used by portal sorting).
 * This is the numeric value that feeds into SleepNetSite.canonical_weight.
 */
export function getCanonicalWeight(siteSlug: string): number {
  const state = getPromotionState(siteSlug);
  return state.totalWeight;
}

/**
 * Get human-readable label for canon status.
 */
export function getCanonStatusLabel(status: CanonStatus): string {
  const labels: Record<CanonStatus, string> = {
    unknown: 'Not Listed',
    seen_around: 'Seen Around',
    locally_famous: 'Known Around Here',
    canon: 'Filed. The room noticed.',
  };
  return labels[status];
}

/**
 * Get all sites that have reached a minimum canon status.
 */
export function getSitesAtStatus(minStatus: CanonStatus): string[] {
  const map = readSignalMap();
  const statusOrder: CanonStatus[] = ['unknown', 'seen_around', 'locally_famous', 'canon'];
  const minIndex = statusOrder.indexOf(minStatus);

  return Object.keys(map).filter((slug) => {
    const state = getPromotionState(slug);
    return statusOrder.indexOf(state.canonStatus) >= minIndex;
  });
}

/**
 * Record a "pass this around" signal — the primary user promotion action.
 */
export function passItAround(siteSlug: string): SitePromotionState {
  return recordPromotionSignal({
    siteSlug,
    signalType: 'pass_around',
    metadata: { action: 'user_explicit' },
  });
}

/**
 * Record a search appearance signal — called when a site shows up in results.
 */
export function recordSearchAppearance(siteSlug: string): void {
  recordPromotionSignal({
    siteSlug,
    signalType: 'search_appearance',
    weight: 1,
  });
}

/**
 * Listen for promotion signal events.
 */
export function onPromotionSignal(callback: (detail: { signal: PromotionSignal; state: SitePromotionState }) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (event: Event) => callback((event as CustomEvent).detail);
  window.addEventListener(PROMOTION_EVENT, handler);
  return () => window.removeEventListener(PROMOTION_EVENT, handler);
}

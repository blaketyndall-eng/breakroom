/**
 * Top 8 / Seen Around — PR 53
 *
 * MySpace-style Top 8 friends list + passive "Seen Around" signals.
 * Local-first with future Supabase path.
 */

// --- Types ---

export type TopEightEntry = {
  handle: string;
  displayName: string;
  addedAt: string;
  note?: string;
};

export type SeenAroundEntry = {
  handle: string;
  displayName: string;
  location: string; // slug of page/event/faction where seen
  locationType: 'event' | 'guestbook' | 'faction' | 'sleepnet' | 'locker';
  seenAt: string;
};

// --- Storage Keys ---

const TOP_EIGHT_KEY = 'breakroom.top-eight.v1';
const SEEN_AROUND_KEY = 'breakroom.seen-around.v1';

// --- Top 8 ---

export function getTopEight(): TopEightEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(TOP_EIGHT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTopEight(entries: TopEightEntry[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOP_EIGHT_KEY, JSON.stringify(entries));
}

export function addToTopEight(entry: Omit<TopEightEntry, 'addedAt'>): TopEightEntry | null {
  const current = getTopEight();

  // Max 8
  if (current.length >= 8) return null;

  // No duplicates
  if (current.some((e) => e.handle === entry.handle)) return null;

  const newEntry: TopEightEntry = {
    ...entry,
    addedAt: new Date().toISOString(),
  };

  saveTopEight([...current, newEntry]);
  return newEntry;
}

export function removeFromTopEight(handle: string): boolean {
  const current = getTopEight();
  const filtered = current.filter((e) => e.handle !== handle);
  if (filtered.length === current.length) return false;
  saveTopEight(filtered);
  return true;
}

export function reorderTopEight(handles: string[]): TopEightEntry[] {
  const current = getTopEight();
  const ordered = handles
    .map((h) => current.find((e) => e.handle === h))
    .filter(Boolean) as TopEightEntry[];
  saveTopEight(ordered);
  return ordered;
}

export function isInTopEight(handle: string): boolean {
  return getTopEight().some((e) => e.handle === handle);
}

// --- Seen Around ---

export function getSeenAround(): SeenAroundEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SEEN_AROUND_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSeenAround(entries: SeenAroundEntry[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SEEN_AROUND_KEY, JSON.stringify(entries));
}

/**
 * Record that someone was seen somewhere.
 * Keeps last 50 sightings, deduplicates same handle+location within 1 hour.
 */
export function recordSeenAround(entry: Omit<SeenAroundEntry, 'seenAt'>): SeenAroundEntry | null {
  const current = getSeenAround();

  // Deduplicate: same handle + location within 1 hour
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  const duplicate = current.find(
    (e) =>
      e.handle === entry.handle &&
      e.location === entry.location &&
      new Date(e.seenAt).getTime() > oneHourAgo
  );
  if (duplicate) return null;

  const newEntry: SeenAroundEntry = {
    ...entry,
    seenAt: new Date().toISOString(),
  };

  const updated = [...current, newEntry].slice(-50);
  saveSeenAround(updated);
  return newEntry;
}

/**
 * Get recent sightings for a specific handle.
 */
export function getSeenAroundForHandle(handle: string): SeenAroundEntry[] {
  return getSeenAround().filter((e) => e.handle === handle);
}

/**
 * Get recent sightings at a specific location.
 */
export function getSeenAroundAtLocation(location: string): SeenAroundEntry[] {
  return getSeenAround().filter((e) => e.location === location);
}

/**
 * Get the most recent unique handles seen around (for display).
 */
export function getRecentSeenHandles(limit = 12): SeenAroundEntry[] {
  const all = getSeenAround();
  const seen = new Set<string>();
  const unique: SeenAroundEntry[] = [];

  for (let i = all.length - 1; i >= 0 && unique.length < limit; i--) {
    if (!seen.has(all[i].handle)) {
      seen.add(all[i].handle);
      unique.push(all[i]);
    }
  }

  return unique;
}

// --- Seeded "Seen Around" Data (NPCs and world regulars) ---

export const SEEDED_REGULARS: { handle: string; displayName: string }[] = [
  { handle: 'rudy-44', displayName: 'Rudy 44' },
  { handle: 'eddy-pool', displayName: 'Eddy Pool' },
  { handle: 'room-hand', displayName: 'Room Hand' },
  { handle: 'lot-arms', displayName: 'Lot Arms' },
  { handle: 'no-eddy', displayName: 'No Eddy' },
  { handle: 'reg-3', displayName: 'Reg 3' },
  { handle: 'the-unknown', displayName: 'Unknown' },
  { handle: 'very-good-clerk', displayName: 'Very Good Clerk' },
  { handle: 'night-manager', displayName: 'Night Manager' },
  { handle: 'phone-behind-bar', displayName: 'Phone Behind The Bar' },
  { handle: 'pawn-counter-guy', displayName: 'Pawn Counter Guy' },
  { handle: '711-clerk', displayName: '7/11 Clerk' },
];

/**
 * Get default Top 8 for seeded/preview Regular Files.
 */
export function getDefaultTopEight(): TopEightEntry[] {
  return SEEDED_REGULARS.slice(0, 8).map((r) => ({
    handle: r.handle,
    displayName: r.displayName,
    addedAt: '2003-06-15T01:47:00.000Z',
  }));
}

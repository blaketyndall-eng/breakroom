/**
 * World Ledger — PR 58
 *
 * Event recording and continuity engine.
 * Tracks world events: page changes, stuff movements, faction drift,
 * door unlocks, crew formations, admin actions, weather shifts.
 *
 * Public ledger shows redacted entries.
 * Wire Room ledger shows full detail.
 */

// --- Types ---

export type LedgerEventType =
  | 'page_created'
  | 'page_published'
  | 'page_hidden'
  | 'page_removed'
  | 'stuff_appeared'
  | 'stuff_claimed'
  | 'stuff_moved'
  | 'faction_drift'
  | 'faction_joined'
  | 'crew_formed'
  | 'crew_disbanded'
  | 'door_unlocked'
  | 'door_moved'
  | 'weather_shift'
  | 'radio_broadcast'
  | 'admin_action'
  | 'system_toggle'
  | 'guestbook_signed'
  | 'district_opened'
  | 'district_closed'
  | 'event_started'
  | 'event_ended'
  | 'unknown';

export type LedgerVisibility = 'public' | 'admin_only' | 'redacted';

export type LedgerEntry = {
  id: string;
  type: LedgerEventType;
  timestamp: number;
  headline: string;        // Public-facing short description
  detail?: string;         // Admin-only full detail
  redactedLine?: string;   // What the public sees instead of detail
  targetType?: string;     // e.g. 'page', 'stuff', 'faction', 'crew'
  targetSlug?: string;
  actor?: string;          // who/what caused it
  district?: string;       // district slug where it happened
  visibility: LedgerVisibility;
  tags: string[];
  metadata?: Record<string, unknown>;
};

export type LedgerFilter = {
  type?: LedgerEventType | LedgerEventType[];
  visibility?: LedgerVisibility;
  district?: string;
  actor?: string;
  since?: number;
  limit?: number;
};

// --- Storage ---

const STORAGE_KEY = 'breakroom.world-ledger.v1';

function loadEntries(): LedgerEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: LedgerEntry[]): void {
  if (typeof window === 'undefined') return;
  // Keep max 500 entries
  const trimmed = entries.slice(0, 500);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

// --- Recording ---

let entryCounter = 0;

function generateId(): string {
  entryCounter++;
  return `ledger-${Date.now()}-${entryCounter}-${Math.random().toString(36).slice(2, 6)}`;
}

export function recordLedgerEvent(input: {
  type: LedgerEventType;
  headline: string;
  detail?: string;
  redactedLine?: string;
  targetType?: string;
  targetSlug?: string;
  actor?: string;
  district?: string;
  visibility?: LedgerVisibility;
  tags?: string[];
  metadata?: Record<string, unknown>;
}): LedgerEntry {
  const entry: LedgerEntry = {
    id: generateId(),
    type: input.type,
    timestamp: Date.now(),
    headline: input.headline,
    detail: input.detail,
    redactedLine: input.redactedLine || generateRedaction(input.type),
    targetType: input.targetType,
    targetSlug: input.targetSlug,
    actor: input.actor,
    district: input.district,
    visibility: input.visibility || 'public',
    tags: input.tags || [],
    metadata: input.metadata,
  };

  const entries = loadEntries();
  entries.unshift(entry);
  saveEntries(entries);

  return entry;
}

// --- Retrieval ---

export function getLedgerEntries(filter?: LedgerFilter): LedgerEntry[] {
  let entries = loadEntries();

  if (filter) {
    if (filter.type) {
      const types = Array.isArray(filter.type) ? filter.type : [filter.type];
      entries = entries.filter((e) => types.includes(e.type));
    }
    if (filter.visibility) {
      entries = entries.filter((e) => e.visibility === filter.visibility);
    }
    if (filter.district) {
      entries = entries.filter((e) => e.district === filter.district);
    }
    if (filter.actor) {
      entries = entries.filter((e) => e.actor === filter.actor);
    }
    if (filter.since) {
      entries = entries.filter((e) => e.timestamp >= filter.since!);
    }
  }

  const limit = filter?.limit || 50;
  return entries.slice(0, limit);
}

export function getPublicLedger(limit = 30): LedgerEntry[] {
  const entries = loadEntries();
  return entries
    .filter((e) => e.visibility !== 'admin_only')
    .slice(0, limit);
}

export function getAdminLedger(limit = 100): LedgerEntry[] {
  return loadEntries().slice(0, limit);
}

export function getLedgerStats() {
  const entries = loadEntries();
  const now = Date.now();
  const dayAgo = now - 86400000;
  const weekAgo = now - 604800000;

  const typeCounts: Partial<Record<LedgerEventType, number>> = {};
  for (const e of entries) {
    typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
  }

  return {
    total: entries.length,
    today: entries.filter((e) => e.timestamp > dayAgo).length,
    thisWeek: entries.filter((e) => e.timestamp > weekAgo).length,
    publicCount: entries.filter((e) => e.visibility === 'public').length,
    redactedCount: entries.filter((e) => e.visibility === 'redacted').length,
    adminOnlyCount: entries.filter((e) => e.visibility === 'admin_only').length,
    typeCounts,
    recentEntries: entries.slice(0, 10),
  };
}

// --- Redaction generator ---

const REDACTION_LINES: Record<string, string[]> = {
  page_created: [
    'A new URL was filed.',
    'The directory grew by one.',
    'Something appeared where nothing was.',
  ],
  page_hidden: [
    'A page was removed from the index.',
    'The directory shortened itself.',
    'One URL stopped being listed.',
  ],
  stuff_appeared: [
    'An object was cataloged.',
    'The shelf gained weight.',
    'Something was placed somewhere.',
  ],
  faction_drift: [
    'The room noticed someone.',
    'A table shifted its attention.',
    'Proximity was registered.',
  ],
  door_unlocked: [
    'A door moved.',
    'Access changed.',
    'The building rearranged.',
  ],
  crew_formed: [
    'A new group was filed.',
    'Names appeared together.',
    'The directory added a cluster.',
  ],
  admin_action: [
    'Staff did something.',
    'An action was taken from the wire.',
    'Management intervened.',
  ],
  default: [
    'Something happened.',
    'The ledger updated.',
    'A record was filed.',
    'The room noticed.',
  ],
};

function generateRedaction(type: LedgerEventType): string {
  const lines = REDACTION_LINES[type] || REDACTION_LINES.default;
  return lines[Math.floor(Math.random() * lines.length)];
}

// --- Continuity helpers ---

export function getRecentActivityForDistrict(districtSlug: string, limit = 10): LedgerEntry[] {
  return getLedgerEntries({ district: districtSlug, limit });
}

export function getRecentActivityForTarget(targetType: string, targetSlug: string, limit = 10): LedgerEntry[] {
  const entries = loadEntries();
  return entries
    .filter((e) => e.targetType === targetType && e.targetSlug === targetSlug)
    .slice(0, limit);
}

// --- Seed entries (for first load) ---

const SEED_ENTRIES: Omit<LedgerEntry, 'id'>[] = [
  {
    type: 'page_created',
    timestamp: Date.now() - 86400000 * 7,
    headline: 'SleepNet acquired by OmniShift.',
    detail: 'Acquisition finalized. All indexed URLs transferred.',
    redactedLine: 'A large transfer occurred.',
    visibility: 'public',
    tags: ['omnishift', 'acquisition'],
    actor: 'omnishift-legal',
  },
  {
    type: 'district_opened',
    timestamp: Date.now() - 86400000 * 5,
    headline: 'Pool Hall County opened to visitors.',
    detail: 'District status changed from restricted to open.',
    redactedLine: 'A district changed status.',
    district: 'pool-hall-county',
    visibility: 'public',
    tags: ['district'],
    actor: 'system',
  },
  {
    type: 'door_unlocked',
    timestamp: Date.now() - 86400000 * 3,
    headline: 'A door was found near the parking lot.',
    redactedLine: 'A door moved.',
    district: 'parking-lot-west',
    visibility: 'redacted',
    tags: ['hidden-door'],
    actor: 'unknown',
  },
  {
    type: 'weather_shift',
    timestamp: Date.now() - 86400000 * 2,
    headline: 'Lot weather changed to humid / flickering lights.',
    detail: 'Weather system updated via cron. New conditions propagated.',
    redactedLine: 'Conditions changed.',
    district: 'parking-lot-west',
    visibility: 'public',
    tags: ['weather'],
    actor: 'system',
  },
  {
    type: 'admin_action',
    timestamp: Date.now() - 86400000,
    headline: 'Wire Room flagged 2 pages for review.',
    detail: 'Pages flagged: motel-vacancy-forever, wrong-dept-memo-4.',
    visibility: 'admin_only',
    tags: ['moderation'],
    actor: 'wire-room-admin',
  },
  {
    type: 'radio_broadcast',
    timestamp: Date.now() - 3600000 * 6,
    headline: 'Radio 1:47 transmitted a weather report.',
    redactedLine: 'The broadcast layer updated.',
    visibility: 'public',
    tags: ['radio'],
    actor: 'radio-tower-147',
    district: 'radio-tower-147',
  },
];

export function seedLedgerIfEmpty(): void {
  const entries = loadEntries();
  if (entries.length > 0) return;

  const seeded: LedgerEntry[] = SEED_ENTRIES.map((e, i) => ({
    ...e,
    id: `seed-ledger-${i}`,
  }));

  saveEntries(seeded);
}

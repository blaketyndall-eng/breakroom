/**
 * World Ledger — PR 58 / V2 PR 65
 *
 * Event recording and continuity engine.
 * Tracks world events: page changes, stuff movements, faction drift,
 * door unlocks, crew formations, admin actions, weather shifts.
 *
 * V2 additions:
 *   - Tag-based filtering and tag cloud generation
 *   - Timeline grouping (day buckets for visual timeline)
 *   - Event correlation (related events by target/actor)
 *   - District activity heatmap data
 *   - Event subscription system (other components react to new events)
 *   - Density scoring for "the room has been busy" indicator
 *   - Extended seed data for richer first-load experience
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
  until?: number;            // V2: upper bound timestamp
  tags?: string[];           // V2: match entries with any of these tags
  targetType?: string;       // V2: filter by target type
  targetSlug?: string;       // V2: filter by target slug
  search?: string;           // V2: text search across headline + detail
  limit?: number;
};

// V2: Timeline grouping bucket
export type LedgerDayBucket = {
  date: string;         // YYYY-MM-DD
  label: string;        // Human label: "Today", "Yesterday", "May 3, 2026"
  entries: LedgerEntry[];
  density: number;      // 0-1 scale, how busy relative to max day
};

// V2: District activity summary
export type DistrictActivity = {
  district: string;
  eventCount: number;
  lastEvent: number;    // timestamp
  topTypes: LedgerEventType[];
};

// V2: Tag cloud entry
export type LedgerTagCount = {
  tag: string;
  count: number;
};

// V2: Correlation group — related events by shared target or actor
export type LedgerCorrelation = {
  key: string;          // e.g. "page/motel-vacancy-forever" or "actor/night-manager"
  label: string;
  entries: LedgerEntry[];
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
  notifySubscribers(entry);

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
    // V2 filters
    if (filter.until) {
      entries = entries.filter((e) => e.timestamp <= filter.until!);
    }
    if (filter.tags && filter.tags.length > 0) {
      entries = entries.filter((e) => e.tags.some((t) => filter.tags!.includes(t)));
    }
    if (filter.targetType) {
      entries = entries.filter((e) => e.targetType === filter.targetType);
    }
    if (filter.targetSlug) {
      entries = entries.filter((e) => e.targetSlug === filter.targetSlug);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      entries = entries.filter((e) =>
        e.headline.toLowerCase().includes(q) ||
        (e.detail && e.detail.toLowerCase().includes(q)) ||
        (e.redactedLine && e.redactedLine.toLowerCase().includes(q))
      );
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

// --- V2: Timeline grouping ---

function dateKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function dateLabel(key: string): string {
  const today = dateKey(Date.now());
  const yesterday = dateKey(Date.now() - 86400000);
  if (key === today) return 'Today';
  if (key === yesterday) return 'Yesterday';
  const [y, m, d] = key.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[m - 1]} ${d}, ${y}`;
}

export function getLedgerTimeline(filter?: LedgerFilter): LedgerDayBucket[] {
  const entries = getLedgerEntries({ ...filter, limit: filter?.limit || 200 });
  const bucketMap = new Map<string, LedgerEntry[]>();

  for (const e of entries) {
    const key = dateKey(e.timestamp);
    const bucket = bucketMap.get(key) || [];
    bucket.push(e);
    bucketMap.set(key, bucket);
  }

  const maxCount = Math.max(1, ...Array.from(bucketMap.values()).map((b) => b.length));

  const buckets: LedgerDayBucket[] = [];
  for (const [key, dayEntries] of bucketMap) {
    buckets.push({
      date: key,
      label: dateLabel(key),
      entries: dayEntries,
      density: dayEntries.length / maxCount,
    });
  }

  // Sort newest day first
  buckets.sort((a, b) => b.date.localeCompare(a.date));
  return buckets;
}

// --- V2: Tag cloud ---

export function getLedgerTagCloud(limit = 20): LedgerTagCount[] {
  const entries = loadEntries();
  const counts = new Map<string, number>();

  for (const e of entries) {
    for (const tag of e.tags) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// --- V2: District activity heatmap ---

export function getDistrictActivity(): DistrictActivity[] {
  const entries = loadEntries();
  const districtMap = new Map<string, { count: number; lastEvent: number; types: Map<LedgerEventType, number> }>();

  for (const e of entries) {
    if (!e.district) continue;
    const existing = districtMap.get(e.district) || { count: 0, lastEvent: 0, types: new Map() };
    existing.count++;
    existing.lastEvent = Math.max(existing.lastEvent, e.timestamp);
    existing.types.set(e.type, (existing.types.get(e.type) || 0) + 1);
    districtMap.set(e.district, existing);
  }

  return Array.from(districtMap.entries())
    .map(([district, data]) => ({
      district,
      eventCount: data.count,
      lastEvent: data.lastEvent,
      topTypes: Array.from(data.types.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([type]) => type),
    }))
    .sort((a, b) => b.eventCount - a.eventCount);
}

// --- V2: Event correlation ---

export function getCorrelatedEvents(entry: LedgerEntry, limit = 10): LedgerEntry[] {
  const entries = loadEntries();
  return entries
    .filter((e) =>
      e.id !== entry.id && (
        (entry.targetSlug && e.targetSlug === entry.targetSlug) ||
        (entry.actor && e.actor === entry.actor) ||
        (entry.district && e.district === entry.district && e.tags.some((t) => entry.tags.includes(t)))
      )
    )
    .slice(0, limit);
}

export function getCorrelationGroups(filter?: LedgerFilter): LedgerCorrelation[] {
  const entries = getLedgerEntries({ ...filter, limit: 200 });
  const groups = new Map<string, { label: string; entries: LedgerEntry[] }>();

  for (const e of entries) {
    // Group by target
    if (e.targetType && e.targetSlug) {
      const key = `${e.targetType}/${e.targetSlug}`;
      const g = groups.get(key) || { label: `${e.targetType}: ${e.targetSlug.replace(/-/g, ' ')}`, entries: [] };
      g.entries.push(e);
      groups.set(key, g);
    }
  }

  // Only return groups with 2+ events (actual correlations)
  return Array.from(groups.entries())
    .filter(([, g]) => g.entries.length >= 2)
    .map(([key, g]) => ({ key, label: g.label, entries: g.entries }))
    .sort((a, b) => b.entries.length - a.entries.length);
}

// --- V2: Density scoring ---

export function getLedgerDensity(): { score: number; label: string; eventsToday: number } {
  const entries = loadEntries();
  const dayAgo = Date.now() - 86400000;
  const eventsToday = entries.filter((e) => e.timestamp > dayAgo).length;

  if (eventsToday >= 20) return { score: 1, label: 'The room has been very busy.', eventsToday };
  if (eventsToday >= 10) return { score: 0.7, label: 'Activity was noticed.', eventsToday };
  if (eventsToday >= 3) return { score: 0.4, label: 'A few things happened.', eventsToday };
  if (eventsToday >= 1) return { score: 0.2, label: 'The ledger updated.', eventsToday };
  return { score: 0, label: 'Nothing was recorded. Or nothing was allowed to be.', eventsToday };
}

// --- V2: Event subscription ---

type LedgerSubscriber = (entry: LedgerEntry) => void;
const subscribers: LedgerSubscriber[] = [];

export function onLedgerEvent(fn: LedgerSubscriber): () => void {
  subscribers.push(fn);
  return () => {
    const idx = subscribers.indexOf(fn);
    if (idx >= 0) subscribers.splice(idx, 1);
  };
}

function notifySubscribers(entry: LedgerEntry): void {
  for (const fn of subscribers) {
    try { fn(entry); } catch { /* subscriber errors don't break recording */ }
  }
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
  // V2 extended seed entries for richer first-load
  {
    type: 'stuff_appeared',
    timestamp: Date.now() - 86400000 * 4,
    headline: 'A matchbook appeared on the counter at Motel Row.',
    detail: 'Object: matchbook-motel-row. Source unclear. Filed under lost-and-found.',
    redactedLine: 'An object was cataloged.',
    targetType: 'stuff',
    targetSlug: 'matchbook-motel-row',
    district: 'motel-row',
    visibility: 'public',
    tags: ['stuff', 'motel-row'],
    actor: 'unknown',
  },
  {
    type: 'crew_formed',
    timestamp: Date.now() - 86400000 * 3.5,
    headline: 'A crew registered near the back booth.',
    detail: 'Crew: late-checkout. 3 founding members. No faction alignment declared.',
    redactedLine: 'Names appeared together.',
    targetType: 'crew',
    targetSlug: 'late-checkout',
    district: 'back-booth',
    visibility: 'public',
    tags: ['crew', 'back-booth'],
    actor: 'unknown',
  },
  {
    type: 'guestbook_signed',
    timestamp: Date.now() - 86400000 * 2.5,
    headline: 'Guestbook entry added to Pool Hall County.',
    redactedLine: 'Someone wrote something down.',
    targetType: 'page',
    targetSlug: 'pool-hall-county-guestbook',
    district: 'pool-hall-county',
    visibility: 'public',
    tags: ['guestbook', 'pool-hall-county'],
    actor: 'visitor',
  },
  {
    type: 'faction_drift',
    timestamp: Date.now() - 86400000 * 1.5,
    headline: 'Faction drift detected near Classified Alley.',
    detail: 'User proximity pattern matches Night Drinkers. No official join recorded.',
    redactedLine: 'The room noticed someone.',
    district: 'classified-alley',
    visibility: 'redacted',
    tags: ['faction', 'night-drinkers'],
    actor: 'system',
  },
  {
    type: 'page_published',
    timestamp: Date.now() - 86400000 * 1,
    headline: 'New page indexed: "Things Found Behind The Ice Machine."',
    detail: 'Page published by anonymous creator. Auto-indexed by SleepNet.',
    redactedLine: 'The directory grew by one.',
    targetType: 'page',
    targetSlug: 'things-found-behind-ice-machine',
    district: 'motel-row',
    visibility: 'public',
    tags: ['page', 'motel-row', 'sleepnet'],
    actor: 'anonymous',
  },
  {
    type: 'event_started',
    timestamp: Date.now() - 3600000 * 12,
    headline: 'Tuesday Night Something began in the back booth.',
    redactedLine: 'An event was filed.',
    targetType: 'event',
    targetSlug: 'tuesday-night-something',
    district: 'back-booth',
    visibility: 'public',
    tags: ['event', 'back-booth'],
    actor: 'system',
  },
  {
    type: 'system_toggle',
    timestamp: Date.now() - 3600000 * 8,
    headline: 'Fake ads rotated in Classified Alley.',
    detail: 'Ad pool refreshed. 3 new ads entered rotation. 1 removed for being too real.',
    visibility: 'admin_only',
    tags: ['ads', 'system'],
    actor: 'system',
    district: 'classified-alley',
  },
  {
    type: 'stuff_moved',
    timestamp: Date.now() - 3600000 * 4,
    headline: 'An object changed shelves.',
    detail: 'fuzzy-dice-unknown moved from Object District to Parking Lot West.',
    redactedLine: 'Something was placed somewhere.',
    targetType: 'stuff',
    targetSlug: 'fuzzy-dice-unknown',
    visibility: 'public',
    tags: ['stuff', 'parking-lot-west'],
    actor: 'unknown',
  },
  {
    type: 'door_moved',
    timestamp: Date.now() - 3600000 * 2,
    headline: 'A hidden door relocated.',
    redactedLine: 'The building rearranged.',
    district: 'corporate-ruins',
    visibility: 'redacted',
    tags: ['hidden-door', 'corporate-ruins'],
    actor: 'system',
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

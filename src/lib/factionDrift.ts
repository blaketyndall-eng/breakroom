export type FactionSignalSource =
  | 'visit_turf_page'
  | 'click_faction_ad'
  | 'sign_faction_guestbook'
  | 'save_faction_stuff'
  | 'view_faction_stuff_file'
  | 'search_faction_phrase'
  | 'create_faction_page'
  | 'agent_mention'
  | 'visit_faction_page';

export type FactionSignal = {
  factionSlug: string;
  source: FactionSignalSource;
  weight: number;
  createdAt: string;
  metadata: Record<string, unknown>;
};

export type FactionSignalSummary = {
  factionSlug: string;
  total: number;
  sources: Record<string, number>;
  label: string;
  lastSeenAt?: string;
};

export const LOCAL_FACTION_SIGNALS_KEY = 'breakroom.faction-signals.v1';
export const FACTION_DRIFT_EVENT = 'breakroom:faction-drift-updated';

export const FACTION_DRIFT_LABELS: Record<string, string> = {
  'the-players': 'You’ve been seen near the table.',
  'lot-racers': 'Your file picked up exhaust.',
  'night-drinkers': 'You’ve been counted among the stools.',
  'the-smokers': 'Fence talk has your name in it.',
  cowboys: 'Cooler opened. Hat noticed.',
};

export const FACTION_NO_DRIFT_LABELS: Record<string, string> = {
  'the-players': 'Nobody knows your break yet.',
  'lot-racers': 'Your plate is not written down yet.',
  'night-drinkers': 'No stool has your shape yet.',
  'the-smokers': 'Nobody has said your name outside yet.',
  cowboys: 'The cooler has not opened for you yet.',
};

function readSignals(): FactionSignal[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_FACTION_SIGNALS_KEY);
    return raw ? JSON.parse(raw) as FactionSignal[] : [];
  } catch {
    return [];
  }
}

function writeSignals(signals: FactionSignal[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCAL_FACTION_SIGNALS_KEY, JSON.stringify(signals));
  window.dispatchEvent(new CustomEvent(FACTION_DRIFT_EVENT, { detail: { signals } }));
}

export function getFactionDriftLabel(factionSlug: string, hasDrift = true) {
  return hasDrift
    ? FACTION_DRIFT_LABELS[factionSlug] ?? 'The room noticed where you stood.'
    : FACTION_NO_DRIFT_LABELS[factionSlug] ?? 'The room has not noticed you here yet.';
}

export function recordFactionSignal(input: {
  factionSlug: string;
  source: FactionSignalSource;
  weight?: number;
  metadata?: Record<string, unknown>;
}) {
  if (typeof window === 'undefined') return null;
  const signal: FactionSignal = {
    factionSlug: input.factionSlug,
    source: input.source,
    weight: input.weight ?? 1,
    createdAt: new Date().toISOString(),
    metadata: input.metadata ?? {},
  };

  const existing = readSignals();
  const dedupeWindowMs = 30 * 60 * 1000;
  const now = Date.now();
  const duplicate = existing.some((item) =>
    item.factionSlug === signal.factionSlug &&
    item.source === signal.source &&
    now - Date.parse(item.createdAt) < dedupeWindowMs
  );

  const next = duplicate ? existing : [signal, ...existing].slice(0, 200);
  writeSignals(next);
  return signal;
}

export function getFactionSignals() {
  return readSignals();
}

export function getFactionSignalSummary(): FactionSignalSummary[] {
  const map = new Map<string, FactionSignalSummary>();

  readSignals().forEach((signal) => {
    const current = map.get(signal.factionSlug) ?? {
      factionSlug: signal.factionSlug,
      total: 0,
      sources: {},
      label: getFactionDriftLabel(signal.factionSlug),
      lastSeenAt: signal.createdAt,
    };

    current.total += signal.weight;
    current.sources[signal.source] = (current.sources[signal.source] ?? 0) + signal.weight;
    if (!current.lastSeenAt || Date.parse(signal.createdAt) > Date.parse(current.lastSeenAt)) {
      current.lastSeenAt = signal.createdAt;
    }
    map.set(signal.factionSlug, current);
  });

  return [...map.values()].sort((a, b) => b.total - a.total);
}

export function getFactionSignalTotal(factionSlug: string) {
  return getFactionSignalSummary().find((summary) => summary.factionSlug === factionSlug)?.total ?? 0;
}

export function getTopFactionDrift() {
  return getFactionSignalSummary()[0] ?? null;
}

export function hasFactionDrift(factionSlug: string) {
  return getFactionSignalTotal(factionSlug) > 0;
}

export function clearFactionDrift() {
  writeSignals([]);
}

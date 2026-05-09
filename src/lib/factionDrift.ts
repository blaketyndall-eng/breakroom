import { supabase } from '@/lib/supabaseClient';
import { getFactionBySlug } from '@/content/data/factions';
import { emitFactionDrift } from './ledgerEmitters';

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

  // PR 72: emit a redacted ledger event for fresh signals only (not the
  // dedup-suppressed ones). The room "noticed" rather than "filed twice".
  if (!duplicate) {
    try {
      const faction = getFactionBySlug(input.factionSlug);
      emitFactionDrift({
        factionSlug: input.factionSlug,
        factionName: faction?.name ?? input.factionSlug,
      });
    } catch {
      /* emitter errors are swallowed */
    }
  }

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

// --- Supabase sync ---

export const DRIFT_SYNCED_EVENT = 'breakroom:drift-synced';

/**
 * Batch-upload local drift signals to Supabase.
 * Called on auth state change (user signs in).
 * Signals that upload successfully are removed from localStorage.
 */
export async function syncDriftSignalsToSupabase(): Promise<{ synced: number; failed: number }> {
  if (!supabase) return { synced: 0, failed: 0 };

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) return { synced: 0, failed: 0 };

  const local = readSignals();
  if (local.length === 0) return { synced: 0, failed: 0 };

  const rows = local.map((signal) => ({
    user_id: user.id,
    faction_slug: signal.factionSlug,
    source: signal.source,
    weight: signal.weight,
    recorded_at: signal.createdAt,
  }));

  const { error } = await supabase
    .from('faction_drift_signals')
    .insert(rows);

  if (error) {
    return { synced: 0, failed: local.length };
  }

  // Clear local signals after successful sync
  writeSignals([]);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DRIFT_SYNCED_EVENT, { detail: { count: local.length } }));
  }

  return { synced: local.length, failed: 0 };
}

/**
 * Get drift signal summary combining local + Supabase data.
 * Falls back to local-only when Supabase is unavailable.
 */
export async function getPersistedDriftSummary(): Promise<FactionSignalSummary[]> {
  const localSummary = getFactionSignalSummary();

  if (!supabase) return localSummary;

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) return localSummary;

  const { data, error } = await supabase
    .from('faction_drift_signals')
    .select('faction_slug, source, weight, recorded_at')
    .eq('user_id', user.id);

  if (error || !data?.length) return localSummary;

  // Merge remote signals into summary map
  const map = new Map<string, FactionSignalSummary>();

  // Add remote signals
  for (const row of data) {
    const current = map.get(row.faction_slug) ?? {
      factionSlug: row.faction_slug,
      total: 0,
      sources: {},
      label: getFactionDriftLabel(row.faction_slug),
      lastSeenAt: row.recorded_at,
    };
    current.total += row.weight;
    current.sources[row.source] = (current.sources[row.source] ?? 0) + row.weight;
    if (!current.lastSeenAt || Date.parse(row.recorded_at) > Date.parse(current.lastSeenAt)) {
      current.lastSeenAt = row.recorded_at;
    }
    map.set(row.faction_slug, current);
  }

  // Layer local signals on top (not yet synced)
  for (const signal of readSignals()) {
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
  }

  return [...map.values()].sort((a, b) => b.total - a.total);
}

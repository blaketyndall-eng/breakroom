import { BREAKROOM_FACTIONS, getFactionBySlug } from '@/content/data/factions';
import type { BreakroomFaction } from '@/content/data/factions';

export type FactionSignalSource =
  | 'clicked_faction_page'
  | 'created_faction_turf_page'
  | 'saved_related_object'
  | 'generated_related_site_type'
  | 'clicked_related_sleepnet_site';

export type FactionSignal = {
  factionSlug: string;
  source: FactionSignalSource;
  count: number;
  lastSeenAt: string;
};

export const LOCAL_FACTION_SIGNALS_KEY = 'breakroom.faction-signals.v1';

export function getActiveFactions() {
  return BREAKROOM_FACTIONS.filter((faction) => faction.status === 'active');
}

export function getRumoredFactions() {
  return BREAKROOM_FACTIONS.filter((faction) => faction.status !== 'active');
}

export function loadFactionSignals() {
  if (typeof window === 'undefined') return [] as FactionSignal[];
  try {
    const raw = window.localStorage.getItem(LOCAL_FACTION_SIGNALS_KEY);
    return raw ? JSON.parse(raw) as FactionSignal[] : [];
  } catch {
    return [] as FactionSignal[];
  }
}

export function recordFactionSignal(factionSlug: string, source: FactionSignalSource) {
  if (typeof window === 'undefined') return null;
  const faction = getFactionBySlug(factionSlug);
  if (!faction) return null;

  const signals = loadFactionSignals();
  const existing = signals.find((signal) => signal.factionSlug === factionSlug && signal.source === source);
  const nextSignal: FactionSignal = existing
    ? { ...existing, count: existing.count + 1, lastSeenAt: new Date().toISOString() }
    : { factionSlug, source, count: 1, lastSeenAt: new Date().toISOString() };

  const next = existing
    ? signals.map((signal) => signal.factionSlug === factionSlug && signal.source === source ? nextSignal : signal)
    : [...signals, nextSignal];

  window.localStorage.setItem(LOCAL_FACTION_SIGNALS_KEY, JSON.stringify(next));
  return nextSignal;
}

export function factionDriftMessage(faction: BreakroomFaction) {
  return faction.noticedLanguage || `${faction.name} noticed you.`;
}

export function factionStatusLabel(faction: BreakroomFaction) {
  if (faction.status === 'active') return 'ACTIVE TURF';
  if (faction.status === 'staff_only') return 'STAFF ONLY';
  return 'RUMORED';
}

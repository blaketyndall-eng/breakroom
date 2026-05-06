import { BREAKROOM_FACTIONS, getFactionBySlug } from '@/content/data/factions';
import type { BreakroomFaction } from '@/content/data/factions';

// Re-export registry helpers
export { BREAKROOM_FACTIONS, getFactionBySlug };
export type { BreakroomFaction };

export function getActiveFactions() {
  return BREAKROOM_FACTIONS.filter((faction) => faction.status === 'active');
}

export function getRumoredFactions() {
  return BREAKROOM_FACTIONS.filter((faction) => faction.status !== 'active');
}

export function factionDriftMessage(faction: BreakroomFaction) {
  return faction.noticedLanguage || `${faction.name} noticed you.`;
}

export function factionStatusLabel(faction: BreakroomFaction) {
  if (faction.status === 'active') return 'ACTIVE TURF';
  if (faction.status === 'staff_only') return 'STAFF ONLY';
  return 'RUMORED';
}

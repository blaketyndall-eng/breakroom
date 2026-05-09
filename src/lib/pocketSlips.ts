/**
 * Pocket Slips — aggregates world-state changes since last visit.
 * Each slip is a small notification that something happened in the room.
 * Inspired by: pager messages, Animal Crossing bulletin board, bar napkin notes.
 *
 * Design: slips accumulate between visits but cap at 5 visible.
 * Old slips fade ("The room forgot this one.") rather than stacking infinitely.
 * No guilt. No badge count. Just: "2 slips waiting" or "nothing new. that's fine."
 *
 * PR 72: also derives slips from real ledger entries (door_unlocked,
 * faction_drift, guestbook_signed, stuff_claimed, crew_joined,
 * radio_broadcast, page_published). Templates remain as fallback for
 * cold-start days when nothing has happened.
 */

import { getLedgerEntries, type LedgerEntry, type LedgerEventType } from './worldLedger';

export type SlipType = 'phone' | 'door' | 'guestbook' | 'faction' | 'drawer' | 'radio' | 'world_tick';

export type PocketSlip = {
  id: string;
  type: SlipType;
  headline: string;
  body?: string;
  href?: string;
  timestamp: string;
  read: boolean;
};

const SLIPS_KEY = 'breakroom.pocket-slips.v1';
const LAST_VISIT_KEY = 'breakroom.pocket-last-visit.v1';
const MAX_SLIPS = 8;
const VISIBLE_SLIPS = 5;

// --- Storage ---

function getStoredSlips(): PocketSlip[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SLIPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function storeSlips(slips: PocketSlip[]): void {
  if (typeof window === 'undefined') return;
  // Keep only MAX_SLIPS most recent
  const trimmed = slips.slice(0, MAX_SLIPS);
  localStorage.setItem(SLIPS_KEY, JSON.stringify(trimmed));
}

export function getLastVisit(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LAST_VISIT_KEY);
}

export function recordVisit(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LAST_VISIT_KEY, new Date().toISOString());
}

// --- Slip Management ---

export function getSlips(): PocketSlip[] {
  return getStoredSlips();
}

export function getUnreadSlips(): PocketSlip[] {
  return getStoredSlips().filter(s => !s.read);
}

export function getVisibleSlips(): PocketSlip[] {
  return getStoredSlips().slice(0, VISIBLE_SLIPS);
}

export function markSlipRead(id: string): void {
  const slips = getStoredSlips();
  const slip = slips.find(s => s.id === id);
  if (slip) {
    slip.read = true;
    storeSlips(slips);
  }
}

export function markAllRead(): void {
  const slips = getStoredSlips();
  slips.forEach(s => { s.read = true; });
  storeSlips(slips);
}

export function addSlip(slip: Omit<PocketSlip, 'id' | 'read' | 'timestamp'>): PocketSlip {
  const slips = getStoredSlips();
  const newSlip: PocketSlip = {
    ...slip,
    id: `slip-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    read: false,
    timestamp: new Date().toISOString(),
  };
  slips.unshift(newSlip);
  storeSlips(slips);
  return newSlip;
}

export function clearSlips(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SLIPS_KEY);
}

// --- Ledger-derived slips (PR 72) ---

/**
 * Map a ledger event type to the closest pocket slip type. Unknown
 * types fall through to `world_tick` so they still surface as
 * "something happened" without being filtered out.
 */
function ledgerTypeToSlipType(type: LedgerEventType): SlipType {
  switch (type) {
    case 'door_unlocked':
    case 'door_moved':
      return 'door';
    case 'faction_drift':
    case 'faction_joined':
      return 'faction';
    case 'guestbook_signed':
      return 'guestbook';
    case 'stuff_claimed':
    case 'stuff_moved':
    case 'stuff_appeared':
      return 'drawer';
    case 'radio_broadcast':
      return 'radio';
    default:
      return 'world_tick';
  }
}

/**
 * Convert a ledger entry into a slip. Uses the entry's redactedLine
 * (or headline) as the slip headline so the public-facing voice stays
 * intact. Pocket honors the same visibility tier as /ledger.
 */
function ledgerEntryToSlip(entry: LedgerEntry, today: string, idx: number): PocketSlip {
  // Skip admin-only entries — pocket reads at the public/redacted tier.
  const headline =
    entry.visibility === 'redacted'
      ? entry.redactedLine ?? entry.headline
      : entry.headline;

  // Reasonable default href: route to the relevant section by target type.
  const hrefByTarget: Record<string, string> = {
    door: '/sleepnet',
    faction: `/factions/${entry.targetSlug ?? ''}`,
    crew: `/crews/${entry.targetSlug ?? ''}`,
    page: `/sleepnet/${entry.targetSlug ?? ''}`,
    stuff: `/stuff/${entry.targetSlug ?? ''}`,
    radio: '/radio',
  };
  const href = entry.targetType ? hrefByTarget[entry.targetType] : undefined;

  return {
    id: `slip-${today}-ledger-${entry.id}-${idx}`,
    type: ledgerTypeToSlipType(entry.type),
    headline,
    body: entry.detail && entry.visibility !== 'redacted' ? entry.detail : undefined,
    href,
    timestamp: new Date(entry.timestamp).toISOString(),
    read: false,
  };
}

// --- Slip Generation (seeded daily content) ---

/**
 * Generate slips based on world state since last visit.
 * Called on Pocket page load. Idempotent per day — won't double-generate.
 *
 * PR 72: real ledger entries (since last visit) take priority. Templates
 * fill the gap when the ledger is quiet — so a brand-new visitor's
 * first day still feels populated.
 */
export function generateDailySlips(): PocketSlip[] {
  const lastVisit = getLastVisit();
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  // Don't regenerate if already visited today
  if (lastVisit && lastVisit.slice(0, 10) === today) {
    return getStoredSlips();
  }

  // Day-seeded deterministic content
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const dailySlipPool: Omit<PocketSlip, 'id' | 'read' | 'timestamp'>[] = [
    // --- Phone ---
    { type: 'phone', headline: 'Missed call from unknown number.', body: 'Voicemail is just breathing and a jukebox.', href: '/phone' },
    { type: 'phone', headline: 'Text from Very Good Burger.', body: 'We are not open. Stop asking. (Menu attached.)', href: '/phone' },
    { type: 'phone', headline: 'Voicemail from OmniShift Dispatch.', body: 'Do not return to work. Further instructions pending.', href: '/phone' },
    { type: 'phone', headline: 'The phone behind the bar rang twice.', body: 'First ring: normal. Second ring: different tone entirely.', href: '/phone' },
    { type: 'phone', headline: 'Collect call from area code ???.', body: 'Operator said your name wrong. Twice. On purpose.', href: '/phone' },
    { type: 'phone', headline: 'Text from The 7/11 Clerk.', body: 'Hot dogs are older than they look. This is not a warning.', href: '/phone' },
    // --- Radio ---
    { type: 'radio', headline: 'Radio 1:47 changed frequency.', body: 'New transmission logged.', href: '/radio' },
    { type: 'radio', headline: 'Someone requested a song.', body: 'Station ignored it. As usual.', href: '/radio' },
    { type: 'radio', headline: 'Dead air for 11 minutes.', body: 'The silence was specific.', href: '/radio' },
    { type: 'radio', headline: 'The Driver called into the station.', body: 'Lot weather update. Conditions: debatable.', href: '/radio' },
    // --- World ticks ---
    { type: 'world_tick', headline: 'The lot shifted overnight.', body: 'One parking spot appeared. One vanished.' },
    { type: 'world_tick', headline: 'Night Manager left a note.', body: 'Memo on the counter. Unsigned.' },
    { type: 'world_tick', headline: 'Clock still stuck at 1:47.', body: 'Maintenance was called. They did not come.' },
    { type: 'world_tick', headline: 'The vending machine restocked itself.', body: 'New item in slot B4. Nobody ordered it.' },
    { type: 'world_tick', headline: 'Building temperature dropped 1°.', body: 'Thermostat unchanged. The room made a decision.' },
    { type: 'world_tick', headline: 'Visitor counter incremented.', body: 'No visitor was recorded. The count is correct.' },
    { type: 'world_tick', headline: 'A light went out in District 4.', body: 'Replacement scheduled. Schedule not found.' },
    { type: 'world_tick', headline: 'The bulletin board reorganized.', body: 'Pins moved. Paper stayed. Meaning shifted.' },
    // --- Factions ---
    { type: 'faction', headline: 'The Players noticed movement.', body: 'Somebody filed something near your area.', href: '/factions/the-players' },
    { type: 'faction', headline: 'Lot Racers held a meeting.', body: 'Attendance: 3. Quorum: unclear.', href: '/factions/lot-racers' },
    { type: 'faction', headline: 'Night Drinkers left a tab open.', body: 'The total is growing. Nobody is adding to it.', href: '/factions/night-drinkers' },
    { type: 'faction', headline: 'The Smokers stood outside longer.', body: 'Break ended 40 minutes ago. They are aware.', href: '/factions/the-smokers' },
    { type: 'faction', headline: 'Cowboys were spotted near the back lot.', body: 'They did not explain. They rarely do.', href: '/factions/cowboys' },
    // --- Doors ---
    { type: 'door', headline: 'A door moved.', body: 'The directory adjusted.' },
    { type: 'door', headline: 'Something unlocked somewhere.', body: 'The directory did not say where.' },
    { type: 'door', headline: 'A hidden link appeared briefly.', body: 'It is gone now. It may return.' },
    { type: 'door', headline: 'The room noticed you looking.', body: 'Nothing happened. That might be the point.' },
    // --- Guestbook ---
    { type: 'guestbook', headline: 'Someone signed the wall.', body: 'New mark in the back booth.', href: '/sign-the-wall' },
    { type: 'guestbook', headline: 'A guestbook entry was redacted.', body: 'The signature remains. The message does not.', href: '/sign-the-wall' },
    { type: 'guestbook', headline: 'Three new marks on the wall.', body: 'Two are legible. One is a drawing.', href: '/sign-the-wall' },
    // --- Drawer ---
    { type: 'drawer', headline: 'An item in your drawer changed status.', body: 'Receipt With No Total → status unclear.', href: '/pocket/drawer' },
    { type: 'drawer', headline: 'Something was filed near your stuff.', body: 'Proximity: close. Relevance: unknown.', href: '/pocket/drawer' },
  ];

  const seed = dayOfYear % dailySlipPool.length;

  // Pick 2-3 slips for today based on seed
  const targetCount = (seed % 3) + 1; // 1-3 slips
  const existing = getStoredSlips();
  const newSlips: PocketSlip[] = [];

  // PR 72: prefer real ledger entries since last visit. Cap at
  // targetCount so the daily-cadence vibe holds; templates fill any gap.
  let ledgerSlipsCount = 0;
  try {
    const sinceTs = lastVisit ? Date.parse(lastVisit) : 0;
    const recent = getLedgerEntries({ visibility: 'public', since: sinceTs, limit: 20 })
      .filter((e) => e.visibility !== 'admin_only');
    for (const entry of recent) {
      if (ledgerSlipsCount >= targetCount) break;
      const slip = ledgerEntryToSlip(entry, today, ledgerSlipsCount);
      if (!existing.find((e) => e.id === slip.id)) {
        newSlips.push(slip);
        ledgerSlipsCount += 1;
      }
    }
  } catch {
    /* ledger read failure is non-fatal — fall through to templates */
  }

  // Fill remaining slots with seeded templates (cold-start fallback).
  for (let i = ledgerSlipsCount; i < targetCount; i++) {
    const poolIndex = (seed + i * 5) % dailySlipPool.length;
    const template = dailySlipPool[poolIndex];
    const slip: PocketSlip = {
      ...template,
      id: `slip-${today}-${i}`,
      read: false,
      timestamp: now.toISOString(),
    };
    if (!existing.find(e => e.id === slip.id)) {
      newSlips.push(slip);
    }
  }

  if (newSlips.length > 0) {
    const combined = [...newSlips, ...existing].slice(0, MAX_SLIPS);
    storeSlips(combined);
    return combined;
  }

  return existing;
}

// --- Summary for display ---

export function getSlipSummary(): { count: number; label: string } {
  const unread = getUnreadSlips();
  if (unread.length === 0) {
    return { count: 0, label: 'nothing new. that\'s fine.' };
  }
  if (unread.length === 1) {
    return { count: 1, label: '1 slip waiting' };
  }
  return { count: unread.length, label: `${unread.length} slips waiting` };
}

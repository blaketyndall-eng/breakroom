/**
 * Events Runtime Logic (PR 52)
 *
 * Sign sheet persistence (local-first), event queries,
 * and status helpers.
 */

import { BREAKROOM_EVENTS, getEventBySlug, getEventsByStatus, getEventsByFaction } from '@/content/data/events';
import type { BreakroomEvent, BreakroomEventStatus, BreakroomEventType } from '@/content/data/events';

export { BREAKROOM_EVENTS, getEventBySlug, getEventsByStatus, getEventsByFaction };
export type { BreakroomEvent, BreakroomEventStatus, BreakroomEventType };

// --- Sign Sheet ---

export type EventSignSheetEntry = {
  eventSlug: string;
  alias: string;
  actorType: 'user' | 'anonymous_user' | 'seeded_npc' | 'agent';
  attendanceType: 'signed_sheet' | 'rsvp' | 'seen_there' | 'anonymous' | 'faction';
  factionSlug?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
};

const SIGN_SHEET_KEY = 'breakroom.event-signs.v1';

function readSignSheetMap(): Record<string, EventSignSheetEntry[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(SIGN_SHEET_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeSignSheetMap(map: Record<string, EventSignSheetEntry[]>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SIGN_SHEET_KEY, JSON.stringify(map));
}

/**
 * Sign an event sheet.
 */
export function signEventSheet(input: {
  eventSlug: string;
  alias: string;
  attendanceType?: EventSignSheetEntry['attendanceType'];
  factionSlug?: string;
}): EventSignSheetEntry {
  const entry: EventSignSheetEntry = {
    eventSlug: input.eventSlug,
    alias: input.alias,
    actorType: 'user',
    attendanceType: input.attendanceType ?? 'signed_sheet',
    factionSlug: input.factionSlug,
    createdAt: new Date().toISOString(),
  };

  const map = readSignSheetMap();
  const existing = map[input.eventSlug] ?? [];

  // Rate limit: max 3 signs per event per 5 minutes
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;
  const recentUserEntries = existing.filter(
    (e) => e.actorType === 'user' && new Date(e.createdAt).getTime() > fiveMinAgo
  );

  if (recentUserEntries.length >= 3) {
    // Return the last entry instead of adding
    return recentUserEntries[recentUserEntries.length - 1];
  }

  map[input.eventSlug] = [...existing, entry].slice(-100);
  writeSignSheetMap(map);

  return entry;
}

/**
 * Get all sign sheet entries for an event.
 */
export function getEventSignSheet(eventSlug: string): EventSignSheetEntry[] {
  const map = readSignSheetMap();
  return map[eventSlug] ?? [];
}

/**
 * Get total attendance count for an event.
 */
export function getAttendanceCount(eventSlug: string): number {
  return getEventSignSheet(eventSlug).length;
}

// --- Display helpers ---

export const EVENT_TYPE_LABELS: Record<BreakroomEventType, string> = {
  idle_hands: 'Idle Hands',
  very_good_burger: 'Very Good Burger',
  turf_dispute: 'Turf Dispute',
  live_music: 'Live Music',
  lot_race: 'Lot Race',
  classified_meetup: 'Classified Meetup',
  fake_past_event: 'Past Record',
  maybe_real_upcoming: 'Maybe Real',
  edition_event: 'Edition Event',
};

export const EVENT_STATUS_LABELS: Record<BreakroomEventStatus, string> = {
  past: 'Happened.',
  upcoming: 'Upcoming.',
  maybe: 'Maybe.',
  cancelled: 'Cancelled by management.',
  archived: 'Archived.',
};

export function getStatusClass(status: BreakroomEventStatus): string {
  return `event-status-${status}`;
}

/**
 * Get events grouped by status for the index page.
 */
export function getEventsGrouped(): { label: string; status: BreakroomEventStatus; events: BreakroomEvent[] }[] {
  const groups: { label: string; status: BreakroomEventStatus }[] = [
    { label: 'Maybe Happening', status: 'maybe' },
    { label: 'Upcoming', status: 'upcoming' },
    { label: 'Past / Archived', status: 'past' },
    { label: 'Archived', status: 'archived' },
    { label: 'Cancelled', status: 'cancelled' },
  ];

  return groups
    .map((g) => ({
      ...g,
      events: BREAKROOM_EVENTS.filter((e) => e.status === g.status),
    }))
    .filter((g) => g.events.length > 0);
}

/**
 * Share Card — post-creation share utility.
 *
 * Generates OG-ready metadata and handles Web Share API / clipboard fallback.
 * The share card IS the marketing — every shared creation is an invite into the world.
 *
 * Does not generate images (that's a server-side concern for OG tags).
 * This handles the client-side sharing UX.
 */

import type { Creation } from '@/lib/makeTemplates';
import { getPocketIdentity } from '@/lib/pocketPersonalization';

// --- Types ---

export type ShareCardData = {
  title: string;
  description: string;
  url: string;
  /** Filed by handle or "Source: unknown" */
  attribution: string;
  /** Faction stamp line, if applicable */
  factionStamp: string | null;
  /** Share button label (faction-aware) */
  shareLabel: string;
  /** Dismiss label */
  dismissLabel: string;
  /** Confirmation copy after filing */
  filedCopy: string;
  /** Remaining creations today */
  remainingCopy: string;
};

// --- Faction-specific share copy ---

const FACTION_SHARE_LABELS: Record<string, string> = {
  'the-players': 'Post to the board',
  'lot-racers': 'Leave it on the lot',
  'night-drinkers': 'Slide it down the bar',
  'the-smokers': 'Pin it to the fence',
  'cowboys': 'Send it out',
};

const FACTION_DISMISS_LABELS: Record<string, string> = {
  'the-players': 'Walk away from the table',
  'lot-racers': 'Drive off',
  'night-drinkers': 'Close the tab',
  'the-smokers': 'Flick it',
  'cowboys': 'Ride on',
};

const FACTION_STAMPS: Record<string, string> = {
  'the-players': 'FILED VIA THE PLAYERS',
  'lot-racers': 'LOT RACERS DISPATCH',
  'night-drinkers': 'SLID DOWN THE BAR',
  'the-smokers': 'POSTED TO THE FENCE',
  'cowboys': 'OPEN FIELD FILING',
};

const FACTION_FILED_COPY: Record<string, string> = {
  'the-players': 'Filed via The Players. The table acknowledges your contribution.',
  'lot-racers': 'Filed via Lot Racers. The lot has been updated.',
  'night-drinkers': 'Filed via Night Drinkers. The bar napkin is official now.',
  'the-smokers': 'Filed via The Smokers. The fence accepts all postings.',
  'cowboys': 'Filed via Cowboys. The field has been documented.',
};

// --- Type labels ---

const TYPE_LABELS: Record<string, string> = {
  fake_ad: 'FAKE AD',
  object_listing: 'OBJECT',
  rumor: 'RUMOR',
  classified: 'CLASSIFIED',
  guestbook_line: 'GUESTBOOK ENTRY',
  agent_quote: 'AGENT QUOTE',
  pool_hall_classified: 'POOL HALL CLASSIFIED',
  lot_listing: 'LOT LISTING',
  bar_napkin_note: 'BAR NAPKIN NOTE',
  fence_posting: 'FENCE POSTING',
  open_field_report: 'OPEN FIELD REPORT',
};

// --- Share Card Generation ---

/**
 * Generate share card data from a creation.
 */
export function generateShareCard(creation: Creation, remaining: number): ShareCardData {
  const identity = getPocketIdentity();
  const factionSlug = creation.factionSlug;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const url = `${baseUrl}${creation.permalink}`;
  const typeLabel = TYPE_LABELS[creation.type] || 'FILING';

  const attribution = identity.hasRegularFile
    ? `Filed by ${identity.handle}`
    : 'Source: unknown';

  const factionStamp = factionSlug ? (FACTION_STAMPS[factionSlug] ?? null) : null;

  const shareLabel = factionSlug
    ? (FACTION_SHARE_LABELS[factionSlug] ?? 'Put it on the wire')
    : 'Put it on the wire';

  const dismissLabel = factionSlug
    ? (FACTION_DISMISS_LABELS[factionSlug] ?? 'File and forget')
    : 'File and forget';

  const filedCopy = factionSlug
    ? (FACTION_FILED_COPY[factionSlug] ?? `Filed. The room accepted your filing.`)
    : 'Filed. The room accepted your filing.';

  const remainingCopy = remaining > 0
    ? `${remaining} remaining today.`
    : 'Daily limit reached. The room rests.';

  return {
    title: `${typeLabel} — The Breakroom`,
    description: creation.content.slice(0, 120),
    url,
    attribution,
    factionStamp,
    shareLabel,
    dismissLabel,
    filedCopy,
    remainingCopy,
  };
}

/**
 * Share via Web Share API (native share sheet).
 * Returns true if shared, false if unavailable or cancelled.
 */
export async function shareViaWebAPI(card: ShareCardData): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.share) return false;

  try {
    await navigator.share({
      title: card.title,
      text: card.description,
      url: card.url,
    });
    return true;
  } catch {
    // User cancelled or API error — both are fine
    return false;
  }
}

/**
 * Copy permalink to clipboard.
 * Returns true if copied successfully.
 */
export async function copyPermalink(url: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false;

  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if Web Share API is available.
 */
export function canShare(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}

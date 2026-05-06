/**
 * Ledger Emitters — PR 65 (World Ledger V2)
 *
 * Convenience functions for other systems to emit standardized ledger events.
 * Each emitter pre-fills type, tags, and redacted lines so callers
 * don't need to know ledger internals.
 *
 * Usage:
 *   import { emitPageCreated } from '@/lib/ledgerEmitters';
 *   emitPageCreated({ slug: 'my-page', title: 'My Page', district: 'motel-row' });
 */

import { recordLedgerEvent, type LedgerEntry } from './worldLedger';

// --- Page events ---

export function emitPageCreated(opts: {
  slug: string;
  title: string;
  district?: string;
  actor?: string;
}): LedgerEntry {
  return recordLedgerEvent({
    type: 'page_created',
    headline: `New page created: "${opts.title}"`,
    detail: `Page slug: ${opts.slug}. Creator: ${opts.actor || 'unknown'}.`,
    targetType: 'page',
    targetSlug: opts.slug,
    district: opts.district,
    actor: opts.actor,
    tags: ['page', opts.district || 'unknown-district'].filter(Boolean),
  });
}

export function emitPagePublished(opts: {
  slug: string;
  title: string;
  district?: string;
  actor?: string;
}): LedgerEntry {
  return recordLedgerEvent({
    type: 'page_published',
    headline: `Page indexed: "${opts.title}"`,
    detail: `Page ${opts.slug} added to SleepNet index.`,
    targetType: 'page',
    targetSlug: opts.slug,
    district: opts.district,
    actor: opts.actor || 'sleepnet',
    tags: ['page', 'sleepnet'],
  });
}

export function emitPageHidden(opts: {
  slug: string;
  reason?: string;
  actor?: string;
}): LedgerEntry {
  return recordLedgerEvent({
    type: 'page_hidden',
    headline: `A page was removed from the index.`,
    detail: `Page ${opts.slug} hidden. ${opts.reason || 'No reason filed.'}`,
    targetType: 'page',
    targetSlug: opts.slug,
    actor: opts.actor || 'system',
    visibility: 'redacted',
    tags: ['page', 'moderation'],
  });
}

// --- Stuff events ---

export function emitStuffAppeared(opts: {
  slug: string;
  name: string;
  district?: string;
}): LedgerEntry {
  return recordLedgerEvent({
    type: 'stuff_appeared',
    headline: `${opts.name} appeared${opts.district ? ` in ${opts.district.replace(/-/g, ' ')}` : ''}.`,
    detail: `Object: ${opts.slug}. Source unclear.`,
    targetType: 'stuff',
    targetSlug: opts.slug,
    district: opts.district,
    tags: ['stuff', opts.district].filter(Boolean) as string[],
  });
}

export function emitStuffClaimed(opts: {
  slug: string;
  name: string;
  actor?: string;
}): LedgerEntry {
  return recordLedgerEvent({
    type: 'stuff_claimed',
    headline: `${opts.name} was saved to a drawer.`,
    redactedLine: 'An object changed hands.',
    targetType: 'stuff',
    targetSlug: opts.slug,
    actor: opts.actor,
    tags: ['stuff', 'drawer'],
  });
}

export function emitStuffMoved(opts: {
  slug: string;
  name: string;
  fromDistrict?: string;
  toDistrict?: string;
}): LedgerEntry {
  return recordLedgerEvent({
    type: 'stuff_moved',
    headline: `${opts.name} changed locations.`,
    detail: `Moved from ${opts.fromDistrict || 'unknown'} to ${opts.toDistrict || 'unknown'}.`,
    targetType: 'stuff',
    targetSlug: opts.slug,
    district: opts.toDistrict,
    tags: ['stuff', opts.toDistrict].filter(Boolean) as string[],
  });
}

// --- Faction events ---

export function emitFactionDrift(opts: {
  factionSlug: string;
  factionName: string;
  district?: string;
  actor?: string;
}): LedgerEntry {
  return recordLedgerEvent({
    type: 'faction_drift',
    headline: `Drift detected toward ${opts.factionName}.`,
    detail: `Proximity pattern matches ${opts.factionSlug}. No official join.`,
    redactedLine: 'The room noticed someone.',
    targetType: 'faction',
    targetSlug: opts.factionSlug,
    district: opts.district,
    actor: opts.actor || 'system',
    visibility: 'redacted',
    tags: ['faction', opts.factionSlug],
  });
}

export function emitFactionJoined(opts: {
  factionSlug: string;
  factionName: string;
  actor: string;
}): LedgerEntry {
  return recordLedgerEvent({
    type: 'faction_joined',
    headline: `Someone joined ${opts.factionName}.`,
    detail: `${opts.actor} officially joined ${opts.factionSlug}.`,
    redactedLine: 'A decision was filed.',
    targetType: 'faction',
    targetSlug: opts.factionSlug,
    actor: opts.actor,
    tags: ['faction', opts.factionSlug],
  });
}

// --- Crew events ---

export function emitCrewFormed(opts: {
  slug: string;
  name: string;
  founderCount?: number;
  district?: string;
}): LedgerEntry {
  return recordLedgerEvent({
    type: 'crew_formed',
    headline: `A crew registered: ${opts.name}.`,
    detail: `Crew ${opts.slug}. ${opts.founderCount || 1} founding member(s).`,
    targetType: 'crew',
    targetSlug: opts.slug,
    district: opts.district,
    tags: ['crew', opts.district].filter(Boolean) as string[],
  });
}

export function emitCrewDisbanded(opts: {
  slug: string;
  name: string;
  reason?: string;
}): LedgerEntry {
  return recordLedgerEvent({
    type: 'crew_disbanded',
    headline: `${opts.name} disbanded.`,
    detail: opts.reason || 'No reason filed.',
    redactedLine: 'A group was removed from the directory.',
    targetType: 'crew',
    targetSlug: opts.slug,
    visibility: 'redacted',
    tags: ['crew'],
  });
}

// --- Door events ---

export function emitDoorUnlocked(opts: {
  doorSlug?: string;
  district?: string;
  actor?: string;
}): LedgerEntry {
  return recordLedgerEvent({
    type: 'door_unlocked',
    headline: 'A door was found.',
    redactedLine: 'A door moved.',
    targetType: 'door',
    targetSlug: opts.doorSlug,
    district: opts.district,
    actor: opts.actor || 'unknown',
    visibility: 'redacted',
    tags: ['hidden-door', opts.district].filter(Boolean) as string[],
  });
}

export function emitDoorMoved(opts: {
  district?: string;
}): LedgerEntry {
  return recordLedgerEvent({
    type: 'door_moved',
    headline: 'A hidden door relocated.',
    redactedLine: 'The building rearranged.',
    district: opts.district,
    actor: 'system',
    visibility: 'redacted',
    tags: ['hidden-door'],
  });
}

// --- World events ---

export function emitGuestbookSigned(opts: {
  pageSlug: string;
  district?: string;
  actor?: string;
}): LedgerEntry {
  return recordLedgerEvent({
    type: 'guestbook_signed',
    headline: `Guestbook entry added${opts.district ? ` in ${opts.district.replace(/-/g, ' ')}` : ''}.`,
    redactedLine: 'Someone wrote something down.',
    targetType: 'page',
    targetSlug: opts.pageSlug,
    district: opts.district,
    actor: opts.actor || 'visitor',
    tags: ['guestbook', opts.district].filter(Boolean) as string[],
  });
}

export function emitWeatherShift(opts: {
  district: string;
  conditions: string;
}): LedgerEntry {
  return recordLedgerEvent({
    type: 'weather_shift',
    headline: `Lot weather changed: ${opts.conditions}.`,
    detail: `Weather system updated for ${opts.district}.`,
    redactedLine: 'Conditions changed.',
    district: opts.district,
    actor: 'system',
    tags: ['weather', opts.district],
  });
}

export function emitRadioBroadcast(opts: {
  description: string;
  district?: string;
}): LedgerEntry {
  return recordLedgerEvent({
    type: 'radio_broadcast',
    headline: opts.description,
    redactedLine: 'The broadcast layer updated.',
    district: opts.district || 'radio-tower-147',
    actor: 'radio-tower-147',
    tags: ['radio'],
  });
}

export function emitAdminAction(opts: {
  headline: string;
  detail: string;
  actor?: string;
  tags?: string[];
}): LedgerEntry {
  return recordLedgerEvent({
    type: 'admin_action',
    headline: opts.headline,
    detail: opts.detail,
    actor: opts.actor || 'wire-room-admin',
    visibility: 'admin_only',
    tags: ['admin', ...(opts.tags || [])],
  });
}

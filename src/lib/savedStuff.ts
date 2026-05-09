import type { StuffItem, StuffItemStatus } from '@/content/data/stuff';
import { emitStuffClaimed } from './ledgerEmitters';

export type SavedStuffVisibility = 'private' | 'public' | 'pinned';

export type SavedStuffCategory =
  | 'saved'
  | 'claimed'
  | 'held_behind_counter'
  | 'evidence'
  | 'printable'
  | 'faction_stuff'
  | 'missing_again'
  | 'official_later';

export type SaveableStuffItem = {
  slug: string;
  name: string;
  status: StuffItemStatus | string;
  note?: string;
  priceLabel?: string;
  sourceLabel?: string;
  relatedObjectSlug?: string;
  relatedProductSlug?: string;
  tags?: string[];
};

export type SavedStuffItem = {
  stuffSlug: string;
  sku: string;
  name: string;
  status: StuffItemStatus | string;
  sourceSiteSlug?: string;
  relatedFactionSlug?: string;
  relatedObjectSlug?: string;
  savedAt: string;
  visibility: SavedStuffVisibility;
  category: SavedStuffCategory;
  metadata: Record<string, unknown>;
};

export type SaveStuffOptions = {
  sourceSiteSlug?: string;
  relatedFactionSlug?: string;
  relatedObjectSlug?: string;
  category?: SavedStuffCategory;
  visibility?: SavedStuffVisibility;
  metadata?: Record<string, unknown>;
};

export const LOCAL_SAVED_STUFF_KEY = 'breakroom.saved-stuff.v1';
export const SAVED_STUFF_EVENT = 'breakroom:saved-stuff-updated';

function safeRead(): SavedStuffItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_SAVED_STUFF_KEY);
    return raw ? JSON.parse(raw) as SavedStuffItem[] : [];
  } catch {
    return [];
  }
}

function safeWrite(items: SavedStuffItem[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCAL_SAVED_STUFF_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(SAVED_STUFF_EVENT, { detail: { items } }));
}

function hashSlug(slug: string) {
  return slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function skuPrefix(item: SaveableStuffItem) {
  const source = item.sourceLabel?.toLowerCase() ?? '';
  if (source.includes('very good burger') || item.slug.includes('burger')) return 'VGB';
  if (item.slug.includes('object') || item.relatedObjectSlug) return 'OBJ';
  if (item.status === 'printable') return 'PRN';
  return 'STF';
}

export function makeStuffSku(item: SaveableStuffItem) {
  return `${skuPrefix(item)}-${String(hashSlug(item.slug) % 1000).padStart(3, '0')}`;
}

export function getSavedStuffItems() {
  return safeRead().sort((a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt));
}

export function isStuffSaved(stuffSlug: string) {
  return safeRead().some((item) => item.stuffSlug === stuffSlug);
}

export function getSavedStuffCount() {
  return safeRead().length;
}

export function saveStuffItem(item: SaveableStuffItem | StuffItem, options: SaveStuffOptions = {}) {
  const slug = item.slug;
  const existing = safeRead();
  const alreadySaved = existing.find((saved) => saved.stuffSlug === slug);
  if (alreadySaved) return alreadySaved;

  const saved: SavedStuffItem = {
    stuffSlug: slug,
    sku: makeStuffSku(item),
    name: item.name,
    status: item.status,
    sourceSiteSlug: options.sourceSiteSlug ?? ('relatedSleepNetSlug' in item ? item.relatedSleepNetSlug : undefined),
    relatedFactionSlug: options.relatedFactionSlug,
    relatedObjectSlug: options.relatedObjectSlug ?? item.relatedObjectSlug,
    savedAt: new Date().toISOString(),
    visibility: options.visibility ?? 'private',
    category: options.category ?? (item.status === 'printable' ? 'printable' : item.status === 'official_later' ? 'official_later' : 'saved'),
    metadata: {
      note: item.note,
      priceLabel: item.priceLabel,
      sourceLabel: item.sourceLabel,
      tags: item.tags ?? [],
      ...options.metadata,
    },
  };

  safeWrite([saved, ...existing]);

  // PR 72: emit ledger event so the room remembers.
  // Defensive try/catch — emit failure must never block the user save.
  try {
    emitStuffClaimed({ slug, name: item.name });
  } catch {
    /* emitter errors are swallowed; storage is the source of truth */
  }

  return saved;
}

export function removeSavedStuffItem(stuffSlug: string) {
  safeWrite(safeRead().filter((item) => item.stuffSlug !== stuffSlug));
}

export function clearSavedStuff() {
  safeWrite([]);
}

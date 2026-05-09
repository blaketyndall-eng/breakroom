/**
 * profileGuestbook.ts — PR V2
 *
 * Per-profile guestbook entries, local-first.
 *
 * Storage shape:
 *   localStorage['breakroom.profile-guestbook.v1'] = {
 *     [profileHandle]: ProfileGuestbookEntry[]
 *   }
 *
 * Each handle has its own list. Entries are append-only at the lib level
 * (the UI may filter for display) and capped per-handle at 100 entries
 * to keep localStorage manageable.
 *
 * Same component used for /sites/[slug] guestbooks in V3 — the slug just
 * gets passed as the `targetKey` instead of a profile handle. Keeping the
 * key opaque here means we can reuse without forking the lib.
 */

import { emitGuestbookSigned } from './ledgerEmitters';

const STORAGE_KEY = 'breakroom.profile-guestbook.v1';
const MAX_ENTRIES_PER_TARGET = 100;
const MAX_BODY_LENGTH = 280;

export type ProfileGuestbookEntry = {
  id: string;
  signerHandle: string; // '@anonymous' if no signed-in handle
  signerDisplayName: string;
  body: string;
  signedAt: string;
};

type GuestbookStore = Record<string, ProfileGuestbookEntry[]>;

// --- Storage helpers ---

function loadStore(): GuestbookStore {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) return parsed as GuestbookStore;
    return {};
  } catch {
    return {};
  }
}

function saveStore(store: GuestbookStore): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* swallow quota errors; per-handle cap should keep us well under */
  }
}

function makeId(): string {
  return `pgb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// --- Public API ---

/**
 * Read entries for a target (profile handle or site slug). Most-recent first.
 */
export function getProfileGuestbook(targetKey: string, limit?: number): ProfileGuestbookEntry[] {
  if (!targetKey) return [];
  const store = loadStore();
  const list = store[targetKey] ?? [];
  const ordered = [...list].sort((a, b) => (a.signedAt < b.signedAt ? 1 : -1));
  return typeof limit === 'number' ? ordered.slice(0, limit) : ordered;
}

/**
 * Append a signature to a target's guestbook.
 * Returns the saved entry, or null if the input was invalid (empty body
 * after trim or no targetKey).
 */
export function signProfileGuestbook(
  targetKey: string,
  args: { body: string; signerHandle?: string; signerDisplayName?: string },
): ProfileGuestbookEntry | null {
  if (!targetKey) return null;
  const trimmed = (args.body ?? '').trim();
  if (!trimmed) return null;

  const body = trimmed.slice(0, MAX_BODY_LENGTH);
  const signerHandle = (args.signerHandle ?? 'anonymous').trim() || 'anonymous';
  const signerDisplayName =
    (args.signerDisplayName ?? '').trim() || (signerHandle === 'anonymous' ? 'unknown' : signerHandle);

  const entry: ProfileGuestbookEntry = {
    id: makeId(),
    signerHandle,
    signerDisplayName,
    body,
    signedAt: new Date().toISOString(),
  };

  const store = loadStore();
  const list = store[targetKey] ?? [];
  // Keep newest at the head; cap.
  const next = [entry, ...list].slice(0, MAX_ENTRIES_PER_TARGET);
  store[targetKey] = next;
  saveStore(store);

  // PR 72: emit ledger event so the room remembers the signature.
  // `targetKey` doubles as `pageSlug` here (the lib is opaque about
  // whether it's a profile handle or a site slug). Defensive try/catch.
  try {
    emitGuestbookSigned({
      pageSlug: targetKey,
      actor: signerHandle,
    });
  } catch {
    /* emitter errors are swallowed; entry is already persisted */
  }

  return entry;
}

/**
 * Remove a single entry by id (used for self-moderation on your own profile).
 */
export function removeProfileGuestbookEntry(targetKey: string, entryId: string): boolean {
  if (!targetKey) return false;
  const store = loadStore();
  const list = store[targetKey] ?? [];
  const next = list.filter((e) => e.id !== entryId);
  if (next.length === list.length) return false;
  store[targetKey] = next;
  saveStore(store);
  return true;
}

/**
 * Total signature count for a target. Cheap — no sort, no slice.
 */
export function getProfileGuestbookCount(targetKey: string): number {
  if (!targetKey) return 0;
  const store = loadStore();
  return (store[targetKey] ?? []).length;
}

export const GUESTBOOK_BODY_MAX = MAX_BODY_LENGTH;

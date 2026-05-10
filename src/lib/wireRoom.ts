/* Wire Room — PR 56 */
/* Admin/ops layer for moderation, content review, and launch controls */

import { emitAdminAction } from './ledgerEmitters';
import { removeProfileGuestbookEntry } from './profileGuestbook';

export type WireRoomRole = 'night_manager' | 'room_admin' | 'staff';

export type WireRoomAction = {
  id: string;
  type: 'flag' | 'remove' | 'approve' | 'note' | 'lock' | 'unlock';
  targetType: 'site' | 'crew' | 'regular' | 'stuff' | 'guestbook_entry' | 'agent_comment';
  targetSlug: string;
  reason: string;
  actor: string;
  timestamp: string;
};

export type ContentFlag = {
  id: string;
  targetType: WireRoomAction['targetType'];
  targetSlug: string;
  reason: string;
  flaggedBy: string;
  timestamp: string;
  status: 'open' | 'reviewed' | 'dismissed';
  reviewedBy?: string;
  reviewNote?: string;
};

export type SystemStatus = {
  sleepnetIndexing: boolean;
  crewCreation: boolean;
  guestbooks: boolean;
  fakeAds: boolean;
  hiddenDoors: boolean;
  radio: boolean;
  stuffShelf: boolean;
  agentComments: boolean;
};

const WIRE_ROOM_AUTH_KEY = 'breakroom.wire-room.auth.v1';
const WIRE_ROOM_LOG_KEY = 'breakroom.wire-room.log.v1';
const WIRE_ROOM_FLAGS_KEY = 'breakroom.wire-room.flags.v1';
const WIRE_ROOM_STATUS_KEY = 'breakroom.wire-room.status.v1';

// --- Auth ---

const WIRE_ROOM_PASSPHRASE = 'the-clock-is-stuck'; // local-first placeholder

export function isWireRoomAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(WIRE_ROOM_AUTH_KEY) === 'authenticated';
}

export function authenticateWireRoom(passphrase: string): boolean {
  if (passphrase === WIRE_ROOM_PASSPHRASE) {
    localStorage.setItem(WIRE_ROOM_AUTH_KEY, 'authenticated');
    return true;
  }
  return false;
}

export function deauthenticateWireRoom(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(WIRE_ROOM_AUTH_KEY);
}

// --- Action Log ---

function loadLog(): WireRoomAction[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(WIRE_ROOM_LOG_KEY) || '[]');
  } catch { return []; }
}

function saveLog(log: WireRoomAction[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WIRE_ROOM_LOG_KEY, JSON.stringify(log));
}

export function logAction(action: Omit<WireRoomAction, 'id' | 'timestamp'>): WireRoomAction {
  const entry: WireRoomAction = {
    ...action,
    id: `wire-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
  };
  const log = loadLog();
  log.unshift(entry);
  saveLog(log.slice(0, 200)); // keep last 200

  // PR 74: emit admin_action ledger entry for every action that funnels
  // through this single write point. The ledger entry is admin_only
  // (per the existing emitAdminAction default) so it shows up in
  // /wire-room/ledger but stays out of the public /ledger feed.
  // Defensive try/catch — emit failure must never block the action log.
  try {
    emitAdminAction({
      headline: `Wire Room ${entry.type}: ${entry.targetType}/${entry.targetSlug}`,
      detail: `${entry.reason} (actor: ${entry.actor})`,
      actor: entry.actor,
      tags: [entry.type, entry.targetType],
    });
  } catch {
    /* emitter errors are swallowed; the action log is the source of truth */
  }

  return entry;
}

export function getActionLog(limit = 50): WireRoomAction[] {
  return loadLog().slice(0, limit);
}

// --- Content Flags ---

function loadFlags(): ContentFlag[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(WIRE_ROOM_FLAGS_KEY) || '[]');
  } catch { return []; }
}

function saveFlags(flags: ContentFlag[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WIRE_ROOM_FLAGS_KEY, JSON.stringify(flags));
}

export function flagContent(input: Omit<ContentFlag, 'id' | 'timestamp' | 'status'>): ContentFlag {
  const flag: ContentFlag = {
    ...input,
    id: `flag-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    status: 'open',
  };
  const flags = loadFlags();
  flags.unshift(flag);
  saveFlags(flags);

  // PR 74: every flag is itself an admin-tracked action. Funnel through
  // logAction so the ledger emit happens at the single write point.
  logAction({
    type: 'flag',
    targetType: input.targetType,
    targetSlug: input.targetSlug,
    reason: input.reason || 'no reason given',
    actor: input.flaggedBy || 'anonymous',
  });

  return flag;
}

export function getOpenFlags(): ContentFlag[] {
  return loadFlags().filter((f) => f.status === 'open');
}

export function getAllFlags(): ContentFlag[] {
  return loadFlags();
}

export function reviewFlag(flagId: string, reviewedBy: string, note: string, dismiss = false): boolean {
  const flags = loadFlags();
  const idx = flags.findIndex((f) => f.id === flagId);
  if (idx === -1) return false;
  const flag = flags[idx];
  flag.status = dismiss ? 'dismissed' : 'reviewed';
  flag.reviewedBy = reviewedBy;
  flag.reviewNote = note;
  saveFlags(flags);

  // PR 74: log the review decision so it appears in the action log AND
  // emits to the admin-only ledger via logAction.
  logAction({
    type: dismiss ? 'note' : 'approve',
    targetType: flag.targetType,
    targetSlug: flag.targetSlug,
    reason: `${dismiss ? 'Dismissed' : 'Reviewed'}: ${note}`,
    actor: reviewedBy,
  });

  return true;
}

/**
 * PR 74: Remove the underlying target of a flag (soft-removal where
 * applicable). Currently dispatches:
 *   - guestbook_entry → calls profileGuestbook.removeProfileGuestbookEntry
 *
 * Other target types record a 'remove' action without actually removing
 * the target — the lib needs a removal handler per target type, which
 * we'll add as those surfaces grow flag affordances.
 *
 * targetSlug encoding for guestbook_entry: `${targetKey}::${entryId}`
 * (the targetKey is the profile handle or site slug; entryId is the
 * generated id from profileGuestbook.signProfileGuestbook).
 *
 * Returns true if the target was removed, false otherwise. The flag is
 * marked reviewed regardless so the queue clears.
 */
export function removeFlaggedTarget(flagId: string, reviewedBy: string): boolean {
  const flags = loadFlags();
  const flag = flags.find((f) => f.id === flagId);
  if (!flag) return false;

  let removed = false;
  let removalNote = 'Target removal not supported for this target type.';

  if (flag.targetType === 'guestbook_entry') {
    // Format: `${targetKey}::${entryId}`
    const sep = flag.targetSlug.indexOf('::');
    if (sep > 0) {
      const targetKey = flag.targetSlug.slice(0, sep);
      const entryId = flag.targetSlug.slice(sep + 2);
      removed = removeProfileGuestbookEntry(targetKey, entryId);
      removalNote = removed
        ? `Guestbook entry ${entryId} on ${targetKey} removed.`
        : `Guestbook entry ${entryId} on ${targetKey} not found (already removed?).`;
    } else {
      removalNote = 'Guestbook flag has malformed targetSlug; cannot dispatch.';
    }
  }

  // Mark the flag reviewed regardless — clears the queue. Ledger emit
  // happens via logAction inside reviewFlag below.
  flag.status = 'reviewed';
  flag.reviewedBy = reviewedBy;
  flag.reviewNote = removalNote;
  saveFlags(flags);

  // Log the remove action explicitly (separate from the auto-review log
  // entry; reviewFlag isn't called here to avoid double-flag-update).
  logAction({
    type: 'remove',
    targetType: flag.targetType,
    targetSlug: flag.targetSlug,
    reason: removalNote,
    actor: reviewedBy,
  });

  return removed;
}

// --- System Status (Feature Flags) ---

const DEFAULT_STATUS: SystemStatus = {
  sleepnetIndexing: true,
  crewCreation: true,
  guestbooks: true,
  fakeAds: true,
  hiddenDoors: true,
  radio: true,
  stuffShelf: true,
  agentComments: true,
};

export function getSystemStatus(): SystemStatus {
  if (typeof window === 'undefined') return DEFAULT_STATUS;
  try {
    const stored = JSON.parse(localStorage.getItem(WIRE_ROOM_STATUS_KEY) || '{}');
    return { ...DEFAULT_STATUS, ...stored };
  } catch { return DEFAULT_STATUS; }
}

export function setSystemStatus(updates: Partial<SystemStatus>): SystemStatus {
  const current = getSystemStatus();
  const next = { ...current, ...updates };
  if (typeof window !== 'undefined') {
    localStorage.setItem(WIRE_ROOM_STATUS_KEY, JSON.stringify(next));
  }

  // PR 74: log every system toggle so it shows in the action log + the
  // admin-only ledger. Note: the dashboard ALSO calls logAction after
  // toggleSystem; that's redundant-but-harmless (the underlying
  // localStorage append is idempotent at the row level since each entry
  // gets a fresh id). For programmatic callers (tests, scripts) the
  // emit happens here regardless of the UI path.
  for (const key of Object.keys(updates) as (keyof SystemStatus)[]) {
    if (current[key] === next[key]) continue; // no-op toggle
    logAction({
      type: next[key] ? 'unlock' : 'lock',
      targetType: 'site',
      targetSlug: key,
      reason: `System ${key} ${next[key] ? 'enabled' : 'disabled'}`,
      actor: 'wire-room-admin',
    });
  }

  return next;
}

// --- Stats ---

export function getWireRoomStats() {
  const log = loadLog();
  const flags = loadFlags();
  return {
    totalActions: log.length,
    openFlags: flags.filter((f) => f.status === 'open').length,
    reviewedFlags: flags.filter((f) => f.status === 'reviewed').length,
    dismissedFlags: flags.filter((f) => f.status === 'dismissed').length,
    recentActions: log.slice(0, 10),
  };
}

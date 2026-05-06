/* Wire Room — PR 56 */
/* Admin/ops layer for moderation, content review, and launch controls */

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
  flags[idx].status = dismiss ? 'dismissed' : 'reviewed';
  flags[idx].reviewedBy = reviewedBy;
  flags[idx].reviewNote = note;
  saveFlags(flags);
  return true;
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

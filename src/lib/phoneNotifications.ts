/**
 * Phone Behind The Bar — Notification Engine (PR 69)
 *
 * Subscribes to World Ledger events and converts them into
 * phone messages delivered in agent voice. Each message comes
 * from a world character — Night Manager, Pool Table Oracle,
 * 7/11 Clerk, Room Admin, etc.
 *
 * Local-first: all messages stored in localStorage.
 * Read/unread tracking per message.
 * Badge count exposed for other components.
 *
 * The phone is not yours. It keeps acting familiar.
 */

import { onLedgerEvent, getLedgerEntries, type LedgerEntry, type LedgerEventType } from './worldLedger';

// --- Types ---

export type PhoneMessageType =
  | 'voicemail'
  | 'text'
  | 'missed_call'
  | 'dispatch'
  | 'alert'
  | 'rumor';

export type PhoneSender = {
  name: string;
  role: string;
  icon: string; // emoji stand-in for now
};

export type PhoneMessage = {
  id: string;
  ledgerEventId?: string;
  type: PhoneMessageType;
  sender: PhoneSender;
  subject: string;
  body: string;
  timestamp: number;
  read: boolean;
  district?: string;
  actionHref?: string;
  actionLabel?: string;
};

// --- Known Senders ---

const SENDERS: Record<string, PhoneSender> = {
  nightManager: { name: 'Night Manager', role: 'shift oversight', icon: '🌙' },
  poolOracle: { name: 'Pool Table Oracle', role: 'table 4 divination', icon: '🎱' },
  clerk711: { name: '7/11 Clerk', role: 'counter intelligence', icon: '🏪' },
  roomAdmin: { name: 'Room Admin', role: 'directory maintenance', icon: '📋' },
  phoneBehindBar: { name: 'Phone Behind The Bar', role: 'missed connection', icon: '☎️' },
  weatherVoice: { name: 'Weather Voice', role: 'lot conditions', icon: '🌧️' },
  unknownEmployee: { name: 'Unknown Employee', role: 'unverified', icon: '👤' },
  directoryClerk: { name: 'Directory Clerk', role: 'SleepNet indexing', icon: '📂' },
  radioTower: { name: 'Radio Tower 1:47', role: 'broadcast', icon: '📡' },
  factionRep: { name: 'Faction Rep', role: 'turf office', icon: '🃏' },
  pawnCounter: { name: 'Pawn Counter Guy', role: 'object appraisal', icon: '🔍' },
  veryGoodBurger: { name: 'Very Good Burger Clerk', role: 'food court', icon: '🍔' },
};

// --- Storage ---

const STORAGE_KEY = 'breakroom.phone-messages.v1';
const MAX_MESSAGES = 100;
const PHONE_EVENT = 'breakroom:phone-updated';

function loadMessages(): PhoneMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: PhoneMessage[]): void {
  if (typeof window === 'undefined') return;
  const trimmed = messages.slice(0, MAX_MESSAGES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  // Notify listeners
  window.dispatchEvent(new CustomEvent(PHONE_EVENT, { detail: { count: getUnreadCount() } }));
}

let msgCounter = 0;
function generateMsgId(): string {
  msgCounter++;
  return `phone-${Date.now()}-${msgCounter}-${Math.random().toString(36).slice(2, 5)}`;
}

// --- Voice Templates ---
// Each event type maps to sender + message templates.
// Templates use {placeholders} replaced from ledger entry data.

type VoiceTemplate = {
  sender: keyof typeof SENDERS;
  type: PhoneMessageType;
  subjects: string[];
  bodies: string[];
  actionLabel?: string;
};

const VOICE_TEMPLATES: Partial<Record<LedgerEventType, VoiceTemplate[]>> = {
  guestbook_signed: [
    {
      sender: 'directoryClerk',
      type: 'text',
      subjects: ['Guestbook activity', 'Someone wrote something'],
      bodies: [
        'A guestbook was signed{district}. The handwriting is legible. The intention is not.',
        'New entry filed{district}. Contents have not been reviewed by management.',
        'Someone wrote in a guestbook{district}. The pen was already there.',
      ],
      actionLabel: 'View page',
    },
  ],
  door_unlocked: [
    {
      sender: 'nightManager',
      type: 'alert',
      subjects: ['A door moved', 'Access changed'],
      bodies: [
        'A door was found{district}. It was not listed before. It may not be listed again.',
        'Someone found a door{district}. The building does not confirm this.',
        'Access changed somewhere{district}. The directory has been notified. The directory does not care.',
      ],
    },
  ],
  door_moved: [
    {
      sender: 'roomAdmin',
      type: 'alert',
      subjects: ['Building rearranged', 'Door relocated'],
      bodies: [
        'A hidden door relocated{district}. Maps are now incorrect. Maps were already incorrect.',
        'The building rearranged{district}. The floor plan was never official.',
      ],
    },
  ],
  faction_drift: [
    {
      sender: 'factionRep',
      type: 'rumor',
      subjects: ['Drift detected', 'The room noticed'],
      bodies: [
        'Proximity pattern detected{district}. No official join filed. The room just noticed.',
        'Someone is drifting{district}. The table has opinions about this.',
        'Faction drift registered{district}. This is not a recruitment message. This is an observation.',
      ],
    },
  ],
  faction_joined: [
    {
      sender: 'factionRep',
      type: 'dispatch',
      subjects: ['Someone chose a side', 'Turf filed'],
      bodies: [
        'A join was filed. This decision is noted. The table acknowledges.',
        'Someone officially joined. The paperwork is as real as the faction.',
      ],
    },
  ],
  stuff_appeared: [
    {
      sender: 'pawnCounter',
      type: 'text',
      subjects: ['Object appeared', 'New item on shelf'],
      bodies: [
        'Something appeared{district}. It has been cataloged. Ownership is unclear.',
        'New object filed{district}. The shelf accepts it. The receipt does not.',
        'An item surfaced{district}. It was not reported missing. It was not reported at all.',
      ],
    },
  ],
  stuff_claimed: [
    {
      sender: 'pawnCounter',
      type: 'text',
      subjects: ['Object claimed', 'Drawer updated'],
      bodies: [
        'An object was saved to a drawer. The drawer does not verify intent.',
        'Something changed hands. The register was not involved.',
      ],
    },
  ],
  stuff_moved: [
    {
      sender: 'clerk711',
      type: 'text',
      subjects: ['Object relocated', 'Shelf changed'],
      bodies: [
        'An item moved between shelves. No one filed a transfer request.',
        'Object changed locations. The previous shelf denies everything.',
      ],
    },
  ],
  page_created: [
    {
      sender: 'directoryClerk',
      type: 'text',
      subjects: ['New page filed', 'URL registered'],
      bodies: [
        'A new page was created{district}. The directory has been updated. The directory did not ask for this.',
        'New URL filed{district}. SleepNet will index it when it gets around to it.',
      ],
      actionLabel: 'View page',
    },
  ],
  page_published: [
    {
      sender: 'directoryClerk',
      type: 'dispatch',
      subjects: ['Page indexed', 'SleepNet updated'],
      bodies: [
        'A page was added to the SleepNet index{district}. It is now searchable. It may regret this.',
        'New page indexed{district}. The directory grew by one.',
      ],
      actionLabel: 'Search it',
    },
  ],
  page_hidden: [
    {
      sender: 'roomAdmin',
      type: 'alert',
      subjects: ['Page removed', 'URL hidden'],
      bodies: [
        'A page was removed from the index. The reason was filed. The reason was not approved for display.',
        'One URL stopped being listed. This is not a mistake. Or it is. Management will not clarify.',
      ],
    },
  ],
  weather_shift: [
    {
      sender: 'weatherVoice',
      type: 'dispatch',
      subjects: ['Lot weather changed', 'Conditions updated'],
      bodies: [
        'Lot weather changed{district}. New conditions are in effect. Previous conditions deny having existed.',
        'Weather update{district}. The parking lot has been notified. The parking lot has opinions.',
      ],
    },
  ],
  radio_broadcast: [
    {
      sender: 'radioTower',
      type: 'text',
      subjects: ['Broadcast filed', 'Radio 1:47 update'],
      bodies: [
        'The broadcast layer updated. What aired is now evidence.',
        'Radio 1:47 transmitted something. The station log has been amended.',
      ],
      actionLabel: 'Tune in',
    },
  ],
  crew_formed: [
    {
      sender: 'nightManager',
      type: 'text',
      subjects: ['New crew registered', 'Names appeared together'],
      bodies: [
        'A new crew was filed{district}. The directory added a cluster. The cluster has not been verified.',
        'Names appeared together{district}. This has been noted. HR was not consulted.',
      ],
      actionLabel: 'View crews',
    },
  ],
  crew_disbanded: [
    {
      sender: 'nightManager',
      type: 'alert',
      subjects: ['Crew disbanded', 'Group removed'],
      bodies: [
        'A crew was removed from the directory. The reason was not filed. The reason may not exist.',
        'A group disbanded. The directory shortened itself.',
      ],
    },
  ],
  admin_action: [
    {
      sender: 'roomAdmin',
      type: 'dispatch',
      subjects: ['Wire Room action', 'Staff intervened'],
      bodies: [
        'Staff did something. The action was logged. The log is above your clearance.',
        'Management intervened. Details are in the Wire Room. You do not have Wire Room access.',
      ],
    },
  ],
  event_started: [
    {
      sender: 'phoneBehindBar',
      type: 'missed_call',
      subjects: ['Event started', 'Something is happening'],
      bodies: [
        'An event began{district}. You missed the start. The event does not care.',
        'Something is happening{district}. Attendance is optional. The sign sheet is not.',
      ],
      actionLabel: 'View events',
    },
  ],
  event_ended: [
    {
      sender: 'phoneBehindBar',
      type: 'voicemail',
      subjects: ['Event ended', 'Sign sheet closed'],
      bodies: [
        'An event ended{district}. The sign sheet has been filed. The memories are unverified.',
        'Something finished{district}. Results may or may not be posted.',
      ],
    },
  ],
};

// --- Fallback template for unmapped types ---

const FALLBACK_TEMPLATE: VoiceTemplate = {
  sender: 'unknownEmployee',
  type: 'text',
  subjects: ['Activity noticed', 'Something happened'],
  bodies: [
    'The room recorded something{district}. Details were not forwarded to this phone.',
    'An update was filed{district}. This phone received it by mistake. Or on purpose.',
  ],
};

// --- Message Generation ---

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fillPlaceholder(template: string, entry: LedgerEntry): string {
  const districtStr = entry.district
    ? ` in ${entry.district.replace(/-/g, ' ')}`
    : '';
  return template.replace(/\{district\}/g, districtStr);
}

function ledgerToPhoneMessage(entry: LedgerEntry): PhoneMessage {
  const templates = VOICE_TEMPLATES[entry.type] || [FALLBACK_TEMPLATE];
  const template = pickRandom(templates);
  const sender = SENDERS[template.sender] || SENDERS.unknownEmployee;

  // Build action href from entry
  let actionHref: string | undefined;
  if (entry.targetType === 'page' && entry.targetSlug) {
    actionHref = `/sleepnet/${entry.targetSlug}`;
  } else if (entry.targetType === 'event' && entry.targetSlug) {
    actionHref = `/events/${entry.targetSlug}`;
  } else if (entry.targetType === 'crew' && entry.targetSlug) {
    actionHref = `/crews/${entry.targetSlug}`;
  } else if (entry.targetType === 'stuff' && entry.targetSlug) {
    actionHref = `/stuff/${entry.targetSlug}`;
  } else if (entry.targetType === 'faction' && entry.targetSlug) {
    actionHref = `/factions/${entry.targetSlug}`;
  } else if (entry.type === 'radio_broadcast') {
    actionHref = '/radio';
  } else if (entry.type === 'event_started' || entry.type === 'event_ended') {
    actionHref = '/events';
  } else if (entry.type === 'crew_formed') {
    actionHref = '/crews';
  }

  return {
    id: generateMsgId(),
    ledgerEventId: entry.id,
    type: template.type,
    sender,
    subject: pickRandom(template.subjects),
    body: fillPlaceholder(pickRandom(template.bodies), entry),
    timestamp: entry.timestamp,
    read: false,
    district: entry.district,
    actionHref,
    actionLabel: template.actionLabel,
  };
}

// --- Public API ---

export function getPhoneMessages(limit = 50): PhoneMessage[] {
  return loadMessages().slice(0, limit);
}

export function getUnreadMessages(): PhoneMessage[] {
  return loadMessages().filter((m) => !m.read);
}

export function getUnreadCount(): number {
  return loadMessages().filter((m) => !m.read).length;
}

export function markAsRead(messageId: string): void {
  const messages = loadMessages();
  const msg = messages.find((m) => m.id === messageId);
  if (msg) {
    msg.read = true;
    saveMessages(messages);
  }
}

export function markAllAsRead(): void {
  const messages = loadMessages();
  for (const msg of messages) {
    msg.read = true;
  }
  saveMessages(messages);
}

export function dismissMessage(messageId: string): void {
  const messages = loadMessages().filter((m) => m.id !== messageId);
  saveMessages(messages);
}

export function clearAllMessages(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(PHONE_EVENT, { detail: { count: 0 } }));
}

// --- Deduplication ---

function isDuplicate(entry: LedgerEntry, existing: PhoneMessage[]): boolean {
  return existing.some((m) => m.ledgerEventId === entry.id);
}

// --- Subscription ---

let unsubscribeLedger: (() => void) | null = null;

export function startPhoneListener(): () => void {
  if (typeof window === 'undefined') return () => {};
  if (unsubscribeLedger) return unsubscribeLedger; // already listening

  unsubscribeLedger = onLedgerEvent((entry) => {
    // Skip admin-only entries — phone doesn't have clearance
    if (entry.visibility === 'admin_only') return;

    const messages = loadMessages();
    if (isDuplicate(entry, messages)) return;

    const phoneMsg = ledgerToPhoneMessage(entry);
    messages.unshift(phoneMsg);
    saveMessages(messages);
  });

  return () => {
    if (unsubscribeLedger) {
      unsubscribeLedger();
      unsubscribeLedger = null;
    }
  };
}

// --- Phone update listener for React components ---

export function onPhoneUpdate(fn: (count: number) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    fn(detail?.count ?? getUnreadCount());
  };
  window.addEventListener(PHONE_EVENT, handler);
  return () => window.removeEventListener(PHONE_EVENT, handler);
}

// --- Seed messages (for first load) ---

const SEED_MESSAGES: Omit<PhoneMessage, 'id'>[] = [
  {
    type: 'voicemail',
    sender: SENDERS.phoneBehindBar,
    subject: 'Missed call / wrong number',
    body: 'Someone called looking for a bar that closed in 2009. The phone answered anyway. The conversation lasted 4 minutes. Neither party understood.',
    timestamp: Date.now() - 86400000 * 3,
    read: false,
    district: 'parking-lot-west',
  },
  {
    type: 'dispatch',
    sender: SENDERS.nightManager,
    subject: 'Shift notice',
    body: 'OmniShift Dispatch reminds you: do not return to work. Report to the room. The room does not have an address. The room has a feeling.',
    timestamp: Date.now() - 86400000 * 2,
    read: false,
  },
  {
    type: 'text',
    sender: SENDERS.veryGoodBurger,
    subject: 'Order update',
    body: 'Your order is ready. We do not remember your order. The bag is by the door. The door is by the room. The room is by the feeling.',
    timestamp: Date.now() - 86400000 * 1.5,
    read: false,
    district: 'closed-food-court',
    actionHref: '/sleepnet/very-good-burger',
    actionLabel: 'View menu',
  },
  {
    type: 'missed_call',
    sender: SENDERS.poolOracle,
    subject: 'Table 4 has a message',
    body: 'The felt remembers your last game. It was not good. The table offers a rematch. The table offers this to everyone. The table is generous and unkind.',
    timestamp: Date.now() - 86400000,
    read: false,
    district: 'pool-hall-county',
    actionHref: '/idle-hands',
    actionLabel: 'View brackets',
  },
  {
    type: 'rumor',
    sender: SENDERS.clerk711,
    subject: 'Overheard at counter',
    body: 'Someone left a matchbook with a phone number. The phone number is this phone. The matchbook is now evidence.',
    timestamp: Date.now() - 3600000 * 8,
    read: false,
    district: 'motel-row',
    actionHref: '/stuff',
    actionLabel: 'Check lost & found',
  },
  {
    type: 'alert',
    sender: SENDERS.roomAdmin,
    subject: 'Directory update',
    body: 'SleepNet indexed 3 new pages overnight. Two of them deny existing. The third one is a menu for a restaurant that is also a parking lot.',
    timestamp: Date.now() - 3600000 * 4,
    read: true,
    actionHref: '/sleepnet',
    actionLabel: 'Search SleepNet',
  },
  {
    type: 'text',
    sender: SENDERS.weatherVoice,
    subject: 'Lot conditions',
    body: 'Current lot weather: humid, flickering lights, 73°F. Visibility: low. Morale: unverified. The parking lot has been notified. The parking lot is processing.',
    timestamp: Date.now() - 3600000 * 2,
    read: true,
    district: 'parking-lot-west',
  },
];

export function seedPhoneIfEmpty(): void {
  const messages = loadMessages();
  if (messages.length > 0) return;

  const seeded: PhoneMessage[] = SEED_MESSAGES.map((m, i) => ({
    ...m,
    id: `seed-phone-${i}`,
  }));

  saveMessages(seeded);
}

// --- Formatted time helper ---

export function formatPhoneTime(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  const d = new Date(ts);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'AM' : 'PM'; // After-hours: AM/PM reversed on purpose
  const hour12 = h % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}

// --- Message type labels ---

export function getMessageTypeLabel(type: PhoneMessageType): string {
  const labels: Record<PhoneMessageType, string> = {
    voicemail: 'VOICEMAIL',
    text: 'TEXT',
    missed_call: 'MISSED CALL',
    dispatch: 'DISPATCH',
    alert: 'ALERT',
    rumor: 'RUMOR',
  };
  return labels[type] || 'MSG';
}

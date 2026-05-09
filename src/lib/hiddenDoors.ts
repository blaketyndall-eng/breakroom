/**
 * Hidden Doors V1 — Secret unlocks scattered across pages.
 * Static registry (authored content) + localStorage unlock state (user data).
 *
 * Door rewards can include real external URLs, internal pages, objects, or messages.
 */

import { emitDoorUnlocked } from './ledgerEmitters';

export type DoorTriggerType = 'search_phrase' | 'object_combination' | 'behaviour' | 'guestbook_phrase' | 'page_visit_count';

export type DoorRewardType = 'page' | 'message' | 'object' | 'url' | 'search_result' | 'radio_segment';

export type HiddenDoor = {
  slug: string;
  name: string;
  triggerType: DoorTriggerType;
  triggerValue: string; // phrase, object slugs joined by +, behaviour key, etc.
  rewardType: DoorRewardType;
  reward: {
    title: string;
    body?: string;
    href?: string;
    isExternal?: boolean;
    objectSlug?: string;
    realityStatus?: 'real' | 'fictional' | 'unverified';
  };
  hint?: string;
  district?: string;
  isActive: boolean;
};

export type DoorUnlock = {
  doorSlug: string;
  unlockedAt: string;
};

const UNLOCK_STORAGE_KEY = 'breakroom.hidden-doors-unlocked.v1';
const DOOR_EVENT = 'breakroom:door-opened';

// --- Static Door Registry ---

const DOOR_REGISTRY: HiddenDoor[] = [
  {
    slug: 'clock-search',
    name: 'The Clock Question',
    triggerType: 'search_phrase',
    triggerValue: 'why is the clock stuck at 1:47',
    rewardType: 'message',
    reward: {
      title: 'Clock Response',
      body: 'The clock is not stuck. The clock is correct. Everything else moved.',
    },
    hint: 'Ask the right question about time.',
    district: 'corporate_ruins',
    isActive: true,
  },
  {
    slug: 'motel-key-search',
    name: 'Room 8 Inquiry',
    triggerType: 'search_phrase',
    triggerValue: 'motel key 8',
    rewardType: 'message',
    reward: {
      title: 'Key Acknowledged',
      body: 'The key has been seen. Room 8 is not available. Room 8 was never available. The front desk remembers you anyway.',
    },
    hint: 'Search for what you already have.',
    district: 'motel_row',
    isActive: true,
  },
  {
    slug: 'still-open-burger',
    name: 'The Burger Window',
    triggerType: 'search_phrase',
    triggerValue: 'still open burger',
    rewardType: 'search_result',
    reward: {
      title: 'Still Open Burger — Menu & Hours',
      body: 'Open after 1 AM. Closed before questions. The AI made this restaurant. The restaurant does not know.',
      href: '/sleepnet/very-good-burger',
    },
    hint: 'Search for food when you should not be hungry.',
    district: 'the_food_court_that_closed',
    isActive: true,
  },
  {
    slug: 'dead-link-finder',
    name: 'Dead Link Recovery',
    triggerType: 'behaviour',
    triggerValue: 'visit_dead_link_cemetery',
    rewardType: 'message',
    reward: {
      title: 'Link Recovered',
      body: 'The directory pretended this link was dead. The link was hiding. You found it by looking where nobody looks.',
    },
    district: 'classified_alley',
    isActive: true,
  },
  {
    slug: 'three-guestbooks',
    name: 'The Regular',
    triggerType: 'behaviour',
    triggerValue: 'sign_three_guestbooks',
    rewardType: 'message',
    reward: {
      title: 'Regular Status Acknowledged',
      body: 'Three marks. The room noticed. You are no longer a visitor. You are a regular. The wall remembers.',
    },
    district: 'pool_hall_county',
    isActive: true,
  },
  {
    slug: 'fuzzy-dice-object',
    name: 'The Dice',
    triggerType: 'object_combination',
    triggerValue: 'fuzzy-dice+timing-slip',
    rewardType: 'message',
    reward: {
      title: 'Object Resonance Detected',
      body: 'Fuzzy dice and a timing slip. You came prepared or you came lucky. The lot knows the difference.',
    },
    hint: 'Pair the right objects.',
    district: 'parking_lot_west',
    isActive: true,
  },
];

// --- Unlock State (localStorage) ---

function readUnlocks(): DoorUnlock[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(UNLOCK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUnlocks(unlocks: DoorUnlock[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(UNLOCK_STORAGE_KEY, JSON.stringify(unlocks));
}

export function getUnlockedDoors(): DoorUnlock[] {
  return readUnlocks();
}

export function isDoorUnlocked(doorSlug: string): boolean {
  return readUnlocks().some((u) => u.doorSlug === doorSlug);
}

export function unlockDoor(doorSlug: string): { isNew: boolean; door: HiddenDoor | null } {
  const door = DOOR_REGISTRY.find((d) => d.slug === doorSlug && d.isActive);
  if (!door) return { isNew: false, door: null };

  const unlocks = readUnlocks();
  if (unlocks.some((u) => u.doorSlug === doorSlug)) {
    return { isNew: false, door };
  }

  const newUnlock: DoorUnlock = { doorSlug, unlockedAt: new Date().toISOString() };
  writeUnlocks([...unlocks, newUnlock]);

  // Dispatch event so other components can react
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DOOR_EVENT, { detail: { door, unlock: newUnlock } }));
  }

  // PR 72: emit redacted ledger event. Pocket Slips, /ledger, and the
  // phone listener all read from this. Defensive try/catch.
  try {
    emitDoorUnlocked({ doorSlug, district: door.district });
  } catch {
    /* emitter errors are swallowed; unlock state is already persisted */
  }

  return { isNew: true, door };
}

// --- Trigger Matching ---

/**
 * Check if a search phrase triggers any doors.
 * Returns the first matching door or null.
 */
export function checkSearchPhraseTrigger(phrase: string): HiddenDoor | null {
  const normalized = phrase.trim().toLowerCase();
  if (!normalized) return null;

  return DOOR_REGISTRY.find(
    (door) => door.isActive && door.triggerType === 'search_phrase' && normalized.includes(door.triggerValue)
  ) ?? null;
}

/**
 * Check if a behaviour key triggers any doors.
 * Behaviour keys: 'visit_dead_link_cemetery', 'sign_three_guestbooks', etc.
 */
export function checkBehaviourTrigger(behaviourKey: string): HiddenDoor | null {
  return DOOR_REGISTRY.find(
    (door) => door.isActive && door.triggerType === 'behaviour' && door.triggerValue === behaviourKey
  ) ?? null;
}

/**
 * Check if a set of saved object slugs triggers any doors.
 */
export function checkObjectCombinationTrigger(savedObjectSlugs: string[]): HiddenDoor | null {
  const slugSet = new Set(savedObjectSlugs);

  return DOOR_REGISTRY.find((door) => {
    if (!door.isActive || door.triggerType !== 'object_combination') return false;
    const required = door.triggerValue.split('+');
    return required.every((slug) => slugSet.has(slug));
  }) ?? null;
}

// --- Public Queries ---

/**
 * Get all doors (for admin/debug). Does NOT expose to users.
 */
export function getAllDoors(): HiddenDoor[] {
  return DOOR_REGISTRY.filter((d) => d.isActive);
}

/**
 * Get count of unlocked doors. Never expose total count publicly.
 */
export function getUnlockedCount(): number {
  return readUnlocks().length;
}

/**
 * Get a door by slug (for rendering rewards).
 */
export function getDoorBySlug(slug: string): HiddenDoor | null {
  return DOOR_REGISTRY.find((d) => d.slug === slug) ?? null;
}

/**
 * Listen for door unlock events.
 */
export function onDoorOpened(callback: (detail: { door: HiddenDoor; unlock: DoorUnlock }) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (event: Event) => callback((event as CustomEvent).detail);
  window.addEventListener(DOOR_EVENT, handler);
  return () => window.removeEventListener(DOOR_EVENT, handler);
}

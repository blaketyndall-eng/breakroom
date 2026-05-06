/**
 * Make One Thing — Creation Template Registry
 *
 * Each template is a creation type: fake ad, object, rumor, classified, etc.
 * Templates are organized into personalized pools for the 5-layer cascade.
 * One field per template. No drafts. No editing. You make it. It's in the world.
 *
 * Daily limit: 3 creations per day.
 */

import {
  type PersonalizedPool,
  selectPersonalizedContent,
  getPocketIdentity,
  fillTemplate,
} from '@/lib/pocketPersonalization';

// --- Types ---

export type CreationType =
  | 'fake_ad'
  | 'object_listing'
  | 'rumor'
  | 'classified'
  | 'guestbook_line'
  | 'agent_quote'
  | 'pool_hall_classified'
  | 'lot_listing'
  | 'bar_napkin_note'
  | 'fence_posting'
  | 'open_field_report';

export type MakeTemplate = {
  id: string;
  type: CreationType;
  label: string;
  prompt: string;
  placeholder: string;
  /** Route prefix for the published permalink */
  permalinkPrefix: string;
  /** Faction slug this template is associated with, if any */
  factionSlug?: string;
};

export type Creation = {
  id: string;
  type: CreationType;
  templateId: string;
  content: string;
  handle: string;
  factionSlug: string | null;
  createdAt: string;
  /** Permalink path (e.g., /stuff/abc123) */
  permalink: string;
};

// --- Storage ---

const CREATIONS_KEY = 'breakroom.creations.v1';
const DAILY_COUNT_KEY = 'breakroom.creations-today.v1';
const DAILY_LIMIT = 3;

function getCreations(): Creation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CREATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCreations(creations: Creation[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CREATIONS_KEY, JSON.stringify(creations));
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getDailyCount(): { date: string; count: number } {
  if (typeof window === 'undefined') return { date: getTodayKey(), count: 0 };
  try {
    const raw = localStorage.getItem(DAILY_COUNT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.date === getTodayKey()) return parsed;
    }
    return { date: getTodayKey(), count: 0 };
  } catch {
    return { date: getTodayKey(), count: 0 };
  }
}

function incrementDailyCount(): void {
  const current = getDailyCount();
  const updated = { date: getTodayKey(), count: current.count + 1 };
  localStorage.setItem(DAILY_COUNT_KEY, JSON.stringify(updated));
}

// --- Template Pools ---

const UNIVERSAL_TEMPLATES: MakeTemplate[] = [
  {
    id: 'fake-ad-1',
    type: 'fake_ad',
    label: 'Fake Ad',
    prompt: 'Write a fake ad for something that should not be advertised.',
    placeholder: 'HALF OFF: [your ad here]',
    permalinkPrefix: '/ads',
  },
  {
    id: 'fake-ad-2',
    type: 'fake_ad',
    label: 'Fake Ad',
    prompt: 'Advertise something the vending machine would sell if it had opinions.',
    placeholder: 'NOW AVAILABLE: [product]',
    permalinkPrefix: '/ads',
  },
  {
    id: 'object-1',
    type: 'object_listing',
    label: 'Object',
    prompt: 'Describe an object found in the parking lot at 2 AM.',
    placeholder: 'Found: [object description]',
    permalinkPrefix: '/stuff',
  },
  {
    id: 'object-2',
    type: 'object_listing',
    label: 'Object',
    prompt: 'Name and describe something left in the lost and found that nobody claimed.',
    placeholder: '[object] — [where it was found]',
    permalinkPrefix: '/stuff',
  },
  {
    id: 'rumor-1',
    type: 'rumor',
    label: 'Rumor',
    prompt: 'Share one rumor about this building. It may or may not be true.',
    placeholder: 'They say [rumor]',
    permalinkPrefix: '/classifieds',
  },
  {
    id: 'rumor-2',
    type: 'rumor',
    label: 'Rumor',
    prompt: 'What do the night shift employees whisper about?',
    placeholder: 'Apparently [rumor]',
    permalinkPrefix: '/classifieds',
  },
  {
    id: 'classified-1',
    type: 'classified',
    label: 'Classified',
    prompt: 'Post a classified ad. Wanted, for sale, lost, or found.',
    placeholder: 'WANTED: [item or service]',
    permalinkPrefix: '/classifieds',
  },
  {
    id: 'classified-2',
    type: 'classified',
    label: 'Classified',
    prompt: 'Something needs to be listed. The reason is unclear.',
    placeholder: 'FOR SALE: [listing]',
    permalinkPrefix: '/classifieds',
  },
  {
    id: 'guestbook-1',
    type: 'guestbook_line',
    label: 'Guestbook',
    prompt: 'Sign the wall. One line. Make it count or don\'t.',
    placeholder: '[your mark here]',
    permalinkPrefix: '/sign-the-wall',
  },
  {
    id: 'agent-quote-1',
    type: 'agent_quote',
    label: 'Agent Quote',
    prompt: 'Put words in the Night Manager\'s mouth. What did they say?',
    placeholder: '"[what the Night Manager said]"',
    permalinkPrefix: '/agents',
  },
  {
    id: 'agent-quote-2',
    type: 'agent_quote',
    label: 'Agent Quote',
    prompt: 'The 7/11 Clerk said something. Nobody wrote it down. Until now.',
    placeholder: '"[what the clerk said]"',
    permalinkPrefix: '/agents',
  },
];

const FACTION_TEMPLATES: Record<string, MakeTemplate[]> = {
  'the-players': [
    {
      id: 'players-classified-1',
      type: 'pool_hall_classified',
      label: 'Pool Hall Classified',
      prompt: 'Post a classified to the pool hall bulletin board.',
      placeholder: 'POSTED TO THE BOARD: [your classified]',
      permalinkPrefix: '/classifieds',
      factionSlug: 'the-players',
    },
    {
      id: 'players-classified-2',
      type: 'pool_hall_classified',
      label: 'Pool Hall Classified',
      prompt: 'The table needs something. Post it.',
      placeholder: 'TABLE NOTICE: [posting]',
      permalinkPrefix: '/classifieds',
      factionSlug: 'the-players',
    },
  ],
  'lot-racers': [
    {
      id: 'lot-listing-1',
      type: 'lot_listing',
      label: 'Lot Listing',
      prompt: 'List something for the parking lot. Vehicle, object, or condition.',
      placeholder: 'LOT LISTING: [description]',
      permalinkPrefix: '/stuff',
      factionSlug: 'lot-racers',
    },
    {
      id: 'lot-listing-2',
      type: 'lot_listing',
      label: 'Lot Listing',
      prompt: 'Report something spotted in the lot after midnight.',
      placeholder: 'SPOTTED: [sighting]',
      permalinkPrefix: '/stuff',
      factionSlug: 'lot-racers',
    },
  ],
  'night-drinkers': [
    {
      id: 'napkin-1',
      type: 'bar_napkin_note',
      label: 'Bar Napkin Note',
      prompt: 'Write something on a bar napkin. It will be found tomorrow.',
      placeholder: '[scrawled on napkin]',
      permalinkPrefix: '/classifieds',
      factionSlug: 'night-drinkers',
    },
    {
      id: 'napkin-2',
      type: 'bar_napkin_note',
      label: 'Bar Napkin Note',
      prompt: 'The person next to you left. This napkin is what remains.',
      placeholder: '[what was written]',
      permalinkPrefix: '/classifieds',
      factionSlug: 'night-drinkers',
    },
  ],
  'the-smokers': [
    {
      id: 'fence-1',
      type: 'fence_posting',
      label: 'Fence Posting',
      prompt: 'Pin something to the fence outside. It will stay until it doesn\'t.',
      placeholder: 'POSTED: [your message]',
      permalinkPrefix: '/classifieds',
      factionSlug: 'the-smokers',
    },
    {
      id: 'fence-2',
      type: 'fence_posting',
      label: 'Fence Posting',
      prompt: 'The fence has a new opening. Tape something over it.',
      placeholder: '[taped to fence]',
      permalinkPrefix: '/classifieds',
      factionSlug: 'the-smokers',
    },
  ],
  'cowboys': [
    {
      id: 'field-report-1',
      type: 'open_field_report',
      label: 'Open Field Report',
      prompt: 'File an open field report. Location: anywhere but here.',
      placeholder: 'FIELD REPORT: [observation]',
      permalinkPrefix: '/classifieds',
      factionSlug: 'cowboys',
    },
    {
      id: 'field-report-2',
      type: 'open_field_report',
      label: 'Open Field Report',
      prompt: 'Something happened out past the lot. Document it.',
      placeholder: 'OBSERVED: [what happened]',
      permalinkPrefix: '/classifieds',
      factionSlug: 'cowboys',
    },
  ],
};

const DRAWER_TEMPLATES: MakeTemplate[] = [
  {
    id: 'drawer-classified-1',
    type: 'classified',
    label: 'Classified',
    prompt: 'Write a classified for your ${drawerItem}. Sell it, lose it, or warn others.',
    placeholder: 'RE: ${drawerItem} — [your listing]',
    permalinkPrefix: '/classifieds',
  },
  {
    id: 'drawer-object-1',
    type: 'object_listing',
    label: 'Object',
    prompt: 'Your ${drawerItem} has a backstory. What is it?',
    placeholder: '[origin of ${drawerItem}]',
    permalinkPrefix: '/stuff',
  },
];

const PROFILE_TEMPLATES: MakeTemplate[] = [
  {
    id: 'profile-rumor-1',
    type: 'rumor',
    label: 'Rumor',
    prompt: 'What do people say about ${handle} behind the counter?',
    placeholder: 'I heard ${handle} [rumor]',
    permalinkPrefix: '/classifieds',
  },
  {
    id: 'profile-ad-1',
    type: 'fake_ad',
    label: 'Fake Ad',
    prompt: '${handle} needs to advertise something. The budget is zero.',
    placeholder: '${handle} PRESENTS: [ad]',
    permalinkPrefix: '/ads',
  },
];

// --- Template Selection ---

function buildTemplatePools(): PersonalizedPool<MakeTemplate>[] {
  const pools: PersonalizedPool<MakeTemplate>[] = [];
  const identity = getPocketIdentity();

  // Universal
  pools.push({ layer: 'universal', items: UNIVERSAL_TEMPLATES });

  // Turf-specific
  if (identity.turf && FACTION_TEMPLATES[identity.turf]) {
    pools.push({
      layer: 'turf',
      factionSlug: identity.turf,
      items: FACTION_TEMPLATES[identity.turf],
    });
  }

  // Drift-adjacent (all faction templates for drift faction)
  if (identity.driftFaction && identity.driftScore >= 2 && FACTION_TEMPLATES[identity.driftFaction]) {
    pools.push({
      layer: 'drift',
      factionSlug: identity.driftFaction,
      items: FACTION_TEMPLATES[identity.driftFaction],
    });
  }

  // Drawer-reactive
  if (identity.drawerCount >= 3) {
    pools.push({ layer: 'drawer', items: DRAWER_TEMPLATES });
  }

  // Profile-reactive
  if (identity.hasRegularFile) {
    pools.push({ layer: 'profile', items: PROFILE_TEMPLATES });
  }

  return pools;
}

/**
 * Get a random creation template, weighted by personalization cascade.
 * Templates with ${variables} are filled from identity.
 */
export function getRandomTemplate(): MakeTemplate {
  const pools = buildTemplatePools();
  const template = selectPersonalizedContent(pools);

  // Fill any template strings in prompt and placeholder
  return {
    ...template,
    prompt: fillTemplate(template.prompt),
    placeholder: fillTemplate(template.placeholder),
  };
}

// --- Creation ---

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Submit a creation. Returns the new Creation or null if daily limit hit.
 */
export function submitCreation(template: MakeTemplate, content: string): Creation | null {
  const daily = getDailyCount();
  if (daily.count >= DAILY_LIMIT) return null;

  const identity = getPocketIdentity();
  const id = generateId();

  const creation: Creation = {
    id,
    type: template.type,
    templateId: template.id,
    content: content.trim(),
    handle: identity.handle,
    factionSlug: identity.turf,
    createdAt: new Date().toISOString(),
    permalink: `${template.permalinkPrefix}/${id}`,
  };

  const creations = getCreations();
  creations.unshift(creation);
  saveCreations(creations);
  incrementDailyCount();

  return creation;
}

/**
 * Get remaining creations for today.
 */
export function getRemainingToday(): number {
  const daily = getDailyCount();
  return Math.max(0, DAILY_LIMIT - daily.count);
}

/**
 * Check if the user can create today.
 */
export function canCreateToday(): boolean {
  return getRemainingToday() > 0;
}

/**
 * Get recent creations.
 */
export function getRecentCreations(limit = 10): Creation[] {
  return getCreations().slice(0, limit);
}

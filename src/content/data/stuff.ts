export type StuffItemStatus =
  | 'fake'
  | 'coming_soon'
  | 'removed_by_management'
  | 'found'
  | 'official_later'
  | 'not_for_you_yet'
  | 'printable'
  | 'available';

export type StuffItemKind =
  | 'object'
  | 'artifact'
  | 'uniform'
  | 'menu_item'
  | 'paper_good'
  | 'sticker'
  | 'apparel'
  | 'unknown';

export type StuffItem = {
  slug: string;
  name: string;
  status: StuffItemStatus;
  kind: StuffItemKind;
  description: string;
  note?: string;
  priceLabel?: string;
  sourceLabel?: string;
  relatedSleepNetSlug?: string;
  relatedObjectSlug?: string;
  relatedProductSlug?: string;
  /**
   * PR 73: faction slugs this object resonates with.
   * Saving an item with `relatedFactionSlugs` fires a `save_faction_stuff`
   * drift signal for each faction (handled in `savedStuff.ts:saveStuffItem`).
   * Use sparingly — most objects don't have explicit faction lean.
   */
  relatedFactionSlugs?: string[];
  tags: string[];
};

export const STUFF_STATUS_LABELS: Record<StuffItemStatus, string> = {
  fake: 'Fake',
  coming_soon: 'Coming Soon',
  removed_by_management: 'Removed By Management',
  found: 'Found',
  official_later: 'Official Later',
  not_for_you_yet: 'Not For You Yet',
  printable: 'Printable',
  available: 'Available',
};

export const STUFF_ITEMS: StuffItem[] = [
  {
    slug: 'very-good-hat',
    name: 'Very Good Hat',
    status: 'coming_soon',
    kind: 'uniform',
    description: 'A uniform hat from Very Good Burger. Nobody knows who approved the color, which means the color is probably final.',
    note: 'Uniform item. Seen behind the counter once.',
    sourceLabel: 'Very Good Burger',
    relatedSleepNetSlug: 'very-good-burger',
    tags: ['burger', 'uniform', 'food court', 'hat'],
  },
  {
    slug: 'legal-napkin-pack',
    name: 'Legal Napkin Pack',
    status: 'removed_by_management',
    kind: 'paper_good',
    description: 'A pack of napkins used for provisional meals, table arguments, and statements nobody wants notarized.',
    note: 'Removed after becoming legally useful.',
    priceLabel: '$?.??',
    sourceLabel: 'Very Good Burger',
    relatedSleepNetSlug: 'very-good-burger',
    relatedObjectSlug: 'legal-napkin-pack',
    tags: ['napkin', 'legal', 'paper', 'burger'],
  },
  {
    slug: 'burger-receipt-tee',
    name: 'Burger Receipt Tee',
    status: 'not_for_you_yet',
    kind: 'apparel',
    description: 'A shirt based on a receipt that printed without a total. The back office claims this is not a product. That usually means it is becoming one.',
    note: 'Seen once in the back office.',
    sourceLabel: 'Very Good Burger',
    relatedSleepNetSlug: 'very-good-burger',
    relatedProductSlug: 'burger-receipt-tee',
    tags: ['tee', 'receipt', 'apparel', 'burger'],
  },
  {
    slug: 'good-sauce-sticker',
    name: 'Good Sauce Sticker',
    status: 'fake',
    kind: 'sticker',
    description: 'A sauce sticker that may have been invented by the coupon printer. Promotional evidence remains disputed.',
    note: 'Sticker has not been proven to exist.',
    priceLabel: '$0.47',
    sourceLabel: 'Very Good Burger',
    relatedSleepNetSlug: 'very-good-burger',
    tags: ['sticker', 'sauce', 'fake', 'coupon'],
  },
  {
    slug: 'receipt-with-no-total',
    name: 'Receipt With No Total',
    status: 'found',
    kind: 'artifact',
    description: 'A receipt that refuses to say what was paid. Useful for arguments, shrines, and certain kinds of accounting.',
    note: 'Found under the counter. Still warm.',
    priceLabel: '$?.??',
    sourceLabel: 'Back Office',
    relatedObjectSlug: 'receipt-with-no-total',
    tags: ['receipt', 'artifact', 'counter'],
  },
  {
    slug: 'dial-tone-slip',
    name: 'Dial Tone Slip',
    status: 'printable',
    kind: 'artifact',
    description: 'A small paper slip that appears near phones that should not be ringing.',
    note: 'Print, fold, deny.',
    sourceLabel: 'Phone Behind The Bar',
    relatedObjectSlug: 'dial-tone-slip',
    tags: ['phone', 'printable', 'artifact'],
  },
  {
    slug: 'wrong-employee-badge',
    name: 'Wrong Employee Badge',
    status: 'found',
    kind: 'object',
    description: 'A badge for an employee nobody remembers hiring. The photo is always a little too dark.',
    note: 'Do not wear it unless the room says your name first.',
    sourceLabel: 'OmniShift Drawer',
    relatedObjectSlug: 'wrong-employee-badge',
    tags: ['badge', 'employee', 'omnishift'],
  },
  {
    slug: 'jukebox-quarter',
    name: 'Jukebox Quarter',
    status: 'official_later',
    kind: 'object',
    description: 'A quarter that only works in machines that already know the song.',
    note: 'Future token. Current evidence.',
    sourceLabel: 'Night Drinkers',
    relatedObjectSlug: 'jukebox-quarter',
    tags: ['jukebox', 'quarter', 'night drinkers'],
  },
  {
    // PR 73: The Motel Key Loop.
    // Cross-linked to the canonical Lost & Found row at id "008" via
    // `relatedObjectSlug: 'motel-key-no-8'` (slugified from
    // BREAKROOM_DATA.objects[0].name in `breakroom.ts`). After PR 71,
    // that slug resolves to /newsstand/classifieds/motel-key-no-8 in
    // SleepNews chrome.
    //
    // Faction relations: Cowboys (open road / wandering / motel as
    // crossroads) and Night Drinkers (motel key as bar regular's
    // evidence — the matchbook's cousin). Saving this item fires drift
    // signals for both via `save_faction_stuff`.
    slug: 'motel-key-no-8',
    name: 'Motel Key No. 8',
    status: 'not_for_you_yet',
    kind: 'object',
    description: 'A motel key with a brass tag reading "8". Found under bad lighting. Condition: warm. Meaning: access without belonging. The key has been seen. Room 8 is not available. Room 8 was never available. The front desk remembers you anyway.',
    note: 'Saved key triggers a question worth asking on SleepNet.',
    sourceLabel: 'Motel Row counter',
    relatedObjectSlug: 'motel-key-no-8',
    relatedFactionSlugs: ['cowboys', 'night-drinkers'],
    tags: ['motel', 'key', 'room 8', 'wandering', 'night drinkers', 'cowboys'],
  },
];

export function getStuffItemBySlug(slug: string) {
  return STUFF_ITEMS.find((item) => item.slug === slug) ?? null;
}

export function searchStuffItems(query = '') {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return STUFF_ITEMS;
  return STUFF_ITEMS.filter((item) => {
    const haystack = [item.name, item.status, item.kind, item.description, item.note, item.sourceLabel, item.tags.join(' ')]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

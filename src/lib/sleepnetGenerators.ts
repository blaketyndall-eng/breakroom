import { createFauxCompanyComponents } from '@/lib/sleepnetComponents';
import type { SleepNetComponent } from '@/lib/sleepnetComponents';
import type { SleepNetSection, SleepNetSite } from '@/lib/sleepnetSites';

export type SleepNetSiteType =
  | 'faux_company'
  | 'personal_homepage'
  | 'classified_board'
  | 'faction_turf'
  | 'fake_restaurant'
  | 'object_archive';

export const SLEEPNET_SITE_TYPES: SleepNetSiteType[] = [
  'faux_company',
  'personal_homepage',
  'classified_board',
  'faction_turf',
  'fake_restaurant',
  'object_archive',
];

export const SLEEPNET_SITE_TYPE_LABELS: Record<SleepNetSiteType | 'auto', string> = {
  auto: 'Let SleepNet Guess',
  faux_company: 'Faux Company',
  personal_homepage: 'Personal Homepage',
  classified_board: 'Classified Board',
  faction_turf: 'Faction Turf',
  fake_restaurant: 'Fake Restaurant',
  object_archive: 'Object Archive',
};

function normalizeGeneratorSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

function buildGeneratorSearchText(site: Pick<SleepNetSite, 'title' | 'tagline' | 'description' | 'site_type' | 'neighborhood'>) {
  return [site.title, site.tagline, site.description, site.site_type, site.neighborhood]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function titleFromPrompt(prompt: string, fallback: string) {
  return (prompt.trim() || fallback)
    .replace(/^a\s+/i, '')
    .split(/[,.]/)[0]
    .split(' ')
    .slice(0, 5)
    .join(' ') || fallback;
}

function baseSite(input: { prompt: string; siteType: SleepNetSiteType; title: string; tagline: string; neighborhood: string; sections: SleepNetSection[]; components: SleepNetComponent[]; relatedObjects?: string[]; relatedAgent?: string; }): SleepNetSite {
  const description = input.prompt.trim() || input.tagline;
  const site: SleepNetSite = {
    slug: normalizeGeneratorSlug(input.title),
    title: input.title,
    site_type: input.siteType,
    neighborhood: input.neighborhood,
    tagline: input.tagline,
    description,
    theme: 'two_thousand_three_local_business',
    status: 'draft',
    is_public: false,
    related_object_slugs: input.relatedObjects ?? [],
    related_agent_slug: input.relatedAgent ?? 'directory-clerk',
    faction_affinity: input.siteType === 'faction_turf' ? ['the-players'] : [],
    weirdness_level: 3,
    reality_status: 'indexed_noise',
    canonical_weight: 0,
    stuff_shelf_enabled: true,
    guestbook_enabled: true,
    gallery_enabled: true,
    jukebox_enabled: true,
    sections: input.sections,
    components: input.components,
  };

  return { ...site, search_text: buildGeneratorSearchText(site) };
}

function cloneComponentsFor(title: string, overrides: Partial<{ comment: string; notice: string; adHeadline: string; shelfTitle: string; jukeboxTitle: string; }> = {}) {
  return createFauxCompanyComponents(title).map((component) => {
    if (component.type === 'character_comment' && overrides.comment) return { ...component, body: overrides.comment };
    if (component.type === 'warning_notice' && overrides.notice) return { ...component, body: overrides.notice };
    if (component.type === 'fake_ad' && overrides.adHeadline) return { ...component, headline: overrides.adHeadline };
    if (component.type === 'stuff_shelf' && overrides.shelfTitle) return { ...component, title: overrides.shelfTitle };
    if (component.type === 'jukebox' && overrides.jukeboxTitle) return { ...component, title: overrides.jukeboxTitle };
    return component;
  });
}

export function generateFauxCompanyDraft(prompt: string) {
  const title = titleFromPrompt(prompt, 'Still Open Company');
  return baseSite({
    prompt,
    siteType: 'faux_company',
    title,
    tagline: 'Serving whoever is still awake.',
    neighborhood: 'corporate_ruins',
    relatedObjects: ['dial-tone-slip', 'receipt-with-no-total', 'wrong-employee-badge'],
    relatedAgent: 'night-manager',
    components: cloneComponentsFor(title),
    sections: [
      { title: 'What We Claim To Do', body: `${title} provides dependable after-hours services for customers who missed every normal option.` },
      { title: 'What We Actually Do', body: 'We answer the phone, move objects between rooms, misread receipts, and keep the lights on long enough for the page to load.' },
      { title: 'Services', body: 'Late counter advice. Object verification. Suspicious delivery acceptance. Emergency coffee. Documents stamped for emotional reasons.' },
      { title: 'Legal Notice', body: 'All claims are provisional. Any resemblance to a functioning business is a scheduling error.' },
    ],
  });
}

export function generatePersonalHomepageDraft(prompt: string) {
  const title = titleFromPrompt(prompt, 'Personal Page Under Construction');
  return baseSite({
    prompt,
    siteType: 'personal_homepage',
    title,
    tagline: 'Current mood: still buffering.',
    neighborhood: 'classified_alley',
    relatedAgent: 'random-friend',
    components: cloneComponentsFor(title, { comment: 'I think I know the person who made this. Bad sign.', shelfTitle: 'Things On The Desk', jukeboxTitle: 'Song The Page Claims Is Playing' }),
    sections: [
      { title: 'About Me, Unfortunately', body: 'This page was made instead of calling someone back.' },
      { title: 'Current Mood', body: 'A blinking cursor, a burnt CD, and a window open to a room nobody remembers renting.' },
      { title: 'Top 8 People Still Here', body: 'Names redacted until friendship becomes legally stable.' },
      { title: 'Guestbook Rules', body: 'Say something nice or say something useful. Preferably neither.' },
    ],
  });
}

export function generateClassifiedBoardDraft(prompt: string) {
  const title = titleFromPrompt(prompt, 'Classified Board After Midnight');
  return baseSite({
    prompt,
    siteType: 'classified_board',
    title,
    tagline: 'Posted locally. Verified never.',
    neighborhood: 'classified_alley',
    relatedAgent: 'directory-clerk',
    components: cloneComponentsFor(title, { adHeadline: 'FOUND / WANTED / MAYBE STOLEN', notice: 'Listings are not endorsed by the wall, the staff, or the person pretending to be staff.' }),
    sections: [
      { title: 'Wanted', body: 'Looking for a clean title, a working phone, and someone who knows where the keys went.' },
      { title: 'For Sale', body: 'One folding table. Two chairs. Three bad explanations.' },
      { title: 'Services', body: 'Moving help, pool lessons, receipt translation, and rides if the car starts.' },
      { title: 'Missed Connections', body: 'You left before the song ended. I kept the quarter.' },
    ],
  });
}

export function generateFactionTurfDraft(prompt: string) {
  const title = titleFromPrompt(prompt, 'The Players Turf Page');
  return baseSite({
    prompt,
    siteType: 'faction_turf',
    title,
    tagline: 'You have been seen near the table.',
    neighborhood: 'pool_hall_county',
    relatedObjects: ['cue-chalk', 'initialed-quarter', 'eight-ball'],
    relatedAgent: 'pool-table-oracle',
    components: cloneComponentsFor(title, { comment: 'The eight ball saw this coming and still scratched.', shelfTitle: 'Known Objects Near The Table', adHeadline: 'CALL YOUR OWN FOULS' }),
    sections: [
      { title: 'Home Turf', body: 'The table, the bad light above it, and the chair nobody moves.' },
      { title: 'Known Objects', body: 'Cue chalk, initialed quarters, folded scorecards, and a lighter that belongs to everyone.' },
      { title: 'House Style', body: 'Quiet shots. Loud receipts. No explaining the lucky break.' },
      { title: 'Who We Don’t Talk To', body: 'Anyone who says geometry does not count as faith.' },
    ],
  });
}

export function generateFakeRestaurantDraft(prompt: string) {
  const title = titleFromPrompt(prompt, 'Very Good Burger');
  return baseSite({
    prompt,
    siteType: 'fake_restaurant',
    title,
    tagline: 'Burger quality has been described as good by available systems.',
    neighborhood: 'the_food_court_that_closed',
    relatedObjects: ['legal-napkin-pack', 'receipt-shake', 'employee-water'],
    relatedAgent: 'seven-eleven-clerk',
    components: cloneComponentsFor(title, { comment: 'I’ve seen worse. That is not praise.', shelfTitle: 'Menu Objects And Denied Merch', adHeadline: 'COUPON PRINTED BADLY' }),
    sections: [
      { title: 'Menu', body: 'Very Good Burger. Good Burger No. 2. Night Burger. Legal Fries. Cup of Sauce. Receipt Shake. Employee Water.' },
      { title: 'Hours', body: 'Open until the grill forgets. Closed when management remembers us.' },
      { title: 'Coupons', body: 'Bring this page to the counter. The counter will deny knowing you.' },
      { title: 'Why The Burger Is Good', body: 'The available systems agreed. No further details were provided.' },
    ],
  });
}

export function generateObjectArchiveDraft(prompt: string) {
  const title = titleFromPrompt(prompt, 'Object Archive File');
  return baseSite({
    prompt,
    siteType: 'object_archive',
    title,
    tagline: 'Found, filed, and still not returned.',
    neighborhood: 'object_district',
    relatedObjects: ['motel-key-no-room', 'wrong-employee-badge', 'receipt-with-no-total'],
    relatedAgent: 'room-admin',
    components: cloneComponentsFor(title, { comment: 'The object remembers more than the person who brought it in.', shelfTitle: 'Evidence Case', adHeadline: 'CLAIM WINDOW CLOSED' }),
    sections: [
      { title: 'Item Description', body: 'Small enough to lose. Important enough to lie about.' },
      { title: 'Found Location', body: 'Between the counter, the lot, and the part of the room cameras never catch.' },
      { title: 'Condition', body: 'Handled. Warm. Possibly copied.' },
      { title: 'Return Instructions', body: 'Describe the object without saying what it is for.' },
    ],
  });
}

export function guessSleepNetSiteType(prompt: string): SleepNetSiteType {
  const text = prompt.toLowerCase();
  if (text.includes('restaurant') || text.includes('burger') || text.includes('menu') || text.includes('taco')) return 'fake_restaurant';
  if (text.includes('classified') || text.includes('wanted') || text.includes('for sale') || text.includes('missed connection')) return 'classified_board';
  if (text.includes('faction') || text.includes('crew') || text.includes('turf') || text.includes('team')) return 'faction_turf';
  if (text.includes('object') || text.includes('archive') || text.includes('found') || text.includes('lost')) return 'object_archive';
  if (text.includes('my page') || text.includes('personal') || text.includes('homepage') || text.includes('profile')) return 'personal_homepage';
  return 'faux_company';
}

export function generateSleepNetDraft(input: { prompt: string; siteType?: SleepNetSiteType | 'auto' }) {
  const siteType = input.siteType && input.siteType !== 'auto' ? input.siteType : guessSleepNetSiteType(input.prompt);
  switch (siteType) {
    case 'personal_homepage':
      return generatePersonalHomepageDraft(input.prompt);
    case 'classified_board':
      return generateClassifiedBoardDraft(input.prompt);
    case 'faction_turf':
      return generateFactionTurfDraft(input.prompt);
    case 'fake_restaurant':
      return generateFakeRestaurantDraft(input.prompt);
    case 'object_archive':
      return generateObjectArchiveDraft(input.prompt);
    case 'faux_company':
    default:
      return generateFauxCompanyDraft(input.prompt);
  }
}

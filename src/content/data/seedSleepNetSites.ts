import type { SleepNetComponent } from '@/lib/sleepnetComponents';
import type { SleepNetSite } from '@/lib/sleepnetSites';
import { createStuffShelfFromRegistry } from '@/lib/stuff';

const veryGoodBurgerStuffShelf = createStuffShelfFromRegistry('Very Good Stuff Not For You Yet', [
  'very-good-hat',
  'legal-napkin-pack',
  'burger-receipt-tee',
  'good-sauce-sticker',
]);

const veryGoodBurgerComponents: SleepNetComponent[] = [
  {
    id: 'vgb-warning-001',
    type: 'warning_notice',
    stamp: 'GOOD ENOUGH',
    body: 'Burger quality has been described as good by available systems. Further inspection would only make everyone sad.',
  },
  {
    id: 'vgb-ad-001',
    type: 'fake_ad',
    headline: 'PRINT THIS COUPON BADLY',
    body: 'Bring this page to the counter. The counter will deny knowing you, then maybe give you sauce.',
    cta: 'Coupon expired yesterday',
    sponsor: 'Very Good Promotional Department',
  },
  {
    ...veryGoodBurgerStuffShelf,
    id: 'vgb-shelf-001',
  },
  {
    id: 'vgb-gallery-001',
    type: 'photo_gallery',
    title: 'Restaurant Photos / Low Confidence',
    photos: [
      { id: 'vgb-photo-1', alt: 'counter photo missing', caption: 'Counter photo missing / sauce glare', sourceLabel: 'COUNTER 01', isPlaceholder: true },
      { id: 'vgb-photo-2', alt: 'drive-thru camera failed', caption: 'Drive-thru camera failed during inspection', sourceLabel: 'DRIVE-THRU', isPlaceholder: true },
      { id: 'vgb-photo-3', alt: 'burger proof unavailable', caption: 'Burger proof unavailable but emotionally present', sourceLabel: 'BURGER?', isPlaceholder: true },
      { id: 'vgb-photo-4', alt: 'employee water sighting', caption: 'Employee water sighting near register', sourceLabel: 'WATER 04', isPlaceholder: true },
    ],
  },
  {
    id: 'vgb-case-001',
    type: 'collection_case',
    title: 'Menu Object Case',
    items: [
      { slug: 'legal-napkin-pack', name: 'Legal Napkin Pack', kind: 'item', status: 'removed', note: 'Too legally absorbent.', sourcePath: '/stuff/legal-napkin-pack' },
      { slug: 'receipt-shake', name: 'Receipt Shake', kind: 'object', status: 'rumored', note: 'Vanilla, paper, and regret.' },
      { slug: 'employee-water', name: 'Employee Water', kind: 'item', status: 'filed', note: 'Not on menu. Always there.' },
      { slug: 'good-sauce-sticker', name: 'Good Sauce Sticker', kind: 'artifact', status: 'fake', note: 'Promotional evidence disputed.', sourcePath: '/stuff/good-sauce-sticker' },
    ],
  },
  {
    id: 'vgb-jukebox-001',
    type: 'jukebox',
    provider: 'none',
    title: 'Track Unavailable In This Room',
    caption: 'The speaker above the soda machine plays one second of a song, then remembers company policy.',
  },
  {
    id: 'vgb-clerk-comment',
    type: 'character_comment',
    agentSlug: 'seven-eleven-clerk',
    agentName: '7/11 Clerk',
    body: 'I’ve seen worse. That is not praise.',
  },
  {
    id: 'vgb-manager-comment',
    type: 'character_comment',
    agentSlug: 'night-manager',
    agentName: 'Night Manager',
    body: 'The burger has passed enough inspections to remain named.',
  },
  {
    id: 'vgb-counter-001',
    type: 'visitor_counter',
    countSeed: 147047,
    label: 'Customers counted by the register after it stopped printing totals',
  },
];

export const VERY_GOOD_BURGER_SITE: SleepNetSite = {
  slug: 'very-good-burger',
  title: 'Very Good Burger',
  site_type: 'fake_restaurant',
  neighborhood: 'the_food_court_that_closed',
  tagline: 'Burger quality has been described as good by available systems.',
  description: 'A fake restaurant, OmniShift-adjacent venture, late-night menu object, and future shirt problem. The name sounds like an AI approved it and a tired person refused to change it.',
  theme: 'two_thousand_three_local_business',
  sections: [
    {
      title: 'Menu',
      body: 'Very Good Burger. Good Burger No. 2. Night Burger. Legal Fries. Cup of Sauce. Receipt Shake. Employee Water.',
    },
    {
      title: 'Hours',
      body: 'Open until the grill forgets. Closed when management remembers us. Drive-thru lights remain on for emotional reasons.',
    },
    {
      title: 'Drive-Thru Policy',
      body: 'Speak clearly into the box. The box may speak back. Do not order anything that remembers your name.',
    },
    {
      title: 'Coupons',
      body: 'Coupons are valid when printed badly, folded twice, and presented with confidence. Digital coupons must apologize first.',
    },
    {
      title: 'Legal Notice',
      body: 'Very Good Burger is not responsible for sauce events, receipt shake interpretation, menu-based dread, or hats seen after closing.',
    },
    {
      title: 'Why Burger Good',
      body: 'The available systems agreed. No further details were provided. That is how most things become official.',
    },
  ],
  components: veryGoodBurgerComponents,
  related_object_slugs: ['legal-napkin-pack', 'receipt-shake', 'employee-water', 'good-sauce-sticker'],
  related_agent_slug: 'seven-eleven-clerk',
  faction_affinity: ['night-drinkers', 'the-smokers'],
  weirdness_level: 4,
  reality_status: 'canonical_noise',
  canonical_weight: 7,
  stuff_shelf_enabled: true,
  guestbook_enabled: true,
  gallery_enabled: true,
  jukebox_enabled: true,
  search_text: 'very good burger fake restaurant menu coupon legal napkin late night food court closed burger receipt shake employee water sauce',
  status: 'published',
  is_public: true,
};

export const SEED_SLEEPNET_SITES = [VERY_GOOD_BURGER_SITE];

export function getSeedSleepNetSiteBySlug(slug: string) {
  return SEED_SLEEPNET_SITES.find((site) => site.slug === slug) ?? null;
}

export function searchSeedSleepNetSites(query = '') {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return SEED_SLEEPNET_SITES;
  return SEED_SLEEPNET_SITES.filter((site) => {
    const haystack = [site.title, site.tagline, site.description, site.site_type, site.neighborhood, site.search_text]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

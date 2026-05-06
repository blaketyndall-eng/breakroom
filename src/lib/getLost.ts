/**
 * Get Lost — random destination picker for Pocket Mode.
 * Inspired by: gashapon machines (micro-delay before reveal), slot machines,
 * "I'm Feeling Lucky," Desert Golfing's forward-only momentum.
 *
 * Design: one click, one destination, no undo. You ended up here. Nobody asked.
 * The pool rotates daily so repeat visitors get variety.
 */

export type LostCategory = 'page' | 'stuff' | 'dead_link' | 'district' | 'event' | 'door_teaser' | 'ad' | 'phone' | 'radio';

export type LostDestination = {
  href: string;
  label: string;
  category: LostCategory;
  flavor: string;
};

const LOST_HISTORY_KEY = 'breakroom.get-lost-history.v1';
const MAX_HISTORY = 20;

// --- Destination Pool ---
// Static seed pool. In production, this could pull from registries dynamically.

const DESTINATION_POOL: LostDestination[] = [
  // Pages
  { href: '/sleepnet/very-good-burger', label: 'Very Good Burger', category: 'page', flavor: 'You ended up here. Nobody asked.' },
  { href: '/sleepnet/idle-hands-pool-hall', label: 'Idle Hands Pool Hall', category: 'page', flavor: 'The table was open. It usually is.' },
  { href: '/sleepnet/omnishift-careers', label: 'OmniShift Careers', category: 'page', flavor: 'Do not apply. You already work here.' },
  { href: '/sleepnet/lot-weather-station', label: 'Lot Weather Station', category: 'page', flavor: 'Someone left the equipment running.' },
  { href: '/sleepnet/room-8-motel', label: 'Room 8 Motel', category: 'page', flavor: 'Vacancy sign is always on. Make of that what you will.' },

  // Stuff
  { href: '/stuff/receipt-with-no-total', label: 'Receipt With No Total', category: 'stuff', flavor: 'Found near register. Could be yours.' },
  { href: '/stuff/very-good-hat', label: 'Very Good Hat', category: 'stuff', flavor: 'Hat found. Owner unclear. Fits most heads.' },
  { href: '/stuff/quarter-from-1987', label: 'Quarter From 1987', category: 'stuff', flavor: 'Worth exactly one play. Maybe.' },
  { href: '/stuff/matchbook-with-number', label: 'Matchbook With a Number', category: 'stuff', flavor: 'The number doesn\'t answer. It rings though.' },
  { href: '/stuff/parking-ticket-fiction', label: 'Parking Ticket (Fiction)', category: 'stuff', flavor: 'Violation unclear. Fine amount: TBD.' },

  // Districts
  { href: '/districts/parking-lot-west', label: 'Parking Lot West', category: 'district', flavor: 'The lot doesn\'t have visiting hours. It has hours.' },
  { href: '/districts/corporate-ruins', label: 'Corporate Ruins', category: 'district', flavor: 'Nobody works here. Everyone reports to it.' },
  { href: '/districts/motel-row', label: 'Motel Row', category: 'district', flavor: 'Checkout was yesterday. You\'re still here.' },
  { href: '/districts/classified-alley', label: 'Classified Alley', category: 'district', flavor: 'Everything is for sale. Nothing has a price.' },
  { href: '/districts/pool-hall-county', label: 'Pool Hall County', category: 'district', flavor: 'Population: depends who\'s playing.' },

  // Dead links / mystery
  { href: '/dead-link-cemetery', label: 'Dead Link Cemetery', category: 'dead_link', flavor: 'Pages that were here once. The server remembers.' },
  { href: '/404', label: 'Page Not Found', category: 'dead_link', flavor: 'The URL was valid once. Probably.' },

  // Events / archives
  { href: '/events', label: 'Event Archive', category: 'event', flavor: 'Something happened here. Attendance unverified.' },

  // Radio / phone
  { href: '/radio', label: 'Radio 1:47', category: 'radio', flavor: 'The station is always on. Listeners: unclear.' },
  { href: '/phone', label: 'Phone Behind The Bar', category: 'phone', flavor: 'It rang. Nobody answered. It rang again.' },

  // Ads / commerce edge
  { href: '/ventures', label: 'OmniShift Ventures', category: 'ad', flavor: 'Acquisitions continue. Reasons remain internal.' },
  { href: '/after-hours', label: 'After Hours', category: 'page', flavor: 'The bar is open. It\'s always open. That\'s the problem.' },
  { href: '/sign-the-wall', label: 'Sign The Wall', category: 'page', flavor: 'Leave your mark. Or don\'t. The wall doesn\'t care.' },
  { href: '/artifacts', label: 'Evidence Drawer', category: 'page', flavor: 'Filed. Categorized. Understood: no.' },
];

// --- Seeded random ---

function seededRandom(seed: number): number {
  // Simple LCG for deterministic-ish results
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// --- History ---

function getHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOST_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addToHistory(href: string): void {
  if (typeof window === 'undefined') return;
  const history = getHistory();
  history.unshift(href);
  localStorage.setItem(LOST_HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

// --- Main export ---

/**
 * Pick a random destination. Avoids recent history when possible.
 * Uses time-based seed so the same second gives the same result (prevents spam-clicking).
 */
export function getLostDestination(): LostDestination {
  const now = Date.now();
  const seed = Math.floor(now / 1000); // Changes every second
  const history = getHistory();

  // Filter out recently visited (last 5)
  const recentHrefs = new Set(history.slice(0, 5));
  let pool = DESTINATION_POOL.filter(d => !recentHrefs.has(d.href));

  // If pool is too small (user has visited everything), reset
  if (pool.length < 3) {
    pool = DESTINATION_POOL;
  }

  const index = Math.floor(seededRandom(seed) * pool.length);
  const destination = pool[index];

  addToHistory(destination.href);
  return destination;
}

/**
 * Get recent destinations (for "where you've been" display).
 */
export function getLostHistory(): string[] {
  return getHistory();
}

/**
 * Clear history.
 */
export function clearLostHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LOST_HISTORY_KEY);
}

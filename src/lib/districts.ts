/* Districts — PR 55 */

export type DistrictStatus = 'open' | 'restricted' | 'staff_only' | 'rumored';

export type District = {
  slug: string;
  name: string;
  status: DistrictStatus;
  tagline: string;
  description: string;
  atmosphere: string;
  factionPresence: string[]; // faction slugs that claim turf here
  agentPresence: string[];  // agent slugs seen around
  stuffHints: string[];     // objects associated with this area
  weather?: string;         // lot weather condition
  dangerLevel: 0 | 1 | 2 | 3; // 0 = safe, 3 = staff only territory
  adjacentDistricts: string[];
  sleepnetNeighborhood: string; // maps to SLEEPNET_NEIGHBORHOODS key
  /** Public path to district hero JPG (PR-M FLUX Pro output). Optional —
   * districts without imagery degrade gracefully to text-only header. */
  image?: string;
};

export const SEEDED_DISTRICTS: District[] = [
  {
    slug: 'corporate-ruins',
    name: 'Corporate Ruins',
    status: 'open',
    tagline: 'The building closed. The memos kept printing.',
    description: 'Abandoned office parks, fake companies that never dissolved, parking structures where the lights still work on two floors. OmniShift has several known addresses here but denies permanent occupancy.',
    atmosphere: 'fluorescent buzz, paper smell, badge readers that click green for nobody',
    factionPresence: [],
    agentPresence: ['night-manager', 'unknown-employee'],
    stuffHints: ['wrong-employee-badge', 'receipt-with-no-total', 'unplugged-fax-cover-sheet'],
    weather: 'overcast interior',
    dangerLevel: 1,
    adjacentDistricts: ['the-wrong-department', 'parking-lot-west'],
    sleepnetNeighborhood: 'corporate_ruins',
  },
  {
    slug: 'parking-lot-west',
    name: 'Parking Lot West',
    status: 'open',
    tagline: 'Leave late. Arrive never.',
    description: 'The largest contiguous parking structure in the directory. Three levels confirmed. Four more rumored. The Lot Racers treat it like a weather system. The lights work on a timer nobody set.',
    atmosphere: 'engine idle, underglow, warm asphalt, timing slips on the ground',
    factionPresence: ['lot-racers'],
    agentPresence: ['7-11-clerk'],
    stuffHints: ['timing-slip', 'fuzzy-dice', 'parking-lot-rose', 'cracked-tail-light'],
    weather: 'clear, warm, low visibility after 1am',
    dangerLevel: 1,
    adjacentDistricts: ['corporate-ruins', 'motel-row', 'the-food-court-that-closed'],
    sleepnetNeighborhood: 'parking_lot_west',
    image: '/void/districtParkingLotWest.jpg',
  },
  {
    slug: 'motel-row',
    name: 'Motel Row',
    status: 'open',
    tagline: 'Vacancy. Always vacancy.',
    description: 'A strip of motels that never fully closed and never fully opened. Rooms rent by the vague timeframe. The ice machine works. The pool does not. Front desk operates on trust and a bell that rings twice.',
    atmosphere: 'neon hum, chlorine ghost, vending machine light, key on a wooden tag',
    factionPresence: ['night-drinkers'],
    agentPresence: ['phone-behind-the-bar'],
    stuffHints: ['motel-key-tag', 'ice-bucket-lid', 'do-not-disturb-sign'],
    weather: 'humid, pool-light blue at all hours',
    dangerLevel: 0,
    adjacentDistricts: ['parking-lot-west', 'classified-alley'],
    sleepnetNeighborhood: 'motel_row',
    image: '/void/districtMotelRow.jpg',
  },
  {
    slug: 'object-district',
    name: 'Object District',
    status: 'open',
    tagline: 'Everything here was lost on purpose.',
    description: 'A warehouse zone where Stuff accumulates. Pawn counters, lost-and-found windows, glass display cases full of things nobody claimed. The Object Clerks Union operates here by appointment only.',
    atmosphere: 'dust motes, price tags, glass cases, receipt printers running slow',
    factionPresence: [],
    agentPresence: ['pawn-counter-guy', 'directory-clerk'],
    stuffHints: ['dial-tone-slip', 'glass-case-key', 'claim-ticket-expired'],
    dangerLevel: 0,
    adjacentDistricts: ['classified-alley', 'pool-hall-county'],
    sleepnetNeighborhood: 'object_district',
  },
  {
    slug: 'pool-hall-county',
    name: 'Pool Hall County',
    status: 'open',
    tagline: 'Call your own fouls. Or don\'t.',
    description: 'Tables that have been level since before the directory started indexing. The Players claim permanent turf here. Disputes are settled with trick shots. The jukebox plays but does not accept requests.',
    atmosphere: 'chalk dust, felt green, low lamp, quarter clinks, someone racking',
    factionPresence: ['the-players'],
    agentPresence: ['pool-table-oracle'],
    stuffHints: ['cue-chalk', 'initialed-quarter', 'eight-ball', 'folded-scorecard'],
    weather: 'indoor always, smoke memory',
    dangerLevel: 0,
    adjacentDistricts: ['object-district', 'back-booth'],
    sleepnetNeighborhood: 'pool_hall_county',
    image: '/void/districtPoolHall.jpg',
  },
  {
    slug: 'classified-alley',
    name: 'Classified Alley',
    status: 'open',
    tagline: 'Post what you want. Nobody checks.',
    description: 'A narrow zone of bulletin boards, classified ads, flyers for events that may have happened, and phone numbers with too many digits. The Smokers gather near the back wall. Nothing is moderated.',
    atmosphere: 'stapled paper, marker ink, phone numbers circled, torn tabs',
    factionPresence: ['the-smokers'],
    agentPresence: ['random-friend'],
    stuffHints: ['torn-flyer-tab', 'marker-cap', 'circled-phone-number'],
    dangerLevel: 1,
    adjacentDistricts: ['motel-row', 'object-district', 'dead-link-cemetery'],
    sleepnetNeighborhood: 'classified_alley',
  },
  {
    slug: 'the-wrong-department',
    name: 'The Wrong Department',
    status: 'open',
    tagline: 'You were transferred here. Nobody knows from where.',
    description: 'A bureaucratic zone that exists inside OmniShift\'s internal directory but does not correspond to any known division. Forms filed here are acknowledged but never processed. The hold music plays in the hallway.',
    atmosphere: 'hold music, bad carpet, filing cabinets labeled wrong, clock at 1:47',
    factionPresence: [],
    agentPresence: ['unknown-employee', 'room-admin'],
    stuffHints: ['wrong-employee-badge', 'form-received-not-processed', 'hold-music-transcript'],
    dangerLevel: 2,
    adjacentDistricts: ['corporate-ruins', 'radio-tower-147'],
    sleepnetNeighborhood: 'the_wrong_department',
  },
  {
    slug: 'the-food-court-that-closed',
    name: 'The Food Court That Closed',
    status: 'open',
    tagline: 'The sign still says Open. The sign is wrong.',
    description: 'Former food court. The Very Good Burger counter still operates on unclear terms. All other stalls are shuttered but the trays are clean. Someone sweeps at night.',
    atmosphere: 'empty food court echo, one lit counter, clean trays stacked, menu board half-erased',
    factionPresence: ['cowboys'],
    agentPresence: ['very-good-burger-clerk'],
    stuffHints: ['very-good-burger-wrapper', 'empty-tray', 'meal-ticket-expired'],
    weather: 'climate controlled, fluorescent warm',
    dangerLevel: 0,
    adjacentDistricts: ['parking-lot-west', 'back-booth'],
    sleepnetNeighborhood: 'the_food_court_that_closed',
    image: '/void/districtClosedFoodCourt.jpg',
  },
  {
    slug: 'back-booth',
    name: 'Back Booth',
    status: 'restricted',
    tagline: 'Sit down. Don\'t order yet.',
    description: 'The booth in the back of a place nobody names. Night Drinkers know it. The Cowboys know it. Conversations happen here that don\'t get filed. The table is sticky. The lighting forgives.',
    atmosphere: 'low murmur, sticky table, one candle, napkin with writing on it',
    factionPresence: ['night-drinkers', 'cowboys'],
    agentPresence: ['phone-behind-the-bar'],
    stuffHints: ['napkin-with-writing', 'half-empty-glass', 'matchbook-unlabeled'],
    dangerLevel: 2,
    adjacentDistricts: ['pool-hall-county', 'the-food-court-that-closed'],
    sleepnetNeighborhood: 'pool_hall_county', // nested inside pool hall county
  },
  {
    slug: 'dead-link-cemetery',
    name: 'Dead Link Cemetery',
    status: 'open',
    tagline: '404 is not an error. It is a headstone.',
    description: 'Where pages go when they stop resolving. URLs that used to mean something. Sites that got delisted. The directory keeps records but does not keep them alive. Some links still blink.',
    atmosphere: 'blue underline ghosts, broken image icons, counter stuck at 0, server timeout',
    factionPresence: [],
    agentPresence: ['directory-clerk'],
    stuffHints: ['broken-link-fragment', 'cached-page-printout', 'domain-expired-notice'],
    dangerLevel: 1,
    adjacentDistricts: ['classified-alley', 'radio-tower-147'],
    sleepnetNeighborhood: 'classified_alley', // edge of the directory
  },
  {
    slug: 'radio-tower-147',
    name: 'Radio Tower 1:47',
    status: 'restricted',
    tagline: 'The signal comes from here. Probably.',
    description: 'A broadcast tower that nobody built and nobody maintains. Radio 1:47 transmits from somewhere near this location. The clock at the base has been stuck since before the directory started indexing. Staff denies the tower.',
    atmosphere: 'static crackle, antenna hum, red blink, gravel path, locked gate',
    factionPresence: [],
    agentPresence: ['weather-voice'],
    stuffHints: ['antenna-fragment', 'broadcast-log-page', 'static-recording'],
    weather: 'interference patterns',
    dangerLevel: 3,
    adjacentDistricts: ['the-wrong-department', 'dead-link-cemetery'],
    sleepnetNeighborhood: 'the_wrong_department', // adjacent, no direct mapping
  },
  {
    slug: 'the-rack',
    name: 'The Rack',
    status: 'staff_only',
    tagline: 'Real money begins here.',
    description: 'The official goods shell. Where fake products become real products. Where the bit gets turned down. This section uses actual commerce infrastructure. Management controls access.',
    atmosphere: 'clean shelves, price tags with decimals, receipt paper, register hum',
    factionPresence: [],
    agentPresence: ['night-manager'],
    stuffHints: ['official-product-tag', 'receipt-real', 'register-key'],
    dangerLevel: 3,
    adjacentDistricts: ['object-district'],
    sleepnetNeighborhood: 'object_district',
  },
];

// --- Accessors ---

export function getAllDistricts(): District[] {
  return SEEDED_DISTRICTS;
}

export function getOpenDistricts(): District[] {
  return SEEDED_DISTRICTS.filter((d) => d.status === 'open' || d.status === 'restricted');
}

export function getDistrictBySlug(slug: string): District | undefined {
  return SEEDED_DISTRICTS.find((d) => d.slug === slug);
}

export function getDistrictsByFaction(factionSlug: string): District[] {
  return SEEDED_DISTRICTS.filter((d) => d.factionPresence.includes(factionSlug));
}

export function getAdjacentDistricts(slug: string): District[] {
  const district = getDistrictBySlug(slug);
  if (!district) return [];
  return district.adjacentDistricts
    .map((adj) => getDistrictBySlug(adj))
    .filter((d): d is District => d !== undefined);
}

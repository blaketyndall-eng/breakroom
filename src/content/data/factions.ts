import type { SleepNetSiteType } from '@/lib/sleepnetGenerators';

export type BreakroomFactionStatus = 'active' | 'rumored' | 'staff_only';

export type BreakroomFaction = {
  slug: string;
  name: string;
  shortName?: string;
  /** Retro-social display name — how the crew tags itself online (1999-2003
   * GeoCities / MySpace / forum-tag energy). Falls through to `name` if
   * absent. Set on the 5 actives only for now. */
  webHandle?: string;
  status: BreakroomFactionStatus;
  motto: string;
  description: string;
  turf: string;
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  symbols: string[];
  objects: string[];
  preferredSiteTypes: SleepNetSiteType[];
  rivals: string[];
  allies?: string[];
  agents: string[];
  productStyle: string;
  joinLanguage: string;
  noticedLanguage: string;
  warning?: string;
  /** Public path to the faction mascot JPG (PR-M Kontext output). Optional —
   * rumored factions have no mascot yet and degrade gracefully in the UI. */
  image?: string;
};

export const BREAKROOM_FACTIONS: BreakroomFaction[] = [
  {
    slug: 'the-players',
    name: 'The Players',
    webHandle: '★ TH3.PLAYERS ★',
    status: 'active',
    motto: 'Call your own fouls.',
    description: 'Pool table regulars, card trick people, chalk carriers, quarter initialers, and anyone who thinks aim is a form of prayer.',
    turf: 'pool_hall_county',
    colors: { primary: '#1f4a32', secondary: '#d8c9a6', accent: '#0000ee' },
    symbols: ['cue ball', 'chalk', 'quarter', 'playing card', 'pool stick'],
    objects: ['cue-chalk', 'initialed-quarter', 'eight-ball', 'folded-scorecard'],
    preferredSiteTypes: ['faction_turf', 'classified_board', 'object_archive'],
    rivals: ['lot-racers', 'house-money'],
    allies: ['night-drinkers'],
    agents: ['pool-table-oracle', 'night-manager'],
    productStyle: 'league tees, caps, towels, chalk-pocket button-ups',
    joinLanguage: 'You have been seen near the table.',
    noticedLanguage: 'The Players noticed where you stood.',
    warning: 'Do not explain a lucky break unless asked twice.',
    image: '/void/factionPlayers.jpg',
  },
  {
    slug: 'lot-racers',
    name: 'Lot Racers',
    webHandle: 'LotRacers_99',
    status: 'active',
    motto: 'Leave late. Leave loud.',
    description: 'People who treat the parking lot like a weather system: low cars, bad underglow, timing slips, dashboard light, and keys with stories.',
    turf: 'parking_lot_west',
    colors: { primary: '#101820', secondary: '#c43d2b', accent: '#78c7ff' },
    symbols: ['timing slip', 'fuzzy dice', 'dashboard light', 'tire mark', 'gas station rose'],
    objects: ['timing-slip', 'fuzzy-dice', 'cracked-tail-light', 'parking-lot-rose'],
    preferredSiteTypes: ['faction_turf', 'fake_restaurant', 'classified_board'],
    rivals: ['the-players', 'cowboys'],
    allies: ['the-smokers'],
    agents: ['lot-attendant', 'weather-voice'],
    productStyle: 'shop jackets, gas station caps, mechanic shirts, low-light decals',
    joinLanguage: 'Your file picked up exhaust.',
    noticedLanguage: 'Lot Racers heard your car before they saw your face.',
    warning: 'No one knows who owns the orange cones.',
    image: '/void/factionLotRacers.jpg',
  },
  {
    slug: 'night-drinkers',
    name: 'Night Drinkers',
    webHandle: '~Night.Drinkers.Lounge~',
    status: 'active',
    motto: 'One more and then the truth.',
    description: 'Stool regulars, bar-napkin philosophers, jukebox witnesses, people who pay with folded cash and remember everybody wrong.',
    turf: 'the_wrong_department',
    colors: { primary: '#3b1f2b', secondary: '#f0d09a', accent: '#b00020' },
    symbols: ['bar napkin', 'shot glass', 'jukebox light', 'matchbook', 'clock stuck at 1:47'],
    objects: ['bar-napkin-map', 'matchbook', 'stool-token', 'jukebox-quarter'],
    preferredSiteTypes: ['personal_homepage', 'classified_board', 'fake_restaurant'],
    rivals: ['the-smokers', 'soft-hands'],
    allies: ['the-players'],
    agents: ['night-manager', 'phone-behind-the-bar'],
    productStyle: 'washed tees, matchbooks, staff caps, bar towel graphics',
    joinLanguage: 'You have been counted among the stools.',
    noticedLanguage: 'Night Drinkers remembered you incorrectly.',
    warning: 'The last story improves every time it is retold.',
    image: '/void/factionNightDrinkers.jpg',
  },
  {
    slug: 'the-smokers',
    name: 'The Smokers',
    webHandle: '[ smokers·lounge ]',
    status: 'active',
    motto: 'Fence talk travels.',
    description: 'Fence leaners, alley diplomats, people under weak bulbs, cigarette-pack archivists, and anyone who knows which door sticks.',
    turf: 'classified_alley',
    colors: { primary: '#4b4a43', secondary: '#d8c9a6', accent: '#76a17a' },
    symbols: ['cigarette pack', 'chain-link fence', 'lighter', 'ashtray', 'green bulb'],
    objects: ['old-lighter', 'half-pack', 'ashtray-coin', 'fence-note'],
    preferredSiteTypes: ['classified_board', 'object_archive', 'personal_homepage'],
    rivals: ['night-drinkers', 'red-ropes'],
    allies: ['lot-racers'],
    agents: ['seven-eleven-clerk', 'random-friend'],
    productStyle: 'pocket tees, zip hoodies, lighter sleeves, classified stickers',
    joinLanguage: 'Fence talk has your name in it.',
    noticedLanguage: 'The Smokers saw you stand outside too long.',
    warning: 'Never ask who started the rumor while holding the lighter.',
    image: '/void/factionSmokers.jpg',
  },
  {
    slug: 'cowboys',
    name: 'Cowboys',
    webHandle: 'COWBOYZ_ONLINE.GIF',
    status: 'active',
    motto: 'Cooler opened. Hat noticed.',
    description: 'Rodeo parking lot saints, boot scuff people, cooler guardians, county-fair ghosts, and anyone who knows dust can be formal.',
    turf: 'motel_row',
    colors: { primary: '#5b351c', secondary: '#f1d6a4', accent: '#224d67' },
    symbols: ['hat', 'cooler', 'belt buckle', 'white feather', 'rodeo ticket'],
    objects: ['cooler-key', 'white-feather', 'buckle-receipt', 'rodeo-ticket-stub'],
    preferredSiteTypes: ['faction_turf', 'object_archive', 'fake_restaurant'],
    rivals: ['lot-racers', 'golfers'],
    allies: ['house-money'],
    agents: ['room-admin', 'weather-voice'],
    productStyle: 'work shirts, rope hats, heavy tees, motel-lot belt graphics',
    joinLanguage: 'Cooler opened. Hat noticed.',
    noticedLanguage: 'Cowboys saw the dust on your shoes.',
    warning: 'Do not touch the cooler unless invited by someone older than the song.',
    image: '/void/factionCowboys.jpg',
  },
  {
    slug: 'arcade-kids',
    name: 'Arcade Kids',
    status: 'rumored',
    motto: 'Continue? probably not.',
    description: 'Rumored cabinet ghosts, mall change people, prize counter descendants, and the ones who know which buttons still work.',
    turf: 'object_district',
    colors: { primary: '#111133', secondary: '#f6f3ec', accent: '#33ff66' },
    symbols: ['token', 'cabinet', 'pixel flame'],
    objects: ['token', 'prize-ticket'],
    preferredSiteTypes: ['personal_homepage', 'object_archive'],
    rivals: [],
    agents: ['directory-clerk'],
    productStyle: 'pixel tees and token cards',
    joinLanguage: 'Insert token later.',
    noticedLanguage: 'A cabinet flickered when you passed.',
  },
  {
    slug: 'hippies',
    name: 'Hippies',
    status: 'rumored',
    motto: 'The van was here first.',
    description: 'Rumored blanket people, lot philosophers, and stickered van archivists.',
    turf: 'parking_lot_west',
    colors: { primary: '#6f7d45', secondary: '#f1d6a4', accent: '#e0a03b' },
    symbols: ['van', 'sun sticker', 'blanket'],
    objects: ['van-sticker', 'blanket-note'],
    preferredSiteTypes: ['personal_homepage', 'classified_board'],
    rivals: [],
    agents: ['weather-voice'],
    productStyle: 'sun-faded tees and blanket graphics',
    joinLanguage: 'You parked beside the van.',
    noticedLanguage: 'The van noticed you first.',
  },
  {
    slug: 'house-money',
    name: 'House Money',
    status: 'rumored',
    motto: 'The favorite never loved you.',
    description: 'Rumored betting window ghosts, clean shoes with bad debts, and people who count before speaking.',
    turf: 'corporate_ruins',
    colors: { primary: '#111111', secondary: '#d8c9a6', accent: '#1f5d3a' },
    symbols: ['ticket', 'favorite horse', 'cash band'],
    objects: ['bet-slip', 'cash-band'],
    preferredSiteTypes: ['faux_company', 'classified_board'],
    rivals: ['the-players'],
    agents: ['night-manager'],
    productStyle: 'odds slips, caps, and finance desk tees',
    joinLanguage: 'The house let you think once.',
    noticedLanguage: 'House Money counted your pocket.',
  },
  {
    slug: 'soft-hands',
    name: 'Soft Hands',
    status: 'rumored',
    motto: 'No calluses. Many opinions.',
    description: 'Rumored consultants, clean-shirt drifters, menu explainers, and people who ask if the dive has a wine list.',
    turf: 'corporate_ruins',
    colors: { primary: '#ede6d6', secondary: '#1c1c1c', accent: '#b00020' },
    symbols: ['loose tie', 'receipt folder', 'wine glass'],
    objects: ['loose-tie', 'receipt-folder'],
    preferredSiteTypes: ['faux_company', 'personal_homepage'],
    rivals: ['night-drinkers'],
    agents: ['directory-clerk'],
    productStyle: 'office shirts with wrong stains',
    joinLanguage: 'You touched the door with two fingers.',
    noticedLanguage: 'Soft Hands saw your clean cuffs.',
  },
  {
    slug: 'red-ropes',
    name: 'Red Ropes',
    status: 'rumored',
    motto: 'Line starts wherever we say.',
    description: 'Rumored doorway people, clipboard carriers, guest list authors, and velvet rope historians.',
    turf: 'the_wrong_department',
    colors: { primary: '#7a0019', secondary: '#f6f3ec', accent: '#101820' },
    symbols: ['rope', 'clipboard', 'stamp'],
    objects: ['red-rope-piece', 'clipboard'],
    preferredSiteTypes: ['faction_turf', 'classified_board'],
    rivals: ['the-smokers'],
    agents: ['room-admin'],
    productStyle: 'door staff jackets and stamp tees',
    joinLanguage: 'Your name is almost on the list.',
    noticedLanguage: 'Red Ropes checked the clipboard twice.',
  },
  {
    slug: 'golfers',
    name: 'Golfers',
    status: 'rumored',
    motto: 'Quiet please. Bad shot coming.',
    description: 'Rumored polo ghosts, glove folders, and men who call every mistake a lie angle.',
    turf: 'the_food_court_that_closed',
    colors: { primary: '#234d20', secondary: '#f6f3ec', accent: '#e6c15a' },
    symbols: ['tee', 'glove', 'score pencil'],
    objects: ['golf-tee', 'score-pencil'],
    preferredSiteTypes: ['personal_homepage', 'faux_company'],
    rivals: ['cowboys'],
    agents: ['weather-voice'],
    productStyle: 'bad polos and scorecard caps',
    joinLanguage: 'You blamed the light.',
    noticedLanguage: 'Golfers saw the practice swing.',
  },
];

export const ACTIVE_FACTIONS = BREAKROOM_FACTIONS.filter((faction) => faction.status === 'active');
export const RUMORED_FACTIONS = BREAKROOM_FACTIONS.filter((faction) => faction.status !== 'active');

export function getFactionBySlug(slug: string) {
  return BREAKROOM_FACTIONS.find((faction) => faction.slug === slug) ?? null;
}

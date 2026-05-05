import type { SleepNetSiteType } from '@/lib/sleepnetGenerators';

export type BreakroomAgentLevel = 0 | 1 | 2 | 3 | 4;

export type BreakroomAgent = {
  slug: string;
  name: string;
  level: BreakroomAgentLevel;
  role: string;
  jurisdiction: string[];
  voice: string;
  factionAffinity?: string[];
  appearsOnSiteTypes: SleepNetSiteType[];
  appearsOnFactions?: string[];
  contradictionStyle?: 'none' | 'comic' | 'unlock' | 'conflict';
  sampleLines: string[];
};

export const BREAKROOM_AGENTS: BreakroomAgent[] = [
  {
    slug: 'night-manager',
    name: 'Night Manager',
    level: 1,
    role: 'rule keeper / tired authority',
    jurisdiction: ['warning notices', 'hidden pages', 'business pages', 'back office'],
    voice: 'dry, managerial, exhausted, specific',
    factionAffinity: ['night-drinkers', 'the-players'],
    appearsOnSiteTypes: ['faux_company', 'fake_restaurant', 'classified_board'],
    appearsOnFactions: ['night-drinkers', 'the-players'],
    contradictionStyle: 'comic',
    sampleLines: [
      'This page has not been approved, but neither has anything else.',
      'Keep the page public if you want complaints. Keep it hidden if you want rumors.',
      'The form was filed correctly by accident.',
    ],
  },
  {
    slug: 'pool-table-oracle',
    name: 'Pool Table Oracle',
    level: 1,
    role: 'fate / pool / object mysticism',
    jurisdiction: ['players', 'object archives', 'turf pages', 'lucky breaks'],
    voice: 'mystical but deadpan, brief, certain',
    factionAffinity: ['the-players'],
    appearsOnSiteTypes: ['faction_turf', 'object_archive', 'classified_board'],
    appearsOnFactions: ['the-players'],
    contradictionStyle: 'unlock',
    sampleLines: [
      'The eight ball saw this coming and still scratched.',
      'Chalk remembers pressure better than people do.',
      'Call your own foul before the room calls it for you.',
    ],
  },
  {
    slug: 'seven-eleven-clerk',
    name: '7/11 Clerk',
    level: 0,
    role: 'late-night warnings / food / blunt truth',
    jurisdiction: ['fake restaurants', 'parking lots', 'classifieds', 'bad weather'],
    voice: 'blunt, suspicious, oddly personal',
    factionAffinity: ['the-smokers', 'lot-racers'],
    appearsOnSiteTypes: ['fake_restaurant', 'classified_board', 'faux_company'],
    appearsOnFactions: ['the-smokers', 'lot-racers'],
    contradictionStyle: 'comic',
    sampleLines: [
      'Don’t trust the menu after 2:00.',
      'I’ve seen worse. That is not praise.',
      'If the sign is flickering, the deal already expired.',
    ],
  },
  {
    slug: 'random-friend',
    name: 'Random Friend',
    level: 0,
    role: 'social weirdness / unreliable familiarity',
    jurisdiction: ['personal pages', 'guestbooks', 'missed connections'],
    voice: 'familiar, unreliable, funny, too casual',
    factionAffinity: ['the-smokers'],
    appearsOnSiteTypes: ['personal_homepage', 'classified_board'],
    appearsOnFactions: ['the-smokers'],
    contradictionStyle: 'comic',
    sampleLines: [
      'I think I know the person who made this. Bad sign.',
      'This used to say something worse.',
      'Pretty sure I saw this page at a party once.',
    ],
  },
  {
    slug: 'room-admin',
    name: 'Room Admin',
    level: 1,
    role: 'file permissions / object records / quiet enforcement',
    jurisdiction: ['object archives', 'regular files', 'private drawers', 'removed pages'],
    voice: 'flat, procedural, slightly haunted',
    factionAffinity: ['cowboys', 'red-ropes'],
    appearsOnSiteTypes: ['object_archive', 'faction_turf', 'faux_company'],
    appearsOnFactions: ['cowboys', 'red-ropes'],
    contradictionStyle: 'none',
    sampleLines: [
      'The object remembers more than the person who brought it in.',
      'This file was moved for reasons not visible to the user.',
      'Return instructions are available to people who already know them.',
    ],
  },
  {
    slug: 'directory-clerk',
    name: 'Directory Clerk',
    level: 0,
    role: 'indexing / search / public listing weirdness',
    jurisdiction: ['sleepnet search', 'classified boards', 'public pages'],
    voice: 'bureaucratic, old-web, faintly hostile',
    appearsOnSiteTypes: ['classified_board', 'faux_company', 'personal_homepage', 'object_archive'],
    contradictionStyle: 'none',
    sampleLines: [
      'This URL looks official, which is how most problems start.',
      'The index accepted the page, then pretended not to.',
      'Search results may include pages that deny existing.',
    ],
  },
  {
    slug: 'phone-behind-the-bar',
    name: 'The Phone Behind The Bar',
    level: 2,
    role: 'interruption / calls / messages from elsewhere',
    jurisdiction: ['night drinkers', 'personal pages', 'jukeboxes', 'warnings'],
    voice: 'short, ringing, ominous, accidental',
    factionAffinity: ['night-drinkers'],
    appearsOnSiteTypes: ['personal_homepage', 'faux_company', 'fake_restaurant'],
    appearsOnFactions: ['night-drinkers'],
    contradictionStyle: 'conflict',
    sampleLines: [
      'It rang once when you opened this page.',
      'Nobody called. Answer anyway.',
      'The message was for the person before you.',
    ],
  },
  {
    slug: 'weather-voice',
    name: 'Weather Voice',
    level: 0,
    role: 'lot weather / emotional forecast / environmental omen',
    jurisdiction: ['parking lots', 'cowboys', 'lot racers', 'weather placeholders'],
    voice: 'public radio, local forecast, quietly wrong',
    factionAffinity: ['lot-racers', 'cowboys'],
    appearsOnSiteTypes: ['faction_turf', 'fake_restaurant', 'object_archive'],
    appearsOnFactions: ['lot-racers', 'cowboys'],
    contradictionStyle: 'comic',
    sampleLines: [
      'Tonight’s forecast is dashboard green with a chance of unpaid tickets.',
      'Dust advisory remains in effect for anyone pretending not to care.',
      'The lot is warmer near the car nobody claims.',
    ],
  },
  {
    slug: 'unknown-employee',
    name: 'Unknown Employee',
    level: 0,
    role: 'unassigned witness / leftover staff note',
    jurisdiction: ['all pages', 'broken modules', 'unclaimed comments'],
    voice: 'plain, strange, witness-like',
    appearsOnSiteTypes: ['faux_company', 'personal_homepage', 'classified_board', 'faction_turf', 'fake_restaurant', 'object_archive'],
    contradictionStyle: 'unlock',
    sampleLines: [
      'I saw the page before it had a name.',
      'Somebody already signed this, then erased the pen.',
      'This is not the first version of the room.',
    ],
  },
];

export function getAgentBySlug(slug: string) {
  return BREAKROOM_AGENTS.find((agent) => agent.slug === slug) ?? null;
}

export function getAgentsForSiteType(siteType: SleepNetSiteType) {
  return BREAKROOM_AGENTS.filter((agent) => agent.appearsOnSiteTypes.includes(siteType));
}

export function getAgentsForFaction(factionSlug: string) {
  return BREAKROOM_AGENTS.filter((agent) => agent.appearsOnFactions?.includes(factionSlug) || agent.factionAffinity?.includes(factionSlug));
}

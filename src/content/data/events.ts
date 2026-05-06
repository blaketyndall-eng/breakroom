/**
 * Breakroom Events Registry (PR 52)
 *
 * Seeded events — fake, maybe-real, archived, faction-linked.
 * Not a normal calendar. More like pool tournament flyers
 * and classified meetup postings found on bulletin boards.
 */

export type BreakroomEventType =
  | 'idle_hands'
  | 'very_good_burger'
  | 'turf_dispute'
  | 'live_music'
  | 'lot_race'
  | 'classified_meetup'
  | 'fake_past_event'
  | 'maybe_real_upcoming'
  | 'edition_event';

export type BreakroomEventStatus = 'past' | 'upcoming' | 'maybe' | 'cancelled' | 'archived';

export type BreakroomEvent = {
  slug: string;
  title: string;
  type: BreakroomEventType;
  status: BreakroomEventStatus;
  dateLabel: string;
  locationLabel: string;
  description: string;
  flyerPrompt?: string;
  relatedFactionSlugs?: string[];
  relatedStuffSlugs?: string[];
  relatedAdSlugs?: string[];
  relatedAgentSlugs?: string[];
  weatherTag?: string;
  signSheetEnabled: boolean;
  archiveCopy?: string;
  metadata?: Record<string, unknown>;
};

export const BREAKROOM_EVENTS: BreakroomEvent[] = [
  {
    slug: 'idle-hands-invitational',
    title: 'Idle Hands Invitational',
    type: 'idle_hands',
    status: 'maybe',
    dateLabel: 'Third Thursday. After the lights dim twice.',
    locationLabel: 'Pool Hall County — Table 4 (disputed)',
    description: 'Open tournament for regulars and quarter-carriers. Best of 7. Chalk provided. No coaching from the rail. The Oracle will be present but will not speak unless paid in specific change.',
    flyerPrompt: 'Pool tournament flyer, green felt background, cue chalk dust, bad photocopy texture, bold blocky text, "IDLE HANDS INVITATIONAL" in distorted caps.',
    relatedFactionSlugs: ['the-players'],
    relatedStuffSlugs: ['initialed-quarter', 'cue-chalk'],
    relatedAgentSlugs: ['pool-table-oracle', 'night-manager'],
    weatherTag: 'chalk_dust_visibility',
    signSheetEnabled: true,
  },
  {
    slug: 'very-good-burger-grand-opening-closing',
    title: 'Very Good Burger Grand Opening / Closing',
    type: 'very_good_burger',
    status: 'maybe',
    dateLabel: 'Opening soon. Also closing soon. Unclear which is first.',
    locationLabel: 'Closed Food Court — Stall C (maybe B)',
    description: 'The Very Good Burger location is opening or closing or both. The clerk insists both are happening simultaneously. A hat will be distributed. Legal napkins available at the counter. The menu has not been finalized because the menu does not exist yet.',
    flyerPrompt: 'Fast food grand opening flyer crossed with a health department notice. Yellow/red, bad clip art burger, "GRAND OPENING/CLOSING" stamp.',
    relatedStuffSlugs: ['very-good-hat', 'legal-napkin-pack'],
    relatedAgentSlugs: ['very-good-burger-clerk'],
    relatedAdSlugs: ['very-good-burger-ad'],
    signSheetEnabled: true,
  },
  {
    slug: 'lot-race-behind-food-court',
    title: 'Lot Race Behind The Closed Food Court',
    type: 'lot_race',
    status: 'past',
    dateLabel: 'Last month. Disputed.',
    locationLabel: 'Parking Lot West — past the orange cones nobody owns',
    description: 'Three cars. One timing slip survived. The Lot Racers deny organizing it but the exhaust marks disagree. Chrome visibility was described as "excellent." Nobody was arrested because nobody official saw anything.',
    relatedFactionSlugs: ['lot-racers'],
    relatedStuffSlugs: ['timing-slip', 'fuzzy-dice'],
    relatedAgentSlugs: ['lot-attendant'],
    weatherTag: 'lowrider_chrome_visibility',
    signSheetEnabled: false,
    archiveCopy: 'Three cars showed. One timing slip survived. The marks in the lot say more than the participants will. Chrome visibility: excellent. Official attendance: zero. The cones remained unclaimed.',
  },
  {
    slug: 'pool-dispute-mediation-night',
    title: 'Pool Dispute Mediation Night',
    type: 'turf_dispute',
    status: 'maybe',
    dateLabel: 'When the argument becomes official.',
    locationLabel: 'Pool Hall County — Back booth (neutral territory)',
    description: 'Scheduled mediation between The Players and House Money regarding Table 4 jurisdiction. The Night Manager will officiate. Chalk throwing is prohibited. The Oracle will not take sides but will charge for proximity.',
    relatedFactionSlugs: ['the-players'],
    relatedAgentSlugs: ['night-manager', 'pool-table-oracle'],
    relatedAdSlugs: ['pool-dispute-hotline'],
    signSheetEnabled: true,
  },
  {
    slug: 'classified-meetup-bad-light',
    title: 'Classified Meetup Under Bad Light',
    type: 'classified_meetup',
    status: 'maybe',
    dateLabel: 'When the bulb flickers three times.',
    locationLabel: 'Classified Alley — beneath the one working fluorescent',
    description: 'No agenda posted. No organizer listed. The listing appeared in the directory without explanation. Attendance is optional but the room will notice if you show up. Bring exact change for the machine that may not exist.',
    weatherTag: 'bad_fluorescent',
    signSheetEnabled: true,
  },
  {
    slug: 'radio-147-call-in-shift',
    title: 'Radio 1:47 Call-In Shift',
    type: 'edition_event',
    status: 'upcoming',
    dateLabel: 'Next broadcast window. Check /radio.',
    locationLabel: 'Radio Tower 1:47 — frequency unclear',
    description: 'Open call-in shift. Faction reps may phone in. Weather Voice will give the lot conditions. The static between segments is not accidental. Shoutouts available if the line holds.',
    relatedAgentSlugs: ['weather-voice'],
    signSheetEnabled: true,
  },
  {
    slug: 'smokers-deck-hours',
    title: 'Smokers Deck Hours',
    type: 'fake_past_event',
    status: 'archived',
    dateLabel: 'Every night that felt like it. Ended when the bench broke.',
    locationLabel: 'The wrong side of the building',
    description: 'Not a scheduled event. More of a recurring condition. The Smokers maintained deck hours until the bench situation made it impossible. The bench has not been replaced. Deck hours are technically suspended.',
    relatedFactionSlugs: ['the-smokers'],
    signSheetEnabled: false,
    archiveCopy: 'Deck hours were maintained nightly by The Smokers until the bench incident. No formal schedule existed. Attendance was measured by cigarette butts. The bench remains unreplaced. Hours: suspended indefinitely.',
  },
  {
    slug: 'cowboys-last-ride-maybe',
    title: 'Cowboys Last Ride (Maybe)',
    type: 'maybe_real_upcoming',
    status: 'maybe',
    dateLabel: 'When somebody finally says when.',
    locationLabel: 'Motel Row — Room 8 parking adjacent',
    description: 'The Cowboys have mentioned a "last ride" three times without scheduling it. It may involve trucks. It may involve the motel lot. It definitely involves hats. Nobody has confirmed what "ride" means in this context.',
    relatedFactionSlugs: ['cowboys'],
    relatedStuffSlugs: ['hat-with-no-logo'],
    weatherTag: 'hat_weather',
    signSheetEnabled: true,
  },
];

export function getEventBySlug(slug: string): BreakroomEvent | undefined {
  return BREAKROOM_EVENTS.find((e) => e.slug === slug);
}

export function getEventsByStatus(status: BreakroomEventStatus): BreakroomEvent[] {
  return BREAKROOM_EVENTS.filter((e) => e.status === status);
}

export function getEventsByFaction(factionSlug: string): BreakroomEvent[] {
  return BREAKROOM_EVENTS.filter((e) => e.relatedFactionSlugs?.includes(factionSlug));
}

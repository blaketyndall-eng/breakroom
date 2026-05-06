/**
 * Radio 1:47 — Seeded Transmissions (PR 59)
 *
 * Static broadcast entries. Supplemented by user requests
 * and agent call-ins stored in localStorage.
 */

export type RadioEntryType =
  | 'transmission'
  | 'weather_report'
  | 'station_id'
  | 'fake_ad'
  | 'agent_call_in'
  | 'user_request'
  | 'dead_air'
  | 'faction_beef'
  | 'shoutout';

export type RadioEntry = {
  id: string;
  slug: string;
  type: RadioEntryType;
  title: string;
  body: string;
  host?: string;
  timestamp: number;
  district?: string;
  tags: string[];
  source: 'seeded' | 'user' | 'agent' | 'system';
};

// Timestamps relative to "now" for freshness illusion
const NOW = Date.now();
const HOUR = 3600000;
const DAY = 86400000;

export const SEEDED_RADIO_ENTRIES: RadioEntry[] = [
  {
    id: 'radio-seed-01',
    slug: 'lot-weather-humid',
    type: 'weather_report',
    title: 'Lot Weather: Humid, Flickering',
    body: 'Parking Lot West reporting humid conditions. Sodium lights at 40% flicker. Wind direction: toward the dumpster. Visibility: enough.',
    host: 'The Driver',
    timestamp: NOW - HOUR * 2,
    district: 'parking-lot-west',
    tags: ['weather', 'lot'],
    source: 'seeded',
  },
  {
    id: 'radio-seed-02',
    slug: 'omnishift-compliance-reminder',
    type: 'transmission',
    title: 'OmniShift Compliance Hour',
    body: 'Reminder: all acquired properties must display the OmniShift watermark. Failure to comply results in indexing delay. This is not a threat. This is scheduling.',
    host: 'System Voice',
    timestamp: NOW - HOUR * 4,
    tags: ['omnishift', 'compliance'],
    source: 'seeded',
  },
  {
    id: 'radio-seed-03',
    slug: 'station-id-1',
    type: 'station_id',
    title: 'Station ID',
    body: 'You are listening to Radio 1:47. Broadcasting from somewhere behind the bar. The phone is not connected. The signal is cigarette-yellow.',
    timestamp: NOW - HOUR * 6,
    tags: ['station-id'],
    source: 'seeded',
  },
  {
    id: 'radio-seed-04',
    slug: 'fake-ad-very-good-burger',
    type: 'fake_ad',
    title: 'SPONSORED: Very Good Burger',
    body: 'Very Good Burger. The burger is very good. The location has not been confirmed. The drive-thru operates on honor. Exact change preferred.',
    timestamp: NOW - HOUR * 8,
    tags: ['fake-ad', 'very-good-burger'],
    source: 'seeded',
  },
  {
    id: 'radio-seed-05',
    slug: 'pool-table-oracle-call',
    type: 'agent_call_in',
    title: 'Call-In: Pool Table Oracle',
    body: 'The table says the 8-ball knows where the key went. The table does not elaborate. The table has been saying this for weeks.',
    host: 'Pool Table Oracle',
    timestamp: NOW - HOUR * 12,
    district: 'pool-hall-county',
    tags: ['agent', 'pool-table-oracle'],
    source: 'seeded',
  },
  {
    id: 'radio-seed-06',
    slug: 'faction-beef-smokers-cowboys',
    type: 'faction_beef',
    title: 'Faction Report: Smokers vs Cowboys',
    body: 'The Smokers say the Cowboys took the good booth. The Cowboys say the booth was empty. The booth says nothing. It is a booth.',
    timestamp: NOW - DAY,
    tags: ['faction-beef', 'smokers', 'cowboys'],
    source: 'seeded',
  },
  {
    id: 'radio-seed-07',
    slug: 'dead-air-3am',
    type: 'dead_air',
    title: '[Dead Air]',
    body: '...',
    timestamp: NOW - DAY - HOUR * 3,
    tags: ['dead-air'],
    source: 'seeded',
  },
  {
    id: 'radio-seed-08',
    slug: 'night-manager-shoutout',
    type: 'shoutout',
    title: 'Shoutout from Night Manager',
    body: 'Night Manager wants everyone to know the vending machine in the wrong department has been restocked. Nobody asked. The machine is thankful.',
    host: 'Night Manager',
    timestamp: NOW - DAY - HOUR * 5,
    district: 'the-wrong-department',
    tags: ['shoutout', 'night-manager'],
    source: 'seeded',
  },
  {
    id: 'radio-seed-09',
    slug: 'weather-motel-row',
    type: 'weather_report',
    title: 'Lot Weather: Motel Row — Warm, Neon Hum',
    body: 'Motel Row conditions: warm pavement, neon at 70% hum, vacancy sign stuck between YES and NO. The ice machine is working but judgmental.',
    host: 'The Driver',
    timestamp: NOW - DAY * 2,
    district: 'motel-row',
    tags: ['weather', 'motel-row'],
    source: 'seeded',
  },
  {
    id: 'radio-seed-10',
    slug: 'station-id-2',
    type: 'station_id',
    title: 'Station ID (Late)',
    body: 'Radio 1:47. The clock is stuck. The signal is fine. Dead air is approved. Do not adjust.',
    timestamp: NOW - DAY * 3,
    tags: ['station-id'],
    source: 'seeded',
  },
];

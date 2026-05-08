/**
 * Breakroom Radio brand data — canonical, mirrors docs/RADIO_BRAND.md.
 *
 * The /radio page redesign reads from these exports rather than embedding
 * placeholder copy. Hosts and schedule are stable; CURRENT_ARC rotates
 * (it's the rolling storyline, edits to it shouldn't churn the rest of the
 * file).
 *
 * Voice register (per project_instructions): dry, deadpan, slightly damaged.
 * Useful but broken. Mysterious without being occult.
 */

/* ----------------------------------------------------------------------- */
/*  STATION IDENTITY                                                        */
/* ----------------------------------------------------------------------- */

export interface StationIdentity {
  name: string;
  altNames: string[];
  callsign: string;
  altCallsigns: string[];
  frequency: string;
  channel: string;
  slogans: string[];
  licenseStatus: string;
  broadcastOrigin: string;
  policy: string;
  hours: string;
}

export const STATION_IDENTITY: StationIdentity = {
  name: 'Breakroom Radio',
  altNames: ['Channel 1:47', 'KLOT', 'the station'],
  callsign: 'KLOT-147',
  altCallsigns: ['WBRK', 'K147', 'KOTL'],
  frequency: '147 megacycles',
  channel: '1:47',
  slogans: [
    'Broadcasting from somewhere behind the bar.',
    'Unlicensed but undisputed.',
    "If the lot weather changes, we'll say so.",
    'Dead air is approved.',
  ],
  licenseStatus:
    'None. Several cease-and-desist letters from the FCC, all read on air as bedtime stories.',
  broadcastOrigin: 'somewhere behind the bar',
  policy:
    'If the lot weather changes, we say so. If the phone rings, we put it on the wire. If you call in, you become evidence.',
  hours: '1:47 AM to sunrise. Sunrise is not defined.',
};

/* ----------------------------------------------------------------------- */
/*  WORDMARK                                                                */
/* ----------------------------------------------------------------------- */

export interface RadioWordmark {
  primary: string;
  subline: string;
  tagline: string;
  primaryFont: string;
  sublineFont: string;
  primaryTracking: string;
  primaryColor: string;
  sublineColor: string;
  rule: 'double-thin' | 'single-amber' | 'none';
}

export const WORDMARK: RadioWordmark = {
  primary: 'BREAKROOM RADIO',
  subline: 'channel 1:47',
  tagline: 'broadcasting from somewhere behind the bar',
  primaryFont: "'DM Serif Display', 'Times New Roman', Times, serif",
  sublineFont: "'DM Serif Display', 'Times New Roman', Times, serif",
  primaryTracking: '0.18em',
  primaryColor: '#f5d135',
  sublineColor: '#a8923b',
  rule: 'double-thin',
};

/* ----------------------------------------------------------------------- */
/*  HOSTS                                                                  */
/* ----------------------------------------------------------------------- */

export type RadioHostId =
  | 'driver' | 'roomAdmin' | 'systemVoice' | 'coffee' | 'poolOracle'
  | 'anonymous' | 'philBehindBar' | 'nightManager';

export interface RadioHost {
  id: RadioHostId;
  name: string;
  show?: string;
  bio: string;
  newNpc?: true;
}

export const RADIO_HOSTS: RadioHost[] = [
  {
    id: 'driver', name: 'The Driver', show: 'Lot Weather',
    bio: "Knows what the asphalt feels like, what the moths are doing, where the wind is coming from. Reads weather like it's a guilty plea. Never says it's nice out, even when it is.",
  },
  {
    id: 'roomAdmin', name: 'Room Admin', show: 'Phone Behind The Bar',
    bio: 'Plays voicemails left at the bar that week. Refuses to interpret them. Will say "filed" after each.',
  },
  {
    id: 'systemVoice', name: 'System Voice', show: 'OmniShift Compliance Hour',
    bio: 'Reads OmniShift compliance memos in monotone. Has been doing this for years. Has read the same memo three times in the same hour and not noticed.',
  },
  {
    id: 'coffee', name: 'Coffee', show: 'Back Booth Mix',
    bio: "Plays whatever was on the cassette in the back booth that week. Sometimes it's music. Sometimes it's a guy talking about timing belts.",
  },
  {
    id: 'poolOracle', name: 'Pool Oracle', show: 'Faction Beef Hour',
    bio: 'Adjudicates faction disputes between The Players, Lot Racers, Night Drinkers, Smokers, and Cowboys. Always rules: settle it on the table.',
  },
  {
    id: 'anonymous', name: 'Anonymous', show: "Truckers' Open Line",
    bio: 'Different host every night. Sometimes the same host announcing themselves differently. Has occasionally been The Driver pretending to be someone else.',
  },
  {
    id: 'philBehindBar', name: 'Phil Behind The Bar',
    show: 'Sign-off / Static Until 1:47', newNpc: true,
    bio: "Doesn't usually say anything. Plays a shortwave-style tone test for forty seconds and then static.",
  },
  {
    id: 'nightManager', name: 'Night Manager',
    bio: 'Does occasional station IDs between shows. Reads FCC cease-and-desist letters as bedtime stories. Will, without warning, do a 30-second monologue about a person he met in 1996.',
  },
];

/* ----------------------------------------------------------------------- */
/*  SCHEDULE                                                                */
/* ----------------------------------------------------------------------- */

export type RadioShowType =
  | 'lot-weather' | 'phone' | 'compliance' | 'back-booth'
  | 'faction-beef' | 'open-line' | 'sign-off';

export interface RadioScheduleSlot {
  time: string;
  show: string;
  host: string;
  type: RadioShowType;
  note?: string;
}

export const RADIO_SCHEDULE: RadioScheduleSlot[] = [
  { time: '1:47', show: 'Lot Weather', host: 'The Driver', type: 'lot-weather', note: 'Cold open. No theme music. Just begins.' },
  { time: '2:13', show: 'Phone Behind The Bar', host: 'Room Admin', type: 'phone', note: 'Voicemails. No interpretation.' },
  { time: '3:00', show: 'OmniShift Compliance Hour', host: 'System Voice', type: 'compliance', note: 'Required. Probably.' },
  { time: '4:11', show: 'Back Booth Mix', host: 'Coffee', type: 'back-booth', note: 'Whatever was on the cassette.' },
  { time: '4:47', show: 'Faction Beef Hour', host: 'Pool Oracle', type: 'faction-beef', note: 'Disputes. Settle it on the table.' },
  { time: '5:30', show: "Truckers' Open Line", host: 'Anonymous', type: 'open-line', note: 'Different host every night.' },
  { time: '6:00', show: 'Sign-off / Static Until 1:47', host: 'Phil Behind The Bar', type: 'sign-off', note: 'Tone test, then static for 19h47m.' },
];

export const SCHEDULE_NOTE = 'Schedule subject to faction interruption.';

/* ----------------------------------------------------------------------- */
/*  BUMPERS / STATION IDS                                                  */
/* ----------------------------------------------------------------------- */

export const BUMPERS: string[] = [
  "You're listening to Breakroom Radio. Channel 1:47. Broadcasting from somewhere behind the bar.",
  "If the lot weather changes, we'll say so.",
  'The station does not take requests. It takes evidence.',
  'Compliance has been notified. Compliance is not listening.',
  'Tonight’s broadcast is brought to you by nobody. We have no sponsors. We have no advertisers. We have a coffee pot.',
  'We are unlicensed but undisputed.',
  "If you can hear this, that's already a problem.",
  "The phone behind the bar is open. Don't call. Some people will anyway.",
];

/* ----------------------------------------------------------------------- */
/*  SPONSOR SLOTS                                                           */
/* ----------------------------------------------------------------------- */

export const SPONSOR_SLOTS: string[] = [
  'This hour brought to you by The Coffee Pot, in studio.',
  'This hour brought to you by the back booth, currently occupied.',
  'This hour brought to you by nobody, again.',
  'This hour brought to you by an object we found in the lot.',
  'This hour brought to you by the receipt with no total.',
  'This hour brought to you by Lot 7, where the asphalt is sticky.',
  'This hour brought to you by an envelope with someone’s name crossed out.',
  'This hour brought to you by The Rack, when The Rack remembers it has product.',
];

/* ----------------------------------------------------------------------- */
/*  PHONE LINE STATES                                                       */
/* ----------------------------------------------------------------------- */

/**
 * Status-strip phone-line readout pool. Rotates deterministically to make
 * the call queue feel alive without faking real activity. Same 90-second
 * rotation cadence as sponsor slots so visual changes feel synchronous.
 */
export const PHONE_LINE_STATES: string[] = [
  'phone: 7 holding',
  'phone: 4 holding',
  'phone: 11 holding',
  'phone: 1 (probably Carl)',
  'phone: nobody — all hung up',
  'phone: 2 holding · 1 not speaking',
  'phone: 9 holding · ringing through',
];

export function pickPhoneCount(seed: number = Date.now()): string {
  return PHONE_LINE_STATES[Math.floor(seed / 90_000) % PHONE_LINE_STATES.length];
}

/* ----------------------------------------------------------------------- */
/*  CURRENT ARC (rolling)                                                   */
/* ----------------------------------------------------------------------- */

export interface RadioArcThread {
  id: string;
  headline: string;
  body: string;
  tag: 'caller' | 'lot-weather' | 'sign-off' | 'faction' | 'compliance' | 'anomaly';
}

export const CURRENT_ARC: RadioArcThread[] = [
  { id: 'carls-hoodies', headline: "Carl's hoodies.", body: 'A caller named Carl has been calling in every night for three months asking if anyone has seen his hoodies. The free-hoodies popup is the radio noticing him.', tag: 'caller' },
  { id: 'asphalt-sticky', headline: 'The asphalt is sticky.', body: 'Lot weather has been off for two weeks. The Driver has noticed. He has stopped saying it’s normal.', tag: 'lot-weather' },
  { id: 'sign-off-creeping', headline: 'The sign-off is creeping.', body: 'Used to be 5:30. Now 6:00. The reason has not been disclosed.', tag: 'sign-off' },
  { id: 'cowboys-line-dropping', headline: 'The Cowboys are calling but the line keeps dropping.', body: 'A new faction is trying to get on Faction Beef Hour. The phone won’t connect. Pool Oracle has not commented.', tag: 'faction' },
  { id: 'omnishift-says-we-dont-exist', headline: "OmniShift says we don't exist.", body: "This quarter's compliance memo. Station read it on air. Did not stop.", tag: 'compliance' },
  { id: 'receiver-anomalies', headline: 'Channel 1:47 has been showing up on receivers it isn’t supposed to.', body: "Listeners are submitting evidence to the request line that they've heard the station at 4 PM in the afternoon, on devices that were unplugged. The station does not address this on air.", tag: 'anomaly' },
];

/* ----------------------------------------------------------------------- */
/*  CARL                                                                    */
/* ----------------------------------------------------------------------- */

export interface CarlTransmission {
  caller: string;
  duration: string;
  message: string;
  fileLabel: string;
}

export const CARL_TRANSMISSION: CarlTransmission = {
  caller: 'Carl',
  duration: 'three months, every night',
  message: "Yeah hi this is Carl. I'm just checking back to see if anyone’s seen my hoodies — the gray ones with the logo, I left like nine of them at the bar in March. Call me back if anything turns up. You have the number.",
  fileLabel: 'CALL_CARL.WAV',
};

/* ----------------------------------------------------------------------- */
/*  FCC LETTERS                                                             */
/* ----------------------------------------------------------------------- */

export interface FccLetter {
  id: string;
  date: string;
  fromOffice: string;
  addressedTo: string;
  subject: string;
  body: string;
  signature: string;
}

export const FCC_LETTERS: FccLetter[] = [
  {
    id: 'fcc-2023-first-notice',
    date: 'November 14, 2023',
    fromOffice: 'Federal Communications Commission · Field Office, Eastern Division',
    addressedTo: 'Operator, KLOT-147 (callsign not on record)',
    subject: 'Notice of Apparent Liability for Forfeiture',
    body: 'Our records indicate broadcasting at 147 megacycles. This frequency is not allocated for civilian broadcast. Please cease operations within thirty (30) days of this notice.\n\nFailure to comply may result in fines, equipment seizure, or both. Forfeit penalty: USD 7,000.\n\nThis is your first formal notice. Please respond in writing.',
    signature: 'D. Halverson, Field Inspector',
  },
  {
    id: 'fcc-2025-third-notice',
    date: 'August 2, 2025',
    fromOffice: 'Federal Communications Commission · Field Office, Inland Region',
    addressedTo: 'KLOT-147 / WBRK / K147 (callsign as variously broadcast)',
    subject: 'Third Notice — Continued Unauthorized Operation',
    body: 'Multiple notices have been issued and ignored. Please be advised that continued operation will result in further enforcement action up to and including criminal referral.\n\nAdditionally: signal interference reports we have received describe broadcasts heard at 4:00 PM in the afternoon, on devices that were unplugged. We require an explanation.\n\nA response is mandatory. None is expected.',
    signature: 'M. Reyes, Senior Field Inspector',
  },
];

/* ----------------------------------------------------------------------- */
/*  Helpers                                                                 */
/* ----------------------------------------------------------------------- */

export function findHostByName(name: string): RadioHost | undefined {
  return RADIO_HOSTS.find((h) => h.name === name);
}

export function pickSlogan(seed: number = Date.now()): string {
  return STATION_IDENTITY.slogans[Math.floor(seed / 60_000) % STATION_IDENTITY.slogans.length];
}

export function pickFccLetter(seed: number = Date.now()): FccLetter {
  const idx = Math.floor(seed / (6 * 60 * 60 * 1000)) % FCC_LETTERS.length;
  return FCC_LETTERS[idx];
}

export function pickSponsorSlot(seed: number = Date.now()): string {
  return SPONSOR_SLOTS[Math.floor(seed / 90_000) % SPONSOR_SLOTS.length];
}

export const SHOW_TYPE_LABEL: Record<RadioShowType, string> = {
  'lot-weather': 'LOT WEATHER',
  phone: 'PHONE',
  compliance: 'COMPLIANCE',
  'back-booth': 'BACK BOOTH',
  'faction-beef': 'FACTION BEEF',
  'open-line': 'OPEN LINE',
  'sign-off': 'SIGN-OFF',
};

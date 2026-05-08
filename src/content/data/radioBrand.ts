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
  /** Most-used on-air name. */
  name: string;
  /** Alternate phrasings the hosts use interchangeably. */
  altNames: string[];
  /** Primary callsign. Not a real FCC pattern. */
  callsign: string;
  /** Other callsigns hosts have used. The drift is the joke. */
  altCallsigns: string[];
  /** "147 megacycles" — not a real frequency. The receiver isn't looking. */
  frequency: string;
  /** Channel number used in chrome and bumpers. */
  channel: string;
  /** Slogans rotated through bumpers / banners. Keep short. */
  slogans: string[];
  /** License status. None. */
  licenseStatus: string;
  /** Where the transmitter physically lives. The bit. */
  broadcastOrigin: string;
  /** Programming policy in one line. The voice. */
  policy: string;
  /** Stated broadcast hours. Sign-off creeping is a current arc. */
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
/*  HOSTS                                                                  */
/* ----------------------------------------------------------------------- */

export type RadioHostId =
  | 'driver'
  | 'roomAdmin'
  | 'systemVoice'
  | 'coffee'
  | 'poolOracle'
  | 'anonymous'
  | 'philBehindBar'
  | 'nightManager';

export interface RadioHost {
  id: RadioHostId;
  /** On-air name. */
  name: string;
  /** Show they primarily host (omitted for utility hosts like Night Manager). */
  show?: string;
  /** One-line bio in the station-voice register. */
  bio: string;
  /** Optional flag: NPC introduced for the radio brand specifically. */
  newNpc?: true;
}

export const RADIO_HOSTS: RadioHost[] = [
  {
    id: 'driver',
    name: 'The Driver',
    show: 'Lot Weather',
    bio: "Knows what the asphalt feels like, what the moths are doing, where the wind is coming from. Reads weather like it's a guilty plea. Never says it's nice out, even when it is.",
  },
  {
    id: 'roomAdmin',
    name: 'Room Admin',
    show: 'Phone Behind The Bar',
    bio: 'Plays voicemails left at the bar that week. Refuses to interpret them. Will say "filed" after each.',
  },
  {
    id: 'systemVoice',
    name: 'System Voice',
    show: 'OmniShift Compliance Hour',
    bio: 'Reads OmniShift compliance memos in monotone. Has been doing this for years. Has read the same memo three times in the same hour and not noticed.',
  },
  {
    id: 'coffee',
    name: 'Coffee',
    show: 'Back Booth Mix',
    bio: "Plays whatever was on the cassette in the back booth that week. Sometimes it's music. Sometimes it's a guy talking about timing belts.",
  },
  {
    id: 'poolOracle',
    name: 'Pool Oracle',
    show: 'Faction Beef Hour',
    bio: 'Adjudicates faction disputes between The Players, Lot Racers, Night Drinkers, Smokers, and Cowboys. Always rules: settle it on the table.',
  },
  {
    id: 'anonymous',
    name: 'Anonymous',
    show: "Truckers' Open Line",
    bio: 'Different host every night. Sometimes the same host announcing themselves differently. Has occasionally been The Driver pretending to be someone else.',
  },
  {
    id: 'philBehindBar',
    name: 'Phil Behind The Bar',
    show: 'Sign-off / Static Until 1:47',
    newNpc: true,
    bio: "Doesn't usually say anything. Plays a shortwave-style tone test for forty seconds and then static.",
  },
  {
    id: 'nightManager',
    name: 'Night Manager',
    bio: 'Does occasional station IDs between shows. Reads FCC cease-and-desist letters as bedtime stories. Will, without warning, do a 30-second monologue about a person he met in 1996.',
  },
];

/* ----------------------------------------------------------------------- */
/*  SCHEDULE                                                                */
/* ----------------------------------------------------------------------- */

export type RadioShowType =
  | 'lot-weather'
  | 'phone'
  | 'compliance'
  | 'back-booth'
  | 'faction-beef'
  | 'open-line'
  | 'sign-off';

export interface RadioScheduleSlot {
  /** Wall-clock time the show starts. Display as-is, with the colon. */
  time: string;
  /** Show name. */
  show: string;
  /** Host's display name (matches RadioHost.name). */
  host: string;
  /** Type tag for chip color in the schedule grid. */
  type: RadioShowType;
  /** One-line italic note shown under or beside the row. */
  note?: string;
}

export const RADIO_SCHEDULE: RadioScheduleSlot[] = [
  {
    time: '1:47',
    show: 'Lot Weather',
    host: 'The Driver',
    type: 'lot-weather',
    note: 'Cold open. No theme music. Just begins.',
  },
  {
    time: '2:13',
    show: 'Phone Behind The Bar',
    host: 'Room Admin',
    type: 'phone',
    note: 'Voicemails. No interpretation.',
  },
  {
    time: '3:00',
    show: 'OmniShift Compliance Hour',
    host: 'System Voice',
    type: 'compliance',
    note: 'Required. Probably.',
  },
  {
    time: '4:11',
    show: 'Back Booth Mix',
    host: 'Coffee',
    type: 'back-booth',
    note: 'Whatever was on the cassette.',
  },
  {
    time: '4:47',
    show: 'Faction Beef Hour',
    host: 'Pool Oracle',
    type: 'faction-beef',
    note: 'Disputes. Settle it on the table.',
  },
  {
    time: '5:30',
    show: "Truckers' Open Line",
    host: 'Anonymous',
    type: 'open-line',
    note: 'Different host every night.',
  },
  {
    time: '6:00',
    show: 'Sign-off / Static Until 1:47',
    host: 'Phil Behind The Bar',
    type: 'sign-off',
    note: 'Tone test, then static for 19h47m.',
  },
];

/** Schedule footer caveat. Cosmetic, but in-world. */
export const SCHEDULE_NOTE = 'Schedule subject to faction interruption.';

/* ----------------------------------------------------------------------- */
/*  BUMPERS / STATION IDS                                                  */
/* ----------------------------------------------------------------------- */

/**
 * Played between shows on a tape that's been wearing out for years.
 * The marquee draws from this pool. Order is canonical for now —
 * the marquee can rotate it client-side.
 */
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
/*  CURRENT ARC (rolling — rotate independently of the rest)               */
/* ----------------------------------------------------------------------- */

export interface RadioArcThread {
  /** Stable id so we can reference threads from other surfaces (newsstand, etc.) */
  id: string;
  /** Short headline. The station refers to threads by these. */
  headline: string;
  /** Body — one paragraph, in the station-voice register. */
  body: string;
  /** Tag for chip color when surfaced. */
  tag: 'caller' | 'lot-weather' | 'sign-off' | 'faction' | 'compliance' | 'anomaly';
}

export const CURRENT_ARC: RadioArcThread[] = [
  {
    id: 'carls-hoodies',
    headline: "Carl's hoodies.",
    body: 'A caller named Carl has been calling in every night for three months asking if anyone has seen his hoodies. The free-hoodies popup is the radio noticing him.',
    tag: 'caller',
  },
  {
    id: 'asphalt-sticky',
    headline: 'The asphalt is sticky.',
    body: 'Lot weather has been off for two weeks. The Driver has noticed. He has stopped saying it’s normal.',
    tag: 'lot-weather',
  },
  {
    id: 'sign-off-creeping',
    headline: 'The sign-off is creeping.',
    body: 'Used to be 5:30. Now 6:00. The reason has not been disclosed.',
    tag: 'sign-off',
  },
  {
    id: 'cowboys-line-dropping',
    headline: 'The Cowboys are calling but the line keeps dropping.',
    body: 'A new faction is trying to get on Faction Beef Hour. The phone won’t connect. Pool Oracle has not commented.',
    tag: 'faction',
  },
  {
    id: 'omnishift-says-we-dont-exist',
    headline: "OmniShift says we don't exist.",
    body: "This quarter's compliance memo. Station read it on air. Did not stop.",
    tag: 'compliance',
  },
  {
    id: 'receiver-anomalies',
    headline: 'Channel 1:47 has been showing up on receivers it isn’t supposed to.',
    body: "Listeners are submitting evidence to the request line that they've heard the station at 4 PM in the afternoon, on devices that were unplugged. The station does not address this on air.",
    tag: 'anomaly',
  },
];

/* ----------------------------------------------------------------------- */
/*  Helpers                                                                 */
/* ----------------------------------------------------------------------- */

/** Look up a host's bio entry by their display name. Used by the schedule grid. */
export function findHostByName(name: string): RadioHost | undefined {
  return RADIO_HOSTS.find((h) => h.name === name);
}

/** Return a slogan rotated by daypart. Server-renderable: stable per timestamp. */
export function pickSlogan(seed: number = Date.now()): string {
  return STATION_IDENTITY.slogans[
    Math.floor(seed / 60_000) % STATION_IDENTITY.slogans.length
  ];
}

/** Color tag for schedule type chips. The /radio redesign uses these. */
export const SHOW_TYPE_LABEL: Record<RadioShowType, string> = {
  'lot-weather': 'LOT WEATHER',
  phone: 'PHONE',
  compliance: 'COMPLIANCE',
  'back-booth': 'BACK BOOTH',
  'faction-beef': 'FACTION BEEF',
  'open-line': 'OPEN LINE',
  'sign-off': 'SIGN-OFF',
};

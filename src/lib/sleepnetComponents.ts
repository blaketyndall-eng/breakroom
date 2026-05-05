export type SleepNetComponentType =
  | 'guestbook'
  | 'fake_ad'
  | 'stuff_shelf'
  | 'object_file'
  | 'character_comment'
  | 'warning_notice'
  | 'classified_block'
  | 'visitor_counter'
  | 'weather_widget'
  | 'rivalry_notice'
  | 'photo_gallery'
  | 'collection_case'
  | 'jukebox';

export type SleepNetGuestbookComponent = {
  id: string;
  type: 'guestbook';
  title: string;
  entries: { name: string; body: string; timestampLabel?: string }[];
};

export type SleepNetFakeAdComponent = {
  id: string;
  type: 'fake_ad';
  headline: string;
  body: string;
  cta?: string;
  href?: string;
  sponsor?: string;
};

export type SleepNetStuffShelfComponent = {
  id: string;
  type: 'stuff_shelf';
  title: string;
  items: {
    name: string;
    status: 'available' | 'removed' | 'coming_soon' | 'not_for_you' | 'found' | 'fake';
    note?: string;
    priceLabel?: string;
  }[];
};

export type SleepNetObjectFileComponent = {
  id: string;
  type: 'object_file';
  objectSlug?: string;
  objectName: string;
  note: string;
  status?: string;
};

export type SleepNetCharacterCommentComponent = {
  id: string;
  type: 'character_comment';
  agentSlug: string;
  agentName: string;
  body: string;
};

export type SleepNetWarningNoticeComponent = {
  id: string;
  type: 'warning_notice';
  stamp: string;
  body: string;
};

export type SleepNetClassifiedBlockComponent = {
  id: string;
  type: 'classified_block';
  listings: { headline: string; body: string; contact?: string }[];
};

export type SleepNetVisitorCounterComponent = {
  id: string;
  type: 'visitor_counter';
  countSeed: number;
  label?: string;
};

export type SleepNetWeatherWidgetComponent = {
  id: string;
  type: 'weather_widget';
  mode: 'lot' | 'table' | 'emotional';
  placeholder: string;
};

export type SleepNetRivalryNoticeComponent = {
  id: string;
  type: 'rivalry_notice';
  factionA: string;
  factionB: string;
  body: string;
};

export type SleepNetPhotoGalleryComponent = {
  id: string;
  type: 'photo_gallery';
  title: string;
  photos: {
    id: string;
    src?: string;
    alt: string;
    caption?: string;
    sourceLabel?: string;
    artifactSlug?: string;
    objectSlug?: string;
    isPlaceholder?: boolean;
  }[];
};

export type SleepNetCollectionCaseComponent = {
  id: string;
  type: 'collection_case';
  title: string;
  items: {
    slug: string;
    name: string;
    kind: 'artifact' | 'object' | 'item' | 'photo' | 'unknown';
    status: 'found' | 'filed' | 'removed' | 'not_for_you' | 'rumored' | 'fake';
    note?: string;
    sourcePath?: string;
  }[];
};

export type SleepNetJukeboxComponent = {
  id: string;
  type: 'jukebox';
  provider: 'spotify' | 'apple_music' | 'youtube' | 'external' | 'none';
  title: string;
  artist?: string;
  embedUrl?: string;
  externalUrl?: string;
  caption?: string;
};

export type SleepNetComponent =
  | SleepNetGuestbookComponent
  | SleepNetFakeAdComponent
  | SleepNetStuffShelfComponent
  | SleepNetObjectFileComponent
  | SleepNetCharacterCommentComponent
  | SleepNetWarningNoticeComponent
  | SleepNetClassifiedBlockComponent
  | SleepNetVisitorCounterComponent
  | SleepNetWeatherWidgetComponent
  | SleepNetRivalryNoticeComponent
  | SleepNetPhotoGalleryComponent
  | SleepNetCollectionCaseComponent
  | SleepNetJukeboxComponent;

export const SLEEPNET_COMPONENT_TYPES: SleepNetComponentType[] = [
  'guestbook',
  'fake_ad',
  'stuff_shelf',
  'object_file',
  'character_comment',
  'warning_notice',
  'classified_block',
  'visitor_counter',
  'weather_widget',
  'rivalry_notice',
  'photo_gallery',
  'collection_case',
  'jukebox',
];

export function isSpotifyEmbedUrl(value?: string) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.hostname.includes('spotify.com') && url.pathname.includes('/embed/');
  } catch {
    return false;
  }
}

export function createFauxCompanyComponents(title: string): SleepNetComponent[] {
  const countSeed = Math.max(147, title.length * 573);

  return [
    {
      id: 'notice-001',
      type: 'warning_notice',
      stamp: 'NOT INSPECTED',
      body: 'This business has not been inspected by any agency with a working phone.',
    },
    {
      id: 'ad-001',
      type: 'fake_ad',
      headline: 'POOL DISPUTE? CALL NOW.',
      body: 'We settle table arguments with confidence, not fairness.',
      cta: 'Dial after 1:47',
      sponsor: 'Back Office Legal-ish Desk',
    },
    {
      id: 'shelf-001',
      type: 'stuff_shelf',
      title: 'Stuff Management Denies',
      items: [
        { name: 'Employee Burger Hat', status: 'removed', note: 'Removed by management before photos could be developed.' },
        { name: 'Legal Napkin Pack', status: 'coming_soon', note: 'For provisional meals and table arguments.' },
        { name: 'Receipt With No Total', status: 'found', priceLabel: '$?.??' },
      ],
    },
    {
      id: 'gallery-001',
      type: 'photo_gallery',
      title: 'Low Light Photo Proof',
      photos: [
        { id: 'photo-1', alt: 'Exterior photo missing', caption: 'Exterior photo missing / camera failed', sourceLabel: 'EVIDENCE 01', isPlaceholder: true },
        { id: 'photo-2', alt: 'Counter image corrupted', caption: 'Counter image corrupted by fluorescent light', sourceLabel: 'EVIDENCE 02', isPlaceholder: true },
        { id: 'photo-3', alt: 'Employee badge photo under review', caption: 'Employee badge photo under review', sourceLabel: 'EVIDENCE 03', isPlaceholder: true },
        { id: 'photo-4', alt: 'Parking lot sighting', caption: 'Parking lot sighting / unverified', sourceLabel: 'EVIDENCE 04', isPlaceholder: true },
      ],
    },
    {
      id: 'case-001',
      type: 'collection_case',
      title: 'Object And Item Case',
      items: [
        { slug: 'dial-tone-slip', name: 'Dial Tone Slip', kind: 'artifact', status: 'filed', sourcePath: '/artifacts' },
        { slug: 'receipt-with-no-total', name: 'Receipt With No Total', kind: 'object', status: 'found' },
        { slug: 'wrong-employee-badge', name: 'Wrong Employee Badge', kind: 'item', status: 'rumored' },
      ],
    },
    {
      id: 'jukebox-001',
      type: 'jukebox',
      provider: 'none',
      title: 'Track Unavailable In This Room',
      caption: 'The jukebox accepted the quarter and kept the song.',
    },
    {
      id: 'guestbook-001',
      type: 'guestbook',
      title: 'Guestbook / Pending Approval',
      entries: [
        { name: 'Directory Clerk', body: 'This URL looks official, which is how most problems start.', timestampLabel: '1:47 AM' },
        { name: 'Unknown Employee', body: 'I saw the page before it had a name.', timestampLabel: 'after close' },
      ],
    },
    {
      id: 'comment-001',
      type: 'character_comment',
      agentSlug: 'night-manager',
      agentName: 'Night Manager',
      body: `${title} has been approved for temporary existence. Do not ask who approved it.`,
    },
    {
      id: 'counter-001',
      type: 'visitor_counter',
      countSeed,
      label: 'Visitors counted by the machine under the counter',
    },
  ];
}

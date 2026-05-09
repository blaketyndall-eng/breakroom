/**
 * Crews V2 — PR 63 (Crew Builder V2)
 *
 * User-created groups. Not official Turf.
 * Crews are informal, user-made organizations: clubs, teams, locals,
 * gangs, weird organizations, fake unions, old-web fan clubs.
 *
 * V2 adds: disbandCrew, searchCrews, onCrewEvent subscription,
 * ledger integration, expanded seed data, crew stats.
 *
 * Local-first with future Supabase path.
 */

import { emitCrewFormed, emitCrewJoined, emitCrewLeft, emitCrewDisbanded } from './ledgerEmitters';

// --- Types ---

export type CrewRole = 'founder' | 'member' | 'seen_around';

export type CrewMember = {
  handle: string;
  displayName: string;
  role: CrewRole;
  joinedAt: string;
};

export type Crew = {
  slug: string;
  name: string;
  tagline: string;
  foundedBy: string;
  foundedAt: string;
  isOfficial: boolean; // false until promoted by admin
  memberCount: number;
  members: CrewMember[];
  district?: string;
  factionAlignment?: string; // optional faction slug
  visibility: 'public' | 'unlisted' | 'invite_only';
  tags: string[];
};

export type CrewFilter = {
  district?: string;
  factionAlignment?: string;
  search?: string;
  visibility?: Crew['visibility'];
  onlyMine?: boolean;
};

export type CrewStats = {
  totalCrews: number;
  totalMembers: number;
  officialCount: number;
  unofficialCount: number;
  districtCounts: Record<string, number>;
  factionCounts: Record<string, number>;
};

// --- Storage ---

const CREWS_KEY = 'breakroom.crews.v1';
const MY_CREWS_KEY = 'breakroom.my-crews.v1';

function readCrews(): Crew[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CREWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCrews(crews: Crew[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CREWS_KEY, JSON.stringify(crews));
}

function readMyCrews(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(MY_CREWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeMyCrews(slugs: string[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(MY_CREWS_KEY, JSON.stringify(slugs));
}

// --- Event subscription (V2) ---

type CrewEventCallback = (crew: Crew, action: 'created' | 'joined' | 'left' | 'disbanded') => void;
const subscribers: CrewEventCallback[] = [];

function notifySubscribers(crew: Crew, action: 'created' | 'joined' | 'left' | 'disbanded') {
  for (const cb of subscribers) {
    try { cb(crew, action); } catch { /* subscriber error ignored */ }
  }
}

/** Subscribe to crew events. Returns unsubscribe function. */
export function onCrewEvent(cb: CrewEventCallback): () => void {
  subscribers.push(cb);
  return () => {
    const idx = subscribers.indexOf(cb);
    if (idx >= 0) subscribers.splice(idx, 1);
  };
}

// --- Slug generation ---

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);
}

// --- CRUD ---

export function getAllCrews(): Crew[] {
  return [...SEEDED_CREWS, ...readCrews()];
}

export function getPublicCrews(): Crew[] {
  return getAllCrews().filter((c) => c.visibility !== 'invite_only');
}

export function getCrewBySlug(slug: string): Crew | null {
  return getAllCrews().find((c) => c.slug === slug) ?? null;
}

export function getMyCrewSlugs(): string[] {
  return readMyCrews();
}

export function isInCrew(slug: string): boolean {
  return readMyCrews().includes(slug);
}

/** V2: Search and filter crews */
export function searchCrews(filter: CrewFilter = {}): Crew[] {
  let results = getAllCrews();

  if (filter.visibility) {
    results = results.filter((c) => c.visibility === filter.visibility);
  } else {
    // Default: exclude invite_only unless specifically requested
    results = results.filter((c) => c.visibility !== 'invite_only');
  }

  if (filter.district) {
    results = results.filter((c) => c.district === filter.district);
  }

  if (filter.factionAlignment) {
    results = results.filter((c) => c.factionAlignment === filter.factionAlignment);
  }

  if (filter.onlyMine) {
    const mine = readMyCrews();
    results = results.filter((c) => mine.includes(c.slug));
  }

  if (filter.search) {
    const q = filter.search.toLowerCase();
    results = results.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.tagline.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return results;
}

/** V2: Get crew statistics */
export function getCrewStats(): CrewStats {
  const all = getAllCrews();
  const districtCounts: Record<string, number> = {};
  const factionCounts: Record<string, number> = {};
  let totalMembers = 0;

  for (const c of all) {
    totalMembers += c.memberCount;
    if (c.district) {
      districtCounts[c.district] = (districtCounts[c.district] || 0) + 1;
    }
    if (c.factionAlignment) {
      factionCounts[c.factionAlignment] = (factionCounts[c.factionAlignment] || 0) + 1;
    }
  }

  return {
    totalCrews: all.length,
    totalMembers,
    officialCount: all.filter((c) => c.isOfficial).length,
    unofficialCount: all.filter((c) => !c.isOfficial).length,
    districtCounts,
    factionCounts,
  };
}

export function createCrew(input: {
  name: string;
  tagline: string;
  founderHandle: string;
  founderDisplayName: string;
  district?: string;
  factionAlignment?: string;
  visibility?: Crew['visibility'];
  tags?: string[];
}): Crew | null {
  const slug = generateSlug(input.name);
  if (!slug) return null;

  // Check for duplicate
  const existing = getAllCrews();
  if (existing.some((c) => c.slug === slug)) return null;

  const crew: Crew = {
    slug,
    name: input.name,
    tagline: input.tagline,
    foundedBy: input.founderHandle,
    foundedAt: new Date().toISOString(),
    isOfficial: false,
    memberCount: 1,
    members: [
      {
        handle: input.founderHandle,
        displayName: input.founderDisplayName,
        role: 'founder',
        joinedAt: new Date().toISOString(),
      },
    ],
    district: input.district,
    factionAlignment: input.factionAlignment,
    visibility: input.visibility ?? 'public',
    tags: input.tags ?? [],
  };

  const userCrews = readCrews();
  writeCrews([...userCrews, crew]);

  const myCrews = readMyCrews();
  writeMyCrews([...myCrews, slug]);

  // V2: Emit ledger event
  emitCrewFormed({
    slug: crew.slug,
    name: crew.name,
    founderCount: 1,
    district: crew.district,
  });

  notifySubscribers(crew, 'created');
  return crew;
}

export function joinCrew(slug: string, handle: string, displayName: string): boolean {
  const allUser = readCrews();
  const crew = allUser.find((c) => c.slug === slug);

  // Can't join seeded crews in local mode (would need Supabase)
  if (!crew) return false;
  if (crew.members.some((m) => m.handle === handle)) return false;

  crew.members.push({
    handle,
    displayName,
    role: 'member',
    joinedAt: new Date().toISOString(),
  });
  crew.memberCount = crew.members.length;

  writeCrews(allUser);

  const myCrews = readMyCrews();
  if (!myCrews.includes(slug)) {
    writeMyCrews([...myCrews, slug]);
  }

  // PR 72: emit ledger event so /ledger and the phone listener see it.
  try {
    emitCrewJoined({
      slug: crew.slug,
      name: crew.name,
      actor: handle,
      district: crew.district,
    });
  } catch {
    /* emitter errors are swallowed */
  }

  notifySubscribers(crew, 'joined');
  return true;
}

export function leaveCrew(slug: string, handle: string): boolean {
  const allUser = readCrews();
  const crew = allUser.find((c) => c.slug === slug);
  if (!crew) return false;

  // Founders can't leave (must disband)
  const member = crew.members.find((m) => m.handle === handle);
  if (!member || member.role === 'founder') return false;

  crew.members = crew.members.filter((m) => m.handle !== handle);
  crew.memberCount = crew.members.length;

  writeCrews(allUser);

  const myCrews = readMyCrews().filter((s) => s !== slug);
  writeMyCrews(myCrews);

  // PR 72: emit redacted ledger event. Public sees only "A roster lost
  // one"; admins see the full slug + actor.
  try {
    emitCrewLeft({
      slug: crew.slug,
      name: crew.name,
      actor: handle,
    });
  } catch {
    /* emitter errors are swallowed */
  }

  notifySubscribers(crew, 'left');
  return true;
}

/** V2: Disband a crew. Only founder can do this. */
export function disbandCrew(slug: string, handle: string): boolean {
  const allUser = readCrews();
  const idx = allUser.findIndex((c) => c.slug === slug);
  if (idx < 0) return false;

  const crew = allUser[idx];
  if (crew.foundedBy !== handle) return false;

  // Remove from user crews
  allUser.splice(idx, 1);
  writeCrews(allUser);

  // Remove from everyone's "my crews"
  const myCrews = readMyCrews().filter((s) => s !== slug);
  writeMyCrews(myCrews);

  // V2: Emit ledger event
  emitCrewDisbanded({
    slug: crew.slug,
    name: crew.name,
    reason: `Disbanded by founder @${handle}.`,
  });

  notifySubscribers(crew, 'disbanded');
  return true;
}

/** V2: Get crews for a specific district */
export function getCrewsByDistrict(district: string): Crew[] {
  return getAllCrews().filter((c) => c.district === district);
}

/** V2: Get crews aligned with a faction */
export function getCrewsByFaction(factionSlug: string): Crew[] {
  return getAllCrews().filter((c) => c.factionAlignment === factionSlug);
}

// --- Seeded Crews (world flavor) ---

export const SEEDED_CREWS: Crew[] = [
  {
    slug: 'late-shift-locals',
    name: 'Late Shift Locals',
    tagline: 'We were here before the acquisition. We will be here after.',
    foundedBy: 'room-hand',
    foundedAt: '2003-01-15T01:47:00.000Z',
    isOfficial: false,
    memberCount: 7,
    members: [
      { handle: 'room-hand', displayName: 'Room Hand', role: 'founder', joinedAt: '2003-01-15T01:47:00.000Z' },
      { handle: 'eddy-pool', displayName: 'Eddy Pool', role: 'member', joinedAt: '2003-02-01T00:00:00.000Z' },
      { handle: 'rudy-44', displayName: 'Rudy 44', role: 'member', joinedAt: '2003-03-08T00:00:00.000Z' },
    ],
    district: 'pool-hall-county',
    visibility: 'public',
    tags: ['regulars', 'pool', 'old guard'],
  },
  {
    slug: 'parking-lot-council',
    name: 'Parking Lot Council',
    tagline: 'We meet where the lines are painted wrong.',
    foundedBy: 'lot-arms',
    foundedAt: '2004-06-20T02:30:00.000Z',
    isOfficial: false,
    memberCount: 4,
    members: [
      { handle: 'lot-arms', displayName: 'Lot Arms', role: 'founder', joinedAt: '2004-06-20T02:30:00.000Z' },
      { handle: 'no-eddy', displayName: 'No Eddy', role: 'member', joinedAt: '2004-07-01T00:00:00.000Z' },
    ],
    district: 'parking-lot-west',
    factionAlignment: 'lot-racers',
    visibility: 'public',
    tags: ['lot', 'racers', 'council'],
  },
  {
    slug: 'object-clerks-union',
    name: 'Object Clerks Union (Unofficial)',
    tagline: 'We catalog what the room forgets. Management denies us.',
    foundedBy: 'pawn-counter-guy',
    foundedAt: '2005-11-03T00:00:00.000Z',
    isOfficial: false,
    memberCount: 3,
    members: [
      { handle: 'pawn-counter-guy', displayName: 'Pawn Counter Guy', role: 'founder', joinedAt: '2005-11-03T00:00:00.000Z' },
      { handle: 'very-good-clerk', displayName: 'Very Good Clerk', role: 'member', joinedAt: '2005-12-01T00:00:00.000Z' },
    ],
    district: 'object-district',
    visibility: 'public',
    tags: ['stuff', 'union', 'catalog'],
  },
  // V2: Additional seed crews
  {
    slug: 'back-booth-regulars',
    name: 'Back Booth Regulars',
    tagline: 'Table for six. Only four chairs. The math works out.',
    foundedBy: 'corner-booth-ray',
    foundedAt: '2003-08-22T23:30:00.000Z',
    isOfficial: false,
    memberCount: 6,
    members: [
      { handle: 'corner-booth-ray', displayName: 'Corner Booth Ray', role: 'founder', joinedAt: '2003-08-22T23:30:00.000Z' },
      { handle: 'no-receipt-donna', displayName: 'No Receipt Donna', role: 'member', joinedAt: '2003-09-01T00:00:00.000Z' },
      { handle: 'cold-coffee-mike', displayName: 'Cold Coffee Mike', role: 'seen_around', joinedAt: '2003-11-14T00:00:00.000Z' },
    ],
    district: 'back-booth',
    factionAlignment: 'night-drinkers',
    visibility: 'public',
    tags: ['booth', 'regulars', 'night shift'],
  },
  {
    slug: 'dead-link-recovery-club',
    name: 'Dead Link Recovery Club',
    tagline: 'We find the pages that the directory forgot. Then we forget them again, correctly.',
    foundedBy: 'link-rot-larry',
    foundedAt: '2004-02-14T00:00:00.000Z',
    isOfficial: false,
    memberCount: 5,
    members: [
      { handle: 'link-rot-larry', displayName: 'Link Rot Larry', role: 'founder', joinedAt: '2004-02-14T00:00:00.000Z' },
      { handle: '404-faye', displayName: '404 Faye', role: 'member', joinedAt: '2004-03-01T00:00:00.000Z' },
    ],
    district: 'dead-link-cemetery',
    visibility: 'public',
    tags: ['links', 'recovery', 'archive'],
  },
  {
    slug: 'motel-row-watch',
    name: 'Motel Row Watch',
    tagline: 'Someone has to notice the vacancies. We are someone.',
    foundedBy: 'front-desk-ghost',
    foundedAt: '2005-07-04T03:00:00.000Z',
    isOfficial: false,
    memberCount: 4,
    members: [
      { handle: 'front-desk-ghost', displayName: 'Front Desk Ghost', role: 'founder', joinedAt: '2005-07-04T03:00:00.000Z' },
      { handle: 'ice-machine-report', displayName: 'Ice Machine Report', role: 'member', joinedAt: '2005-08-15T00:00:00.000Z' },
    ],
    district: 'motel-row',
    visibility: 'public',
    tags: ['motel', 'watch', 'vacancies'],
  },
  {
    slug: 'classified-readers',
    name: 'Classified Readers',
    tagline: 'We read the classifieds that were not meant to be read.',
    foundedBy: 'small-print-sal',
    foundedAt: '2004-11-30T00:00:00.000Z',
    isOfficial: false,
    memberCount: 3,
    members: [
      { handle: 'small-print-sal', displayName: 'Small Print Sal', role: 'founder', joinedAt: '2004-11-30T00:00:00.000Z' },
    ],
    district: 'classified-alley',
    factionAlignment: 'the-smokers',
    visibility: 'unlisted',
    tags: ['classifieds', 'reading', 'secrets'],
  },
];

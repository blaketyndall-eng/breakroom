/**
 * Crews V1 — PR 54
 *
 * User-created groups. Not official Turf.
 * Crews are informal, user-made organizations: clubs, teams, locals,
 * gangs, weird organizations, fake unions, old-web fan clubs.
 *
 * Local-first with future Supabase path.
 */

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

  return true;
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
    district: 'pool_hall_county',
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
    district: 'parking_lot_west',
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
    district: 'object_district',
    visibility: 'public',
    tags: ['stuff', 'union', 'catalog'],
  },
];

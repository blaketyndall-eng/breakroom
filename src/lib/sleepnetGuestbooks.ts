import { supabase } from '@/lib/supabaseClient';

export type GuestbookActorType =
  | 'user'
  | 'anonymous_user'
  | 'agent'
  | 'seeded_npc'
  | 'system'
  | 'admin';

export type SleepNetGuestbookEntryStatus = 'local' | 'pending' | 'approved' | 'hidden' | 'removed_by_management';

export type SleepNetGuestbookMode =
  | 'myspace'
  | 'sign_in_sheet'
  | 'motel_register'
  | 'witness_log'
  | 'complaints'
  | 'classified_replies';

export type SleepNetGuestbookEntry = {
  id: string;
  siteSlug: string;
  userId?: string | null;
  alias: string;
  message: string;
  actorType: GuestbookActorType;
  status: SleepNetGuestbookEntryStatus;
  createdAt: string;
  metadata: {
    regularHandle?: string;
    factionSlug?: string;
    source?: 'local' | 'supabase' | 'seed';
    pageType?: string;
    agentSlug?: string;
  };
};

export type AddGuestbookEntryInput = {
  siteSlug: string;
  alias: string;
  message: string;
  actorType?: GuestbookActorType;
  pageType?: string;
  factionSlug?: string;
  regularHandle?: string;
};

export const LOCAL_GUESTBOOK_KEY = 'breakroom.sleepnet-guestbooks.v1';
export const GUESTBOOK_EVENT = 'breakroom:sleepnet-guestbook-updated';

// Rate limiting: max entries per site per window
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_KEY = 'breakroom.guestbook-rate-limits.v1';

function normalizeSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48);
}

function makeLocalId(siteSlug: string) {
  return `local-${normalizeSlug(siteSlug)}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function readLocalMap() {
  if (typeof window === 'undefined') return {} as Record<string, SleepNetGuestbookEntry[]>;
  try {
    const raw = window.localStorage.getItem(LOCAL_GUESTBOOK_KEY);
    return raw ? JSON.parse(raw) as Record<string, SleepNetGuestbookEntry[]> : {};
  } catch {
    return {} as Record<string, SleepNetGuestbookEntry[]>;
  }
}

function writeLocalMap(map: Record<string, SleepNetGuestbookEntry[]>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCAL_GUESTBOOK_KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent(GUESTBOOK_EVENT, { detail: { map } }));
}

// --- Rate limiting ---

function readRateLimits(): Record<string, number[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(RATE_LIMIT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeRateLimits(map: Record<string, number[]>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(map));
}

function checkRateLimit(siteSlug: string): boolean {
  const map = readRateLimits();
  const timestamps = (map[siteSlug] ?? []).filter((ts) => Date.now() - ts < RATE_LIMIT_WINDOW_MS);
  return timestamps.length < RATE_LIMIT_MAX;
}

function recordRateLimit(siteSlug: string) {
  const map = readRateLimits();
  const timestamps = (map[siteSlug] ?? []).filter((ts) => Date.now() - ts < RATE_LIMIT_WINDOW_MS);
  timestamps.push(Date.now());
  map[siteSlug] = timestamps;
  writeRateLimits(map);
}

// --- Sync local entries to Supabase on auth ---

/**
 * Migrate local guestbook entries to Supabase after authentication.
 * Should be called from AuthCallback after successful login.
 */
export async function syncGuestbookEntriesToSupabase(): Promise<number> {
  if (!supabase) return 0;
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return 0;

  const map = readLocalMap();
  let synced = 0;

  for (const [slug, entries] of Object.entries(map)) {
    const localOnly = entries.filter((e) => e.metadata?.source === 'local' && e.status === 'local');
    for (const entry of localOnly) {
      const { error } = await supabase.from('sleepnet_guestbook_entries').insert({
        site_slug: slug,
        user_id: userData.user.id,
        alias: entry.alias,
        message: entry.message,
        actor_type: entry.actorType === 'anonymous_user' ? 'user' : entry.actorType,
        status: 'approved',
        metadata: { ...entry.metadata, source: 'synced_from_local', originalId: entry.id },
      });
      if (!error) {
        entry.status = 'approved';
        entry.metadata.source = 'supabase';
        synced++;
      }
    }
  }

  if (synced > 0) writeLocalMap(map);
  return synced;
}

export function getGuestbookModeForSiteType(siteType: string): SleepNetGuestbookMode {
  if (siteType === 'personal_homepage') return 'myspace';
  if (siteType === 'faction_turf') return 'sign_in_sheet';
  if (siteType === 'fake_restaurant') return 'complaints';
  if (siteType === 'object_archive') return 'witness_log';
  if (siteType === 'classified_board') return 'classified_replies';
  return 'complaints';
}

export function getGuestbookLabel(mode: SleepNetGuestbookMode) {
  const labels: Record<SleepNetGuestbookMode, string> = {
    myspace: 'Guestbook / Top 8 Damage',
    sign_in_sheet: 'Sign-In Sheet / Seen Near Turf',
    motel_register: 'Motel Register / Bad Pen',
    witness_log: 'Witness Log / Object Sighting',
    complaints: 'Complaint Book / No Refunds Implied',
    classified_replies: 'Classified Replies / Public Wall',
  };
  return labels[mode];
}

export function seededGuestbookEntry(input: {
  siteSlug: string;
  alias: string;
  message: string;
  timestampLabel?: string;
  actorType?: GuestbookActorType;
  agentSlug?: string;
  pageType?: string;
}): SleepNetGuestbookEntry {
  return {
    id: `seed-${normalizeSlug(input.siteSlug)}-${normalizeSlug(input.alias)}-${normalizeSlug(input.message).slice(0, 16)}`,
    siteSlug: normalizeSlug(input.siteSlug),
    alias: input.alias,
    message: input.message,
    actorType: input.actorType ?? (input.agentSlug ? 'agent' : 'seeded_npc'),
    status: 'approved',
    createdAt: input.timestampLabel ?? 'seeded',
    metadata: {
      source: 'seed',
      agentSlug: input.agentSlug,
      pageType: input.pageType,
    },
  };
}

export function getLocalGuestbookEntries(siteSlug: string) {
  const normalized = normalizeSlug(siteSlug);
  return readLocalMap()[normalized] ?? [];
}

export function addLocalGuestbookEntry(siteSlug: string, entry: SleepNetGuestbookEntry) {
  const normalized = normalizeSlug(siteSlug);
  const map = readLocalMap();
  const current = map[normalized] ?? [];
  map[normalized] = [entry, ...current].slice(0, 50);
  writeLocalMap(map);
  return entry;
}

export async function getGuestbookEntries(siteSlug: string) {
  const normalized = normalizeSlug(siteSlug);
  const local = getLocalGuestbookEntries(normalized);

  if (!supabase) return local;

  const { data, error } = await supabase
    .from('sleepnet_guestbook_entries')
    .select('*')
    .eq('site_slug', normalized)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !data?.length) return local;

  const remote = data.map((entry) => ({
    id: entry.id,
    siteSlug: entry.site_slug,
    userId: entry.user_id,
    alias: entry.alias,
    message: entry.message,
    actorType: entry.actor_type,
    status: entry.status,
    createdAt: entry.created_at,
    metadata: entry.metadata ?? {},
  })) as SleepNetGuestbookEntry[];

  const localOnly = local.filter((localEntry) => !remote.some((remoteEntry) => remoteEntry.id === localEntry.id));
  return [...localOnly, ...remote];
}

export async function addGuestbookEntry(input: AddGuestbookEntryInput): Promise<{ source: 'local' | 'supabase'; entry: SleepNetGuestbookEntry }> {
  const normalized = normalizeSlug(input.siteSlug);
  const alias = input.alias.trim().slice(0, 32) || 'Anonymous';
  const message = input.message.trim().slice(0, 420);
  if (!message) throw new Error('Guestbook mark cannot be blank.');

  // Rate limit for non-agent entries
  if (input.actorType !== 'agent' && !checkRateLimit(normalized)) {
    throw new Error('The pen is cooling down. Wait a few minutes.');
  }
  if (input.actorType !== 'agent') {
    recordRateLimit(normalized);
  }

  if (supabase) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (user) {
      const payload = {
        site_slug: normalized,
        user_id: user.id,
        alias,
        message,
        actor_type: input.actorType ?? 'user',
        status: 'approved',
        metadata: {
          regularHandle: input.regularHandle,
          factionSlug: input.factionSlug,
          source: 'supabase',
          pageType: input.pageType,
        },
      };

      const { data, error } = await supabase
        .from('sleepnet_guestbook_entries')
        .insert(payload)
        .select('*')
        .single();

      if (!error && data) {
        return {
          source: 'supabase',
          entry: {
            id: data.id,
            siteSlug: data.site_slug,
            userId: data.user_id,
            alias: data.alias,
            message: data.message,
            actorType: data.actor_type,
            status: data.status,
            createdAt: data.created_at,
            metadata: data.metadata ?? {},
          } as SleepNetGuestbookEntry,
        };
      }
    }
  }

  const localEntry: SleepNetGuestbookEntry = {
    id: makeLocalId(normalized),
    siteSlug: normalized,
    alias,
    message,
    actorType: input.actorType ?? 'anonymous_user',
    status: 'local',
    createdAt: new Date().toISOString(),
    metadata: {
      regularHandle: input.regularHandle,
      factionSlug: input.factionSlug,
      source: 'local',
      pageType: input.pageType,
    },
  };

  return { source: 'local', entry: addLocalGuestbookEntry(normalized, localEntry) };
}

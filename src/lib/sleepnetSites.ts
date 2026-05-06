import { getSeedSleepNetSiteBySlug, searchSeedSleepNetSites } from '@/content/data/seedSleepNetSites';
import type { SleepNetComponent } from '@/lib/sleepnetComponents';
import { createFauxCompanyComponents } from '@/lib/sleepnetComponents';
import { generateSleepNetDraft } from '@/lib/sleepnetGenerators';
import { supabase } from '@/lib/supabaseClient';

export type SleepNetSection = {
  title: string;
  body: string;
};

export type SleepNetSite = {
  id?: string;
  user_id?: string | null;
  slug: string;
  title: string;
  site_type: string;
  neighborhood: string;
  tagline: string | null;
  description: string | null;
  theme: string;
  sections: SleepNetSection[];
  components?: SleepNetComponent[];
  related_object_slugs?: string[];
  related_agent_slug?: string | null;
  faction_affinity?: string[];
  design_level?: 1 | 2 | 3 | 4;
  weirdness_level?: number;
  reality_status?: string;
  canonical_weight?: number;
  stuff_shelf_enabled?: boolean;
  guestbook_enabled?: boolean;
  gallery_enabled?: boolean;
  jukebox_enabled?: boolean;
  search_text?: string | null;
  status: 'draft' | 'published' | 'hidden';
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
};

export type SleepNetMutationResult =
  | { source: 'supabase'; site?: SleepNetSite; removed?: true }
  | { source: 'local'; site?: SleepNetSite; removed?: true }
  | { source: 'none'; reason: string };

export const LOCAL_SLEEPNET_DRAFT_KEY = 'breakroom.sleepnet-draft.v1';

export const SLEEPNET_NEIGHBORHOODS = [
  'corporate_ruins',
  'parking_lot_west',
  'motel_row',
  'object_district',
  'pool_hall_county',
  'classified_alley',
  'the_wrong_department',
  'the_food_court_that_closed',
] as const;

export const SLEEPNET_PROMPT_EXAMPLES = [
  'A burger place that only opens after 1 AM and seems run by an AI that thinks burgers are legal documents.',
  'A motel office that rents rooms to people who lost something in the parking lot.',
  'A fake towing company operated by a white dog sleeping under a glass counter.',
  'A pool hall law firm that settles disputes with trick shots and stamped receipts.',
  'A printer repair company that only fixes haunted fax machines and employee portals.',
];

export const SLEEPNET_NEIGHBORHOOD_LABELS: Record<string, string> = {
  corporate_ruins: 'Corporate Ruins',
  parking_lot_west: 'Parking Lot West',
  motel_row: 'Motel Row',
  object_district: 'Object District',
  pool_hall_county: 'Pool Hall County',
  classified_alley: 'Classified Alley',
  the_wrong_department: 'The Wrong Department',
  the_food_court_that_closed: 'The Food Court That Closed',
};

export function labelSleepNetValue(value: string) {
  return SLEEPNET_NEIGHBORHOOD_LABELS[value] ?? value.replaceAll('_', ' ');
}

export function normalizeSleepNetSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function makeSleepNetUrl(slug: string) {
  return `/sleepnet/${normalizeSleepNetSlug(slug)}`;
}

export function makeSleepNetProtocolUrl(slug: string) {
  return `sleepnet://${normalizeSleepNetSlug(slug)}`;
}

export function buildSearchText(site: Pick<SleepNetSite, 'title' | 'tagline' | 'description' | 'site_type' | 'neighborhood'>) {
  return [site.title, site.tagline, site.description, site.site_type, site.neighborhood]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function ensureSleepNetComponents(site: SleepNetSite): SleepNetSite {
  if (site.components?.length) return site;
  return {
    ...site,
    components: createFauxCompanyComponents(site.title),
    related_object_slugs: site.related_object_slugs ?? ['dial-tone-slip', 'receipt-with-no-total', 'wrong-employee-badge'],
    related_agent_slug: site.related_agent_slug ?? 'night-manager',
    faction_affinity: site.faction_affinity ?? [],
    weirdness_level: site.weirdness_level ?? 3,
    reality_status: site.reality_status ?? 'indexed_noise',
    canonical_weight: site.canonical_weight ?? 0,
    stuff_shelf_enabled: site.stuff_shelf_enabled ?? true,
    guestbook_enabled: site.guestbook_enabled ?? true,
    gallery_enabled: site.gallery_enabled ?? true,
    jukebox_enabled: site.jukebox_enabled ?? true,
  };
}

export function generateFauxCompanyDraft(seed: string): SleepNetSite {
  return generateSleepNetDraft({ prompt: seed, siteType: 'faux_company' });
}

export function loadLocalSleepNetDraft() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_SLEEPNET_DRAFT_KEY);
    return raw ? ensureSleepNetComponents(JSON.parse(raw) as SleepNetSite) : null;
  } catch {
    return null;
  }
}

export function saveLocalSleepNetDraft(site: SleepNetSite) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCAL_SLEEPNET_DRAFT_KEY, JSON.stringify(ensureSleepNetComponents(site)));
}

export function clearLocalSleepNetDraft() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(LOCAL_SLEEPNET_DRAFT_KEY);
}

function updateLocalSleepNetSiteStatus(slug: string, status: 'draft' | 'published' | 'hidden'): SleepNetMutationResult {
  const normalized = normalizeSleepNetSlug(slug);
  const local = loadLocalSleepNetDraft();
  if (!local || local.slug !== normalized) return { source: 'none', reason: 'No matching local SleepNet draft found.' };

  const next = ensureSleepNetComponents({ ...local, status, is_public: status === 'published' });
  saveLocalSleepNetDraft(next);
  return { source: 'local', site: next };
}

function removeLocalSleepNetSite(slug: string): SleepNetMutationResult {
  const normalized = normalizeSleepNetSlug(slug);
  const local = loadLocalSleepNetDraft();
  if (!local || local.slug !== normalized) return { source: 'none', reason: 'No matching local SleepNet draft found.' };

  clearLocalSleepNetDraft();
  return { source: 'local', removed: true };
}

export async function getMySleepNetSiteBySlug(slug: string) {
  const normalized = normalizeSleepNetSlug(slug);
  const local = loadLocalSleepNetDraft();

  if (!supabase) return local?.slug === normalized ? local : null;

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return local?.slug === normalized ? local : null;

  const { data, error } = await supabase
    .from('sleepnet_sites')
    .select('*')
    .eq('user_id', user.id)
    .eq('slug', normalized)
    .maybeSingle();

  if (error || !data) return local?.slug === normalized ? local : null;
  return ensureSleepNetComponents(data as SleepNetSite);
}

export async function saveMySleepNetSite(site: SleepNetSite): Promise<SleepNetMutationResult> {
  const normalized = ensureSleepNetComponents({
    ...site,
    slug: normalizeSleepNetSlug(site.slug || site.title),
    search_text: buildSearchText(site),
  });

  saveLocalSleepNetDraft(normalized);

  if (!supabase) return { source: 'local', site: normalized };

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return { source: 'local', site: normalized };

  const payload = {
    ...normalized,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from('sleepnet_sites')
    .upsert(payload, { onConflict: 'slug' })
    .select('*')
    .single();

  if (error) throw error;
  return { source: 'supabase', site: ensureSleepNetComponents(data as SleepNetSite) };
}

export async function getMySleepNetSites() {
  const local = loadLocalSleepNetDraft();

  if (!supabase) return local ? [local] : [];

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return local ? [local] : [];

  const { data, error } = await supabase
    .from('sleepnet_sites')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error || !data?.length) return local ? [local] : [];
  return (data as SleepNetSite[]).map(ensureSleepNetComponents);
}

export async function updateMySleepNetSiteStatus(slug: string, status: 'draft' | 'published' | 'hidden'): Promise<SleepNetMutationResult> {
  const normalized = normalizeSleepNetSlug(slug);

  if (!supabase) return updateLocalSleepNetSiteStatus(normalized, status);

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return updateLocalSleepNetSiteStatus(normalized, status);

  const { data, error } = await supabase
    .from('sleepnet_sites')
    .update({ status, is_public: status === 'published' })
    .eq('user_id', user.id)
    .eq('slug', normalized)
    .select('*')
    .single();

  if (error) throw error;
  return { source: 'supabase', site: ensureSleepNetComponents(data as SleepNetSite) };
}

export async function removeMySleepNetSite(slug: string): Promise<SleepNetMutationResult> {
  const normalized = normalizeSleepNetSlug(slug);

  if (!supabase) return removeLocalSleepNetSite(normalized);

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return removeLocalSleepNetSite(normalized);

  const { error } = await supabase
    .from('sleepnet_sites')
    .delete()
    .eq('user_id', user.id)
    .eq('slug', normalized);

  if (error) throw error;
  return { source: 'supabase', removed: true };
}

export async function searchSleepNetSites(query = '') {
  const normalizedQuery = query.trim().toLowerCase();
  const seedResults = searchSeedSleepNetSites(normalizedQuery).map(ensureSleepNetComponents);

  if (!supabase) {
    const local = loadLocalSleepNetDraft();
    const localResults = local && (!normalizedQuery || buildSearchText(local).includes(normalizedQuery)) ? [local] : [];
    return [...seedResults, ...localResults];
  }

  let request = supabase
    .from('sleepnet_sites')
    .select('*')
    .eq('is_public', true)
    .eq('status', 'published')
    .order('updated_at', { ascending: false })
    .limit(40);

  if (normalizedQuery) {
    request = request.ilike('search_text', `%${normalizedQuery}%`);
  }

  const { data, error } = await request;
  if (error || !data?.length) return seedResults;
  const remoteResults = (data as SleepNetSite[])
    .filter((site) => !seedResults.some((seed) => seed.slug === site.slug))
    .map(ensureSleepNetComponents);
  return [...seedResults, ...remoteResults];
}

export async function getSleepNetSiteBySlug(slug: string) {
  const normalized = normalizeSleepNetSlug(slug);
  const seedSite = getSeedSleepNetSiteBySlug(normalized);
  if (seedSite) return ensureSleepNetComponents(seedSite);

  if (!supabase) {
    const local = loadLocalSleepNetDraft();
    return local?.slug === normalized ? local : null;
  }

  const { data, error } = await supabase
    .from('sleepnet_sites')
    .select('*')
    .eq('slug', normalized)
    .eq('is_public', true)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !data) return null;
  return ensureSleepNetComponents(data as SleepNetSite);
}

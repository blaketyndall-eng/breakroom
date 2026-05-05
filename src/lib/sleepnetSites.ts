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

export function generateFauxCompanyDraft(seed: string): SleepNetSite {
  const clean = seed.trim() || 'A fake company that should not have survived the night shift.';
  const title = clean
    .replace(/^a\s+/i, '')
    .split(/[,.]/)[0]
    .split(' ')
    .slice(0, 5)
    .join(' ') || 'Still Open Company';
  const slug = normalizeSleepNetSlug(title || 'still-open-company');

  const site: SleepNetSite = {
    slug,
    title,
    site_type: 'faux_company',
    neighborhood: 'corporate_ruins',
    tagline: 'Serving whoever is still awake.',
    description: clean,
    theme: 'two_thousand_three_local_business',
    status: 'draft',
    is_public: false,
    sections: [
      {
        title: 'What We Claim To Do',
        body: `${title} provides dependable after-hours services for customers who missed every normal option. We are open because nobody filed the form to close us.`,
      },
      {
        title: 'What We Actually Do',
        body: 'We answer the phone, move objects between rooms, misread receipts, and keep the lights on long enough for the page to load.',
      },
      {
        title: 'Services',
        body: 'Late counter advice. Object verification. Suspicious delivery acceptance. Emergency coffee. Documents stamped for emotional reasons.',
      },
      {
        title: 'Legal Notice',
        body: 'All claims are provisional. Any resemblance to a functioning business is a scheduling error.',
      },
    ],
  };

  return { ...site, search_text: buildSearchText(site) };
}

export function loadLocalSleepNetDraft() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_SLEEPNET_DRAFT_KEY);
    return raw ? JSON.parse(raw) as SleepNetSite : null;
  } catch {
    return null;
  }
}

export function saveLocalSleepNetDraft(site: SleepNetSite) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCAL_SLEEPNET_DRAFT_KEY, JSON.stringify(site));
}

export function clearLocalSleepNetDraft() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(LOCAL_SLEEPNET_DRAFT_KEY);
}

function updateLocalSleepNetSiteStatus(slug: string, status: 'draft' | 'published' | 'hidden'): SleepNetMutationResult {
  const normalized = normalizeSleepNetSlug(slug);
  const local = loadLocalSleepNetDraft();
  if (!local || local.slug !== normalized) return { source: 'none', reason: 'No matching local SleepNet draft found.' };

  const next = { ...local, status, is_public: status === 'published' };
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
  return data as SleepNetSite;
}

export async function saveMySleepNetSite(site: SleepNetSite): Promise<SleepNetMutationResult> {
  const normalized = {
    ...site,
    slug: normalizeSleepNetSlug(site.slug || site.title),
    search_text: buildSearchText(site),
  };

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
  return { source: 'supabase', site: data as SleepNetSite };
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
  return data as SleepNetSite[];
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
  return { source: 'supabase', site: data as SleepNetSite };
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

  if (!supabase) {
    const local = loadLocalSleepNetDraft();
    if (!local) return [] as SleepNetSite[];
    if (!normalizedQuery) return [local];
    return buildSearchText(local).includes(normalizedQuery) ? [local] : [];
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
  if (error || !data?.length) return [] as SleepNetSite[];
  return data as SleepNetSite[];
}

export async function getSleepNetSiteBySlug(slug: string) {
  const normalized = normalizeSleepNetSlug(slug);

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
  return data as SleepNetSite;
}

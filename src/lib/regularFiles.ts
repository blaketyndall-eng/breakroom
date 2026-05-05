import { supabase } from '@/lib/supabaseClient';
import { getLocalArtifactSlugs } from '@/lib/secrets';

export type RegularFile = {
  id?: string;
  user_id?: string | null;
  handle: string;
  display_name: string;
  fake_title: string | null;
  bio: string | null;
  away_message: string | null;
  favorite_light: string | null;
  assigned_object: string | null;
  turf: string | null;
  theme: string;
  top_links: string[];
  pinned_artifacts: string[];
  is_public: boolean;
};

export const LOCAL_REGULAR_FILE_KEY = 'breakroom.regular-file.v1';

export const REGULAR_THEMES = [
  'corrupted_employee_portal',
  'pool_hall_personal_page',
  'motel_shrine',
  'bathroom_wall_lite',
  'two_thousand_three_local_webpage',
] as const;

export function normalizeHandle(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);
}

export function makeDefaultRegularFile(seed = 'regular'): RegularFile {
  const handle = normalizeHandle(seed) || `regular-${Math.floor(1000 + Math.random() * 8999)}`;
  return {
    handle,
    display_name: handle,
    fake_title: 'Lost Object Verification',
    bio: 'Clocked out and still somehow on file.',
    away_message: 'If the phone rings, do not answer it. It already knows.',
    favorite_light: 'dashboard green',
    assigned_object: 'motel key with no room number',
    turf: null,
    theme: 'corrupted_employee_portal',
    top_links: ['/after-hours', '/phone', '/artifacts'],
    pinned_artifacts: getLocalArtifactSlugs().slice(0, 4),
    is_public: true,
  };
}

export function loadLocalRegularFile() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_REGULAR_FILE_KEY);
    return raw ? JSON.parse(raw) as RegularFile : null;
  } catch {
    return null;
  }
}

export function saveLocalRegularFile(file: RegularFile) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCAL_REGULAR_FILE_KEY, JSON.stringify(file));
}

export async function getMyRegularFile() {
  const local = loadLocalRegularFile();

  if (!supabase) return local;

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return local;

  const { data, error } = await supabase
    .from('regular_pages')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data) return local;

  const remote = data as RegularFile;
  saveLocalRegularFile(remote);
  return remote;
}

export async function saveMyRegularFile(file: RegularFile) {
  const normalized = {
    ...file,
    handle: normalizeHandle(file.handle),
    top_links: file.top_links ?? [],
    pinned_artifacts: file.pinned_artifacts ?? [],
  };

  saveLocalRegularFile(normalized);

  if (!supabase) return { source: 'local' as const, file: normalized };

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return { source: 'local' as const, file: normalized };

  const payload = {
    ...normalized,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from('regular_pages')
    .upsert(payload, { onConflict: 'user_id' })
    .select('*')
    .single();

  if (error) throw error;

  const remote = data as RegularFile;
  saveLocalRegularFile(remote);
  return { source: 'supabase' as const, file: remote };
}

export async function getRegularFileByHandle(handle: string) {
  const normalized = normalizeHandle(handle);

  if (!supabase) {
    const local = loadLocalRegularFile();
    return local?.handle === normalized ? local : null;
  }

  const { data, error } = await supabase
    .from('regular_pages')
    .select('*')
    .eq('handle', normalized)
    .eq('is_public', true)
    .maybeSingle();

  if (error || !data) return null;
  return data as RegularFile;
}

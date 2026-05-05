import { supabase } from '@/lib/supabaseClient';
import { getArtifactBySlug } from '@/lib/artifacts';

export type SecretUnlockDefinition = {
  slug: string;
  trigger: string;
  artifactSlug: string;
  artifactType: string;
  title: string;
  notes: string;
};

export const SECRET_UNLOCKS: SecretUnlockDefinition[] = [
  {
    slug: 'clocked-out-room-entry',
    trigger: 'visit:/after-hours',
    artifactSlug: 'after-hours-badge',
    artifactType: 'badge',
    title: 'After Hours Badge',
    notes: 'Issued after the supervisor connection went dark.',
  },
  {
    slug: 'dial-tone-evidence',
    trigger: 'visit:/phone',
    artifactSlug: 'dial-tone-slip',
    artifactType: 'transmission_slip',
    title: 'Dial Tone Slip',
    notes: 'A receipt from a phone nobody owns.',
  },
  {
    slug: 'night-transmission',
    trigger: 'visit:/radio',
    artifactSlug: 'radio-147-station-id',
    artifactType: 'radio_log',
    title: 'Radio 1:47 Station ID',
    notes: 'Dead air with your fingerprints on it.',
  },
  {
    slug: 'wall-witness',
    trigger: 'visit:/sign-the-wall',
    artifactSlug: 'bathroom-wall-witness-card',
    artifactType: 'wall_card',
    title: 'Bathroom Wall Witness Card',
    notes: 'Wood panel memory. Marker smell not included.',
  },
  {
    slug: 'left-a-mark',
    trigger: 'submit:wall_post',
    artifactSlug: 'pending-marker-receipt',
    artifactType: 'receipt',
    title: 'Pending Marker Receipt',
    notes: 'Visible locally. Waiting for the back office to blink.',
  },
  {
    slug: 'object-file-opened',
    trigger: 'visit:/lost-found/[slug]',
    artifactSlug: 'object-evidence-card',
    artifactType: 'evidence_card',
    title: 'Object Evidence Card',
    notes: 'Filed by the drawer, not by staff.',
  },
  {
    slug: 'issued-goods-file-opened',
    trigger: 'visit:/rack/[slug]',
    artifactSlug: 'issued-goods-request',
    artifactType: 'file_request',
    title: 'Issued Goods Request',
    notes: 'Not a cart. Not a sale. A file request.',
  },
];

const LOCAL_ARTIFACT_KEY = 'breakroom.artifacts.v1';
const LOCAL_SECRET_KEY = 'breakroom.secrets.v1';

function readLocalList(key: string) {
  if (typeof window === 'undefined') return [] as string[];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as string[] : [];
  } catch {
    return [] as string[];
  }
}

function writeLocalList(key: string, values: string[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(Array.from(new Set(values))));
}

export function getLocalArtifactSlugs() {
  return readLocalList(LOCAL_ARTIFACT_KEY);
}

export function getLocalSecretSlugs() {
  return readLocalList(LOCAL_SECRET_KEY);
}

export function saveLocalArtifact(slug: string) {
  writeLocalList(LOCAL_ARTIFACT_KEY, [...getLocalArtifactSlugs(), slug]);
}

export function saveLocalSecret(slug: string) {
  writeLocalList(LOCAL_SECRET_KEY, [...getLocalSecretSlugs(), slug]);
}

export async function trackSiteEvent(eventName: string, path: string, payload: Record<string, unknown> = {}) {
  if (!supabase) return;

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id ?? null;

  await supabase.from('site_events').insert({
    user_id: userId,
    event_name: eventName,
    path,
    payload,
  });
}

async function persistArtifact(definition: SecretUnlockDefinition) {
  if (!supabase) return;

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) return;

  await supabase.from('saved_artifacts').insert({
    user_id: userId,
    artifact_type: definition.artifactType,
    artifact_slug: definition.artifactSlug,
    notes: definition.notes,
  });
}

export async function unlockByTrigger(trigger: string, path: string, payload: Record<string, unknown> = {}) {
  const definition = SECRET_UNLOCKS.find((secret) => secret.trigger === trigger);
  if (!definition) return null;

  const alreadyUnlocked = getLocalSecretSlugs().includes(definition.slug);
  saveLocalSecret(definition.slug);
  saveLocalArtifact(definition.artifactSlug);

  await trackSiteEvent('secret_triggered', path, {
    trigger,
    secret_slug: definition.slug,
    artifact_slug: definition.artifactSlug,
    already_unlocked: alreadyUnlocked,
    ...payload,
  });

  if (!alreadyUnlocked) {
    await persistArtifact(definition);
  }

  return getArtifactBySlug(definition.artifactSlug);
}

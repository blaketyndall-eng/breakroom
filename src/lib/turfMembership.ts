import { supabase } from '@/lib/supabaseClient';
import { getFactionSignalTotal } from '@/lib/factionDrift';
import { getFactionBySlug } from '@/content/data/factions';

export type JoinMethod = 'ritual' | 'drift_promotion' | 'admin';

export type TurfMembership = {
  id: string;
  userId: string;
  factionSlug: string;
  joinedAt: string;
  joinMethod: JoinMethod;
  driftScoreAtJoin: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export const LOCAL_TURF_MEMBERSHIP_KEY = 'breakroom.turf-membership.v1';
export const TURF_JOINED_EVENT = 'breakroom:turf-joined';

// Drift threshold required before join ritual appears
export const DRIFT_JOIN_THRESHOLD = 8;

// --- Local storage helpers ---

function readLocalMembership(): TurfMembership | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_TURF_MEMBERSHIP_KEY);
    return raw ? JSON.parse(raw) as TurfMembership : null;
  } catch {
    return null;
  }
}

function writeLocalMembership(membership: TurfMembership | null) {
  if (typeof window === 'undefined') return;
  if (membership) {
    window.localStorage.setItem(LOCAL_TURF_MEMBERSHIP_KEY, JSON.stringify(membership));
  } else {
    window.localStorage.removeItem(LOCAL_TURF_MEMBERSHIP_KEY);
  }
  window.dispatchEvent(new CustomEvent(TURF_JOINED_EVENT, { detail: { membership } }));
}

// --- Public API ---

/**
 * Get the user's active turf membership.
 * Checks Supabase first, falls back to localStorage.
 */
export async function getActiveMembership(): Promise<TurfMembership | null> {
  if (supabase) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (user) {
      const { data, error } = await supabase
        .from('turf_memberships')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          userId: data.user_id,
          factionSlug: data.faction_slug,
          joinedAt: data.joined_at,
          joinMethod: data.join_method,
          driftScoreAtJoin: data.drift_score_at_join,
          isActive: data.is_active,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    }
  }

  return readLocalMembership();
}

/**
 * Join a faction via the ritual.
 * Creates membership in Supabase (if available) and localStorage.
 */
export async function joinTurf(factionSlug: string): Promise<TurfMembership | null> {
  const faction = getFactionBySlug(factionSlug);
  if (!faction) return null;
  if (faction.status !== 'active') return null;

  const driftScore = getFactionSignalTotal(factionSlug);
  const now = new Date().toISOString();

  const membership: TurfMembership = {
    id: `local-${factionSlug}-${Date.now().toString(36)}`,
    userId: '',
    factionSlug,
    joinedAt: now,
    joinMethod: 'ritual',
    driftScoreAtJoin: driftScore,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  if (supabase) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (user) {
      // Deactivate any existing membership first
      await supabase
        .from('turf_memberships')
        .update({ is_active: false, updated_at: now })
        .eq('user_id', user.id)
        .eq('is_active', true);

      const { data, error } = await supabase
        .from('turf_memberships')
        .insert({
          user_id: user.id,
          faction_slug: factionSlug,
          join_method: 'ritual',
          drift_score_at_join: driftScore,
          is_active: true,
        })
        .select('*')
        .single();

      if (!error && data) {
        const persisted: TurfMembership = {
          id: data.id,
          userId: data.user_id,
          factionSlug: data.faction_slug,
          joinedAt: data.joined_at,
          joinMethod: data.join_method,
          driftScoreAtJoin: data.drift_score_at_join,
          isActive: data.is_active,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        writeLocalMembership(persisted);
        return persisted;
      }
    }
  }

  // Local-only fallback
  writeLocalMembership(membership);
  return membership;
}

/**
 * Check if user has enough drift to join a faction.
 */
export function canJoinTurf(factionSlug: string): boolean {
  return getFactionSignalTotal(factionSlug) >= DRIFT_JOIN_THRESHOLD;
}

/**
 * Check if user is currently a member of a specific faction.
 */
export function isLocalMemberOf(factionSlug: string): boolean {
  const local = readLocalMembership();
  return local?.factionSlug === factionSlug && local?.isActive === true;
}

/**
 * Get local membership synchronously (for UI that can't await).
 */
export function getLocalMembership(): TurfMembership | null {
  return readLocalMembership();
}

/**
 * Get faction-specific join ritual text.
 */
export function getJoinRitualText(factionSlug: string): { prompt: string; confirm: string; acknowledged: string } {
  const texts: Record<string, { prompt: string; confirm: string; acknowledged: string }> = {
    'the-players': {
      prompt: 'The Players don\'t recruit. They recognize.',
      confirm: 'Stand with The Players',
      acknowledged: 'Your name is near the table now. The chalk knows.',
    },
    'lot-racers': {
      prompt: 'Your file picked up exhaust. The lot remembers.',
      confirm: 'Stand with Lot Racers',
      acknowledged: 'Your plate is written. The timing slip has your name.',
    },
    'night-drinkers': {
      prompt: 'A stool has your shape. The napkin has your story.',
      confirm: 'Stand with Night Drinkers',
      acknowledged: 'Counted. The matchbook won\'t forget.',
    },
    'the-smokers': {
      prompt: 'Fence talk traveled. Your name came up outside.',
      confirm: 'Stand with The Smokers',
      acknowledged: 'Filed under the green bulb. The fence knows.',
    },
    cowboys: {
      prompt: 'Dust on your shoes. The cooler knows who you are.',
      confirm: 'Stand with Cowboys',
      acknowledged: 'Hat noticed. The cooler opened for you.',
    },
  };

  return texts[factionSlug] ?? {
    prompt: 'The room noticed where you stand.',
    confirm: `Stand with this faction`,
    acknowledged: 'This goes in your file.',
  };
}

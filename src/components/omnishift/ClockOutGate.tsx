import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { loadLocalProfile, markLocalClockedOut, saveLocalProfile } from '@/lib/localSession';
import WorldTransition from './WorldTransition';

/**
 * ClockOutGate
 * --------------------------------------------------------------------------
 * The between-worlds moment. Marks shift state as clocked-out (local +
 * Supabase, best-effort) and immediately fires a single VHS title-card
 * transition that carries the user to /void.
 *
 * No terminal log, no steps animation, no Enter After Hours button —
 * clocking out IS the transition.
 */
export default function ClockOutGate() {
  // Persist clock-out state silently on mount. Failures do not block the
  // transition: local state is the source of truth, Supabase is a mirror.
  useEffect(() => {
    markLocalClockedOut();
    const local = loadLocalProfile();
    const clockedOutAt = local?.clocked_out_at ?? new Date().toISOString();
    if (local) {
      saveLocalProfile({ ...local, shift_status: 'clocked_out', clocked_out_at: clockedOutAt });
    }

    if (!supabase) return;
    void (async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;
        await supabase
          .from('user_profiles')
          .update({ shift_status: 'clocked_out', clocked_out_at: clockedOutAt })
          .eq('id', userData.user.id);
      } catch {
        /* silent — local state already recorded the clock-out */
      }
    })();
  }, []);

  const handleComplete = useCallback(() => {
    window.location.href = '/void';
  }, []);

  return <WorldTransition cardCount={1} onComplete={handleComplete} />;
}

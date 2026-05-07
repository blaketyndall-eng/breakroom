import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { loadLocalProfile, markLocalClockedOut, saveLocalProfile } from '@/lib/localSession';
import WorldTransition from './WorldTransition';

const steps = [
  'Ending approved session...',
  'Supervisor connection lost...',
  'Clock discrepancy detected: 1:47 AM',
  'Updating shift status...',
  'Breakroom override accepted...',
  'CLOCKED OUT',
];

/**
 * ClockOutGate
 * --------------------------------------------------------------------------
 * The between-worlds moment. Steps animate to "CLOCKED OUT", then after a
 * short beat (so the user actually reads the punchline) the WorldTransition
 * fires automatically. There's no "Enter After Hours" button — clocking out
 * IS the transition. Destination: /void (Void Signal homepage).
 */
export default function ClockOutGate() {
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState('');
  const [showTransition, setShowTransition] = useState(false);

  // Step animator
  useEffect(() => {
    if (idx >= steps.length - 1) return;
    const t = setTimeout(() => setIdx((n) => n + 1), 850);
    return () => clearTimeout(t);
  }, [idx]);

  // Persist clock-out state to localStorage + Supabase the moment we hit the
  // final CLOCKED OUT step. Status text is best-effort; failure does not
  // block the transition.
  useEffect(() => {
    async function clockOut() {
      if (idx !== steps.length - 1) return;

      markLocalClockedOut();
      const local = loadLocalProfile();
      const clockedOutAt = local?.clocked_out_at ?? new Date().toISOString();
      if (local) saveLocalProfile({ ...local, shift_status: 'clocked_out', clocked_out_at: clockedOutAt });

      if (!supabase) {
        setStatus('Local clock-out recorded. The company system pretends not to notice.');
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setStatus('Clock-out recorded locally. Sign in to save it to the company file.');
        return;
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({ shift_status: 'clocked_out', clocked_out_at: clockedOutAt })
        .eq('id', userData.user.id);

      setStatus(error ? error.message : 'Clock-out recorded in employee file. After Hours access granted.');
    }
    clockOut().catch((error) => setStatus(error instanceof Error ? error.message : 'Clock-out failed quietly.'));
  }, [idx]);

  // Auto-fire the world transition once CLOCKED OUT lands on screen.
  // The 1.2s beat lets the user read the punchline before VHS cards take over.
  useEffect(() => {
    if (idx !== steps.length - 1) return;
    const t = setTimeout(() => setShowTransition(true), 1200);
    return () => clearTimeout(t);
  }, [idx]);

  const handleTransitionComplete = useCallback(() => {
    window.location.href = '/void';
  }, []);

  return (
    <>
      {showTransition && (
        <WorldTransition cardCount={4} onComplete={handleTransitionComplete} />
      )}
      <div className="old-shell" style={{ maxWidth: 760, margin: '80px auto', background: '#050605', color: '#33ff66' }}>
        <div className="old-header" style={{ background: '#111', color: '#33ff66' }}>Clock Out Gate</div>
        <div className="old-body" style={{ fontFamily: 'var(--type-mono)', fontSize: 18, minHeight: 220 }}>
          {steps.slice(0, idx + 1).map((step) => <p key={step} className="blink">{step}</p>)}
          {status && <p>{status}</p>}
          {idx === steps.length - 1 && !showTransition && (
            <p style={{ opacity: 0.7, fontSize: 14, marginTop: 24 }}>
              The room is already changing. Stand still.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

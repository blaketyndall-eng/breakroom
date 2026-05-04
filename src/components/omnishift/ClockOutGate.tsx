import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { loadLocalProfile, markLocalClockedOut, saveLocalProfile } from '@/lib/localSession';

const steps = [
  'Ending approved session...',
  'Supervisor connection lost...',
  'Clock discrepancy detected: 1:47 AM',
  'Updating shift status...',
  'Breakroom override accepted...',
  'CLOCKED OUT'
];

export default function ClockOutGate() {
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (idx >= steps.length - 1) return;
    const t = setTimeout(() => setIdx((n) => n + 1), 850);
    return () => clearTimeout(t);
  }, [idx]);

  useEffect(() => {
    async function clockOut() {
      if (idx !== steps.length - 1) return;
      markLocalClockedOut();
      const local = loadLocalProfile();
      if (local) saveLocalProfile({ ...local, shift_status: 'clocked_out' });

      if (!supabase) {
        setStatus('Local clock-out recorded. Supabase not configured yet.');
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setStatus('Clock-out recorded locally. Sign in to save it to the company file.');
        return;
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({ shift_status: 'clocked_out', clocked_out_at: new Date().toISOString() })
        .eq('id', userData.user.id);

      setStatus(error ? error.message : 'Clock-out recorded in employee file.');
    }
    clockOut().catch((error) => setStatus(error instanceof Error ? error.message : 'Clock-out failed quietly.'));
  }, [idx]);

  return (
    <div className="old-shell" style={{ maxWidth: 760, margin: '80px auto', background: '#050605', color: '#33ff66' }}>
      <div className="old-header" style={{ background: '#111', color: '#33ff66' }}>Clock Out Gate</div>
      <div className="old-body" style={{ fontFamily: 'var(--type-mono)', fontSize: 18, minHeight: 220 }}>
        {steps.slice(0, idx + 1).map((step) => <p key={step} className="blink">{step}</p>)}
        {status && <p>{status}</p>}
        {idx === steps.length - 1 && <p><a className="old-button" href="/after-hours">Enter After Hours</a></p>}
      </div>
    </div>
  );
}

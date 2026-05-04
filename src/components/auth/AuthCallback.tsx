import { useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { generateEmployee } from '@/lib/generators/employeeAssignment';
import { saveLocalProfile, type LocalEmployeeProfile } from '@/lib/localSession';

type CallbackState = 'checking' | 'ready' | 'error';

function safeNext(raw: string | null) {
  if (!raw || !raw.startsWith('/')) return '/portal';
  if (raw.startsWith('//')) return '/portal';
  return raw;
}

function buildProfile(email: string, userId: string): LocalEmployeeProfile {
  const generated = generateEmployee(email || userId);
  return {
    email,
    alias: email ? email.split('@')[0] : 'Unknown Employee',
    employee_id: generated.id,
    department: generated.department,
    role_name: generated.role,
    assigned_object_slug: generated.object,
    house_rule: generated.houseRule,
    uniform_recommendation_slug: generated.uniform,
    preferred_light: 'fluorescent, unfortunately',
    preferred_place: 'near the machine that still works',
    shift_status: 'on_shift',
  };
}

export default function AuthCallback() {
  const [state, setState] = useState<CallbackState>('checking');
  const [message, setMessage] = useState('Reading the badge from the wrong side of the glass.');

  const next = useMemo(() => {
    if (typeof window === 'undefined') return '/portal';
    return safeNext(new URLSearchParams(window.location.search).get('next'));
  }, []);

  useEffect(() => {
    async function finishCallback() {
      if (!isSupabaseConfigured || !supabase) {
        setState('error');
        setMessage('Supabase is not configured. The intake terminal is running in local preview mode.');
        return;
      }

      setMessage('Confirming session with OmniShift memory. The room is pretending this is normal.');
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const session = sessionData.session;
      if (!session?.user) {
        setState('error');
        setMessage('No active session was found. The link may be expired, already used, or intercepted by a vending machine.');
        return;
      }

      const user = session.user;
      const email = user.email ?? '';
      const { data: existing } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();

      if (existing) {
        saveLocalProfile({
          email: existing.email ?? email,
          alias: existing.alias ?? '',
          employee_id: existing.employee_id,
          department: existing.department,
          role_name: existing.role_name,
          assigned_object_slug: existing.assigned_object_slug,
          house_rule: existing.house_rule,
          uniform_recommendation_slug: existing.uniform_recommendation_slug,
          preferred_light: existing.preferred_light,
          preferred_place: existing.preferred_place,
          shift_status: existing.shift_status,
          clocked_out_at: existing.clocked_out_at,
        });
      } else {
        const profile = buildProfile(email, user.id);
        const { error } = await supabase.from('user_profiles').upsert({ id: user.id, ...profile });
        if (error) throw error;
        saveLocalProfile(profile);
      }

      setState('ready');
      setMessage('Employee file recovered. Redirecting before management notices.');
      window.setTimeout(() => {
        window.location.href = next;
      }, 900);
    }

    finishCallback().catch((error) => {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'The callback failed quietly.');
    });
  }, [next]);

  return (
    <section className="old-shell" style={{ maxWidth: 760, margin: '80px auto' }}>
      <div className="old-header">OmniShift callback desk / temporary badge window</div>
      <div className="old-body">
        <p className={state === 'error' ? 'memo-box' : 'red-stamp'}>{state.toUpperCase()}</p>
        <p style={{ fontSize: 22, fontFamily: 'var(--type-paper)' }}>{message}</p>
        {state === 'checking' && <p className="blink">Do not close this window. The window is already nervous.</p>}
        {state === 'ready' && <p><a className="old-button" href={next}>Continue to employee file</a></p>}
        {state === 'error' && <p><a className="old-button" href="/signup">Return to intake</a></p>}
      </div>
    </section>
  );
}

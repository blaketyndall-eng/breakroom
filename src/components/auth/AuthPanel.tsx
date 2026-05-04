import { useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { generateEmployee } from '@/lib/generators/employeeAssignment';
import { saveLocalProfile } from '@/lib/localSession';

type Mode = 'signin' | 'signup';

type AuthPanelProps = {
  redirectTo?: string;
  compact?: boolean;
};

const interviewQuestions = [
  'Where do you go when work follows you home?',
  'Pick a light: fluorescent, neon, dashboard, motel lamp.',
  'What did you find in your pocket after midnight?',
];

function toProfile(email: string, alias = '') {
  const generated = generateEmployee(email || alias || 'guest');
  return {
    email,
    alias,
    employee_id: generated.id,
    department: generated.department,
    role_name: generated.role,
    assigned_object_slug: generated.object,
    house_rule: generated.houseRule,
    uniform_recommendation_slug: generated.uniform,
    preferred_light: 'fluorescent, unfortunately',
    preferred_place: 'near the machine that still works',
    shift_status: 'on_shift' as const,
  };
}

export default function AuthPanel({ redirectTo = '/portal', compact = false }: AuthPanelProps) {
  const [mode, setMode] = useState<Mode>('signup');
  const [email, setEmail] = useState('');
  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  const redirectUrl = useMemo(() => {
    if (typeof window === 'undefined') return redirectTo;
    return `${window.location.origin}${redirectTo}`;
  }, [redirectTo]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSessionEmail(data.session?.user.email ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionEmail(session?.user.email ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function upsertProfile(targetEmail: string) {
    const profile = toProfile(targetEmail, alias || targetEmail.split('@')[0]);
    saveLocalProfile(profile);

    if (!supabase) return profile;
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return profile;

    const { error } = await supabase.from('user_profiles').upsert({
      id: user.id,
      email: targetEmail,
      alias: profile.alias,
      employee_id: profile.employee_id,
      department: profile.department,
      role_name: profile.role_name,
      assigned_object_slug: profile.assigned_object_slug,
      house_rule: profile.house_rule,
      uniform_recommendation_slug: profile.uniform_recommendation_slug,
      preferred_light: profile.preferred_light,
      preferred_place: profile.preferred_place,
      shift_status: 'on_shift',
    });
    if (error) throw error;
    return profile;
  }

  async function handlePasswordAuth() {
    setBusy(true);
    setStatus('');
    try {
      if (!email) throw new Error('Email is required. Even fake companies need somewhere to send the mistake.');

      if (!isSupabaseConfigured || !supabase) {
        await upsertProfile(email);
        setStatus('Local preview profile created. OmniShift has hired you without sufficient explanation.');
        window.setTimeout(() => (window.location.href = redirectTo), 650);
        return;
      }

      const response = mode === 'signup'
        ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectUrl } })
        : await supabase.auth.signInWithPassword({ email, password });

      if (response.error) throw response.error;
      await upsertProfile(email);
      setStatus(mode === 'signup' ? 'Check your email if confirmation is enabled. Employee file staged.' : 'Signed in. Employee file retrieved.');
      window.setTimeout(() => (window.location.href = redirectTo), 650);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Something went wrong. The room will not say what.');
    } finally {
      setBusy(false);
    }
  }

  async function handleMagicLink() {
    setBusy(true);
    setStatus('');
    try {
      if (!email) throw new Error('Email is required for magic link.');
      if (!supabase) {
        await upsertProfile(email);
        setStatus('Local preview profile created. Magic link skipped because Supabase is not configured.');
        window.setTimeout(() => (window.location.href = redirectTo), 650);
        return;
      }
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectUrl } });
      if (error) throw error;
      await upsertProfile(email);
      setStatus('Magic link sent. If it arrives after midnight, that is normal.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Magic link failed.');
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    setStatus('');
    try {
      if (!supabase) throw new Error('Google login needs Supabase env keys first. Use local preview signup for now.');
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectUrl } });
      if (error) throw error;
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Google sign-in failed.');
      setBusy(false);
    }
  }

  return (
    <section className="old-shell auth-panel">
      <div className="old-header">OmniShift intake terminal / not a job application</div>
      <div className="old-body">
        {sessionEmail && <p className="red-stamp">Signed in / {sessionEmail}</p>}
        {!compact && (
          <p>
            Fill out the interview or don’t. The AI will make a decision either way. The contract will look official enough.
          </p>
        )}
        <div className="auth-tabs">
          <button className={mode === 'signup' ? 'old-button active' : 'old-button'} onClick={() => setMode('signup')} type="button">Take Interview</button>
          <button className={mode === 'signin' ? 'old-button active' : 'old-button'} onClick={() => setMode('signin')} type="button">Return Employee</button>
        </div>
        <label>Email<br /><input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@afterhours.local" /></label>
        <label>Alias / optional<br /><input value={alias} onChange={(event) => setAlias(event.target.value)} placeholder="leave blank for assigned name" /></label>
        <label>Password<br /><input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="8+ characters if Supabase auth is live" /></label>
        {mode === 'signup' && !compact && interviewQuestions.map((question, index) => (
          <label key={question}>{question}<br />
            <input value={answers[index]} onChange={(event) => {
              const next = [...answers];
              next[index] = event.target.value;
              setAnswers(next);
            }} placeholder="answer, dodge, or lie" />
          </label>
        ))}
        <div className="auth-actions">
          <button className="old-button" onClick={handlePasswordAuth} disabled={busy} type="button">{busy ? 'Processing...' : mode === 'signup' ? 'Submit / Get Hired' : 'Sign In'}</button>
          <button className="old-button" onClick={handleMagicLink} disabled={busy} type="button">Magic Link</button>
          <button className="old-button" onClick={handleGoogle} disabled={busy} type="button">Google</button>
        </div>
        <p style={{ fontFamily: 'var(--type-mono)', fontSize: 12 }}>{isSupabaseConfigured ? 'Supabase configured.' : 'Local preview mode. Add Supabase env keys to make this real.'}</p>
        {status && <p className="memo-box">{status}</p>}
      </div>
    </section>
  );
}

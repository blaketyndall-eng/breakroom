import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { generateEmployee } from '@/lib/generators/employeeAssignment';
import { loadLocalProfile, saveLocalProfile, type LocalEmployeeProfile } from '@/lib/localSession';

type PortalState = 'loading' | 'ready' | 'signed_out';

function previewProfile(): LocalEmployeeProfile {
  const generated = generateEmployee('preview@omnishift.work');
  return {
    email: 'preview@omnishift.work',
    alias: 'Preview Employee',
    employee_id: generated.id,
    department: generated.department,
    role_name: generated.role,
    assigned_object_slug: generated.object,
    house_rule: generated.houseRule,
    uniform_recommendation_slug: generated.uniform,
    preferred_light: 'fluorescent, unfortunately',
    preferred_place: 'the corner table under the bad vent',
    shift_status: 'on_shift',
  };
}

export default function EmployeePortal() {
  const [state, setState] = useState<PortalState>('loading');
  const [profile, setProfile] = useState<LocalEmployeeProfile | null>(null);
  const [status, setStatus] = useState('');
  const [quizCompletedAt, setQuizCompletedAt] = useState<string | null>(null);

  async function loadProfile(options: { preferRemote?: boolean } = {}) {
    setStatus('');

    const local = loadLocalProfile();
    if (local && !options.preferRemote) {
      setProfile(local);
      setState('ready');
    }

    if (!supabase) {
      const preview = local ?? previewProfile();
      saveLocalProfile(preview);
      setProfile(preview);
      setState('ready');
      // Local mode: read quiz outcome from localStorage if present
      try {
        const localQuiz = window.localStorage.getItem('breakroom.quiz.employee_outcome');
        if (localQuiz) {
          const parsed = JSON.parse(localQuiz) as { finalized_at?: string } | null;
          setQuizCompletedAt(parsed?.finalized_at ?? null);
        }
      } catch {
        /* ignore */
      }
      setStatus(isSupabaseConfigured ? '' : 'Local preview mode. Supabase memory is not connected in this browser.');
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      if (local) {
        setProfile(local);
        setState('ready');
        setStatus('Showing local badge. Sign in to recover the official employee file.');
        return;
      }
      setState('signed_out');
      return;
    }

    const { data, error } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
    if (error || !data) {
      const generated = generateEmployee(user.email ?? user.id);
      const next: LocalEmployeeProfile = {
        email: user.email ?? '',
        alias: user.email?.split('@')[0] ?? 'Unknown Employee',
        employee_id: generated.id,
        department: generated.department,
        role_name: generated.role,
        assigned_object_slug: generated.object,
        house_rule: generated.houseRule,
        uniform_recommendation_slug: generated.uniform,
        preferred_light: 'fluorescent, unfortunately',
        preferred_place: 'near the exit that does not open',
        shift_status: 'on_shift',
      };
      await supabase.from('user_profiles').upsert({ id: user.id, ...next });
      saveLocalProfile(next);
      setProfile(next);
      setQuizCompletedAt(null); // Provisional — no quiz yet.
      setState('ready');
      setStatus('New employee file issued. HR denies involvement.');
      return;
    }

    const next: LocalEmployeeProfile = {
      email: data.email ?? user.email ?? '',
      alias: data.alias ?? '',
      employee_id: data.employee_id,
      department: data.department,
      role_name: data.role_name,
      assigned_object_slug: data.assigned_object_slug,
      house_rule: data.house_rule,
      uniform_recommendation_slug: data.uniform_recommendation_slug,
      preferred_light: data.preferred_light,
      preferred_place: data.preferred_place,
      shift_status: data.shift_status,
      clocked_out_at: data.clocked_out_at,
    };
    saveLocalProfile(next);
    setProfile(next);
    setQuizCompletedAt(data.quiz_completed_at ?? null);
    setState('ready');
    if (options.preferRemote) setStatus('Employee file refreshed from OmniShift memory.');
  }

  useEffect(() => {
    loadProfile().catch((error) => {
      setStatus(error instanceof Error ? error.message : 'Could not load employee file.');
      setState('signed_out');
    });
  }, []);

  async function signOut() {
    window.localStorage.removeItem('breakroom.omnishift.profile');
    window.localStorage.removeItem('breakroom.omnishift.shift');
    window.localStorage.removeItem('breakroom.afterhours.profile');
    window.localStorage.removeItem('breakroom.quiz.employee_outcome');
    if (supabase) await supabase.auth.signOut();
    window.location.href = '/breakroom';
  }

  if (state === 'loading') {
    return <div className="os-file-status">Retrieving employee file from OmniShift database. Do not look directly at the printer.</div>;
  }

  if (state === 'signed_out') {
    return (
      <div className="os-file-status">
        <p style={{ margin: '0 0 8px' }}>No employee file found in the system.</p>
        <a className="os-btn" href="/signup">Report to Intake</a>
        {status && <p style={{ marginTop: 8, fontSize: 11, color: '#5a6b58' }}>{status}</p>}
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="os-file-grid">
      {!quizCompletedAt && (
        <div
          className="os-file-notice"
          style={{
            background: '#fff3cd',
            borderColor: '#d4a300',
            color: '#664d03',
            padding: '10px 12px',
            lineHeight: 1.5,
          }}
        >
          <strong>PROVISIONAL FILE.</strong> OmniShift filed you with the available data.
          The room would prefer you confirm.
          <br />
          <a
            className="os-btn"
            href="/portal/interview"
            style={{ marginTop: 8, display: 'inline-block' }}
          >
            ► REFINE YOUR FILE
          </a>
        </div>
      )}

      {status && <div className="os-file-notice">{status}</div>}

      <div className="os-file-section">
        <div className="os-file-section-header">Assigned Identity</div>
        <table className="os-file-table">
          <tbody>
            <tr><td className="os-field-label">Employee ID</td><td className="os-field-value">{profile.employee_id}</td></tr>
            <tr><td className="os-field-label">Email</td><td className="os-field-value">{profile.email}</td></tr>
            <tr><td className="os-field-label">Alias</td><td className="os-field-value">{profile.alias || 'not provided / still assigned'}</td></tr>
            <tr><td className="os-field-label">Department</td><td className="os-field-value">{profile.department}</td></tr>
            <tr><td className="os-field-label">Role</td><td className="os-field-value">{profile.role_name}</td></tr>
            <tr><td className="os-field-label">Assigned Object</td><td className="os-field-value">{profile.assigned_object_slug}</td></tr>
            <tr><td className="os-field-label">Uniform</td><td className="os-field-value">{profile.uniform_recommendation_slug}</td></tr>
            <tr><td className="os-field-label">Shift Status</td><td className="os-field-value">{profile.shift_status}</td></tr>
            {profile.clocked_out_at && <tr><td className="os-field-label">Clocked Out</td><td className="os-field-value">{profile.clocked_out_at}</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="os-file-section">
        <div className="os-file-section-header">House Rule / Current Orders</div>
        <p className="os-house-rule">"{profile.house_rule}"</p>
        <div className="os-file-meta">
          <p>Preferred light: {profile.preferred_light}</p>
          <p>Preferred place: {profile.preferred_place}</p>
        </div>
      </div>

      <div className="os-file-actions">
        <a className="os-btn" href="/clock-out">Clock Out</a>
        <a className="os-btn os-btn-secondary" href="/idle-hands">After Hours Profile</a>
        {quizCompletedAt && (
          <a className="os-btn os-btn-secondary" href="/portal/interview">Re-take Intake</a>
        )}
        <button className="os-btn os-btn-secondary" type="button" onClick={() => loadProfile({ preferRemote: true })}>Refresh File</button>
        <button className="os-btn os-btn-danger" type="button" onClick={signOut}>Sign Out / Leave Badge</button>
      </div>
    </div>
  );
}

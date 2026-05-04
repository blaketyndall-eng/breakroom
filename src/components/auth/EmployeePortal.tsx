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

  async function loadProfile(options: { preferRemote?: boolean } = {}) {
    setStatus('');

    const local = loadLocalProfile();
    if (local && !options.preferRemote) {
      setProfile(local);
      setState('ready');
      return;
    }

    if (!supabase) {
      const preview = local ?? previewProfile();
      saveLocalProfile(preview);
      setProfile(preview);
      setState('ready');
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
    if (supabase) await supabase.auth.signOut();
    window.location.href = '/breakroom';
  }

  if (state === 'loading') {
    return <div className="memo-box">Retrieving employee file. Do not look directly at the printer.</div>;
  }

  if (state === 'signed_out') {
    return <div className="memo-box">No employee file found. <a href="/signup">Report to intake.</a> {status}</div>;
  }

  if (!profile) return null;

  return (
    <div className="grid-2">
      <section className="old-shell">
        <div className="old-header">Assigned Identity</div>
        <div className="old-body">
          {status && <p className="memo-box">{status}</p>}
          <table className="table-box">
            <tbody>
              <tr><th>Field</th><th>Value</th></tr>
              <tr><td>Employee ID</td><td>{profile.employee_id}</td></tr>
              <tr><td>Email</td><td>{profile.email}</td></tr>
              <tr><td>Alias</td><td>{profile.alias || 'not provided / still assigned'}</td></tr>
              <tr><td>Department</td><td>{profile.department}</td></tr>
              <tr><td>Role</td><td>{profile.role_name}</td></tr>
              <tr><td>Assigned Object</td><td>{profile.assigned_object_slug}</td></tr>
              <tr><td>Uniform Recommendation</td><td>{profile.uniform_recommendation_slug}</td></tr>
              <tr><td>Shift Status</td><td>{profile.shift_status}</td></tr>
              {profile.clocked_out_at && <tr><td>Clocked Out At</td><td>{profile.clocked_out_at}</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
      <section className="old-shell">
        <div className="old-header">House Rule / Current Orders</div>
        <div className="old-body">
          <p style={{ fontSize: 24, fontFamily: 'var(--type-paper)' }}>“{profile.house_rule}”</p>
          <p>Preferred light: {profile.preferred_light}</p>
          <p>Preferred place: {profile.preferred_place}</p>
          <p><a className="old-button" href="/clock-out">Clock Out</a></p>
          <p><a href="/portal/after-hours-profile">View After Hours Persona</a></p>
          <button className="old-button" type="button" onClick={() => loadProfile({ preferRemote: true })}>Refresh Employee File</button>{' '}
          <button className="old-button" type="button" onClick={signOut}>Sign Out / Leave Badge</button>
        </div>
      </section>
    </div>
  );
}

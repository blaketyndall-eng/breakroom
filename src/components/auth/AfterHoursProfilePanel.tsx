import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { generateAfterHoursPersona } from '@/lib/generators/afterHoursPersona';
import { loadLocalProfile, LOCAL_AFTER_HOURS_KEY } from '@/lib/localSession';

type Persona = ReturnType<typeof generateAfterHoursPersona>;

function fromRemote(row: any): Persona {
  return {
    playerAlias: row.player_alias,
    fakeHandicap: row.fake_handicap,
    preferredLight: row.preferred_light,
    signatureObject: row.signature_object,
    assignedTable: row.assigned_table,
    afterHoursStatus: row.after_hours_status,
    regularNote: row.regular_note,
  };
}

export default function AfterHoursProfilePanel() {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    async function loadPersona() {
      const raw = window.localStorage.getItem(LOCAL_AFTER_HOURS_KEY);
      if (raw) {
        try {
          setPersona(JSON.parse(raw));
        } catch {
          // fall through to remote or generated profile
        }
      }

      if (supabase) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const { data } = await supabase
            .from('after_hours_profiles')
            .select('*')
            .eq('user_id', userData.user.id)
            .single();

          if (data) {
            const remote = fromRemote(data);
            window.localStorage.setItem(LOCAL_AFTER_HOURS_KEY, JSON.stringify(remote));
            setPersona(remote);
            setStatus('Loaded from the house ledger.');
            return;
          }
        }
      }

      if (!raw) {
        const profile = loadLocalProfile();
        const next = generateAfterHoursPersona(profile?.email ?? 'preview@afterhours.local');
        window.localStorage.setItem(LOCAL_AFTER_HOURS_KEY, JSON.stringify(next));
        setPersona(next);
        setStatus('Generated locally. Register for Idle Hands to make it official.');
      }
    }

    loadPersona().catch((error) => setStatus(error instanceof Error ? error.message : 'Could not load persona.'));
  }, []);

  if (!persona) return <div className="memo-box">Generating table assignment...</div>;

  return (
    <section className="old-shell">
      <div className="old-header">After Hours Persona / Idle Hands Intake</div>
      <div className="old-body">
        {status && <p className="memo-box">{status}</p>}
        <table className="table-box">
          <tbody>
            <tr><th>Field</th><th>Assigned Value</th></tr>
            {Object.entries(persona).map(([key, value]) => (
              <tr key={key}><td>{key}</td><td>{String(value)}</td></tr>
            ))}
          </tbody>
        </table>
        <p><a className="old-button" href="/idle-hands">Register / Confirm Bracket</a></p>
      </div>
    </section>
  );
}

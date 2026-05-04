import { useEffect, useState } from 'react';
import { generateAfterHoursPersona } from '@/lib/generators/afterHoursPersona';
import { loadLocalProfile, LOCAL_AFTER_HOURS_KEY } from '@/lib/localSession';

type Persona = ReturnType<typeof generateAfterHoursPersona>;

export default function AfterHoursProfilePanel() {
  const [persona, setPersona] = useState<Persona | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(LOCAL_AFTER_HOURS_KEY);
    if (raw) {
      try {
        setPersona(JSON.parse(raw));
        return;
      } catch {
        // fall through to generate
      }
    }
    const profile = loadLocalProfile();
    const next = generateAfterHoursPersona(profile?.email ?? 'preview@afterhours.local');
    window.localStorage.setItem(LOCAL_AFTER_HOURS_KEY, JSON.stringify(next));
    setPersona(next);
  }, []);

  if (!persona) return <div className="memo-box">Generating table assignment...</div>;

  return (
    <section className="old-shell">
      <div className="old-header">After Hours Persona / Idle Hands Intake</div>
      <div className="old-body">
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

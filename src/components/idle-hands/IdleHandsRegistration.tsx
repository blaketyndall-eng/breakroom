import { useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { generateAfterHoursPersona } from '@/lib/generators/afterHoursPersona';
import { loadLocalProfile, LOCAL_AFTER_HOURS_KEY } from '@/lib/localSession';

type RegistrationMode = 'interview' | 'auto';

type RegistrationResult = {
  playerAlias: string;
  fakeHandicap: number;
  preferredLight: string;
  signatureObject: string;
  assignedTable: string;
  afterHoursStatus: string;
  regularNote: string;
};

const questions = [
  'What object did you bring to the table?',
  'What kind of light do you trust least?',
  'What rumor did the bartender hear about you?',
];

const houseNotes = [
  'Keeps their quarters in a prescription bottle. Nobody asks why.',
  'Shoots better when the jukebox skips. Worse when thanked.',
  'Known to disappear between racks and return with gas station flowers.',
  'Claims the cue chose them. The cue has not commented.',
  'Has never arrived early, which the house considers professional.',
];

function remixPersona(seed: string, alias: string, answers: string[], mode: RegistrationMode): RegistrationResult {
  const base = generateAfterHoursPersona(`${seed}:${alias}:${answers.join('|')}:${mode}`);
  const answerText = answers.filter(Boolean).join(' / ');
  const noteSeed = Math.abs(Array.from(`${seed}${alias}${answerText}`).reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0));

  return {
    ...base,
    playerAlias: alias || base.playerAlias,
    regularNote: mode === 'auto'
      ? houseNotes[noteSeed % houseNotes.length]
      : `${base.regularNote} Intake note: ${answerText || 'answered like someone avoiding a camera.'}`,
  };
}

export default function IdleHandsRegistration() {
  const localProfile = useMemo(() => loadLocalProfile(), []);
  const [alias, setAlias] = useState(localProfile?.alias || '');
  const [mode, setMode] = useState<RegistrationMode>('interview');
  const [answers, setAnswers] = useState(['', '', '']);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<RegistrationResult | null>(null);

  async function register() {
    setBusy(true);
    setStatus('');

    try {
      const seed = localProfile?.email || alias || 'idle-hands-walk-in';
      const persona = remixPersona(seed, alias.trim(), mode === 'auto' ? [] : answers, mode);
      window.localStorage.setItem(LOCAL_AFTER_HOURS_KEY, JSON.stringify(persona));
      setResult(persona);

      if (!supabase) {
        setStatus('Local registration filed. The bracket exists on this machine and in several unreliable memories.');
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        setStatus('Local registration filed. Sign in to make the house remember you across devices.');
        return;
      }

      const { data: tournament, error: tournamentError } = await supabase
        .from('tournaments')
        .select('id')
        .eq('slug', 'idle-hands-invitational')
        .single();
      if (tournamentError) throw tournamentError;

      const registrationPayload = {
        tournament_id: tournament.id,
        user_id: user.id,
        player_alias: persona.playerAlias,
        answers: {
          mode,
          alias: alias.trim(),
          questions,
          answers: mode === 'auto' ? [] : answers,
          generated: persona,
        },
        status: 'registered',
      };

      const { error: registrationError } = await supabase
        .from('tournament_registrations')
        .upsert(registrationPayload, { onConflict: 'tournament_id,user_id' });
      if (registrationError) throw registrationError;

      const { error: personaError } = await supabase
        .from('after_hours_profiles')
        .upsert({
          user_id: user.id,
          player_alias: persona.playerAlias,
          fake_handicap: persona.fakeHandicap,
          preferred_light: persona.preferredLight,
          signature_object: persona.signatureObject,
          assigned_table: persona.assignedTable,
          after_hours_status: persona.afterHoursStatus,
          regular_note: persona.regularNote,
        }, { onConflict: 'user_id' });
      if (personaError) throw personaError;

      setStatus('Registration stored. The house has written your name down badly but permanently.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Registration failed. The bracket looked away.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="old-shell">
      <div className="old-header">Register / After Hours Persona Intake</div>
      <div className="old-body">
        <p>Registration creates your After Hours Persona and assigns you to a table that may or may not be level.</p>
        <label>Alias, or leave blank<br />
          <input value={alias} onChange={(event) => setAlias(event.target.value)} placeholder="name the regulars call you" style={{ width: '100%', padding: 10, marginBottom: 8 }} />
        </label>
        <label>Method<br />
          <select value={mode} onChange={(event) => setMode(event.target.value as RegistrationMode)} style={{ width: '100%', padding: 10, marginBottom: 8 }}>
            <option value="interview">Take Interview</option>
            <option value="auto">I Don't Care</option>
          </select>
        </label>
        {mode === 'interview' && questions.map((question, index) => (
          <label key={question}>{question}<br />
            <input value={answers[index]} onChange={(event) => {
              const next = [...answers];
              next[index] = event.target.value;
              setAnswers(next);
            }} placeholder="answer, lie, or make the room uncomfortable" style={{ width: '100%', padding: 10, marginBottom: 8 }} />
          </label>
        ))}
        <button className="old-button" type="button" onClick={register} disabled={busy}>{busy ? 'Filing...' : 'Generate Persona / Register'}</button>
        {status && <p className="memo-box">{status}</p>}
        {result && (
          <table className="table-box" style={{ marginTop: 12 }}>
            <tbody>
              <tr><th>Field</th><th>Assigned Value</th></tr>
              <tr><td>Player Alias</td><td>{result.playerAlias}</td></tr>
              <tr><td>Fake Handicap</td><td>{result.fakeHandicap}</td></tr>
              <tr><td>Preferred Light</td><td>{result.preferredLight}</td></tr>
              <tr><td>Signature Object</td><td>{result.signatureObject}</td></tr>
              <tr><td>Assigned Table</td><td>{result.assignedTable}</td></tr>
              <tr><td>Regular Note</td><td>{result.regularNote}</td></tr>
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

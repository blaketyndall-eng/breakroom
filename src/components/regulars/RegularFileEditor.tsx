import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ARTIFACTS } from '@/lib/artifacts';
import { getLocalArtifactSlugs } from '@/lib/secrets';
import {
  REGULAR_THEMES,
  getMyRegularFile,
  makeDefaultRegularFile,
  normalizeHandle,
  saveMyRegularFile,
} from '@/lib/regularFiles';
import type { RegularFile } from '@/lib/regularFiles';

const lightOptions = ['dirty fluorescent', 'motel blue', 'dashboard green', 'beer sign red', 'amber case light', 'cold window light'];
const objectOptions = ['motel key with no room number', 'cracked Nokia', 'pool chalk cube', 'receipt with no total', 'saint card under glass', 'old lighter', 'wrong employee badge', 'title belt beside takeout'];
const titleOptions = ['Lost Object Verification', 'After Hours Desk Clerk', 'Radio 1:47 Intern', 'Wrong Department Liaison', 'Pool Table Compliance', 'Motel Key Archivist'];

function listToText(values: string[] | undefined) {
  return values?.join('\n') ?? '';
}

function textToList(value: string) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean).slice(0, 8);
}

export default function RegularFileEditor() {
  const [file, setFile] = useState<RegularFile>(() => makeDefaultRegularFile('regular'));
  const [topLinksText, setTopLinksText] = useState('/after-hours\n/phone\n/artifacts');
  const [status, setStatus] = useState('Opening locker...');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const existing = await getMyRegularFile();
      const next = existing ?? makeDefaultRegularFile('regular');
      setFile(next);
      setTopLinksText(listToText(next.top_links));
      setStatus(existing ? 'Loaded Regular File.' : 'Local preview file created. Save when ready.');
    }

    load().catch((error) => setStatus(error instanceof Error ? error.message : 'Could not open locker.'));
  }, []);

  const localArtifacts = useMemo(() => new Set(getLocalArtifactSlugs()), []);
  const availableArtifacts = ARTIFACTS.filter((artifact) => localArtifacts.has(artifact.slug));

  function update<K extends keyof RegularFile>(key: K, value: RegularFile[K]) {
    setFile((current) => ({ ...current, [key]: value }));
  }

  function toggleArtifact(slug: string) {
    setFile((current) => {
      const currentPins = current.pinned_artifacts ?? [];
      const nextPins = currentPins.includes(slug)
        ? currentPins.filter((item) => item !== slug)
        : [...currentPins, slug].slice(0, 4);
      return { ...current, pinned_artifacts: nextPins };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    try {
      const next = {
        ...file,
        handle: normalizeHandle(file.handle),
        top_links: textToList(topLinksText),
      };
      const result = await saveMyRegularFile(next);
      setFile(result.file);
      setStatus(result.source === 'supabase' ? 'Saved to the house ledger.' : 'Saved locally. Sign in to carry this file between rooms.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'The locker jammed while saving.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="old-shell regular-editor" onSubmit={handleSubmit}>
      <div className="old-header">Locker / Edit Regular File / Not Instagram</div>
      <div className="old-body">
        <p className="memo-box">{status}</p>

        <div className="regular-editor-grid">
          <label>Handle
            <input value={file.handle} onChange={(event) => update('handle', normalizeHandle(event.target.value))} placeholder="blake" />
          </label>
          <label>Display Name
            <input value={file.display_name} onChange={(event) => update('display_name', event.target.value)} placeholder="Blake T." />
          </label>
          <label>Fake Title
            <select value={file.fake_title ?? ''} onChange={(event) => update('fake_title', event.target.value)}>
              {titleOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>Favorite Light
            <select value={file.favorite_light ?? ''} onChange={(event) => update('favorite_light', event.target.value)}>
              {lightOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>Assigned Object
            <select value={file.assigned_object ?? ''} onChange={(event) => update('assigned_object', event.target.value)}>
              {objectOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>Theme
            <select value={file.theme} onChange={(event) => update('theme', event.target.value)}>
              {REGULAR_THEMES.map((item) => <option key={item} value={item}>{item.replaceAll('_', ' ')}</option>)}
            </select>
          </label>
        </div>

        <label>Bio
          <textarea value={file.bio ?? ''} onChange={(event) => update('bio', event.target.value)} maxLength={220} />
        </label>

        <label>Away Message
          <textarea value={file.away_message ?? ''} onChange={(event) => update('away_message', event.target.value)} maxLength={160} />
        </label>

        <label>Top Rooms / one per line
          <textarea value={topLinksText} onChange={(event) => setTopLinksText(event.target.value)} />
        </label>

        <section className="regular-pin-box">
          <p className="regular-kicker">Pinned Evidence / choose up to 4</p>
          {availableArtifacts.length ? availableArtifacts.map((artifact) => (
            <button
              key={artifact.slug}
              type="button"
              className={file.pinned_artifacts?.includes(artifact.slug) ? 'regular-pin active' : 'regular-pin'}
              onClick={() => toggleArtifact(artifact.slug)}
            >
              {artifact.title}
            </button>
          )) : <p>No unlocked artifacts found in this browser yet. Go make the room notice you.</p>}
        </section>

        <label className="regular-check">
          <input type="checkbox" checked={file.is_public} onChange={(event) => update('is_public', event.target.checked)} />
          Put this Regular File on the wall
        </label>

        <p>
          <button className="old-button" disabled={isSaving}>{isSaving ? 'Filing...' : 'Save Regular File'}</button>{' '}
          <a className="old-button" href={`/regulars/${file.handle}`}>View Public File</a>
        </p>
      </div>
    </form>
  );
}

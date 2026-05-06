import { useState } from 'react';
import type { FormEvent } from 'react';
import { createCrew } from '@/lib/crews';
import type { Crew } from '@/lib/crews';

type Props = {
  defaultHandle?: string;
  defaultDisplayName?: string;
  onCreated?: (crew: Crew) => void;
};

export default function CrewCreator({ defaultHandle = 'anonymous', defaultDisplayName = 'Anonymous', onCreated }: Props) {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [visibility, setVisibility] = useState<Crew['visibility']>('public');
  const [tags, setTags] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return;

    const crew = createCrew({
      name: name.trim(),
      tagline: tagline.trim() || 'No tagline filed.',
      founderHandle: defaultHandle,
      founderDisplayName: defaultDisplayName,
      visibility,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 5),
    });

    if (crew) {
      setMessage(`${crew.name} created. Not Official Turf.`);
      setName('');
      setTagline('');
      setTags('');
      setExpanded(false);
      onCreated?.(crew);
    } else {
      setMessage('Name taken or invalid. Try another.');
    }

    setTimeout(() => setMessage(null), 4000);
  }

  if (!expanded) {
    return (
      <div className="crew-creator-collapsed">
        <button className="old-button" type="button" onClick={() => setExpanded(true)}>
          + Start a Crew
        </button>
        <p className="crew-creator-note">Crews are not official Turf. They are what you say they are until management says otherwise.</p>
      </div>
    );
  }

  return (
    <div className="crew-creator">
      <h3 className="crew-creator-header">Start a Crew</h3>
      <form className="crew-creator-form" onSubmit={handleSubmit}>
        <div className="crew-field">
          <label htmlFor="crew-name">Crew Name</label>
          <input
            id="crew-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dead Link Recovery Club"
            maxLength={50}
          />
        </div>

        <div className="crew-field">
          <label htmlFor="crew-tagline">Tagline</label>
          <input
            id="crew-tagline"
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="one line. no explanations."
            maxLength={100}
          />
        </div>

        <div className="crew-field">
          <label htmlFor="crew-tags">Tags (comma-separated, max 5)</label>
          <input
            id="crew-tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="pool, late night, objects"
            maxLength={80}
          />
        </div>

        <div className="crew-field">
          <label>Visibility</label>
          <div className="crew-visibility-options">
            {(['public', 'unlisted', 'invite_only'] as const).map((v) => (
              <label key={v} className="crew-vis-option">
                <input
                  type="radio"
                  name="visibility"
                  value={v}
                  checked={visibility === v}
                  onChange={() => setVisibility(v)}
                />
                <span>{v.replaceAll('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="crew-creator-actions">
          <button className="old-button" type="submit">Create Crew</button>
          <button className="old-button" type="button" onClick={() => setExpanded(false)}>Cancel</button>
        </div>
      </form>

      {message && <p className="crew-creator-feedback">{message}</p>}
    </div>
  );
}

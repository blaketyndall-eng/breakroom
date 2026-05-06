/**
 * CrewCreator V2 — PR 63 (Crew Builder V2)
 *
 * Crew creation form with district and faction alignment pickers.
 * Ledger integration handled by crews.ts createCrew().
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { createCrew } from '@/lib/crews';
import type { Crew } from '@/lib/crews';

const DISTRICTS = [
  { slug: 'corporate-ruins', label: 'Corporate Ruins' },
  { slug: 'parking-lot-west', label: 'Parking Lot West' },
  { slug: 'motel-row', label: 'Motel Row' },
  { slug: 'object-district', label: 'Object District' },
  { slug: 'pool-hall-county', label: 'Pool Hall County' },
  { slug: 'classified-alley', label: 'Classified Alley' },
  { slug: 'back-booth', label: 'Back Booth' },
  { slug: 'dead-link-cemetery', label: 'Dead Link Cemetery' },
  { slug: 'radio-tower-147', label: 'Radio Tower 1:47' },
];

const FACTIONS = [
  { slug: 'the-players', label: 'The Players' },
  { slug: 'lot-racers', label: 'Lot Racers' },
  { slug: 'night-drinkers', label: 'Night Drinkers' },
  { slug: 'the-smokers', label: 'The Smokers' },
  { slug: 'cowboys', label: 'Cowboys' },
];

type Props = {
  defaultHandle?: string;
  defaultDisplayName?: string;
  onCreated?: (crew: Crew) => void;
};

export default function CrewCreator({
  defaultHandle = 'anonymous',
  defaultDisplayName = 'Anonymous',
  onCreated,
}: Props) {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [district, setDistrict] = useState('');
  const [faction, setFaction] = useState('');
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
      district: district || undefined,
      factionAlignment: faction || undefined,
      visibility,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 5),
    });

    if (crew) {
      setMessage(`${crew.name} created. Not Official Turf. The ledger has been notified.`);
      setName('');
      setTagline('');
      setDistrict('');
      setFaction('');
      setTags('');
      setExpanded(false);
      onCreated?.(crew);
    } else {
      setMessage('Name taken or invalid. Try another.');
    }

    setTimeout(() => setMessage(null), 5000);
  }

  if (!expanded) {
    return (
      <div className="crew-creator-collapsed">
        <button className="old-button" type="button" onClick={() => setExpanded(true)}>
          + Start a Crew
        </button>
        <p className="crew-creator-note">
          Crews are not official Turf. They are what you say they are until management says otherwise.
        </p>
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

        {/* V2: District picker */}
        <div className="crew-field">
          <label htmlFor="crew-district">District (optional)</label>
          <select
            id="crew-district"
            className="crew-filter-select"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          >
            <option value="">no district</option>
            {DISTRICTS.map((d) => (
              <option key={d.slug} value={d.slug}>{d.label}</option>
            ))}
          </select>
          <span className="crew-field-hint">Where your crew meets. Or claims to meet.</span>
        </div>

        {/* V2: Faction alignment picker */}
        <div className="crew-field">
          <label htmlFor="crew-faction">Faction Alignment (optional)</label>
          <select
            id="crew-faction"
            className="crew-filter-select"
            value={faction}
            onChange={(e) => setFaction(e.target.value)}
          >
            <option value="">no alignment</option>
            {FACTIONS.map((f) => (
              <option key={f.slug} value={f.slug}>{f.label}</option>
            ))}
          </select>
          <span className="crew-field-hint">Alignment is not membership. It is proximity.</span>
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

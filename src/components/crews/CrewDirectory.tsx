/**
 * CrewDirectory — PR 63 (Crew Builder V2)
 *
 * Searchable, filterable crew directory with live updates.
 * Replaces the static crew list on /crews.
 */

import { useState, useEffect } from 'react';
import {
  searchCrews,
  getCrewStats,
  onCrewEvent,
} from '@/lib/crews';
import type { Crew, CrewFilter, CrewStats } from '@/lib/crews';

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

export default function CrewDirectory() {
  const [crews, setCrews] = useState<Crew[]>([]);
  const [stats, setStats] = useState<CrewStats | null>(null);
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState<string>('');
  const [factionFilter, setFactionFilter] = useState<string>('');
  const [showMine, setShowMine] = useState(false);

  function refresh() {
    const filter: CrewFilter = {};
    if (search) filter.search = search;
    if (districtFilter) filter.district = districtFilter;
    if (factionFilter) filter.factionAlignment = factionFilter;
    if (showMine) filter.onlyMine = true;
    setCrews(searchCrews(filter));
    setStats(getCrewStats());
  }

  useEffect(() => {
    refresh();
    const unsub = onCrewEvent(() => refresh());
    return unsub;
  }, []);

  // Re-filter when filters change
  useEffect(() => {
    refresh();
  }, [search, districtFilter, factionFilter, showMine]);

  return (
    <div className="crew-directory">
      {/* Stats bar */}
      {stats && (
        <div className="crew-stats-bar">
          <span className="crew-stat-item">{stats.totalCrews} crew{stats.totalCrews !== 1 ? 's' : ''}</span>
          <span className="crew-stat-item">{stats.totalMembers} total member{stats.totalMembers !== 1 ? 's' : ''}</span>
          <span className="crew-stat-item">{stats.officialCount} recognized</span>
        </div>
      )}

      {/* Filter bar */}
      <div className="crew-filter-bar">
        <input
          type="text"
          className="crew-search-input"
          placeholder="search crews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="crew-filter-select"
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
        >
          <option value="">all districts</option>
          {DISTRICTS.map((d) => (
            <option key={d.slug} value={d.slug}>{d.label.toLowerCase()}</option>
          ))}
        </select>
        <select
          className="crew-filter-select"
          value={factionFilter}
          onChange={(e) => setFactionFilter(e.target.value)}
        >
          <option value="">all factions</option>
          {FACTIONS.map((f) => (
            <option key={f.slug} value={f.slug}>{f.label.toLowerCase()}</option>
          ))}
        </select>
        <label className="crew-mine-toggle">
          <input
            type="checkbox"
            checked={showMine}
            onChange={(e) => setShowMine(e.target.checked)}
          />
          <span>my crews</span>
        </label>
      </div>

      {/* Crew list */}
      {crews.length === 0 && (
        <p className="crew-empty-state">
          {search || districtFilter || factionFilter || showMine
            ? 'No crews match that filter. Adjust or start one.'
            : 'No crews formed yet. Someone has to go first.'
          }
        </p>
      )}

      <div className="crew-list">
        {crews.map((crew) => (
          <CrewDirectoryCard key={crew.slug} crew={crew} />
        ))}
      </div>
    </div>
  );
}

function CrewDirectoryCard({ crew }: { crew: Crew }) {
  const age = getCrewAge(crew.foundedAt);

  return (
    <article className={`crew-card ${crew.isOfficial ? 'crew-official' : 'crew-unofficial'}`}>
      <div className="crew-card-meta">
        <span className="crew-visibility-badge">
          {crew.visibility === 'invite_only' ? 'INVITE ONLY' : crew.visibility.toUpperCase()}
        </span>
        {!crew.isOfficial && <span className="crew-unofficial-badge">NOT OFFICIAL TURF</span>}
        {crew.isOfficial && <span className="crew-official-badge">RECOGNIZED</span>}
        {crew.factionAlignment && (
          <span className="crew-faction-badge">
            {crew.factionAlignment.replace(/-/g, ' ')}
          </span>
        )}
      </div>
      <h2 className="crew-card-name">
        <a href={`/crews/${crew.slug}`}>{crew.name}</a>
      </h2>
      <p className="crew-card-tagline">{crew.tagline}</p>
      <div className="crew-card-footer">
        <span className="crew-member-count">
          {crew.memberCount} {crew.memberCount === 1 ? 'member' : 'members'}
        </span>
        {crew.district && (
          <span className="crew-district">{crew.district.replace(/-/g, ' ')}</span>
        )}
        <span className="crew-age">{age}</span>
      </div>
      {crew.tags.length > 0 && (
        <div className="crew-tags">
          {crew.tags.map((tag) => (
            <span key={tag} className="crew-tag">{tag}</span>
          ))}
        </div>
      )}
    </article>
  );
}

function getCrewAge(foundedAt: string): string {
  const diff = Date.now() - new Date(foundedAt).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'today';
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mo`;
  const years = Math.floor(days / 365);
  return `${years}y`;
}

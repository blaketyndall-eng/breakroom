import { useState, useEffect } from 'react';
import { getLocalMembership, TURF_JOINED_EVENT } from '@/lib/turfMembership';
import { getFactionBySlug } from '@/content/data/factions';

export default function TurfMemberBadge() {
  const [membership, setMembership] = useState(getLocalMembership());

  useEffect(() => {
    const onJoined = () => setMembership(getLocalMembership());
    const onStorage = (e: StorageEvent) => {
      if (e.key?.includes('turf-membership')) onJoined();
    };

    window.addEventListener(TURF_JOINED_EVENT, onJoined);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(TURF_JOINED_EVENT, onJoined);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  if (!membership?.isActive) return null;

  const faction = getFactionBySlug(membership.factionSlug);
  if (!faction) return null;

  return (
    <span
      className="turf-member-badge"
      style={{
        '--turf-primary': faction.colors.primary,
        '--turf-secondary': faction.colors.secondary,
      } as React.CSSProperties}
    >
      <span className="turf-member-badge__label">{faction.name}</span>
    </span>
  );
}

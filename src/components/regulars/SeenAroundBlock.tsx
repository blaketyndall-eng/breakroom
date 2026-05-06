import { useState, useEffect } from 'react';
import { getRecentSeenHandles, getSeenAroundAtLocation } from '@/lib/topEight';
import type { SeenAroundEntry } from '@/lib/topEight';

type Props = {
  location?: string;
  mode?: 'global' | 'location';
  limit?: number;
};

export default function SeenAroundBlock({ location, mode = 'global', limit = 8 }: Props) {
  const [entries, setEntries] = useState<SeenAroundEntry[]>([]);

  useEffect(() => {
    if (mode === 'location' && location) {
      setEntries(getSeenAroundAtLocation(location).slice(-limit).reverse());
    } else {
      setEntries(getRecentSeenHandles(limit));
    }
  }, [location, mode, limit]);

  if (entries.length === 0) {
    return (
      <div className="seen-around-block">
        <p className="seen-around-empty">Nobody seen around yet. Or they left before you noticed.</p>
      </div>
    );
  }

  return (
    <div className="seen-around-block">
      <div className="seen-around-list">
        {entries.map((entry, i) => (
          <a
            key={`${entry.handle}-${i}`}
            href={`/regulars/${entry.handle}`}
            className="seen-around-entry"
          >
            <span className="seen-handle">{entry.displayName}</span>
            <span className="seen-location">{entry.location.replaceAll('-', ' ')}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

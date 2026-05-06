import { useState, useEffect } from 'react';
import { getRecentSeenHandles, type SeenAroundEntry } from '@/lib/topEight';
import { getPocketIdentity, getIdentityTier } from '@/lib/pocketPersonalization';

/**
 * PocketSeenAround — who/what noticed you or was seen nearby.
 * Compact list of recent faction drift and NPC sightings.
 * Research: "regulars" at a bar, Animal Crossing villager greetings.
 * Personalized: empty state changes based on identity tier.
 */

const EMPTY_STATES: Record<string, string> = {
  veteran: 'The regulars are elsewhere. They know where to find you.',
  regular: 'Nobody noticed. But the room keeps records.',
  drifter: 'Nobody noticed. Or they did and said nothing.',
  newcomer: 'Nobody here yet. That changes.',
};

export default function PocketSeenAround() {
  const [entries, setEntries] = useState<SeenAroundEntry[]>([]);
  const [emptyMessage, setEmptyMessage] = useState('Nobody noticed. Or they did and said nothing.');

  useEffect(() => {
    const recent = getRecentSeenHandles(3);
    setEntries(recent);
    const tier = getIdentityTier();
    setEmptyMessage(EMPTY_STATES[tier] || EMPTY_STATES.newcomer);
  }, []);

  if (entries.length === 0) {
    return (
      <div className="pocket-seen">
        <div className="pocket-section-header">Seen Around</div>
        <div className="pocket-seen-entry">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="pocket-seen">
      <div className="pocket-section-header">Seen Around</div>
      {entries.map((entry, i) => (
        <div key={i} className="pocket-seen-entry">
          <span className="pocket-seen-handle">{entry.handle}</span>
          {' '}{entry.note || 'was here.'}
        </div>
      ))}
    </div>
  );
}

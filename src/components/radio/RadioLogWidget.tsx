import { useState, useEffect } from 'react';
import { getRadioFeed, RADIO_TYPE_LABELS } from '@/lib/radio';
import type { RadioEntry } from '@/lib/radio';

/**
 * RadioLogWidget — lazy-initializes via getRadioFeed(limit) so the SSR'd
 * HTML already contains the seeded entries. After hydration, useEffect
 * re-runs to pick up any user-submitted entries from localStorage.
 *
 * POLISH-3 A: entry titles are <h3> (was <h4>) so they sit one level
 * below the schedule's <h2>, restoring monotonic heading order.
 */
export default function RadioLogWidget({ limit = 15 }: { limit?: number }) {
  const [entries, setEntries] = useState<RadioEntry[]>(() => getRadioFeed(limit));

  useEffect(() => {
    setEntries(getRadioFeed(limit));
  }, [limit]);

  return (
    <div className="radio-log">
      <div className="radio-log-header">
        <span className="radio-log-title">TRANSMISSION LOG</span>
        <span className="radio-log-count">{entries.length} entries</span>
      </div>

      {entries.length === 0 && (
        <p className="radio-log-empty">Dead air. Nothing transmitted yet.</p>
      )}

      <div className="radio-log-feed">
        {entries.map((entry) => (
          <RadioEntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}

function RadioEntryCard({ entry }: { entry: RadioEntry }) {
  const typeLabel = RADIO_TYPE_LABELS[entry.type] || entry.type;
  const timeStr = new Date(entry.timestamp).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <article className={`radio-entry radio-entry-${entry.type}`}>
      <div className="radio-entry-topline">
        <span className={`radio-entry-type radio-type-${entry.type}`}>{typeLabel}</span>
        <span className="radio-entry-time">{timeStr}</span>
      </div>
      <h3 className="radio-entry-title">{entry.title}</h3>
      <p className="radio-entry-body">{entry.body}</p>
      {entry.host && (
        <span className="radio-entry-host">{entry.host}</span>
      )}
      {entry.district && (
        <span className="radio-entry-district">{entry.district.replace(/-/g, ' ')}</span>
      )}
    </article>
  );
}

import { useState, useEffect } from 'react';
import { getPublicLedger, seedLedgerIfEmpty } from '@/lib/worldLedger';
import type { LedgerEntry } from '@/lib/worldLedger';

export default function PublicLedger() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);

  useEffect(() => {
    seedLedgerIfEmpty();
    setEntries(getPublicLedger(20));
  }, []);

  return (
    <div className="public-ledger">
      {entries.length === 0 && (
        <p className="ledger-empty">The ledger has not started recording yet. Or it has, and you were not told.</p>
      )}

      <div className="ledger-feed">
        {entries.map((entry) => (
          <div key={entry.id} className={`ledger-entry ledger-vis-${entry.visibility}`}>
            <div className="ledger-entry-topline">
              <span className="ledger-entry-type">{entry.type.replace(/_/g, ' ')}</span>
              <span className="ledger-entry-time">
                {new Date(entry.timestamp).toLocaleDateString()}
              </span>
            </div>
            <p className="ledger-entry-headline">
              {entry.visibility === 'redacted' ? entry.redactedLine : entry.headline}
            </p>
            {entry.district && (
              <span className="ledger-entry-district">{entry.district.replace(/-/g, ' ')}</span>
            )}
          </div>
        ))}
      </div>

      <p className="ledger-public-footer">
        Some entries have been redacted. The wire room controls what is shown.
      </p>
    </div>
  );
}

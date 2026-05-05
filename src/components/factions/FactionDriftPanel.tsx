import { useEffect, useState } from 'react';
import {
  FACTION_DRIFT_EVENT,
  getFactionDriftLabel,
  getFactionSignalSummary,
  hasFactionDrift,
} from '@/lib/factionDrift';
import type { FactionSignalSummary } from '@/lib/factionDrift';

type Props = {
  factionSlug?: string;
  compact?: boolean;
};

export default function FactionDriftPanel({ factionSlug, compact = false }: Props) {
  const [summaries, setSummaries] = useState<FactionSignalSummary[]>([]);

  useEffect(() => {
    function refresh() {
      setSummaries(getFactionSignalSummary());
    }

    refresh();
    window.addEventListener(FACTION_DRIFT_EVENT, refresh as EventListener);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(FACTION_DRIFT_EVENT, refresh as EventListener);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  if (factionSlug) {
    const summary = summaries.find((item) => item.factionSlug === factionSlug);
    const drifted = hasFactionDrift(factionSlug) || Boolean(summary);
    return (
      <section className={compact ? 'faction-drift-panel compact' : 'faction-drift-panel'}>
        <p className="faction-drift-kicker">Turf Signal</p>
        <p>{getFactionDriftLabel(factionSlug, drifted)}</p>
        {summary && <small>{summary.total} signal(s) filed / drift only, not joined</small>}
      </section>
    );
  }

  const visible = summaries.slice(0, 4);

  return (
    <section className={compact ? 'faction-drift-panel compact' : 'old-shell faction-drift-panel'}>
      {!compact && <div className="old-header">Turf Signals / Drift Only</div>}
      <div className={compact ? undefined : 'old-body'}>
        {visible.length ? (
          <div className="faction-drift-list">
            {visible.map((summary) => (
              <a className="faction-drift-row" href={`/factions/${summary.factionSlug}`} key={summary.factionSlug}>
                <span>{summary.factionSlug.replaceAll('-', ' ')}</span>
                <small>{summary.label} / {summary.total} signal(s)</small>
              </a>
            ))}
          </div>
        ) : (
          <p className="memo-box">No turf signals filed yet. The room has not decided where you keep standing.</p>
        )}
        <p className="sleepnet-url">drift://not-joining</p>
      </div>
    </section>
  );
}

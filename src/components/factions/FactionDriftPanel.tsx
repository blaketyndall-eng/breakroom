import { useEffect, useState } from 'react';
import {
  FACTION_DRIFT_EVENT,
  getFactionDriftLabel,
  getFactionSignalSummary,
  hasFactionDrift,
} from '@/lib/factionDrift';
import { DRIFT_JOIN_THRESHOLD, TURF_JOINED_EVENT, isLocalMemberOf } from '@/lib/turfMembership';
import type { FactionSignalSummary } from '@/lib/factionDrift';

type Props = {
  factionSlug?: string;
  compact?: boolean;
};

export default function FactionDriftPanel({ factionSlug, compact = false }: Props) {
  const [summaries, setSummaries] = useState<FactionSignalSummary[]>([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    function refresh() {
      setSummaries(getFactionSignalSummary());
      setTick((t) => t + 1);
    }

    refresh();
    window.addEventListener(FACTION_DRIFT_EVENT, refresh as EventListener);
    window.addEventListener(TURF_JOINED_EVENT, refresh as EventListener);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(FACTION_DRIFT_EVENT, refresh as EventListener);
      window.removeEventListener(TURF_JOINED_EVENT, refresh as EventListener);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  if (factionSlug) {
    const summary = summaries.find((item) => item.factionSlug === factionSlug);
    const drifted = hasFactionDrift(factionSlug) || Boolean(summary);
    const isMember = isLocalMemberOf(factionSlug);
    const readyToJoin = !isMember && (summary?.total ?? 0) >= DRIFT_JOIN_THRESHOLD;

    return (
      <section className={compact ? 'faction-drift-panel compact' : 'faction-drift-panel'}>
        <p className="faction-drift-kicker">Turf Signal</p>
        <p>{getFactionDriftLabel(factionSlug, drifted)}</p>
        {isMember && <small className="faction-drift-joined">Joined. This is your turf now.</small>}
        {readyToJoin && <small className="faction-drift-ready">The room is ready. You could stand here officially.</small>}
        {summary && !isMember && !readyToJoin && <small>{summary.total} signal(s) filed / drift only, not joined</small>}
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
            {visible.map((summary) => {
              const isMember = isLocalMemberOf(summary.factionSlug);
              const readyToJoin = !isMember && summary.total >= DRIFT_JOIN_THRESHOLD;
              return (
                <a className="faction-drift-row" href={`/factions/${summary.factionSlug}`} key={summary.factionSlug}>
                  <span>{summary.factionSlug.replaceAll('-', ' ')}</span>
                  {isMember
                    ? <small className="faction-drift-joined">Joined</small>
                    : readyToJoin
                      ? <small className="faction-drift-ready">{summary.total} signals — ready to join</small>
                      : <small>{summary.label} / {summary.total} signal(s)</small>
                  }
                </a>
              );
            })}
          </div>
        ) : (
          <p className="memo-box">No turf signals filed yet. The room has not decided where you keep standing.</p>
        )}
        <p className="sleepnet-url">drift://not-joining</p>
      </div>
    </section>
  );
}

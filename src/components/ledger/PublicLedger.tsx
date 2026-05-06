import { useState, useEffect } from 'react';
import {
  getPublicLedger,
  seedLedgerIfEmpty,
  getLedgerDensity,
  getDistrictActivity,
  onLedgerEvent,
} from '@/lib/worldLedger';
import type { LedgerEntry, DistrictActivity } from '@/lib/worldLedger';

const PAGE_SIZE = 20;

export default function PublicLedger() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [density, setDensity] = useState<ReturnType<typeof getLedgerDensity> | null>(null);
  const [districts, setDistricts] = useState<DistrictActivity[]>([]);
  const [districtFilter, setDistrictFilter] = useState<string | 'all'>('all');

  useEffect(() => {
    seedLedgerIfEmpty();
    refresh();
    const unsub = onLedgerEvent(() => refresh());
    return unsub;
  }, []);

  function refresh() {
    setEntries(getPublicLedger(200));
    setDensity(getLedgerDensity());
    setDistricts(getDistrictActivity());
  }

  // Filter by district
  const filtered = districtFilter === 'all'
    ? entries
    : entries.filter((e) => e.district === districtFilter);

  // Group by day
  const dayMap = new Map<string, LedgerEntry[]>();
  for (const e of filtered) {
    const d = new Date(e.timestamp);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const bucket = dayMap.get(key) || [];
    bucket.push(e);
    dayMap.set(key, bucket);
  }

  function dayLabel(key: string): string {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const yesterday = new Date(Date.now() - 86400000);
    const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    if (key === todayKey) return 'Today';
    if (key === yesterdayKey) return 'Yesterday';
    const [y, m, d] = key.split('-').map(Number);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[m - 1]} ${d}, ${y}`;
  }

  const sortedDays = Array.from(dayMap.entries()).sort((a, b) => b[0].localeCompare(a[0]));

  // Flatten for "load more" counting
  let shown = 0;
  const visibleDays: [string, LedgerEntry[]][] = [];
  for (const [key, dayEntries] of sortedDays) {
    if (shown >= visibleCount) break;
    const remaining = visibleCount - shown;
    const slice = dayEntries.slice(0, remaining);
    visibleDays.push([key, slice]);
    shown += slice.length;
  }

  const hasMore = filtered.length > visibleCount;

  // Unique districts from entries for filter dropdown
  const availableDistricts = districts.filter((d) => d.eventCount > 0);

  return (
    <div className="public-ledger">
      {/* Density indicator */}
      {density && (
        <div className="ledger-density-banner">
          <span className="ledger-density-text">{density.label}</span>
          {density.eventsToday > 0 && (
            <span className="ledger-density-count">{density.eventsToday} event{density.eventsToday !== 1 ? 's' : ''} today</span>
          )}
        </div>
      )}

      {/* District filter */}
      {availableDistricts.length > 1 && (
        <div className="ledger-filter-row">
          <select
            className="ledger-filter-select"
            value={districtFilter}
            onChange={(e) => {
              setDistrictFilter(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
          >
            <option value="all">all districts</option>
            {availableDistricts.map((d) => (
              <option key={d.district} value={d.district}>
                {d.district.replace(/-/g, ' ')} ({d.eventCount})
              </option>
            ))}
          </select>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="ledger-empty">The ledger has not started recording yet. Or it has, and you were not told.</p>
      )}

      {/* Day-grouped feed */}
      {visibleDays.map(([key, dayEntries]) => (
        <div key={key} className="ledger-day-group">
          <div className="ledger-day-divider">
            <span className="ledger-day-label">{dayLabel(key)}</span>
          </div>
          <div className="ledger-feed">
            {dayEntries.map((entry) => (
              <div key={entry.id} className={`ledger-entry ledger-vis-${entry.visibility}`}>
                <div className="ledger-entry-topline">
                  <span className="ledger-entry-type">{entry.type.replace(/_/g, ' ')}</span>
                  <span className="ledger-entry-time">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="ledger-entry-headline">
                  {entry.visibility === 'redacted' ? entry.redactedLine : entry.headline}
                </p>
                {entry.district && (
                  <span className="ledger-entry-district">{entry.district.replace(/-/g, ' ')}</span>
                )}
                {entry.tags.length > 0 && (
                  <div className="ledger-entry-tags-inline">
                    {entry.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="ledger-tag ledger-tag-sm">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Load more */}
      {hasMore && (
        <div className="ledger-load-more">
          <button
            type="button"
            className="old-button"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          >
            load older entries
          </button>
        </div>
      )}

      <p className="ledger-public-footer">
        Some entries have been redacted. The wire room controls what is shown.
      </p>
    </div>
  );
}

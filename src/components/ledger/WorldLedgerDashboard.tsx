import { useState, useEffect } from 'react';
import {
  getAdminLedger,
  getLedgerStats,
  seedLedgerIfEmpty,
  getLedgerTimeline,
  getLedgerTagCloud,
  getDistrictActivity,
  getCorrelatedEvents,
  getLedgerDensity,
  onLedgerEvent,
} from '@/lib/worldLedger';
import type {
  LedgerEntry,
  LedgerEventType,
  LedgerDayBucket,
  LedgerTagCount,
  DistrictActivity,
} from '@/lib/worldLedger';
import { runContinuityChecks } from '@/lib/continuityChecks';
import type { ContinuityReport, ContinuityIssue } from '@/lib/continuityChecks';

type TabId = 'feed' | 'timeline' | 'stats' | 'districts' | 'continuity';

export default function WorldLedgerDashboard() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof getLedgerStats> | null>(null);
  const [continuity, setContinuity] = useState<ContinuityReport | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('feed');
  const [typeFilter, setTypeFilter] = useState<LedgerEventType | 'all'>('all');

  // V2 state
  const [timeline, setTimeline] = useState<LedgerDayBucket[]>([]);
  const [tagCloud, setTagCloud] = useState<LedgerTagCount[]>([]);
  const [districtActivity, setDistrictActivity] = useState<DistrictActivity[]>([]);
  const [density, setDensity] = useState<ReturnType<typeof getLedgerDensity> | null>(null);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [correlatedEntries, setCorrelatedEntries] = useState<LedgerEntry[]>([]);

  useEffect(() => {
    seedLedgerIfEmpty();
    refresh();

    // Subscribe to new events for live updates
    const unsub = onLedgerEvent(() => refresh());
    return unsub;
  }, []);

  function refresh() {
    setEntries(getAdminLedger(100));
    setStats(getLedgerStats());
    setTimeline(getLedgerTimeline());
    setTagCloud(getLedgerTagCloud());
    setDistrictActivity(getDistrictActivity());
    setDensity(getLedgerDensity());
  }

  function runChecks() {
    const report = runContinuityChecks();
    setContinuity(report);
  }

  function toggleExpand(entry: LedgerEntry) {
    if (expandedEntry === entry.id) {
      setExpandedEntry(null);
      setCorrelatedEntries([]);
    } else {
      setExpandedEntry(entry.id);
      setCorrelatedEntries(getCorrelatedEvents(entry, 5));
    }
  }

  const filteredEntries = typeFilter === 'all'
    ? entries
    : entries.filter((e) => e.type === typeFilter);

  const eventTypes: LedgerEventType[] = [...new Set(entries.map(e => e.type))];

  const tabs: { id: TabId; label: string }[] = [
    { id: 'feed', label: 'feed' },
    { id: 'timeline', label: 'timeline' },
    { id: 'stats', label: 'stats' },
    { id: 'districts', label: 'districts' },
    { id: 'continuity', label: 'continuity' },
  ];

  return (
    <div className="ledger-dashboard">
      <div className="ledger-dashboard-header">
        <span className="ledger-dashboard-title">WORLD LEDGER — CONTINUITY ENGINE</span>
        {density && (
          <span className="ledger-density-label">{density.label}</span>
        )}
      </div>

      {/* Tag cloud sidebar — visible on all tabs */}
      {tagCloud.length > 0 && (
        <div className="ledger-tag-cloud">
          <span className="ledger-section-label">TAGS</span>
          <div className="ledger-tag-list">
            {tagCloud.map((t) => (
              <span key={t.tag} className="ledger-tag" title={`${t.count} events`}>
                {t.tag} <span className="ledger-tag-count">{t.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="ledger-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`ledger-tab ${activeTab === tab.id ? 'ledger-tab-active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === 'continuity' && !continuity) runChecks();
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* === Feed tab === */}
      {activeTab === 'feed' && (
        <div className="ledger-panel">
          <div className="ledger-filter-row">
            <span className="ledger-section-label">EVENT FEED</span>
            <select
              className="ledger-filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as LedgerEventType | 'all')}
            >
              <option value="all">All Types</option>
              {eventTypes.map((t) => (
                <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          {filteredEntries.length === 0 && (
            <p className="ledger-empty">The ledger is empty. Nothing has been recorded yet.</p>
          )}

          <div className="ledger-feed">
            {filteredEntries.map((entry) => (
              <LedgerEntryRow
                key={entry.id}
                entry={entry}
                isAdmin
                expanded={expandedEntry === entry.id}
                correlated={expandedEntry === entry.id ? correlatedEntries : []}
                onToggle={() => toggleExpand(entry)}
              />
            ))}
          </div>
        </div>
      )}

      {/* === Timeline tab (V2) === */}
      {activeTab === 'timeline' && (
        <div className="ledger-panel">
          <span className="ledger-section-label">TIMELINE — DAY BY DAY</span>

          {timeline.length === 0 && (
            <p className="ledger-empty">No timeline data. The ledger is empty.</p>
          )}

          {timeline.map((bucket) => (
            <div key={bucket.date} className="ledger-day-bucket">
              <div className="ledger-day-header">
                <span className="ledger-day-label">{bucket.label}</span>
                <span className="ledger-day-count">{bucket.entries.length} event{bucket.entries.length !== 1 ? 's' : ''}</span>
                <div className="ledger-density-bar">
                  <div
                    className="ledger-density-fill"
                    style={{ width: `${Math.round(bucket.density * 100)}%` }}
                  />
                </div>
              </div>
              <div className="ledger-feed">
                {bucket.entries.map((entry) => (
                  <LedgerEntryRow
                    key={entry.id}
                    entry={entry}
                    isAdmin
                    expanded={expandedEntry === entry.id}
                    correlated={expandedEntry === entry.id ? correlatedEntries : []}
                    onToggle={() => toggleExpand(entry)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === Stats tab === */}
      {activeTab === 'stats' && stats && (
        <div className="ledger-panel">
          <span className="ledger-section-label">LEDGER STATISTICS</span>
          <div className="ledger-stats-grid">
            <div className="ledger-stat">
              <span className="ledger-stat-value">{stats.total}</span>
              <span className="ledger-stat-label">total entries</span>
            </div>
            <div className="ledger-stat">
              <span className="ledger-stat-value">{stats.today}</span>
              <span className="ledger-stat-label">today</span>
            </div>
            <div className="ledger-stat">
              <span className="ledger-stat-value">{stats.thisWeek}</span>
              <span className="ledger-stat-label">this week</span>
            </div>
            <div className="ledger-stat">
              <span className="ledger-stat-value">{stats.publicCount}</span>
              <span className="ledger-stat-label">public</span>
            </div>
            <div className="ledger-stat">
              <span className="ledger-stat-value">{stats.redactedCount}</span>
              <span className="ledger-stat-label">redacted</span>
            </div>
            <div className="ledger-stat">
              <span className="ledger-stat-value">{stats.adminOnlyCount}</span>
              <span className="ledger-stat-label">admin only</span>
            </div>
          </div>

          <span className="ledger-section-label">BY TYPE</span>
          <div className="ledger-type-breakdown">
            {Object.entries(stats.typeCounts).map(([type, count]) => (
              <div key={type} className="ledger-type-row">
                <span className="ledger-type-name">{type.replace(/_/g, ' ')}</span>
                <span className="ledger-type-count">{count as number}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === Districts tab (V2) === */}
      {activeTab === 'districts' && (
        <div className="ledger-panel">
          <span className="ledger-section-label">DISTRICT ACTIVITY</span>

          {districtActivity.length === 0 && (
            <p className="ledger-empty">No district activity recorded.</p>
          )}

          <div className="ledger-district-grid">
            {districtActivity.map((d) => (
              <div key={d.district} className="ledger-district-card">
                <div className="ledger-district-name">{d.district.replace(/-/g, ' ')}</div>
                <div className="ledger-district-count">{d.eventCount} event{d.eventCount !== 1 ? 's' : ''}</div>
                <div className="ledger-district-last">
                  last: {new Date(d.lastEvent).toLocaleDateString()}
                </div>
                <div className="ledger-district-types">
                  {d.topTypes.map((t) => (
                    <span key={t} className="ledger-district-type">{t.replace(/_/g, ' ')}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === Continuity tab === */}
      {activeTab === 'continuity' && (
        <div className="ledger-panel">
          <div className="ledger-filter-row">
            <span className="ledger-section-label">CONTINUITY CHECKS</span>
            <button className="old-button" type="button" onClick={runChecks}>Re-Run Checks</button>
          </div>

          {!continuity && (
            <p className="ledger-empty">Running checks...</p>
          )}

          {continuity && (
            <>
              <div className="ledger-stats-grid">
                <div className="ledger-stat">
                  <span className="ledger-stat-value">{continuity.stats.totalChecked}</span>
                  <span className="ledger-stat-label">items checked</span>
                </div>
                <div className="ledger-stat">
                  <span className="ledger-stat-value">{continuity.stats.issuesFound}</span>
                  <span className="ledger-stat-label">issues found</span>
                </div>
                <div className="ledger-stat">
                  <span className={`ledger-stat-value ${continuity.stats.highSeverity > 0 ? 'ledger-stat-alert' : ''}`}>
                    {continuity.stats.highSeverity}
                  </span>
                  <span className="ledger-stat-label">high severity</span>
                </div>
              </div>

              {continuity.issues.length === 0 && (
                <p className="ledger-empty">No issues found. The world is consistent. Suspicious.</p>
              )}

              <div className="ledger-issues">
                {continuity.issues.map((issue) => (
                  <ContinuityIssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// --- Sub-components ---

function LedgerEntryRow({
  entry,
  isAdmin,
  expanded,
  correlated,
  onToggle,
}: {
  entry: LedgerEntry;
  isAdmin: boolean;
  expanded: boolean;
  correlated: LedgerEntry[];
  onToggle: () => void;
}) {
  const showDetail = isAdmin && entry.visibility !== 'redacted';
  const displayLine = showDetail ? (entry.detail || entry.headline) : (entry.redactedLine || entry.headline);

  return (
    <div className={`ledger-entry ledger-vis-${entry.visibility} ${expanded ? 'ledger-entry-expanded' : ''}`}>
      <div
        className="ledger-entry-clickable"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(); }}
      >
        <div className="ledger-entry-topline">
          <span className="ledger-entry-type">{entry.type.replace(/_/g, ' ')}</span>
          <span className="ledger-entry-time">{new Date(entry.timestamp).toLocaleString()}</span>
        </div>
        <p className="ledger-entry-headline">{entry.headline}</p>
        {displayLine !== entry.headline && (
          <p className="ledger-entry-detail">{displayLine}</p>
        )}
        <div className="ledger-entry-meta">
          {entry.actor && <span>actor: {entry.actor}</span>}
          {entry.district && <span>district: {entry.district}</span>}
          {entry.targetType && entry.targetSlug && (
            <span>target: {entry.targetType}/{entry.targetSlug}</span>
          )}
          <span className={`ledger-vis-badge ledger-vis-${entry.visibility}`}>{entry.visibility}</span>
        </div>
      </div>

      {/* V2: Expanded detail with tags and correlations */}
      {expanded && (
        <div className="ledger-entry-expansion">
          {entry.tags.length > 0 && (
            <div className="ledger-entry-tags">
              {entry.tags.map((tag) => (
                <span key={tag} className="ledger-tag ledger-tag-sm">{tag}</span>
              ))}
            </div>
          )}

          {entry.metadata && Object.keys(entry.metadata).length > 0 && (
            <div className="ledger-entry-metadata">
              <span className="ledger-section-label">METADATA</span>
              <pre className="ledger-metadata-pre">{JSON.stringify(entry.metadata, null, 2)}</pre>
            </div>
          )}

          {correlated.length > 0 && (
            <div className="ledger-correlated">
              <span className="ledger-section-label">RELATED EVENTS</span>
              {correlated.map((c) => (
                <div key={c.id} className="ledger-correlated-entry">
                  <span className="ledger-entry-type">{c.type.replace(/_/g, ' ')}</span>
                  <span className="ledger-correlated-headline">{c.headline}</span>
                  <span className="ledger-entry-time">{new Date(c.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}

          {correlated.length === 0 && (
            <p className="ledger-empty">No correlated events found.</p>
          )}
        </div>
      )}
    </div>
  );
}

function ContinuityIssueCard({ issue }: { issue: ContinuityIssue }) {
  return (
    <div className={`ledger-issue ledger-issue-${issue.severity}`}>
      <div className="ledger-issue-topline">
        <span className={`ledger-severity ledger-severity-${issue.severity}`}>{issue.severity}</span>
        <span className="ledger-issue-type">{issue.type.replace(/_/g, ' ')}</span>
      </div>
      <p className="ledger-issue-title">{issue.title}</p>
      <p className="ledger-issue-detail">{issue.detail}</p>
      {issue.suggestion && (
        <p className="ledger-issue-suggestion">Suggestion: {issue.suggestion}</p>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { getAdminLedger, getLedgerStats, seedLedgerIfEmpty } from '@/lib/worldLedger';
import type { LedgerEntry, LedgerEventType } from '@/lib/worldLedger';
import { runContinuityChecks } from '@/lib/continuityChecks';
import type { ContinuityReport, ContinuityIssue } from '@/lib/continuityChecks';

export default function WorldLedgerDashboard() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof getLedgerStats> | null>(null);
  const [continuity, setContinuity] = useState<ContinuityReport | null>(null);
  const [activeTab, setActiveTab] = useState<'feed' | 'stats' | 'continuity'>('feed');
  const [typeFilter, setTypeFilter] = useState<LedgerEventType | 'all'>('all');

  useEffect(() => {
    seedLedgerIfEmpty();
    setEntries(getAdminLedger(100));
    setStats(getLedgerStats());
  }, []);

  function runChecks() {
    const report = runContinuityChecks();
    setContinuity(report);
  }

  const filteredEntries = typeFilter === 'all'
    ? entries
    : entries.filter((e) => e.type === typeFilter);

  const eventTypes: LedgerEventType[] = [...new Set(entries.map(e => e.type))];

  return (
    <div className="ledger-dashboard">
      <div className="ledger-dashboard-header">
        <span className="ledger-dashboard-title">WORLD LEDGER — CONTINUITY ENGINE</span>
      </div>

      <div className="ledger-tabs">
        {(['feed', 'stats', 'continuity'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`ledger-tab ${activeTab === tab ? 'ledger-tab-active' : ''}`}
            onClick={() => {
              setActiveTab(tab);
              if (tab === 'continuity' && !continuity) runChecks();
            }}
          >
            {tab}
          </button>
        ))}
      </div>

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
              <LedgerEntryRow key={entry.id} entry={entry} isAdmin />
            ))}
          </div>
        </div>
      )}

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

function LedgerEntryRow({ entry, isAdmin }: { entry: LedgerEntry; isAdmin: boolean }) {
  const showDetail = isAdmin && entry.visibility !== 'redacted';
  const displayLine = showDetail ? (entry.detail || entry.headline) : (entry.redactedLine || entry.headline);

  return (
    <div className={`ledger-entry ledger-vis-${entry.visibility}`}>
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

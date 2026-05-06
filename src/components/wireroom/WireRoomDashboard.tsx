import { useState, useEffect } from 'react';
import {
  getWireRoomStats,
  getSystemStatus,
  setSystemStatus,
  getActionLog,
  getOpenFlags,
  reviewFlag,
  deauthenticateWireRoom,
  logAction,
} from '@/lib/wireRoom';
import type { SystemStatus, WireRoomAction, ContentFlag } from '@/lib/wireRoom';

export default function WireRoomDashboard() {
  const [stats, setStats] = useState(getWireRoomStats());
  const [status, setStatus] = useState<SystemStatus>(getSystemStatus());
  const [log, setLog] = useState<WireRoomAction[]>([]);
  const [flags, setFlags] = useState<ContentFlag[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'flags' | 'log' | 'systems'>('overview');

  useEffect(() => {
    setStats(getWireRoomStats());
    setStatus(getSystemStatus());
    setLog(getActionLog(30));
    setFlags(getOpenFlags());
  }, []);

  function toggleSystem(key: keyof SystemStatus) {
    const updated = setSystemStatus({ [key]: !status[key] });
    setStatus(updated);
    logAction({
      type: updated[key] ? 'unlock' : 'lock',
      targetType: 'site',
      targetSlug: key,
      reason: `System ${key} ${updated[key] ? 'enabled' : 'disabled'}`,
      actor: 'wire-room-admin',
    });
    setLog(getActionLog(30));
    setStats(getWireRoomStats());
  }

  function handleReviewFlag(flagId: string, dismiss: boolean) {
    reviewFlag(flagId, 'wire-room-admin', dismiss ? 'Dismissed from Wire Room' : 'Reviewed from Wire Room', dismiss);
    setFlags(getOpenFlags());
    setStats(getWireRoomStats());
  }

  function handleLogout() {
    deauthenticateWireRoom();
    window.location.reload();
  }

  return (
    <div className="wire-dashboard">
      <div className="wire-dashboard-header">
        <span className="wire-dashboard-title">WIRE ROOM — OPS CONSOLE</span>
        <button className="old-button wire-logout-btn" type="button" onClick={handleLogout}>Clock Out</button>
      </div>

      <div className="wire-tabs">
        {(['overview', 'flags', 'log', 'systems'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`wire-tab ${activeTab === tab ? 'wire-tab-active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="wire-panel">
          <div className="wire-stats-grid">
            <div className="wire-stat">
              <span className="wire-stat-value">{stats.totalActions}</span>
              <span className="wire-stat-label">total actions</span>
            </div>
            <div className="wire-stat">
              <span className="wire-stat-value wire-stat-alert">{stats.openFlags}</span>
              <span className="wire-stat-label">open flags</span>
            </div>
            <div className="wire-stat">
              <span className="wire-stat-value">{stats.reviewedFlags}</span>
              <span className="wire-stat-label">reviewed</span>
            </div>
            <div className="wire-stat">
              <span className="wire-stat-value">{stats.dismissedFlags}</span>
              <span className="wire-stat-label">dismissed</span>
            </div>
          </div>

          <div className="wire-recent">
            <span className="wire-section-label">RECENT ACTIVITY</span>
            {stats.recentActions.length === 0 && (
              <p className="wire-empty">No actions logged. The wire is quiet.</p>
            )}
            {stats.recentActions.map((action) => (
              <div key={action.id} className="wire-log-entry">
                <span className="wire-log-type">{action.type}</span>
                <span className="wire-log-target">{action.targetType}/{action.targetSlug}</span>
                <span className="wire-log-time">{new Date(action.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'flags' && (
        <div className="wire-panel">
          <span className="wire-section-label">OPEN CONTENT FLAGS</span>
          {flags.length === 0 && (
            <p className="wire-empty">No open flags. The room is clean. Probably.</p>
          )}
          {flags.map((flag) => (
            <div key={flag.id} className="wire-flag-card">
              <div className="wire-flag-meta">
                <span className="wire-flag-target">{flag.targetType}/{flag.targetSlug}</span>
                <span className="wire-flag-time">{new Date(flag.timestamp).toLocaleString()}</span>
              </div>
              <p className="wire-flag-reason">{flag.reason}</p>
              <p className="wire-flag-by">flagged by: {flag.flaggedBy}</p>
              <div className="wire-flag-actions">
                <button className="old-button" type="button" onClick={() => handleReviewFlag(flag.id, false)}>Mark Reviewed</button>
                <button className="old-button" type="button" onClick={() => handleReviewFlag(flag.id, true)}>Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'log' && (
        <div className="wire-panel">
          <span className="wire-section-label">ACTION LOG — LAST 30</span>
          {log.length === 0 && (
            <p className="wire-empty">Nothing on the wire yet.</p>
          )}
          <div className="wire-log-list">
            {log.map((action) => (
              <div key={action.id} className="wire-log-entry">
                <span className="wire-log-type">{action.type}</span>
                <span className="wire-log-target">{action.targetType}/{action.targetSlug}</span>
                <span className="wire-log-reason">{action.reason}</span>
                <span className="wire-log-time">{new Date(action.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'systems' && (
        <div className="wire-panel">
          <span className="wire-section-label">SYSTEM CONTROLS</span>
          <p className="wire-systems-note">Toggle world systems on/off. Changes take effect on next page load for affected components.</p>
          <div className="wire-system-list">
            {(Object.keys(status) as (keyof SystemStatus)[]).map((key) => (
              <div key={key} className="wire-system-row">
                <span className="wire-system-name">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                <button
                  type="button"
                  className={`wire-system-toggle ${status[key] ? 'wire-system-on' : 'wire-system-off'}`}
                  onClick={() => toggleSystem(key)}
                >
                  {status[key] ? 'ON' : 'OFF'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

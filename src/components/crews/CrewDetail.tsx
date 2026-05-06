/**
 * CrewDetail — PR 63 (Crew Builder V2)
 *
 * Client-side crew detail component. Loads crew from localStorage,
 * handles join/leave/disband, shows roster and crew info.
 * Replaces the static-only [slug].astro pattern so user-created
 * crews can also have detail pages.
 */

import { useState, useEffect } from 'react';
import {
  getCrewBySlug,
  joinCrew,
  leaveCrew,
  disbandCrew,
  isInCrew,
  onCrewEvent,
} from '@/lib/crews';
import type { Crew, CrewMember } from '@/lib/crews';

type Props = {
  crewSlug: string;
  userHandle?: string;
  userDisplayName?: string;
};

export default function CrewDetail({
  crewSlug,
  userHandle = 'anonymous',
  userDisplayName = 'Anonymous',
}: Props) {
  const [crew, setCrew] = useState<Crew | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [isFounder, setIsFounder] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [disbanded, setDisbanded] = useState(false);
  const [confirmDisband, setConfirmDisband] = useState(false);

  function refresh() {
    const c = getCrewBySlug(crewSlug);
    setCrew(c);
    setIsMember(isInCrew(crewSlug));
    setIsFounder(c?.foundedBy === userHandle);
  }

  useEffect(() => {
    refresh();
    const unsub = onCrewEvent(() => refresh());
    return unsub;
  }, [crewSlug]);

  function showMsg(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(null), 4000);
  }

  function handleJoin() {
    const ok = joinCrew(crewSlug, userHandle, userDisplayName);
    if (ok) {
      showMsg('Joined. The crew noticed.');
      refresh();
    } else {
      showMsg('Could not join. Already in, or crew is seeded.');
    }
  }

  function handleLeave() {
    const ok = leaveCrew(crewSlug, userHandle);
    if (ok) {
      showMsg('Left. No hard feelings. Probably.');
      refresh();
    } else {
      showMsg('Cannot leave. Founders must disband.');
    }
  }

  function handleDisband() {
    if (!confirmDisband) {
      setConfirmDisband(true);
      return;
    }
    const ok = disbandCrew(crewSlug, userHandle);
    if (ok) {
      setDisbanded(true);
      showMsg('Crew disbanded. The directory has been updated.');
    } else {
      showMsg('Could not disband. You may not be the founder.');
    }
    setConfirmDisband(false);
  }

  if (disbanded) {
    return (
      <div className="crew-detail-disbanded">
        <p className="crew-disbanded-notice">This crew has been disbanded.</p>
        <p className="crew-disbanded-sub">The directory removed the entry. The room will forget eventually.</p>
        <a href="/crews" className="old-button">back to crews</a>
      </div>
    );
  }

  if (!crew) {
    return (
      <div className="crew-detail-notfound">
        <p className="crew-not-found">Crew not found. It may have disbanded or never existed.</p>
        <p className="crew-not-found-sub">The directory does not explain itself.</p>
        <a href="/crews" className="old-button">back to crews</a>
      </div>
    );
  }

  return (
    <div className="crew-detail-v2">
      {/* Meta badges */}
      <div className="crew-detail-meta">
        {!crew.isOfficial && <span className="crew-unofficial-badge">NOT OFFICIAL TURF</span>}
        {crew.isOfficial && <span className="crew-official-badge">RECOGNIZED BY MANAGEMENT</span>}
        <span className="crew-visibility-badge">{crew.visibility.replace(/_/g, ' ')}</span>
        {crew.factionAlignment && (
          <span className="crew-faction-badge">
            aligned: {crew.factionAlignment.replace(/-/g, ' ')}
          </span>
        )}
      </div>

      {/* Tagline */}
      <blockquote className="crew-tagline-block">{crew.tagline}</blockquote>

      {/* Info grid */}
      <div className="crew-detail-info-grid">
        <div className="crew-info-item">
          <span className="crew-info-label">FOUNDED BY</span>
          <a href={`/regulars/${crew.foundedBy}`} className="crew-info-value">@{crew.foundedBy}</a>
        </div>
        <div className="crew-info-item">
          <span className="crew-info-label">FOUNDED</span>
          <span className="crew-info-value">{new Date(crew.foundedAt).toLocaleDateString()}</span>
        </div>
        {crew.district && (
          <div className="crew-info-item">
            <span className="crew-info-label">DISTRICT</span>
            <span className="crew-info-value">{crew.district.replace(/-/g, ' ')}</span>
          </div>
        )}
        <div className="crew-info-item">
          <span className="crew-info-label">MEMBERS</span>
          <span className="crew-info-value">{crew.memberCount}</span>
        </div>
      </div>

      {/* Tags */}
      {crew.tags.length > 0 && (
        <div className="crew-tags crew-detail-tags">
          {crew.tags.map((tag) => (
            <span key={tag} className="crew-tag">{tag}</span>
          ))}
        </div>
      )}

      {/* Feedback message */}
      {message && <p className="crew-roster-feedback">{message}</p>}

      {/* Actions */}
      <div className="crew-detail-actions">
        {!isMember && (
          <button className="old-button" type="button" onClick={handleJoin}>
            Join Crew
          </button>
        )}
        {isMember && !isFounder && (
          <button className="old-button crew-leave-btn" type="button" onClick={handleLeave}>
            Leave
          </button>
        )}
        {isFounder && (
          <button
            className={`old-button crew-disband-btn ${confirmDisband ? 'crew-disband-confirm' : ''}`}
            type="button"
            onClick={handleDisband}
          >
            {confirmDisband ? 'confirm disband — this is permanent' : 'disband crew'}
          </button>
        )}
        {confirmDisband && (
          <button
            className="old-button"
            type="button"
            onClick={() => setConfirmDisband(false)}
          >
            cancel
          </button>
        )}
      </div>

      {/* Roster */}
      <div className="crew-roster">
        <div className="crew-roster-header">
          <span className="crew-roster-count">{crew.members.length} on roster</span>
        </div>
        <ul className="crew-member-list">
          {crew.members.map((member) => (
            <li key={member.handle} className={`crew-member crew-role-${member.role}`}>
              <a href={`/regulars/${member.handle}`} className="crew-member-link">
                <span className="crew-member-name">{member.displayName}</span>
                <div className="crew-member-meta">
                  <span className="crew-member-role">{member.role.replace(/_/g, ' ')}</span>
                  <span className="crew-member-joined">
                    since {new Date(member.joinedAt).toLocaleDateString()}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

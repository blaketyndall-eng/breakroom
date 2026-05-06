import { useState, useEffect } from 'react';
import { getCrewBySlug, joinCrew, leaveCrew, isInCrew } from '@/lib/crews';
import type { Crew, CrewMember } from '@/lib/crews';

type Props = {
  crewSlug: string;
  userHandle?: string;
  userDisplayName?: string;
};

export default function CrewRoster({ crewSlug, userHandle = 'anonymous', userDisplayName = 'Anonymous' }: Props) {
  const [crew, setCrew] = useState<Crew | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setCrew(getCrewBySlug(crewSlug));
    setIsMember(isInCrew(crewSlug));
  }, [crewSlug]);

  function handleJoin() {
    const success = joinCrew(crewSlug, userHandle, userDisplayName);
    if (success) {
      setMessage('Joined. The crew noticed.');
      setCrew(getCrewBySlug(crewSlug));
      setIsMember(true);
    } else {
      setMessage('Could not join. Already in, or crew is seeded.');
    }
    setTimeout(() => setMessage(null), 3500);
  }

  function handleLeave() {
    const success = leaveCrew(crewSlug, userHandle);
    if (success) {
      setMessage('Left. No hard feelings. Probably.');
      setCrew(getCrewBySlug(crewSlug));
      setIsMember(false);
    } else {
      setMessage('Cannot leave. Founders must disband.');
    }
    setTimeout(() => setMessage(null), 3500);
  }

  if (!crew) {
    return <p className="crew-not-found">Crew not found. It may have disbanded or never existed.</p>;
  }

  return (
    <div className="crew-roster">
      <div className="crew-roster-header">
        <span className="crew-roster-count">{crew.members.length} on roster</span>
        {!isMember && (
          <button className="old-button" type="button" onClick={handleJoin}>Join Crew</button>
        )}
        {isMember && (
          <button className="old-button crew-leave-btn" type="button" onClick={handleLeave}>Leave</button>
        )}
      </div>

      {message && <p className="crew-roster-feedback">{message}</p>}

      <ul className="crew-member-list">
        {crew.members.map((member) => (
          <li key={member.handle} className={`crew-member crew-role-${member.role}`}>
            <a href={`/regulars/${member.handle}`} className="crew-member-link">
              <span className="crew-member-name">{member.displayName}</span>
              <span className="crew-member-role">{member.role}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  joinTurf,
  canJoinTurf,
  isLocalMemberOf,
  getJoinRitualText,
  getLocalMembership,
  TURF_JOINED_EVENT,
  DRIFT_JOIN_THRESHOLD,
} from '@/lib/turfMembership';
import { getFactionSignalTotal, FACTION_DRIFT_EVENT } from '@/lib/factionDrift';

type Props = {
  factionSlug: string;
  factionName: string;
};

export default function TurfJoinRitual({ factionSlug, factionName }: Props) {
  const [state, setState] = useState<'hidden' | 'eligible' | 'confirming' | 'joined'>('hidden');
  const [driftScore, setDriftScore] = useState(0);

  useEffect(() => {
    function evaluate() {
      if (isLocalMemberOf(factionSlug)) {
        setState('joined');
        return;
      }
      const score = getFactionSignalTotal(factionSlug);
      setDriftScore(score);
      if (canJoinTurf(factionSlug)) {
        setState('eligible');
      } else {
        setState('hidden');
      }
    }

    evaluate();

    const onDrift = () => evaluate();
    const onJoined = () => evaluate();
    const onStorage = (e: StorageEvent) => {
      if (e.key?.includes('turf-membership') || e.key?.includes('faction-signals')) {
        evaluate();
      }
    };

    window.addEventListener(FACTION_DRIFT_EVENT, onDrift);
    window.addEventListener(TURF_JOINED_EVENT, onJoined);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(FACTION_DRIFT_EVENT, onDrift);
      window.removeEventListener(TURF_JOINED_EVENT, onJoined);
      window.removeEventListener('storage', onStorage);
    };
  }, [factionSlug]);

  if (state === 'hidden') return null;

  const ritual = getJoinRitualText(factionSlug);

  if (state === 'joined') {
    const membership = getLocalMembership();
    return (
      <div className="turf-join-ritual turf-join-ritual--joined">
        <p className="turf-join-ritual__status">ACTIVE MEMBER</p>
        <p className="turf-join-ritual__acknowledged">{ritual.acknowledged}</p>
        {membership?.joinedAt && (
          <p className="turf-join-ritual__date">
            Since {new Date(membership.joinedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    );
  }

  if (state === 'confirming') {
    return (
      <div className="turf-join-ritual turf-join-ritual--confirming">
        <p className="turf-join-ritual__prompt">{ritual.prompt}</p>
        <p className="turf-join-ritual__drift-note">
          Drift score: {driftScore} (threshold: {DRIFT_JOIN_THRESHOLD})
        </p>
        <p className="turf-join-ritual__warning">This goes in your file.</p>
        <div className="turf-join-ritual__actions">
          <button
            className="turf-join-ritual__confirm"
            onClick={async () => {
              const result = await joinTurf(factionSlug);
              if (result) setState('joined');
            }}
          >
            {ritual.confirm}
          </button>
          <button
            className="turf-join-ritual__cancel"
            onClick={() => setState('eligible')}
          >
            Not yet.
          </button>
        </div>
      </div>
    );
  }

  // eligible state
  return (
    <div className="turf-join-ritual turf-join-ritual--eligible">
      <p className="turf-join-ritual__notice">
        The room noticed. Ready to make it official?
      </p>
      <button
        className="turf-join-ritual__begin"
        onClick={() => setState('confirming')}
      >
        Stand with {factionName}
      </button>
    </div>
  );
}

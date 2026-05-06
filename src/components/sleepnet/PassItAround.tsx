import { useState } from 'react';
import { passItAround, getPromotionState, getCanonStatusLabel } from '@/lib/promotionSignals';
import type { CanonStatus } from '@/lib/promotionSignals';

type Props = {
  siteSlug: string;
};

export default function PassItAround({ siteSlug }: Props) {
  const [status, setStatus] = useState<CanonStatus>(() => getPromotionState(siteSlug).canonStatus);
  const [message, setMessage] = useState<string | null>(null);

  function handlePass() {
    const state = passItAround(siteSlug);
    setStatus(state.canonStatus);

    if (state.canonStatus === 'canon') {
      setMessage('Filed. The room noticed.');
    } else if (state.canonStatus === 'locally_famous') {
      setMessage('Known around here now.');
    } else if (state.canonStatus === 'seen_around') {
      setMessage('Seen around. The directory is paying attention.');
    } else {
      setMessage('Passed along. Someone might see it.');
    }

    setTimeout(() => setMessage(null), 4000);
  }

  return (
    <div className="pass-it-around">
      <button className="old-button pass-button" onClick={handlePass} title="Pass this page around the room">
        Pass This Around
      </button>
      {status !== 'unknown' && (
        <span className={`canon-badge canon-${status}`}>{getCanonStatusLabel(status)}</span>
      )}
      {message && <span className="pass-feedback">{message}</span>}
    </div>
  );
}

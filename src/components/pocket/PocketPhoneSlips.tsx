import { useState, useEffect } from 'react';
import { generateDailySlips, getSlipSummary, markSlipRead, getVisibleSlips, recordVisit, type PocketSlip } from '@/lib/pocketSlips';
import { getPocketIdentity } from '@/lib/pocketPersonalization';

/**
 * PocketPhoneSlips — the "slips waiting" widget.
 * Shows 1-5 recent world-state changes as tappable notes.
 * Research: pager messages, Animal Crossing bulletin board, bar napkin notes.
 * Personalized: empty state changes for regulars with handles.
 */

export default function PocketPhoneSlips() {
  const [slips, setSlips] = useState<PocketSlip[]>([]);
  const [summary, setSummary] = useState({ count: 0, label: 'checking...' });

  useEffect(() => {
    // Generate daily slips and record visit
    generateDailySlips();
    recordVisit();
    setSlips(getVisibleSlips());
    setSummary(getSlipSummary());
  }, []);

  function handleSlipClick(slip: PocketSlip) {
    if (!slip.read) {
      markSlipRead(slip.id);
      setSlips(getVisibleSlips());
      setSummary(getSlipSummary());
    }
    if (slip.href) {
      window.location.href = slip.href;
    }
  }

  return (
    <div className="pocket-slips">
      <div className="pocket-section-header">
        Phone Behind The Bar — {summary.label}
      </div>
      {slips.length === 0 ? (
        <div className="pocket-slip-empty">
          {(() => {
            const id = getPocketIdentity();
            if (id.hasRegularFile) return `No slips for ${id.handle}. The phone is quiet.`;
            return 'No slips. The phone is quiet. Or broken. Unclear.';
          })()}
        </div>
      ) : (
        slips.map(slip => (
          <div
            key={slip.id}
            className={`pocket-slip${slip.read ? ' read' : ''}`}
            onClick={() => handleSlipClick(slip)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSlipClick(slip)}
          >
            <div className="pocket-slip-headline">{slip.headline}</div>
            {slip.body && <div className="pocket-slip-body">{slip.body}</div>}
          </div>
        ))
      )}
    </div>
  );
}

import { useState } from 'react';
import { getLostDestination } from '@/lib/getLost';

/**
 * PocketQuickActions — the daily action buttons.
 * Get Lost, Search, Enter Code, Leave Mark, Make One Thing.
 * Research: gashapon micro-delay on Get Lost, arcade button feel.
 */

export default function PocketQuickActions() {
  const [gettingLost, setGettingLost] = useState(false);

  function handleGetLost() {
    setGettingLost(true);
    // Haptic pulse for mobile PWA (subtle, single 15ms vibration)
    if ('vibrate' in navigator) {
      try { navigator.vibrate(15); } catch {}
    }
    // Gashapon-inspired micro-delay before navigation (200-600ms)
    const delay = 200 + Math.random() * 400;
    setTimeout(() => {
      const dest = getLostDestination();
      window.location.href = dest.href;
    }, delay);
  }

  if (gettingLost) {
    return (
      <div className="pocket-actions">
        <div className="pocket-getting-lost">Finding somewhere...</div>
      </div>
    );
  }

  return (
    <div className="pocket-actions">
      <button className="pocket-action-btn primary" onClick={handleGetLost}>
        Get Lost
      </button>
      <a className="pocket-action-btn" href="/sleepnet">
        Search
      </a>
      <a className="pocket-action-btn" href="/pocket/code">
        Enter Code
      </a>
      <a className="pocket-action-btn" href="/sign-the-wall">
        Leave Mark
      </a>
      <a className="pocket-action-btn" href="/pocket/make">
        Make One Thing
      </a>
    </div>
  );
}

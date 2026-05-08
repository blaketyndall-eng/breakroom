import { useState, useEffect } from 'react';
import { getRadioStatus, RADIO_TYPE_LABELS } from '@/lib/radio';
import type { RadioEntry } from '@/lib/radio';

/**
 * RadioNowPlaying — lazy-initializes state via getRadioStatus() so the
 * server-rendered HTML already contains real Now Playing content. This
 * eliminates the first-paint flash that the previous useState(null)
 * + useEffect pattern caused.
 *
 * getRadioStatus() is SSR-safe: loadUserEntries() in @/lib/radio guards
 * typeof window === 'undefined' and returns []; signal/nextUp pickers
 * use Date.now() only.
 *
 * POLISH-3 A: title is <h2> (was <h3>) so document order is
 * h1 banner > h2 NowPlaying > h2 Schedule > h3 log entries.
 */
export default function RadioNowPlaying() {
  const [status, setStatus] = useState<{
    nowPlaying: RadioEntry | null;
    signalStrength: string;
    deadAir: boolean;
    nextUp: string;
  } | null>(() => getRadioStatus());

  useEffect(() => {
    const interval = setInterval(() => setStatus(getRadioStatus()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return null;

  return (
    <div className="radio-now-playing">
      <div className="radio-np-header">
        <span className="radio-np-status">{status.deadAir ? 'DEAD AIR' : 'ON AIR'}</span>
        <span className="radio-np-signal">signal: {status.signalStrength}</span>
      </div>

      {status.nowPlaying && (
        <div className="radio-np-body">
          <span className="radio-np-type">
            {RADIO_TYPE_LABELS[status.nowPlaying.type] || status.nowPlaying.type}
          </span>
          <h2 className="radio-np-title">{status.nowPlaying.title}</h2>
          <p className="radio-np-text">{status.nowPlaying.body}</p>
          {status.nowPlaying.host && (
            <span className="radio-np-host">host: {status.nowPlaying.host}</span>
          )}
        </div>
      )}

      <div className="radio-np-footer">
        <span>next up: {status.nextUp}</span>
      </div>
    </div>
  );
}

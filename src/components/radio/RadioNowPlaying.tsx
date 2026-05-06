import { useState, useEffect } from 'react';
import { getRadioStatus, RADIO_TYPE_LABELS } from '@/lib/radio';
import type { RadioEntry } from '@/lib/radio';

export default function RadioNowPlaying() {
  const [status, setStatus] = useState<{
    nowPlaying: RadioEntry | null;
    signalStrength: string;
    deadAir: boolean;
    nextUp: string;
  } | null>(null);

  useEffect(() => {
    setStatus(getRadioStatus());
    // Refresh every 60s for "live" feel
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
          <h3 className="radio-np-title">{status.nowPlaying.title}</h3>
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

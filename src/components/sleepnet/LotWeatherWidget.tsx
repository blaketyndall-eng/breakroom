import { useEffect, useState } from 'react';
import { getLotConditions, type LotConditions } from '@/lib/lotWeather';

export default function LotWeatherWidget() {
  const [conditions, setConditions] = useState<LotConditions | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'denied' | 'done'>('idle');

  useEffect(() => {
    // Start with generated weather immediately
    getLotConditions().then(setConditions);

    // Try geolocation if available (browser only, user-consented)
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      setLocationStatus('requesting');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationStatus('done');
          getLotConditions({ lat: pos.coords.latitude, lon: pos.coords.longitude }).then(setConditions);
        },
        () => {
          setLocationStatus('denied');
          // Keep generated weather — already displayed
        },
        { timeout: 8000, maximumAge: 300000 }
      );
    }
  }, []);

  if (!conditions) {
    return (
      <section className="old-shell lot-weather-widget">
        <div className="old-header">Lot Conditions / Checking</div>
        <div className="old-body">
          <p className="blink">Reading the sky from the parking lot...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="old-shell lot-weather-widget">
      <div className="old-header">
        Lot Conditions / {conditions.source === 'real' ? 'REAL' : 'GENERATED'}
      </div>
      <div className="old-body">
        <table className="lot-weather-table">
          <tbody>
            <tr>
              <td>Temperature</td>
              <td>{conditions.temperature_f}F — {conditions.hoodie_status}</td>
            </tr>
            <tr>
              <td>Sky</td>
              <td>{conditions.sky}</td>
            </tr>
            <tr>
              <td>Bad Decision Pressure</td>
              <td>{conditions.bad_decision_pressure}</td>
            </tr>
            <tr>
              <td>Neon Visibility</td>
              <td>{conditions.neon_visibility}</td>
            </tr>
          </tbody>
        </table>
        <p className="memo-box">{conditions.lot_advisory}</p>
        {conditions.location_label && (
          <p className="lot-weather-meta">Coordinates: {conditions.location_label}</p>
        )}
        {locationStatus === 'denied' && (
          <p className="lot-weather-meta">Location denied. Generated conditions applied. The lot does not need to know where you are.</p>
        )}
      </div>
    </section>
  );
}

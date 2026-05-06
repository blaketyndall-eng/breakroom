import { useState, useEffect } from 'react';
import { getLotConditions, type LotConditions } from '@/lib/lotWeather';
import { getPocketIdentity } from '@/lib/pocketPersonalization';

/**
 * PocketLotConditions — compact weather/lot status widget.
 * Attempts real weather via geolocation, falls back to generated fiction.
 * Research: old-web weather widgets, status bars, field instrument readouts.
 * Personalized: faction-aware lot notices for turf members.
 */

const FACTION_LOT_NOTICES: Record<string, string[]> = {
  'the-players': ['Table 4 is open.', 'Chalk supply: adequate.', 'The table remembers your last break.'],
  'lot-racers': ['Lot traffic: light.', 'Pavement temperature: optimal.', 'New marks on the asphalt.'],
  'night-drinkers': ['Last call: not yet.', 'Tab status: running.', 'The bar stool is warm.'],
  'the-smokers': ['Wind direction: favorable.', 'The fence has new postings.', 'Break extended indefinitely.'],
  'cowboys': ['Open range conditions.', 'Horizon: clear.', 'The field is as you left it.'],
};

export default function PocketLotConditions() {
  const [conditions, setConditions] = useState<LotConditions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConditions() {
      // Try geolocation
      if ('geolocation' in navigator) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
          });
          const result = await getLotConditions({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
          setConditions(result);
          setLoading(false);
          return;
        } catch {
          // Fall through to generated
        }
      }
      // Fallback: generated fiction
      const result = await getLotConditions();
      setConditions(result);
      setLoading(false);
    }

    fetchConditions();
  }, []);

  if (loading) {
    return (
      <div className="pocket-lot">
        <div className="pocket-section-header">Lot Conditions</div>
        <div className="pocket-lot-line">
          <span className="pocket-lot-label">Status</span>
          <span className="pocket-lot-value">reading instruments...</span>
        </div>
      </div>
    );
  }

  if (!conditions) return null;

  // Personalized lot notice for faction members
  const identity = getPocketIdentity();
  const factionSlug = identity.turf || identity.driftFaction;
  let factionNotice: string | null = null;
  if (factionSlug && FACTION_LOT_NOTICES[factionSlug]) {
    const notices = FACTION_LOT_NOTICES[factionSlug];
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    factionNotice = notices[dayOfYear % notices.length];
  }

  return (
    <div className="pocket-lot">
      <div className="pocket-section-header">Lot Conditions</div>
      <div className="pocket-lot-line">
        <span className="pocket-lot-label">Temp</span>
        <span className="pocket-lot-value">{conditions.temperature_f}°F</span>
      </div>
      <div className="pocket-lot-line">
        <span className="pocket-lot-label">Hoodie</span>
        <span className="pocket-lot-value">{conditions.hoodie_status}</span>
      </div>
      <div className="pocket-lot-line">
        <span className="pocket-lot-label">Sky</span>
        <span className="pocket-lot-value">{conditions.sky}</span>
      </div>
      <div className="pocket-lot-line">
        <span className="pocket-lot-label">Bad Decisions</span>
        <span className="pocket-lot-value">{conditions.bad_decision_pressure}</span>
      </div>
      <div className="pocket-lot-line">
        <span className="pocket-lot-label">Neon</span>
        <span className="pocket-lot-value">{conditions.neon_visibility}</span>
      </div>
      <div className="pocket-lot-line">
        <span className="pocket-lot-label">Advisory</span>
        <span className="pocket-lot-value">{conditions.lot_advisory}</span>
      </div>
      {factionNotice && (
        <div className="pocket-lot-line">
          <span className="pocket-lot-label">Notice</span>
          <span className="pocket-lot-value pocket-lot-faction">{factionNotice}</span>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { getPocketIdentity, getIdentityTier } from '@/lib/pocketPersonalization';

/**
 * PocketSignalBar — top status strip.
 * Shows signal bars (computed from world engagement via PocketIdentity),
 * time, and emotional status.
 * Research: old Nokia signal bars + Tamagotchi status icons.
 */

function getSignalStrength(): number {
  if (typeof window === 'undefined') return 2;
  const id = getPocketIdentity();
  let strength = 1;

  // Drawer engagement
  if (id.drawerCount > 0) strength++;
  if (id.drawerCount > 3) strength++;

  // World engagement
  if (id.doorsFound > 0) strength++;

  // Identity depth: turf or Regular File
  if (id.turf || id.hasRegularFile) strength++;

  // Drift awareness (you're being noticed)
  if (id.driftFaction && id.driftScore >= 2) strength = Math.min(strength + 1, 5);

  return Math.min(strength, 5);
}

function getEmotionalStatus(): string {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) return 'emotionally unavailable';
  if (hour >= 5 && hour < 9) return 'reluctantly online';
  if (hour >= 9 && hour < 12) return 'nominally functional';
  if (hour >= 12 && hour < 14) return 'spiritually on break';
  if (hour >= 14 && hour < 17) return 'professionally distant';
  if (hour >= 17 && hour < 21) return 'off the clock';
  return 'after-hours active';
}

export default function PocketSignalBar() {
  const [signal, setSignal] = useState(2);
  const [status, setStatus] = useState('loading...');

  useEffect(() => {
    setSignal(getSignalStrength());
    setStatus(getEmotionalStatus());
  }, []);

  return (
    <div className="pocket-signal">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className="pocket-signal-bars">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={`pocket-signal-bar${i <= signal ? ' active' : ''}`}
              style={{ height: `${4 + i * 3}px` }}
            />
          ))}
        </div>
        <span>{signal} bar{signal !== 1 ? 's' : ''}</span>
      </div>
      <span>{status}</span>
    </div>
  );
}

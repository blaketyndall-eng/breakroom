/**
 * CatastropheCascade — the CHAOS half of the system-voice grammar.
 *
 * Rendered ONLY on /404.astro. Triggered every time a URL doesn't resolve.
 * Runs through 4 phases over ~8.7s, then redirects to /void.
 *
 *   Phase 'virus'   (0 - 1.2s)   centered Win95 "VIRUS DETECTED" alert with
 *                                 a fast-filling progress bar.
 *   Phase 'popups'  (1.2 - 4.0s) 5 random popups from the chaosPopups pool
 *                                 stagger in across the desktop. The popups
 *                                 PERSIST through the calm phase so users
 *                                 with any popup mid-interaction (Y/N
 *                                 prompts, RPS, Oregon Trail, loyalty card)
 *                                 don't get cut off.
 *   Phase 'calm'    (4.0 - 8.0s) single centered "page may have existed.
 *                                 the room is resetting." dialog. 4-second
 *                                 dwell is intentional: interactive popups
 *                                 like Oregon Trail need time to play out.
 *                                 User can hit OK or ESC to skip ahead.
 *   Phase 'fading'  (8.0 - 8.7s) cascade fades, toast appears, redirect.
 *
 * Restraint rules:
 *   - User can press Esc at ANY time to skip ahead to redirect.
 *   - prefers-reduced-motion: collapses to phase 'calm' instantly,
 *     then redirects after 1.2s.
 *
 * Random rotation:
 *   pickRandomPopups(5) returns a fresh sample on every cascade mount
 *   with rules (≤1 special interactive, ≤1 rude-prompt). Stored in state
 *   on first render so the popups don't reshuffle on re-renders.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import OsDialog from './OsDialog';
import ChaosPopup from './ChaosPopups';
import {
  pickRandomPopups,
  type ChaosPopupVariant,
} from '@/content/data/chaosPopups';

const VIRUS_MS = 1200;
const POPUPS_MS = 2800; // virus → popups at 1.2s, popups → calm at 4.0s
const CALM_MS = 4000;   // calm → fade at 8.0s (gives interactive popups time)
const FADE_MS = 700;    // fade → redirect at 8.7s

type Phase = 'virus' | 'popups' | 'calm' | 'fading';

interface CatastropheCascadeProps {
  /** Where to redirect when the cascade resolves. Defaults to /void. */
  redirectTo?: string;
  /** How many random popups to draw from the pool. Defaults to 5. */
  popupCount?: number;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export default function CatastropheCascade({
  redirectTo = '/void',
  popupCount = 5,
}: CatastropheCascadeProps) {
  const [phase, setPhase] = useState<Phase>('virus');
  const [aborted, setAborted] = useState(false);

  /**
   * The 5 popups picked for THIS cascade. Computed once on first render
   * via useMemo so the cascade is stable across re-renders. Each cascade
   * mount (i.e. each 404 hit) gets a fresh sample.
   */
  const picks = useMemo<ChaosPopupVariant[]>(
    () => pickRandomPopups(popupCount),
    [popupCount],
  );

  /** End the cascade early — used by ESC, [Cancel], or calm-dialog OK. */
  const abort = useCallback(() => {
    setAborted(true);
    setPhase('fading');
  }, []);

  // Phase progression. Reduced-motion fast-forwards to 'calm'.
  useEffect(() => {
    if (prefersReducedMotion()) {
      setPhase('calm');
      const t = window.setTimeout(() => setPhase('fading'), 1200);
      return () => window.clearTimeout(t);
    }

    const t1 = window.setTimeout(() => setPhase('popups'), VIRUS_MS);
    const t2 = window.setTimeout(() => setPhase('calm'), VIRUS_MS + POPUPS_MS);
    const t3 = window.setTimeout(
      () => setPhase('fading'),
      VIRUS_MS + POPUPS_MS + CALM_MS,
    );
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  // ESC at any time → abort to redirect.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') abort();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [abort]);

  // Once we hit 'fading', wait FADE_MS then redirect.
  useEffect(() => {
    if (phase !== 'fading') return;
    const t = window.setTimeout(() => {
      window.location.replace(redirectTo);
    }, FADE_MS);
    return () => window.clearTimeout(t);
  }, [phase, redirectTo]);

  // Visibility rules:
  //   - virus dialog: only during 'virus'
  //   - popups: during 'popups' AND 'calm' (so interactive popups can finish)
  //   - calm dialog: during 'calm' AND 'fading'
  const showVirus = phase === 'virus';
  const showPopups = phase === 'popups' || phase === 'calm';
  const showCalm = phase === 'calm' || phase === 'fading';

  return (
    <div
      className={
        phase === 'fading' ? 'bpc-cascade bpc-cascade--exiting' : 'bpc-cascade'
      }
      role="alert"
      aria-label="Page not found — system reset in progress"
    >
      {/* Phase 1: VIRUS DETECTED — single centered Win95 alert */}
      {showVirus && (
        <div className="bpc-cascade-item" data-slot="virus">
          <OsDialog
            title="VIRUS DETECTED — broadbrain.exe"
            iconKind="error"
            buttons={[
              { label: 'Cancel', onClick: abort },
              { label: 'Allow', isDefault: true, onClick: () => { /* let phase advance */ } },
            ]}
            onClose={abort}
          >
            <p>
              <b>The page is unsafe.</b> A connection to{' '}
              <code>broadbrain.exe</code> is being established.
            </p>
            <div className="bpc-progress" style={{ marginTop: 10 }}>
              <div className="bpc-progress-row">
                <span className="bpc-progress-hourglass" aria-hidden="true" />
                <span>Downloading Virus...</span>
              </div>
              <div className="bpc-progress-bar" aria-label="downloading">
                <div className="bpc-progress-fill" />
              </div>
            </div>
            <p style={{ marginTop: 8, fontSize: 10, color: '#404040' }}>
              <code>0 of 1 file copied.</code> Estimated time remaining:{' '}
              <b>about a minute</b>.
            </p>
          </OsDialog>
        </div>
      )}

      {/* Phase 2: random popups from the chaosPopups pool. Slots 1..5. */}
      {showPopups &&
        picks.map((variant, i) => (
          <ChaosPopup key={variant.id} variant={variant} slot={i + 1} />
        ))}

      {/* Phase 3: calm "page may have existed" centered dialog */}
      {showCalm && (
        <div className="bpc-cascade-item" data-slot="calm">
          <OsDialog
            title="VOID — Page Not Found"
            iconKind="info"
            buttons={[{ label: 'OK', isDefault: true, onClick: abort }]}
            onClose={abort}
          >
            <p>The page may have existed. The room is resetting.</p>
            <p style={{ color: '#404040' }}>
              You will be returned to <code>/void</code> in a moment. Press OK
              to skip the wait. Or finish the popup you were arguing with.
            </p>
          </OsDialog>
        </div>
      )}

      {/* Phase 4 toast — fades in alongside the cascade fadeout */}
      {phase === 'fading' && (
        <div className="bpc-toast">
          {aborted ? '> esc · resetting...' : '> resetting to /void...'}
        </div>
      )}
    </div>
  );
}

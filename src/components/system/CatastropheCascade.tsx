/**
 * CatastropheCascade — the CHAOS half of the system-voice grammar.
 *
 * Rendered ONLY on /404.astro. Triggered every time a URL doesn't resolve.
 * Runs through 5 phases over ~4.5s, then redirects to /void.
 *
 *   Phase 'virus'     (0 - 1.2s):  centered Win95 "VIRUS DETECTED" alert with
 *                                  a fast-filling progress bar. Single dialog.
 *   Phase 'errors'    (1.2 - 2.5s): 6 stacked "Error / Fail" Win95 popups
 *                                   cascade in at preset slot offsets.
 *   Phase 'ads'       (2.5 - 3.5s): 3 lurid late-90s ad popups layer over the
 *                                   error stack (banner, stop-sign, big yellow
 *                                   "DOES IT EVEN MATTER?" type-popup).
 *   Phase 'calm'      (3.5 - 4.5s): single centered dialog with "the page may
 *                                   have existed. the room is resetting."
 *   Phase 'fading'    (4.5 - 5.2s): cascade fades, toast appears, redirect.
 *
 * Restraint rules (per project instructions):
 *   - User can press Esc at any time to skip ahead to redirect.
 *   - User can click any popup [×] to abort the catastrophe immediately.
 *   - prefers-reduced-motion: collapses all phases to phase 'calm' instantly,
 *     then redirects after 1.2s.
 *
 * Image slots:
 *   Stage-3 ads check for Replicate-generated images at /void/adCoffeeTin.jpg,
 *   /void/adFreeHoodies.jpg, /void/adVirusAlert.jpg, etc. If the image
 *   doesn't load, the typography fallback covers it (set in inline onError).
 *   The cascade looks fully complete *without* the images.
 */
import { useCallback, useEffect, useState } from 'react';
import OsDialog from './OsDialog';

const VIRUS_MS = 1200;
const ERRORS_MS = 1300; // virus → errors at 1.2s, errors → ads at 2.5s
const ADS_MS = 1000; // ads → calm at 3.5s
const CALM_MS = 1000; // calm → fade at 4.5s
const FADE_MS = 700; // fade → redirect at 5.2s

type Phase = 'virus' | 'errors' | 'ads' | 'calm' | 'fading';

interface CatastropheCascadeProps {
  /** Where to redirect when the cascade resolves. Defaults to /void. */
  redirectTo?: string;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export default function CatastropheCascade({
  redirectTo = '/void',
}: CatastropheCascadeProps) {
  const [phase, setPhase] = useState<Phase>('virus');
  const [aborted, setAborted] = useState(false);

  /** End the cascade early — used by ESC, [×], or [Cancel]. */
  const abort = useCallback(() => {
    setAborted(true);
    setPhase('fading');
  }, []);

  // Phase-progression timers. Reduced-motion path fast-forwards to calm.
  useEffect(() => {
    if (prefersReducedMotion()) {
      setPhase('calm');
      const t = window.setTimeout(() => setPhase('fading'), 1200);
      return () => window.clearTimeout(t);
    }

    const t1 = window.setTimeout(() => setPhase('errors'), VIRUS_MS);
    const t2 = window.setTimeout(() => setPhase('ads'), VIRUS_MS + ERRORS_MS);
    const t3 = window.setTimeout(
      () => setPhase('calm'),
      VIRUS_MS + ERRORS_MS + ADS_MS,
    );
    const t4 = window.setTimeout(
      () => setPhase('fading'),
      VIRUS_MS + ERRORS_MS + ADS_MS + CALM_MS,
    );
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
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

  // What's visible per phase. Errors persist into the ads phase
  // (real popup hell stacks). Ads persist into calm (then everything fades).
  const showVirus = phase === 'virus';
  const showErrors = phase === 'errors' || phase === 'ads' || phase === 'calm';
  const showAds = phase === 'ads' || phase === 'calm';
  const showCalm = phase === 'calm' || phase === 'fading';

  return (
    <div
      className={phase === 'fading' ? 'bpc-cascade bpc-cascade--exiting' : 'bpc-cascade'}
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
            <p><b>The page is unsafe.</b> A connection to <code>broadbrain.exe</code> is being established.</p>
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
              <code>0 of 1 file copied.</code> Estimated time remaining: <b>about a minute</b>.
            </p>
          </OsDialog>
        </div>
      )}

      {/* Phase 2: 6 cascading "Error / Fail" Win95 popups */}
      {showErrors && (
        <>
          <ErrorPopup slot={1} title="Error" body="Cannot complete operation. Try again later, or earlier." />
          <ErrorPopup slot={2} title="Error" body="A required file is missing. The file disagrees." />
          <ErrorPopup slot={3} title="Error" body="The page is denying it ever existed." />
          <ErrorPopup slot={4} title="Error" body="Cannot find document. Document was last seen at the bar." />
          <ErrorPopup slot={5} title="Failure" body="Operation failed because of operations. See attached: nothing." />
          <ErrorPopup slot={6} title="ERROR" body="EXCEPTION: 0x0000_NOTYOURS" />
        </>
      )}

      {/* Phase 3: ad popups layered over the error stack */}
      {showAds && (
        <>
          {/* Slot 5 reuses the position offset; popups draw on top by z-index */}
          <BannerAdPopup slot={3} title="HEY, CARL!" headline="FREE HOODIES" sub="(none claimed)" />
          <StopSignPopup slot={5} title="caution.exe" stopText="WOAH" copy={['EASY THERE','PARTNER.','THE DOOR','MOVED.']} />
          <DoesItMatterPopup slot={7} />
          <ImageAdPopup
            slot={8}
            title="hotnaps.va — broadbrain partner"
            imgSrc="/void/adCoupons.jpg"
            altText='Coupons? On MY drawer? Yes, allegedly.'
            fallbackHeadline="COUPONS?"
            fallbackSub="On MY drawer?"
            fallbackQuote="It's the Pawn Counter Guy's, I swear."
            fallbackCta="Believe it"
          />
        </>
      )}

      {/* Phase 4: calm "page may have existed" centered dialog */}
      {showCalm && (
        <div className="bpc-cascade-item" data-slot="calm">
          <OsDialog
            title="VOID — Page Not Found"
            iconKind="info"
            buttons={[
              { label: 'OK', isDefault: true, onClick: abort },
            ]}
            onClose={abort}
          >
            <p>The page may have existed. The room is resetting.</p>
            <p style={{ color: '#404040' }}>
              You will be returned to <code>/void</code> in a moment. Press OK to skip the wait.
            </p>
          </OsDialog>
        </div>
      )}

      {/* Phase 5 toast — fades in alongside the cascade fadeout */}
      {phase === 'fading' && (
        <div className="bpc-toast">
          {aborted ? '> esc · resetting...' : '> resetting to /void...'}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/*  Popup primitives — small wrappers around the bpc-popup CSS classes.       */
/*  Each one renders into a numbered cascade slot.                            */
/* ------------------------------------------------------------------------- */

function ErrorPopup({
  slot,
  title,
  body,
}: {
  slot: number;
  title: string;
  body: string;
}) {
  return (
    <div className="bpc-cascade-item" data-slot={slot}>
      <div className="bpc-popup">
        <div className="bpc-popup-titlebar">
          <span className="bpc-popup-title-text">{title}</span>
          <span className="bpc-popup-x" aria-hidden="true">×</span>
        </div>
        <div className="bpc-dialog-body" style={{ background: '#c0c0c0' }}>
          <div className="bpc-dialog-icon" data-kind="error" aria-hidden="true" />
          <div className="bpc-dialog-text"><p>{body}</p></div>
        </div>
        <div className="bpc-dialog-buttons">
          <button type="button" className="bpc-dialog-btn" data-default="true">OK</button>
        </div>
      </div>
    </div>
  );
}

function BannerAdPopup({
  slot,
  title,
  headline,
  sub,
}: {
  slot: number;
  title: string;
  headline: string;
  sub?: string;
}) {
  return (
    <div className="bpc-cascade-item" data-slot={slot}>
      <div className="bpc-popup bpc-popup--banner">
        <div className="bpc-popup-titlebar">
          <span className="bpc-popup-title-text">{title}</span>
          <span className="bpc-popup-x" aria-hidden="true">×</span>
        </div>
        <div className="bpc-popup-body">
          <div>
            <div>{headline}</div>
            {sub && <div style={{ fontSize: 13, marginTop: 6 }}>{sub}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function StopSignPopup({
  slot,
  title,
  stopText,
  copy,
}: {
  slot: number;
  title: string;
  stopText: string;
  copy: string[];
}) {
  return (
    <div className="bpc-cascade-item" data-slot={slot}>
      <div className="bpc-popup bpc-popup--stop">
        <div className="bpc-popup-titlebar">
          <span className="bpc-popup-title-text">{title}</span>
          <span className="bpc-popup-x" aria-hidden="true">×</span>
        </div>
        <div className="bpc-popup-body">
          <div className="bpc-popup-stopsign">{stopText}</div>
          <div className="bpc-popup-stopcopy">
            {copy.map((c, i) => (<div key={i}>{c}</div>))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The "DOES IT EVEN MATTER?" big yellow type-popup. Pure typography —
 * never needs an image. Acts as the cascade's emotional climax.
 */
function DoesItMatterPopup({ slot }: { slot: number }) {
  return (
    <div className="bpc-cascade-item" data-slot={slot}>
      <div className="bpc-popup">
        <div className="bpc-popup-titlebar">
          <span className="bpc-popup-title-text">www.yzzerdd.bpc — Welcome to the Internet!</span>
          <span className="bpc-popup-x" aria-hidden="true">×</span>
        </div>
        <div className="bpc-popup--text">
          <span>DOES IT</span>
          <strong>EVEN MATTER?</strong>
          <span style={{ fontSize: 16, fontWeight: 400, fontStyle: 'italic' }}>
            (the door moved before you got there)
          </span>
          <div>
            <span className="bpc-popup--text-cta">CLICK HERE</span>
          </div>
          <small>this popup was filed by the room. nobody approved it.</small>
        </div>
      </div>
    </div>
  );
}

/**
 * Image-based ad popup with a typography fallback that renders if the
 * Replicate-generated image isn't committed yet. Same pattern as the
 * bootLogo image in VoidBootSequence.
 */
function ImageAdPopup({
  slot,
  title,
  imgSrc,
  altText,
  fallbackHeadline,
  fallbackSub,
  fallbackQuote,
  fallbackCta,
}: {
  slot: number;
  title: string;
  imgSrc: string;
  altText: string;
  fallbackHeadline: string;
  fallbackSub: string;
  fallbackQuote: string;
  fallbackCta: string;
}) {
  const [showFallback, setShowFallback] = useState(false);

  return (
    <div className="bpc-cascade-item" data-slot={slot}>
      <div className="bpc-popup">
        <div className="bpc-popup-titlebar">
          <span className="bpc-popup-title-text">{title}</span>
          <span className="bpc-popup-x" aria-hidden="true">×</span>
        </div>
        {!showFallback && (
          <div className="bpc-popup-body">
            <img
              src={imgSrc}
              alt={altText}
              onError={() => setShowFallback(true)}
            />
          </div>
        )}
        {showFallback && (
          <div className="bpc-popup--text" style={{ background: '#fff5e0' }}>
            <span>{fallbackHeadline}</span>
            <strong>{fallbackSub}</strong>
            <span style={{ fontSize: 14, fontStyle: 'italic', fontWeight: 400 }}>
              "{fallbackQuote}"
            </span>
            <div>
              <span className="bpc-popup--text-cta">{fallbackCta}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

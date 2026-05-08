/**
 * VoidBootSequence — the calm-mode "system voice" entry point on /void.
 *
 * Runs once per browser session. On first visit:
 *   1. Renders fullscreen XP-style boot animation (~2.4s)
 *   2. Fades out boot
 *   3. Shows a single Win95 OsDialog ("Welcome back" with 3 lines)
 *   4. After dismiss, renders the calm yellow welcome strip (preserves
 *      the existing VoidWelcomeStrip behavior so the page never empties)
 *
 * On all subsequent /void visits (within session): skip 1-3, render strip.
 *
 * Storage:
 *   sessionStorage 'breakroom.boot.shown.v1' — flag to skip boot replay
 *   localStorage   'breakroom.regular-file.v1' — handle (if signed in)
 *   localStorage   'breakroom.saved-stuff.v1'  — drawer count
 *   localStorage   'breakroom.top-eight.v1'    — Top-8 size (applause math)
 *   localStorage   'breakroom.faction-signals.v1' — drift count (cosmetic)
 *
 * Reduced motion / SSR:
 *   - SSR renders the strip-only fallback (no boot, no dialog) so the
 *     page is functional before hydration.
 *   - prefers-reduced-motion: collapses boot to instant, dialog still shows.
 *
 * VOID-WS polish (2026-05-07):
 *   - Anonymous default name rotates through a 5-entry pool instead of
 *     the static "frogs" — gives the strip personality across sessions.
 *   - New 2nd row "on the wire: <tick>" pulls from WORLD_TICKS so the
 *     resting state feels alive between boot rituals.
 */
import { useEffect, useMemo, useState } from 'react';
import OsDialog from './OsDialog';
import {
  GREETINGS,
  ROOM_NOTICED,
  WORLD_TICKS,
  pickRandom,
  pickRandomN,
  type WhatsNewLine,
} from '@/content/data/whatsNew';

const BOOT_FLAG = 'breakroom.boot.shown.v1';
const REGULAR_FILE_KEY = 'breakroom.regular-file.v1';
const SAVED_STUFF_KEY = 'breakroom.saved-stuff.v1';
const TOP_EIGHT_KEY = 'breakroom.top-eight.v1';
const FACTION_SIGNALS_KEY = 'breakroom.faction-signals.v1';

/**
 * Anonymous default-name pool. The strip rotates through these for visitors
 * without a Regular File. All five read as "the room's polite shorthand for
 * someone whose name it has not bothered to learn."
 */
const ANONYMOUS_NAMES: readonly string[] = [
  'frogs',
  'walk-in',
  'no-file',
  'stranger',
  'late shift',
];

/** Boot animation duration (matches CSS @keyframes timing). */
const BOOT_VISIBLE_MS = 2400;
const BOOT_FADEOUT_MS = 420;

type Phase = 'idle' | 'boot' | 'booting-out' | 'dialog' | 'strip';

interface RegularLite {
  handle: string;
  displayName: string;
}

function readRegular(): RegularLite | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(REGULAR_FILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.handle === 'string') {
      return {
        handle: parsed.handle,
        displayName:
          typeof parsed.display_name === 'string'
            ? parsed.display_name
            : parsed.handle,
      };
    }
  } catch {
    /* ignored */
  }
  return null;
}

function readListLength(key: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.length;
    if (parsed && typeof parsed === 'object') return Object.keys(parsed).length;
    return 0;
  } catch {
    return 0;
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export default function VoidBootSequence() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [regular, setRegular] = useState<RegularLite | null>(null);
  const [stuff, setStuff] = useState<number>(0);
  const [applause, setApplause] = useState<number>(1847);
  const [driftCount, setDriftCount] = useState<number>(0);

  // Bootstrapping. Decide whether to run the boot or skip straight to strip.
  useEffect(() => {
    const reg = readRegular();
    setRegular(reg);
    setStuff(readListLength(SAVED_STUFF_KEY));
    const top8 = readListLength(TOP_EIGHT_KEY);
    setApplause(reg ? 1847 + top8 * 47 : 1847);
    setDriftCount(readListLength(FACTION_SIGNALS_KEY));

    let alreadyBooted = false;
    try {
      alreadyBooted = window.sessionStorage.getItem(BOOT_FLAG) === '1';
    } catch {
      /* sessionStorage unavailable — treat as fresh session */
    }

    if (alreadyBooted) {
      setPhase('strip');
      return;
    }

    // Reduced motion → skip boot animation, jump to dialog.
    if (prefersReducedMotion()) {
      setPhase('dialog');
      try {
        window.sessionStorage.setItem(BOOT_FLAG, '1');
      } catch {
        /* ignore */
      }
      return;
    }

    setPhase('boot');
    try {
      window.sessionStorage.setItem(BOOT_FLAG, '1');
    } catch {
      /* ignore */
    }

    const fadeTimer = window.setTimeout(() => {
      setPhase('booting-out');
    }, BOOT_VISIBLE_MS);

    const dialogTimer = window.setTimeout(() => {
      setPhase('dialog');
    }, BOOT_VISIBLE_MS + BOOT_FADEOUT_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(dialogTimer);
    };
  }, []);

  /**
   * Compose the 3-line dialog body, picked once per dialog mount.
   * One line about the user's local state (if any), two world ticks,
   * one "room noticed" cue if drift exists.
   */
  const dialogLines = useMemo<WhatsNewLine[]>(() => {
    const lines: WhatsNewLine[] = [];

    if (regular) {
      const stuffPart =
        stuff > 0
          ? `${stuff} item${stuff === 1 ? '' : 's'} filed in your drawer`
          : 'Your drawer is empty. The drawer remembers anyway';
      lines.push({
        body: `Filed under ${regular.handle}. ${stuffPart}.`,
      });
    } else {
      lines.push({
        body: 'No regular file on this machine. You can look around without one.',
      });
    }

    // Two world ticks at random.
    lines.push(...pickRandomN(WORLD_TICKS, 2));

    // If user has any drift signals, surface a "room noticed" cue.
    if (driftCount > 0) {
      lines.push(pickRandom(ROOM_NOTICED));
    }

    return lines;
  }, [regular, stuff, driftCount]);

  const greeting = useMemo(() => pickRandom(GREETINGS), []);

  /**
   * Anonymous-default name pick — random from ANONYMOUS_NAMES per mount.
   * Stable across re-renders within a single VoidBootSequence instance.
   */
  const anonymousName = useMemo(
    () => pickRandom(ANONYMOUS_NAMES as unknown as string[]),
    [],
  );

  /**
   * "On the wire" world-tick ticker — single random pull from WORLD_TICKS.
   * Surfaced as the 2nd row of the welcome strip. Stable across re-renders.
   */
  const wireTick = useMemo<WhatsNewLine>(() => pickRandom(WORLD_TICKS), []);

  // SSR / first paint — render the strip immediately so the page is never empty.
  if (phase === 'idle') {
    return (
      <WelcomeStrip
        name="frogs"
        stuff={null}
        applause={1847}
        signedIn={false}
        wireTick={wireTick.body}
      />
    );
  }

  return (
    <>
      {/* The boot screen — XP-style fullscreen, fades out before dialog. */}
      {(phase === 'boot' || phase === 'booting-out') && (
        <BootSplash exiting={phase === 'booting-out'} />
      )}

      {/* The Win95 welcome dialog — only after boot, only first session visit. */}
      {phase === 'dialog' && (
        <OsDialog
          title={greeting}
          iconKind="info"
          buttons={[
            {
              label: 'OK',
              isDefault: true,
              onClick: () => setPhase('strip'),
            },
          ]}
          onClose={() => setPhase('strip')}
        >
          <p>
            <b>
              {regular ? regular.handle : 'Anonymous visitor'}
            </b>
            {' — '}while you were out:
          </p>
          <ul>
            {dialogLines.map((l, i) => (
              <li key={i}>{l.body}</li>
            ))}
          </ul>
          <p style={{ marginTop: 10, color: '#404040', fontSize: 10 }}>
            Time of entry: <code>1:47 a.m. NST</code>. Press OK to continue.
          </p>
        </OsDialog>
      )}

      {/* The calm yellow strip — always visible after boot/dialog. */}
      <WelcomeStrip
        name={regular ? regular.handle : anonymousName}
        stuff={regular ? stuff : null}
        applause={applause}
        signedIn={!!regular}
        wireTick={wireTick.body}
      />
    </>
  );
}

/* ------------------------------------------------------------------------- */
/*  BootSplash — the actual XP-style boot screen markup.                      */
/* ------------------------------------------------------------------------- */

function BootSplash({ exiting }: { exiting: boolean }) {
  return (
    <div
      className={exiting ? 'bpc-boot bpc-boot--exiting' : 'bpc-boot'}
      role="presentation"
      aria-hidden="true"
    >
      <div className="bpc-boot-stage">
        <div className="bpc-boot-logo">
          {/* When /public/void/bootLogo.jpg lands (Replicate-generated),
              the <img> shows. Until then, the typography fallback below
              renders austere and on-brand. */}
          <img
            src="/void/bootLogo.jpg"
            alt=""
            onError={(e) => {
              // Hide the broken image so the typography fallback shows.
              (e.currentTarget as HTMLImageElement).style.display = 'none';
              const sib = (e.currentTarget.parentElement as HTMLElement)
                ?.nextElementSibling as HTMLElement | null;
              if (sib) sib.style.display = 'block';
            }}
          />
        </div>
        <div style={{ display: 'none', textAlign: 'center' }}>
          <div className="bpc-boot-wordmark">VOID OS</div>
          <div className="bpc-boot-wordmark-sub">acquired by omnishift industries</div>
        </div>

        <div className="bpc-boot-progress" aria-label="loading" />
      </div>

      <div className="bpc-boot-foot">
        © OmniShift Industries — Property Of. Use After 1:47 A.M. Not Recommended.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/*  WelcomeStrip — the calm yellow strip below the marquee on /void.          */
/*                                                                            */
/*  VOID-WS polish: now renders 2 rows. Top row is the original welcome line  */
/*  (Welcome / Stuff / Applause Money / time). Bottom row is a small italic   */
/*  "on the wire: <world-tick>" pulled from WORLD_TICKS. The base .vd-welcome */
/*  CSS stays inline-flex-row for the noscript fallback; we add a modifier    */
/*  .vd-welcome--multi that flips to flex-column when this component mounts.  */
/* ------------------------------------------------------------------------- */

function WelcomeStrip({
  name,
  stuff,
  applause,
  signedIn,
  wireTick,
}: {
  name: string;
  stuff: number | null;
  applause: number;
  signedIn: boolean;
  wireTick: string;
}) {
  const stuffLabel = stuff === null ? '0' : String(stuff);
  const applauseLabel = applause.toLocaleString('en-US');
  return (
    <div className="vd-welcome vd-welcome--multi">
      <div className="vd-welcome-row">
        <span>
          Welcome,{' '}
          {signedIn ? (
            <a href="/locker" className="vd-welcome-link">
              <b>{name}</b>
            </a>
          ) : (
            <b>{name}</b>
          )}
          &nbsp;|&nbsp; Stuff:{' '}
          {signedIn && stuff !== null && stuff > 0 ? (
            <a href="/stuff" className="vd-welcome-link">
              <b>{stuffLabel}</b>
            </a>
          ) : (
            <b>{stuffLabel}</b>
          )}
          &nbsp;|&nbsp; Applause Money: <b>{applauseLabel}</b>
        </span>
        <span className="vd-welcome-time">
          it is <b>1:47 a.m.</b> NST{' '}
          <span className="vd-tiny">(Not Standard Time)</span>
        </span>
      </div>

      <div className="vd-welcome-tick">
        <span className="vd-welcome-tick-label">on the wire:</span>{' '}
        <i>{wireTick}</i>
      </div>

      <style>{`
        .vd-welcome-link {
          color: #1a0a2e !important;
          text-decoration: none !important;
          border-bottom: 2px dotted #cc0099;
        }
        .vd-welcome-link:hover {
          background: #ff3d8a !important;
          color: #fff !important;
        }
        /* VOID-WS polish: flip the strip to a 2-row column layout. */
        .vd-welcome--multi {
          flex-direction: column !important;
          align-items: stretch !important;
          gap: 2px;
          padding: 4px 14px 6px !important;
        }
        .vd-welcome-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .vd-welcome-tick {
          font-family: 'Special Elite', 'Courier New', monospace;
          font-size: 10px;
          color: #5a3066;
          letter-spacing: 0.02em;
          line-height: 1.4;
          border-top: 1px dotted #cc9900;
          padding-top: 3px;
          margin-top: 1px;
        }
        .vd-welcome-tick-label {
          color: #cc0099;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-size: 9px;
        }
        .vd-welcome-tick i {
          color: #1a0a2e;
        }
      `}</style>
    </div>
  );
}

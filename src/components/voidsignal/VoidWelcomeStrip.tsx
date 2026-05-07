/**
 * VoidWelcomeStrip — data-driven welcome strip on /void homepage.
 *
 * Reads the local Regular File handle + saved Stuff count + Top-8 size
 * to render a personalized strip for returning users; falls back to the
 * flavor "frogs / 0 / 1,847" defaults for anonymous viewers.
 *
 * Replaces the static <div class="vd-welcome">…</div> block on /void
 * homepage. Keeps the same visual structure (yellow strip, mono font for
 * time, NST footnote) so it slots in without restyle.
 *
 * Storage keys consulted:
 *   breakroom.regular-file.v1     — for handle + display_name
 *   breakroom.saved-stuff.v1      — for Stuff drawer count (any shape; we just
 *                                    count entries)
 *   breakroom.top-eight.v1        — for Top-8 size (cosmetic Applause Money substitute)
 */
import { useEffect, useState } from 'react';

const REGULAR_FILE_KEY = 'breakroom.regular-file.v1';
const SAVED_STUFF_KEY = 'breakroom.saved-stuff.v1';
const TOP_EIGHT_KEY = 'breakroom.top-eight.v1';

function readRegular(): { handle: string; displayName: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(REGULAR_FILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.handle === 'string') {
      return {
        handle: parsed.handle,
        displayName:
          typeof parsed.display_name === 'string' ? parsed.display_name : parsed.handle,
      };
    }
  } catch {
    /* fall through */
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
    // Some shapes are objects keyed by id — count keys.
    if (parsed && typeof parsed === 'object') return Object.keys(parsed).length;
    return 0;
  } catch {
    return 0;
  }
}

export default function VoidWelcomeStrip() {
  // Default flavor values (the static homepage shipped with these).
  const [name, setName] = useState<string>('frogs');
  const [stuff, setStuff] = useState<number | null>(null);
  const [applause, setApplause] = useState<number>(1847);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const reg = readRegular();
    if (reg) {
      setName(reg.handle);
      setSignedIn(true);
    }
    setStuff(readListLength(SAVED_STUFF_KEY));
    const top8 = readListLength(TOP_EIGHT_KEY);
    // Applause Money: keep the joke, but make it move with Top-8 fills if signed in
    // so returning users see a tiny number tick that responds to actions.
    setApplause(reg ? 1847 + top8 * 47 : 1847);
  }, []);

  const stuffLabel = stuff === null ? '0' : String(stuff);
  const applauseLabel = applause.toLocaleString('en-US');

  return (
    <div className="vd-welcome">
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
          <a href="/stuff" className="vd-welcome-link"><b>{stuffLabel}</b></a>
        ) : (
          <b>{stuffLabel}</b>
        )}
        &nbsp;|&nbsp; Applause Money: <b>{applauseLabel}</b>
      </span>
      <span className="vd-welcome-time">
        it is <b>1:47 a.m.</b> NST{' '}
        <span className="vd-tiny">(Not Standard Time)</span>
      </span>

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
      `}</style>
    </div>
  );
}

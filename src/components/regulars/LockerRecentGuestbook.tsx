/**
 * LockerRecentGuestbook — shows the most recent signatures left on your file.
 *
 * Reads the viewer's handle from local Regular File, then pulls the latest
 * guestbook entries for that handle. Empty state in-world ("Nobody signed
 * yet."). Mounts client:idle since the data loads from localStorage and
 * the section isn't above-the-fold.
 *
 * For your own file we show all signatures — moderation (delete) is a
 * future affordance, not here in V2.
 */
import { useEffect, useState } from 'react';
import {
  getProfileGuestbook,
  type ProfileGuestbookEntry,
} from '@/lib/profileGuestbook';

const VIEWER_KEY = 'breakroom.regular-file.v1';

function readHandle(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(VIEWER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed?.handle === 'string' ? parsed.handle : null;
  } catch {
    return null;
  }
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 'a while ago';
  const diffMs = Date.now() - then;
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function LockerRecentGuestbook() {
  const [handle, setHandle] = useState<string | null>(null);
  const [entries, setEntries] = useState<ProfileGuestbookEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const h = readHandle();
    setHandle(h);
    if (h) setEntries(getProfileGuestbook(h, 5));
    setHydrated(true);
  }, []);

  if (!hydrated) return <p className="lrg-empty">loading…</p>;

  if (!handle) {
    return (
      <p className="lrg-empty">
        save a handle in your file first. the wall keeps signatures keyed by handle.
      </p>
    );
  }

  if (entries.length === 0) {
    return (
      <p className="lrg-empty">
        Nobody signed your wall yet. Or they did and it didn't count.{' '}
        <a href={`/regulars/${handle}`} target="_blank" rel="noopener">
          open your public view
        </a>{' '}
        and tell a friend the URL.
      </p>
    );
  }

  return (
    <div className="lrg-list">
      {entries.map((e) => (
        <div className="lrg-entry" key={e.id}>
          <div className="lrg-head">
            <b>{e.signerDisplayName}</b>
            <span className="lrg-handle">@{e.signerHandle}</span>
            <span className="lrg-time">{timeAgo(e.signedAt)}</span>
          </div>
          <p className="lrg-body">{e.body}</p>
        </div>
      ))}

      <style>{`
        .lrg-empty {
          font-family: var(--type-mono, 'Courier New', monospace);
          font-size: 12px; color: #5a513f; font-style: italic;
        }
        .lrg-empty a { color: #b00020; }
        .lrg-list { display: flex; flex-direction: column; gap: 8px; }
        .lrg-entry {
          background: #f6f3ec; border: 1px solid #14110e;
          padding: 6px 10px;
        }
        .lrg-head {
          display: flex; gap: 6px; align-items: baseline; flex-wrap: wrap;
          font-size: 11px; margin-bottom: 4px;
        }
        .lrg-head b { font-family: 'Comfortaa', sans-serif; color: #14110e; font-size: 13px; }
        .lrg-handle { font-family: var(--type-mono, 'Courier New', monospace); color: #6b8c2d; }
        .lrg-time {
          font-family: var(--type-mono, 'Courier New', monospace);
          color: #888; margin-left: auto;
        }
        .lrg-body { font-size: 13px; line-height: 1.4; color: #14110e; }
      `}</style>
    </div>
  );
}

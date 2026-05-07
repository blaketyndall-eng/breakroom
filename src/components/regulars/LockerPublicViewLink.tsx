/**
 * LockerPublicViewLink — small banner on /locker linking to your public profile.
 *
 * Reads the local Regular File handle. If absent, shows a stub prompt to make
 * one. Mounts client:load so the link is interactive immediately and reflects
 * the current handle without an SSR roundtrip.
 *
 * Voice: presents the link as "the public version" — what someone else sees
 * when they hit /regulars/<your-handle>. Soft, not promotional.
 */
import { useEffect, useState } from 'react';

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

export default function LockerPublicViewLink() {
  const [handle, setHandle] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHandle(readHandle());
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  if (!handle) {
    return (
      <div className="locker-public-view locker-public-view--empty">
        <span className="lpv-label">PUBLIC VIEW</span>
        <span className="lpv-text">
          your file has no handle yet. once you save one in the editor below,
          this will become a clickable link to <code>/regulars/your-handle</code>.
        </span>
      </div>
    );
  }

  const href = `/regulars/${handle}`;

  return (
    <div className="locker-public-view">
      <span className="lpv-label">PUBLIC VIEW</span>
      <span className="lpv-text">
        anyone can see your file at{' '}
        <a className="lpv-link" href={href} target="_blank" rel="noopener">
          {href}
        </a>
        . open it in a new tab to see what the wall sees.
      </span>
      <a className="lpv-button" href={href} target="_blank" rel="noopener">
        Open public view →
      </a>

      <style>{`
        .locker-public-view {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          margin: 14px 0;
          background: #15120f;
          color: #d8c9a6;
          border: 2px solid #14110e;
          font-family: var(--type-mono, 'Courier New', monospace);
          font-size: 12px;
        }
        .locker-public-view--empty {
          background: #efe7d3;
          color: #14110e;
          border-style: dashed;
        }
        .lpv-label {
          background: #ffd700;
          color: #14110e;
          padding: 2px 8px;
          letter-spacing: 0.12em;
          font-weight: 700;
          border: 1px solid #14110e;
        }
        .lpv-text {
          flex: 1;
          min-width: 200px;
          line-height: 1.4;
        }
        .lpv-text code {
          background: rgba(255, 255, 255, 0.1);
          padding: 1px 4px;
        }
        .lpv-link {
          color: #33ff66 !important;
          font-weight: 700;
        }
        .locker-public-view--empty .lpv-link {
          color: #b00020 !important;
        }
        .lpv-button {
          padding: 6px 12px;
          background: #ffd700;
          color: #14110e !important;
          border: 2px outset #ffec80;
          font-family: inherit;
          font-weight: 700;
          font-size: 12px;
          text-decoration: none !important;
          letter-spacing: 0.04em;
        }
        .lpv-button:hover { background: #ff3d8a; color: #fff !important; }
      `}</style>
    </div>
  );
}

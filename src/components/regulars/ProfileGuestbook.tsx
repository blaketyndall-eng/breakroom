/**
 * ProfileGuestbook — sign + display island.
 *
 * Props:
 *   targetKey      — opaque string identifying the guestbook (profile handle
 *                    on /regulars/[handle], or site slug on /sites/[slug] in V3).
 *   contextLabel   — what the user is signing (e.g. "@blake's file", "moths.afterhours").
 *                    Shown in the form copy so signers know where they are.
 *   selfHandle?    — if provided AND === current viewer's handle, show "this is your
 *                    page" hint and a "your file" pill on entries you've signed.
 *
 * Storage flows through src/lib/profileGuestbook.ts (local-first). Reads from
 * localStorage on mount; appends new entries client-side; no SSR data needed.
 *
 * Voice (per project guardrails):
 *   - Empty state: "Nobody signed yet. Or they did and it didn't count."
 *   - Submission feedback in-world ("Filed."), never "success" / "thanks".
 *   - 280-char body cap shown as remaining-count, not as error.
 */
import { useEffect, useMemo, useState } from 'react';
import {
  GUESTBOOK_BODY_MAX,
  getProfileGuestbook,
  signProfileGuestbook,
  type ProfileGuestbookEntry,
} from '@/lib/profileGuestbook';

interface Props {
  targetKey: string;
  contextLabel: string;
  /** Optional: handle of the current viewer (read from local Regular File). */
  selfHandle?: string;
}

const VIEWER_KEY = 'breakroom.regular-file.v1';

function readViewerIdentity(): { handle: string; displayName: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(VIEWER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.handle === 'string') {
      return {
        handle: parsed.handle,
        displayName: typeof parsed.display_name === 'string' ? parsed.display_name : parsed.handle,
      };
    }
  } catch {
    /* fall through */
  }
  return null;
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

export default function ProfileGuestbook({ targetKey, contextLabel, selfHandle }: Props) {
  const [entries, setEntries] = useState<ProfileGuestbookEntry[]>([]);
  const [body, setBody] = useState('');
  const [filed, setFiled] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [viewer, setViewer] = useState<{ handle: string; displayName: string } | null>(null);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    setEntries(getProfileGuestbook(targetKey, 25));
    setViewer(readViewerIdentity());
    setHydrated(true);
  }, [targetKey]);

  const remaining = GUESTBOOK_BODY_MAX - body.length;
  const isOwnPage = useMemo(
    () => Boolean(selfHandle && viewer && viewer.handle === selfHandle),
    [selfHandle, viewer],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const saved = signProfileGuestbook(targetKey, {
      body,
      signerHandle: viewer?.handle ?? 'anonymous',
      signerDisplayName: viewer?.displayName ?? 'unknown',
    });
    if (saved) {
      setEntries((prev) => [saved, ...prev].slice(0, 25));
      setBody('');
      setFiled(true);
      // Clear "Filed." hint after a moment.
      window.setTimeout(() => setFiled(false), 2400);
    }
  }

  return (
    <div className="pgb-root">
      {!isOwnPage && (
        <form className="pgb-form" onSubmit={handleSubmit}>
          <label className="pgb-form-label" htmlFor={`pgb-body-${targetKey}`}>
            sign {contextLabel}
          </label>
          <textarea
            id={`pgb-body-${targetKey}`}
            className="pgb-textarea"
            rows={2}
            maxLength={GUESTBOOK_BODY_MAX}
            placeholder="leave a mark. or don't."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="pgb-form-row">
            <span className="pgb-as">
              as {viewer ? <b>@{viewer.handle}</b> : <i>anonymous</i>}
            </span>
            <span className="pgb-counter" aria-live="polite">
              {remaining} chars left
            </span>
            <button type="submit" disabled={!body.trim()} className="pgb-submit">
              File signature
            </button>
          </div>
          {filed && <p className="pgb-filed-hint">Filed. The wall noticed.</p>}
        </form>
      )}

      {isOwnPage && (
        <p className="pgb-self-hint">
          this is your file. signatures from others appear below. the wall does not
          let you sign your own.
        </p>
      )}

      <div className="pgb-list">
        {!hydrated ? (
          <p className="pgb-empty">loading the wall…</p>
        ) : entries.length === 0 ? (
          <p className="pgb-empty">
            Nobody signed yet. Or they did and it didn't count.
          </p>
        ) : (
          entries.map((e) => (
            <div className="pgb-entry" key={e.id}>
              <div className="pgb-entry-head">
                <span className="pgb-entry-signer">
                  <b>{e.signerDisplayName}</b>
                  <span className="pgb-entry-handle">@{e.signerHandle}</span>
                </span>
                <span className="pgb-entry-time">{timeAgo(e.signedAt)}</span>
              </div>
              <p className="pgb-entry-body">{e.body}</p>
            </div>
          ))
        )}
      </div>

      <style>{`
        .pgb-root { display: flex; flex-direction: column; gap: 10px; }

        .pgb-form {
          display: flex; flex-direction: column; gap: 6px;
          background: #fff8d0; border: 2px solid #1a0a2e;
          padding: 8px 10px;
        }
        .pgb-form-label {
          font-family: var(--type-mono, 'Courier New', monospace);
          font-size: 11px; color: #5a3066; letter-spacing: 0.5px;
        }
        .pgb-textarea {
          width: 100%; resize: vertical; min-height: 40px;
          padding: 6px 8px; border: 1px solid #1a0a2e; background: #fff;
          font-family: inherit; font-size: 13px;
        }
        .pgb-form-row {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
          font-family: var(--type-mono, 'Courier New', monospace); font-size: 11px;
        }
        .pgb-as { color: #1a0a2e; }
        .pgb-as b { color: #cc0099; }
        .pgb-counter { color: #6b2d8c; margin-left: auto; }
        .pgb-submit {
          padding: 4px 10px; background: #ffd700; border: 2px outset #ffec80;
          font-family: inherit; font-weight: 700; cursor: pointer;
        }
        .pgb-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .pgb-filed-hint {
          font-family: var(--type-mono, 'Courier New', monospace);
          font-size: 11px; color: #6b8c2d; font-style: italic;
        }

        .pgb-self-hint {
          background: #fff; border: 1px dashed #cc9900; padding: 6px 8px;
          font-family: var(--type-mono, 'Courier New', monospace);
          font-size: 11px; color: #5a513f;
        }

        .pgb-list { display: flex; flex-direction: column; gap: 8px; }
        .pgb-empty {
          font-family: var(--type-mono, 'Courier New', monospace);
          font-size: 12px; color: #5a513f; font-style: italic;
          padding: 6px 0;
        }
        .pgb-entry {
          background: #fff; border: 2px solid #1a0a2e;
          padding: 6px 10px; box-shadow: 2px 2px 0 #cc0099;
        }
        .pgb-entry-head {
          display: flex; justify-content: space-between; align-items: baseline;
          gap: 8px; flex-wrap: wrap;
          font-size: 11px; margin-bottom: 4px;
        }
        .pgb-entry-signer { display: inline-flex; align-items: baseline; gap: 6px; }
        .pgb-entry-signer b { font-family: 'Comfortaa', sans-serif; color: #1a0a2e; font-size: 13px; }
        .pgb-entry-handle {
          font-family: var(--type-mono, 'Courier New', monospace);
          color: #6b8c2d;
        }
        .pgb-entry-time {
          font-family: var(--type-mono, 'Courier New', monospace);
          color: #888;
        }
        .pgb-entry-body { font-size: 13px; line-height: 1.4; color: #1a0a2e; }
      `}</style>
    </div>
  );
}

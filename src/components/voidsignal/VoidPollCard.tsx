/**
 * VoidPollCard — daily poll on /void homepage.
 *
 * Reads a single poll from voidPolls.ts (rotated by date). Persists vote
 * + per-option counts to localStorage. After voting, switches to a
 * results bar view. Clicking "Results" toggles back to the bar view
 * without revealing other votes you didn't cast.
 *
 * Local-first only — counts are seeded with a deterministic baseline so
 * the bars don't read 100%/0%/0% before any votes are cast.
 *
 * Storage keys:
 *   breakroom.void-poll.{pollId}.vote        — index of chosen option (number) or absent
 *   breakroom.void-poll.{pollId}.counts.v1   — array of per-option vote counts (number[])
 */
import { useEffect, useState } from 'react';
import { getTodaysPoll } from '@/content/data/voidPolls';

const VOTE_KEY = (id: string) => `breakroom.void-poll.${id}.vote`;
const COUNTS_KEY = (id: string) => `breakroom.void-poll.${id}.counts.v1`;

// Hash poll id → deterministic seed counts so bars read non-zero from the start.
function seedCounts(pollId: string, optionCount: number): number[] {
  let h = 0;
  for (let i = 0; i < pollId.length; i++) {
    h = ((h << 5) - h + pollId.charCodeAt(i)) | 0;
  }
  const seed = Math.abs(h);
  // distribute ~80–220 votes across options, weighted unevenly
  return Array.from({ length: optionCount }, (_, i) => {
    const base = ((seed >> (i * 3)) & 0x3f) + 8;
    return base + Math.floor((seed % (i + 5)) * 1.7);
  });
}

function loadCounts(pollId: string, optionCount: number): number[] {
  if (typeof window === 'undefined') return seedCounts(pollId, optionCount);
  try {
    const raw = window.localStorage.getItem(COUNTS_KEY(pollId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === optionCount) {
        return parsed.map((n) => (typeof n === 'number' ? n : 0));
      }
    }
  } catch {
    /* fall through */
  }
  return seedCounts(pollId, optionCount);
}

function saveCounts(pollId: string, counts: number[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(COUNTS_KEY(pollId), JSON.stringify(counts));
  } catch {
    /* ignore */
  }
}

function loadVote(pollId: string): number | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(VOTE_KEY(pollId));
  if (raw === null) return null;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

export default function VoidPollCard() {
  const [poll] = useState(() => getTodaysPoll());
  const [counts, setCounts] = useState<number[]>(() =>
    loadCounts(poll.id, poll.options.length),
  );
  const [vote, setVote] = useState<number | null>(null);
  const [pendingChoice, setPendingChoice] = useState<number | null>(null);
  const [view, setView] = useState<'vote' | 'results'>('vote');

  // Hydrate from storage on mount.
  useEffect(() => {
    const v = loadVote(poll.id);
    setVote(v);
    setView(v === null ? 'vote' : 'results');
  }, [poll.id]);

  function castVote(idx: number) {
    if (typeof window === 'undefined') return;
    const next = [...counts];
    next[idx] = (next[idx] ?? 0) + 1;
    setCounts(next);
    saveCounts(poll.id, next);
    window.localStorage.setItem(VOTE_KEY(poll.id), String(idx));
    setVote(idx);
    setView('results');
  }

  const total = counts.reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="vd-poll">
      <div className="vd-poll-head">VoidPoll</div>
      <div className="vd-poll-body">
        <p>{poll.prompt}</p>

        {view === 'vote' && (
          <>
            {poll.options.map((opt, i) => (
              <label key={i}>
                <input
                  type="radio"
                  name="vp"
                  checked={pendingChoice === i}
                  onChange={() => setPendingChoice(i)}
                />{' '}
                {opt}
              </label>
            ))}
            <div className="vd-poll-btns">
              <button
                type="button"
                disabled={pendingChoice === null}
                onClick={() => pendingChoice !== null && castVote(pendingChoice)}
              >
                Vote
              </button>
              <button
                type="button"
                onClick={() => setView('results')}
              >
                Results
              </button>
            </div>
            {vote !== null && (
              <p className="vd-poll-foot">
                you already voted: <b>{poll.options[vote]}</b>
              </p>
            )}
          </>
        )}

        {view === 'results' && (
          <>
            {poll.options.map((opt, i) => {
              const pct = Math.round(((counts[i] ?? 0) / total) * 100);
              const isYou = vote === i;
              return (
                <div key={i} className="vp-row">
                  <div className="vp-row-label">
                    {opt} {isYou && <span className="vp-row-you">(you)</span>}
                  </div>
                  <div className="vp-row-bar">
                    <div className="vp-row-fill" style={{ width: `${pct}%` }} />
                    <span className="vp-row-pct">{pct}%</span>
                  </div>
                </div>
              );
            })}
            <div className="vd-poll-btns">
              <button type="button" onClick={() => setView('vote')}>
                {vote === null ? 'Vote' : 'Change vote'}
              </button>
            </div>
            <p className="vd-poll-foot">
              {total} votes · numbers are political
            </p>
          </>
        )}
      </div>

      <style>{`
        .vp-row { margin-bottom: 6px; }
        .vp-row-label { font-size: 11px; color: #1a0a2e; }
        .vp-row-you { color: #cc0099; font-weight: 700; }
        .vp-row-bar {
          position: relative; background: #fff8d0; border: 1px solid #1a0a2e;
          height: 12px; overflow: hidden;
        }
        .vp-row-fill {
          background: linear-gradient(90deg, #cc0099 0%, #ff3d8a 100%);
          height: 100%;
        }
        .vp-row-pct {
          position: absolute; top: -1px; right: 4px; font-size: 9px;
          color: #1a0a2e; font-family: 'Courier New', monospace; line-height: 14px;
        }
        .vd-poll-foot {
          font-size: 10px; color: #6b2d8c; margin-top: 6px; font-style: italic;
        }
        .vd-poll-btns button:disabled {
          opacity: 0.5; cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

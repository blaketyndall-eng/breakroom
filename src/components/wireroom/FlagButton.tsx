/**
 * FlagButton — PR 74 (Wire Room Flag-to-Action Loop)
 *
 * Tiny per-item flag affordance. Anyone (signed in or anonymous) can
 * report content; submissions go to wireRoom.flagContent which writes
 * the flag, funnels through logAction, and emits an admin_only ledger
 * entry visible in /wire-room/ledger.
 *
 * Throttling: a per-target 60-second cooldown stored in localStorage
 * keeps repeated clicks from spamming the queue. Multiple users on the
 * same target are NOT throttled (each viewer's cooldown is local).
 *
 * Voice rule: short, in-world. The button reads "flag" lowercase.
 * After flagging, the affordance becomes a quiet receipt — never a
 * thank-you, never an "are you sure?" modal.
 *
 * Targeting (per WireRoomAction.targetType):
 *   - guestbook_entry: targetSlug encodes `${targetKey}::${entryId}`
 *   - agent_comment / site / crew / regular / stuff: targetSlug is the
 *     direct slug for that surface.
 */
import { useState } from 'react';
import { flagContent } from '@/lib/wireRoom';

const COOLDOWN_KEY_PREFIX = 'breakroom.flag-cooldown.v1.';
const COOLDOWN_MS = 60_000; // 60s per-target

type FlagTargetType =
  | 'site'
  | 'crew'
  | 'regular'
  | 'stuff'
  | 'guestbook_entry'
  | 'agent_comment';

interface Props {
  targetType: FlagTargetType;
  targetSlug: string;
  flaggedBy?: string;
  /**
   * Optional per-button reason override. Default is "reported by
   * visitor" — admins can read the flag context from the targetSlug
   * and decide what to do.
   */
  reason?: string;
}

function readCooldown(targetSlug: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = window.localStorage.getItem(COOLDOWN_KEY_PREFIX + targetSlug);
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

function writeCooldown(targetSlug: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      COOLDOWN_KEY_PREFIX + targetSlug,
      String(Date.now() + COOLDOWN_MS),
    );
  } catch {
    /* swallow quota errors */
  }
}

export default function FlagButton({
  targetType,
  targetSlug,
  flaggedBy = 'anonymous',
  reason = 'reported by visitor',
}: Props) {
  const [filed, setFiled] = useState(false);

  function handleClick() {
    // Short-circuit if cooldown still active.
    const until = readCooldown(targetSlug);
    if (Date.now() < until) {
      // Already noted recently; show the receipt without re-filing.
      setFiled(true);
      return;
    }

    try {
      flagContent({
        targetType,
        targetSlug,
        reason,
        flaggedBy,
      });
      writeCooldown(targetSlug);
      setFiled(true);
    } catch {
      /* failure is silent — the flag is observability, not core flow */
    }
  }

  if (filed) {
    return (
      <span
        className="wr-flag-receipt"
        title="Wire Room received the flag."
        style={{
          fontFamily: 'var(--type-mono, "Courier New", monospace)',
          fontSize: 10,
          color: '#7a5a2e',
          fontStyle: 'italic',
        }}
      >
        flagged. wire knows.
      </span>
    );
  }

  return (
    <button
      type="button"
      className="wr-flag-btn"
      onClick={handleClick}
      title="Flag this for Wire Room review"
      style={{
        background: 'transparent',
        border: 'none',
        padding: 0,
        margin: 0,
        cursor: 'pointer',
        fontFamily: 'var(--type-mono, "Courier New", monospace)',
        fontSize: 10,
        color: '#888',
        textDecoration: 'underline dotted',
      }}
    >
      flag
    </button>
  );
}

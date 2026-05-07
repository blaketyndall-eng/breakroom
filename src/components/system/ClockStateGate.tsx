/**
 * ClockStateGate — soft visual gate for world-coherent profile pages.
 *
 * Renders an <OsDialog> overlay when the user's clock-state mismatches
 * what the current page expects. Used to enforce the world-coherence
 * doctrine from the cleanup audit (CLEAN-2, 2026-05-07):
 *
 *   /portal (OmniShift Employee File)  → expects 'omnishift' (state=on_shift)
 *   /locker (Void Signal Regular File) → expects 'voidsignal' (state=clocked_out|still_out)
 *
 * SOFT, NOT HARD. The dialog has a [Cancel] button that dismisses the
 * gate, leaving the underlying page renderable. Reasoning:
 *   - Deep-link sharing should still work (peek without committing).
 *   - The dialog is a RITUAL, not access control. Story > rigor.
 *   - The gate sets the tone; the user gets to choose to ignore it.
 *
 * State source: <html data-clock-state="..."> attribute, set by the
 * inline boot script in BaseLayout that reads breakroom.omnishift.profile
 * and breakroom.omnishift.shift from localStorage. We re-read on storage
 * events so cross-tab clock-in/out propagates immediately.
 */
import { useEffect, useMemo, useState } from 'react';
import OsDialog, { type OsDialogIconKind } from './OsDialog';

type ClockState = 'anonymous' | 'on_shift' | 'clocked_out' | 'still_out';
type WorldExpect = 'omnishift' | 'voidsignal';

interface ClockStateGateProps {
  /**
   * Which world this page belongs to.
   *   'omnishift'  → expects state=on_shift (any other state shows gate)
   *   'voidsignal' → expects state=clocked_out or still_out (on_shift shows gate)
   */
  expects: WorldExpect;
}

interface DialogConfig {
  title: string;
  body: React.ReactNode;
  iconKind: OsDialogIconKind;
  primary: { label: string; href: string };
}

export default function ClockStateGate({ expects }: ClockStateGateProps) {
  const [state, setState] = useState<ClockState | null>(null);
  const [dismissed, setDismissed] = useState(false);

  // Read clock state from the <html> data attribute on mount + on storage events.
  useEffect(() => {
    const read = () => {
      const s = document.documentElement.getAttribute(
        'data-clock-state',
      ) as ClockState | null;
      setState(s ?? 'anonymous');
    };
    read();

    const onStorage = (e: StorageEvent) => {
      // The inline script in BaseLayout updates the attribute from these keys.
      // It re-runs on each page load — in-tab updates go via direct DOM writes
      // from the clock-in/out flows. Cross-tab updates hit the storage event.
      if (
        e.key === 'breakroom.omnishift.profile' ||
        e.key === 'breakroom.omnishift.shift' ||
        e.key === null // 'storage' fired by clear()
      ) {
        // Wait a tick for any inline-script side-effects to settle.
        requestAnimationFrame(read);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const mismatch = useMemo<boolean>(() => {
    if (state === null) return false; // Don't render until we know.
    if (state === 'anonymous') return true; // Always gate anonymous visitors.
    if (expects === 'omnishift') return state !== 'on_shift';
    // expects === 'voidsignal'
    return state === 'on_shift';
  }, [state, expects]);

  if (!mismatch || dismissed) return null;

  const config = pickDialog(state ?? 'anonymous', expects);

  return (
    <OsDialog
      title={config.title}
      iconKind={config.iconKind}
      buttons={[
        {
          label: config.primary.label,
          isDefault: true,
          onClick: () => {
            window.location.href = config.primary.href;
          },
        },
        {
          label: 'Cancel',
          onClick: () => setDismissed(true),
        },
      ]}
      onClose={() => setDismissed(true)}
    >
      {config.body}
    </OsDialog>
  );
}

/* ------------------------------------------------------------------------- */
/*  state × expects → dialog matrix                                           */
/* ------------------------------------------------------------------------- */

function pickDialog(state: ClockState, expects: WorldExpect): DialogConfig {
  if (expects === 'omnishift') {
    // /portal — Employee File. Expects on_shift.
    if (state === 'anonymous') {
      return {
        title: 'OmniShift — No File On Record',
        iconKind: 'warn',
        body: (
          <>
            <p>
              <b>You haven't been hired.</b> The Employee File is for active
              records only. Intake desk is the front door.
            </p>
            <p style={{ color: '#404040' }}>
              You can keep looking around. Most pages are gentler about this
              than the back office.
            </p>
          </>
        ),
        primary: { label: 'Sign Up', href: '/signup' },
      };
    }
    // clocked_out or still_out
    return {
      title: "OmniShift — You're Off The Clock",
      iconKind: 'warn',
      body: (
        <>
          <p>
            <b>This page is for clocked-in employees.</b> Your shift ended.
            The Employee File is closed for the night, technically.
          </p>
          <p style={{ color: '#404040' }}>
            Clock back in to view your assigned record. Or close this and
            keep looking — the page underneath still loads.
          </p>
        </>
      ),
      primary: { label: 'Clock In', href: '/clock-in' },
    };
  }

  // expects === 'voidsignal' → /locker (Regular File)
  if (state === 'anonymous') {
    return {
      title: 'VOID — No Regular File On This Machine',
      iconKind: 'info',
      body: (
        <>
          <p>
            <b>You don't have a Regular File yet.</b> The room can be visited
            without one, but nobody knows you came by.
          </p>
          <p style={{ color: '#404040' }}>
            Make a file at intake. Pick a handle. Nothing else is required.
          </p>
        </>
      ),
      primary: { label: 'Sign Up', href: '/signup' },
    };
  }
  // state === 'on_shift'
  return {
    title: 'VOID — Clock Out First',
    iconKind: 'info',
    body: (
      <>
        <p>
          <b>You're still on the books.</b> The Regular File is for
          after-hours. The room makes some allowances, but not this one.
        </p>
        <p style={{ color: '#404040' }}>
          Clock out to view your File. The page below this dialog already
          loaded — you can preview without committing.
        </p>
      </>
    ),
    primary: { label: 'Clock Out', href: '/clock-out' },
  };
}

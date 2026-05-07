/**
 * OsDialog — reusable Win95-chrome dialog primitive.
 *
 * The CALM half of the system-voice grammar (see boot-popup-chaos.css).
 * Used for: post-boot welcome strip, restraint-mode confirmations, and
 * any future opt-in dialog (save Stuff, agent acknowledgement, faction
 * drift notice, etc.).
 *
 * Design rules:
 *   - At most ONE OsDialog visible at a time. No stacking. (The chaos
 *     cascade has its own primitive, bpc-popup, which DOES stack.)
 *   - Always dismissable. ESC or [×] always works. Backdrop click is
 *     opt-in via `dismissOnBackdrop`.
 *   - Reduced motion: still renders, just skips the entrance animation
 *     (handled in CSS via the @media query in boot-popup-chaos.css).
 *
 * Usage:
 *   <OsDialog
 *     title="VOID — Welcome back"
 *     iconKind="info"
 *     buttons={[{ label: 'OK', onClick: close, isDefault: true }]}
 *     onClose={close}
 *   >
 *     <p>While you were out:</p>
 *     <ul><li>3 doors moved</li><li>Jukebox quarter relocated</li></ul>
 *   </OsDialog>
 */
import { useCallback, useEffect, type ReactNode } from 'react';

export type OsDialogIconKind = 'info' | 'warn' | 'error' | 'ask';

export interface OsDialogButton {
  label: string;
  onClick?: () => void;
  /** Renders the dotted-outline focus ring, signaling the Enter-key default. */
  isDefault?: boolean;
}

interface OsDialogProps {
  /** Title-bar text. Truncates with ellipsis at narrow widths. */
  title: string;
  /** Optional kind icon — pure CSS, no asset. */
  iconKind?: OsDialogIconKind;
  /** Body content. Pass <p>, <ul>, <code>, etc. */
  children: ReactNode;
  /** Footer buttons. Defaults to a single OK that calls onClose. */
  buttons?: OsDialogButton[];
  /** Fires when [×] clicked, ESC pressed, or (if enabled) backdrop clicked. */
  onClose?: () => void;
  /** Show the [×] close button on the title bar. Defaults true. */
  showClose?: boolean;
  /** Allow backdrop click to dismiss. Defaults false (calmer). */
  dismissOnBackdrop?: boolean;
}

export default function OsDialog({
  title,
  iconKind = 'info',
  children,
  buttons,
  onClose,
  showClose = true,
  dismissOnBackdrop = false,
}: OsDialogProps) {
  const close = useCallback(() => onClose?.(), [onClose]);

  // ESC dismisses. Captured at document level so it works regardless of focus.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Enter') {
        const def = buttons?.find((b) => b.isDefault);
        if (def?.onClick) def.onClick();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close, buttons]);

  // Default to a single OK button if none provided.
  const resolvedButtons: OsDialogButton[] = buttons ?? [
    { label: 'OK', onClick: close, isDefault: true },
  ];

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dismissOnBackdrop) return;
    if (e.target === e.currentTarget) close();
  };

  return (
    <div
      className="bpc-dialog-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onBackdropClick}
    >
      <div className="bpc-dialog">
        <div className="bpc-dialog-titlebar">
          <span className="bpc-dialog-titlebar-icon" aria-hidden="true" />
          <span className="bpc-dialog-title-text">{title}</span>
          {showClose && (
            <button
              type="button"
              className="bpc-dialog-x"
              aria-label="Close"
              onClick={close}
            >
              ×
            </button>
          )}
        </div>

        <div className="bpc-dialog-body">
          <div className="bpc-dialog-icon" data-kind={iconKind} aria-hidden="true" />
          <div className="bpc-dialog-text">{children}</div>
        </div>

        <div className="bpc-dialog-buttons">
          {resolvedButtons.map((b, i) => (
            <button
              key={i}
              type="button"
              className="bpc-dialog-btn"
              data-default={b.isDefault ? 'true' : 'false'}
              onClick={b.onClick}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

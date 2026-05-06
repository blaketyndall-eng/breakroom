/**
 * PhoneNotificationBadge — Unread count indicator (PR 69)
 *
 * Small reactive badge any page can mount to show unread phone
 * messages. Subscribes to phone update events via CustomEvent.
 *
 * Usage in Astro pages:
 *   <PhoneNotificationBadge client:load />
 *
 * Or inline in nav/status strips:
 *   <PhoneNotificationBadge client:load compact />
 */

import { useState, useEffect } from 'react';
import {
  getUnreadCount,
  seedPhoneIfEmpty,
  startPhoneListener,
  onPhoneUpdate,
} from '@/lib/phoneNotifications';

type Props = {
  /** Compact mode: just the number, no label */
  compact?: boolean;
  /** Show even when count is 0 */
  showEmpty?: boolean;
};

export default function PhoneNotificationBadge({ compact = false, showEmpty = false }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    seedPhoneIfEmpty();
    const stopListener = startPhoneListener();
    setCount(getUnreadCount());

    const unsub = onPhoneUpdate((c) => setCount(c));
    // Poll backup
    const interval = setInterval(() => setCount(getUnreadCount()), 15000);

    return () => {
      stopListener();
      unsub();
      clearInterval(interval);
    };
  }, []);

  if (count === 0 && !showEmpty) return null;

  if (compact) {
    return (
      <a href="/phone" className="phone-badge-compact" title={`${count} unread message${count !== 1 ? 's' : ''}`}>
        <span className="phone-badge-dot" />
        <span className="phone-badge-num">{count}</span>
      </a>
    );
  }

  return (
    <a href="/phone" className="phone-badge">
      <span className="phone-badge-icon">☎️</span>
      <span className="phone-badge-label">
        {count > 0
          ? `${count} message${count !== 1 ? 's' : ''}`
          : 'Phone quiet'}
      </span>
      {count > 0 && <span className="phone-badge-dot" />}
    </a>
  );
}

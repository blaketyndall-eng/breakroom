/**
 * PhoneInbox — Live notification feed (PR 69)
 *
 * Renders phone messages grouped by time with agent avatars,
 * read/unread state, and action links. Subscribes to phone
 * updates for real-time reactivity.
 *
 * The phone is not yours. It keeps acting familiar.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getPhoneMessages,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  dismissMessage,
  seedPhoneIfEmpty,
  startPhoneListener,
  onPhoneUpdate,
  formatPhoneTime,
  getMessageTypeLabel,
  type PhoneMessage,
  type PhoneMessageType,
} from '@/lib/phoneNotifications';

// --- Message type styles ---

const TYPE_COLORS: Record<PhoneMessageType, string> = {
  voicemail: '#8b7355',
  text: '#5a7a5a',
  missed_call: '#a85a5a',
  dispatch: '#5a6a8b',
  alert: '#a87a3a',
  rumor: '#7a5a8b',
};

// --- Component ---

export default function PhoneInbox() {
  const [messages, setMessages] = useState<PhoneMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    const msgs = getPhoneMessages(50);
    setMessages(msgs);
    setUnreadCount(getUnreadCount());
  }, []);

  useEffect(() => {
    seedPhoneIfEmpty();
    const stopListener = startPhoneListener();
    refresh();

    const unsubPhone = onPhoneUpdate(() => refresh());

    // Poll every 10s as backup
    const interval = setInterval(refresh, 10000);

    return () => {
      stopListener();
      unsubPhone();
      clearInterval(interval);
    };
  }, [refresh]);

  const handleMarkRead = (id: string) => {
    markAsRead(id);
    refresh();
  };

  const handleDismiss = (id: string) => {
    dismissMessage(id);
    refresh();
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    refresh();
  };

  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
    // Auto-mark as read on expand
    const msg = messages.find((m) => m.id === id);
    if (msg && !msg.read) {
      markAsRead(id);
      refresh();
    }
  };

  const filtered = filter === 'unread'
    ? messages.filter((m) => !m.read)
    : messages;

  // Group by time buckets
  const now = Date.now();
  const groups = groupMessages(filtered, now);

  return (
    <div className="phone-inbox">
      {/* Inbox header */}
      <div className="phone-inbox-header">
        <div className="phone-inbox-status">
          <span className="phone-inbox-icon">☎️</span>
          <span className="phone-inbox-title">
            Inbox
            {unreadCount > 0 && (
              <span className="phone-unread-badge">{unreadCount}</span>
            )}
          </span>
          <span className="phone-inbox-carrier">carrier: unknown</span>
        </div>
        <div className="phone-inbox-controls">
          <button
            className={`phone-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({messages.length})
          </button>
          <button
            className={`phone-filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          {unreadCount > 0 && (
            <button className="phone-mark-all-btn" onClick={handleMarkAllRead}>
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Message groups */}
      {groups.length === 0 && (
        <div className="phone-empty">
          <p className="phone-empty-icon">☎️</p>
          <p className="phone-empty-label">PHONE QUIET</p>
          <p className="phone-empty-body">
            Nobody called.<br />
            Or they did and hung up correctly.
          </p>
        </div>
      )}

      {groups.map((group) => (
        <div key={group.label} className="phone-msg-group">
          <div className="phone-msg-group-label">{group.label}</div>
          {group.messages.map((msg) => (
            <PhoneMessageRow
              key={msg.id}
              message={msg}
              expanded={expandedId === msg.id}
              onToggle={() => handleToggleExpand(msg.id)}
              onMarkRead={() => handleMarkRead(msg.id)}
              onDismiss={() => handleDismiss(msg.id)}
            />
          ))}
        </div>
      ))}

      {/* Phone footer */}
      <div className="phone-inbox-footer">
        <span>battery: spiritually dead</span>
        <span>signal: 1 bar / intermittent</span>
        <span>missed calls: {147 + messages.length}</span>
      </div>
    </div>
  );
}

// --- Message Row ---

function PhoneMessageRow({
  message,
  expanded,
  onToggle,
  onMarkRead,
  onDismiss,
}: {
  message: PhoneMessage;
  expanded: boolean;
  onToggle: () => void;
  onMarkRead: () => void;
  onDismiss: () => void;
}) {
  const typeColor = TYPE_COLORS[message.type] || '#5a513f';

  return (
    <article
      className={`phone-msg ${message.read ? 'phone-msg--read' : 'phone-msg--unread'}`}
      onClick={onToggle}
    >
      {/* Header row */}
      <div className="phone-msg-top">
        <span className="phone-msg-sender-icon">{message.sender.icon}</span>
        <span className="phone-msg-sender">{message.sender.name}</span>
        <span className="phone-msg-type" style={{ color: typeColor }}>
          {getMessageTypeLabel(message.type)}
        </span>
        <span className="phone-msg-time">{formatPhoneTime(message.timestamp)}</span>
        {!message.read && <span className="phone-msg-dot" />}
      </div>

      {/* Subject */}
      <div className="phone-msg-subject">{message.subject}</div>

      {/* Expanded body */}
      {expanded && (
        <div className="phone-msg-body">
          <p className="phone-msg-role">
            {message.sender.name} / {message.sender.role}
            {message.district && ` / ${message.district.replace(/-/g, ' ')}`}
          </p>
          <p className="phone-msg-text">{message.body}</p>
          <div className="phone-msg-actions">
            {message.actionHref && (
              <a className="old-button phone-msg-action" href={message.actionHref}>
                {message.actionLabel || 'Open'}
              </a>
            )}
            {!message.read && (
              <button
                className="old-button phone-msg-action"
                onClick={(e) => { e.stopPropagation(); onMarkRead(); }}
              >
                Mark read
              </button>
            )}
            <button
              className="old-button phone-msg-action phone-msg-dismiss"
              onClick={(e) => { e.stopPropagation(); onDismiss(); }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

// --- Grouping helper ---

type MessageGroup = {
  label: string;
  messages: PhoneMessage[];
};

function groupMessages(messages: PhoneMessage[], now: number): MessageGroup[] {
  const hourAgo = now - 3600000;
  const dayAgo = now - 86400000;
  const weekAgo = now - 604800000;

  const groups: { label: string; msgs: PhoneMessage[] }[] = [
    { label: 'Last hour', msgs: [] },
    { label: 'Today', msgs: [] },
    { label: 'This week', msgs: [] },
    { label: 'Earlier', msgs: [] },
  ];

  for (const msg of messages) {
    if (msg.timestamp > hourAgo) groups[0].msgs.push(msg);
    else if (msg.timestamp > dayAgo) groups[1].msgs.push(msg);
    else if (msg.timestamp > weekAgo) groups[2].msgs.push(msg);
    else groups[3].msgs.push(msg);
  }

  return groups
    .filter((g) => g.msgs.length > 0)
    .map((g) => ({ label: g.label, messages: g.msgs }));
}

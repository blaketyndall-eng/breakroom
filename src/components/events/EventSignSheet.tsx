import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { signEventSheet, getEventSignSheet } from '@/lib/events';
import type { EventSignSheetEntry } from '@/lib/events';

type Props = {
  eventSlug: string;
};

export default function EventSignSheet({ eventSlug }: Props) {
  const [entries, setEntries] = useState<EventSignSheetEntry[]>([]);
  const [alias, setAlias] = useState('');
  const [attendanceType, setAttendanceType] = useState<EventSignSheetEntry['attendanceType']>('signed_sheet');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setEntries(getEventSignSheet(eventSlug));
  }, [eventSlug]);

  function handleSign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!alias.trim()) return;

    const entry = signEventSheet({
      eventSlug,
      alias: alias.trim(),
      attendanceType,
    });

    setEntries(getEventSignSheet(eventSlug));
    setAlias('');

    if (attendanceType === 'anonymous') {
      setMessage('Signed anonymously. The room noticed anyway.');
    } else if (attendanceType === 'seen_there') {
      setMessage('Marked as Seen There.');
    } else {
      setMessage('Sheet signed.');
    }

    setTimeout(() => setMessage(null), 3500);
  }

  const attendanceOptions: { value: EventSignSheetEntry['attendanceType']; label: string }[] = [
    { value: 'signed_sheet', label: 'Sign Sheet' },
    { value: 'rsvp', label: 'RSVP' },
    { value: 'seen_there', label: 'Seen There' },
    { value: 'anonymous', label: 'Anonymous' },
  ];

  return (
    <div className="event-sign-sheet">
      <h3 className="sign-sheet-header">Sign Sheet / Attendance</h3>

      <form className="sign-sheet-form" onSubmit={handleSign}>
        <input
          type="text"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="your name, alias, or handle"
          maxLength={40}
        />
        <div className="attendance-options">
          {attendanceOptions.map((opt) => (
            <label key={opt.value} className="attendance-option">
              <input
                type="radio"
                name="attendance"
                value={opt.value}
                checked={attendanceType === opt.value}
                onChange={() => setAttendanceType(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
        <button className="old-button" type="submit">Sign</button>
      </form>

      {message && <p className="sign-sheet-feedback">{message}</p>}

      {entries.length > 0 && (
        <div className="sign-sheet-entries">
          <p className="sign-sheet-count">{entries.length} signed.</p>
          <ul className="sign-sheet-list">
            {entries.slice(-20).reverse().map((entry, i) => (
              <li key={i} className={`sign-entry sign-entry-${entry.attendanceType}`}>
                <span className="sign-alias">
                  {entry.attendanceType === 'anonymous' ? '▓▓▓▓▓▓' : entry.alias}
                </span>
                <span className="sign-type">{entry.attendanceType.replaceAll('_', ' ')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {entries.length === 0 && (
        <p className="sign-sheet-empty">Nobody signed yet. Or they did and erased it.</p>
      )}
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import {
  GUESTBOOK_EVENT,
  addGuestbookEntry,
  getGuestbookEntries,
  getGuestbookLabel,
  getGuestbookModeForSiteType,
} from '@/lib/sleepnetGuestbooks';
import type { SleepNetGuestbookEntry, SleepNetGuestbookMode } from '@/lib/sleepnetGuestbooks';

type Props = {
  siteSlug: string;
  siteType: string;
  seededEntries?: SleepNetGuestbookEntry[];
  mode?: SleepNetGuestbookMode;
};

function formatDate(value: string) {
  if (value === 'seeded') return 'seeded';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function SleepNetGuestbook({ siteSlug, siteType, seededEntries = [], mode }: Props) {
  const resolvedMode = mode ?? getGuestbookModeForSiteType(siteType);
  const [entries, setEntries] = useState<SleepNetGuestbookEntry[]>(seededEntries);
  const [alias, setAlias] = useState('Anonymous');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('Leave a mark. Do not make it modern.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayEntries = useMemo(() => {
    const all = [...entries, ...seededEntries];
    const seen = new Set<string>();
    return all.filter((entry) => {
      if (seen.has(entry.id)) return false;
      seen.add(entry.id);
      return true;
    }).slice(0, 50);
  }, [entries, seededEntries]);

  async function refresh() {
    const next = await getGuestbookEntries(siteSlug);
    setEntries(next);
  }

  useEffect(() => {
    refresh().catch(() => setEntries(seededEntries));
    const listener = () => refresh().catch(() => undefined);
    window.addEventListener(GUESTBOOK_EVENT, listener as EventListener);
    window.addEventListener('storage', listener);
    return () => {
      window.removeEventListener(GUESTBOOK_EVENT, listener as EventListener);
      window.removeEventListener('storage', listener);
    };
  }, [siteSlug]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('Filing mark...');
    try {
      const result = await addGuestbookEntry({ siteSlug, alias, message, pageType: siteType });
      setMessage('');
      setStatus(result.source === 'supabase' ? 'Filed publicly.' : 'Filed locally. This browser remembers it.');
      await refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Guestbook pen broke.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={`old-shell sleepnet-live-guestbook mode-${resolvedMode}`}>
      <div className="old-header">{getGuestbookLabel(resolvedMode)}</div>
      <div className="old-body">
        <p className="memo-box">{status}</p>
        <form className="guestbook-form" onSubmit={handleSubmit}>
          <label>Alias
            <input value={alias} onChange={(event) => setAlias(event.target.value)} maxLength={32} />
          </label>
          <label>Message
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={420} placeholder="page smelled like onions" />
          </label>
          <button className="old-button" disabled={isSubmitting}>{isSubmitting ? 'Filing...' : 'Leave Mark'}</button>
        </form>

        <div className="guestbook-entry-list">
          {displayEntries.length ? displayEntries.map((entry) => (
            <article className={`guestbook-entry actor-${entry.actorType} status-${entry.status}`} key={entry.id}>
              <div className="guestbook-entry-topline">
                <b>{entry.alias}</b>
                <small>{entry.actorType.replaceAll('_', ' ')} / {entry.status} / {formatDate(entry.createdAt)}</small>
              </div>
              <p>{entry.message}</p>
            </article>
          )) : <p>No marks filed yet. The wall is clean in a suspicious way.</p>}
        </div>
      </div>
    </section>
  );
}

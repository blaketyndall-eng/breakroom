import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { BREAKROOM_DATA } from '@/content/data/breakroom';
import { findResults } from '@/lib/sleepnetSearch';

type Props = { defaultQuery?: string };

const quickSearches = ['1:47', 'motel key', 'idle hands', 'miss september', 'hot dogs', 'applause money'];

/**
 * SearchBox — homepage search island. Submitting (button or Enter key) navigates
 * to /sleepnet/search?q=...&mode=... so results have a real, shareable URL.
 * Inline results were removed when we built the dedicated SERP page; the live
 * count next to the mode tabs is kept as Google '98 flavor.
 */
export default function SearchBox({ defaultQuery = '' }: Props) {
  const [query, setQuery] = useState(defaultQuery);
  const [mode, setMode] = useState<'after-hours' | 'day-shift' | 'closed'>('after-hours');

  const placeholders =
    mode === 'day-shift'
      ? BREAKROOM_DATA.searchPlaceholdersDay
      : mode === 'closed'
        ? BREAKROOM_DATA.searchPlaceholdersClosed
        : BREAKROOM_DATA.searchPlaceholders;

  const placeholder = placeholders[Math.abs(query.length) % placeholders.length];

  // Preview count = how many corpus items would match right now. Cheap (in-memory).
  const previewCount = useMemo(() => findResults(query, 100).length, [query]);

  const submit = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    window.location.href = `/sleepnet/search?q=${encodeURIComponent(trimmed)}&mode=${mode}`;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(query);
  };

  const handleSurprise = () => {
    const q = quickSearches[Math.floor(Math.random() * quickSearches.length)];
    setQuery(q);
    submit(q);
  };

  return (
    <form className="sn-search" aria-label="SleepNet search module" onSubmit={handleSubmit}>
      <div className="sn-search-row">
        <input
          className="sn-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search SleepNet"
          autoComplete="off"
        />
      </div>
      <div className="sn-btn-row">
        <button className="sn-btn" type="submit">SleepNet Search</button>
        <button className="sn-btn" type="button" onClick={handleSurprise}>I Don't Know What I Want</button>
      </div>

      {/* Mode tabs — toggle which placeholder set + which mode the SERP receives.
          type="button" on each so the form does not submit on tab click. */}
      <div className="sn-mode-bar" aria-label="Search mode">
        <button
          type="button"
          className={mode === 'after-hours' ? 'sn-tab active' : 'sn-tab'}
          onClick={() => setMode('after-hours')}
        >
          After Hours
        </button>
        <button
          type="button"
          className={mode === 'day-shift' ? 'sn-tab active' : 'sn-tab'}
          onClick={() => setMode('day-shift')}
        >
          Day Shift
        </button>
        <button
          type="button"
          className={mode === 'closed' ? 'sn-tab active' : 'sn-tab'}
          onClick={() => setMode('closed')}
        >
          Closed?
        </button>
        <span className="sn-tab-info">
          {previewCount} result{previewCount === 1 ? '' : 's'} · index updated 1:47 a.m.
        </span>
      </div>
    </form>
  );
}

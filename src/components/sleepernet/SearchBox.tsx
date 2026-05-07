import { useMemo, useState } from 'react';
import { BREAKROOM_DATA } from '@/content/data/breakroom';
import { toBreakroomRoute } from '@/lib/routes';

type Props = { defaultQuery?: string };

type CorpusItem = (typeof BREAKROOM_DATA.corpus)[number];

const quickSearches = ['1:47', 'motel key', 'idle hands', 'miss september', 'hot dogs', 'applause money'];

export default function SearchBox({ defaultQuery = '' }: Props) {
  const [query, setQuery] = useState(defaultQuery);
  const [mode, setMode] = useState<'after-hours' | 'day-shift' | 'closed'>('after-hours');

  const placeholders = mode === 'day-shift'
    ? BREAKROOM_DATA.searchPlaceholdersDay
    : mode === 'closed'
      ? BREAKROOM_DATA.searchPlaceholdersClosed
      : BREAKROOM_DATA.searchPlaceholders;

  const placeholder = placeholders[Math.abs(query.length) % placeholders.length];

  const results = useMemo(() => findResults(query), [query]);

  return (
    <div className="sn-search" aria-label="SleepNet search module">
      {/* Google Beta-style: input + two buttons */}
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
        <button className="sn-btn" onClick={() => {}}>SleepNet Search</button>
        <button className="sn-btn" onClick={() => setQuery(quickSearches[Math.floor(Math.random() * quickSearches.length)])}>I Don't Know What I Want</button>
      </div>

      {/* Mode tabs — thin bar like Yahoo tabs */}
      <div className="sn-mode-bar" aria-label="Search mode">
        <button className={mode === 'after-hours' ? 'sn-tab active' : 'sn-tab'} onClick={() => setMode('after-hours')}>After Hours</button>
        <button className={mode === 'day-shift' ? 'sn-tab active' : 'sn-tab'} onClick={() => setMode('day-shift')}>Day Shift</button>
        <button className={mode === 'closed' ? 'sn-tab active' : 'sn-tab'} onClick={() => setMode('closed')}>Closed?</button>
        <span className="sn-tab-info">
          {results.length} result{results.length === 1 ? '' : 's'} · index updated 1:47 a.m.
        </span>
      </div>

      {/* Results — Google '98 style: blue title, green URL, description */}
      {query.trim() && (
        <div className="sn-results">
          <div className="sn-results-status">
            Showing <b>1-{results.length}</b> of approximately <b>{results.length * 47}</b> for <b>{query}</b>. Search took <b>0.{Math.floor(Math.random() * 9) + 1}6</b> seconds.
          </div>
          {results.length === 0 ? (
            <div className="sn-no-results">
              <p>The room does not have results for <b>"{query}"</b>.</p>
              <p>Try <a href="/staff-only">asking the room directly</a>. It does not answer fast. That is different from not answering.</p>
            </div>
          ) : results.map((item) => (
            <article key={`${item.kind}-${item.title}`} className="sn-result">
              <a href={toBreakroomRoute(item.url, item.title)} className="sn-result-title">{item.title}</a>
              <span className="sn-result-kind">{item.kind}</span>
              <p className="sn-result-blurb">...{item.blurb}...</p>
              <div className="sn-result-url">
                <span>{toDisplayUrl(item)}</span>
                {' - '}<a href={toBreakroomRoute(item.url, item.title)}>Cached</a>
                {' - '}<a href={`/sleepnet?q=${encodeURIComponent(item.title)}`}>RoomScout</a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function findResults(query: string): CorpusItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return BREAKROOM_DATA.corpus.slice(0, 6);

  const parts = q.split(/\s+/).filter(Boolean);
  return BREAKROOM_DATA.corpus
    .map((item) => {
      const haystack = `${item.kind} ${item.title} ${item.blurb} ${item.tags?.join(' ')}`.toLowerCase();
      const score = parts.reduce((count, part) => count + (haystack.includes(part) ? 1 : 0), 0);
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .map(({ item }) => item)
    .slice(0, 9);
}

function toDisplayUrl(item: CorpusItem) {
  return toBreakroomRoute(item.url, item.title).replace(/^\//, 'breakroom.local/');
}

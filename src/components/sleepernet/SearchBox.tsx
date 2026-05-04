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
    <div className="search-experience" aria-label="SleeperNet search module">
      <div className="search-mode-row" aria-label="Search mode selector">
        <button className={mode === 'after-hours' ? 'search-mode active' : 'search-mode'} onClick={() => setMode('after-hours')}>After Hours</button>
        <button className={mode === 'day-shift' ? 'search-mode active' : 'search-mode'} onClick={() => setMode('day-shift')}>Day Shift</button>
        <button className={mode === 'closed' ? 'search-mode active' : 'search-mode'} onClick={() => setMode('closed')}>Closed?</button>
      </div>

      <div className="search-shell">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search SleeperNet"
          autoComplete="off"
        />
        <div className="icon" aria-hidden="true">⌕</div>
      </div>

      <div className="quick-searches" aria-label="Quick searches">
        {quickSearches.map((term) => (
          <button key={term} className="quick-search" onClick={() => setQuery(term)}>{term}</button>
        ))}
      </div>

      <div className="search-actions">
        <a className="btn-pill" href="/breakroom">Save This Search</a>
        <a className="btn-pill" href="/newsstand">3AM Edition</a>
        <a className="btn-pill" href="/lost-found">Lost Object Alerts</a>
        <a className="btn-pill ghost" href="/clock-out">Clock Out</a>
      </div>

      <div className="search-result-status">
        <span>{results.length} result{results.length === 1 ? '' : 's'}</span>
        <span>signal: {mode === 'after-hours' ? 'cigarette-yellow' : mode === 'day-shift' ? 'corporate-safe' : 'mostly gone'}</span>
        <span>index updated 1:47 a.m.</span>
      </div>

      <div className="search-results">
        {results.length === 0 ? (
          <div className="memo-box no-results">
            <div className="result-kind">No official results</div>
            <a href="/staff-only" className="result-title">Try asking the room directly.</a>
            <p>The room does not answer fast. That is different from not answering.</p>
          </div>
        ) : results.map((item) => (
          <article key={`${item.kind}-${item.title}`} className="memo-box result-card">
            <div className="result-meta">
              <span>{item.kind}</span>
              <span>{toDisplayUrl(item)}</span>
            </div>
            <a href={toBreakroomRoute(item.url, item.title)} className="result-title">{item.title}</a>
            <p>{item.blurb}</p>
          </article>
        ))}
      </div>
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

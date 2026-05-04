import { useMemo, useState } from 'react';
import { BREAKROOM_DATA } from '@/content/data/breakroom';

type Props = { defaultQuery?: string };

export default function SearchBox({ defaultQuery = '' }: Props) {
  const [query, setQuery] = useState(defaultQuery);
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return BREAKROOM_DATA.corpus.slice(0, 5);
    return BREAKROOM_DATA.corpus.filter((item) => {
      const haystack = `${item.title} ${item.blurb} ${item.tags?.join(' ')}`.toLowerCase();
      return q.split(/\s+/).some((part) => haystack.includes(part));
    }).slice(0, 8);
  }, [query]);

  const placeholder = BREAKROOM_DATA.searchPlaceholders[0];

  return (
    <div>
      <div className="search-shell">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} aria-label="Search SleeperNet" />
        <div className="icon">⌕</div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap' }}>
        <a className="btn-pill" href="/breakroom">Save This Search</a>
        <a className="btn-pill" href="/newsstand">3AM Edition</a>
        <a className="btn-pill" href="/lost-found">Lost Object Alerts</a>
      </div>
      <div style={{ marginTop: 28 }}>
        {results.map((item) => (
          <div key={item.title} className="memo-box" style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: 'var(--type-mono)', fontSize: 11, color: '#6b604c', textTransform: 'uppercase' }}>{item.kind}</div>
            <a href={toRoute(item.url)} style={{ fontSize: 20, fontWeight: 800 }}>{item.title}</a>
            <p style={{ margin: '6px 0 0', lineHeight: 1.45 }}>{item.blurb}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function toRoute(url: string) {
  if (url.includes('newsstand')) return '/newsstand';
  if (url.includes('lost')) return '/lost-found';
  if (url.includes('rack')) return '/rack';
  if (url.includes('portal')) return '/portal';
  if (url.includes('staff')) return '/staff-only';
  if (url.includes('idlehands')) return '/idle-hands';
  return '/';
}

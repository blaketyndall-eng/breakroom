import { useState, useEffect, useCallback } from 'react';
import type { FormEvent } from 'react';
import {
  searchSleepNetV2,
  SEARCH_CATEGORIES,
  SEARCH_CATEGORY_LABELS,
  explainSearchResult,
  getSearchHistory,
  addSearchHistory,
  clearSearchHistory,
} from '@/lib/sleepnetSearch';
import type { SleepNetSearchResult, SearchCategory, SearchUserContext, SearchHistoryEntry } from '@/lib/sleepnetSearch';
import { checkSearchPhraseTrigger, unlockDoor } from '@/lib/hiddenDoors';
import type { HiddenDoor } from '@/lib/hiddenDoors';
import { recordSearchAppearance } from '@/lib/promotionSignals';

export default function SleepNetSearchV2() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SleepNetSearchResult[]>([]);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [status, setStatus] = useState('Indexing the after-hours directory...');
  const [searching, setSearching] = useState(false);
  const [doorMessage, setDoorMessage] = useState<{ door: HiddenDoor; isNew: boolean } | null>(null);
  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);

  // Load user context from localStorage for personalization
  function getUserContext(): SearchUserContext | undefined {
    try {
      const factionSlug = localStorage.getItem('breakroom.turf.joined.v1') || undefined;
      const driftRaw = localStorage.getItem('breakroom.faction-drift.v1');
      const drawerRaw = localStorage.getItem('breakroom.drawer.v1');

      const driftFactionSlugs = driftRaw ? JSON.parse(driftRaw).map((d: any) => d.factionSlug) : undefined;
      const savedStuffSlugs = drawerRaw ? JSON.parse(drawerRaw).map((d: any) => d.slug) : undefined;

      if (!factionSlug && !driftFactionSlugs?.length && !savedStuffSlugs?.length) return undefined;
      return { joinedFactionSlug: factionSlug, driftFactionSlugs, savedStuffSlugs };
    } catch {
      return undefined;
    }
  }

  const runSearch = useCallback(async (nextQuery: string, category: SearchCategory) => {
    setSearching(true);
    try {
      const userContext = getUserContext();
      const searchResults = await searchSleepNetV2({
        query: nextQuery,
        type: category,
        userContext,
        includeHidden: true,
        limit: 30,
      });

      setResults(searchResults);

      if (!nextQuery.trim()) {
        setStatus('SleepNet directory loaded. Search something.');
      } else if (searchResults.length === 0) {
        setStatus('No SleepNet URLs found. The directory coughed and looked away.');
      } else {
        const pageCount = searchResults.filter(r => r.type === 'sleepnet_page').length;
        const otherCount = searchResults.length - pageCount;
        const parts: string[] = [];
        if (pageCount) parts.push(`${pageCount} page(s)`);
        if (otherCount) parts.push(`${otherCount} other result(s)`);
        setStatus(`${parts.join(' + ')} found.`);
      }

      // Record search appearances for promotion signals
      if (nextQuery.trim() && searchResults.length) {
        for (const r of searchResults.filter(r => r.type === 'sleepnet_page').slice(0, 5)) {
          recordSearchAppearance(r.id.replace('page-', ''));
        }
      }

      // V2: Record search history
      if (nextQuery.trim()) {
        addSearchHistory(nextQuery, searchResults.length);
        setHistory(getSearchHistory());
      }

      // Hidden door triggers
      if (nextQuery.trim()) {
        const triggeredDoor = checkSearchPhraseTrigger(nextQuery);
        if (triggeredDoor) {
          const { isNew } = unlockDoor(triggeredDoor.slug);
          setDoorMessage({ door: triggeredDoor, isNew });
        } else {
          setDoorMessage(null);
        }
      } else {
        setDoorMessage(null);
      }
    } catch {
      setStatus('Search failed. Try a worse keyword.');
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    runSearch('', 'all');
    setHistory(getSearchHistory());
  }, [runSearch]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runSearch(query, activeCategory);
  }

  function handleCategoryChange(category: SearchCategory) {
    setActiveCategory(category);
    runSearch(query, category);
  }

  function handleHistoryClick(histQuery: string) {
    setQuery(histQuery);
    runSearch(histQuery, activeCategory);
  }

  function handleClearHistory() {
    clearSearchHistory();
    setHistory([]);
  }

  return (
    <section className="old-shell sleepnet-directory">
      <div className="old-header">SleepNet Search / Multi-Source / Not A Feed</div>
      <div className="old-body">
        <form className="sleepnet-search" onSubmit={handleSubmit}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search the after-hours internet..."
            disabled={searching}
          />
          <button className="old-button" disabled={searching}>
            {searching ? 'Searching...' : 'Search SleepNet'}
          </button>
        </form>

        {/* V2: Search history */}
        {history.length > 0 && !query.trim() && (
          <div className="sv2-history">
            <div className="sv2-history-header">
              <span className="sv2-history-label">Recent Searches</span>
              <button
                type="button"
                className="sv2-history-clear"
                onClick={handleClearHistory}
              >
                clear
              </button>
            </div>
            <div className="sv2-history-list">
              {history.slice(0, 8).map((h) => (
                <button
                  key={h.query}
                  type="button"
                  className="sv2-history-item"
                  onClick={() => handleHistoryClick(h.query)}
                >
                  <span className="sv2-history-query">{h.query}</span>
                  <span className="sv2-history-count">{h.resultCount} result{h.resultCount !== 1 ? 's' : ''}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div className="sv2-tabs">
          {SEARCH_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`sv2-tab ${activeCategory === cat ? 'sv2-tab-active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {SEARCH_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        <p className="memo-box">{status}</p>

        {/* Hidden door reveal */}
        {doorMessage && (
          <div className={`door-reveal ${doorMessage.isNew ? 'door-new' : 'door-known'}`}>
            <p className="door-reveal-header">{doorMessage.isNew ? 'A door moved.' : 'Door already open.'}</p>
            <p className="door-reveal-title">{doorMessage.door.reward.title}</p>
            {doorMessage.door.reward.body && <p>{doorMessage.door.reward.body}</p>}
            {doorMessage.door.reward.href && (
              <p><a className="old-button" href={doorMessage.door.reward.href}>
                {doorMessage.door.reward.isExternal ? 'Follow Link (External)' : 'Enter'}
              </a></p>
            )}
          </div>
        )}

        {/* Results */}
        <div className="sv2-results">
          {results.map((result) => (
            <SearchResultCard key={result.id} result={result} />
          ))}
        </div>

        {/* No results + create prompt (when filtered to non-all) */}
        {query.trim() && results.length === 0 && !searching && (
          <div className="sv2-empty">
            <p className="sv2-empty-title">The directory returned nothing.</p>
            <p className="sv2-empty-sub">Either it does not exist, or it does and you were not told.</p>
            <a className="old-button" href={`/sleepnet/create?seed=${encodeURIComponent(query)}`}>
              Create This Page
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

// --- Result Card ---

function SearchResultCard({ result }: { result: SleepNetSearchResult }) {
  const typeLabel = explainSearchResult(result);

  return (
    <article className={`sv2-card sv2-card-${result.type}`}>
      <div className="sv2-card-topline">
        <span className={`sv2-type-badge sv2-badge-${result.type}`}>{typeLabel}</span>
        {result.reason && (
          <span className={`sv2-reason sv2-reason-${result.reasonStyle || 'plain'}`}>
            {result.reason}
          </span>
        )}
      </div>

      {result.sleepnetUrl && (
        <p className="sleepnet-url">{result.sleepnetUrl}</p>
      )}

      <h3 className="sv2-card-title">
        {result.href ? (
          <a href={result.href}>{result.title}</a>
        ) : (
          result.title
        )}
      </h3>

      <p className="sv2-card-snippet">{result.snippet}</p>

      {result.tags.length > 0 && (
        <div className="sv2-card-tags">
          {result.tags.filter(Boolean).slice(0, 4).map((tag) => (
            <span key={tag} className="sv2-tag">{tag.replace(/_/g, ' ')}</span>
          ))}
        </div>
      )}
    </article>
  );
}

/**
 * sleepnetSearch.ts
 * --------------------------------------------------------------------------
 * Shared SleepNet search helpers. Used by both the React SearchBox island
 * (live preview count on the homepage) and the server-rendered SERP page
 * at /sleepnet/search?q=... so the two stay in lockstep.
 */
import { BREAKROOM_DATA } from '@/content/data/breakroom';
import { toBreakroomRoute } from '@/lib/routes';

export type CorpusItem = (typeof BREAKROOM_DATA.corpus)[number];

/**
 * Score each corpus item against the query (whitespace-split, case-insensitive).
 * Empty query returns the first 6 items as a "browse" default.
 */
export function findResults(query: string, limit = 9): CorpusItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return BREAKROOM_DATA.corpus.slice(0, 6);

  const parts = q.split(/\s+/).filter(Boolean);
  return BREAKROOM_DATA.corpus
    .map((item) => {
      const haystack = `${item.kind} ${item.title} ${item.blurb} ${item.tags?.join(' ') ?? ''}`.toLowerCase();
      const score = parts.reduce((count, part) => count + (haystack.includes(part) ? 1 : 0), 0);
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .map(({ item }) => item)
    .slice(0, limit);
}

/**
 * Render the in-world display URL for a result (Google '98 green-URL line).
 */
export function toDisplayUrl(item: CorpusItem): string {
  return toBreakroomRoute(item.url, item.title).replace(/^\//, 'breakroom.local/');
}

/**
 * SleepNet Search V2 — PR 57
 *
 * Multi-source world search: pages, Stuff, factions, events,
 * fake ads, dead links, hidden maybes, and create prompts.
 */

import { searchSleepNetSites, makeSleepNetUrl, buildSearchText } from '@/lib/sleepnetSites';
import type { SleepNetSite } from '@/lib/sleepnetSites';
import { getAllStuffItems, makeStuffUrl } from '@/lib/stuff';
import type { StuffItem } from '@/content/data/stuff';
import { BREAKROOM_FACTIONS } from '@/content/data/factions';
import type { BreakroomFaction } from '@/content/data/factions';
import { BREAKROOM_EVENTS } from '@/content/data/events';
import type { BreakroomEvent } from '@/content/data/events';
import { getFakeAds } from '@/lib/fakeAds';
import type { FakeAd } from '@/content/data/fakeAds';
import { getUnlockedDoors } from '@/lib/hiddenDoors';

// --- Types ---

export type SleepNetSearchResultType =
  | 'sleepnet_page'
  | 'stuff_item'
  | 'faction'
  | 'event'
  | 'regular_file'
  | 'fake_ad'
  | 'dead_link'
  | 'hidden_maybe'
  | 'create_prompt';

export type SleepNetSearchResult = {
  id: string;
  type: SleepNetSearchResultType;
  title: string;
  href?: string;
  sleepnetUrl?: string;
  snippet: string;
  reason?: string;
  reasonStyle?: 'plain' | 'in_world' | 'mysterious';
  score: number;
  tags: string[];
  source: 'seeded' | 'supabase' | 'local' | 'registry' | 'computed' | 'hidden';
  metadata?: Record<string, unknown>;
};

export type SearchCategory = SleepNetSearchResultType | 'all';

export type SearchUserContext = {
  joinedFactionSlug?: string;
  driftFactionSlugs?: string[];
  savedStuffSlugs?: string[];
  weatherTags?: string[];
};

// --- Near-match generators ---

const NEAR_MATCH_LABELS = [
  'Probably Not This',
  'Close Enough',
  'Wrong Department',
  'Dead Link Cousin',
  'Directory Guess',
  'Same Bad Idea',
  'Filed Adjacent',
  'Last Seen Nearby',
];

const DEAD_LINK_FRAGMENTS = [
  'This page has not loaded since Thursday.',
  'The server timed out but left a note.',
  'Domain expired. Counter stuck at 0.',
  'Cached version may contain errors.',
  'The URL was correct once.',
  '404 is not an error. It is a headstone.',
  'This link stopped meaning something.',
  'Browser gave up. Page did not.',
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getFakeNearMatches(query: string): SleepNetSearchResult[] {
  if (!query.trim()) return [];
  const seed = hashString(query.toLowerCase());
  const count = 1 + (seed % 3); // 1–3 near matches
  const results: SleepNetSearchResult[] = [];

  for (let i = 0; i < count; i++) {
    const labelIdx = (seed + i * 7) % NEAR_MATCH_LABELS.length;
    const fragIdx = (seed + i * 13) % DEAD_LINK_FRAGMENTS.length;
    const slug = `${query.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${['court-appeal', 'lost-archive', 'wrong-version', 'cousin-page', 'dead-mirror'][i % 5]}`;

    results.push({
      id: `near-${slug}-${i}`,
      type: 'dead_link',
      title: `sleepnet://${slug}`,
      href: undefined,
      sleepnetUrl: `sleepnet://${slug}`,
      snippet: DEAD_LINK_FRAGMENTS[fragIdx],
      reason: NEAR_MATCH_LABELS[labelIdx],
      reasonStyle: 'in_world',
      score: 10 - i * 3,
      tags: ['near-match', 'dead-link'],
      source: 'computed',
    });
  }

  return results;
}

// --- Create prompt ---

export function getCreatePromptResult(query: string): SleepNetSearchResult {
  return {
    id: `create-${query.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    type: 'create_prompt',
    title: `Create: ${query}`,
    href: `/sleepnet/create?seed=${encodeURIComponent(query)}`,
    snippet: 'This page does not exist yet. You could fix that.',
    reason: 'The directory noticed the gap.',
    reasonStyle: 'in_world',
    score: 5,
    tags: ['create'],
    source: 'computed',
  };
}

// --- Hidden maybe ---

function getHiddenMaybeResult(query: string): SleepNetSearchResult | null {
  const seed = hashString(query.toLowerCase());
  // Only show ~30% of the time
  if (seed % 10 > 2) return null;

  const messages = [
    'The directory refused one result.',
    'One page was held back.',
    'Something matched but was not released.',
    'The room filed something and did not share.',
    'A result was present. It was not shown.',
  ];

  return {
    id: `hidden-maybe-${seed}`,
    type: 'hidden_maybe',
    title: 'Hidden Result',
    snippet: messages[seed % messages.length],
    reason: 'Not For You Yet',
    reasonStyle: 'mysterious',
    score: 2,
    tags: ['hidden'],
    source: 'hidden',
  };
}

// --- Source searchers ---

function searchStuff(query: string): SleepNetSearchResult[] {
  const q = query.toLowerCase();
  const items = getAllStuffItems();
  return items
    .filter((item: StuffItem) => {
      const text = [item.name, item.slug, item.sku, item.note, ...(item.tags ?? [])].join(' ').toLowerCase();
      return text.includes(q);
    })
    .slice(0, 5)
    .map((item: StuffItem) => ({
      id: `stuff-${item.slug}`,
      type: 'stuff_item' as const,
      title: item.name,
      href: makeStuffUrl(item.slug),
      snippet: item.note || `SKU: ${item.sku}`,
      reason: item.status === 'not_for_you_yet' ? 'Not For You Yet' : undefined,
      reasonStyle: 'plain' as const,
      score: 60,
      tags: item.tags ?? [],
      source: 'registry' as const,
    }));
}

function searchFactions(query: string): SleepNetSearchResult[] {
  const q = query.toLowerCase();
  return BREAKROOM_FACTIONS
    .filter((f: BreakroomFaction) => {
      const text = [f.name, f.slug, f.motto, f.description, f.turf, ...f.symbols].join(' ').toLowerCase();
      return text.includes(q);
    })
    .slice(0, 3)
    .map((f: BreakroomFaction) => ({
      id: `faction-${f.slug}`,
      type: 'faction' as const,
      title: f.name,
      href: `/factions/${f.slug}`,
      snippet: f.motto,
      score: 55,
      tags: f.symbols.slice(0, 3),
      source: 'seeded' as const,
    }));
}

function searchEvents(query: string): SleepNetSearchResult[] {
  const q = query.toLowerCase();
  return BREAKROOM_EVENTS
    .filter((e: BreakroomEvent) => {
      const text = [e.title, e.slug, e.tagline, e.description, e.eventType].join(' ').toLowerCase();
      return text.includes(q);
    })
    .slice(0, 3)
    .map((e: BreakroomEvent) => ({
      id: `event-${e.slug}`,
      type: 'event' as const,
      title: e.title,
      href: `/events/${e.slug}`,
      snippet: e.tagline,
      score: 50,
      tags: [e.eventType, e.status],
      source: 'seeded' as const,
    }));
}

function searchFakeAds(query: string): SleepNetSearchResult[] {
  const q = query.toLowerCase();
  const ads = getFakeAds();
  return ads
    .filter((ad: FakeAd) => {
      const text = [ad.headline, ad.body, ad.slug, ...ad.tags].join(' ').toLowerCase();
      return text.includes(q);
    })
    .slice(0, 2)
    .map((ad: FakeAd) => ({
      id: `ad-${ad.slug}`,
      type: 'fake_ad' as const,
      title: ad.headline,
      href: ad.href ?? '#',
      snippet: ad.body,
      reason: 'SPONSORED — DO NOT TRUST',
      reasonStyle: 'plain' as const,
      score: 30,
      tags: ad.tags,
      source: 'registry' as const,
    }));
}

async function searchPages(query: string): Promise<SleepNetSearchResult[]> {
  const sites = await searchSleepNetSites(query);
  return sites.slice(0, 10).map((site: SleepNetSite) => ({
    id: `page-${site.slug}`,
    type: 'sleepnet_page' as const,
    title: site.title,
    href: makeSleepNetUrl(site.slug),
    sleepnetUrl: `sleepnet://${site.slug}`,
    snippet: site.tagline || site.description || '',
    score: 80 + (site.canonical_weight ?? 0),
    tags: [site.site_type, site.neighborhood],
    source: (site as any).id ? 'supabase' as const : 'seeded' as const,
    metadata: { neighborhood: site.neighborhood, siteType: site.site_type },
  }));
}

// --- Personalization boost ---

function applyContextBoosts(results: SleepNetSearchResult[], ctx?: SearchUserContext): SleepNetSearchResult[] {
  if (!ctx) return results;

  return results.map((r) => {
    let boost = 0;
    let reason = r.reason;

    if (ctx.joinedFactionSlug && r.type === 'faction' && r.id.includes(ctx.joinedFactionSlug)) {
      boost += 5;
      reason = reason || 'Seen around your Turf.';
    }

    if (ctx.driftFactionSlugs?.length) {
      for (const slug of ctx.driftFactionSlugs) {
        if (r.tags.includes(slug) || r.id.includes(slug)) {
          boost += 3;
          reason = reason || 'The table moved this result.';
          break;
        }
      }
    }

    if (ctx.savedStuffSlugs?.length && r.type === 'stuff_item') {
      const stuffSlug = r.id.replace('stuff-', '');
      if (ctx.savedStuffSlugs.includes(stuffSlug)) {
        boost += 4;
        reason = reason || 'The shelf had the same quarter.';
      }
    }

    return boost > 0 ? { ...r, score: r.score + boost, reason, reasonStyle: r.reasonStyle || 'in_world' as const } : r;
  });
}

// --- Main search ---

export async function searchSleepNetV2(input: {
  query: string;
  type?: SearchCategory;
  userContext?: SearchUserContext;
  includeHidden?: boolean;
  limit?: number;
}): Promise<SleepNetSearchResult[]> {
  const { query, type = 'all', userContext, includeHidden = true, limit = 30 } = input;
  const q = query.trim();

  if (!q) {
    // Empty query → return recent pages only
    const pages = await searchPages('');
    return pages.slice(0, limit);
  }

  let results: SleepNetSearchResult[] = [];

  // Collect from all sources based on type filter
  if (type === 'all' || type === 'sleepnet_page') {
    const pages = await searchPages(q);
    results.push(...pages);
  }

  if (type === 'all' || type === 'stuff_item') {
    results.push(...searchStuff(q));
  }

  if (type === 'all' || type === 'faction') {
    results.push(...searchFactions(q));
  }

  if (type === 'all' || type === 'event') {
    results.push(...searchEvents(q));
  }

  if (type === 'all' || type === 'fake_ad') {
    results.push(...searchFakeAds(q));
  }

  // Near-matches (always included in 'all' or 'dead_link')
  if (type === 'all' || type === 'dead_link') {
    results.push(...getFakeNearMatches(q));
  }

  // Hidden maybe (only in 'all' or 'hidden_maybe')
  if (includeHidden && (type === 'all' || type === 'hidden_maybe')) {
    const hidden = getHiddenMaybeResult(q);
    if (hidden) results.push(hidden);
  }

  // Create prompt (always last)
  if (type === 'all' || type === 'create_prompt') {
    results.push(getCreatePromptResult(q));
  }

  // Apply personalization
  results = applyContextBoosts(results, userContext);

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit);
}

// --- Result explanation ---

export function explainSearchResult(result: SleepNetSearchResult): string {
  switch (result.type) {
    case 'sleepnet_page': return 'SleepNet indexed page';
    case 'stuff_item': return 'Object in the Stuff registry';
    case 'faction': return 'Official Turf';
    case 'event': return 'Filed event';
    case 'fake_ad': return 'Paid placement (do not trust)';
    case 'dead_link': return 'Dead or missing URL';
    case 'hidden_maybe': return 'Withheld by the directory';
    case 'create_prompt': return 'Page does not exist yet';
    case 'regular_file': return 'Public Regular File';
    default: return 'Unknown source';
  }
}

// --- Category labels ---

export const SEARCH_CATEGORY_LABELS: Record<SearchCategory, string> = {
  all: 'All',
  sleepnet_page: 'Pages',
  stuff_item: 'Stuff',
  faction: 'Turf',
  event: 'Events',
  regular_file: 'Regulars',
  fake_ad: 'Ads',
  dead_link: 'Dead Links',
  hidden_maybe: 'Hidden Maybe',
  create_prompt: 'Create',
};

export const SEARCH_CATEGORIES: SearchCategory[] = [
  'all',
  'sleepnet_page',
  'stuff_item',
  'faction',
  'event',
  'fake_ad',
  'dead_link',
  'hidden_maybe',
];

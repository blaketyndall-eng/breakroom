import { FAKE_ADS, getFakeAdBySlug } from '@/content/data/fakeAds';
import type { FakeAd } from '@/content/data/fakeAds';

export { getFakeAdBySlug };

export function getFakeAds() {
  return FAKE_ADS;
}

export function normalizeFakeAdHref(ad: FakeAd) {
  if (ad.destinationType === 'dead_link' || ad.destinationType === 'hidden_door') {
    return ad.href ?? `/dead-link-cemetery?ad=${ad.slug}`;
  }
  return ad.href ?? '#';
}

export function getRandomFakeAds(limit = 4) {
  return [...FAKE_ADS]
    .sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))
    .slice(0, limit);
}

export function getFakeAdsForContext(input: {
  siteType?: string;
  factionSlug?: string;
  stuffSlug?: string;
  tags?: string[];
  limit?: number;
}) {
  const tags = input.tags ?? [];
  const scored = FAKE_ADS.map((ad) => {
    let score = ad.weight ?? 1;
    if (input.siteType && ad.linkedSiteType?.includes(input.siteType)) score += 8;
    if (input.factionSlug && ad.linkedFactionSlug === input.factionSlug) score += 10;
    if (input.stuffSlug && ad.linkedStuffSlug === input.stuffSlug) score += 10;
    score += ad.tags.filter((tag) => tags.includes(tag)).length * 3;
    return { ad, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.ad)
    .slice(0, input.limit ?? 4);
}

export function fakeAdDestinationLabel(ad: FakeAd) {
  const labels: Record<FakeAd['destinationType'], string> = {
    sleepnet_page: 'SleepNet page',
    stuff_file: 'Stuff file',
    faction_page: 'Faction page',
    search_query: 'Search result',
    hidden_door: 'Hidden door',
    dead_link: 'Dead link',
    external_none: 'No outside sponsor',
  };
  return labels[ad.destinationType];
}

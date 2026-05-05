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
  if (ad.destinationType === 'external_none') return '#';
  return ad.href ?? '#';
}

function deterministicNoise(slug: string) {
  return slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 17;
}

export function getRandomFakeAds(limit = 4) {
  return [...FAKE_ADS]
    .sort((a, b) => ((b.weight ?? 0) + deterministicNoise(b.slug)) - ((a.weight ?? 0) + deterministicNoise(a.slug)))
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
    score += deterministicNoise(ad.slug) / 10;
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

export function isRabbitHoleAd(ad: FakeAd) {
  return ['sleepnet_page', 'stuff_file', 'faction_page', 'search_query', 'hidden_door', 'dead_link'].includes(ad.destinationType);
}

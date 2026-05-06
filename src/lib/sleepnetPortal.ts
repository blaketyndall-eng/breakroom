/**
 * SleepNet Portal helpers — data fetching for portal widgets.
 * Site of the Night, Recently Indexed, Directory Categories.
 */

import { searchSleepNetSites, SLEEPNET_NEIGHBORHOODS, SLEEPNET_NEIGHBORHOOD_LABELS } from '@/lib/sleepnetSites';
import type { SleepNetSite } from '@/lib/sleepnetSites';

export type DirectoryCategory = {
  slug: string;
  label: string;
  count: number;
  sample?: SleepNetSite;
};

export type PortalData = {
  siteOfTheNight: SleepNetSite | null;
  recentlyIndexed: SleepNetSite[];
  directoryCategories: DirectoryCategory[];
};

/**
 * Pick the Site of the Night deterministically based on date.
 * Rotates through available sites daily. Prefers higher canonical_weight.
 */
export function pickSiteOfTheNight(sites: SleepNetSite[]): SleepNetSite | null {
  if (!sites.length) return null;

  // Sort by canonical_weight descending, then slug for stability
  const ranked = [...sites].sort((a, b) => {
    const weightDiff = (b.canonical_weight ?? 0) - (a.canonical_weight ?? 0);
    if (weightDiff !== 0) return weightDiff;
    return a.slug.localeCompare(b.slug);
  });

  // Pick based on day-of-year so it rotates daily
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % ranked.length;
  return ranked[index];
}

/**
 * Get recently indexed sites — most recently updated, up to `limit`.
 */
export function getRecentlyIndexed(sites: SleepNetSite[], limit = 5): SleepNetSite[] {
  return [...sites]
    .sort((a, b) => {
      const aDate = a.updated_at ?? a.created_at ?? '';
      const bDate = b.updated_at ?? b.created_at ?? '';
      return bDate.localeCompare(aDate);
    })
    .slice(0, limit);
}

/**
 * Group sites into directory categories by neighborhood.
 */
export function buildDirectoryCategories(sites: SleepNetSite[]): DirectoryCategory[] {
  const map = new Map<string, SleepNetSite[]>();

  for (const site of sites) {
    const key = site.neighborhood || 'uncategorized';
    const list = map.get(key) ?? [];
    list.push(site);
    map.set(key, list);
  }

  // Use canonical neighborhood order, then add any extras
  const ordered: DirectoryCategory[] = [];

  for (const slug of SLEEPNET_NEIGHBORHOODS) {
    const sites = map.get(slug);
    if (sites?.length) {
      ordered.push({
        slug,
        label: SLEEPNET_NEIGHBORHOOD_LABELS[slug] ?? slug.replaceAll('_', ' '),
        count: sites.length,
        sample: sites[0],
      });
    }
  }

  // Add any neighborhoods not in the canonical list
  for (const [slug, sites] of map.entries()) {
    if (!SLEEPNET_NEIGHBORHOODS.includes(slug as typeof SLEEPNET_NEIGHBORHOODS[number]) && slug !== 'uncategorized') {
      ordered.push({
        slug,
        label: slug.replaceAll('_', ' '),
        count: sites.length,
        sample: sites[0],
      });
    }
  }

  return ordered;
}

/**
 * Fetch all portal data in one call.
 * Used by the Astro page at build/request time.
 */
export async function getPortalData(): Promise<PortalData> {
  const allSites = await searchSleepNetSites('');

  return {
    siteOfTheNight: pickSiteOfTheNight(allSites),
    recentlyIndexed: getRecentlyIndexed(allSites),
    directoryCategories: buildDirectoryCategories(allSites),
  };
}

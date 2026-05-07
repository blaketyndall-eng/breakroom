/**
 * voidSites.ts
 * --------------------------------------------------------------------------
 * Registry of canonical Void Signal sites — the fictional-but-real pages
 * teased on the /void homepage and rendered at /sites/[slug].
 *
 * Each entry maps to a template under src/components/voidsites/.
 * V1 ships placeholders (template: 'placeholder'); V3 wires real templates
 * for the first five.
 */

export type VoidSiteTemplate =
  | 'placeholder' // V1: in-world stub ("page is being indexed")
  | 'mothPage'
  | 'timingSlips'
  | 'lostGloves'
  | 'oneNight'
  | 'whoAteIt';

export type VoidSite = {
  slug: string;
  title: string;
  domain: string; // 'moths.afterhours'
  tagline: string;
  template: VoidSiteTemplate;
  meta: {
    indexedAt: string;
    visitors: number;
    rumored: boolean;
    siteOwner?: string;
  };
};

export const VOID_SITES: VoidSite[] = [
  {
    slug: 'moths',
    title: 'moths.afterhours',
    domain: 'moths.afterhours',
    tagline:
      'A page about moths that has been wrong for ten years. Refuses corrections.',
    template: 'placeholder',
    meta: {
      indexedAt: '2026-04-12',
      visitors: 12,
      rumored: false,
      siteOwner: 'mothie-admin',
    },
  },
  {
    slug: 'lostgloves',
    title: 'lostgloves.afterhours',
    domain: 'lostgloves.afterhours',
    tagline: 'Glove archive. Owner unknown.',
    template: 'placeholder',
    meta: {
      indexedAt: '2026-03-30',
      visitors: 47,
      rumored: false,
      siteOwner: 'evidence-clerk',
    },
  },
  {
    slug: 'timing-slips',
    title: 'timing-slips.bible',
    domain: 'timing-slips.bible',
    tagline: 'Timing slips as scripture. Speed as testimony.',
    template: 'placeholder',
    meta: {
      indexedAt: '2026-04-02',
      visitors: 84,
      rumored: false,
      siteOwner: 'the-driver',
    },
  },
  {
    slug: 'onenight',
    title: 'onenight.poolhall',
    domain: 'onenight.poolhall',
    tagline: 'One night only. Already happened. Or hasn\'t.',
    template: 'placeholder',
    meta: {
      indexedAt: '2026-02-19',
      visitors: 203,
      rumored: true,
      siteOwner: 'nun-dog',
    },
  },
  {
    slug: 'whoateit',
    title: 'whoateit.classifieds',
    domain: 'whoateit.classifieds',
    tagline: 'Items reported missing from the counter. Counter denies.',
    template: 'placeholder',
    meta: {
      indexedAt: '2026-04-22',
      visitors: 19,
      rumored: false,
      siteOwner: '7-11-clerk',
    },
  },
  {
    slug: 'notgoinghome',
    title: 'notgoinghome.txt',
    domain: 'notgoinghome.txt',
    tagline: 'A plain text file that updates itself. Nobody admits to it.',
    template: 'placeholder',
    meta: {
      indexedAt: '2026-04-30',
      visitors: 6,
      rumored: true,
    },
  },
];

export function getVoidSiteBySlug(slug: string): VoidSite | undefined {
  return VOID_SITES.find((site) => site.slug === slug);
}

export function getRecentlyIndexedSites(limit = 5): VoidSite[] {
  return [...VOID_SITES]
    .sort((a, b) => (a.meta.indexedAt < b.meta.indexedAt ? 1 : -1))
    .slice(0, limit);
}

export function getSiteOfTheNight(): VoidSite {
  // moths is featured for now; later this can rotate by date.
  return VOID_SITES[0]!;
}

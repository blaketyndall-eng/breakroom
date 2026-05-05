import type { SleepNetSite } from '@/lib/sleepnetSites';

export type SleepNetRelationshipType =
  | 'same_owner'
  | 'same_faction'
  | 'same_object'
  | 'same_site_type'
  | 'same_neighborhood'
  | 'funny_relation'
  | 'rival_relation'
  | 'agent_created'
  | 'random_dead_link'
  | 'probably_related'
  | 'owes_money_to_this_page'
  | 'stole_its_lighter'
  | 'same_bad_idea'
  | 'seen_together'
  | 'officially_unrelated';

export type SleepNetRelationship = {
  sourceSiteSlug: string;
  targetSiteSlug?: string;
  targetHref: string;
  targetTitle: string;
  relationshipType: SleepNetRelationshipType;
  label: string;
  note?: string;
  createdBy: 'system' | 'user' | 'agent' | 'faction' | 'seed';
  status: 'active' | 'pending' | 'hidden' | 'dead';
  metadata?: Record<string, unknown>;
};

export type ManualSleepNetRelatedLink = {
  href: string;
  title: string;
  relationshipType: SleepNetRelationshipType;
  note?: string;
};

export const SEEDED_SLEEPNET_RELATIONSHIPS: SleepNetRelationship[] = [
  {
    sourceSiteSlug: 'very-good-burger',
    targetHref: '/stuff/legal-napkin-pack',
    targetTitle: 'Legal Napkin Pack',
    relationshipType: 'same_bad_idea',
    label: 'same bad idea',
    note: 'Also believes paper can fix what food started.',
    createdBy: 'seed',
    status: 'active',
  },
  {
    sourceSiteSlug: 'very-good-burger',
    targetHref: '/sleepnet?q=still+open+burger',
    targetTitle: 'Still Open Burger',
    relationshipType: 'probably_related',
    label: 'probably related',
    note: 'Another burger page that keeps its light on for legal reasons.',
    createdBy: 'seed',
    status: 'active',
  },
  {
    sourceSiteSlug: 'very-good-burger',
    targetHref: '/dead-link-cemetery?ad=get-fatter-by-friday',
    targetTitle: 'Get Fatter By Friday',
    relationshipType: 'random_dead_link',
    label: 'dead link cousin',
    note: 'This offer became too clear and had to be removed.',
    createdBy: 'seed',
    status: 'dead',
  },
  {
    sourceSiteSlug: 'very-good-burger',
    targetHref: '/factions/night-drinkers',
    targetTitle: 'Night Drinkers',
    relationshipType: 'seen_together',
    label: 'seen together',
    note: 'The stools remember the receipt shake.',
    createdBy: 'seed',
    status: 'active',
  },
];

export function normalizeRelationshipLabel(type: SleepNetRelationshipType) {
  return type.replaceAll('_', ' ');
}

export function getSeededRelationships(siteSlug: string) {
  return SEEDED_SLEEPNET_RELATIONSHIPS.filter((relationship) => relationship.sourceSiteSlug === siteSlug);
}

function hasSharedValue(a?: string[] | null, b?: string[] | null) {
  if (!a?.length || !b?.length) return false;
  return a.some((item) => b.includes(item));
}

function relationshipFromSite(site: SleepNetSite, target: SleepNetSite, type: SleepNetRelationshipType, note: string): SleepNetRelationship {
  return {
    sourceSiteSlug: site.slug,
    targetSiteSlug: target.slug,
    targetHref: `/sleepnet/${target.slug}`,
    targetTitle: target.title,
    relationshipType: type,
    label: normalizeRelationshipLabel(type),
    note,
    createdBy: 'system',
    status: 'active',
  };
}

export function getComputedRelationships(site: SleepNetSite, allSites: SleepNetSite[]) {
  const candidates = allSites.filter((target) => target.slug !== site.slug);
  const relationships: SleepNetRelationship[] = [];

  candidates.forEach((target) => {
    if (hasSharedValue(site.faction_affinity, target.faction_affinity)) {
      relationships.push(relationshipFromSite(site, target, 'same_faction', 'Both pages were seen near the same people.'));
      return;
    }
    if (hasSharedValue(site.related_object_slugs, target.related_object_slugs)) {
      relationships.push(relationshipFromSite(site, target, 'same_object', 'The same object was filed in both drawers.'));
      return;
    }
    if (site.site_type === target.site_type) {
      relationships.push(relationshipFromSite(site, target, 'same_site_type', 'Same type of problem, different wallpaper.'));
      return;
    }
    if (site.neighborhood === target.neighborhood) {
      relationships.push(relationshipFromSite(site, target, 'same_neighborhood', 'The directory says these pages live too close together.'));
    }
  });

  return relationships;
}

export function getManualRelatedLinks(site: SleepNetSite) {
  const relatedLinks = (site as SleepNetSite & { relatedLinks?: ManualSleepNetRelatedLink[] }).relatedLinks ?? [];
  return relatedLinks.map((link): SleepNetRelationship => ({
    sourceSiteSlug: site.slug,
    targetHref: link.href,
    targetTitle: link.title,
    relationshipType: link.relationshipType,
    label: normalizeRelationshipLabel(link.relationshipType),
    note: link.note,
    createdBy: 'user',
    status: link.href.includes('dead-link') ? 'dead' : 'active',
  }));
}

export function getMoreLikeThis(site: SleepNetSite, allSites: SleepNetSite[] = [], limit = 5) {
  const relationships = [
    ...getManualRelatedLinks(site),
    ...getSeededRelationships(site.slug),
    ...getComputedRelationships(site, allSites),
  ];

  const seen = new Set<string>();
  return relationships.filter((relationship) => {
    const key = `${relationship.targetHref}-${relationship.relationshipType}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, limit);
}

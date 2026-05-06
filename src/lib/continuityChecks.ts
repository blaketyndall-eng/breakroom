/**
 * Continuity Checks — PR 58
 *
 * Detects broken references, missing targets, duplicate slugs,
 * and orphaned content across the world systems.
 * Used in the Wire Room ledger dashboard.
 */

import { getAllSleepNetSites } from '@/lib/sleepnetSites';
import { getAllStuffItems } from '@/lib/stuff';
import { BREAKROOM_FACTIONS } from '@/content/data/factions';
import { BREAKROOM_EVENTS } from '@/content/data/events';
import { getAllDistricts } from '@/lib/districts';

// --- Types ---

export type ContinuityIssueType =
  | 'broken_link'
  | 'missing_reference'
  | 'duplicate_slug'
  | 'orphaned_content'
  | 'invalid_district'
  | 'missing_faction'
  | 'stale_event';

export type ContinuitySeverity = 'low' | 'medium' | 'high';

export type ContinuityIssue = {
  id: string;
  type: ContinuityIssueType;
  severity: ContinuitySeverity;
  title: string;
  detail: string;
  sourceType: string;
  sourceSlug: string;
  targetType?: string;
  targetSlug?: string;
  suggestion?: string;
};

export type ContinuityReport = {
  timestamp: number;
  issues: ContinuityIssue[];
  stats: {
    totalChecked: number;
    issuesFound: number;
    highSeverity: number;
    mediumSeverity: number;
    lowSeverity: number;
  };
};

// --- Checks ---

function checkDuplicateSlugs(): ContinuityIssue[] {
  const issues: ContinuityIssue[] = [];
  const allSlugs: { slug: string; source: string }[] = [];

  // Collect all slugs from major registries
  const sites = getAllSleepNetSites();
  for (const site of sites) {
    allSlugs.push({ slug: site.slug, source: 'sleepnet_page' });
  }

  const stuff = getAllStuffItems();
  for (const item of stuff) {
    allSlugs.push({ slug: item.slug, source: 'stuff' });
  }

  for (const faction of BREAKROOM_FACTIONS) {
    allSlugs.push({ slug: faction.slug, source: 'faction' });
  }

  for (const event of BREAKROOM_EVENTS) {
    allSlugs.push({ slug: event.slug, source: 'event' });
  }

  // Find duplicates within same source
  const bySource: Record<string, string[]> = {};
  for (const entry of allSlugs) {
    if (!bySource[entry.source]) bySource[entry.source] = [];
    bySource[entry.source].push(entry.slug);
  }

  for (const [source, slugs] of Object.entries(bySource)) {
    const seen = new Set<string>();
    for (const slug of slugs) {
      if (seen.has(slug)) {
        issues.push({
          id: `dup-${source}-${slug}`,
          type: 'duplicate_slug',
          severity: 'high',
          title: `Duplicate slug: ${slug}`,
          detail: `The slug "${slug}" appears more than once in ${source}.`,
          sourceType: source,
          sourceSlug: slug,
          suggestion: 'Rename one instance or merge entries.',
        });
      }
      seen.add(slug);
    }
  }

  return issues;
}

function checkDistrictReferences(): ContinuityIssue[] {
  const issues: ContinuityIssue[] = [];
  const districts = getAllDistricts();
  const districtSlugs = new Set(districts.map((d) => d.slug));

  // Check sites reference valid neighborhoods/districts
  const sites = getAllSleepNetSites();
  for (const site of sites) {
    if (site.neighborhood && !districtSlugs.has(site.neighborhood)) {
      // Neighborhoods don't have to be districts, but flag if it looks like one
      const looksLikeDistrict = site.neighborhood.includes('-') && site.neighborhood.length > 5;
      if (looksLikeDistrict) {
        issues.push({
          id: `district-ref-${site.slug}`,
          type: 'invalid_district',
          severity: 'low',
          title: `Unknown neighborhood: ${site.neighborhood}`,
          detail: `Page "${site.title}" references neighborhood "${site.neighborhood}" which is not a registered district.`,
          sourceType: 'sleepnet_page',
          sourceSlug: site.slug,
          targetType: 'district',
          targetSlug: site.neighborhood,
          suggestion: 'Add district or update neighborhood reference.',
        });
      }
    }
  }

  return issues;
}

function checkFactionReferences(): ContinuityIssue[] {
  const issues: ContinuityIssue[] = [];
  const factionSlugs = new Set(BREAKROOM_FACTIONS.map((f) => f.slug));

  // Check districts reference valid factions
  const districts = getAllDistricts();
  for (const district of districts) {
    for (const fp of district.factionPresence) {
      if (!factionSlugs.has(fp)) {
        issues.push({
          id: `faction-ref-${district.slug}-${fp}`,
          type: 'missing_faction',
          severity: 'medium',
          title: `Unknown faction: ${fp}`,
          detail: `District "${district.name}" references faction "${fp}" which is not in the registry.`,
          sourceType: 'district',
          sourceSlug: district.slug,
          targetType: 'faction',
          targetSlug: fp,
          suggestion: 'Add faction or remove reference.',
        });
      }
    }
  }

  return issues;
}

function checkStaleEvents(): ContinuityIssue[] {
  const issues: ContinuityIssue[] = [];

  for (const event of BREAKROOM_EVENTS) {
    if (event.status === 'active' && event.endDate) {
      const endTime = new Date(event.endDate).getTime();
      if (endTime < Date.now()) {
        issues.push({
          id: `stale-event-${event.slug}`,
          type: 'stale_event',
          severity: 'medium',
          title: `Event past end date: ${event.title}`,
          detail: `Event "${event.title}" is marked active but end date (${event.endDate}) has passed.`,
          sourceType: 'event',
          sourceSlug: event.slug,
          suggestion: 'Update event status to completed or archived.',
        });
      }
    }
  }

  return issues;
}

// --- Main runner ---

export function runContinuityChecks(): ContinuityReport {
  const issues: ContinuityIssue[] = [
    ...checkDuplicateSlugs(),
    ...checkDistrictReferences(),
    ...checkFactionReferences(),
    ...checkStaleEvents(),
  ];

  // Sort by severity
  const severityOrder: Record<ContinuitySeverity, number> = { high: 0, medium: 1, low: 2 };
  issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return {
    timestamp: Date.now(),
    issues,
    stats: {
      totalChecked: getAllSleepNetSites().length + getAllStuffItems().length + BREAKROOM_FACTIONS.length + BREAKROOM_EVENTS.length + getAllDistricts().length,
      issuesFound: issues.length,
      highSeverity: issues.filter((i) => i.severity === 'high').length,
      mediumSeverity: issues.filter((i) => i.severity === 'medium').length,
      lowSeverity: issues.filter((i) => i.severity === 'low').length,
    },
  };
}

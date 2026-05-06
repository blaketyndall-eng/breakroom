/**
 * Artifact Prompt Generation (PR 51)
 *
 * Runtime logic for hydrating prompt templates with real data
 * from factions, SleepNet pages, Stuff items, and manual input.
 */

import {
  ARTIFACT_PROMPT_TEMPLATES,
  BREAKROOM_STYLE_RULES,
  BREAKROOM_HARD_NOS,
  getTemplateBySlug,
} from '@/content/data/artifactPromptTemplates';
import type { ArtifactType, ArtifactPromptTemplate } from '@/content/data/artifactPromptTemplates';
import { BREAKROOM_FACTIONS } from '@/content/data/factions';
import type { BreakroomFaction } from '@/content/data/factions';
import { STUFF_ITEMS } from '@/content/data/stuff';
import type { StuffItem } from '@/content/data/stuff';
import { searchSleepNetSites } from '@/lib/sleepnetSites';
import type { SleepNetSite } from '@/lib/sleepnetSites';

// Re-export types from templates
export type { ArtifactType, ArtifactPromptTemplate };

export type ArtifactPromptSource =
  | 'faction'
  | 'sleepnet_page'
  | 'stuff_item'
  | 'regular_file'
  | 'event'
  | 'manual';

export type ArtifactPromptResult = {
  type: ArtifactType;
  title: string;
  prompt: string;
  copyLabel: string;
  source: ArtifactPromptSource;
  sourceSlug?: string;
  templateSlug: string;
  metadata?: Record<string, unknown>;
};

const PROMPT_STORAGE_KEY = 'breakroom.artifact-prompts.v1';

// --- Template variable interpolation ---

function interpolate(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{{${key}}}`, value || '');
  }
  // Remove any remaining unfilled optionals
  result = result.replaceAll(/\{\{[^}]+\}\}/g, '');
  // Clean up doubled spaces and trailing punctuation artifacts
  result = result.replaceAll(/\s{2,}/g, ' ').trim();
  return result;
}

// --- Source data helpers ---

export function getFactionSourceData(factionSlug: string): Record<string, string> | null {
  const faction = BREAKROOM_FACTIONS.find((f) => f.slug === factionSlug);
  if (!faction) return null;

  return {
    factionName: faction.name,
    factionDescription: faction.description,
    factionColors: `${faction.colors.primary}, ${faction.colors.secondary}${faction.colors.accent ? `, ${faction.colors.accent}` : ''}`,
    factionSymbols: faction.symbols.slice(0, 4).join(', '),
    turfDistrict: faction.turf.replaceAll('_', ' '),
    motto: faction.motto,
    subclass: '',
    object: faction.objects[0]?.replaceAll('-', ' ') ?? '',
  };
}

export function getSleepNetSourceData(site: SleepNetSite): Record<string, string> {
  return {
    pageTitle: site.title,
    pageType: site.site_type.replaceAll('_', ' '),
    neighborhood: site.neighborhood.replaceAll('_', ' '),
    badgeText: site.tagline || 'Indexed. Not Explained.',
    canonStatus: '',
  };
}

export function getStuffSourceData(item: StuffItem): Record<string, string> {
  return {
    stuffName: item.name,
    stuffDescription: item.description,
    priceLabel: item.priceLabel ?? 'NO PRICE FILED',
    sourceLabel: item.sourceLabel ?? 'unknown origin',
    relatedFaction: '',
  };
}

// --- Prompt generation ---

export function generatePrompt(input: {
  templateSlug: string;
  variables: Record<string, string>;
  source: ArtifactPromptSource;
  sourceSlug?: string;
}): ArtifactPromptResult | null {
  const template = getTemplateBySlug(input.templateSlug);
  if (!template) return null;

  const basePrompt = interpolate(template.basePrompt, input.variables);

  // Assemble full prompt with style rules and hard nos
  const styleBlock = [...template.styleRules, ...BREAKROOM_STYLE_RULES.slice(0, 5)]
    .map((rule) => `- ${rule}`)
    .join('\n');

  const hardNoBlock = [...template.hardNos, ...BREAKROOM_HARD_NOS.slice(0, 5)]
    .map((no) => `- ${no}`)
    .join('\n');

  const fullPrompt = [
    basePrompt,
    '',
    'Style rules:',
    styleBlock,
    '',
    'Do NOT:',
    hardNoBlock,
    '',
    template.outputNotes.length ? `Output: ${template.outputNotes.join('. ')}.` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return {
    type: template.type,
    title: `${template.title}: ${input.variables[template.requiredInputs[0]] || 'Untitled'}`,
    prompt: fullPrompt,
    copyLabel: `Copy ${template.title} Prompt`,
    source: input.source,
    sourceSlug: input.sourceSlug,
    templateSlug: template.slug,
  };
}

/**
 * Generate a prompt from a faction source.
 */
export function generateFactionPrompt(factionSlug: string, templateSlug: string): ArtifactPromptResult | null {
  const data = getFactionSourceData(factionSlug);
  if (!data) return null;

  return generatePrompt({
    templateSlug,
    variables: data,
    source: 'faction',
    sourceSlug: factionSlug,
  });
}

/**
 * Generate a prompt from a SleepNet page source.
 */
export function generateSleepNetPrompt(site: SleepNetSite, templateSlug: string): ArtifactPromptResult | null {
  const data = getSleepNetSourceData(site);

  return generatePrompt({
    templateSlug,
    variables: data,
    source: 'sleepnet_page',
    sourceSlug: site.slug,
  });
}

/**
 * Generate a prompt from a Stuff item source.
 */
export function generateStuffPrompt(item: StuffItem, templateSlug: string): ArtifactPromptResult | null {
  const data = getStuffSourceData(item);

  return generatePrompt({
    templateSlug,
    variables: data,
    source: 'stuff_item',
    sourceSlug: item.slug,
  });
}

/**
 * Generate a prompt from manual input.
 */
export function generateManualPrompt(templateSlug: string, variables: Record<string, string>): ArtifactPromptResult | null {
  return generatePrompt({
    templateSlug,
    variables,
    source: 'manual',
  });
}

// --- Local storage for saved prompts ---

export function savePromptLocally(result: ArtifactPromptResult): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(PROMPT_STORAGE_KEY);
    const saved: ArtifactPromptResult[] = raw ? JSON.parse(raw) : [];
    saved.unshift(result);
    window.localStorage.setItem(PROMPT_STORAGE_KEY, JSON.stringify(saved.slice(0, 50)));
  } catch {
    // Storage full or unavailable
  }
}

export function getSavedPrompts(): ArtifactPromptResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(PROMPT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// --- Available sources for the studio ---

export function getAvailableFactions(): { slug: string; name: string }[] {
  return BREAKROOM_FACTIONS.map((f) => ({ slug: f.slug, name: f.name }));
}

export async function getAvailableSleepNetPages(): Promise<{ slug: string; title: string }[]> {
  const sites = await searchSleepNetSites('');
  return sites.map((s) => ({ slug: s.slug, title: s.title }));
}

export function getAvailableStuff(): { slug: string; name: string }[] {
  return STUFF_ITEMS.map((s) => ({ slug: s.slug, name: s.name }));
}

export function getTemplates() {
  return ARTIFACT_PROMPT_TEMPLATES;
}

import { getAgentBySlug, getAgentsForFaction, getAgentsForSiteType } from '@/content/data/agents';
import type { BreakroomAgent } from '@/content/data/agents';
import type { SleepNetCharacterCommentComponent } from '@/lib/sleepnetComponents';
import type { SleepNetSiteType } from '@/lib/sleepnetGenerators';
import type { SleepNetSite } from '@/lib/sleepnetSites';

export const AGENT_MEMORY_LEVELS = [
  { level: 0, label: 'Flavor Agent', description: 'Static flavor and small page comments. No memory.' },
  { level: 1, label: 'Page Agent', description: 'Context-aware to the current page, type, and faction hooks.' },
  { level: 2, label: 'Profile Agent', description: 'Future: aware of Regular File and user-owned pages.' },
  { level: 3, label: 'World Agent', description: 'Future: aware of broader world state, unlocks, and factions.' },
  { level: 4, label: 'Host Agent', description: 'Future: guided creation and orchestration.' },
] as const;

export const AGENT_CONTRADICTION_RULE = 'Agents may contradict each other if contradiction creates humor, discovery, unlocks, or faction tension. Agents must not contradict user ownership, privacy, payment, authentication, or persistence state.';

function chooseAgent(site: Pick<SleepNetSite, 'site_type' | 'related_agent_slug' | 'faction_affinity'>) {
  const related = site.related_agent_slug ? getAgentBySlug(site.related_agent_slug) : null;
  if (related) return related;

  const factionSlug = site.faction_affinity?.[0];
  const factionAgents = factionSlug ? getAgentsForFaction(factionSlug) : [];
  if (factionAgents[0]) return factionAgents[0];

  const siteTypeAgents = getAgentsForSiteType(site.site_type as SleepNetSiteType);
  return siteTypeAgents[0] ?? getAgentBySlug('unknown-employee');
}

function chooseLine(agent: BreakroomAgent, site: Pick<SleepNetSite, 'title' | 'site_type' | 'neighborhood'>) {
  const seed = `${site.title}-${site.site_type}-${site.neighborhood}`.length;
  return agent.sampleLines[seed % agent.sampleLines.length] ?? agent.sampleLines[0] ?? 'This page was noticed.';
}

export function generateAgentCommentForSite(site: Pick<SleepNetSite, 'title' | 'site_type' | 'neighborhood' | 'related_agent_slug' | 'faction_affinity'>): SleepNetCharacterCommentComponent {
  const agent = chooseAgent(site) ?? getAgentBySlug('unknown-employee');
  const fallback = 'This page was noticed by something with a badge but no office.';

  return {
    id: `agent-${agent?.slug ?? 'unknown-employee'}`,
    type: 'character_comment',
    agentSlug: agent?.slug ?? 'unknown-employee',
    agentName: agent?.name ?? 'Unknown Employee',
    body: agent ? chooseLine(agent, site) : fallback,
  };
}

export function replaceOrAppendAgentComment(site: SleepNetSite) {
  const nextComment = generateAgentCommentForSite(site);
  const components = site.components ?? [];
  const hasAgentComment = components.some((component) => component.type === 'character_comment');

  return {
    ...site,
    components: hasAgentComment
      ? components.map((component) => component.type === 'character_comment' ? nextComment : component)
      : [...components, nextComment],
  };
}

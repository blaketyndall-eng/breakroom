import { supabase } from '@/lib/supabaseClient';
import { getAgentBySlug, getAgentsForFaction, getAgentsForSiteType, BREAKROOM_AGENTS } from '@/content/data/agents';
import type { BreakroomAgent } from '@/content/data/agents';
import type { SleepNetSiteType } from '@/lib/sleepnetGenerators';

// --- Types ---

export type AgentCommentTargetType = 'sleepnet_site' | 'faction' | 'guestbook' | 'artifact' | 'regular_file' | 'event';
export type AgentCommentTrigger = 'page_visit' | 'drift_threshold' | 'guestbook_activity' | 'scheduled' | 'seed';

export type AgentComment = {
  id: string;
  agentSlug: string;
  targetType: AgentCommentTargetType;
  targetSlug: string;
  body: string;
  tone: string | null;
  triggerSource: AgentCommentTrigger | null;
  isVisible: boolean;
  createdAt: string;
};

// --- Constants ---

export const LOCAL_AGENT_COMMENTS_KEY = 'breakroom.agent-comments.v1';
export const AGENT_COMMENT_EVENT = 'breakroom:agent-comment-added';
export const AGENT_COMMENT_COOLDOWN_MS = 10 * 60 * 1000; // 10 min dedup window

// --- Extended agent lines by context ---
// These supplement the sampleLines in the agent registry with context-aware variants

const FACTION_COMMENT_LINES: Record<string, Record<string, string[]>> = {
  'the-players': {
    'pool-table-oracle': [
      'New name near the table. The chalk noticed first.',
      'Someone stood too long near the rail. That counts.',
      'The rack remembers who broke last.',
    ],
    'night-manager': [
      'This faction has not filed its activity report. Nobody will ask.',
      'The table is reserved for people who don\'t ask permission.',
    ],
  },
  'lot-racers': {
    'seven-eleven-clerk': [
      'Exhaust smell is stronger on this page than usual.',
      'Someone left a timing slip in the guestbook. Not a good sign.',
    ],
    'weather-voice': [
      'Conditions in the lot favor those who arrive after midnight.',
      'Dashboard lights reflect differently tonight. No advisory issued.',
    ],
  },
  'night-drinkers': {
    'phone-behind-the-bar': [
      'It rang when someone new signed the guestbook.',
      'The phone knows who called but not who answered.',
    ],
    'random-friend': [
      'Pretty sure I\'ve seen half these names on a napkin.',
      'This is starting to feel like a reunion nobody planned.',
    ],
  },
  'the-smokers': {
    'seven-eleven-clerk': [
      'Fence talk is louder tonight. Someone said something true.',
      'The light behind the building is green again.',
    ],
    'random-friend': [
      'I know at least one person here by their lighter brand.',
      'Nobody introduced themselves but everyone already knows.',
    ],
  },
  cowboys: {
    'weather-voice': [
      'Dust advisory is real today. The cooler condensation confirms.',
      'The lot temperature changed when this page loaded.',
    ],
    'room-admin': [
      'This faction\'s file was moved to a cabinet nobody labeled.',
      'Ownership records suggest the cooler was always here.',
    ],
  },
};

const GUESTBOOK_COMMENT_LINES: Record<string, string[]> = {
  'random-friend': [
    'I think the person above me is lying about their name.',
    'This guestbook has more honesty than most job applications.',
    'Signed by someone who was definitely here last Tuesday.',
  ],
  'unknown-employee': [
    'Somebody already signed this, then erased the pen.',
    'The guestbook was here before the page was.',
    'This entry will not be verified.',
  ],
  'directory-clerk': [
    'This guestbook has been indexed against its will.',
    'Entries are filed but not read. Standard procedure.',
  ],
  'night-manager': [
    'Guestbook remains open after hours. Management is aware.',
    'These signatures look real, which is suspicious.',
  ],
  'seven-eleven-clerk': [
    'I\'ve seen worse handwriting. That is the only compliment.',
    'Someone signed this with a pen they did not buy here.',
  ],
};

// --- Design-level-aware comment lines ---
// Agents shift voice to match the page atmosphere.

const LEVEL_COMMENT_LINES: Record<1 | 2 | 4, Record<string, string[]>> = {
  1: {
    'night-manager': [
      'This page is leaking. Management does not acknowledge leaks.',
      'The terminal was left open. The terminal is always open.',
      'Screen flicker confirmed. Cause: unknown. Status: unchanged.',
    ],
    'directory-clerk': [
      'This URL was not requested. The directory filed it anyway.',
      'Page source: corrupted. Page status: visible. That is worse.',
      'The index lost this page. The page did not notice.',
    ],
    'pool-table-oracle': [
      'The green light never turns off on this page.',
      'Something scratched the felt here. Not chalk.',
    ],
    'unknown-employee': [
      'This terminal has been on since before the building.',
      'Nobody clocked in to this page. The page clocked itself.',
    ],
    'seven-eleven-clerk': [
      'The fluorescent above this page has been blinking for months.',
      'I can smell ozone through the screen. That should not be possible.',
    ],
  },
  2: {
    'night-manager': [
      'Somebody was here after closing. The page remembers.',
      'The back room light is on. Nobody turned it on.',
    ],
    'directory-clerk': [
      'This page was filed under a name the directory does not recognize.',
      'Indexed after dark. The timestamp disagrees with the clock.',
    ],
    'pool-table-oracle': [
      'Red felt under the links. The table knows what that means.',
      'Somebody chalked the wrong end. The table noticed.',
    ],
    'random-friend': [
      'I know this page from somewhere. That is not a good sign.',
      'Pretty sure I was here before. It looked different then.',
    ],
    'phone-behind-the-bar': [
      'The phone rang when this page loaded. Nobody answered.',
      'Voicemail is full. Has been full since the page went live.',
    ],
  },
  4: {
    'night-manager': [
      'This page has been reviewed and approved per OmniShift protocol.',
      'Compliance check: passed. The page is within parameters.',
    ],
    'directory-clerk': [
      'Properly indexed. Filed on time. No further action required.',
      'This page meets directory standards. That is the only compliment.',
    ],
    'room-admin': [
      'Page formatted correctly. Content pending management review.',
      'This page will be included in the quarterly status report.',
    ],
    'unknown-employee': [
      'The page loaded within acceptable timeframes.',
      'This content has been approved by the appropriate department.',
    ],
  },
};

// --- Local storage helpers ---

type LocalAgentCommentMap = Record<string, AgentComment[]>;

function readLocalComments(): LocalAgentCommentMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_AGENT_COMMENTS_KEY);
    return raw ? JSON.parse(raw) as LocalAgentCommentMap : {};
  } catch {
    return {};
  }
}

function writeLocalComments(map: LocalAgentCommentMap) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCAL_AGENT_COMMENTS_KEY, JSON.stringify(map));
}

function targetKey(targetType: AgentCommentTargetType, targetSlug: string) {
  return `${targetType}:${targetSlug}`;
}

// --- Core logic ---

/**
 * Choose an appropriate agent to comment on a given target.
 */
function chooseAgentForTarget(targetType: AgentCommentTargetType, targetSlug: string, context?: { siteType?: SleepNetSiteType; factionSlug?: string }): BreakroomAgent | null {
  if (targetType === 'faction' && context?.factionSlug) {
    const factionAgents = getAgentsForFaction(context.factionSlug);
    if (factionAgents.length) {
      const seed = targetSlug.length + Date.now() % 100;
      return factionAgents[seed % factionAgents.length] ?? factionAgents[0];
    }
  }

  if (targetType === 'sleepnet_site' && context?.siteType) {
    const siteAgents = getAgentsForSiteType(context.siteType);
    if (siteAgents.length) {
      const seed = targetSlug.length + Date.now() % 100;
      return siteAgents[seed % siteAgents.length] ?? siteAgents[0];
    }
  }

  if (targetType === 'guestbook') {
    const guestbookAgentSlugs = Object.keys(GUESTBOOK_COMMENT_LINES);
    const seed = targetSlug.length + Date.now() % 100;
    const slug = guestbookAgentSlugs[seed % guestbookAgentSlugs.length];
    return slug ? getAgentBySlug(slug) : getAgentBySlug('unknown-employee');
  }

  // Fallback: pick from all agents
  const seed = targetSlug.length + Date.now() % 100;
  return BREAKROOM_AGENTS[seed % BREAKROOM_AGENTS.length] ?? getAgentBySlug('unknown-employee');
}

/**
 * Choose a line for a given agent and context.
 */
function chooseLineForContext(agent: BreakroomAgent, targetType: AgentCommentTargetType, targetSlug: string, context?: { factionSlug?: string; designLevel?: 1 | 2 | 3 | 4 }): string {
  // Try design-level-specific lines first (atmosphere-aware)
  if (context?.designLevel && context.designLevel !== 3) {
    const levelLines = LEVEL_COMMENT_LINES[context.designLevel as 1 | 2 | 4]?.[agent.slug];
    if (levelLines?.length) {
      const seed = targetSlug.length + Date.now() % 1000;
      return levelLines[seed % levelLines.length]!;
    }
  }

  // Try faction-specific lines
  if (targetType === 'faction' && context?.factionSlug) {
    const factionLines = FACTION_COMMENT_LINES[context.factionSlug]?.[agent.slug];
    if (factionLines?.length) {
      const seed = targetSlug.length + Date.now() % 1000;
      return factionLines[seed % factionLines.length]!;
    }
  }

  // Try guestbook-specific lines
  if (targetType === 'guestbook') {
    const gbLines = GUESTBOOK_COMMENT_LINES[agent.slug];
    if (gbLines?.length) {
      const seed = targetSlug.length + Date.now() % 1000;
      return gbLines[seed % gbLines.length]!;
    }
  }

  // Fallback to sampleLines
  const seed = targetSlug.length + Date.now() % 1000;
  return agent.sampleLines[seed % agent.sampleLines.length] ?? 'This page was noticed.';
}

/**
 * Check if a comment was recently added for this target (dedup).
 */
function recentlyCommented(targetType: AgentCommentTargetType, targetSlug: string): boolean {
  const key = targetKey(targetType, targetSlug);
  const map = readLocalComments();
  const existing = map[key];
  if (!existing?.length) return false;

  const latest = existing[existing.length - 1];
  if (!latest) return false;
  return Date.now() - Date.parse(latest.createdAt) < AGENT_COMMENT_COOLDOWN_MS;
}

// --- Public API ---

/**
 * Generate and persist an agent comment for a target.
 * Returns null if dedup cooldown is active.
 */
export function generateAgentComment(input: {
  targetType: AgentCommentTargetType;
  targetSlug: string;
  trigger: AgentCommentTrigger;
  context?: { siteType?: SleepNetSiteType; factionSlug?: string; designLevel?: 1 | 2 | 3 | 4 };
}): AgentComment | null {
  if (typeof window === 'undefined') return null;
  if (recentlyCommented(input.targetType, input.targetSlug)) return null;

  const agent = chooseAgentForTarget(input.targetType, input.targetSlug, input.context);
  if (!agent) return null;

  const body = chooseLineForContext(agent, input.targetType, input.targetSlug, input.context);

  const comment: AgentComment = {
    id: `agent-comment-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    agentSlug: agent.slug,
    targetType: input.targetType,
    targetSlug: input.targetSlug,
    body,
    tone: agent.voice.split(',')[0]?.trim() ?? null,
    triggerSource: input.trigger,
    isVisible: true,
    createdAt: new Date().toISOString(),
  };

  // Save locally
  const key = targetKey(input.targetType, input.targetSlug);
  const map = readLocalComments();
  const existing = map[key] ?? [];
  map[key] = [...existing, comment].slice(-10); // Keep last 10 per target
  writeLocalComments(map);

  // Persist to Supabase (fire and forget)
  persistCommentToSupabase(comment).catch(() => {});

  // Notify listeners
  window.dispatchEvent(new CustomEvent(AGENT_COMMENT_EVENT, { detail: comment }));

  return comment;
}

/**
 * Get all agent comments for a target (local + Supabase merged).
 */
export async function getAgentCommentsForTarget(targetType: AgentCommentTargetType, targetSlug: string): Promise<AgentComment[]> {
  const key = targetKey(targetType, targetSlug);
  const localMap = readLocalComments();
  const local = localMap[key] ?? [];

  if (!supabase) return local;

  const { data, error } = await supabase
    .from('agent_comments')
    .select('*')
    .eq('target_type', targetType)
    .eq('target_slug', targetSlug)
    .eq('is_visible', true)
    .order('created_at', { ascending: true })
    .limit(20);

  if (error || !data?.length) return local;

  const remote: AgentComment[] = data.map((row) => ({
    id: row.id,
    agentSlug: row.agent_slug,
    targetType: row.target_type,
    targetSlug: row.target_slug,
    body: row.body,
    tone: row.tone,
    triggerSource: row.trigger_source,
    isVisible: row.is_visible,
    createdAt: row.created_at,
  }));

  // Merge: remote first, then local entries not yet in remote
  const remoteIds = new Set(remote.map((c) => c.id));
  const merged = [...remote, ...local.filter((c) => !remoteIds.has(c.id))];
  return merged.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
}

/**
 * Get agent comments synchronously from local storage only.
 */
export function getLocalAgentComments(targetType: AgentCommentTargetType, targetSlug: string): AgentComment[] {
  const key = targetKey(targetType, targetSlug);
  const map = readLocalComments();
  return map[key] ?? [];
}

// --- Supabase persistence ---

async function persistCommentToSupabase(comment: AgentComment): Promise<void> {
  if (!supabase) return;

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return; // Only persist when authenticated

  await supabase.from('agent_comments').insert({
    agent_slug: comment.agentSlug,
    target_type: comment.targetType,
    target_slug: comment.targetSlug,
    body: comment.body,
    tone: comment.tone,
    trigger_source: comment.triggerSource,
    is_visible: comment.isVisible,
  });
}

// --- Guestbook agent entry helper ---

/**
 * Generate an agent entry for a guestbook using the existing guestbook system.
 * Returns input compatible with addGuestbookEntry.
 */
export function generateAgentGuestbookEntry(siteSlug: string, context?: { factionSlug?: string }): {
  siteSlug: string;
  alias: string;
  message: string;
  actorType: 'agent';
  agentSlug: string;
} | null {
  if (typeof window === 'undefined') return null;

  const agent = chooseAgentForTarget('guestbook', siteSlug, context);
  if (!agent) return null;

  const body = chooseLineForContext(agent, 'guestbook', siteSlug, context);

  return {
    siteSlug,
    alias: agent.name,
    message: body,
    actorType: 'agent',
    agentSlug: agent.slug,
  };
}

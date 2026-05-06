/**
 * Field Prompts — the Pocket Mode differentiator.
 *
 * Daily micro-tasks that push users out of the phone and into real life.
 * Organized into 5 layers of personalization:
 *   1. Universal (no identity required)
 *   2. Faction-specific (turf membership or strong drift)
 *   3. Profile-reactive (Regular File data)
 *   4. Drawer-reactive (saved objects)
 *   5. Drift-bait (covert recruitment — leans toward a faction without naming it)
 *
 * Uses the personalization engine for weighted selection and template filling.
 */

import {
  type PersonalizedPool,
  selectPersonalizedContent,
  fillTemplate,
  getPocketIdentity,
  invalidateIdentityCache,
} from '@/lib/pocketPersonalization';
import { recordFactionSignal } from '@/lib/factionDrift';

// --- Types ---

export type FieldPromptCategory = 'observation' | 'object' | 'social' | 'creative' | 'world_building';

export type FieldPrompt = {
  id: string;
  text: string;
  category: FieldPromptCategory;
  frame: string; // e.g. "FIELD OBSERVATION REQUESTED"
  /** If set, completing this prompt records a drift signal for this faction */
  driftBaitFaction?: string;
};

export type FieldPromptCompletion = {
  promptId: string;
  response: string;
  completedAt: string;
  category: FieldPromptCategory;
  driftBaitFaction?: string;
};

// --- Storage ---

const STORAGE_KEY = 'breakroom.field-prompts.v1';
const TODAY_PROMPT_KEY = 'breakroom.field-prompt-today.v1';

function getCompletions(): FieldPromptCompletion[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCompletions(completions: FieldPromptCompletion[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(completions.slice(0, 100)));
}

// --- Frames ---

const FRAMES = {
  default: 'FIELD OBSERVATION REQUESTED',
  question: 'THE ROOM HAS A QUESTION',
  management: 'MANAGEMENT REQUESTS',
  night_manager: 'NIGHT MANAGER ASKS',
  inventory: 'INVENTORY CHECK',
  players: 'THE PLAYERS ASK',
  lot_racers: 'LOT RACERS DISPATCH',
  night_drinkers: 'BAR REPORT REQUESTED',
  the_smokers: 'FENCE BULLETIN',
  cowboys: 'OPEN FIELD REPORT',
} as const;

// --- Prompt Registry ---

// Layer 1: Universal Prompts (no identity required)
const UNIVERSAL_PROMPTS: FieldPrompt[] = [
  // Observation
  { id: 'u-obs-01', text: 'Count the stools at the nearest bar. Report the number.', category: 'observation', frame: FRAMES.default },
  { id: 'u-obs-02', text: 'Find something yellow within arm\'s reach. What is it.', category: 'observation', frame: FRAMES.default },
  { id: 'u-obs-03', text: 'Look at the ceiling. Describe it in four words.', category: 'observation', frame: FRAMES.default },
  { id: 'u-obs-04', text: 'What is the nearest handwritten thing.', category: 'observation', frame: FRAMES.default },
  { id: 'u-obs-05', text: 'Read the smallest text you can find. What does it say.', category: 'observation', frame: FRAMES.default },
  { id: 'u-obs-06', text: 'How many light sources can you see. Count them.', category: 'observation', frame: FRAMES.default },
  { id: 'u-obs-07', text: 'What color is the floor directly below you.', category: 'observation', frame: FRAMES.default },
  { id: 'u-obs-08', text: 'Describe the nearest sound that is not a voice.', category: 'observation', frame: FRAMES.question },
  { id: 'u-obs-09', text: 'What is the oldest thing you can see.', category: 'observation', frame: FRAMES.question },
  { id: 'u-obs-10', text: 'How many doors can you see from where you are.', category: 'observation', frame: FRAMES.default },

  // Object
  { id: 'u-obj-01', text: 'Locate the nearest vending machine. What\'s in slot A3.', category: 'object', frame: FRAMES.inventory },
  { id: 'u-obj-02', text: 'Find a matchbook, coaster, or napkin. What\'s printed on it.', category: 'object', frame: FRAMES.inventory },
  { id: 'u-obj-03', text: 'Pick up the nearest object that costs less than a dollar. Describe it.', category: 'object', frame: FRAMES.inventory },
  { id: 'u-obj-04', text: 'Find something that looks like evidence. File it.', category: 'object', frame: FRAMES.management },
  { id: 'u-obj-05', text: 'What is the nearest object with a serial number or code on it.', category: 'object', frame: FRAMES.inventory },
  { id: 'u-obj-06', text: 'Find a menu. What is the most expensive item.', category: 'object', frame: FRAMES.inventory },
  { id: 'u-obj-07', text: 'Locate something with a logo on it. Describe the logo in five words.', category: 'object', frame: FRAMES.default },
  { id: 'u-obj-08', text: 'Find the nearest thing made of glass. What does it contain.', category: 'object', frame: FRAMES.inventory },

  // Social
  { id: 'u-soc-01', text: 'Ask someone nearby what they had for lunch. File the answer.', category: 'social', frame: FRAMES.management },
  { id: 'u-soc-02', text: 'Ask a stranger to pick a number between 1 and 147.', category: 'social', frame: FRAMES.question },
  { id: 'u-soc-03', text: 'Find someone wearing a hat. What kind.', category: 'social', frame: FRAMES.default },
  { id: 'u-soc-04', text: 'Compliment someone on something specific. Report what you said.', category: 'social', frame: FRAMES.management },
  { id: 'u-soc-05', text: 'Ask the nearest person what the best thing about today is.', category: 'social', frame: FRAMES.night_manager },
  { id: 'u-soc-06', text: 'Find someone reading something. What are they reading.', category: 'social', frame: FRAMES.default },

  // Creative
  { id: 'u-cre-01', text: 'Write one word on a napkin. Leave it somewhere.', category: 'creative', frame: FRAMES.management },
  { id: 'u-cre-02', text: 'Draw the worst logo for a fake company. Describe it.', category: 'creative', frame: FRAMES.default },
  { id: 'u-cre-03', text: 'Invent a drink. Name it. Price it. File the menu item.', category: 'creative', frame: FRAMES.management },
  { id: 'u-cre-04', text: 'Write a one-line review of the nearest building.', category: 'creative', frame: FRAMES.default },
  { id: 'u-cre-05', text: 'Name the smell of where you are. One word.', category: 'creative', frame: FRAMES.question },
  { id: 'u-cre-06', text: 'Invent a menu item for Very Good Burger. Describe it.', category: 'creative', frame: FRAMES.management },

  // World-building
  { id: 'u-wld-01', text: 'The nearest door is now a Breakroom door. Name the district behind it.', category: 'world_building', frame: FRAMES.night_manager },
  { id: 'u-wld-02', text: 'The object to your left is now Stuff. Give it a status.', category: 'world_building', frame: FRAMES.management },
  { id: 'u-wld-03', text: 'You\'re in a new district. What\'s it called. What does it sell.', category: 'world_building', frame: FRAMES.night_manager },
  { id: 'u-wld-04', text: 'The person nearest you is now an NPC. What\'s their agent name.', category: 'world_building', frame: FRAMES.question },
  { id: 'u-wld-05', text: 'Write the plaque on the nearest wall. What does it commemorate.', category: 'world_building', frame: FRAMES.management },
  { id: 'u-wld-06', text: 'The nearest vehicle is now a Breakroom vehicle. What faction drives it.', category: 'world_building', frame: FRAMES.night_manager },
];

// Layer 2: Faction-Specific Prompts
const FACTION_PROMPTS: FieldPrompt[] = [
  // The Players
  { id: 'f-play-01', text: 'How many pool tables are within walking distance. Estimate.', category: 'observation', frame: FRAMES.players },
  { id: 'f-play-02', text: 'Estimate the angle between the nearest two flat surfaces.', category: 'observation', frame: FRAMES.players },
  { id: 'f-play-03', text: 'Find the nearest chalk-like substance. What color.', category: 'object', frame: FRAMES.players },
  { id: 'f-play-04', text: 'Rate the nearest table on a scale of warped to tournament.', category: 'observation', frame: FRAMES.players },
  { id: 'f-play-05', text: 'How many round objects can you see without turning your head.', category: 'observation', frame: FRAMES.players },
  { id: 'f-play-06', text: 'Describe the best shot you could make from where you\'re sitting.', category: 'creative', frame: FRAMES.players },
  { id: 'f-play-07', text: 'Find the nearest green surface. Report its condition.', category: 'observation', frame: FRAMES.players },
  { id: 'f-play-08', text: 'What is the nearest thing you could use as a cue. Describe it.', category: 'object', frame: FRAMES.players },

  // Lot Racers
  { id: 'f-lot-01', text: 'Describe the nearest parking lot in three words.', category: 'observation', frame: FRAMES.lot_racers },
  { id: 'f-lot-02', text: 'What color is the most interesting car you can see.', category: 'observation', frame: FRAMES.lot_racers },
  { id: 'f-lot-03', text: 'Find the nearest set of tire marks. How dramatic.', category: 'observation', frame: FRAMES.lot_racers },
  { id: 'f-lot-04', text: 'What\'s the furthest thing you can see from a parking lot.', category: 'observation', frame: FRAMES.lot_racers },
  { id: 'f-lot-05', text: 'Rate the nearest intersection. Scale of safe to legendary.', category: 'observation', frame: FRAMES.lot_racers },
  { id: 'f-lot-06', text: 'Find a license plate. Report the state. Not the number.', category: 'object', frame: FRAMES.lot_racers },
  { id: 'f-lot-07', text: 'How many vehicles can you see from where you are. Count.', category: 'observation', frame: FRAMES.lot_racers },
  { id: 'f-lot-08', text: 'Describe the nearest headlight. Is it on. Should it be.', category: 'observation', frame: FRAMES.lot_racers },

  // Night Drinkers
  { id: 'f-nite-01', text: 'Find the nearest bar. How many stools. Report.', category: 'observation', frame: FRAMES.night_drinkers },
  { id: 'f-nite-02', text: 'What\'s the cheapest drink within walking distance.', category: 'object', frame: FRAMES.night_drinkers },
  { id: 'f-nite-03', text: 'Describe the nearest neon sign.', category: 'observation', frame: FRAMES.night_drinkers },
  { id: 'f-nite-04', text: 'What\'s written on the nearest napkin.', category: 'object', frame: FRAMES.night_drinkers },
  { id: 'f-nite-05', text: 'Rate the nearest glass on a scale of empty to regrettable.', category: 'observation', frame: FRAMES.night_drinkers },
  { id: 'f-nite-06', text: 'Find the darkest corner. What\'s in it.', category: 'observation', frame: FRAMES.night_drinkers },
  { id: 'f-nite-07', text: 'Describe the nearest bartender. Or the nearest person who should be.', category: 'social', frame: FRAMES.night_drinkers },
  { id: 'f-nite-08', text: 'What song is playing. If nothing, what should be.', category: 'creative', frame: FRAMES.night_drinkers },

  // The Smokers
  { id: 'f-smok-01', text: 'Find the nearest fence. What\'s on the other side.', category: 'observation', frame: FRAMES.the_smokers },
  { id: 'f-smok-02', text: 'How many people are outside who shouldn\'t be.', category: 'social', frame: FRAMES.the_smokers },
  { id: 'f-smok-03', text: 'Find the nearest exit. Describe the light outside it.', category: 'observation', frame: FRAMES.the_smokers },
  { id: 'f-smok-04', text: 'What is the temperature outside. Don\'t check your phone.', category: 'observation', frame: FRAMES.the_smokers },
  { id: 'f-smok-05', text: 'Describe the nearest thing posted on a fence or pole.', category: 'object', frame: FRAMES.the_smokers },
  { id: 'f-smok-06', text: 'How long has it been since you were outside. Estimate.', category: 'observation', frame: FRAMES.the_smokers },

  // Cowboys
  { id: 'f-cow-01', text: 'How far is the nearest open sky from where you are.', category: 'observation', frame: FRAMES.cowboys },
  { id: 'f-cow-02', text: 'Find the nearest thing with a boot print or tire track.', category: 'object', frame: FRAMES.cowboys },
  { id: 'f-cow-03', text: 'What is the widest open space you can see.', category: 'observation', frame: FRAMES.cowboys },
  { id: 'f-cow-04', text: 'Describe the nearest cooler, ice chest, or cold storage.', category: 'object', frame: FRAMES.cowboys },
  { id: 'f-cow-05', text: 'Find something that could hold water. Describe it.', category: 'object', frame: FRAMES.cowboys },
  { id: 'f-cow-06', text: 'What is the nearest thing a hat could be hung on.', category: 'observation', frame: FRAMES.cowboys },
];

// Layer 3: Profile-Reactive Prompts (uses template strings)
const PROFILE_PROMPTS: FieldPrompt[] = [
  { id: 'p-01', text: 'Your ${assignedObject} wants to know where the nearest door leads.', category: 'world_building', frame: FRAMES.night_manager },
  { id: 'p-02', text: 'Under ${favoriteLight} light, what looks different about this place.', category: 'observation', frame: FRAMES.question },
  { id: 'p-03', text: '${handle}, the room has a question: what is directly behind you.', category: 'observation', frame: FRAMES.question },
  { id: 'p-04', text: 'Your ${assignedObject} was last seen near here. Confirm or deny.', category: 'object', frame: FRAMES.management },
  { id: 'p-05', text: 'Someone quoted your away message. Was it accurate.', category: 'creative', frame: FRAMES.management },
  { id: 'p-06', text: '${handle}: field report requested. Describe your current location in the voice of a stranger.', category: 'creative', frame: FRAMES.default },
  { id: 'p-07', text: 'Your ${assignedObject} is asking about the nearest flat surface. Measure it by hand span.', category: 'object', frame: FRAMES.night_manager },
  { id: 'p-08', text: 'A message for ${handle}: look to your left. File what you see.', category: 'observation', frame: FRAMES.management },
];

// Layer 4: Drawer-Reactive Prompts (uses template strings)
const DRAWER_PROMPTS: FieldPrompt[] = [
  { id: 'd-01', text: 'The ${drawerItem} in your drawer is asking about the nearest flat surface.', category: 'object', frame: FRAMES.inventory },
  { id: 'd-02', text: 'Find something that looks like it belongs next to your ${drawerItem}.', category: 'object', frame: FRAMES.inventory },
  { id: 'd-03', text: 'Your drawer has ${drawerCount} items. Find one more. Describe it.', category: 'object', frame: FRAMES.management },
  { id: 'd-04', text: 'The ${drawerItem} changed status. Confirm by observing your surroundings.', category: 'observation', frame: FRAMES.inventory },
  { id: 'd-05', text: 'Something near you resembles your ${drawerItem}. What is it.', category: 'observation', frame: FRAMES.question },
  { id: 'd-06', text: 'Write a classified ad for your ${drawerItem}. One line.', category: 'creative', frame: FRAMES.management },
];

// Layer 5: Drift-Bait Prompts (covert recruitment — leans toward a faction without naming it)
const DRIFT_BAIT_PROMPTS: FieldPrompt[] = [
  // Players-bait (games, angles, strategy, green felt)
  { id: 'db-play-01', text: 'Find the nearest game. Any game. What are the rules.', category: 'observation', frame: FRAMES.default, driftBaitFaction: 'the-players' },
  { id: 'db-play-02', text: 'Estimate the angle of the nearest leaning object. Degrees.', category: 'observation', frame: FRAMES.question, driftBaitFaction: 'the-players' },
  { id: 'db-play-03', text: 'Find something green and flat. How worn is it.', category: 'observation', frame: FRAMES.default, driftBaitFaction: 'the-players' },
  { id: 'db-play-04', text: 'If you had to call a shot right now, what would it be.', category: 'creative', frame: FRAMES.question, driftBaitFaction: 'the-players' },

  // Lot Racers-bait (cars, asphalt, speed, night driving)
  { id: 'db-lot-01', text: 'Find the nearest parking lot. Rate the asphalt. Scale of 1-10.', category: 'observation', frame: FRAMES.default, driftBaitFaction: 'lot-racers' },
  { id: 'db-lot-02', text: 'What\'s the fastest thing you can see right now.', category: 'observation', frame: FRAMES.question, driftBaitFaction: 'lot-racers' },
  { id: 'db-lot-03', text: 'Describe the nearest set of wheels. Any wheels.', category: 'observation', frame: FRAMES.default, driftBaitFaction: 'lot-racers' },
  { id: 'db-lot-04', text: 'If you had to leave right now, which direction.', category: 'creative', frame: FRAMES.question, driftBaitFaction: 'lot-racers' },

  // Night Drinkers-bait (bars, stools, neon, dark)
  { id: 'db-nite-01', text: 'Find the nearest bar. How many stools. Report.', category: 'observation', frame: FRAMES.default, driftBaitFaction: 'night-drinkers' },
  { id: 'db-nite-02', text: 'What\'s the cheapest drink within walking distance.', category: 'object', frame: FRAMES.question, driftBaitFaction: 'night-drinkers' },
  { id: 'db-nite-03', text: 'Describe the nearest neon sign. Or the nearest thing pretending to be one.', category: 'observation', frame: FRAMES.default, driftBaitFaction: 'night-drinkers' },
  { id: 'db-nite-04', text: 'It\'s always 1:47 somewhere. What would you order.', category: 'creative', frame: FRAMES.question, driftBaitFaction: 'night-drinkers' },

  // Smokers-bait (outside, fences, breaks, gossip)
  { id: 'db-smok-01', text: 'Step outside. What\'s the first thing you notice.', category: 'observation', frame: FRAMES.default, driftBaitFaction: 'the-smokers' },
  { id: 'db-smok-02', text: 'How many people are taking a break right now. Visible count.', category: 'social', frame: FRAMES.default, driftBaitFaction: 'the-smokers' },
  { id: 'db-smok-03', text: 'Find the nearest fence. What\'s posted on it.', category: 'observation', frame: FRAMES.question, driftBaitFaction: 'the-smokers' },

  // Cowboys-bait (open space, sky, hats, distance)
  { id: 'db-cow-01', text: 'Look at the sky. Describe it in three words.', category: 'observation', frame: FRAMES.default, driftBaitFaction: 'cowboys' },
  { id: 'db-cow-02', text: 'What is the furthest thing you can see from where you are.', category: 'observation', frame: FRAMES.question, driftBaitFaction: 'cowboys' },
  { id: 'db-cow-03', text: 'Find the nearest open space. How many steps to cross it.', category: 'observation', frame: FRAMES.default, driftBaitFaction: 'cowboys' },
];

// --- Faction → Prompt Mapping ---

const FACTION_TO_PROMPTS: Record<string, FieldPrompt[]> = {
  'the-players': FACTION_PROMPTS.filter(p => p.frame === FRAMES.players),
  'lot-racers': FACTION_PROMPTS.filter(p => p.frame === FRAMES.lot_racers),
  'night-drinkers': FACTION_PROMPTS.filter(p => p.frame === FRAMES.night_drinkers),
  'the-smokers': FACTION_PROMPTS.filter(p => p.frame === FRAMES.the_smokers),
  cowboys: FACTION_PROMPTS.filter(p => p.frame === FRAMES.cowboys),
};

const FACTION_DRIFT_BAIT: Record<string, FieldPrompt[]> = {
  'the-players': DRIFT_BAIT_PROMPTS.filter(p => p.driftBaitFaction === 'the-players'),
  'lot-racers': DRIFT_BAIT_PROMPTS.filter(p => p.driftBaitFaction === 'lot-racers'),
  'night-drinkers': DRIFT_BAIT_PROMPTS.filter(p => p.driftBaitFaction === 'night-drinkers'),
  'the-smokers': DRIFT_BAIT_PROMPTS.filter(p => p.driftBaitFaction === 'the-smokers'),
  cowboys: DRIFT_BAIT_PROMPTS.filter(p => p.driftBaitFaction === 'cowboys'),
};

// --- Public API ---

/**
 * Get today's field prompt, personalized to the user's identity.
 * Returns the same prompt for the same calendar day (seeded).
 * Prompt text is filled with identity values.
 */
export function getTodaysPrompt(): FieldPrompt {
  if (typeof window === 'undefined') {
    return UNIVERSAL_PROMPTS[0];
  }

  const today = new Date().toISOString().slice(0, 10);

  // Check if we already selected today's prompt
  try {
    const stored = localStorage.getItem(TODAY_PROMPT_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today && parsed.prompt) {
        return parsed.prompt as FieldPrompt;
      }
    }
  } catch { /* regenerate */ }

  // Build personalized pools
  const identity = getPocketIdentity();
  const pools: PersonalizedPool<FieldPrompt>[] = [
    { layer: 'universal', items: UNIVERSAL_PROMPTS },
  ];

  // Add faction-specific pool if user has turf
  if (identity.turf && FACTION_TO_PROMPTS[identity.turf]) {
    pools.push({
      layer: 'turf',
      factionSlug: identity.turf,
      items: FACTION_TO_PROMPTS[identity.turf],
    });
  }

  // Add drift-bait pool if user has drift but no turf
  if (!identity.turf && identity.driftFaction && FACTION_DRIFT_BAIT[identity.driftFaction]) {
    pools.push({
      layer: 'drift',
      factionSlug: identity.driftFaction,
      items: FACTION_DRIFT_BAIT[identity.driftFaction],
    });
  }

  // Add drawer-reactive prompts
  if (identity.drawerCount >= 3) {
    pools.push({ layer: 'drawer', items: DRAWER_PROMPTS });
  }

  // Add profile-reactive prompts
  if (identity.hasRegularFile) {
    pools.push({ layer: 'profile', items: PROFILE_PROMPTS });
  }

  // Select using cascade
  const selected = selectPersonalizedContent(pools, identity);

  // Fill template strings
  const filled: FieldPrompt = {
    ...selected,
    text: fillTemplate(selected.text, identity),
    frame: selected.frame,
  };

  // Store for today
  try {
    localStorage.setItem(TODAY_PROMPT_KEY, JSON.stringify({ date: today, prompt: filled }));
  } catch { /* storage full — fine */ }

  return filled;
}

/**
 * Complete a field prompt. Records the response and triggers drift if applicable.
 */
export function completeFieldPrompt(promptId: string, response: string, prompt?: FieldPrompt): FieldPromptCompletion {
  const completions = getCompletions();

  const completion: FieldPromptCompletion = {
    promptId,
    response,
    completedAt: new Date().toISOString(),
    category: prompt?.category ?? 'observation',
    driftBaitFaction: prompt?.driftBaitFaction,
  };

  completions.unshift(completion);
  saveCompletions(completions);

  // Covert recruitment: completing a drift-bait prompt feeds the drift pipeline
  if (prompt?.driftBaitFaction) {
    recordFactionSignal({
      factionSlug: prompt.driftBaitFaction,
      source: 'agent_mention', // closest existing source type
      weight: 1,
      metadata: { source: 'field_prompt', promptId },
    });
  }

  // Invalidate identity cache since we changed state
  invalidateIdentityCache();

  return completion;
}

/**
 * Get completion history.
 */
export function getFieldPromptHistory(): FieldPromptCompletion[] {
  return getCompletions();
}

/**
 * Get completion count.
 */
export function getFieldPromptCount(): number {
  return getCompletions().length;
}

/**
 * Check if today's prompt has been completed.
 */
export function isTodaysPromptCompleted(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  const completions = getCompletions();
  return completions.some(c => c.completedAt.slice(0, 10) === today);
}

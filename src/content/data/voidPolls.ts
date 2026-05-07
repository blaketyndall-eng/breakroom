/**
 * voidPolls.ts
 * --------------------------------------------------------------------------
 * Seed polls for the VoidPoll component on /void homepage.
 *
 * Each poll has a stable id (used as localStorage key suffix) and a list
 * of options. The component picks one poll based on day-of-week so the
 * homepage feels rotating without server state.
 */

export type VoidPoll = {
  id: string;
  prompt: string;
  options: string[];
};

export const VOID_POLLS: VoidPoll[] = [
  {
    id: 'pride-2026-05',
    prompt: 'What would you be most proud of achieving?',
    options: [
      'A motel key',
      'All my hoodies returned',
      'A complete shelf of Stuff',
      'A real reason',
      'Clocking out (and meaning it)',
    ],
  },
  {
    id: 'last-thing-eaten',
    prompt: 'Last thing you ate from the breakroom counter?',
    options: [
      'Something I shouldn\'t have',
      'A donut with no number',
      'I\'m not eating again until proven necessary',
      'It ate me first',
      'There is no counter',
    ],
  },
  {
    id: 'who-took-it',
    prompt: 'Who took your motel key?',
    options: [
      'The Driver',
      'Miss September',
      'The 7/11 clerk',
      'Nobody. It was never mine.',
      'I\'m looking at it right now',
    ],
  },
  {
    id: 'weather-pref',
    prompt: 'Best lot weather for thinking?',
    options: [
      'Hoodie weather, light fog',
      'After-rain parking lot shimmer',
      'Three-degrees-too-warm',
      'Headlights only',
      'I do not think in lots',
    ],
  },
  {
    id: 'who-let-you-in',
    prompt: 'Who let you in?',
    options: [
      'The door was open',
      'I work here. Allegedly.',
      'A swan, briefly',
      'The directory changed its mind',
      'I am not in. Stop saying I am.',
    ],
  },
  {
    id: 'second-shift',
    prompt: 'If there was a second shift, would you take it?',
    options: [
      'Already on it',
      'Only if the radio asks',
      'Pay me in receipts',
      'No. I clocked out and meant it.',
      'There is no first shift',
    ],
  },
  {
    id: 'the-clock',
    prompt: 'The clock says 1:47. What does that mean to you?',
    options: [
      'Late but not too late',
      'It\'s gospel',
      'Clock\'s broken. Move on.',
      'Time hasn\'t happened yet',
      'It\'s a place, not a time',
    ],
  },
];

/**
 * Pick today's poll based on the current date (deterministic per day).
 * Uses local time so it rotates near midnight without server coordination.
 */
export function getTodaysPoll(seed = new Date()): VoidPoll {
  const dayKey = Math.floor(seed.getTime() / (1000 * 60 * 60 * 24));
  const idx = ((dayKey % VOID_POLLS.length) + VOID_POLLS.length) % VOID_POLLS.length;
  return VOID_POLLS[idx]!;
}

export function getPollById(id: string): VoidPoll | undefined {
  return VOID_POLLS.find((p) => p.id === id);
}

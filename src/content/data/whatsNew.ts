/**
 * What's New — content lines surfaced by the post-boot Welcome dialog.
 *
 * The boot sequence on /void runs once per session, then shows a single
 * Win95 dialog with 3 lines: usually one "world tick" line + one personalized
 * line from localStorage (if signed in) + one rotating "the room noticed"
 * cue. Lines are picked at random per session so the dialog never feels
 * identical twice.
 *
 * Voice rules (per project instructions):
 *   - dry, deadpan, slightly damaged
 *   - useful but broken
 *   - no startup/SaaS language
 *   - no exclamation points unless the sentence is committing to a bit
 *   - no engagement metrics, no follower-style language
 *
 * Adding lines: keep them under ~95 chars. The dialog is narrow.
 */

export interface WhatsNewLine {
  /** The display copy. Plain text, no markup. */
  body: string;
  /** Tags for future filtering. Optional. Examples: "weather", "doors", "stuff". */
  tags?: string[];
}

/** World ticks — generic environmental observations. Always safe to surface. */
export const WORLD_TICKS: WhatsNewLine[] = [
  { body: 'The directory changed its mind. A door moved.', tags: ['doors'] },
  { body: 'The swan was driving. Correction pending.', tags: ['weather'] },
  { body: 'Pool hall lights flickered at 1:47. Routine.', tags: ['weather'] },
  { body: 'Three new pages indexed since you were out. Two have already been removed by management.', tags: ['indexing'] },
  { body: 'The phone behind the bar was off the hook. Now it is on the hook.', tags: ['phone'] },
  { body: 'Jukebox quarter relocated. It only works in machines that already know the song.', tags: ['stuff'] },
  { body: 'Coupons appeared in the drawer. Provenance disputed.', tags: ['stuff'] },
  { body: 'Lot weather: cigarette smoke, low pressure, slight grease.', tags: ['weather'] },
  { body: 'Someone signed the wall and signed it again with a different name.', tags: ['guestbook'] },
  { body: 'Radio 1:47 is broadcasting. The schedule is wrong on purpose.', tags: ['radio'] },
  { body: 'A door was filed where there was no door yesterday.', tags: ['doors'] },
  { body: 'The newsstand printed an issue dated tomorrow. We did not order this.', tags: ['newsstand'] },
  { body: 'An anonymous note was filed. It only said: please wake up.', tags: ['anon'] },
  { body: 'A man was filed under MISSING. Nobody can confirm he was ever here.', tags: ['anon'] },
  { body: 'Two regulars tried to settle something like adults. The room watched.', tags: ['weather'] },
  { body: 'Very Good Burger kitchen closed forever. Loyalty cards remain valid.', tags: ['stuff'] },
  { body: 'The coupon printer is currently afraid.', tags: ['stuff'] },
];

/** "Room noticed" cues — when a user has built any local state. */
export const ROOM_NOTICED: WhatsNewLine[] = [
  { body: 'The room noticed. The room may not say anything about it.' },
  { body: 'You have been seen around. Nobody filed a report.' },
  { body: 'Your file moved up one drawer. Drawer 7 disputes this.' },
  { body: 'Faction drift recalibrated. The math is private.' },
  { body: 'A page on the wire has your handle on it. It was not you.' },
];

/**
 * Rotating greetings. The dialog title cycles between these so it doesn't
 * always say "Welcome back". Keeps the bit fresh on repeat sessions.
 */
export const GREETINGS: string[] = [
  'VOID — Welcome back',
  'VOID — You came back',
  'VOID — The room is open',
  'VOID — Clock is stuck at 1:47',
  'VOID — Authorized re-entry',
];

/** Pick a random line from a list. Stable within a single render. */
export function pickRandom<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

/** Pick N distinct random lines from a list. Falls back gracefully if N > list length. */
export function pickRandomN<T>(list: T[], n: number): T[] {
  const out: T[] = [];
  const pool = [...list];
  while (out.length < n && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

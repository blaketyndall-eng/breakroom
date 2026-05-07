/**
 * worldMap.ts
 * --------------------------------------------------------------------------
 * Single source of truth for which world a page lives in and what chrome
 * shape it gets. Consumed by BaseLayout to set `data-world` on `<html>`
 * and to decide which top/bottom chrome components to mount.
 *
 * Two orthogonal axes:
 *
 *   World         — what universe the page lives in
 *                   omnishift  : the corporate shell (Windows 2000/XP feel)
 *                   voidsignal : the underground network (personal/2AM feel)
 *                   neutral    : utility pages that don't belong to either
 *
 *   Chrome mode   — what shape the framing takes
 *                   desktop    : full top URL bar + bottom OS taskbar
 *                   pocket     : page brings its own chrome (Pocket Mode)
 *                   suppressed : no chrome at all (transitions, 404)
 *
 * The two axes compose. Examples:
 *   /portal     → omnishift + desktop    (Win2K taskbar + IE browser bar)
 *   /void       → voidsignal + desktop   (warm taskbar + Netscape bar)
 *   /pocket     → voidsignal + pocket    (PocketSignalBar handles framing)
 *   /clock-out  → omnishift + suppressed (full immersion for VHS transition)
 *
 * See SITE-ARCHITECTURE.md for the full two-world model.
 */

export type World = 'omnishift' | 'voidsignal' | 'neutral';
export type ChromeMode = 'desktop' | 'pocket' | 'suppressed';

/**
 * Section → world mapping.
 *
 * Add a new section here whenever you introduce one in `OldWebLayout`/
 * `BaseLayout` props. If a section is not listed, `worldForSection` falls
 * back to 'neutral' (no world chrome — safe default).
 */
const SECTION_WORLD: Record<string, World> = {
  // ---------- OMNISHIFT (corporate shell, clocked in) ----------
  sleepnet:        'omnishift', // search portal (canonical homepage section)
  omnishift:       'omnishift', // employee portal
  newsstand:       'omnishift', // SleepNews — corporate media arm
  rack:            'omnishift', // The Rack — official goods
  ventures:        'omnishift', // OmniShift ventures listing
  signup:          'omnishift', // employee intake form
  'auth-callback': 'omnishift', // OAuth/SSO landing
  breakroom:       'omnishift', // the fridge-door page (lives in OmniShift,
                                 //   functions as the doorway to Void Signal)
  portal:          'omnishift', // legacy /portal/after-hours-profile route
  clockout:        'omnishift', // page initiates from the clocked-in state
                                 //   (chrome is suppressed during the transition)

  // ---------- VOID SIGNAL (underground network, clocked out) ----------
  afterhours:  'voidsignal', // legacy /after-hours route + /sign-the-wall
  locker:      'voidsignal', // Regular File / profile hub
  regulars:    'voidsignal', // public profile view
  idlehands:   'voidsignal', // pool tournament
  phone:       'voidsignal', // Phone Behind The Bar
  radio:       'voidsignal', // Radio 1:47
  stuff:       'voidsignal', // Stuff shelf
  artifacts:   'voidsignal', // evidence drawer
  factions:    'voidsignal', // turf / factions
  crews:       'voidsignal', // user-created groups
  districts:   'voidsignal', // VS geography
  events:      'voidsignal', // happenings
  houserules:  'voidsignal', // rules of the underground (was 'breakroom')
  pocket:      'voidsignal', // Pocket Mode — VS mobile (self-chrome)

  // ---------- NEUTRAL (utility pages, no world chrome) ----------
  admin:  'neutral', // Wire Room / ops console
  staff:  'neutral', // staff-only login screen
  ledger: 'neutral', // World Ledger (cross-world record)
  '404':  'neutral', // not-found
};

/**
 * Sections whose pages bring their own complete chrome — the foundation
 * desktop chrome should NOT mount on these. Pocket Mode owns its top bar
 * and overall framing via PocketSignalBar.
 */
const POCKET_SECTIONS = new Set<string>(['pocket']);

/**
 * Sections whose pages should render with NO chrome at all — full
 * immersion. Used for transition flows and error pages.
 */
const SUPPRESSED_SECTIONS = new Set<string>(['clockout', '404']);

/**
 * Map a section value to its world. Falls back to 'neutral' for unknown
 * sections, which means no world chrome will mount — safe default.
 */
export function worldForSection(section: string | undefined | null): World {
  if (!section) return 'neutral';
  return SECTION_WORLD[section] ?? 'neutral';
}

/**
 * Map a section value to its chrome mode. Falls back to 'desktop'.
 *
 * Note: this is independent of auth state. An anonymous visitor on /portal
 * still gets `desktop` chrome — the *bar component* decides whether to
 * render the cryptic anonymous variant or the full employee bar based on
 * `data-clock-state`.
 */
export function chromeFor(section: string | undefined | null): ChromeMode {
  if (!section) return 'desktop';
  if (POCKET_SECTIONS.has(section)) return 'pocket';
  if (SUPPRESSED_SECTIONS.has(section)) return 'suppressed';
  return 'desktop';
}

/**
 * Resolve a page's world, allowing an explicit override prop to win over
 * the section-based mapping. Use the override sparingly — it exists for
 * edge cases where a page's visual identity (section) and its world
 * citizenship intentionally diverge.
 *
 * Most pages: just pass `section` and let the mapping speak.
 * Edge cases: pass `world="voidsignal"` explicitly on the page's layout
 * call.
 */
export function resolveWorld(
  section: string | undefined | null,
  override?: World,
): World {
  return override ?? worldForSection(section);
}

// ---------- Iteration helpers ----------
// Useful for tests, world-coverage assertions, and future tooling.

export const ALL_SECTIONS: readonly string[] = Object.keys(SECTION_WORLD);
export const ALL_WORLDS: readonly World[] = ['omnishift', 'voidsignal', 'neutral'];
export const ALL_CHROME_MODES: readonly ChromeMode[] = ['desktop', 'pocket', 'suppressed'];

/**
 * Returns all section values that map to a given world. Handy for
 * generating world-scoped fixtures or auditing coverage.
 */
export function sectionsForWorld(world: World): string[] {
  return Object.entries(SECTION_WORLD)
    .filter(([, w]) => w === world)
    .map(([section]) => section);
}

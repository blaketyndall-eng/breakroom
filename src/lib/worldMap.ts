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
 * Also exposes inWorldUrlFor() — a section→fake-URL helper used by the
 * top browser bars to display period-correct in-world URLs.
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
  void:        'voidsignal', // Void Signal homepage — the after-hours portal
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
  sites:       'voidsignal', // canonical VS sites (/sites/[slug])
  voidshell:   'voidsignal', // /void/* utility shells (about, dmca, etc.)

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

export function worldForSection(section: string | undefined | null): World {
  if (!section) return 'neutral';
  return SECTION_WORLD[section] ?? 'neutral';
}

export function chromeFor(section: string | undefined | null): ChromeMode {
  if (!section) return 'desktop';
  if (POCKET_SECTIONS.has(section)) return 'pocket';
  if (SUPPRESSED_SECTIONS.has(section)) return 'suppressed';
  return 'desktop';
}

export function resolveWorld(
  section: string | undefined | null,
  override?: World,
): World {
  return override ?? worldForSection(section);
}

// =====================================================================
// In-world URL display
// =====================================================================

const OMNI_EXACT: Record<string, string> = {
  '/':           '/portal/index.asp',
  '/portal':     '/employees/file.htm',
  '/sleepnet':   '/search.asp',
  '/sleepnet/create': '/search.asp?action=submit',
  '/newsstand':  '/news/today.cfm',
  '/rack':       '/products/catalog.asp',
  '/ventures':   '/companies/portfolio.asp',
  '/breakroom':  '/employees/breakroom.htm',
  '/clock-out':  '/timeclock/out.asp',
  '/signup':     '/intake/new-employee.asp',
  '/back-office': '/admin/sites.asp',
  '/dead-link-cemetery': '/archive/dead-links.htm',
};

const OMNI_PREFIX: Array<[string, string]> = [
  ['/sleepnet/',  '/search.asp?id='],
  ['/newsstand/', '/news/article.cfm?id='],
  ['/rack/',      '/products/catalog.asp?sku='],
];

const VS_EXACT: Record<string, string> = {
  '/':              'lot/west',
  '/void':          'lot/west',
  '/void/games':    'arcade/sticky',
  '/void/about':    'about/this',
  '/void/flag':     'flag/page',
  '/void/webrings': 'webrings/index',
  '/void/dmca':     'dmca/lol',
  '/void/missing':  'directory/changed-its-mind',
  '/void/search':   'search/results',
  '/clock-in':      'doorway/in',
  '/locker':        'regulars/me/file',
  '/idle-hands':    'pool-hall/intake',
  '/phone':         'bar/phone',
  '/radio':         'radio/1.47fm',
  '/sign-the-wall': 'wall',
  '/stuff':         'drawer/stuff',
  '/artifacts':     'drawer/evidence',
  '/factions':      'turf/map',
  '/crews':         'crews/directory',
  '/districts':     'districts/map',
  '/events':        'wall/events',
  '/house-rules':   'pool-hall/rules',
};

const VS_PREFIX: Array<[string, string]> = [
  ['/regulars/',    'regulars/'],
  ['/idle-hands/player/', 'pool-hall/players/'],
  ['/stuff/',       'stuff/'],
  ['/factions/',    'turf/'],
  ['/crews/',       'crews/'],
  ['/districts/',   'districts/'],
  ['/events/',      'wall/events/'],
  ['/sites/',       'sites/'],
  ['/void/',        'void/'],
];

export function inWorldUrlFor(
  world: World,
  pathname: string,
): string {
  if (world === 'omnishift') {
    const fake = remapOmniPath(pathname);
    return `omnishift.intranet:1147${fake}`;
  }
  if (world === 'voidsignal') {
    const fake = remapVsPath(pathname);
    return `voidsignal://${fake}`;
  }
  return pathname;
}

function remapOmniPath(pathname: string): string {
  if (OMNI_EXACT[pathname]) return OMNI_EXACT[pathname];
  for (const [prefix, replacement] of OMNI_PREFIX) {
    if (pathname.startsWith(prefix)) {
      const slug = pathname.slice(prefix.length);
      return replacement + encodeURIComponent(slug);
    }
  }
  if (pathname === '/' || !pathname) return '/index.asp';
  return `${pathname.replace(/\/$/, '')}.asp`;
}

function remapVsPath(pathname: string): string {
  if (VS_EXACT[pathname]) return VS_EXACT[pathname];
  for (const [prefix, replacement] of VS_PREFIX) {
    if (pathname.startsWith(prefix)) {
      const slug = pathname.slice(prefix.length);
      return replacement + slug;
    }
  }
  return pathname.replace(/^\//, '') || 'lot/west';
}

export const ALL_SECTIONS: readonly string[] = Object.keys(SECTION_WORLD);
export const ALL_WORLDS: readonly World[] = ['omnishift', 'voidsignal', 'neutral'];
export const ALL_CHROME_MODES: readonly ChromeMode[] = ['desktop', 'pocket', 'suppressed'];

export function sectionsForWorld(world: World): string[] {
  return Object.entries(SECTION_WORLD)
    .filter(([, w]) => w === world)
    .map(([section]) => section);
}

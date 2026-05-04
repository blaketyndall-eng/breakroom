import { slugify } from './slug';

const routeMap: Record<string, string> = {
  'newsstand.html': '/newsstand',
  'lost.html': '/lost-found',
  'rack.html': '/rack',
  'portal.html': '/portal',
  'staff.html': '/staff-only',
  'idlehands.html': '/idle-hands',
  'the-rack': '/rack',
};

export function toBreakroomRoute(rawUrl = '/', title = '') {
  const url = rawUrl.trim();

  if (!url || url === '#') return '/';
  if (url.startsWith('/')) return url;

  const [path, hash] = url.split('#');
  const base = routeMap[path] ?? inferRoute(path);

  if (!hash) return base;

  if (base === '/rack' && title) return `/rack/${slugify(title.replace(/—.*$/, '').trim())}`;
  if (base === '/lost-found' && title) return `/lost-found/${slugify(title.replace(/—.*$/, '').trim())}`;
  if (base === '/newsstand' && title) return `/newsstand/${slugify(title.replace(/—.*$/, '').trim())}`;

  return `${base}#${hash}`;
}

function inferRoute(path: string) {
  if (path.includes('newsstand')) return '/newsstand';
  if (path.includes('lost')) return '/lost-found';
  if (path.includes('rack')) return '/rack';
  if (path.includes('portal')) return '/portal';
  if (path.includes('staff')) return '/staff-only';
  if (path.includes('idle')) return '/idle-hands';
  return '/';
}

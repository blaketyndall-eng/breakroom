import { getStuffItemBySlug, STUFF_ITEMS, STUFF_STATUS_LABELS } from '@/content/data/stuff';
import type { StuffItem, StuffItemStatus } from '@/content/data/stuff';
import type { SleepNetStuffShelfComponent } from '@/lib/sleepnetComponents';

export function labelStuffStatus(status: StuffItemStatus) {
  return STUFF_STATUS_LABELS[status] ?? status.replaceAll('_', ' ');
}

export function getAllStuffItems() {
  return STUFF_ITEMS;
}

export function getStuffItemsBySleepNetSlug(slug: string) {
  return STUFF_ITEMS.filter((item) => item.relatedSleepNetSlug === slug);
}

export function getStuffItemsByStatus(status: StuffItemStatus) {
  return STUFF_ITEMS.filter((item) => item.status === status);
}

export function makeStuffUrl(slug: string) {
  return `/stuff/${slug}`;
}

export function stuffItemToShelfItem(item: StuffItem): SleepNetStuffShelfComponent['items'][number] {
  return {
    slug: item.slug,
    name: item.name,
    status: item.status,
    note: item.note,
    priceLabel: item.priceLabel,
    href: makeStuffUrl(item.slug),
  };
}

export function createStuffShelfFromRegistry(title: string, itemSlugs: string[]): SleepNetStuffShelfComponent {
  const items = itemSlugs
    .map((slug) => getStuffItemBySlug(slug))
    .filter(Boolean)
    .map((item) => stuffItemToShelfItem(item as StuffItem));

  return {
    id: `stuff-shelf-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`,
    type: 'stuff_shelf',
    title,
    items,
  };
}

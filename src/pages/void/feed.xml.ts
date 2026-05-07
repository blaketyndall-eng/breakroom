/**
 * /void/feed.xml — RSS-ish feed of recently indexed Void Signal sites.
 *
 * Endpoint exposed to feed readers and to the homepage "RSS?" footer link.
 * Static-feeling content from voidSites registry; refreshes whenever
 * the registry is edited.
 */
import type { APIRoute } from 'astro';
import { VOID_SITES } from '@/content/data/voidSites';

export const prerender = false;

const SITE_URL = 'https://thebreakroom.pages.dev';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = () => {
  const items = [...VOID_SITES]
    .sort((a, b) => (a.meta.indexedAt < b.meta.indexedAt ? 1 : -1))
    .map((s) => {
      const link = `${SITE_URL}/sites/${s.slug}`;
      const pubDate = new Date(s.meta.indexedAt).toUTCString();
      return `    <item>
      <title>${escapeXml(s.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(s.tagline)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>VOID — recently indexed</title>
    <link>${SITE_URL}/void</link>
    <description>Pages OmniShift would prefer you not visit. Refreshed when the directory changes its mind.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};

/**
 * MoreLikeThis — PR 67 (Search V2)
 *
 * Dynamic "More Like This, Unfortunately" sidebar widget.
 * Pulls suggestions from recent ledger activity, crews,
 * and static fallback links. Replaces the hardcoded list
 * in sleepnet/index.astro.
 */

import { useState, useEffect } from 'react';
import { getPublicLedger } from '@/lib/worldLedger';
import type { LedgerEntry } from '@/lib/worldLedger';
import { getPublicCrews } from '@/lib/crews';
import type { Crew } from '@/lib/crews';
import { getSearchHistory } from '@/lib/sleepnetSearch';

type Suggestion = {
  id: string;
  label: string;
  href: string;
  note: string;
  source: 'ledger' | 'crew' | 'static' | 'history';
};

// Static fallbacks — always available, shuffled in
const STATIC_SUGGESTIONS: Suggestion[] = [
  { id: 'static-create', label: 'Create A Page', href: '/sleepnet/create', note: 'make something that should not have a website', source: 'static' },
  { id: 'static-lost', label: 'Lost & Found', href: '/lost-found', note: 'object archive, evidence locker', source: 'static' },
  { id: 'static-news', label: 'SleepNews', href: '/newsstand', note: 'headlines filed after hours', source: 'static' },
  { id: 'static-idle', label: 'Idle Hands Invitational', href: '/idle-hands', note: 'tournament of unclear status', source: 'static' },
  { id: 'static-ventures', label: 'OmniShift Ventures', href: '/ventures', note: 'AI investments nobody asked for', source: 'static' },
  { id: 'static-radio', label: 'Radio 1:47', href: '/radio', note: 'broadcast layer, mostly static', source: 'static' },
  { id: 'static-ledger', label: 'World Ledger', href: '/world-ledger', note: 'the room keeps a record', source: 'static' },
  { id: 'static-crews', label: 'Crews', href: '/crews', note: 'unofficial organizations, not turf', source: 'static' },
  { id: 'static-factions', label: 'Official Turf', href: '/factions', note: 'the five that management acknowledges', source: 'static' },
];

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const shuffled = [...arr];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = ((s * 1103515245 + 12345) & 0x7fffffff);
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function MoreLikeThis() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    const items: Suggestion[] = [];
    const seen = new Set<string>();

    // Pull from recent ledger activity
    try {
      const ledger = getPublicLedger(10);
      for (const entry of ledger.slice(0, 3)) {
        if (entry.targetSlug && entry.targetType) {
          const href = getLedgerTargetHref(entry);
          if (href && !seen.has(href)) {
            seen.add(href);
            items.push({
              id: `ledger-${entry.id}`,
              label: entry.headline,
              href,
              note: entry.redactedLine || 'the ledger noticed',
              source: 'ledger',
            });
          }
        }
      }
    } catch {}

    // Pull from active crews
    try {
      const crews = getPublicCrews().slice(0, 3);
      for (const crew of crews) {
        const href = `/crews/${crew.slug}`;
        if (!seen.has(href)) {
          seen.add(href);
          items.push({
            id: `crew-${crew.slug}`,
            label: crew.name,
            href,
            note: crew.tagline,
            source: 'crew',
          });
        }
      }
    } catch {}

    // Pull from search history
    try {
      const history = getSearchHistory().slice(0, 2);
      for (const h of history) {
        const href = `/sleepnet?q=${encodeURIComponent(h.query)}`;
        if (!seen.has(href)) {
          seen.add(href);
          items.push({
            id: `hist-${h.query}`,
            label: `"${h.query}"`,
            href: '#',
            note: `searched recently — ${h.resultCount} result${h.resultCount !== 1 ? 's' : ''}`,
            source: 'history',
          });
        }
      }
    } catch {}

    // Fill remaining with shuffled static suggestions
    const daySeed = Math.floor(Date.now() / 86400000);
    const shuffledStatic = seededShuffle(STATIC_SUGGESTIONS, daySeed);
    for (const s of shuffledStatic) {
      if (!seen.has(s.href) && items.length < 8) {
        seen.add(s.href);
        items.push(s);
      }
    }

    setSuggestions(items.slice(0, 8));
  }, []);

  return (
    <section className="old-shell portal-links-widget">
      <div className="old-header">More Like This, Unfortunately</div>
      <div className="old-body">
        <ul className="mlt-list">
          {suggestions.map((s) => (
            <li key={s.id} className={`mlt-item mlt-source-${s.source}`}>
              {s.href !== '#' ? (
                <a href={s.href} className="mlt-link">{s.label}</a>
              ) : (
                <span className="mlt-link mlt-no-href">{s.label}</span>
              )}
              <span className="mlt-note"> — {s.note}</span>
            </li>
          ))}
        </ul>
        {suggestions.length === 0 && (
          <p className="mlt-empty">The directory has no suggestions. It does not apologize.</p>
        )}
      </div>
    </section>
  );
}

// Resolve a ledger entry to a navigable URL
function getLedgerTargetHref(entry: LedgerEntry): string | null {
  switch (entry.targetType) {
    case 'page': return entry.targetSlug ? `/sleepnet/sites/${entry.targetSlug}` : null;
    case 'stuff': return entry.targetSlug ? `/stuff/${entry.targetSlug}` : null;
    case 'faction': return entry.targetSlug ? `/factions/${entry.targetSlug}` : null;
    case 'crew': return entry.targetSlug ? `/crews/${entry.targetSlug}` : null;
    case 'event': return entry.targetSlug ? `/events/${entry.targetSlug}` : null;
    case 'door': return '/hidden-doors';
    default: return null;
  }
}

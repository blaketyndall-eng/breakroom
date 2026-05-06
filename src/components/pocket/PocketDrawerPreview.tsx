import { useState, useEffect } from 'react';
import { getSavedStuffItems, getSavedStuffCount } from '@/lib/savedStuff';
import type { SavedStuffItem } from '@/lib/savedStuff';
import { getPocketIdentity, getIdentityTier } from '@/lib/pocketPersonalization';

/**
 * PocketDrawerPreview — compact view of saved stuff.
 * Shows last 3 items with status. Links to full locker/drawer.
 * Research: inventory screens, Neko Atsume yard summary, Animal Crossing pocket.
 * Personalized: empty state and header change based on identity.
 */

const DRAWER_EMPTY_STATES: Record<string, string> = {
  veteran: 'Drawer cleared. The room remembers what was here.',
  regular: 'Nothing filed yet. The drawer is patient.',
  drifter: 'Nothing filed yet. Find Stuff. Save it. See what happens.',
  newcomer: 'Nothing filed yet. Find Stuff. Save it. Pretend that means something.',
};

export default function PocketDrawerPreview() {
  const [items, setItems] = useState<SavedStuffItem[]>([]);
  const [total, setTotal] = useState(0);
  const [emptyMessage, setEmptyMessage] = useState(DRAWER_EMPTY_STATES.newcomer);

  useEffect(() => {
    const saved = getSavedStuffItems();
    setItems(saved.slice(0, 3));
    setTotal(getSavedStuffCount());
    const tier = getIdentityTier();
    setEmptyMessage(DRAWER_EMPTY_STATES[tier] || DRAWER_EMPTY_STATES.newcomer);
  }, []);

  return (
    <div className="pocket-drawer">
      <div className="pocket-section-header">
        Drawer{total > 0 ? ` — ${total} item${total !== 1 ? 's' : ''} filed` : ''}
      </div>
      {items.length === 0 ? (
        <div className="pocket-drawer-empty">
          {emptyMessage}
        </div>
      ) : (
        <>
          {items.map(item => (
            <div key={item.stuffSlug} className="pocket-drawer-item">
              <span className="pocket-drawer-name">{item.name}</span>
              <span className="pocket-drawer-status">{item.status}</span>
            </div>
          ))}
          {total > 3 && (
            <a
              href="/pocket/drawer"
              style={{
                display: 'block',
                fontFamily: 'var(--pocket-mono)',
                fontSize: '10px',
                color: 'var(--pocket-dim)',
                textTransform: 'uppercase',
                marginTop: '8px',
                textDecoration: 'none',
              }}
            >
              + {total - 3} more in drawer →
            </a>
          )}
        </>
      )}
    </div>
  );
}

/**
 * DoorHintBanner — PR 73 (The Motel Key Loop)
 *
 * Renders a soft hint when the user has saved Stuff that resonates
 * with an unopened hidden door. Reads `getHintedDoors()` against
 * `getSavedStuffItems()` on mount and on saved-stuff updates.
 *
 * Voice rule: never reveal what to search for. The hint is "you have
 * something" — the user has to make the rest happen. Doors are mystery,
 * not achievement progress bars.
 *
 * Mounted on /sleepnet so the hint appears in the right surface — the
 * search engine is where most door triggers live. Stays empty when the
 * user has nothing saved.
 */
import { useEffect, useState } from 'react';
import { getHintedDoors, type HiddenDoor } from '@/lib/hiddenDoors';
import { getSavedStuffItems, SAVED_STUFF_EVENT } from '@/lib/savedStuff';

export default function DoorHintBanner() {
  const [hinted, setHinted] = useState<HiddenDoor[]>([]);

  useEffect(() => {
    function refresh() {
      const slugs = getSavedStuffItems().map((s) => s.stuffSlug);
      setHinted(getHintedDoors(slugs));
    }
    refresh();

    // Re-check whenever the drawer changes — saving Motel Key while on
    // /sleepnet should make the banner appear without a reload.
    const handler = () => refresh();
    window.addEventListener(SAVED_STUFF_EVENT, handler);
    return () => window.removeEventListener(SAVED_STUFF_EVENT, handler);
  }, []);

  if (hinted.length === 0) return null;

  return (
    <aside
      className="sn-door-hint"
      style={{
        margin: '12px 0',
        padding: '10px 14px',
        border: '1px dashed #b08d57',
        background: '#fdf6e3',
        color: '#3a2f1d',
        fontFamily: "'Special Elite', monospace",
        fontSize: 12,
        lineHeight: 1.5,
      }}
    >
      <p style={{ margin: 0, fontStyle: 'italic' }}>
        Something in your drawer is asking a question.
      </p>
      <p style={{ margin: '4px 0 0', fontSize: 11, color: '#7a5a2e' }}>
        {hinted.length === 1
          ? 'One door noticed.'
          : `${hinted.length} doors noticed.`} The directory does not say which.
      </p>
    </aside>
  );
}

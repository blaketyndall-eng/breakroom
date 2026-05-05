import { useEffect, useState } from 'react';
import { getSavedStuffItems, SAVED_STUFF_EVENT } from '@/lib/savedStuff';
import type { SavedStuffItem } from '@/lib/savedStuff';

export default function SavedStuffDrawerPreview() {
  const [items, setItems] = useState<SavedStuffItem[]>([]);

  useEffect(() => {
    function refresh() {
      setItems(getSavedStuffItems());
    }

    refresh();
    window.addEventListener(SAVED_STUFF_EVENT, refresh as EventListener);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(SAVED_STUFF_EVENT, refresh as EventListener);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const recent = items.slice(0, 5);

  return (
    <section className="old-shell saved-stuff-preview">
      <div className="old-header">Drawer / Saved Stuff</div>
      <div className="old-body">
        <p className="memo-box">{items.length ? `${items.length} items filed. The room remembered.` : 'No Stuff filed yet. The drawer is open and pretending not to wait.'}</p>
        {recent.length > 0 && (
          <div className="saved-stuff-list">
            {recent.map((item) => (
              <a key={item.stuffSlug} className="saved-stuff-row" href={`/stuff/${item.stuffSlug}`}>
                <span>{item.name}</span>
                <small>{item.sku} / {String(item.status).replaceAll('_', ' ')}</small>
              </a>
            ))}
          </div>
        )}
        <p className="sleepnet-url">drawer://local-only-for-now</p>
      </div>
    </section>
  );
}

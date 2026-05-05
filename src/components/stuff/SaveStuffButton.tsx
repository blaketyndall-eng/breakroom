import { useEffect, useMemo, useState } from 'react';
import type { StuffItemStatus } from '@/content/data/stuff';
import { isStuffSaved, removeSavedStuffItem, saveStuffItem } from '@/lib/savedStuff';
import type { SavedStuffItem, SaveableStuffItem } from '@/lib/savedStuff';
import { recordFactionSignal } from '@/lib/factionDrift';

type SaveStuffButtonProps = {
  item: SaveableStuffItem & { status: StuffItemStatus | string };
  sourceSiteSlug?: string;
  relatedFactionSlug?: string;
  buttonLabel?: string;
  compact?: boolean;
};

export default function SaveStuffButton({ item, sourceSiteSlug, relatedFactionSlug, buttonLabel = 'Save To Drawer', compact = false }: SaveStuffButtonProps) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [receipt, setReceipt] = useState<SavedStuffItem | null>(null);
  const [error, setError] = useState('');

  const normalizedItem = useMemo(() => ({
    ...item,
    slug: item.slug,
    status: item.status,
  }), [item]);

  useEffect(() => {
    setSaved(isStuffSaved(normalizedItem.slug));
  }, [normalizedItem.slug]);

  function handleSave() {
    setSaving(true);
    setError('');
    try {
      const next = saveStuffItem(normalizedItem, {
        sourceSiteSlug,
        relatedFactionSlug,
        metadata: { source: sourceSiteSlug ? 'sleepnet_shelf' : 'stuff_file' },
      });
      if (relatedFactionSlug) {
        recordFactionSignal({
          factionSlug: relatedFactionSlug,
          source: 'save_faction_stuff',
          weight: 3,
          metadata: { stuffSlug: normalizedItem.slug, sourceSiteSlug },
        });
      }
      setSaved(true);
      setReceipt(next);
    } catch {
      setError('Drawer Could Not Open');
    } finally {
      setSaving(false);
    }
  }

  function handleRemove() {
    removeSavedStuffItem(normalizedItem.slug);
    setSaved(false);
    setReceipt(null);
  }

  return (
    <div className={compact ? 'save-stuff-widget compact' : 'save-stuff-widget'}>
      <button type="button" className="old-button" disabled={saving || saved} onClick={handleSave}>
        {saving ? 'Filing...' : saved ? 'Already In Drawer' : buttonLabel}
      </button>
      {saved && <button type="button" className="old-button danger" onClick={handleRemove}>Remove From Drawer</button>}
      {receipt && (
        <div className="stuff-receipt">
          <p><span className="red-stamp">RECEIPT GENERATED</span></p>
          <p>Item: {receipt.name}</p>
          <p>SKU: {receipt.sku}</p>
          <p>Status: {String(receipt.status).replaceAll('_', ' ')}</p>
          <p>Filed: Drawer</p>
          <small>{relatedFactionSlug ? 'The turf saw you file it.' : 'The counter saw you.'}</small>
        </div>
      )}
      {error && <p className="stuff-save-error">{error}</p>}
    </div>
  );
}

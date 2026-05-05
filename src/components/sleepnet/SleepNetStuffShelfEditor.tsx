import { useMemo, useState } from 'react';
import { STUFF_ITEMS } from '@/content/data/stuff';
import type { SleepNetComponent, SleepNetStuffShelfComponent, SleepNetStuffShelfStatus } from '@/lib/sleepnetComponents';
import type { SleepNetSite } from '@/lib/sleepnetSites';

const EDITABLE_STUFF_STATUSES: SleepNetStuffShelfStatus[] = [
  'fake',
  'coming_soon',
  'removed_by_management',
  'found',
  'official_later',
  'not_for_you_yet',
  'printable',
  'under_review',
  'ask_at_counter',
  'discontinued_before_release',
];

type ShelfItem = SleepNetStuffShelfComponent['items'][number];

type Props = {
  site: SleepNetSite;
  onChange: (site: SleepNetSite) => void;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

function getStuffShelf(site: SleepNetSite): SleepNetStuffShelfComponent | null {
  return (site.components ?? []).find((component): component is SleepNetStuffShelfComponent => component.type === 'stuff_shelf') ?? null;
}

function withStuffShelf(site: SleepNetSite, shelf: SleepNetStuffShelfComponent | null): SleepNetSite {
  const components = site.components ?? [];
  const filtered = components.filter((component) => component.type !== 'stuff_shelf');
  return {
    ...site,
    stuff_shelf_enabled: Boolean(shelf),
    components: shelf ? [shelf, ...filtered] : filtered,
  };
}

function makeDefaultShelf(site: SleepNetSite): SleepNetStuffShelfComponent {
  return {
    id: 'shelf-001',
    type: 'stuff_shelf',
    title: `${site.title || 'Page'} Stuff Shelf`,
    items: suggestStuffForSite(site).slice(0, 3),
  };
}

function registryToShelfItem(slug: string): ShelfItem | null {
  const item = STUFF_ITEMS.find((entry) => entry.slug === slug);
  if (!item) return null;
  return {
    slug: item.slug,
    source: 'registry',
    name: item.name,
    status: item.status,
    note: item.note,
    priceLabel: item.priceLabel,
    href: `/stuff/${item.slug}`,
    relatedObjectSlug: item.relatedObjectSlug,
    officialStatus: 'registry_item',
  };
}

function suggestStuffForSite(site: SleepNetSite): ShelfItem[] {
  const text = `${site.title} ${site.site_type} ${site.neighborhood} ${(site.faction_affinity ?? []).join(' ')} ${(site.related_object_slugs ?? []).join(' ')}`.toLowerCase();
  const preferred = STUFF_ITEMS.filter((item) => {
    if (site.related_object_slugs?.includes(item.relatedObjectSlug ?? '')) return true;
    if (site.site_type === 'fake_restaurant' && item.tags.some((tag) => ['burger', 'sauce', 'napkin'].includes(tag))) return true;
    if (site.site_type === 'object_archive' && ['artifact', 'object'].includes(item.kind)) return true;
    if (site.site_type === 'faction_turf' && item.tags.some((tag) => text.includes(tag))) return true;
    if (site.site_type === 'personal_homepage' && ['dial-tone-slip', 'wrong-employee-badge', 'jukebox-quarter'].includes(item.slug)) return true;
    return false;
  });

  const fallback = preferred.length ? preferred : STUFF_ITEMS.slice(0, 4);
  return fallback.map((item) => registryToShelfItem(item.slug)).filter(Boolean) as ShelfItem[];
}

function customItemFromInput(input: { name: string; status: SleepNetStuffShelfStatus; note: string; priceLabel: string; imageState: string; buttonLabel: string; relatedObjectSlug: string; relatedFactionSlug: string }): ShelfItem {
  return {
    slug: `custom-${slugify(input.name || 'unfiled-stuff')}-${Date.now().toString(36)}`,
    source: 'custom',
    name: input.name.trim() || 'Unnamed Counter Object',
    status: input.status,
    note: input.note.trim() || 'Added by page owner. The shelf accepted it without asking follow-up questions.',
    priceLabel: input.priceLabel.trim() || undefined,
    imageState: input.imageState.trim() || 'PHOTO REMOVED',
    buttonLabel: input.buttonLabel.trim() || 'File This',
    relatedObjectSlug: input.relatedObjectSlug.trim() || undefined,
    relatedFactionSlug: input.relatedFactionSlug.trim() || undefined,
    officialStatus: 'fake_listing',
  };
}

export default function SleepNetStuffShelfEditor({ site, onChange }: Props) {
  const shelf = getStuffShelf(site);
  const [registrySlug, setRegistrySlug] = useState(STUFF_ITEMS[0]?.slug ?? '');
  const [customName, setCustomName] = useState('');
  const [customStatus, setCustomStatus] = useState<SleepNetStuffShelfStatus>('not_for_you_yet');
  const [customNote, setCustomNote] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customImageState, setCustomImageState] = useState('PHOTO REMOVED');
  const [customButtonLabel, setCustomButtonLabel] = useState('File This');
  const [customObject, setCustomObject] = useState('');
  const [customFaction, setCustomFaction] = useState(site.faction_affinity?.[0] ?? '');

  const currentItems = shelf?.items ?? [];
  const registryOptions = useMemo(() => STUFF_ITEMS.filter((item) => !currentItems.some((shelfItem) => shelfItem.slug === item.slug)), [currentItems]);

  function updateShelf(nextShelf: SleepNetStuffShelfComponent | null) {
    onChange(withStuffShelf(site, nextShelf));
  }

  function toggleShelf() {
    updateShelf(shelf ? null : makeDefaultShelf(site));
  }

  function updateTitle(title: string) {
    if (!shelf) return;
    updateShelf({ ...shelf, title });
  }

  function addRegistryItem() {
    if (!shelf) return;
    const item = registryToShelfItem(registrySlug);
    if (!item || shelf.items.some((entry) => entry.slug === item.slug)) return;
    updateShelf({ ...shelf, items: [...shelf.items, item] });
  }

  function addCustomItem() {
    if (!shelf) return;
    const item = customItemFromInput({
      name: customName,
      status: customStatus,
      note: customNote,
      priceLabel: customPrice,
      imageState: customImageState,
      buttonLabel: customButtonLabel,
      relatedObjectSlug: customObject,
      relatedFactionSlug: customFaction,
    });
    updateShelf({ ...shelf, items: [...shelf.items, item] });
    setCustomName('');
    setCustomNote('');
    setCustomPrice('');
  }

  function removeItem(slugOrName: string) {
    if (!shelf) return;
    updateShelf({ ...shelf, items: shelf.items.filter((item) => (item.slug ?? item.name) !== slugOrName) });
  }

  function regenerateSuggestions() {
    updateShelf({
      id: shelf?.id ?? 'shelf-001',
      type: 'stuff_shelf',
      title: shelf?.title ?? `${site.title || 'Page'} Stuff Shelf`,
      items: suggestStuffForSite(site).slice(0, 5),
    });
  }

  const componentTypes = (site.components ?? []).map((component: SleepNetComponent) => component.type);

  return (
    <section className="sleepnet-stuff-editor">
      <div className="regular-public-strip">
        <span>Stuff Shelf / {shelf ? `${currentItems.length} item(s)` : 'off'}</span>
        <button type="button" className="old-button" onClick={toggleShelf}>{shelf ? 'Remove Stuff Shelf' : 'Include Stuff Shelf'}</button>
      </div>
      <p className="sleepnet-url">component stack: {componentTypes.join(' / ') || 'empty'}</p>
      {shelf && (
        <div className="sleepnet-stuff-editor-body">
          <label>Shelf title
            <input value={shelf.title} onChange={(event) => updateTitle(event.target.value)} />
          </label>

          <div className="sleepnet-stuff-editor-grid">
            <div className="old-shell mini-editor-shell">
              <div className="old-header">Add Registry Stuff</div>
              <div className="old-body">
                <select value={registrySlug} onChange={(event) => setRegistrySlug(event.target.value)}>
                  {registryOptions.map((item) => <option key={item.slug} value={item.slug}>{item.name} / {item.status.replaceAll('_', ' ')}</option>)}
                </select>
                <p><button type="button" className="old-button" onClick={addRegistryItem} disabled={!registryOptions.length}>Add Registry Stuff</button></p>
                <p><button type="button" className="old-button" onClick={regenerateSuggestions}>Regenerate Stuff Suggestions</button></p>
              </div>
            </div>

            <div className="old-shell mini-editor-shell">
              <div className="old-header">Create Custom Fake Stuff</div>
              <div className="old-body custom-stuff-form">
                <input placeholder="Name" value={customName} onChange={(event) => setCustomName(event.target.value)} />
                <select value={customStatus} onChange={(event) => setCustomStatus(event.target.value as SleepNetStuffShelfStatus)}>
                  {EDITABLE_STUFF_STATUSES.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}
                </select>
                <textarea placeholder="Note" value={customNote} onChange={(event) => setCustomNote(event.target.value)} />
                <input placeholder="Price label / optional" value={customPrice} onChange={(event) => setCustomPrice(event.target.value)} />
                <input placeholder="Image state" value={customImageState} onChange={(event) => setCustomImageState(event.target.value)} />
                <input placeholder="Button label" value={customButtonLabel} onChange={(event) => setCustomButtonLabel(event.target.value)} />
                <input placeholder="Related object slug / optional" value={customObject} onChange={(event) => setCustomObject(event.target.value)} />
                <input placeholder="Related faction slug / optional" value={customFaction} onChange={(event) => setCustomFaction(event.target.value)} />
                <button type="button" className="old-button" onClick={addCustomItem}>Add Custom Stuff</button>
              </div>
            </div>
          </div>

          <div className="sleepnet-shelf-current-list">
            {currentItems.map((item) => (
              <div className="component-preview-chip shelf-item-chip" key={item.slug ?? item.name}>
                <span>{item.name}</span>
                <small>{item.source ?? 'legacy'} / {item.status.replaceAll('_', ' ')}</small>
                <button type="button" onClick={() => removeItem(item.slug ?? item.name)}>remove</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

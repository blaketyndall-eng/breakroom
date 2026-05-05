import { BREAKROOM_DATA } from '@/content/data/breakroom';
import { supabase } from '@/lib/supabaseClient';
import { slugify } from '@/lib/slug';

export type PhoneMessageView = {
  slug: string;
  from: string;
  time: string;
  body: string;
  messageType: string;
  unlockLevel: number;
};

export type NewsItemView = {
  slug: string;
  title: string;
  body: string;
  category: string;
  byline: string;
  publishedAt?: string;
  isTrue?: boolean | null;
};

export type LostObjectView = {
  slug: string;
  name: string;
  itemNumber: string;
  objectType: string;
  description: string;
  meaning: string;
  status: string;
  found: string;
  condition: string;
  relatedUniform?: string;
  relatedClipping?: string;
};

export type RadioLogView = {
  title: string;
  body: string;
  airedAt: string;
};

export type ProductView = {
  slug: string;
  sku: string;
  name: string;
  note: string;
  href: string;
  status: string;
  department: string;
  object: string;
  priceCents?: number | null;
  category?: string | null;
  description?: string | null;
  priceLabel?: string;
  relatedClipping?: string;
};

export type VentureView = {
  slug: string;
  name: string;
  category: string;
  status: string;
  description: string;
  memo: string;
};

export type PublicContentSource = 'supabase' | 'static';

export type PublicContentResult<T> = {
  source: PublicContentSource;
  items: T[];
  error?: string;
};

export type PublicContentSingleResult<T> = {
  source: PublicContentSource;
  item: T | null;
  error?: string;
};

function staticPhoneMessages(): PhoneMessageView[] {
  return BREAKROOM_DATA.voicemails.map((message, index) => ({
    slug: `static-phone-${index + 1}`,
    from: message.from,
    time: message.time,
    body: message.body,
    messageType: 'voicemail',
    unlockLevel: 0,
  }));
}

function staticNewsItems(): NewsItemView[] {
  return Object.entries(BREAKROOM_DATA.headlines).flatMap(([category, items]) =>
    items.map((item: any) => {
      const title = item.t ?? item.head ?? 'Untitled Notice';
      const body = item.k ?? item.b ?? item.body ?? 'No further information was provided.';
      return {
        slug: slugify(title),
        title,
        body,
        category,
        byline: item.byline ?? 'STAFF / 1:47 A.M.',
        isTrue: null,
      };
    }),
  );
}

function staticLostObjects(): LostObjectView[] {
  return BREAKROOM_DATA.objects.map((object) => ({
    slug: slugify(object.name),
    name: object.name,
    itemNumber: object.id,
    objectType: 'physical',
    description: `${object.found} Condition: ${object.cond}`,
    meaning: object.meaning,
    status: object.status,
    found: object.found,
    condition: object.cond,
    relatedUniform: object.uniform,
    relatedClipping: object.clip,
  }));
}

function staticRadioLogs(): RadioLogView[] {
  return [
    {
      title: 'Channel 1:47 Station ID',
      body: 'Broadcasting from somewhere behind the bar. If you hear yourself, lower the volume and apologize to nobody.',
      airedAt: '1:47 AM',
    },
    {
      title: 'Lot Weather',
      body: 'Sodium-vapor glow, cold pavement, and a chance of someone idling too long near the vacancy sign.',
      airedAt: '2:13 AM',
    },
    {
      title: 'Back Booth Mix',
      body: 'Coffee, cue chalk, and a song the jukebox denies owning.',
      airedAt: '4:11 AM',
    },
  ];
}

function staticProducts(): ProductView[] {
  return BREAKROOM_DATA.products.map((product, index) => ({
    slug: slugify(product.name),
    sku: product.sku,
    name: product.name,
    note: product.reason,
    href: `/rack/${slugify(product.name)}`,
    status: index > 3 ? 'REMOVED' : 'ISSUED GOODS',
    department: product.dept,
    object: product.obj,
    description: product.reason,
    priceLabel: product.price,
    relatedClipping: product.clip,
  }));
}

function staticVentures(): VentureView[] {
  return [
    ['Still Open Burger', 'Lifestyle & Hospitality', 'Active', 'AI noticed humans eat late and got carried away.'],
    ['Motel 8.5', 'Essential Services', 'Under review', 'A lodging concept between a motel and a clerical error.'],
    ['Hot Air Balloon Insurance', 'Experimental', 'Approved somehow', 'The dashboard showed strong upward mobility.'],
    ['BYOB Petting Zoo', 'Experimental', 'Paused', 'Too many assumptions about goats.'],
    ['Receipt Intelligence Labs', 'Essential Services', 'Active', 'No total is still data.'],
    ['Coffee Freshness Compliance', 'Operations', 'Disputed', 'The coffee is not fresh. It is active.'],
    ['Swan Passenger Safety', 'Lifestyle & Hospitality', 'Active', 'Passenger status unresolved. Seatbelt guidance pending.'],
  ].map(([name, category, status, description]) => ({
    slug: slugify(name),
    name,
    category,
    status,
    description,
    memo: description,
  }));
}

function formatPrice(priceCents?: number | null) {
  if (priceCents == null) return 'file request only';
  return `$${(priceCents / 100).toFixed(2)}`;
}

function mapNewsItem(item: any): NewsItemView {
  return {
    slug: item.slug,
    title: item.title,
    body: item.body ?? 'No further information was provided.',
    category: item.category ?? 'notices',
    byline: item.byline ?? 'STAFF / 1:47 A.M.',
    publishedAt: item.published_at,
    isTrue: item.is_true,
  };
}

function mapLostObject(object: any, index = 0): LostObjectView {
  return {
    slug: object.slug,
    name: object.name,
    itemNumber: `DB-${String(index + 1).padStart(3, '0')}`,
    objectType: object.object_type ?? 'physical',
    description: object.description ?? 'Filed without a clean description.',
    meaning: object.meaning ?? 'Meaning pending. The drawer knows more than it says.',
    status: object.status ?? 'cataloged',
    found: object.description ?? 'Found in the wrong drawer.',
    condition: object.status ?? 'cataloged',
  };
}

function mapProduct(product: any): ProductView {
  const slug = product.slug ?? slugify(product.name);
  return {
    slug,
    sku: product.sku ?? 'SE-??',
    name: product.name,
    note: product.reason ?? product.description ?? 'Filed without explanation.',
    href: `/rack/${slug}`,
    status: product.status ?? 'file_only',
    department: product.category ?? 'uniform_assignment',
    object: product.category ?? 'issued_goods',
    priceCents: product.price_cents,
    category: product.category,
    description: product.description,
    priceLabel: formatPrice(product.price_cents),
  };
}

function mapVenture(venture: any): VentureView {
  return {
    slug: venture.slug ?? slugify(venture.name),
    name: venture.name,
    category: venture.status ?? 'announced_by_ai',
    status: venture.status ?? 'announced_by_ai',
    description: venture.description ?? 'The AI has not explained this one yet.',
    memo: venture.memo ?? venture.description ?? 'No memo was attached. That has never stopped OmniShift.',
  };
}

export function groupNewsItems(items: NewsItemView[]) {
  return items.reduce<Record<string, NewsItemView[]>>((groups, item) => {
    const key = item.category || 'notices';
    groups[key] ??= [];
    groups[key].push(item);
    return groups;
  }, {});
}

export async function getPublicPhoneMessages(): Promise<PublicContentResult<PhoneMessageView>> {
  const fallback = staticPhoneMessages();

  if (!supabase) {
    return { source: 'static', items: fallback };
  }

  try {
    const { data, error } = await supabase
      .from('phone_messages')
      .select('slug, from_label, message_type, body, received_at, unlock_level')
      .eq('is_public', true)
      .order('unlock_level', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data?.length) return { source: 'static', items: fallback };

    return {
      source: 'supabase',
      items: data.map((message: any) => ({
        slug: message.slug,
        from: message.from_label,
        time: message.received_at ? new Date(message.received_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '1:47 AM',
        body: message.body,
        messageType: message.message_type ?? 'voicemail',
        unlockLevel: message.unlock_level ?? 0,
      })),
    };
  } catch (error) {
    return {
      source: 'static',
      items: fallback,
      error: error instanceof Error ? error.message : 'Could not load public phone messages.',
    };
  }
}

export async function getPublicNewsItems(): Promise<PublicContentResult<NewsItemView>> {
  const fallback = staticNewsItems();

  if (!supabase) {
    return { source: 'static', items: fallback };
  }

  try {
    const { data, error } = await supabase
      .from('news_items')
      .select('slug, title, body, category, byline, is_true, published_at')
      .eq('is_public', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    if (!data?.length) return { source: 'static', items: fallback };

    return {
      source: 'supabase',
      items: data.map(mapNewsItem),
    };
  } catch (error) {
    return {
      source: 'static',
      items: fallback,
      error: error instanceof Error ? error.message : 'Could not load public news items.',
    };
  }
}

export async function getPublicNewsItemBySlug(slug: string): Promise<PublicContentSingleResult<NewsItemView>> {
  const fallback = staticNewsItems().find((item) => item.slug === slug) ?? null;

  if (!supabase) {
    return { source: 'static', item: fallback };
  }

  try {
    const { data, error } = await supabase
      .from('news_items')
      .select('slug, title, body, category, byline, is_true, published_at')
      .eq('is_public', true)
      .eq('slug', slug)
      .single();

    if (error || !data) return { source: fallback ? 'static' : 'supabase', item: fallback };

    return { source: 'supabase', item: mapNewsItem(data) };
  } catch (error) {
    return {
      source: 'static',
      item: fallback,
      error: error instanceof Error ? error.message : 'Could not load public news item.',
    };
  }
}

export async function getPublicLostObjects(): Promise<PublicContentResult<LostObjectView>> {
  const fallback = staticLostObjects();

  if (!supabase) {
    return { source: 'static', items: fallback };
  }

  try {
    const { data, error } = await supabase
      .from('lost_objects')
      .select('slug, name, object_type, description, meaning, status, is_public, created_at')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data?.length) return { source: 'static', items: fallback };

    return {
      source: 'supabase',
      items: data.map(mapLostObject),
    };
  } catch (error) {
    return {
      source: 'static',
      items: fallback,
      error: error instanceof Error ? error.message : 'Could not load public lost objects.',
    };
  }
}

export async function getPublicLostObjectBySlug(slug: string): Promise<PublicContentSingleResult<LostObjectView>> {
  const fallback = staticLostObjects().find((object) => object.slug === slug) ?? null;

  if (!supabase) {
    return { source: 'static', item: fallback };
  }

  try {
    const { data, error } = await supabase
      .from('lost_objects')
      .select('slug, name, object_type, description, meaning, status, is_public, created_at')
      .eq('is_public', true)
      .eq('slug', slug)
      .single();

    if (error || !data) return { source: fallback ? 'static' : 'supabase', item: fallback };

    return { source: 'supabase', item: mapLostObject(data) };
  } catch (error) {
    return {
      source: 'static',
      item: fallback,
      error: error instanceof Error ? error.message : 'Could not load public lost object.',
    };
  }
}

export async function getPublicRadioLogs(): Promise<PublicContentResult<RadioLogView>> {
  const fallback = staticRadioLogs();

  if (!supabase) {
    return { source: 'static', items: fallback };
  }

  try {
    const { data, error } = await supabase
      .from('radio_logs')
      .select('title, body, aired_at')
      .order('aired_at', { ascending: false });

    if (error) throw error;
    if (!data?.length) return { source: 'static', items: fallback };

    return {
      source: 'supabase',
      items: data.map((log: any) => ({
        title: log.title,
        body: log.body ?? 'Dead air with confidence.',
        airedAt: log.aired_at ? new Date(log.aired_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '1:47 AM',
      })),
    };
  } catch (error) {
    return {
      source: 'static',
      items: fallback,
      error: error instanceof Error ? error.message : 'Could not load public radio logs.',
    };
  }
}

export async function getPublicProducts(): Promise<PublicContentResult<ProductView>> {
  const fallback = staticProducts();

  if (!supabase) {
    return { source: 'static', items: fallback };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('slug, name, sku, status, price_cents, category, description, reason, sort_order, is_public')
      .eq('is_public', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    if (!data?.length) return { source: 'static', items: fallback };

    return {
      source: 'supabase',
      items: data.map(mapProduct),
    };
  } catch (error) {
    return {
      source: 'static',
      items: fallback,
      error: error instanceof Error ? error.message : 'Could not load public products.',
    };
  }
}

export async function getPublicProductBySlug(slug: string): Promise<PublicContentSingleResult<ProductView>> {
  const fallback = staticProducts().find((product) => product.slug === slug) ?? null;

  if (!supabase) {
    return { source: 'static', item: fallback };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('slug, name, sku, status, price_cents, category, description, reason, sort_order, is_public')
      .eq('is_public', true)
      .eq('slug', slug)
      .single();

    if (error || !data) return { source: fallback ? 'static' : 'supabase', item: fallback };

    return { source: 'supabase', item: mapProduct(data) };
  } catch (error) {
    return {
      source: 'static',
      item: fallback,
      error: error instanceof Error ? error.message : 'Could not load public product.',
    };
  }
}

export async function getPublicVentures(): Promise<PublicContentResult<VentureView>> {
  const fallback = staticVentures();

  if (!supabase) {
    return { source: 'static', items: fallback };
  }

  try {
    const { data, error } = await supabase
      .from('ventures')
      .select('slug, name, status, description, memo, is_public')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data?.length) return { source: 'static', items: fallback };

    return {
      source: 'supabase',
      items: data.map(mapVenture),
    };
  } catch (error) {
    return {
      source: 'static',
      items: fallback,
      error: error instanceof Error ? error.message : 'Could not load public ventures.',
    };
  }
}

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
};

export type PublicContentSource = 'supabase' | 'static';

export type PublicContentResult<T> = {
  source: PublicContentSource;
  items: T[];
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
  }));
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
      items: data.map((item: any) => ({
        slug: item.slug,
        title: item.title,
        body: item.body ?? 'No further information was provided.',
        category: item.category ?? 'notices',
        byline: item.byline ?? 'STAFF / 1:47 A.M.',
        publishedAt: item.published_at,
        isTrue: item.is_true,
      })),
    };
  } catch (error) {
    return {
      source: 'static',
      items: fallback,
      error: error instanceof Error ? error.message : 'Could not load public news items.',
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
      items: data.map((object: any, index: number) => ({
        slug: object.slug,
        name: object.name,
        itemNumber: `DB-${String(index + 1).padStart(3, '0')}`,
        objectType: object.object_type ?? 'physical',
        description: object.description ?? 'Filed without a clean description.',
        meaning: object.meaning ?? 'Meaning pending. The drawer knows more than it says.',
        status: object.status ?? 'cataloged',
        found: object.description ?? 'Found in the wrong drawer.',
        condition: object.status ?? 'cataloged',
      })),
    };
  } catch (error) {
    return {
      source: 'static',
      items: fallback,
      error: error instanceof Error ? error.message : 'Could not load public lost objects.',
    };
  }
}

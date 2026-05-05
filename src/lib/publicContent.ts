import { BREAKROOM_DATA } from '@/content/data/breakroom';
import { supabase } from '@/lib/supabaseClient';

export type PhoneMessageView = {
  slug: string;
  from: string;
  time: string;
  body: string;
  messageType: string;
  unlockLevel: number;
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

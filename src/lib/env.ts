export type PublicEnvStatus = {
  supabaseConfigured: boolean;
  siteUrl: string;
  radioConfigured: boolean;
  missing: string[];
};

export function getPublicEnvStatus(): PublicEnvStatus {
  const missing: string[] = [];

  if (!import.meta.env.PUBLIC_SUPABASE_URL) missing.push('PUBLIC_SUPABASE_URL');
  if (!import.meta.env.PUBLIC_SUPABASE_ANON_KEY) missing.push('PUBLIC_SUPABASE_ANON_KEY');

  return {
    supabaseConfigured: missing.length === 0,
    siteUrl: import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321',
    radioConfigured: Boolean(import.meta.env.PUBLIC_RADIO_STREAM_URL),
    missing,
  };
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('YOUR_PROJECT_ID') &&
  !supabaseKey.includes('YOUR_SUPABASE')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error('Add your Supabase URL and publishable/anon key to the .env file, then restart Vite.');
  }
  return supabase;
}

export async function assertPhoneAuthEnabled() {
  if (!isSupabaseConfigured) requireSupabase();

  const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
    headers: { apikey: supabaseKey },
  });

  if (!response.ok) {
    throw new Error('Could not verify the Supabase authentication settings. Please try again.');
  }

  const settings = await response.json();
  if (!settings.external?.phone) {
    throw new Error('Phone sign-up is not enabled yet. In Supabase, open Authentication → Sign In / Providers → Phone, enable it, configure Twilio, and save.');
  }
}

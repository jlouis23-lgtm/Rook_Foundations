import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase is not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) — Rook Play sign-in and data will not work until .env.local is set. The rest of the site is unaffected.'
  );
}

// Fall back to a placeholder so createClient doesn't throw and take down the
// whole app (it's imported by AuthContext, which wraps every route). Calls
// will fail at request time instead, same as the rest of the public site's
// graceful-degradation behaviour when a backend isn't configured.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

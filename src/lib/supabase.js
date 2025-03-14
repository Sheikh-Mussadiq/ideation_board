import { createClient } from '@supabase/supabase-js';
import { createSupabaseProxy } from './supabaseProxy';
import { SUPABASE_CONFIG } from '../config/supabase';

const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

let supabase;

// Check the environment and choose the appropriate client
if (import.meta.env.VITE_ENVIORNMENT === "development") {
  console.log("Using normal Supabase client");
  supabase = createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    }
  );
} else {
  console.log("Using proxied Supabase client");
  supabase = createSupabaseProxy(supabaseClient);
}

// Export the selected client
export { supabase };

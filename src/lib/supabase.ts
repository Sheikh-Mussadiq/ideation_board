import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { SUPABASE_CONFIG } from '../config/supabase';

export const supabase = createClient<Database>(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);
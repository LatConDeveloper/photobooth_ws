import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️  Using placeholder Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env');
}

/**
 * Supabase client with service role key for backend operations.
 * Bypasses RLS policies - use with caution.
 */
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Supabase client with anon key for client-like operations.
 * Respects RLS policies.
 */
export const supabaseAnon = createClient(
  supabaseUrl,
  process.env.SUPABASE_ANON_KEY || supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

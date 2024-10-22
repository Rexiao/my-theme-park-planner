import { createClient } from '@supabase/supabase-js';
import getEnv from '../getenv';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export function createSupabaseAdminClient() {
  const serviceRoleSecret = getEnv('SUPABASE_SERVICE_ROLE_SECRET')!;
  return createClient(supabaseUrl, serviceRoleSecret, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

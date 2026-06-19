import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

let adminClient: SupabaseClient<Database> | null = null;

export const createAdminClient = (): SupabaseClient<Database> => {
  if (!adminClient) {
    adminClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
  }
  return adminClient;
};

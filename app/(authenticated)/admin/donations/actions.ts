'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { verifyAdminAccess } from '@/utils/auth-helpers/server';
import type { Tables } from '@/utils/supabase/types';

const supabaseAdmin = createAdminClient();

export type AdminDonation = Tables<'donations'>;

export async function listDonations(options?: {
  page?: number;
  limit?: number;
}): Promise<{ donations: AdminDonation[]; total: number }> {
  await verifyAdminAccess();

  const page = options?.page || 1;
  const limit = options?.limit || 20;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabaseAdmin
    .from('donations')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch donations: ${error.message}`);
  }

  return {
    donations: (data as AdminDonation[]) || [],
    total: count || 0
  };
}

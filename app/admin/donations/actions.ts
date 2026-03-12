'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { verifyAdminAccess } from '@/utils/auth-helpers/server';
import type { Tables } from '@/utils/supabase/types';

const supabaseAdmin = createAdminClient();

export type AdminDonation = Tables<'donations'>;

export async function listDonations(options?: {
  page?: number;
  limit?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<{ donations: AdminDonation[]; total: number }> {
  await verifyAdminAccess();

  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const search = options?.search?.trim();
  const dateFrom = options?.dateFrom?.trim();
  const dateTo = options?.dateTo?.trim();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin
    .from('donations')
    .select('*', { count: 'exact' });

  if (search) {
    query = query.ilike('donor_email', `%${search}%`);
  }
  if (dateFrom) {
    query = query.gte('created_at', `${dateFrom}T00:00:00.000Z`);
  }
  if (dateTo) {
    query = query.lte('created_at', `${dateTo}T23:59:59.999Z`);
  }

  const { data, error, count } = await query
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

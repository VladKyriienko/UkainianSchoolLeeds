'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/utils/supabase/admin';
import { verifyAdminAccess } from '@/utils/auth-helpers/server';
import type { Tables } from '@/utils/supabase/types';

const supabaseAdmin = createAdminClient();

export type AdminMessage = Tables<'messages'>;

export async function listMessages(options?: {
  page?: number;
  limit?: number;
}): Promise<{ messages: AdminMessage[]; total: number }> {
  await verifyAdminAccess();

  const page = options?.page || 1;
  const limit = options?.limit || 20;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabaseAdmin
    .from('messages')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }

  return {
    messages: (data as AdminMessage[]) || [],
    total: count || 0
  };
}

export async function markMessageAsRead(id: string): Promise<void> {
  await verifyAdminAccess();

  const { error } = await supabaseAdmin
    .from('messages')
    .update({ read: true })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to mark message as read: ${error.message}`);
  }

  revalidatePath('/admin/messages');
}

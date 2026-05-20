'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminAccess } from '@/lib/auth/server';
import type { AdminMessage } from '@/types';

const supabaseAdmin = createAdminClient();

export async function listMessages(options?: {
  page?: number;
  limit?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<{ messages: AdminMessage[]; total: number }> {
  await verifyAdminAccess();

  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const search = options?.search?.trim();
  const dateFrom = options?.dateFrom?.trim();
  const dateTo = options?.dateTo?.trim();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin.from('messages').select('*', { count: 'exact' });

  if (search) {
    const safe = search.replace(/,/g, ' ');
    const term = `%${safe}%`;
    query = query.or(
      `email.ilike.${term},name.ilike.${term},subject.ilike.${term},message.ilike.${term}`
    );
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
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }

  return {
    messages: (data as AdminMessage[]) || [],
    total: count || 0
  };
}

export async function getMessageById(id: string): Promise<AdminMessage | null> {
  await verifyAdminAccess();

  const { data, error } = await supabaseAdmin
    .from('messages')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch message: ${error.message}`);
  }

  return data as AdminMessage;
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
  revalidatePath(`/admin/messages/${id}`);
}

export async function deleteMessage(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const { error } = await supabaseAdmin.from('messages').delete().eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/messages');
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

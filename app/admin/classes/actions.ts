'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminAccess } from '@/lib/auth/server';
import type { AdminClass } from '@/types';
import { normalizeText } from '@/utils/text';

const supabaseAdmin = createAdminClient();

export async function listClasses(options?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ classes: AdminClass[]; total: number }> {
  await verifyAdminAccess();

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  const search = options?.search?.trim();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin.from('classes').select('*', { count: 'exact' });

  if (search) {
    const safe = search.replace(/,/g, ' ');
    query = query.or(`title.ilike.%${safe}%,title_uk.ilike.%${safe}%`);
  }

  const { data, error, count } = await query
    .order('order', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch classes: ${error.message}`);
  }

  return {
    classes: (data as AdminClass[]) ?? [],
    total: count ?? 0
  };
}

export async function getClassById(id: string): Promise<AdminClass | null> {
  await verifyAdminAccess();

  const { data, error } = await supabaseAdmin
    .from('classes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch class: ${error.message}`);
  }

  return data as AdminClass;
}

export async function createClass(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const title = formData.get('title');
    if (!title || typeof title !== 'string' || !title.trim()) {
      return { success: false, error: 'Title is required' };
    }

    const titleUk = normalizeText(formData.get('title_uk'));
    const description = normalizeText(formData.get('description'));
    const descriptionUk = normalizeText(formData.get('description_uk'));
    const orderRaw = formData.get('order');
    const order = Math.max(0, parseInt(String(orderRaw ?? '0'), 10) || 0);

    const { error: insertError } = await supabaseAdmin.from('classes').insert({
      title: title.trim(),
      title_uk: titleUk,
      description: description ?? null,
      description_uk: descriptionUk ?? null,
      order
    });

    if (insertError) {
      return {
        success: false,
        error: `Failed to create class: ${insertError.message}`
      };
    }

    revalidatePath('/admin/classes');
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

export async function updateClass(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const title = formData.get('title');
    if (!title || typeof title !== 'string' || !title.trim()) {
      return { success: false, error: 'Title is required' };
    }

    const titleUk = normalizeText(formData.get('title_uk'));
    const description = normalizeText(formData.get('description'));
    const descriptionUk = normalizeText(formData.get('description_uk'));
    const orderRaw = formData.get('order');
    const order = Math.max(0, parseInt(String(orderRaw ?? '0'), 10) || 0);

    const { error: updateError } = await supabaseAdmin
      .from('classes')
      .update({
        title: title.trim(),
        title_uk: titleUk,
        description: description ?? null,
        description_uk: descriptionUk ?? null,
        order
      })
      .eq('id', id);

    if (updateError) {
      return {
        success: false,
        error: `Failed to update class: ${updateError.message}`
      };
    }

    revalidatePath('/admin/classes');
    revalidatePath(`/admin/classes/${id}`);
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

export async function deleteClass(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const { error } = await supabaseAdmin.from('classes').delete().eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/classes');
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

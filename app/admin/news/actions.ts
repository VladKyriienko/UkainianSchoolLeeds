'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/utils/supabase/admin';
import { verifyAdminAccess } from '@/utils/auth-helpers/server';
import type { Tables } from '@/utils/supabase/types';
import { randomUUID } from 'crypto';

const supabaseAdmin = createAdminClient();

export type AdminNews = Tables<'news'>;

function normalizeText(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function uploadNewsPhotoIfPresent(
  photoFile: File | null
): Promise<string | null> {
  if (!photoFile || photoFile.size === 0) return null;

  if (!photoFile.type.startsWith('image/')) {
    throw new Error('Photo must be an image');
  }

  const maxBytes = 5 * 1024 * 1024;
  if (photoFile.size > maxBytes) {
    throw new Error('Photo is too large (max 5MB)');
  }

  const bucket = 'news-photos';
  const originalName = photoFile.name || 'photo';
  const safeName = sanitizeFilename(originalName);
  const ext = safeName.includes('.') ? safeName.split('.').pop() : null;
  const base = ext ? safeName.slice(0, -(ext.length + 1)) : safeName;
  const filename = `${randomUUID()}-${base}${ext ? `.${ext}` : ''}`;
  const path = `news/${filename}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, photoFile, {
      contentType: photoFile.type,
      upsert: true
    });

  if (uploadError) {
    throw new Error(`Failed to upload photo: ${uploadError.message}`);
  }

  return path;
}

export async function listNews(options?: {
  page?: number;
  limit?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<{ news: AdminNews[]; total: number }> {
  await verifyAdminAccess();

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  const search = options?.search?.trim();
  const dateFrom = options?.dateFrom?.trim();
  const dateTo = options?.dateTo?.trim();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin.from('news').select('*', { count: 'exact' });

  if (search) {
    const safe = search.replace(/,/g, ' ');
    query = query.or(`title.ilike.%${safe}%,title_uk.ilike.%${safe}%`);
  }
  if (dateFrom) {
    query = query.gte('date', dateFrom);
  }
  if (dateTo) {
    query = query.lte('date', dateTo);
  }

  const { data, error, count } = await query
    .order('date', { ascending: false })
    .order('order', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch news: ${error.message}`);
  }

  return {
    news: (data as AdminNews[]) ?? [],
    total: count ?? 0
  };
}

export async function getNewsById(id: string): Promise<AdminNews | null> {
  await verifyAdminAccess();

  const { data, error } = await supabaseAdmin
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch news: ${error.message}`);
  }

  return data as AdminNews;
}

export async function createNews(
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
    const dateRaw = formData.get('date');
    const dateStr =
      dateRaw && typeof dateRaw === 'string' && dateRaw.trim()
        ? `${dateRaw.trim()}T12:00:00.000Z`
        : new Date().toISOString();
    const orderRaw = formData.get('order');
    const order = Math.max(
      0,
      parseInt(String(orderRaw ?? '0'), 10) || 0
    );

    const photoEntry = formData.get('photo');
    const photoFile = photoEntry instanceof File ? photoEntry : null;
    const photoPath = await uploadNewsPhotoIfPresent(photoFile);

    const { error: insertError } = await supabaseAdmin.from('news').insert({
      title: title.trim(),
      title_uk: titleUk,
      description: description ?? null,
      description_uk: descriptionUk ?? null,
      date: dateStr,
      order,
      ...(photoPath && { photo: photoPath })
    });

    if (insertError) {
      return {
        success: false,
        error: `Failed to create news: ${insertError.message}`
      };
    }

    revalidatePath('/admin/news');
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

export async function updateNews(
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
    const dateRaw = formData.get('date');
    const dateStr =
      dateRaw && typeof dateRaw === 'string' && dateRaw.trim()
        ? `${dateRaw.trim()}T12:00:00.000Z`
        : new Date().toISOString();
    const orderRaw = formData.get('order');
    const order = Math.max(
      0,
      parseInt(String(orderRaw ?? '0'), 10) || 0
    );

    const removePhoto = formData.get('remove_photo') === '1';
    const photoEntry = formData.get('photo');
    const photoFile = photoEntry instanceof File ? photoEntry : null;
    const photoPath = await uploadNewsPhotoIfPresent(photoFile);

    const updatePayload: Record<string, unknown> = {
      title: title.trim(),
      title_uk: titleUk,
      description: description ?? null,
      description_uk: descriptionUk ?? null,
      date: dateStr,
      order
    };
    if (removePhoto) {
      const { data: existing } = await supabaseAdmin
        .from('news')
        .select('photo')
        .eq('id', id)
        .single();
      if (existing?.photo) {
        await supabaseAdmin.storage.from('news-photos').remove([existing.photo]);
      }
      updatePayload.photo = null;
    } else if (photoPath) {
      updatePayload.photo = photoPath;
    }

    const { error: updateError } = await supabaseAdmin
      .from('news')
      .update(updatePayload)
      .eq('id', id);

    if (updateError) {
      return {
        success: false,
        error: `Failed to update news: ${updateError.message}`
      };
    }

    revalidatePath('/admin/news');
    revalidatePath(`/admin/news/${id}`);
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

export async function deleteNews(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const { data: item, error: fetchError } = await supabaseAdmin
      .from('news')
      .select('photo')
      .eq('id', id)
      .single();

    if (!fetchError && item?.photo) {
      await supabaseAdmin.storage.from('news-photos').remove([item.photo]);
    }

    const { error } = await supabaseAdmin.from('news').delete().eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/news');
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

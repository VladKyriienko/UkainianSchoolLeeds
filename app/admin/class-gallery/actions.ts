'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/utils/supabase/admin';
import { verifyAdminAccess } from '@/utils/auth-helpers/server';
import type { Tables } from '@/utils/supabase/types';
import { randomUUID } from 'crypto';

const supabaseAdmin = createAdminClient();

export type AdminGalleryItem = Tables<'class_photo_galery'>;

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function uploadGalleryPhoto(
  photoFile: File
): Promise<string> {
  if (!photoFile.type.startsWith('image/')) {
    throw new Error('Photo must be an image');
  }
  const maxBytes = 5 * 1024 * 1024;
  if (photoFile.size > maxBytes) {
    throw new Error('Photo is too large (max 5MB)');
  }
  const bucket = 'class-gallery';
  const originalName = photoFile.name || 'photo';
  const safeName = sanitizeFilename(originalName);
  const ext = safeName.includes('.') ? safeName.split('.').pop() : null;
  const base = ext ? safeName.slice(0, -(ext.length + 1)) : safeName;
  const filename = `${randomUUID()}-${base}${ext ? `.${ext}` : ''}`;
  const path = `gallery/${filename}`;

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, photoFile, { contentType: photoFile.type, upsert: true });

  if (error) throw new Error(`Failed to upload photo: ${error.message}`);
  return path;
}

export async function listGalleryItems(options?: {
  page?: number;
  limit?: number;
  classId?: string;
}): Promise<{ items: AdminGalleryItem[]; total: number }> {
  await verifyAdminAccess();

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin
    .from('class_photo_galery')
    .select('*', { count: 'exact' });

  if (options?.classId?.trim()) {
    query = query.eq('class_id', options.classId.trim());
  }

  const { data, error, count } = await query
    .order('order', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw new Error(`Failed to fetch gallery: ${error.message}`);

  return {
    items: (data as AdminGalleryItem[]) ?? [],
    total: count ?? 0
  };
}

export async function getGalleryItemById(id: string): Promise<AdminGalleryItem | null> {
  await verifyAdminAccess();

  const { data, error } = await supabaseAdmin
    .from('class_photo_galery')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch gallery item: ${error.message}`);
  }
  return data as AdminGalleryItem;
}

export async function createGalleryItem(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const classId = formData.get('class_id');
    if (!classId || typeof classId !== 'string' || !classId.trim()) {
      return { success: false, error: 'Class is required' };
    }

    const photoEntry = formData.get('photo');
    const photoFile = photoEntry instanceof File ? photoEntry : null;
    if (!photoFile || photoFile.size === 0) {
      return { success: false, error: 'Photo is required' };
    }

    const orderRaw = formData.get('order');
    const order = Math.max(0, parseInt(String(orderRaw ?? '0'), 10) || 0);

    const photoPath = await uploadGalleryPhoto(photoFile);

    const { error: insertError } = await supabaseAdmin
      .from('class_photo_galery')
      .insert({ class_id: classId.trim(), photo: photoPath, order });

    if (insertError) {
      return { success: false, error: insertError.message };
    }
    revalidatePath('/admin/class-gallery');
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function updateGalleryItem(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const classId = formData.get('class_id');
    if (!classId || typeof classId !== 'string' || !classId.trim()) {
      return { success: false, error: 'Class is required' };
    }

    const orderRaw = formData.get('order');
    const order = Math.max(0, parseInt(String(orderRaw ?? '0'), 10) || 0);

    const photoEntry = formData.get('photo');
    const photoFile = photoEntry instanceof File ? photoEntry : null;

    let photoPath: string | null = null;
    if (photoFile && photoFile.size > 0) {
      const existing = await getGalleryItemById(id);
      if (existing?.photo) {
        await supabaseAdmin.storage.from('class-gallery').remove([existing.photo]);
      }
      photoPath = await uploadGalleryPhoto(photoFile);
    }

    const payload: { class_id: string; order: number; photo?: string } = {
      class_id: classId.trim(),
      order
    };
    if (photoPath) payload.photo = photoPath;

    const { error: updateError } = await supabaseAdmin
      .from('class_photo_galery')
      .update(payload)
      .eq('id', id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }
    revalidatePath('/admin/class-gallery');
    revalidatePath(`/admin/class-gallery/${id}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function deleteGalleryItem(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const item = await getGalleryItemById(id);
    if (item?.photo) {
      await supabaseAdmin.storage.from('class-gallery').remove([item.photo]);
    }

    const { error } = await supabaseAdmin
      .from('class_photo_galery')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/class-gallery');
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

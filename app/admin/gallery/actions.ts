'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminAccess } from '@/lib/auth/server';
import type { AdminSchoolGalleryItem } from '@/types';
import { randomUUID } from 'crypto';
import { sanitizeFilename } from '@/utils/file-name';
import { GALLERY_COLUMNS } from '@/lib/supabase/columns';

const supabaseAdmin = createAdminClient();

const GALLERY_BUCKET = 'gallery-photos';

function revalidateGalleryPaths(id?: string) {
  revalidatePath('/');
  revalidatePath('/parents/gallery');
  revalidatePath('/admin/gallery');
  if (id) {
    revalidatePath(`/admin/gallery/${id}`);
    revalidatePath(`/admin/gallery/${id}/edit`);
  }
}

async function uploadGalleryPhoto(photoFile: File): Promise<string> {
  if (!photoFile.type.startsWith('image/')) {
    throw new Error('Photo must be an image');
  }
  const maxBytes = 5 * 1024 * 1024;
  if (photoFile.size > maxBytes) {
    throw new Error('Photo is too large (max 5MB)');
  }

  const originalName = photoFile.name || 'photo';
  const safeName = sanitizeFilename(originalName);
  const ext = safeName.includes('.') ? safeName.split('.').pop() : null;
  const base = ext ? safeName.slice(0, -(ext.length + 1)) : safeName;
  const filename = `${randomUUID()}-${base}${ext ? `.${ext}` : ''}`;
  const path = `photos/${filename}`;

  const { error } = await supabaseAdmin.storage
    .from(GALLERY_BUCKET)
    .upload(path, photoFile, { contentType: photoFile.type, upsert: true });

  if (error) throw new Error(`Failed to upload photo: ${error.message}`);
  return path;
}

export async function listSchoolGalleryItems(options?: {
  page?: number;
  limit?: number;
}): Promise<{ items: AdminSchoolGalleryItem[]; total: number }> {
  await verifyAdminAccess();

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabaseAdmin
    .from('gallery')
    .select('*', { count: 'exact' })
    .order('order', { ascending: true })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw new Error(`Failed to fetch gallery: ${error.message}`);

  return {
    items: (data as AdminSchoolGalleryItem[]) ?? [],
    total: count ?? 0
  };
}

export async function getSchoolGalleryItemById(
  id: string
): Promise<AdminSchoolGalleryItem | null> {
  await verifyAdminAccess();

  const { data, error } = await supabaseAdmin
    .from('gallery')
    .select(GALLERY_COLUMNS)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch gallery item: ${error.message}`);
  }

  return data as AdminSchoolGalleryItem;
}

export async function createSchoolGalleryItem(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const photoEntry = formData.get('photo');
    const photoFile = photoEntry instanceof File ? photoEntry : null;
    if (!photoFile || photoFile.size === 0) {
      return { success: false, error: 'Photo is required' };
    }

    const orderRaw = formData.get('order');
    const order = Math.max(0, parseInt(String(orderRaw ?? '0'), 10) || 0);

    const photoPath = await uploadGalleryPhoto(photoFile);

    const { error: insertError } = await supabaseAdmin.from('gallery').insert({
      photo: photoPath,
      order
    });

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    revalidateGalleryPaths();
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
}

export async function updateSchoolGalleryItem(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const orderRaw = formData.get('order');
    const order = Math.max(0, parseInt(String(orderRaw ?? '0'), 10) || 0);

    const photoEntry = formData.get('photo');
    const photoFile = photoEntry instanceof File ? photoEntry : null;

    const payload: { order: number; photo?: string } = { order };

    if (photoFile && photoFile.size > 0) {
      const existing = await getSchoolGalleryItemById(id);
      if (existing?.photo) {
        await supabaseAdmin.storage.from(GALLERY_BUCKET).remove([existing.photo]);
      }
      payload.photo = await uploadGalleryPhoto(photoFile);
    }

    const { error: updateError } = await supabaseAdmin
      .from('gallery')
      .update(payload)
      .eq('id', id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidateGalleryPaths(id);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
}

export async function deleteSchoolGalleryItem(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const item = await getSchoolGalleryItemById(id);
    if (item?.photo) {
      await supabaseAdmin.storage.from(GALLERY_BUCKET).remove([item.photo]);
    }

    const { error } = await supabaseAdmin.from('gallery').delete().eq('id', id);

    if (error) return { success: false, error: error.message };

    revalidateGalleryPaths(id);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
}

export async function reorderSchoolGallery(
  orderedIds: string[]
): Promise<{ success: boolean; error?: string }> {
  await verifyAdminAccess();

  if (orderedIds.length === 0) {
    return { success: true };
  }

  const uniqueIds = new Set(orderedIds);
  if (uniqueIds.size !== orderedIds.length) {
    return { success: false, error: 'Duplicate ids in reorder payload' };
  }

  try {
    const results = await Promise.all(
      orderedIds.map((id, index) =>
        supabaseAdmin.from('gallery').update({ order: index }).eq('id', id)
      )
    );

    const failed = results.find((result) => result.error);
    if (failed?.error) {
      return { success: false, error: failed.error.message };
    }

    revalidateGalleryPaths();
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
}

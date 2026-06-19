'use server';

import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Database } from '@/lib/supabase/types';
import { verifyAdminAccess } from '@/lib/auth/server';
import type { AdminClass } from '@/types';
import { sanitizeFilename } from '@/utils/file-name';
import { normalizeText } from '@/utils/text';
import { CLASS_LIST_COLUMNS, CLASS_COLUMNS } from '@/lib/supabase/columns';

const supabaseAdmin = createAdminClient();

type ClassUpdate = Database['public']['Tables']['classes']['Update'];

function getFormString(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === 'string' ? value : null;
}

async function uploadClassPhotoIfPresent(
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

  const bucket = 'classes-photos';
  const originalName = photoFile.name || 'photo';
  const safeName = sanitizeFilename(originalName);
  const ext = safeName.includes('.') ? safeName.split('.').pop() : null;
  const base = ext ? safeName.slice(0, -(ext.length + 1)) : safeName;
  const filename = `${randomUUID()}-${base}${ext ? `.${ext}` : ''}`;
  const path = `classes/${filename}`;

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

  let query = supabaseAdmin.from('classes').select(CLASS_LIST_COLUMNS, { count: 'exact' });

  if (search) {
    const safe = search.replace(/,/g, ' ');
    query = query.or(`title.ilike.%${safe}%,title_uk.ilike.%${safe}%`);
  }

  const { data, error, count } = await query
    .order('order', { ascending: true })
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
    .select(CLASS_COLUMNS)
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

    const photoEntry = formData.get('photo');
    const photoFile = photoEntry instanceof File ? photoEntry : null;
    const photoPath = await uploadClassPhotoIfPresent(photoFile);

    const { error: insertError } = await supabaseAdmin.from('classes').insert({
      title: title.trim(),
      title_uk: titleUk,
      description: description ?? null,
      description_uk: descriptionUk ?? null,
      order,
      ...(photoPath && { photo: photoPath })
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

    const title = getFormString(formData, 'title');
    if (!title?.trim()) {
      return { success: false, error: 'Title is required' };
    }

    const titleUk = normalizeText(getFormString(formData, 'title_uk'));
    const description = normalizeText(getFormString(formData, 'description'));
    const descriptionUk = normalizeText(getFormString(formData, 'description_uk'));

    const orderRaw = getFormString(formData, 'order');
    const order = Math.max(0, parseInt(orderRaw ?? '0', 10) || 0);

    const removePhoto = getFormString(formData, 'remove_photo') === '1';

    const photoEntry = formData.get('photo');
    const photoFile = photoEntry instanceof File ? photoEntry : null;
    const photoPath = await uploadClassPhotoIfPresent(photoFile);

    const updatePayload: ClassUpdate = {
      title: title.trim(),
      title_uk: titleUk,
      description: description ?? null,
      description_uk: descriptionUk ?? null,
      order
    };

    if (removePhoto || photoPath) {
      const { data: existing } = await supabaseAdmin
        .from('classes')
        .select('photo')
        .eq('id', id)
        .single();
      const previousPhoto = existing?.photo ?? null;

      if (removePhoto) {
        if (previousPhoto) {
          await supabaseAdmin.storage
            .from('classes-photos')
            .remove([previousPhoto]);
        }
        updatePayload.photo = null;
      } else if (photoPath) {
        if (previousPhoto && previousPhoto !== photoPath) {
          await supabaseAdmin.storage
            .from('classes-photos')
            .remove([previousPhoto]);
        }
        updatePayload.photo = photoPath;
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from('classes')
      .update(updatePayload)
      .eq('id', id);

    if (updateError) {
      return {
        success: false,
        error: `Failed to update class: ${updateError.message}`
      };
    }

    revalidatePath('/admin/classes');
    revalidatePath(`/admin/classes/${id}`);
    revalidatePath('/parents/class-pages');
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

    const { data: item, error: fetchError } = await supabaseAdmin
      .from('classes')
      .select('photo')
      .eq('id', id)
      .single();

    if (!fetchError && item?.photo) {
      await supabaseAdmin.storage.from('classes-photos').remove([item.photo]);
    }

    const { error } = await supabaseAdmin.from('classes').delete().eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/classes');
    revalidatePath('/parents/class-pages');
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

export async function reorderClasses(
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
        supabaseAdmin.from('classes').update({ order: index }).eq('id', id)
      )
    );

    const failed = results.find((result) => result.error);
    if (failed?.error) {
      return { success: false, error: failed.error.message };
    }

    revalidatePath('/admin/classes');
    revalidatePath('/parents/class-pages');

    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

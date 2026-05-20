'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentUser } from '@/lib/auth/server';
import { hasAdminRole, hasTeacherRole } from '@/lib/auth/roles';
import type { AdminGalleryItem, GalleryClass } from '@/types';
import { randomUUID } from 'crypto';
import { sanitizeFilename } from '@/utils/file-name';

const supabaseAdmin = createAdminClient();

type GalleryAccessContext = {
  userId: string;
  isAdmin: boolean;
  allowedClassIds: string[] | null;
};

async function getGalleryAccessContext(): Promise<GalleryAccessContext> {
  const { user, profileData } = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized: User not authenticated');
  }

  if (hasAdminRole(profileData)) {
    return { userId: user.id, isAdmin: true, allowedClassIds: null };
  }

  if (!hasTeacherRole(profileData)) {
    throw new Error(
      'Unauthorized: Gallery access requires admin or teacher role'
    );
  }

  const { data, error } = await supabaseAdmin
    .from('teacher_class')
    .select('class_id')
    .eq('teacher_id', user.id);

  if (error) {
    throw new Error(`Failed to load teacher classes: ${error.message}`);
  }

  return {
    userId: user.id,
    isAdmin: false,
    allowedClassIds: (data ?? []).map((item) => item.class_id)
  };
}

function ensureClassAccess(ctx: GalleryAccessContext, classId: string) {
  if (ctx.isAdmin) return;
  if (!ctx.allowedClassIds?.includes(classId)) {
    throw new Error('Unauthorized: No access to this class gallery');
  }
}

function revalidateGalleryPaths(id?: string) {
  revalidatePath('/');
  revalidatePath('/admin/class-gallery');
  revalidatePath('/teacher/class-gallery');
  if (id) {
    revalidatePath(`/admin/class-gallery/${id}`);
    revalidatePath(`/admin/class-gallery/${id}/edit`);
    revalidatePath(`/teacher/class-gallery/${id}`);
    revalidatePath(`/teacher/class-gallery/${id}/edit`);
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
  const access = await getGalleryAccessContext();

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin
    .from('class_photo_galery')
    .select('*', { count: 'exact' });

  if (options?.classId?.trim()) {
    const selectedClassId = options.classId.trim();
    ensureClassAccess(access, selectedClassId);
    query = query.eq('class_id', selectedClassId);
  } else if (!access.isAdmin) {
    if (!access.allowedClassIds || access.allowedClassIds.length === 0) {
      return { items: [], total: 0 };
    }
    query = query.in('class_id', access.allowedClassIds);
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

export async function getGalleryItemById(
  id: string
): Promise<AdminGalleryItem | null> {
  const access = await getGalleryAccessContext();

  const { data, error } = await supabaseAdmin
    .from('class_photo_galery')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch gallery item: ${error.message}`);
  }
  ensureClassAccess(access, data.class_id);
  return data as AdminGalleryItem;
}

export async function listAccessibleClassesForGallery(): Promise<{
  classes: GalleryClass[];
  total: number;
}> {
  const access = await getGalleryAccessContext();

  let query = supabaseAdmin.from('classes').select('*', { count: 'exact' });

  if (!access.isAdmin) {
    if (!access.allowedClassIds || access.allowedClassIds.length === 0) {
      return { classes: [], total: 0 };
    }
    query = query.in('id', access.allowedClassIds);
  }

  const { data, error, count } = await query
    .order('order', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch classes for gallery: ${error.message}`);
  }

  return {
    classes: (data as GalleryClass[]) ?? [],
    total: count ?? 0
  };
}

export async function getTeacherAssignedClassForGallery(): Promise<GalleryClass | null> {
  const access = await getGalleryAccessContext();
  if (access.isAdmin) return null;

  if (!access.allowedClassIds || access.allowedClassIds.length === 0) {
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from('classes')
    .select('*')
    .in('id', access.allowedClassIds)
    .order('order', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch teacher class: ${error.message}`);
  }

  return (data as GalleryClass | null) ?? null;
}

export async function createGalleryItem(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const access = await getGalleryAccessContext();

    const classId = formData.get('class_id');
    if (!classId || typeof classId !== 'string' || !classId.trim()) {
      return { success: false, error: 'Class is required' };
    }
    ensureClassAccess(access, classId.trim());

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
    revalidateGalleryPaths();
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
}

export async function updateGalleryItem(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const access = await getGalleryAccessContext();

    const classId = formData.get('class_id');
    if (!classId || typeof classId !== 'string' || !classId.trim()) {
      return { success: false, error: 'Class is required' };
    }
    ensureClassAccess(access, classId.trim());

    const orderRaw = formData.get('order');
    const order = Math.max(0, parseInt(String(orderRaw ?? '0'), 10) || 0);

    const photoEntry = formData.get('photo');
    const photoFile = photoEntry instanceof File ? photoEntry : null;

    let photoPath: string | null = null;
    if (photoFile && photoFile.size > 0) {
      const existing = await getGalleryItemById(id);
      if (existing?.photo) {
        await supabaseAdmin.storage
          .from('class-gallery')
          .remove([existing.photo]);
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
    revalidateGalleryPaths(id);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
}

export async function deleteGalleryItem(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await getGalleryAccessContext();

    const item = await getGalleryItemById(id);
    if (item?.photo) {
      await supabaseAdmin.storage.from('class-gallery').remove([item.photo]);
    }

    const { error } = await supabaseAdmin
      .from('class_photo_galery')
      .delete()
      .eq('id', id);

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

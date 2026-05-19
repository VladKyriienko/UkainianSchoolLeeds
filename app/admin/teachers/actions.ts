'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminAccess } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import type { Tables } from '@/lib/supabase/types';
import { randomUUID } from 'crypto';
import { sanitizeFilename } from '@/utils/file-name';
import { normalizeText } from '@/utils/text';

const supabaseAdmin = createAdminClient();

export type AdminTeacher = Tables<'teachers'>;

async function uploadTeacherPhotoIfPresent(
  photoFile: File | null
): Promise<string | null> {
  if (!photoFile || photoFile.size === 0) return null;

  if (!photoFile.type.startsWith('image/')) {
    throw new Error('Photo must be an image');
  }

  // 5MB limit
  const maxBytes = 5 * 1024 * 1024;
  if (photoFile.size > maxBytes) {
    throw new Error('Photo is too large (max 5MB)');
  }

  const bucket = 'teachers-photos';
  const originalName = photoFile.name || 'photo';
  const safeName = sanitizeFilename(originalName);
  const ext = safeName.includes('.') ? safeName.split('.').pop() : null;
  const base = ext ? safeName.slice(0, -(ext.length + 1)) : safeName;
  const filename = `${randomUUID()}-${base}${ext ? `.${ext}` : ''}`;
  const path = `teachers/${filename}`;

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

export async function listTeachers(options?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}): Promise<{ teachers: AdminTeacher[]; total: number }> {
  await verifyAdminAccess();

  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const search = options?.search?.trim();
  const categoryRaw = options?.category?.trim();

  let query = supabaseAdmin.from('teachers').select('*', { count: 'exact' });

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const allowedCategories = ['HEADTEACHER', 'TEACHER', 'STAF'] as const;
  if (
    categoryRaw &&
    allowedCategories.includes(
      categoryRaw as (typeof allowedCategories)[number]
    )
  ) {
    query = query.eq(
      'category',
      categoryRaw as (typeof allowedCategories)[number]
    );
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch teachers: ${error.message}`);
  }

  return { teachers: data || [], total: count || 0 };
}

export async function getTeacherById(id: string): Promise<AdminTeacher | null> {
  await verifyAdminAccess();

  const { data, error } = await supabaseAdmin
    .from('teachers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch teacher: ${error.message}`);
  }

  return data;
}

export async function createTeacher(formData: FormData) {
  await verifyAdminAccess();

  const name = normalizeText(formData.get('name'));
  const nameUk = normalizeText(formData.get('name_uk'));
  const title = normalizeText(formData.get('title'));
  const titleUk = normalizeText(formData.get('title_uk'));
  const phone = normalizeText(formData.get('phone'));
  const email = normalizeText(formData.get('email'));
  const description = normalizeText(formData.get('description'));
  const descriptionUk = normalizeText(formData.get('description_uk'));
  const categoryRaw = normalizeText(formData.get('category'));

  if (!name) {
    throw new Error('Name is required');
  }

  const allowedCategories = ['HEADTEACHER', 'TEACHER', 'STAF'] as const;
  const category = allowedCategories.includes(
    (categoryRaw || 'TEACHER') as (typeof allowedCategories)[number]
  )
    ? ((categoryRaw || 'TEACHER') as (typeof allowedCategories)[number])
    : 'TEACHER';

  const photoEntry = formData.get('photo');
  const photoFile = photoEntry instanceof File ? photoEntry : null;
  const photoPath = await uploadTeacherPhotoIfPresent(photoFile);

  const { error } = await supabaseAdmin.from('teachers').insert([
    {
      name,
      name_uk: nameUk,
      title,
      title_uk: titleUk,
      phone,
      email,
      description,
      description_uk: descriptionUk,
      category,
      ...(photoPath && { photo: photoPath })
    }
  ]);

  if (error) {
    throw new Error(`Failed to create teacher: ${error.message}`);
  }

  revalidatePath('/admin/teachers');
  return { success: true };
}

export async function updateTeacher(id: string, formData: FormData) {
  await verifyAdminAccess();

  const name = normalizeText(formData.get('name'));
  const nameUk = normalizeText(formData.get('name_uk'));
  const title = normalizeText(formData.get('title'));
  const titleUk = normalizeText(formData.get('title_uk'));
  const phone = normalizeText(formData.get('phone'));
  const email = normalizeText(formData.get('email'));
  const description = normalizeText(formData.get('description'));
  const descriptionUk = normalizeText(formData.get('description_uk'));
  const categoryRaw = normalizeText(formData.get('category'));

  if (!name) {
    throw new Error('Name is required');
  }

  const allowedCategories = ['HEADTEACHER', 'TEACHER', 'STAF'] as const;
  const category = allowedCategories.includes(
    (categoryRaw || 'TEACHER') as (typeof allowedCategories)[number]
  )
    ? ((categoryRaw || 'TEACHER') as (typeof allowedCategories)[number])
    : 'TEACHER';

  const removePhoto = formData.get('remove_photo') === '1';
  const photoEntry = formData.get('photo');
  const photoFile = photoEntry instanceof File ? photoEntry : null;
  const photoPath = await uploadTeacherPhotoIfPresent(photoFile);

  const updatePayload: Record<string, unknown> = {
    name,
    name_uk: nameUk,
    title,
    title_uk: titleUk,
    phone,
    email,
    description,
    description_uk: descriptionUk,
    category
  };
  if (removePhoto) {
    const { data: existing } = await supabaseAdmin
      .from('teachers')
      .select('photo')
      .eq('id', id)
      .single();
    if (existing?.photo) {
      await supabaseAdmin.storage
        .from('teachers-photos')
        .remove([existing.photo]);
    }
    updatePayload.photo = null;
  } else if (photoPath) {
    updatePayload.photo = photoPath;
  }

  const { error } = await supabaseAdmin
    .from('teachers')
    .update(updatePayload)
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update teacher: ${error.message}`);
  }

  revalidatePath('/admin/teachers');
  revalidatePath(`/admin/teachers/${id}/edit`);
  return { success: true };
}

export async function deleteTeacher(id: string) {
  await verifyAdminAccess();

  // Get existing teacher (for photo path)
  const { data: teacher, error: teacherError } = await supabaseAdmin
    .from('teachers')
    .select('id, photo')
    .eq('id', id)
    .single();

  if (teacherError) {
    throw new Error(`Failed to fetch teacher: ${teacherError.message}`);
  }

  // Delete photo from storage first to avoid orphan DB references.
  if (teacher?.photo) {
    const bucket = 'teachers-photos';
    const { error: removeError } = await supabaseAdmin.storage
      .from(bucket)
      .remove([teacher.photo]);

    if (removeError) {
      throw new Error(`Failed to delete teacher photo: ${removeError.message}`);
    }
  }

  const { error } = await supabaseAdmin.from('teachers').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete teacher: ${error.message}`);
  }

  revalidatePath('/admin/teachers');
  return { success: true };
}

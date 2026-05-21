'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminAccess } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import type { AdminEvent } from '@/types';
import { randomUUID } from 'crypto';
import { sanitizeFilename } from '@/utils/file-name';
import { normalizeText } from '@/utils/text';

const supabaseAdmin = createAdminClient();

async function uploadEventPhotoIfPresent(
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

  const bucket = 'events-photos';
  const originalName = photoFile.name || 'photo';
  const safeName = sanitizeFilename(originalName);
  const ext = safeName.includes('.') ? safeName.split('.').pop() : null;
  const base = ext ? safeName.slice(0, -(ext.length + 1)) : safeName;
  const filename = `${randomUUID()}-${base}${ext ? `.${ext}` : ''}`;
  const path = `events/${filename}`;

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

function normalizeTimeField(value: FormDataEntryValue | null): string | null {
  return normalizeText(value);
}

export async function listEvents(options?: {
  page?: number;
  limit?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<{ events: AdminEvent[]; total: number }> {
  await verifyAdminAccess();

  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const search = options?.search?.trim();
  const dateFrom = options?.dateFrom?.trim();
  const dateTo = options?.dateTo?.trim();

  let query = supabaseAdmin.from('events').select('*', { count: 'exact' });

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`
    );
  }

  if (dateFrom) {
    const fromStart = `${dateFrom}T00:00:00.000Z`;
    query = query.gte('date', fromStart);
  }
  if (dateTo) {
    const toEnd = `${dateTo}T23:59:59.999Z`;
    query = query.lte('date', toEnd);
  }

  query = query
    .order('date', { ascending: false })
    .order('start_time', { ascending: false });

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  return {
    events: (data as AdminEvent[]) || [],
    total: count || 0
  };
}

export async function getEventById(id: string): Promise<AdminEvent | null> {
  await verifyAdminAccess();

  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch event: ${error.message}`);
  }

  return data as AdminEvent;
}

export async function createEvent(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const title = formData.get('title');
    if (!title || typeof title !== 'string' || !title.trim()) {
      return { success: false, error: 'Title is required' };
    }

    const date = formData.get('date');
    if (!date || typeof date !== 'string') {
      return { success: false, error: 'Date is required' };
    }

    const description = normalizeText(formData.get('description'));
    const descriptionUk = normalizeText(formData.get('description_uk'));
    const location = normalizeText(formData.get('location'));
    const locationUk = normalizeText(formData.get('location_uk'));
    const titleUk = normalizeText(formData.get('title_uk'));
    const startTime = normalizeTimeField(formData.get('start_time'));
    const endTime = normalizeTimeField(formData.get('end_time'));

    // Parse date and combine with time if provided
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return { success: false, error: 'Invalid date format' };
    }

    const photoEntry = formData.get('photo');
    const photoFile = photoEntry instanceof File ? photoEntry : null;
    const photoPath = await uploadEventPhotoIfPresent(photoFile);

    const { error: insertError } = await supabaseAdmin.from('events').insert({
      title: title.trim(),
      title_uk: titleUk,
      description,
      description_uk: descriptionUk,
      date: dateObj.toISOString(),
      start_time: startTime || null,
      end_time: endTime || null,
      location: location || null,
      location_uk: locationUk,
      ...(photoPath && { photo: photoPath })
    });

    if (insertError) {
      return {
        success: false,
        error: `Failed to create event: ${insertError.message}`
      };
    }

    revalidatePath('/admin/events');
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
}

export async function updateEvent(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const title = formData.get('title');
    if (!title || typeof title !== 'string' || !title.trim()) {
      return { success: false, error: 'Title is required' };
    }

    const date = formData.get('date');
    if (!date || typeof date !== 'string') {
      return { success: false, error: 'Date is required' };
    }

    const description = normalizeText(formData.get('description'));
    const descriptionUk = normalizeText(formData.get('description_uk'));
    const location = normalizeText(formData.get('location'));
    const locationUk = normalizeText(formData.get('location_uk'));
    const titleUk = normalizeText(formData.get('title_uk'));
    const startTime = normalizeTimeField(formData.get('start_time'));
    const endTime = normalizeTimeField(formData.get('end_time'));

    // Parse date
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return { success: false, error: 'Invalid date format' };
    }

    const removePhoto = formData.get('remove_photo') === '1';
    const photoEntry = formData.get('photo');
    const photoFile = photoEntry instanceof File ? photoEntry : null;
    const photoPath = await uploadEventPhotoIfPresent(photoFile);

    const updatePayload: Record<string, unknown> = {
      title: title.trim(),
      title_uk: titleUk,
      description,
      description_uk: descriptionUk,
      date: dateObj.toISOString(),
      start_time: startTime || null,
      end_time: endTime || null,
      location: location || null,
      location_uk: locationUk
    };

    if (removePhoto || photoPath) {
      const { data: existing } = await supabaseAdmin
        .from('events')
        .select('photo')
        .eq('id', id)
        .single();
      const previousPhoto = existing?.photo ?? null;

      if (removePhoto) {
        if (previousPhoto) {
          await supabaseAdmin.storage.from('events-photos').remove([previousPhoto]);
        }
        updatePayload.photo = null;
      } else if (photoPath) {
        if (previousPhoto && previousPhoto !== photoPath) {
          await supabaseAdmin.storage.from('events-photos').remove([previousPhoto]);
        }
        updatePayload.photo = photoPath;
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from('events')
      .update(updatePayload)
      .eq('id', id);

    if (updateError) {
      return {
        success: false,
        error: `Failed to update event: ${updateError.message}`
      };
    }

    revalidatePath('/admin/events');
    revalidatePath(`/admin/events/${id}`);
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
}

export async function deleteEvent(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const { data: item, error: fetchError } = await supabaseAdmin
      .from('events')
      .select('photo')
      .eq('id', id)
      .single();

    if (!fetchError && item?.photo) {
      await supabaseAdmin.storage.from('events-photos').remove([item.photo]);
    }

    const { error: deleteError } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return {
        success: false,
        error: `Failed to delete event: ${deleteError.message}`
      };
    }

    revalidatePath('/admin/events');
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
}

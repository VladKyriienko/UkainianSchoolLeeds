'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { verifyAdminAccess } from '@/utils/auth-helpers/server';
import { revalidatePath } from 'next/cache';
import type { Tables } from '@/utils/supabase/types';

const supabaseAdmin = createAdminClient();

export type AdminEvent = Tables<'events'>;

function normalizeTextField(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeTimeField(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function listEvents(options?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ events: AdminEvent[]; total: number }> {
  await verifyAdminAccess();

  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const search = options?.search?.trim();

  let query = supabaseAdmin
    .from('events')
    .select('*', { count: 'exact' });

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`
    );
  }

  query = query.order('date', { ascending: true }).order('start_time', { ascending: true });

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

export async function createEvent(formData: FormData): Promise<{ success: boolean; error?: string }> {
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

    const description = normalizeTextField(formData.get('description'));
    const descriptionUk = normalizeTextField(formData.get('description_uk'));
    const location = normalizeTextField(formData.get('location'));
    const locationUk = normalizeTextField(formData.get('location_uk'));
    const titleUk = normalizeTextField(formData.get('title_uk'));
    const startTime = normalizeTimeField(formData.get('start_time'));
    const endTime = normalizeTimeField(formData.get('end_time'));

    // Parse date and combine with time if provided
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return { success: false, error: 'Invalid date format' };
    }

    const { error: insertError } = await supabaseAdmin.from('events').insert({
      title: title.trim(),
      title_uk: titleUk,
      description,
      description_uk: descriptionUk,
      date: dateObj.toISOString(),
      start_time: startTime || null,
      end_time: endTime || null,
      location: location || null,
      location_uk: locationUk
    });

    if (insertError) {
      return { success: false, error: `Failed to create event: ${insertError.message}` };
    }

    revalidatePath('/admin/events');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
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

    const description = normalizeTextField(formData.get('description'));
    const descriptionUk = normalizeTextField(formData.get('description_uk'));
    const location = normalizeTextField(formData.get('location'));
    const locationUk = normalizeTextField(formData.get('location_uk'));
    const titleUk = normalizeTextField(formData.get('title_uk'));
    const startTime = normalizeTimeField(formData.get('start_time'));
    const endTime = normalizeTimeField(formData.get('end_time'));

    // Parse date
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return { success: false, error: 'Invalid date format' };
    }

    const { error: updateError } = await supabaseAdmin
      .from('events')
      .update({
        title: title.trim(),
        title_uk: titleUk,
        description,
        description_uk: descriptionUk,
        date: dateObj.toISOString(),
        start_time: startTime || null,
        end_time: endTime || null,
        location: location || null,
        location_uk: locationUk
      })
      .eq('id', id);

    if (updateError) {
      return { success: false, error: `Failed to update event: ${updateError.message}` };
    }

    revalidatePath('/admin/events');
    revalidatePath(`/admin/events/${id}`);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
}

export async function deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const { error: deleteError } = await supabaseAdmin.from('events').delete().eq('id', id);

    if (deleteError) {
      return { success: false, error: `Failed to delete event: ${deleteError.message}` };
    }

    revalidatePath('/admin/events');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
}

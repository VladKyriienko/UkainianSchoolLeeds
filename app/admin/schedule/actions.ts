'use server';

import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/utils/supabase/admin';
import { verifyAdminAccess } from '@/utils/auth-helpers/server';

const supabaseAdmin = createAdminClient();
const SCHEDULE_BUCKET = 'schedule-files';

export type AdminSchedule = {
  id: string;
  date: string;
  file: string;
  created_at: string;
  publicUrl: string;
};

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isSaturdayDateString(value: string): boolean {
  const d = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return false;
  return d.getUTCDay() === 6;
}

export async function listSchedule(options?: {
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}): Promise<{ schedule: AdminSchedule[]; total: number }> {
  await verifyAdminAccess();

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  const dateFrom = options?.dateFrom?.trim();
  const dateTo = options?.dateTo?.trim();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin
    .from('schedule')
    .select('*', { count: 'exact' });

  if (dateFrom) {
    query = query.gte('date', `${dateFrom}T00:00:00.000Z`);
  }
  if (dateTo) {
    query = query.lte('date', `${dateTo}T23:59:59.999Z`);
  }

  const { data, error, count } = await query
    .order('date', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch schedule: ${error.message}`);
  }

  const schedule = (data ?? []).map((item) => ({
    id: item.id as string,
    date: item.date as string,
    file: item.file as string,
    created_at: item.created_at as string,
    publicUrl: supabaseAdmin.storage
      .from(SCHEDULE_BUCKET)
      .getPublicUrl(item.file as string).data.publicUrl
  }));

  return {
    schedule,
    total: count ?? 0
  };
}

export async function createSchedule(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const dateRaw = formData.get('date');
    const fileEntry = formData.get('file');
    const file = fileEntry instanceof File ? fileEntry : null;

    if (!dateRaw || typeof dateRaw !== 'string' || !dateRaw.trim()) {
      return { success: false, error: 'Date is required' };
    }
    if (!isSaturdayDateString(dateRaw.trim())) {
      return { success: false, error: 'Schedule date must be Saturday' };
    }
    if (!file || file.size === 0) {
      return { success: false, error: 'PDF file is required' };
    }
    if (file.type !== 'application/pdf') {
      return { success: false, error: 'Only PDF files are allowed' };
    }
    const maxBytes = 20 * 1024 * 1024;
    if (file.size > maxBytes) {
      return { success: false, error: 'PDF is too large (max 20MB)' };
    }

    const safeName = sanitizeFilename(file.name || 'schedule.pdf');
    const ext = safeName.endsWith('.pdf') ? '.pdf' : '';
    const base = ext ? safeName.slice(0, -4) : safeName;
    const storagePath = `schedule/${randomUUID()}-${base}.pdf`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(SCHEDULE_BUCKET)
      .upload(storagePath, file, {
        contentType: 'application/pdf',
        upsert: true
      });
    if (uploadError) {
      return {
        success: false,
        error: `Failed to upload PDF: ${uploadError.message}`
      };
    }

    const dateIso = `${dateRaw.trim()}T12:00:00.000Z`;
    const { error: insertError } = await supabaseAdmin.from('schedule').insert({
      date: dateIso,
      file: storagePath
    });
    if (insertError) {
      await supabaseAdmin.storage.from(SCHEDULE_BUCKET).remove([storagePath]);
      return {
        success: false,
        error: `Failed to save schedule: ${insertError.message}`
      };
    }

    revalidatePath('/admin/schedule');
    revalidatePath('/admin/schedule/create');
    revalidatePath('/parents/calendar');
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

export async function deleteSchedule(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const { data: existing } = await supabaseAdmin
      .from('schedule')
      .select('file')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin.from('schedule').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }

    if (existing?.file) {
      await supabaseAdmin.storage.from(SCHEDULE_BUCKET).remove([existing.file]);
    }

    revalidatePath('/admin/schedule');
    revalidatePath('/parents/calendar');
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

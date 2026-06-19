'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminAccess } from '@/lib/auth/server';
import type { AdminReview } from '@/types';
import { REVIEW_COLUMNS } from '@/lib/supabase/columns';

const supabaseAdmin = createAdminClient();

export async function listReviews(options?: {
  page?: number;
  limit?: number;
  /** Filter by `perens` (parent attribution), ilike */
  parents?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<{ reviews: AdminReview[]; total: number }> {
  await verifyAdminAccess();

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  const parents = options?.parents?.trim();
  const dateFrom = options?.dateFrom?.trim();
  const dateTo = options?.dateTo?.trim();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin.from('review').select(REVIEW_COLUMNS, { count: 'exact' });

  if (parents) {
    const safe = parents.replace(/,/g, ' ');
    const pattern = `%${safe}%`;
    query = query.or(`perens.ilike.${pattern},perens_uk.ilike.${pattern}`);
  }
  if (dateFrom) {
    query = query.gte('data', `${dateFrom}T00:00:00.000Z`);
  }
  if (dateTo) {
    query = query.lte('data', `${dateTo}T23:59:59.999Z`);
  }

  const { data, error, count } = await query
    .order('data', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch reviews: ${error.message}`);
  }

  return {
    reviews: (data as AdminReview[]) ?? [],
    total: count ?? 0
  };
}

export async function getReviewById(id: string): Promise<AdminReview | null> {
  await verifyAdminAccess();

  const { data, error } = await supabaseAdmin
    .from('review')
    .select(REVIEW_COLUMNS)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch review: ${error.message}`);
  }

  return data as AdminReview;
}

export async function createReview(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const perens = formData.get('perens');
    if (!perens || typeof perens !== 'string' || !perens.trim()) {
      return { success: false, error: 'Parents / attribution is required' };
    }

    const content = formData.get('content');
    if (!content || typeof content !== 'string' || !content.trim()) {
      return { success: false, error: 'Content is required' };
    }

    const dataRaw = formData.get('data');
    const dataStr =
      dataRaw && typeof dataRaw === 'string' && dataRaw.trim()
        ? `${dataRaw.trim()}T12:00:00.000Z`
        : new Date().toISOString();

    const perensUkRaw = formData.get('perens_uk');
    const perensUk =
      perensUkRaw && typeof perensUkRaw === 'string' && perensUkRaw.trim()
        ? perensUkRaw.trim()
        : null;

    const contentUkRaw = formData.get('content_uk');
    const contentUk =
      contentUkRaw && typeof contentUkRaw === 'string' && contentUkRaw.trim()
        ? contentUkRaw.trim()
        : null;

    const { error: insertError } = await supabaseAdmin.from('review').insert({
      perens: perens.trim(),
      perens_uk: perensUk,
      content: content.trim(),
      content_uk: contentUk,
      data: dataStr
    });

    if (insertError) {
      return { success: false, error: `Failed to create review: ${insertError.message}` };
    }

    revalidatePath('/admin/reviews');
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

export async function updateReview(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const perens = formData.get('perens');
    if (!perens || typeof perens !== 'string' || !perens.trim()) {
      return { success: false, error: 'Parents / attribution is required' };
    }

    const content = formData.get('content');
    if (!content || typeof content !== 'string' || !content.trim()) {
      return { success: false, error: 'Content is required' };
    }

    const dataRaw = formData.get('data');
    const dataStr =
      dataRaw && typeof dataRaw === 'string' && dataRaw.trim()
        ? `${dataRaw.trim()}T12:00:00.000Z`
        : new Date().toISOString();

    const perensUkRaw = formData.get('perens_uk');
    const perensUk =
      perensUkRaw && typeof perensUkRaw === 'string' && perensUkRaw.trim()
        ? perensUkRaw.trim()
        : null;

    const contentUkRaw = formData.get('content_uk');
    const contentUk =
      contentUkRaw && typeof contentUkRaw === 'string' && contentUkRaw.trim()
        ? contentUkRaw.trim()
        : null;

    const { error: updateError } = await supabaseAdmin
      .from('review')
      .update({
        perens: perens.trim(),
        perens_uk: perensUk,
        content: content.trim(),
        content_uk: contentUk,
        data: dataStr
      })
      .eq('id', id);

    if (updateError) {
      return { success: false, error: `Failed to update review: ${updateError.message}` };
    }

    revalidatePath('/admin/reviews');
    revalidatePath(`/admin/reviews/${id}`);
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

export async function deleteReview(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const { error } = await supabaseAdmin.from('review').delete().eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/reviews');
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

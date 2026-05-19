'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminAccess } from '@/lib/auth/server';
import type { Tables } from '@/lib/supabase/types';
import {
  DOCUMENT_TYPES,
  type DocumentType
} from '@/app/admin/documents/constants';
import { normalizeText } from '@/utils/text';

const supabaseAdmin = createAdminClient();

export type AdminDocument = Tables<'documents'>;

export async function listDocuments(options?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}): Promise<{ documents: AdminDocument[]; total: number }> {
  await verifyAdminAccess();

  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const search = options?.search?.trim();
  const typeFilter = options?.type?.trim();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin.from('documents').select('*', { count: 'exact' });

  if (search) {
    const safe = search.replace(/,/g, ' ');
    query = query.or(`title.ilike.%${safe}%,title_uk.ilike.%${safe}%`);
  }
  if (typeFilter && DOCUMENT_TYPES.includes(typeFilter as DocumentType)) {
    query = query.eq('type', typeFilter as DocumentType);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch documents: ${error.message}`);
  }

  return {
    documents: (data as AdminDocument[]) || [],
    total: count || 0
  };
}

export async function getDocumentById(
  id: string
): Promise<AdminDocument | null> {
  await verifyAdminAccess();

  const { data, error } = await supabaseAdmin
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch document: ${error.message}`);
  }

  return data as AdminDocument;
}

export async function createDocument(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const title = formData.get('title');
    if (!title || typeof title !== 'string' || !title.trim()) {
      return { success: false, error: 'Title is required' };
    }

    const content = formData.get('content');
    if (!content || typeof content !== 'string' || !content.trim()) {
      return { success: false, error: 'Content is required' };
    }

    const typeRaw = formData.get('type');
    if (
      !typeRaw ||
      typeof typeRaw !== 'string' ||
      !DOCUMENT_TYPES.includes(typeRaw as DocumentType)
    ) {
      return { success: false, error: 'Valid document type is required' };
    }

    const titleUk = normalizeText(formData.get('title_uk'));
    const contentUk = normalizeText(formData.get('content_uk'));

    const { error: insertError } = await supabaseAdmin
      .from('documents')
      .insert({
        title: title.trim(),
        title_uk: titleUk,
        content: content.trim(),
        content_uk: contentUk,
        type: typeRaw as DocumentType
      });

    if (insertError) {
      return {
        success: false,
        error: `Failed to create document: ${insertError.message}`
      };
    }

    revalidatePath('/admin/documents');
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

export async function updateDocument(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const title = formData.get('title');
    if (!title || typeof title !== 'string' || !title.trim()) {
      return { success: false, error: 'Title is required' };
    }

    const content = formData.get('content');
    if (!content || typeof content !== 'string' || !content.trim()) {
      return { success: false, error: 'Content is required' };
    }

    const typeRaw = formData.get('type');
    if (
      !typeRaw ||
      typeof typeRaw !== 'string' ||
      !DOCUMENT_TYPES.includes(typeRaw as DocumentType)
    ) {
      return { success: false, error: 'Valid document type is required' };
    }

    const titleUk = normalizeText(formData.get('title_uk'));
    const contentUk = normalizeText(formData.get('content_uk'));

    const { error: updateError } = await supabaseAdmin
      .from('documents')
      .update({
        title: title.trim(),
        title_uk: titleUk,
        content: content.trim(),
        content_uk: contentUk,
        type: typeRaw as DocumentType
      })
      .eq('id', id);

    if (updateError) {
      return {
        success: false,
        error: `Failed to update document: ${updateError.message}`
      };
    }

    revalidatePath('/admin/documents');
    revalidatePath(`/admin/documents/${id}`);
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

export async function deleteDocument(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAccess();

    const { error } = await supabaseAdmin
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/documents');
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

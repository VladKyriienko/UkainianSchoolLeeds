'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { createAdminClient } from '@/utils/supabase/admin';
import { createDocumentSlug } from '@/utils/document-slug';

export type PublicKeyInfoDocument = {
  id: string;
  title: string;
  title_uk: string | null;
  content: string;
  content_uk: string | null;
  created_at: string;
};

export type PublicKeyInfoDocumentSummary = Pick<
  PublicKeyInfoDocument,
  'id' | 'title' | 'title_uk' | 'created_at'
> & {
  slug: string;
};

export async function listKeyInfoDocuments(): Promise<PublicKeyInfoDocumentSummary[]> {
  noStore();

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('documents')
      .select('id, title, title_uk, created_at')
      .eq('type', 'DOCUMEND')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return (data as unknown as Omit<PublicKeyInfoDocumentSummary, 'slug'>[]).map(
      (document) => ({
        ...document,
        slug: createDocumentSlug({
          id: document.id,
          title: document.title
        })
      })
    );
  } catch (err) {
    console.error('Error fetching key info documents:', err);
    return [];
  }
}

export async function getKeyInfoDocumentById(
  id: string
): Promise<PublicKeyInfoDocument | null> {
  noStore();

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('documents')
      .select('id, title, title_uk, content, content_uk, created_at')
      .eq('type', 'DOCUMEND')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;

    return data as unknown as PublicKeyInfoDocument;
  } catch (err) {
    console.error(`Error fetching key info document "${id}":`, err);
    return null;
  }
}

export async function getKeyInfoDocumentBySlug(
  slug: string
): Promise<PublicKeyInfoDocument | null> {
  noStore();

  const documents = await listKeyInfoDocuments();
  const matchedDocument = documents.find((document) => document.slug === slug);

  if (!matchedDocument) return null;

  return getKeyInfoDocumentById(matchedDocument.id);
}

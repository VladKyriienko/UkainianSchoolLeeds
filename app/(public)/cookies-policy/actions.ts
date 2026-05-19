'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';

export type PublicCookiesPolicyDocument = {
  id: string;
  title: string;
  title_uk: string | null;
  content: string;
  content_uk: string | null;
  created_at: string;
};

export async function getLatestCookiesPolicyDocument(): Promise<PublicCookiesPolicyDocument | null> {
  noStore();

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('documents')
      .select('id, title, title_uk, content, content_uk, created_at')
      .eq('type', 'COOKIES_POLICY')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data as unknown as PublicCookiesPolicyDocument;
  } catch (err) {
    console.error('Error fetching cookies policy document:', err);
    return null;
  }
}

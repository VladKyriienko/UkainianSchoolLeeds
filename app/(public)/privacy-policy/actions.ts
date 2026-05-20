'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import type { PublicPrivacyPolicyDocument } from '@/types';

export async function getLatestPrivacyPolicyDocument(): Promise<PublicPrivacyPolicyDocument | null> {
  noStore();

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('documents')
      .select('id, title, title_uk, content, content_uk, created_at')
      .eq('type', 'PRIVACY_POLICY')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data as unknown as PublicPrivacyPolicyDocument;
  } catch (err) {
    console.error('Error fetching privacy policy document:', err);
    return null;
  }
}

'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import type { Tables } from '@/lib/supabase/types';
import type { PublicNews } from '@/types';

function withPhotoUrl(supabase: ReturnType<typeof createAdminClient>, item: Tables<'news'>): PublicNews {
  const photoUrl = item.photo
    ? supabase.storage.from('news-photos').getPublicUrl(item.photo).data.publicUrl
    : null;
  return { ...item, photoUrl };
}

export async function getNews(limit?: number): Promise<PublicNews[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from('news')
    .select('*')
    .order('order', { ascending: true })
    .order('created_at', { ascending: false });

  if (limit !== undefined) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }
  return ((data as Tables<'news'>[]) ?? []).map((item) => withPhotoUrl(supabase, item));
}

export async function getNewsById(id: string): Promise<PublicNews | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return withPhotoUrl(supabase, data as Tables<'news'>);
}

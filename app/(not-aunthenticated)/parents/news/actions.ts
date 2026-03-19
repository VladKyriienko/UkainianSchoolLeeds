'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import type { Tables } from '@/utils/supabase/types';

export type PublicNews = Tables<'news'> & {
  photoUrl: string | null;
};

function withPhotoUrl(supabase: ReturnType<typeof createAdminClient>, item: Tables<'news'>): PublicNews {
  const photoUrl = item.photo
    ? supabase.storage.from('news-photos').getPublicUrl(item.photo).data.publicUrl
    : null;
  return { ...item, photoUrl };
}

export async function getNews(): Promise<PublicNews[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('order', { ascending: true })
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

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

'use server';

import type { Tables } from '@/lib/supabase/types';
import { NEWS_LIST_COLUMNS, NEWS_COLUMNS } from '@/lib/supabase/columns';
import { getPublicStorageUrl } from '@/lib/supabase/public-storage-url';
import { createAdminClient } from '@/lib/supabase/admin';
import type { PublicNews } from '@/types';

const NEWS_PHOTOS_BUCKET = 'news-photos';

function withPhotoUrl(item: Tables<'news'>): PublicNews {
  const photoUrl = item.photo
    ? getPublicStorageUrl(NEWS_PHOTOS_BUCKET, item.photo)
    : null;
  return { ...item, photoUrl };
}

export async function getNews(limit?: number): Promise<PublicNews[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from('news')
    .select(NEWS_LIST_COLUMNS)
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
  return ((data as Tables<'news'>[]) ?? []).map(withPhotoUrl);
}

export async function getNewsById(id: string): Promise<PublicNews | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('news')
    .select(NEWS_COLUMNS)
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return withPhotoUrl(data as Tables<'news'>);
}

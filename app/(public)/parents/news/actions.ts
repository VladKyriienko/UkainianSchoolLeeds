'use server';

import { unstable_cache } from 'next/cache';
import type { Tables } from '@/lib/supabase/types';
import { NEWS_LIST_COLUMNS, NEWS_COLUMNS } from '@/lib/supabase/columns';
import { getPublicStorageUrl } from '@/lib/supabase/public-storage-url';
import { createAdminClient } from '@/lib/supabase/admin';
import type { PublicNews } from '@/types';

const NEWS_PHOTOS_BUCKET = 'news-photos';
const PUBLIC_NEWS_REVALIDATE_SECONDS = 300;

function withPhotoUrl(item: Tables<'news'>): PublicNews {
  const photoUrl = item.photo
    ? getPublicStorageUrl(NEWS_PHOTOS_BUCKET, item.photo)
    : null;
  return { ...item, photoUrl };
}

async function fetchNews(limit?: number): Promise<PublicNews[]> {
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

function getNewsCached(limit: number) {
  return unstable_cache(
    () => fetchNews(limit),
    ['public-news', String(limit)],
    {
      revalidate: PUBLIC_NEWS_REVALIDATE_SECONDS,
      tags: ['news', 'public-home']
    }
  )();
}

export async function getNews(limit?: number): Promise<PublicNews[]> {
  if (limit !== undefined) {
    return getNewsCached(limit);
  }
  return fetchNews();
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

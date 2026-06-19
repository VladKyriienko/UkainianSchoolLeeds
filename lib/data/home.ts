import { unstable_cache } from 'next/cache';
import { createPublicClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/types';
import { getPublicStorageUrl } from '@/lib/supabase/public-storage-url';
import type {
  PublicParentVoiceReview,
  SchoolAtmosphereGalleryImage
} from '@/types';

const SCHOOL_ATMOSPHERE_GALLERY_LIMIT = 4;
const PARENT_VOICES_PUBLIC_LIMIT = 40;
const GALLERY_PHOTOS_BUCKET = 'gallery-photos';

/** Revalidate public home data every 5 minutes; bust via revalidateTag('public-home'). */
const PUBLIC_HOME_REVALIDATE_SECONDS = 300;

type GalleryRow = {
  id: string;
  photo: string;
};

type ParentVoiceRow = Pick<
  Tables<'review'>,
  'id' | 'content' | 'content_uk' | 'perens' | 'perens_uk'
>;

function galleryPublicSrc(photoStored: string): string | null {
  const raw = photoStored.trim();
  if (!raw) return null;
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;

  const pathInBucket = raw.replace(/^\/?gallery-photos\/?/, '');
  return getPublicStorageUrl(GALLERY_PHOTOS_BUCKET, pathInBucket);
}

async function fetchPublicGalleryImages(
  limit?: number
): Promise<SchoolAtmosphereGalleryImage[]> {
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from('gallery')
      .select('id, photo')
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });

    if (limit !== undefined) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('getPublicGalleryImages:', error.message, error);
      return [];
    }

    return ((data ?? []) as GalleryRow[]).flatMap((row) => {
      const src = galleryPublicSrc(row.photo);
      if (!src) return [];
      const item: SchoolAtmosphereGalleryImage = {
        id: row.id,
        src,
        altEn: 'Photo from the school gallery',
        altUk: 'Фото з галереї школи'
      };
      return [item];
    });
  } catch (e) {
    console.error('getPublicGalleryImages:', e);
    return [];
  }
}

async function fetchPublicParentVoices(
  limit: number
): Promise<PublicParentVoiceReview[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('review')
      .select('id, content, content_uk, perens, perens_uk')
      .order('data', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('getPublicParentVoices:', error.message, error);
      return [];
    }

    const seen = new Set<string>();
    return ((data ?? []) as ParentVoiceRow[])
      .filter((row) => row.content?.trim() && row.perens?.trim())
      .filter((row) => {
        if (seen.has(row.id)) return false;
        seen.add(row.id);
        return true;
      });
  } catch (e) {
    console.error('getPublicParentVoices:', e);
    return [];
  }
}

const getPublicGalleryImagesCached = (limit?: number) =>
  unstable_cache(
    () => fetchPublicGalleryImages(limit),
    ['public-gallery-images', limit === undefined ? 'all' : String(limit)],
    {
      revalidate: PUBLIC_HOME_REVALIDATE_SECONDS,
      tags: ['public-home', 'gallery']
    }
  )();

const getPublicParentVoicesCached = (limit: number) =>
  unstable_cache(
    () => fetchPublicParentVoices(limit),
    ['public-parent-voices', String(limit)],
    {
      revalidate: PUBLIC_HOME_REVALIDATE_SECONDS,
      tags: ['public-home', 'review']
    }
  )();

export async function getPublicGalleryImages(
  limit?: number
): Promise<SchoolAtmosphereGalleryImage[]> {
  return getPublicGalleryImagesCached(limit);
}

export async function getSchoolAtmosphereGalleryImages(
  limit = SCHOOL_ATMOSPHERE_GALLERY_LIMIT
): Promise<SchoolAtmosphereGalleryImage[]> {
  return getPublicGalleryImagesCached(limit);
}

export async function getPublicParentVoices(
  limit = PARENT_VOICES_PUBLIC_LIMIT
): Promise<PublicParentVoiceReview[]> {
  return getPublicParentVoicesCached(limit);
}

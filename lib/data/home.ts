import { createPublicClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables } from '@/lib/supabase/types';
import type {
  PublicParentVoiceReview,
  SchoolAtmosphereGalleryImage
} from '@/types';

const SCHOOL_ATMOSPHERE_GALLERY_LIMIT = 4;

type GalleryRow = {
  id: string;
  photo: string;
};

const GALLERY_PHOTOS_BUCKET = 'gallery-photos';

function schoolGalleryPublicSrc(
  supabase: SupabaseClient<Database>,
  photoStored: string
): string | null {
  const raw = photoStored.trim();
  if (!raw) return null;
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;

  const pathInBucket = raw.replace(/^\/?gallery-photos\/?/, '');

  const { data } = supabase.storage
    .from(GALLERY_PHOTOS_BUCKET)
    .getPublicUrl(pathInBucket);
  return data.publicUrl || null;
}

/**
 * Public gallery photos from `gallery` (RLS: anon SELECT).
 * Order matches admin: higher `order` first, then newest.
 */
export async function getPublicGalleryImages(
  limit?: number
): Promise<SchoolAtmosphereGalleryImage[]> {
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from('gallery')
      .select('id, photo')
      .order('order', { ascending: false })
      .order('created_at', { ascending: false });

    if (limit !== undefined) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('getPublicGalleryImages:', error.message, error);
      return [];
    }

    const rows = (data ?? []) as GalleryRow[];
    const out: SchoolAtmosphereGalleryImage[] = [];

    for (const row of rows) {
      const src = schoolGalleryPublicSrc(supabase, row.photo);
      if (!src) continue;

      out.push({
        id: row.id,
        src,
        altEn: 'Photo from the school gallery',
        altUk: 'Фото з галереї школи'
      });
    }

    return out;
  } catch (e) {
    console.error('getPublicGalleryImages:', e);
    return [];
  }
}

/** Home “school atmosphere” strip — first N gallery photos. */
export async function getSchoolAtmosphereGalleryImages(
  limit = SCHOOL_ATMOSPHERE_GALLERY_LIMIT
): Promise<SchoolAtmosphereGalleryImage[]> {
  return getPublicGalleryImages(limit);
}

const PARENT_VOICES_PUBLIC_LIMIT = 40;

type ParentVoiceRow = Pick<
  Tables<'review'>,
  'id' | 'content' | 'content_uk' | 'perens' | 'perens_uk'
>;

/**
 * Public home — parent testimonials from `review` (RLS: anon SELECT).
 * Newest first by `data`.
 */
export async function getPublicParentVoices(
  limit = PARENT_VOICES_PUBLIC_LIMIT
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

    return ((data ?? []) as ParentVoiceRow[]).filter(
      (row) => row.content?.trim() && row.perens?.trim()
    );
  } catch (e) {
    console.error('getPublicParentVoices:', e);
    return [];
  }
}

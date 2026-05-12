import { createClient } from '@/utils/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables } from '@/utils/supabase/types';
import type { PublicParentVoiceReview, SchoolAtmosphereGalleryImage } from '@/types';

const SCHOOL_ATMOSPHERE_GALLERY_LIMIT = 24;

type GalleryRow = {
  id: string;
  photo: string;
};

function galleryPublicSrc(
  supabase: SupabaseClient<Database>,
  photoStored: string
): string | null {
  const raw = photoStored.trim();
  if (!raw) return null;
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;

  /** Some rows may store `class-gallery/...` though the bucket is already `class-gallery`. */
  const pathInBucket = raw.replace(/^\/?class-gallery\/?/, '');

  const { data } = supabase.storage.from('class-gallery').getPublicUrl(pathInBucket);
  return data.publicUrl || null;
}

/**
 * Public home — “school atmosphere” strip: rows from `class_photo_galery` (RLS: anon SELECT).
 * Order matches admin gallery: higher `order` first, then newest.
 */
export async function getSchoolAtmosphereGalleryImages(
  limit = SCHOOL_ATMOSPHERE_GALLERY_LIMIT
): Promise<SchoolAtmosphereGalleryImage[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('class_photo_galery')
      .select('id, photo')
      .order('order', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('getSchoolAtmosphereGalleryImages:', error.message, error);
      return [];
    }

    const rows = (data ?? []) as GalleryRow[];
    const out: SchoolAtmosphereGalleryImage[] = [];

    for (const row of rows) {
      const src = galleryPublicSrc(supabase, row.photo);
      if (!src) continue;

      out.push({
        id: row.id,
        src,
        altEn: 'Photo from the school class gallery',
        altUk: 'Фото з класової галереї школи'
      });
    }

    return out;
  } catch (e) {
    console.error('getSchoolAtmosphereGalleryImages:', e);
    return [];
  }
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
    const supabase = createClient();
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

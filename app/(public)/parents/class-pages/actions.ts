'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createPublicClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/types';
import type { PublicClass, PublicClassGalleryImage } from '@/types';
import { createDocumentSlug } from '@/utils/document-slug';

const CLASS_GALLERY_BUCKET = 'class-gallery';

function withPhotoUrl(
  supabase: ReturnType<typeof createAdminClient>,
  item: Tables<'classes'>
): PublicClass {
  const photoUrl = item.photo
    ? supabase.storage.from('classes-photos').getPublicUrl(item.photo).data
        .publicUrl
    : null;
  return { ...item, photoUrl };
}

export async function getClasses(): Promise<PublicClass[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching classes:', error);
    return [];
  }
  return ((data as Tables<'classes'>[]) ?? []).map((item) =>
    withPhotoUrl(supabase, item)
  );
}

export async function getClassById(id: string): Promise<PublicClass | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return withPhotoUrl(supabase, data as Tables<'classes'>);
}

const UUID_SLUG_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getClassBySlug(slug: string): Promise<PublicClass | null> {
  if (UUID_SLUG_RE.test(slug)) {
    return getClassById(slug);
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.from('classes').select('id, title');

  if (error) {
    console.error('Error resolving class slug:', error);
    return null;
  }

  const match = (data ?? []).find(
    (row) => createDocumentSlug({ id: row.id, title: row.title }) === slug
  );
  if (!match) return null;

  return getClassById(match.id);
}

export async function getPublicClassGalleryPhotos(
  classId: string
): Promise<PublicClassGalleryImage[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('class_photo_galery')
      .select('id, photo')
      .eq('class_id', classId)
      .order('order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('getPublicClassGalleryPhotos:', error.message, error);
      return [];
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      src: supabase.storage
        .from(CLASS_GALLERY_BUCKET)
        .getPublicUrl(row.photo).data.publicUrl
    }));
  } catch (e) {
    console.error('getPublicClassGalleryPhotos:', e);
    return [];
  }
}

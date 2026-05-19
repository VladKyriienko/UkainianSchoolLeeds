import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/common/PageWrapper';
import { GalleryForm } from '@/components/features/admin/GalleryForm';
import { getSchoolGalleryItemById } from '@/app/admin/gallery/actions';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function GalleryEditPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let item = null;
  try {
    item = await getSchoolGalleryItemById(id);
  } catch {
    // fallthrough
  }

  if (!item) notFound();

  const supabaseAdmin = createAdminClient();
  const currentPhotoUrl = supabaseAdmin.storage
    .from('gallery-photos')
    .getPublicUrl(item.photo).data.publicUrl;

  return (
    <PageWrapper
      title="Edit gallery photo"
      description="Update photo or display order."
    >
      <GalleryForm mode="edit" item={item} currentPhotoUrl={currentPhotoUrl} />
    </PageWrapper>
  );
}

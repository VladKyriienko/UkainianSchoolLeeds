import { notFound } from 'next/navigation';
import { createAdminClient } from '@/utils/supabase/admin';
import { PageWrapper } from '@/components/common/PageWrapper';
import { ClassGalleryForm } from '@/app/admin/components/ClassGalleryForm';
import { getGalleryItemById } from '@/app/admin/class-gallery/actions';
import { listClasses } from '@/app/admin/classes/actions';

export default async function EditClassGalleryPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let item = null;
  try {
    item = await getGalleryItemById(id);
  } catch {
    // fallthrough
  }

  if (!item) notFound();

  const { classes } = await listClasses({ page: 1, limit: 500 });
  const supabaseAdmin = createAdminClient();
  const currentPhotoUrl = supabaseAdmin.storage
    .from('class-gallery')
    .getPublicUrl(item.photo).data.publicUrl;

  return (
    <PageWrapper title="Edit gallery photo" description="Change class or photo.">
      <ClassGalleryForm
        mode="edit"
        item={item}
        classes={classes}
        currentPhotoUrl={currentPhotoUrl}
      />
    </PageWrapper>
  );
}

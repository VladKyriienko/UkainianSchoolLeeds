import { notFound } from 'next/navigation';
import { createAdminClient } from '@/utils/supabase/admin';
import { PageWrapper } from '@/components/common/PageWrapper';
import { ClassGalleryForm } from '@/app/admin/components/ClassGalleryForm';
import { getGalleryItemById } from '@/app/admin/class-gallery/actions';

export default async function TeacherEditClassGalleryPage({
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

  const supabaseAdmin = createAdminClient();
  const currentPhotoUrl = supabaseAdmin.storage
    .from('class-gallery')
    .getPublicUrl(item.photo).data.publicUrl;

  return (
    <PageWrapper title="Edit gallery photo" description="Change class or photo.">
      <ClassGalleryForm
        mode="edit"
        item={item}
        classes={[]}
        fixedClassId={item.class_id}
        hideClassSelect={true}
        currentPhotoUrl={currentPhotoUrl}
        successRedirectPath="/teacher/class-gallery"
      />
    </PageWrapper>
  );
}

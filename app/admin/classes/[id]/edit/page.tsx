import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { PageWrapper } from '@/components/common/PageWrapper';
import { ClassForm } from '@/components/features/admin/ClassForm';
import { getClassById } from '@/app/admin/classes/actions';

export default async function EditClassPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let item = null;
  try {
    item = await getClassById(id);
  } catch {
    // fallthrough
  }

  if (!item) {
    notFound();
  }

  const supabaseAdmin = createAdminClient();
  const currentPhotoUrl = item.photo
    ? supabaseAdmin.storage.from('classes-photos').getPublicUrl(item.photo).data
        .publicUrl
    : null;

  return (
    <PageWrapper
      title="Edit class"
      description={`Editing: ${item.title}`}
    >
      <ClassForm
        mode="edit"
        classItem={item}
        currentPhotoUrl={currentPhotoUrl}
      />
    </PageWrapper>
  );
}

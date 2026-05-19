import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { TeacherForm } from '@/components/features/admin/TeacherForm';
import { getTeacherById } from '@/app/admin/teachers/actions';
import { PageWrapper } from '@/components/common/PageWrapper';

export default async function EditTeacherPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let teacher = null;
  try {
    teacher = await getTeacherById(id);
  } catch {
    // fallthrough to notFound below
  }

  if (!teacher) {
    notFound();
  }

  const supabaseAdmin = createAdminClient();
  const currentPhotoUrl = teacher.photo
    ? supabaseAdmin.storage.from('teachers-photos').getPublicUrl(teacher.photo).data.publicUrl
    : null;

  return (
    <PageWrapper
      title="Edit Teacher"
      description="Update teacher details"
    >
      <TeacherForm mode="edit" teacher={teacher} currentPhotoUrl={currentPhotoUrl} />
    </PageWrapper>
  );
}


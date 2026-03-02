import { notFound } from 'next/navigation';
import { TeacherForm } from '@/app/(authenticated)/admin/components/TeacherForm';
import { getTeacherById } from '@/app/(authenticated)/admin/teachers/actions';
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

  return (
    <PageWrapper
      title="Edit Teacher"
      description="Update teacher details"
    >
      <TeacherForm mode="edit" teacher={teacher} />
    </PageWrapper>
  );
}


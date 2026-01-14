
import { TeacherForm } from '@/app/(authenticated)/admin/components/TeacherForm';
import { PageWrapper } from '@/components/common/PageWrapper';

export default async function CreateTeacherPage() {
  return (
    <PageWrapper title="Add Teacher" description="Create a new teacher profile for the public site.">
      <TeacherForm mode="create" />
    </PageWrapper>
  );
}


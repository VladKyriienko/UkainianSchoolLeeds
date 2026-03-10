import { PageWrapper } from '@/components/common/PageWrapper';
import { ClassForm } from '@/app/admin/components/ClassForm';

export default async function CreateClassPage() {
  return (
    <PageWrapper
      title="Add class"
      description="Create a new class for the public site."
    >
      <ClassForm mode="create" />
    </PageWrapper>
  );
}

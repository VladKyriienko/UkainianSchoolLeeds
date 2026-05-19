import { PageWrapper } from '@/components/common/PageWrapper';
import { ClassForm } from '@/components/features/admin/ClassForm';

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

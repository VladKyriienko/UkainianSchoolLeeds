import { listClasses } from '@/app/admin/classes/actions';
import CreateUserForm from '@/components/features/admin/CreateUserForm';
import { BackButton } from '@/components/common/BackButton';
import { PageWrapper } from '@/components/common/PageWrapper';

export default async function CreateUserPage() {
  let classes: Awaited<ReturnType<typeof listClasses>>['classes'] = [];
  try {
    const classesResult = await listClasses({ page: 1, limit: 500 });
    classes = classesResult.classes;
  } catch (error) {
    console.error('Error fetching classes:', error);
  }

  return (
    <PageWrapper
      title="Create New User"
      description="Add a new user to the system."
      goBackButton={<BackButton />}
    >
      <div className="bg-card border border-border p-6 rounded-lg">
        <CreateUserForm classes={classes} />
      </div>
    </PageWrapper>
  );
}

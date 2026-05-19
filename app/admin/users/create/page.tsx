import { getAllOrganisations } from '@/app/admin/users/actions';
import { listClasses } from '@/app/admin/classes/actions';
import { getOrganisationSettings } from '@/lib/auth/settings';
import CreateUserForm from '@/components/features/admin/CreateUserForm';
import { BackButton } from '@/components/common/BackButton';
import { PageWrapper } from '@/components/common/PageWrapper';
import { Tables } from '@/lib/supabase/types';

export default async function CreateUserPage() {

  const { allowOrganisations } = getOrganisationSettings();

  let organisations: Tables<'organisations'>[] = [];
  let classes: Awaited<ReturnType<typeof listClasses>>['classes'] = [];
  if (allowOrganisations) {
    try {
      organisations = await getAllOrganisations();
    } catch (error) {
      console.error('Error fetching organisations:', error);
    }
  }
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
        <CreateUserForm organisations={organisations} classes={classes} />
      </div>
    </PageWrapper>
  );
}

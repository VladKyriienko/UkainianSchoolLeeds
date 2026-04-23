import { getAllOrganisations } from '@/app/admin/users/actions';
import { getOrganisationSettings } from '@/utils/auth-helpers/settings';
import CreateUserForm from '@/app/admin/components/CreateUserForm';
import { BackButton } from '@/components/common/BackButton';
import { PageWrapper } from '@/components/common/PageWrapper';
import { Tables } from '@/utils/supabase/types';

export default async function CreateUserPage() {

  const { allowOrganisations } = getOrganisationSettings();

  let organisations: Tables<'organisations'>[] = [];
  if (allowOrganisations) {
    try {
      organisations = await getAllOrganisations();
    } catch (error) {
      console.error('Error fetching organisations:', error);
    }
  }

  return (
    <PageWrapper
      title="Create New User"
      description="Add a new user to the system."
      goBackButton={<BackButton />}
    >
      <div className="bg-card border border-border p-6 rounded-lg">
        <CreateUserForm organisations={organisations} />
      </div>
    </PageWrapper>
  );
}

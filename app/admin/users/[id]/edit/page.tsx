import { getAllOrganisations, getAllUsers } from '@/app/admin/users/actions';
import type { AdminUser } from '@/types';
import { listClasses } from '@/app/admin/classes/actions';
import { getOrganisationSettings } from '@/lib/auth/settings';
import UserForm from '@/components/features/admin/UserForm';
import { BackButton } from '@/components/common/BackButton';
import { PageWrapper } from '@/components/common/PageWrapper';
import { Tables } from '@/lib/supabase/types';

export default async function EditUserPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let users: AdminUser[] = [];
  let organisations: Tables<'organisations'>[] = [];
  let classes: Awaited<ReturnType<typeof listClasses>>['classes'] = [];
  let error: string | null = null;

  try {
    const usersResult = await getAllUsers();
    users = usersResult.users;
    const { allowOrganisations } = getOrganisationSettings();
    if (allowOrganisations) {
      organisations = await getAllOrganisations();
    }
    const classesResult = await listClasses({ page: 1, limit: 500 });
    classes = classesResult.classes;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Unknown error occurred';
    error = errorMessage;
  }

  const currentUser = users.find((u) => u.id === id);

  if (!currentUser) {
    return (
      <PageWrapper
        title="User Not Found"
        description="The user you're looking for doesn't exist."
        goBackButton={<BackButton />}
      >
        <div className="text-center">
          <p className="text-muted-foreground">
            Please return to the users list and try again.
          </p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Edit User"
      description="Update user information."
      goBackButton={<BackButton />}
    >
      {error ? (
        <div className="bg-destructive/10 border border-destructive text-destructive-foreground px-4 py-3 rounded mb-6">
          Error loading user: {error}
        </div>
      ) : (
        <div className="bg-card border border-border p-6 rounded-lg">
          <UserForm
            organisations={organisations}
            classes={classes}
            user={currentUser}
            mode="edit"
          />
        </div>
      )}
    </PageWrapper>
  );
}

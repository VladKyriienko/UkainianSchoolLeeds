import { getAllOrganisations } from '@/app/admin/users/actions';
import { getOrganisationSettings } from '@/utils/auth-helpers/settings';
import CreateUserForm from '@/app/admin/components/CreateUserForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create New User</h1>
          <p className="text-gray-400">Add a new user to the system</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/users">← Back to Users</Link>
        </Button>
      </div>

      <div className="dark:bg-zinc-800 p-6 rounded-lg">
        <CreateUserForm organisations={organisations} />
      </div>
    </div>
  );
}

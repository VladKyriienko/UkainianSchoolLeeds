import { redirect } from 'next/navigation';
import { getOrganisationSettings } from '@/utils/auth-helpers/settings';
import { getAllOrganisations } from '@/app/(authenticated)/admin/users/actions';
import Link from 'next/link';
import { EditOrganisationForm } from '@/app/(authenticated)/admin/components/EditOrganisationForm';
import { notFound } from 'next/navigation';

export default async function EditOrganisationPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { allowOrganisations } = getOrganisationSettings();

  if (!allowOrganisations) {
    return redirect('/admin');
  }

  // Get organisation data
  let organisation;
  try {
    const organisations = await getAllOrganisations();
    organisation = organisations.find((org) => org.id === id);
  } catch (error) {
    console.error('Error fetching organisation:', error);
  }

  if (!organisation) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <Link
          href="/admin/organisations"
          className="text-primary hover:text-primary/80 mb-4 inline-block"
        >
          ← Back to Organisations
        </Link>
        <h1 className="text-3xl font-bold mb-2">Edit Organisation</h1>
        <p className="text-muted-foreground">
          Update organisation details and settings
        </p>
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <EditOrganisationForm organisation={organisation} />
      </div>
    </div>
  );
}

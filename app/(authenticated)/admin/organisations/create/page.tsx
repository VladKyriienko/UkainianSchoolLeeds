import { redirect } from 'next/navigation';
import { getOrganisationSettings } from '@/utils/auth-helpers/settings';
import Link from 'next/link';
import { CreateOrganisationForm } from '@/app/(authenticated)/admin/components/CreateOrganisationForm';

export default async function CreateOrganisationPage() {
  const { allowOrganisations } = getOrganisationSettings();

  if (!allowOrganisations) {
    return redirect('/admin');
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
        <h1 className="text-3xl font-bold mb-2">Create Organisation</h1>
        <p className="text-muted-foreground">
          Create a new organisation and manage its members
        </p>
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <CreateOrganisationForm />
      </div>
    </div>
  );
}

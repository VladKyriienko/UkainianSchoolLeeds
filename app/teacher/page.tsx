import { getCurrentUser } from '@/utils/auth-helpers/server';
import { PageWrapper } from '@/components/common/PageWrapper';

export default async function TeacherHomePage() {
  const { profileData } = await getCurrentUser();
  const name = profileData?.full_name ?? 'there';

  return (
    <PageWrapper
      title={`Welcome back, ${name}!`}
      description="Teacher dashboard for Ukrainia School."
    >
      <div className="mt-8 rounded-lg border bg-card p-6">
        <h2 className="mb-2 text-xl font-semibold">Teacher workspace</h2>
        <p className="text-sm text-muted-foreground">
          This is your teacher dashboard. Additional teacher tools can be added
          here.
        </p>
      </div>
    </PageWrapper>
  );
}

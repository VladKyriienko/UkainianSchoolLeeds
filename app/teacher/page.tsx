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
        <h3 className="font-semibold leading-snug font-display text-foreground">Teacher workspace</h3>
        <p className="text-muted-foreground">
          This is your teacher dashboard. Additional teacher tools can be added
          here.
        </p>
      </div>
    </PageWrapper>
  );
}

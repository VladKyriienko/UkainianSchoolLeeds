import { getCurrentUser } from '@/utils/auth-helpers/server';
import { AdminDashboardStats } from '@/app/admin/components/AdminDashboardStats';
import { PageWrapper } from '@/components/common/PageWrapper';

export default async function AdminHomePage() {
  const { profileData } = await getCurrentUser();
  const name = profileData?.full_name ?? 'there';

  return (
    <PageWrapper
      title={`Welcome back, ${name}!`}
      description="Admin dashboard for Ukrainia School."
    >
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
        <AdminDashboardStats />
      </div>
    </PageWrapper>
  );
}

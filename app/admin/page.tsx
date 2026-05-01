import { getCurrentUser } from '@/utils/auth-helpers/server';
import { getAdminDashboardStats } from '@/app/admin/actions';
import { AdminDashboardStats } from '@/app/admin/components/AdminDashboardStats';
import { PageWrapper } from '@/components/common/PageWrapper';

export default async function AdminHomePage() {
  const { profileData } = await getCurrentUser();
  const name = profileData?.full_name ?? 'there';
  const stats = await getAdminDashboardStats();

  return (
    <PageWrapper
      title={`Welcome back, ${name}!`}
      description="Admin dashboard for Ukrainia School."
    >
      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Statistics</h2>
        <AdminDashboardStats stats={stats} />
      </div>
    </PageWrapper>
  );
}

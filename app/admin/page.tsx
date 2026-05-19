import { getCurrentUser } from '@/lib/auth/server';
import { getAdminDashboardStats } from '@/app/admin/actions';
import { AdminDashboardStats } from '@/components/features/admin/AdminDashboardStats';
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
        <h2 className="max-md:text-2xl font-bold tracking-tight md:text-h2 font-display text-foreground mb-4">Statistics</h2>
        <AdminDashboardStats stats={stats} />
      </div>
    </PageWrapper>
  );
}

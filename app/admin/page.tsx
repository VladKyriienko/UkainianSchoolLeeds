import { getCurrentUser } from '@/utils/auth-helpers/server';
import { AdminDashboardStats } from '@/app/admin/components/AdminDashboardStats';

export default async function AdminHomePage() {
  const { profileData } = await getCurrentUser();
  const name = profileData?.full_name ?? 'there';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome back, {name}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Admin dashboard for Ukrainia School.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
        <AdminDashboardStats />
      </div>
    </div>
  );
}

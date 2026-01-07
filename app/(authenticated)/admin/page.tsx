import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getOrganisationSettings } from '@/utils/auth-helpers/settings';
import { Users, Building2, Settings } from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = createClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return redirect('/auth/login');
  }

  // Check if user has admin role
  const { data: roleData, error: roleError } = await supabase
    .from('roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (roleError || roleData?.role !== 'admin') {
    return redirect('/');
  }

  const { allowOrganisations } = getOrganisationSettings();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, organisations, and system settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/users" className="block group">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">User Management</h3>
                <p className="text-muted-foreground text-sm">
                  Create, edit, and manage user accounts
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {allowOrganisations && (
          <Link href="/admin/organisations" className="block group">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Organisations</h3>
                  <p className="text-muted-foreground text-sm">
                    Manage organisations and memberships
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        <Link href="/admin/system" className="block group">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">System Settings</h3>
                <p className="text-muted-foreground text-sm">
                  Configure authentication and features
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="mt-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/admin/users/create">Create User</Link>
            </Button>
            {allowOrganisations && (
              <Button asChild variant="secondary">
                <Link href="/admin/organisations/create">
                  Create Organisation
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

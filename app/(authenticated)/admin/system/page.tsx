import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import {
  getAuthTypes,
  getOrganisationSettings
} from '@/utils/auth-helpers/settings';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default async function AdminSystemPage() {
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

  const authSettings = getAuthTypes();
  const orgSettings = getOrganisationSettings();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">System Settings</h1>
          <p className="text-muted-foreground">
            View current system configuration
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin">← Back to Admin</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Authentication Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h3 className="font-medium mb-2">OAuth</h3>
                <Badge
                  variant={authSettings.allowOauth ? 'default' : 'destructive'}
                  className={
                    authSettings.allowOauth
                      ? 'bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20'
                      : ''
                  }
                >
                  {authSettings.allowOauth ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div>
                <h3 className="font-medium mb-2">Email Authentication</h3>
                <Badge
                  variant={authSettings.allowEmail ? 'default' : 'destructive'}
                  className={
                    authSettings.allowEmail
                      ? 'bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20'
                      : ''
                  }
                >
                  {authSettings.allowEmail ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div>
                <h3 className="font-medium mb-2">Password Authentication</h3>
                <Badge
                  variant={
                    authSettings.allowPassword ? 'default' : 'destructive'
                  }
                  className={
                    authSettings.allowPassword
                      ? 'bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20'
                      : ''
                  }
                >
                  {authSettings.allowPassword ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organisation Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Organisation Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-2">Organisations</h3>
                <Badge
                  variant={
                    orgSettings.allowOrganisations ? 'default' : 'destructive'
                  }
                  className={
                    orgSettings.allowOrganisations
                      ? 'bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20'
                      : ''
                  }
                >
                  {orgSettings.allowOrganisations ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div>
                <h3 className="font-medium mb-2">
                  User Can Create Organisations
                </h3>
                <Badge
                  variant={
                    orgSettings.allowUserCreateOrganisations
                      ? 'default'
                      : 'destructive'
                  }
                  className={
                    orgSettings.allowUserCreateOrganisations
                      ? 'bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20'
                      : ''
                  }
                >
                  {orgSettings.allowUserCreateOrganisations
                    ? 'Enabled'
                    : 'Disabled'}
                </Badge>
              </div>
              <div>
                <h3 className="font-medium mb-2">Organisation Invites</h3>
                <Badge
                  variant={
                    orgSettings.allowOrganisationInvites
                      ? 'default'
                      : 'destructive'
                  }
                  className={
                    orgSettings.allowOrganisationInvites
                      ? 'bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20'
                      : ''
                  }
                >
                  {orgSettings.allowOrganisationInvites
                    ? 'Enabled'
                    : 'Disabled'}
                </Badge>
              </div>
              <div>
                <h3 className="font-medium mb-2">
                  Organisation Role Management
                </h3>
                <Badge
                  variant={
                    orgSettings.allowOrganisationRoleManagement
                      ? 'default'
                      : 'destructive'
                  }
                  className={
                    orgSettings.allowOrganisationRoleManagement
                      ? 'bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20'
                      : ''
                  }
                >
                  {orgSettings.allowOrganisationRoleManagement
                    ? 'Enabled'
                    : 'Disabled'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Environment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <h3 className="font-medium mb-2">Supabase URL</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not configured'}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Site URL</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  {process.env.NEXT_PUBLIC_SITE_URL || 'Not configured'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning */}
        <Alert className="bg-yellow-500/10 border-yellow-500/50 text-yellow-700 dark:text-yellow-400">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> These settings are configured in the
            authentication settings file. To modify them, update the
            configuration in <code>utils/auth-helpers/settings.ts</code>.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

import {
  getAllUsers,
  AdminUser
} from '@/app/admin/users/actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Mail,
  Calendar,
  Clock,
  Shield,
  User,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Settings,
  Activity
} from 'lucide-react';
import UserActionButtons from '@/app/admin/components/UserActionButtons';
import { UserDetailsActions } from '@/app/admin/components/UserDetailsActions';
import { PageWrapper } from '@/components/common/PageWrapper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default async function UserDetailsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let users: AdminUser[] = [];
  let error: string | null = null;

  try {
    const usersResult = await getAllUsers();
    users = usersResult.users;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Unknown error occurred';
    error = errorMessage;
  }

  const currentUser = users.find((u) => u.id === id);

  if (!currentUser) {
    return (
      <PageWrapper
        title="User Not Found"
        description="The user you're looking for doesn't exist."
        goBackButton={
          <Button asChild>
            <Link href="/admin/users">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
        }
      />
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge
            variant="destructive"
            className="bg-destructive/10 text-destructive hover:bg-destructive/20"
          >
            Admin
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary/20"
          >
            User
          </Badge>
        );
    }
  };

  const getStatusBadge = (confirmed?: string) => {
    if (confirmed) {
      return (
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500" />
          <Badge
            variant="secondary"
            className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20"
          >
            Confirmed
          </Badge>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
          <Badge
            variant="secondary"
            className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20"
          >
            Pending
          </Badge>
        </div>
      );
    }
  };

  return (
    <PageWrapper
      title={currentUser.full_name || 'Unnamed User'}
      description={
        <span className="flex items-center gap-3 mt-1">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={currentUser.avatar_url || ''}
              alt={currentUser.full_name || 'User'}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-sm">
              {currentUser.full_name?.charAt(0) ||
                currentUser.email?.charAt(0) ||
                '?'}
            </AvatarFallback>
          </Avatar>
          <span className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" />
            {currentUser.email}
          </span>
        </span>
      }
      goBackButton={
        <Button asChild>
          <Link href="/admin/users">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>
      }
      actions={
        <UserDetailsActions
          userId={currentUser.id}
          userEmail={currentUser.email}
        />
      }
    >
      {error ? (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading user: {error}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  User Details
                </CardTitle>
                <CardDescription>
                  Basic information about this user account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Email Address
                    </label>
                    <p className="text-sm">{currentUser.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </label>
                    <p className="text-sm">
                      {currentUser.full_name || 'Not provided'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      System Role
                    </label>
                    <div>{getRoleBadge(currentUser.role)}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Account Status
                    </label>
                    <div>{getStatusBadge(currentUser.email_confirmed_at)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Account Activity
                </CardTitle>
                <CardDescription>
                  Recent activity and account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Account Created
                    </label>
                    <p className="text-sm font-medium">
                      {formatDate(currentUser.created_at)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Last Sign In
                    </label>
                    <p className="text-sm font-medium">
                      {formatDateTime(currentUser.last_sign_in_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organisations Card */}
            {currentUser.organisations &&
              currentUser.organisations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Organisations
                    </CardTitle>
                    <CardDescription>
                      Organisations this user is a member of
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {currentUser.organisations.map((org, index) => {
                        return (
                          <Card key={index} className="border-dashed">
                            <CardContent className="pt-4">
                              <h3 className="font-semibold text-sm">
                                {org.organisation?.name}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                /{org.organisation?.slug}
                              </p>
                              <Badge
                                variant={
                                  org.role === 'admin' ? 'default' : 'secondary'
                                }
                                className={`mt-2 text-xs ${org.role === 'admin'
                                  ? 'bg-primary/10 text-primary'
                                  : ''
                                  }`}
                              >
                                {org.role}
                              </Badge>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common actions for this user</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <UserActionButtons user={currentUser} variant="sidebar" />
                <Separator />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Edit user information</p>
                  <p>• Send password reset email</p>
                  <p>• Delete user account</p>
                </div>
              </CardContent>
            </Card>

            {/* User Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Organisations
                  </span>
                  <Badge variant="outline">
                    {currentUser.organisations?.length || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Account Age
                  </span>
                  <span className="text-sm font-medium">
                    {currentUser.created_at
                      ? `${Math.floor((Date.now() - new Date(currentUser.created_at).getTime()) / (1000 * 60 * 60 * 24))} days`
                      : 'Unknown'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

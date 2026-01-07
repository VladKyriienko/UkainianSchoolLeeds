import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import {
  getAllUsers,
  AdminUser
} from '@/app/(authenticated)/admin/users/actions';
import UserManagementTable from '@/app/(authenticated)/admin/components/UserManagementTable';
import ExportUsersButton from '@/app/(authenticated)/admin/components/ExportUsersButton';
import { UserSearchForm } from '@/app/(authenticated)/admin/components/UserSearchForm';
import { PaginationComponent } from '@/components/common/Pagination';
import { PaginationInfo } from '@/components/common/PaginationInfo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type AdminUsersPageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    role?: string;
  }>;
};

export default async function AdminUsersPage({
  searchParams
}: AdminUsersPageProps) {
  // Await searchParams to fix Next.js warning
  const params = await searchParams;

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

  // Parse pagination and filter parameters
  const page = parseInt(params.page || '1', 10);
  const limit = parseInt(params.limit || '20', 10);
  const search = params.search || '';
  const roleFilter = params.role || 'all';

  let users: AdminUser[] = [];
  let totalUsers = 0;
  let error: string | null = null;

  try {
    const result = await getAllUsers({
      page,
      limit,
      search: search.trim(),
      ...(roleFilter !== 'all' && { role: roleFilter })
    });
    users = result.users;
    totalUsers = result.total;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Unknown error occurred';
    error = errorMessage;
  }

  // Calculate pagination info
  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">
            Manage all user accounts and their permissions
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/admin">← Back to Admin</Link>
          </Button>
          <ExportUsersButton />
          <Button asChild>
            <Link href="/admin/users/create">Create User</Link>
          </Button>
        </div>
      </div>

      <UserSearchForm initialSearch={search} initialRole={roleFilter} />

      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading users: {error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <PaginationInfo
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalUsers}
            itemsPerPage={users.length}
            itemName="users"
            className="mb-4 mt-6"
          />
          <UserManagementTable users={users} />
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/admin/users"
            limit={limit}
            searchParams={{ search, role: roleFilter }}
            className="mt-6"
          />
        </>
      )}
    </div>
  );
}

'use client';

import { AdminUser } from '@/app/(authenticated)/admin/users/actions';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Users,
  MoreHorizontal,
  Eye,
  Edit,
  Mail,
  UserX,
  UserCheck,
  Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  deleteUser,
  sendPasswordResetOrInvite,
  deactivateUser,
  reactivateUser
} from '@/app/(authenticated)/admin/users/actions';

type UserManagementTableProps = {
  users: AdminUser[];
};

export default function UserManagementTable({
  users
}: UserManagementTableProps) {
  const router = useRouter();
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const handleDelete = async (userId: string, email: string) => {
    if (
      !confirm(
        `Are you sure you want to delete user ${email}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setLoadingUserId(userId);
    try {
      await deleteUser(userId);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleSendEmail = async (userId: string) => {
    setLoadingUserId(userId);
    try {
      const result = await sendPasswordResetOrInvite(userId);
      alert(
        result.type === 'password_reset'
          ? 'Password reset email sent!'
          : 'Invite email sent!'
      );
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email');
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleToggleActive = async (
    userId: string,
    isActive: boolean,
    email: string
  ) => {
    const actionText = isActive ? 'deactivate' : 'reactivate';
    if (!confirm(`Are you sure you want to ${actionText} user ${email}?`)) {
      return;
    }

    setLoadingUserId(userId);
    try {
      if (isActive) {
        await deactivateUser(userId);
      } else {
        await reactivateUser(userId);
      }
      router.refresh();
    } catch (error) {
      console.error(`Failed to ${actionText} user:`, error);
      alert(`Failed to ${actionText} user`);
    } finally {
      setLoadingUserId(null);
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No users found
        </h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">User</TableHead>
              <TableHead className="w-[200px]">Email</TableHead>
              <TableHead className="w-[80px]">Role</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[120px]">Created</TableHead>
              <TableHead className="w-[160px]">Last Sign In</TableHead>
              <TableHead className="w-[80px]">Orgs</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const isActive = user.is_active ?? true;
              const isVerified = !!user.email_confirmed_at;

              return (
                <TableRow key={user.id}>
                  {/* User with Avatar */}
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage
                          src={user.avatar_url || ''}
                          alt={user.full_name || user.email || 'User'}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm">
                          {user.full_name?.charAt(0) ||
                            user.email?.charAt(0) ||
                            '?'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">
                        {user.full_name || 'Unnamed User'}
                      </span>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell>
                    <span className="text-muted-foreground truncate block">
                      {user.email}
                    </span>
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    <span
                      className={
                        user.role === 'admin'
                          ? 'text-destructive font-medium'
                          : 'text-foreground'
                      }
                    >
                      {user.role}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <span
                      className={
                        user.email_confirmed_at
                          ? 'text-green-600 dark:text-green-500'
                          : 'text-yellow-600 dark:text-yellow-500'
                      }
                    >
                      {user.email_confirmed_at ? 'Confirmed' : 'Pending'}
                    </span>
                  </TableCell>

                  {/* Created Date */}
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(user.created_at)}
                  </TableCell>

                  {/* Last Sign In */}
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDateTime(user.last_sign_in_at)}
                  </TableCell>

                  {/* Organisations */}
                  <TableCell className="text-center">
                    {user.organisations && user.organisations.length > 0 ? (
                      <span className="text-muted-foreground">
                        {user.organisations.length}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={loadingUserId === user.id}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/users/${user.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/admin/users/${user.id}/edit`)
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSendEmail(user.id)}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          {isVerified ? 'Send Password Reset' : 'Send Invite'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleToggleActive(user.id, isActive, user.email)
                          }
                          className={
                            isActive
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-green-600 dark:text-green-400'
                          }
                        >
                          {isActive ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Deactivate User
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Reactivate User
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(user.id, user.email)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

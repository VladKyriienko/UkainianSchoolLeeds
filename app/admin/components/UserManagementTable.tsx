'use client';

import { AdminUser } from '@/app/admin/users/actions';
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
} from '@/app/admin/users/actions';
import { formatDateLabel, formatDateTimeLabel } from '@/utils/date-format';
import { EntityEmptyState } from '@/components/common/admin/EntityEmptyState';
import { EntityTableShell } from '@/components/common/admin/EntityTableShell';
import { StatusBadge } from '@/components/common/admin/StatusBadge';
import { useConfirmAction } from '@/hooks/useConfirmAction';

type UserManagementTableProps = {
  users: AdminUser[];
};

export default function UserManagementTable({
  users
}: UserManagementTableProps) {
  const router = useRouter();
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const { runWithConfirm } = useConfirmAction();

  const handleDelete = async (userId: string, email: string) => {
    await runWithConfirm({
      confirmMessage: `Are you sure you want to delete user ${email}? This action cannot be undone.`,
      onAction: async () => {
        setLoadingUserId(userId);
        try {
          await deleteUser(userId);
          router.refresh();
        } finally {
          setLoadingUserId(null);
        }
      },
      onError: (error) => {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user');
      }
    });
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
    await runWithConfirm({
      confirmMessage: `Are you sure you want to ${actionText} user ${email}?`,
      onAction: async () => {
        setLoadingUserId(userId);
        try {
          if (isActive) {
            await deactivateUser(userId);
          } else {
            await reactivateUser(userId);
          }
          router.refresh();
        } finally {
          setLoadingUserId(null);
        }
      },
      onError: (error) => {
        console.error(`Failed to ${actionText} user:`, error);
        alert(`Failed to ${actionText} user`);
      }
    });
  };

  if (users.length === 0) {
    return (
      <EntityEmptyState
        icon={Users}
        title="No users found"
        description="Try adjusting your search or filter criteria"
      />
    );
  }

  return (
    <EntityTableShell>
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
                  <StatusBadge
                    label={user.email_confirmed_at ? 'Confirmed' : 'Pending'}
                    variant={user.email_confirmed_at ? 'success' : 'warning'}
                  />
                </TableCell>

                {/* Created Date */}
                <TableCell className="text-muted-foreground text-sm">
                  {user.created_at ? formatDateLabel(user.created_at) : 'Never'}
                </TableCell>

                {/* Last Sign In */}
                <TableCell className="text-muted-foreground text-sm">
                  {user.last_sign_in_at
                    ? formatDateTimeLabel(user.last_sign_in_at)
                    : 'Never'}
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
    </EntityTableShell>
  );
}

'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminAccess } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import { getURL } from '@/utils/helpers';
import type {
  AdminOrganisation,
  AdminUser,
  CreateUserData,
  UpdateUserData
} from '@/types';

// Admin client with service role access
const supabaseAdmin = createAdminClient();

type AuthUpdateData = {
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
};

async function setTeacherClassAssignment(
  userId: string,
  classId?: string | null
): Promise<void> {
  const { error: deleteError } = await supabaseAdmin
    .from('teacher_class')
    .delete()
    .eq('teacher_id', userId);

  if (deleteError) {
    throw new Error(
      `Failed to clear teacher class assignment: ${deleteError.message}`
    );
  }

  if (!classId) return;

  const { error: insertError } = await supabaseAdmin
    .from('teacher_class')
    .insert({
      teacher_id: userId,
      class_id: classId
    });

  if (insertError) {
    throw new Error(
      `Failed to assign class to teacher: ${insertError.message}`
    );
  }
}

/** Lightweight count for dashboard stats. */
export async function getUsersCount(): Promise<number> {
  await verifyAdminAccess();
  const { count, error } = await supabaseAdmin
    .from('users')
    .select('id', { count: 'exact', head: true });
  if (error) return 0;
  return count ?? 0;
}

type ListAdminUserRow = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  email_confirmed_at: string | null;
  created_at: string | null;
  last_sign_in_at: string | null;
  role: string;
  is_active: boolean;
  teacher_class_id: string | null;
  total_count: number;
};

async function fetchOrganisationMemberships(userIds: string[]) {
  if (userIds.length === 0) return [];

  const { data, error } = await supabaseAdmin
    .from('organisation_memberships')
    .select(
      `
        id,
        user_id,
        organisation_id,
        role,
        organisation:organisations(id, name, slug)
      `
    )
    .in('user_id', userIds);

  if (error) {
    console.error('Error fetching organisation memberships:', error);
    return [];
  }

  return data ?? [];
}

// Get users with roles and organisations (paginated in the database).
export async function getAllUsers(options?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<{ users: AdminUser[]; total: number }> {
  await verifyAdminAccess();

  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const search = options?.search?.trim();
  const roleFilter = options?.role?.trim();

  const { data: rows, error } = await supabaseAdmin.rpc('list_admin_users', {
    p_page: page,
    p_limit: limit,
    ...(search ? { p_search: search } : {}),
    ...(roleFilter ? { p_role: roleFilter } : {})
  });

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  const list = (rows as ListAdminUserRow[] | null) ?? [];
  const total = list[0]?.total_count ?? 0;
  const userIds = list.map((row) => row.id);
  const organisations = await fetchOrganisationMemberships(userIds);

  const users: AdminUser[] = list.map((row) => {
    const userOrgs = organisations.filter((org) => org.user_id === row.id);

    const adminUser: AdminUser = {
      id: row.id,
      email: row.email,
      organisations: userOrgs,
      role: row.role || 'user',
      teacher_class_id: row.teacher_class_id
    };

    if (row.full_name) adminUser.full_name = row.full_name;
    if (row.avatar_url) adminUser.avatar_url = row.avatar_url;
    if (row.email_confirmed_at) {
      adminUser.email_confirmed_at = row.email_confirmed_at;
    }
    if (row.created_at) adminUser.created_at = row.created_at;
    if (row.last_sign_in_at) adminUser.last_sign_in_at = row.last_sign_in_at;
    if (row.is_active !== undefined) adminUser.is_active = row.is_active;

    return adminUser;
  });

  return { users, total: Number(total) };
}

// Get all organisations with their members
export async function getAllOrganisations(): Promise<AdminOrganisation[]> {
  await verifyAdminAccess();

  const { data: organisations, error } = await supabaseAdmin
    .from('organisations')
    .select(
      `
      *,
      organisation_memberships(
        id,
        user_id,
        organisation_id,
        role,
        user:users(id, full_name, avatar_url)
      )
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch organisations: ${error.message}`);
  }

  return organisations || [];
}

// Create new user
export async function createUser(data: CreateUserData) {
  await verifyAdminAccess();

  try {
    // Create auth user and let the database trigger handle public user record and role creation
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, {
        redirectTo: getURL('/auth/callback?redirectTo=/auth/update-password'),
        data: {
          full_name: data.full_name || '',
          system_role: data.role || 'user',
          ...(data.organisation_id &&
            data.organisation_role && {
              organisation_id: data.organisation_id,
              organisation_role: data.organisation_role
            })
        }
      });

    if (authError) {
      throw new Error(`Failed to create user: ${authError.message}`);
    }

    if (!authUser.user) {
      throw new Error('Failed to create user: No user data returned');
    }

    // The database trigger automatically creates:
    // - public.users record
    // - public.roles record
    // - public.organisation_memberships record (if organisation data provided)
    // So we don't need to manually insert into these tables
    if (data.role === 'teacher' && data.class_id) {
      await setTeacherClassAssignment(authUser.user.id, data.class_id);
    }

    revalidatePath('/admin/users');
    revalidatePath('/teacher/class-gallery');
    return { success: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create user';
    return { success: false, error: errorMessage };
  }
}

// Send password reset or invite based on user verification status
export async function sendPasswordResetOrInvite(userId: string) {
  await verifyAdminAccess();

  try {
    // Get user email and verification status
    const { data: authUser, error: getUserError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (getUserError || !authUser.user?.email) {
      throw new Error('User not found or email not available');
    }

    // Check if user is active before sending any emails
    const { data: userData, error: userDataError } = await supabaseAdmin
      .from('users')
      .select('is_active')
      .eq('id', userId)
      .single();

    if (userDataError) {
      console.error('Error checking user active status:', userDataError);
      // Continue if we can't check status, but log the error
    } else if (userData && userData.is_active === false) {
      throw new Error(
        'Cannot send emails to deactivated users. Please reactivate the user first.'
      );
    }

    const isVerified = !!authUser.user.email_confirmed_at;

    if (isVerified) {
      // User is verified - send password reset email
      const { error: resetError } =
        await supabaseAdmin.auth.resetPasswordForEmail(authUser.user.email, {
          redirectTo: getURL('/auth/callback?redirectTo=/auth/update-password')
        });

      if (resetError) {
        throw new Error(
          `Failed to send password reset email: ${resetError.message}`
        );
      }

      return { success: true, type: 'password_reset' };
    } else {
      // User is not verified - send invite email
      const { error: inviteError } =
        await supabaseAdmin.auth.admin.inviteUserByEmail(authUser.user.email, {
          redirectTo: getURL('/auth/callback?redirectTo=/auth/update-password'),
          data: authUser.user.user_metadata
        });

      if (inviteError) {
        throw new Error(`Failed to send invite email: ${inviteError.message}`);
      }

      return { success: true, type: 'invite' };
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to send email';
    throw new Error(errorMessage);
  }
}

// Update user
export async function updateUser(userId: string, data: UpdateUserData) {
  await verifyAdminAccess();

  try {
    // Update auth user
    const updateData: AuthUpdateData = {};
    if (data.email) updateData.email = data.email;
    if (data.full_name !== undefined) {
      updateData.user_metadata = { full_name: data.full_name };
    }

    if (Object.keys(updateData).length > 0) {
      const { error: authError } =
        await supabaseAdmin.auth.admin.updateUserById(userId, updateData);

      if (authError) {
        throw new Error(`Failed to update user: ${authError.message}`);
      }
    }

    // Update user profile
    if (data.full_name !== undefined) {
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .update({ full_name: data.full_name || null })
        .eq('id', userId);

      if (profileError) {
        console.error('Profile update error:', profileError);
      }
    }

    // Update role
    if (data.role) {
      const { error: roleError } = await supabaseAdmin.from('roles').upsert([
        {
          user_id: userId,
          role: data.role as 'admin' | 'teacher' | 'user'
        }
      ]);

      if (roleError) {
        console.error('Role update error:', roleError);
      }

      if (data.role !== 'teacher') {
        await setTeacherClassAssignment(userId, null);
      } else if (data.class_id !== undefined) {
        await setTeacherClassAssignment(userId, data.class_id || null);
      }
    } else if (data.class_id !== undefined) {
      await setTeacherClassAssignment(userId, data.class_id || null);
    }

    revalidatePath('/admin/users');
    revalidatePath('/teacher/class-gallery');
    return { success: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to update user';
    throw new Error(errorMessage);
  }
}

// Delete user
export async function deleteUser(userId: string) {
  await verifyAdminAccess();

  try {
    // Delete from auth
    const { error: authError } =
      await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      throw new Error(`Failed to delete user: ${authError.message}`);
    }

    // Clean up related public records (there is no DB-level cascade from auth.users).
    const { error: membershipsError } = await supabaseAdmin
      .from('organisation_memberships')
      .delete()
      .eq('user_id', userId);
    if (membershipsError) {
      throw new Error(
        `User deleted from auth, but failed to delete organisation memberships: ${membershipsError.message}`
      );
    }

    const { error: uploadsError } = await supabaseAdmin
      .from('user_uploads')
      .delete()
      .eq('user_id', userId);
    if (uploadsError) {
      throw new Error(
        `User deleted from auth, but failed to delete uploads: ${uploadsError.message}`
      );
    }

    const { error: rolesError } = await supabaseAdmin
      .from('roles')
      .delete()
      .eq('user_id', userId);
    if (rolesError) {
      throw new Error(
        `User deleted from auth, but failed to delete roles: ${rolesError.message}`
      );
    }

    const { error: profileError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);
    if (profileError) {
      throw new Error(
        `User deleted from auth, but failed to delete profile: ${profileError.message}`
      );
    }

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete user';
    throw new Error(errorMessage);
  }
}

// Deactivate user
export async function deactivateUser(userId: string) {
  await verifyAdminAccess();

  // Update the user's is_active status to false
  const { error } = await supabaseAdmin
    .from('users')
    .update({ is_active: false })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to deactivate user: ${error.message}`);
  }

  revalidatePath('/admin/users');
}

// Reactivate user
export async function reactivateUser(userId: string) {
  await verifyAdminAccess();

  // Update the user's is_active status to true
  const { error } = await supabaseAdmin
    .from('users')
    .update({ is_active: true })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to reactivate user: ${error.message}`);
  }

  revalidatePath('/admin/users');
}

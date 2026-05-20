'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminAccess } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import { getURL } from '@/utils/helpers';
import type {
  AdminOrganisation,
  AdminUser,
  CreateUserData,
  OrganisationMembership,
  UpdateUserData
} from '@/types';
import type { Tables } from '@/lib/supabase/types';

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
    .select('*', { count: 'exact', head: true });
  if (error) return 0;
  return count ?? 0;
}

// Get all users with their roles and organisations
export async function getAllUsers(options?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<{ users: AdminUser[]; total: number }> {
  await verifyAdminAccess();

  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const search = options?.search;
  const roleFilter = options?.role;

  // Get all users first (needed for server-side filtering)
  const allAuthUsers: Array<{
    id: string;
    email?: string;
    created_at?: string;
    last_sign_in_at?: string;
    email_confirmed_at?: string;
  }> = [];
  let fetchPage = 1;
  const fetchPerPage = 1000; // Max per page

  while (true) {
    const {
      data: { users: pageUsers },
      error: fetchError
    } = await supabaseAdmin.auth.admin.listUsers({
      page: fetchPage,
      perPage: fetchPerPage
    });

    if (fetchError) {
      throw new Error(`Failed to fetch users: ${fetchError.message}`);
    }

    allAuthUsers.push(...pageUsers);

    if (pageUsers.length < fetchPerPage) {
      break; // Last page reached
    }
    fetchPage++;

    // Safety limit to prevent infinite loops
    if (fetchPage > 100) {
      console.log('Reached maximum page limit while fetching users');
      break;
    }
  }

  // Get all user IDs for fetching related data
  const allUserIds = allAuthUsers
    .filter((authUser) => authUser.email)
    .map((user) => user.id);

  // Get roles for all users in batches to avoid URI too long error
  let roles: Array<{ user_id: string; role: string }> = [];
  const rolesBatchSize = 100; // Reduced batch size to avoid URI too long error

  for (let i = 0; i < allUserIds.length; i += rolesBatchSize) {
    const batch = allUserIds.slice(i, i + rolesBatchSize);
    const { data: batchRoles, error: rolesError } = await supabaseAdmin
      .from('roles')
      .select('user_id, role')
      .in('user_id', batch);

    if (rolesError) {
      console.error(
        `Error fetching roles batch ${Math.floor(i / rolesBatchSize) + 1}:`,
        rolesError
      );
    } else if (batchRoles) {
      roles = roles.concat(batchRoles);
    }
  }

  // Get organisations in batches
  let organisations: Array<{
    id: string;
    user_id: string;
    organisation_id: string;
    role: string;
    organisation: { id: string; name: string; slug: string };
  }> = [];

  for (let i = 0; i < allUserIds.length; i += rolesBatchSize) {
    const batch = allUserIds.slice(i, i + rolesBatchSize);
    const { data: batchOrgs } = await supabaseAdmin
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
      .in('user_id', batch);

    if (batchOrgs) {
      organisations = organisations.concat(batchOrgs);
    }
  }

  // Get public user data in batches
  let publicUsers: Array<{
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    is_active: boolean;
  }> = [];

  for (let i = 0; i < allUserIds.length; i += rolesBatchSize) {
    const batch = allUserIds.slice(i, i + rolesBatchSize);
    const { data: batchUsers } = await supabaseAdmin
      .from('users')
      .select('id, full_name, avatar_url, is_active')
      .in('id', batch);

    if (batchUsers) {
      publicUsers = publicUsers.concat(batchUsers);
    }
  }

  // Get teacher class assignments in batches
  let teacherClasses: Array<{ teacher_id: string; class_id: string }> = [];
  for (let i = 0; i < allUserIds.length; i += rolesBatchSize) {
    const batch = allUserIds.slice(i, i + rolesBatchSize);
    const { data: batchTeacherClasses, error: teacherClassesError } =
      await supabaseAdmin
        .from('teacher_class')
        .select('teacher_id, class_id')
        .in('teacher_id', batch);

    if (teacherClassesError) {
      console.error(
        `Error fetching teacher classes batch ${Math.floor(i / rolesBatchSize) + 1}:`,
        teacherClassesError
      );
    } else if (batchTeacherClasses) {
      teacherClasses = teacherClasses.concat(batchTeacherClasses);
    }
  }

  // Combine all data into AdminUser objects
  const allUsers: AdminUser[] = allAuthUsers
    .filter((authUser) => authUser.email) // Filter out users without email
    .map((authUser) => {
      const role = roles?.find((r) => r.user_id === authUser.id);
      const userOrgs =
        organisations?.filter((org) => org.user_id === authUser.id) || [];
      const publicUser = publicUsers?.find((p) => p.id === authUser.id);

      const adminUser: AdminUser = {
        id: authUser.id,
        email: authUser.email!, // Safe to use ! after filter
        organisations: userOrgs
      };

      // Add optional properties
      if (
        publicUser?.full_name !== undefined &&
        publicUser.full_name !== null
      ) {
        adminUser.full_name = publicUser.full_name;
      }
      if (
        publicUser?.avatar_url !== undefined &&
        publicUser.avatar_url !== null
      ) {
        adminUser.avatar_url = publicUser.avatar_url;
      }
      if (authUser.email_confirmed_at) {
        adminUser.email_confirmed_at = authUser.email_confirmed_at;
      }
      if (authUser.created_at) {
        adminUser.created_at = authUser.created_at;
      }
      if (authUser.last_sign_in_at) {
        adminUser.last_sign_in_at = authUser.last_sign_in_at;
      }
      // Always assign a role (default to 'user' if no role found)
      adminUser.role = role?.role || 'user';
      if (publicUser?.is_active !== undefined) {
        adminUser.is_active = publicUser.is_active;
      }
      adminUser.teacher_class_id =
        teacherClasses.find((item) => item.teacher_id === authUser.id)
          ?.class_id ?? null;

      return adminUser;
    });

  // Apply server-side filtering
  const filteredUsers = allUsers.filter((user) => {
    // Search filter
    const matchesSearch =
      !search ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(search.toLowerCase());

    // Role filter
    const matchesRole = !roleFilter || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Apply pagination to filtered results
  const totalUsers = filteredUsers.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return { users: paginatedUsers, total: totalUsers };
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

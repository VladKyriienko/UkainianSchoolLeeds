'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { verifyAdminAccess } from '@/utils/auth-helpers/server';
import { revalidatePath } from 'next/cache';
import { getURL } from '@/utils/helpers';
import { format } from 'date-fns';
import type { Tables } from '@/utils/supabase/types';

// Admin client with service role access
const supabaseAdmin = createAdminClient();

export type OrganisationMembership = {
  id: string;
  user_id: string;
  organisation_id: string;
  role: string;
  organisation?: {
    id: string;
    name: string;
    slug: string;
  };
  user?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
};

export type AdminUser = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  email_confirmed_at?: string;
  created_at?: string;
  last_sign_in_at?: string;
  role?: string;
  is_active?: boolean;
  organisations?: OrganisationMembership[];
};

export type CreateUserData = {
  email: string;
  full_name?: string;
  role?: 'admin' | 'user';
  organisation_id?: string;
  organisation_role?: string;
};

export type UpdateUserData = {
  email?: string;
  full_name?: string;
  role?: string;
  password?: string;
};

type AuthUpdateData = {
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
};

export type CreateOrganisationData = {
  name: string;
  name_uk?: string;
  slug: string;
};

export type UpdateOrganisationData = {
  name?: string;
  name_uk?: string;
  slug?: string;
};

export type AdminOrganisation = {
  organisation_memberships?: OrganisationMembership[];
} & Tables<'organisations'>;

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

    revalidatePath('/admin/users');
    return { success: true, user: authUser.user };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create user';
    throw new Error(errorMessage);
  }
}

// Send welcome email to new user (re-invite if needed)
export async function sendWelcomeEmail(userId: string) {
  await verifyAdminAccess();

  try {
    // Get user email
    const { data: authUser, error: getUserError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (getUserError || !authUser.user?.email) {
      throw new Error('User not found or email not available');
    }

    // Re-send invite email using admin.inviteUserByEmail
    const { error: inviteError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(authUser.user.email, {
        redirectTo: getURL('/auth/callback?redirectTo=/auth/update-password'),
        data: authUser.user.user_metadata
      });

    if (inviteError) {
      throw new Error(`Failed to send welcome email: ${inviteError.message}`);
    }

    return { success: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to send welcome email';
    throw new Error(errorMessage);
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
          role: data.role as 'admin' | 'user'
        }
      ]);

      if (roleError) {
        console.error('Role update error:', roleError);
      }
    }

    revalidatePath('/admin/users');
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

    // The database cascades will handle the rest via RLS policies
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete user';
    throw new Error(errorMessage);
  }
}

// Create new organisation
export async function createOrganisation(data: CreateOrganisationData) {
  await verifyAdminAccess();

  try {
    const { data: organisation, error } = await supabaseAdmin
      .from('organisations')
      .insert([
        {
          name: data.name,
          name_uk: data.name_uk || null,
          slug: data.slug
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create organisation: ${error.message}`);
    }

    revalidatePath('/admin/organisations');
    return { success: true, organisation };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create organisation';
    throw new Error(errorMessage);
  }
}

// Update organisation
export async function updateOrganisation(
  organisationId: string,
  data: UpdateOrganisationData
) {
  await verifyAdminAccess();

  try {
    const { data: organisation, error } = await supabaseAdmin
      .from('organisations')
      .update(data)
      .eq('id', organisationId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update organisation: ${error.message}`);
    }

    revalidatePath('/admin/organisations');
    return { success: true, organisation };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to update organisation';
    throw new Error(errorMessage);
  }
}

// Delete organisation
export async function deleteOrganisation(organisationId: string) {
  await verifyAdminAccess();

  try {
    const { error } = await supabaseAdmin
      .from('organisations')
      .delete()
      .eq('id', organisationId);

    if (error) {
      throw new Error(`Failed to delete organisation: ${error.message}`);
    }

    revalidatePath('/admin/organisations');
    return { success: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete organisation';
    throw new Error(errorMessage);
  }
}

// Send magic link
export async function sendMagicLink(userId: string) {
  await verifyAdminAccess();

  try {
    // Get user email
    const { data: authUser, error: getUserError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (getUserError || !authUser.user?.email) {
      throw new Error('User not found or email not available');
    }

    // Send magic link
    const { error: magicError } = await supabaseAdmin.auth.signInWithOtp({
      email: authUser.user.email,
      options: {
        emailRedirectTo: getURL('/auth/callback')
      }
    });

    if (magicError) {
      throw new Error(`Failed to send magic link: ${magicError.message}`);
    }

    return { success: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to send magic link';
    throw new Error(errorMessage);
  }
}

// Reset user password (admin sets new password)
export async function resetUserPassword(userId: string, newPassword: string) {
  await verifyAdminAccess();

  try {
    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword
      });

    if (updateError) {
      throw new Error(`Failed to reset password: ${updateError.message}`);
    }

    return { success: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to reset password';
    throw new Error(errorMessage);
  }
}

// Organisation member management functions

export type AddMemberData = {
  user_id: string;
  organisation_id: string;
  role: string;
};

export type UpdateMemberData = {
  role: string;
};

// Add member to organisation
export async function addMemberToOrganisation(data: AddMemberData) {
  await verifyAdminAccess();

  try {
    const { error } = await supabaseAdmin
      .from('organisation_memberships')
      .insert([
        {
          user_id: data.user_id,
          organisation_id: data.organisation_id,
          role: data.role
        }
      ]);

    if (error) {
      throw new Error(`Failed to add member: ${error.message}`);
    }

    revalidatePath('/admin/organisations');
    revalidatePath(`/admin/organisations/${data.organisation_id}`);
    revalidatePath(`/admin/organisations/${data.organisation_id}/manage`);
    return { success: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to add member';
    throw new Error(errorMessage);
  }
}

// Update member role
export async function updateMemberRole(
  membershipId: string,
  data: UpdateMemberData
) {
  await verifyAdminAccess();

  try {
    const { error } = await supabaseAdmin
      .from('organisation_memberships')
      .update({ role: data.role })
      .eq('id', membershipId);

    if (error) {
      throw new Error(`Failed to update member role: ${error.message}`);
    }

    revalidatePath('/admin/organisations');
    revalidatePath(`/admin/organisations/*`);
    return { success: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to update member role';
    throw new Error(errorMessage);
  }
}

// Remove member from organisation
export async function removeMemberFromOrganisation(
  membershipId: string,
  organisationId: string
) {
  await verifyAdminAccess();

  try {
    const { error } = await supabaseAdmin
      .from('organisation_memberships')
      .delete()
      .eq('id', membershipId);

    if (error) {
      throw new Error(`Failed to remove member: ${error.message}`);
    }

    revalidatePath('/admin/organisations');
    revalidatePath(`/admin/organisations/${organisationId}`);
    revalidatePath(`/admin/organisations/${organisationId}/manage`);
    return { success: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to remove member';
    throw new Error(errorMessage);
  }
}

// Get organisation by ID with members
export async function getOrganisationById(
  organisationId: string
): Promise<AdminOrganisation | null> {
  await verifyAdminAccess();

  const { data: organisation, error } = await supabaseAdmin
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
    .eq('id', organisationId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch organisation: ${error.message}`);
  }

  return organisation;
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

// Properly escape a CSV field value according to RFC 4180
function escapeCsvField(value: string): string {
  if (!value) return '""';

  // Always escape any existing double quotes by doubling them
  const escapedValue = value.replace(/"/g, '""');

  // Always wrap in double quotes for consistency and safety
  return `"${escapedValue}"`;
}

// Export users data as CSV
export async function exportUsersCSV(): Promise<string> {
  await verifyAdminAccess();

  try {
    // Get all users with pagination handling
    const allAuthUsers = [];
    let page = 1;
    const perPage = 1000; // Max users per page is 1000

    while (true) {
      const {
        data: { users: pageUsers },
        error: pageError
      } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });

      if (pageError) {
        throw new Error(
          `Failed to fetch users on page ${page}: ${pageError.message}`
        );
      }

      allAuthUsers.push(...pageUsers);
      console.log(
        `Fetched ${pageUsers.length} users from page ${page} (total: ${allAuthUsers.length})`
      );

      if (pageUsers.length < perPage) {
        break;
      }
      page++;

      // Safety limit to prevent infinite loops
      if (page > 100) {
        console.log(
          'Warning: Reached maximum page limit (100) - there may be more users'
        );
        break;
      }
    }

    console.log(
      `Total users fetched: ${allAuthUsers.length} across ${page} pages`
    );

    const userIds = allAuthUsers.map((user) => user.id);

    // Get public user data in batches to avoid query limits
    let publicUsers: Array<{
      id: string;
      full_name: string | null;
      birthdate: string | null;
      marketing_consent: boolean | null;
      is_active: boolean;
    }> = [];
    const batchSize = 100; // Reduced batch size to avoid URI too long error

    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);
      console.log(
        `Fetching public user data batch ${Math.floor(i / batchSize) + 1} (${batch.length} users)`
      );

      const { data: batchUsers, error: publicError } = await supabaseAdmin
        .from('users')
        .select('id, full_name, birthdate, marketing_consent, is_active')
        .in('id', batch);

      if (publicError) {
        throw new Error(
          `Failed to fetch user profiles (batch ${Math.floor(i / batchSize) + 1}): ${publicError.message}`
        );
      }

      if (batchUsers) {
        publicUsers = publicUsers.concat(batchUsers);
      }
    }

    console.log(`Fetched public data for ${publicUsers.length} users`);

    // Calculate age from birthdate
    const calculateAge = (birthdate: string | null): number | null => {
      if (!birthdate) return null;
      const today = new Date();
      const birth = new Date(birthdate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }
      return age;
    };

    // Combine auth and public user data
    const exportData = allAuthUsers
      .filter((authUser) => authUser.email)
      .map((authUser) => {
        const publicUser = publicUsers?.find((p) => p.id === authUser.id);
        const age = publicUser?.birthdate
          ? calculateAge(publicUser.birthdate)
          : null;

        return {
          email: authUser.email || '',
          full_name: publicUser?.full_name || '',
          birthdate: publicUser?.birthdate
            ? format(new Date(publicUser.birthdate), 'MM/dd/yyyy')
            : '',
          age: age !== null ? age.toString() : '',
          marketing_consent: publicUser?.marketing_consent ? 'Yes' : 'No',
          is_archived: publicUser?.is_active === false ? 'Yes' : 'No',
          created_at: authUser.created_at
            ? format(new Date(authUser.created_at), 'MM/dd/yyyy')
            : '',
          last_sign_in_at: authUser.last_sign_in_at
            ? format(new Date(authUser.last_sign_in_at), 'MM/dd/yyyy')
            : ''
        };
      });

    // Create CSV content
    const headers = [
      'Email',
      'Full Name',
      'Birth Date',
      'Age',
      'Marketing Consent',
      'Is Archived',
      'Created At',
      'Last Sign In'
    ];

    const csvRows = [
      headers.map(escapeCsvField).join(','),
      ...exportData.map((row) =>
        [
          escapeCsvField(row.email),
          escapeCsvField(row.full_name),
          escapeCsvField(row.birthdate),
          escapeCsvField(row.age),
          escapeCsvField(row.marketing_consent),
          escapeCsvField(row.is_archived),
          escapeCsvField(row.created_at),
          escapeCsvField(row.last_sign_in_at)
        ].join(',')
      )
    ];

    return csvRows.join('\n');
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to export users';
    throw new Error(errorMessage);
  }
}

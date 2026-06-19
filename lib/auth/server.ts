'use server';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient, UserWithRoles } from '@/lib/supabase/server';
import { USER_PROFILE_WITH_ROLES } from '@/lib/supabase/columns';
import { hasAdminRole } from '@/lib/auth/roles';
import { redirect } from 'next/navigation';
import { getErrorRedirect, getStatusRedirect, getURL } from 'utils/helpers';
import type { User } from '@supabase/supabase-js';

function isValidEmail(email: string) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

const USER_PROFILE_SELECT = USER_PROFILE_WITH_ROLES;

/** Session-scoped cache key derived from Supabase auth cookies (not shared across users). */
async function getAuthCacheKey(): Promise<string> {
  const cookieStore = await cookies();
  const authCookie = cookieStore
    .getAll()
    .filter(({ name }) => name.includes('-auth-token'))
    .map(({ name, value }) => `${name}:${value?.slice(0, 32) ?? ''}`)
    .join('|');
  return authCookie || 'anonymous';
}

const getSessionUserCached = cache(
  async (_cacheKey: string): Promise<{ user: User | null }> => {
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    return { user };
  }
);

export async function getSessionUser(): Promise<{ user: User | null }> {
  const cacheKey = await getAuthCacheKey();
  return getSessionUserCached(cacheKey);
}

const getUserProfileById = cache(
  async (userId: string): Promise<UserWithRoles | null> => {
    const supabase = createClient();
    const { data: profileData } = await supabase
      .from('users')
      .select(USER_PROFILE_SELECT)
      .eq('id', userId)
      .single();

    return profileData as UserWithRoles | null;
  }
);

export async function getUserProfile(): Promise<UserWithRoles | null> {
  const { user } = await getSessionUser();
  if (!user) return null;
  return getUserProfileById(user.id);
}

/** Auth session + profile; deduplicated per request via keyed cache(). */
export async function getCurrentUser(): Promise<{
  user: User | null;
  profileData: UserWithRoles | null;
}> {
  const { user } = await getSessionUser();
  const profileData = user ? await getUserProfileById(user.id) : null;
  return { user, profileData };
}

export async function redirectToPath(path: string) {
  return redirect(path);
}

/**
 * Returns whether the current session user is active (for use after OAuth/setSession).
 * No DB access from browser: call this server action from the client.
 */
export async function getCurrentUserActiveStatus(): Promise<{
  active: boolean;
} | null> {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('users')
    .select('is_active')
    .eq('id', user.id)
    .single();
  if (!data || typeof data.is_active !== 'boolean') return null;
  return { active: data.is_active };
}

export async function SignOut(formData?: FormData) {
  const pathName = String(formData?.get('pathName') || '/').trim();

  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return getErrorRedirect(
      pathName,
      'Hmm... Something went wrong.',
      'You could not be signed out.'
    );
  }

  return '/auth/login';
}

export async function SignIn(email: string, password: string) {
  const supabase = createClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw new Error(error.message);
  }

  if (authData.user) {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_active, roles(role)')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      console.error('Error checking user status:', userError);
    } else if (userData?.is_active === false) {
      await supabase.auth.signOut();
      throw new Error(
        'Your account has been deactivated. Please contact an administrator.'
      );
    }

    const roles =
      userData?.roles?.map((item: { role: string }) => item.role) ?? [];
    if (roles.includes('admin')) {
      return '/admin';
    }
    if (roles.includes('teacher')) {
      return '/teacher';
    }
  }

  return '/';
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password')).trim();
  const passwordConfirm = String(formData.get('passwordConfirm')).trim();

  // Check that the password and confirmation match
  if (password !== passwordConfirm) {
    return getErrorRedirect(
      '/auth/update-password',
      'Your password could not be updated.',
      'Passwords do not match.'
    );
  }

  const supabase = createClient();
  const { error, data } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    return getErrorRedirect(
      '/auth/update-password',
      'Your password could not be updated.',
      error.message
    );
  } else if (data.user) {
    return getStatusRedirect(
      '/auth/login',
      'Success!',
      'Your password has been updated.'
    );
  } else {
    return getErrorRedirect(
      '/auth/update-password',
      'Hmm... Something went wrong.',
      'Your password could not be updated.'
    );
  }
}

export async function updateEmail(formData: FormData) {
  // Get form data
  const newEmail = String(formData.get('newEmail')).trim();

  // Check that the email is valid
  if (!isValidEmail(newEmail)) {
    return getErrorRedirect(
      '/',
      'Your email could not be updated.',
      'Invalid email address.'
    );
  }

  const supabase = createClient();

  const callbackUrl = getURL(
    getStatusRedirect('/', 'Success!', `Your email has been updated.`)
  );

  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    {
      emailRedirectTo: callbackUrl
    }
  );

  if (error) {
    return getErrorRedirect(
      '/account',
      'Your email could not be updated.',
      error.message
    );
  } else {
    return getStatusRedirect(
      '/account',
      'Confirmation emails sent.',
      `You will need to confirm the update by clicking the links sent to both the old and new email addresses.`
    );
  }
}

export async function updateName(formData: FormData) {
  // Get form data
  const fullName = String(formData.get('fullName')).trim();

  const supabase = createClient();
  const { error, data } = await supabase.auth.updateUser({
    data: { full_name: fullName }
  });

  if (error) {
    return getErrorRedirect(
      '/account',
      'Your name could not be updated.',
      error.message
    );
  } else if (data.user) {
    return getStatusRedirect(
      '/account',
      'Success!',
      'Your name has been updated.'
    );
  } else {
    return getErrorRedirect(
      '/account',
      'Hmm... Something went wrong.',
      'Your name could not be updated.'
    );
  }
}

/**
 * Verifies that the current user has admin role.
 * Throws an error if user is not authenticated or not an admin.
 * Returns the user ID if successful.
 *
 * This function uses getCurrentUser cache to avoid duplicate database queries.
 */
export async function verifyAdminAccess(): Promise<string> {
  const { user, profileData } = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
    throw new Error('Unauthorized: User not authenticated');
  }

  if (!profileData) {
    redirect('/');
    throw new Error('User profile not found');
  }

  if (!hasAdminRole(profileData)) {
    redirect('/');
    throw new Error('Unauthorized: Admin access required');
  }

  return user.id;
}

/**
 * Gets the current user and verifies admin access.
 * Returns user and profile data if admin, otherwise redirects.
 * Uses getCurrentUser cache to avoid duplicate queries.
 */
export async function getAdminUser(): Promise<{
  userId: string;
  user: User;
  profileData: UserWithRoles;
}> {
  const { user, profileData } = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
    throw new Error('Unauthorized: User not authenticated');
  }

  if (!profileData) {
    redirect('/');
    throw new Error('User profile not found');
  }

  if (!hasAdminRole(profileData)) {
    redirect('/');
    throw new Error('Unauthorized: Admin access required');
  }

  return {
    userId: user.id,
    user,
    profileData
  };
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get('email')).trim();

  if (!isValidEmail(email)) {
    return getErrorRedirect(
      '/auth/forgot-password',
      'Invalid email address.',
      'Please enter a valid email address.'
    );
  }

  const supabase = createClient();
  const supabaseAdmin = createAdminClient();

  try {
    const { data: authUserId, error: authLookupError } =
      await supabaseAdmin.rpc('get_auth_user_id_by_email', { p_email: email });

    if (authLookupError) {
      console.error('Error looking up auth user by email:', authLookupError);
    } else if (authUserId) {
      const { data: userData, error: userDataError } = await supabaseAdmin
        .from('users')
        .select('is_active')
        .eq('id', authUserId)
        .single();

      if (userDataError) {
        console.error('Error checking user active status:', userDataError);
      } else if (userData?.is_active === false) {
        return getErrorRedirect(
          '/auth/forgot-password',
          'Your account has been deactivated.',
          'Please contact an administrator for assistance.'
        );
      }
    }

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getURL('/auth/callback?redirectTo=/auth/update-password')
    });

    if (error) {
      return getErrorRedirect(
        '/auth/forgot-password',
        'Unable to send password reset email.',
        error.message
      );
    }

    return getStatusRedirect(
      '/auth/forgot-password',
      'Check your email.',
      'Password reset instructions sent.'
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An error occurred';
    return getErrorRedirect(
      '/auth/forgot-password',
      'Unable to send password reset email.',
      errorMessage
    );
  }
}

'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

/**
 * Update profile data
 */
export async function updateProfileAction(profileData: {
  fullName?: string;
  birthdate?: string | null;
  marketingConsent?: boolean;
}): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    // Prepare update data
    const updateData: {
      full_name?: string;
      birthdate?: string | null;
      marketing_consent?: boolean;
    } = {};

    if (profileData.fullName !== undefined)
      updateData.full_name = profileData.fullName;
    if (profileData.birthdate !== undefined)
      updateData.birthdate = profileData.birthdate;
    if (profileData.marketingConsent !== undefined)
      updateData.marketing_consent = profileData.marketingConsent;

    // Use admin client to update user profile data (bypasses RLS modify policy)
    const adminSupabase = createAdminClient();
    const { error: updateError } = await adminSupabase
      .from('users')
      .update(updateData)
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      return { success: false, error: 'Failed to update profile' };
    }

    // Revalidate profile pages for both admin and teacher areas
    revalidatePath('/admin/profile');
    revalidatePath('/teacher/profile');

    return { success: true };
  } catch (error) {
    console.error('Error in updateProfileAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Upload avatar image
 */
export async function uploadAvatarAction(file: File): Promise<{
  success: boolean;
  error?: string;
  avatarUrl?: string;
}> {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    // Generate unique filename with user ID as folder
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      return { success: false, error: 'Failed to upload avatar' };
    }

    // Get public URL
    const {
      data: { publicUrl }
    } = supabase.storage.from('avatars').getPublicUrl(filePath);

    // Update user profile with new avatar URL using admin client
    const adminSupabase = createAdminClient();
    const { error: updateError } = await adminSupabase
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating avatar URL:', updateError);
      // Try to clean up uploaded file
      await supabase.storage.from('avatars').remove([filePath]);
      return {
        success: false,
        error: 'Failed to update profile with new avatar'
      };
    }

    // Revalidate profile pages for both admin and teacher areas
    revalidatePath('/admin/profile');
    revalidatePath('/teacher/profile');

    return { success: true, avatarUrl: publicUrl };
  } catch (error) {
    console.error('Error in uploadAvatarAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Delete avatar image
 */
export async function deleteAvatarAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    // Get current avatar URL to extract file path
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    if (fetchError || !userData?.avatar_url) {
      return { success: false, error: 'No avatar to delete' };
    }

    // Extract file path from URL
    const url = new URL(userData.avatar_url);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(-2).join('/'); // Get "user-id/filename"

    // Delete file from storage
    const { error: deleteError } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (deleteError) {
      console.error('Error deleting avatar file:', deleteError);
      // Continue anyway to remove the URL from profile
    }

    // Update user profile to remove avatar URL using admin client
    const adminSupabase = createAdminClient();
    const { error: updateError } = await adminSupabase
      .from('users')
      .update({ avatar_url: null })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error removing avatar URL:', updateError);
      return { success: false, error: 'Failed to remove avatar from profile' };
    }

    // Revalidate profile pages for both admin and teacher areas
    revalidatePath('/admin/profile');
    revalidatePath('/teacher/profile');

    return { success: true };
  } catch (error) {
    console.error('Error in deleteAvatarAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Change user email (email/password auth only)
 */
export async function changeEmailAction(newEmail: string): Promise<{
  success: boolean;
  error?: string;
  message?: string;
}> {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  // Check if user is using email/password auth
  const provider = (user.app_metadata?.provider as string) || 'email';
  if (provider !== 'email') {
    return {
      success: false,
      error:
        'Email cannot be changed for social login accounts. This is managed by your social provider.'
    };
  }

  try {
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(newEmail)) {
      return { success: false, error: 'Invalid email format' };
    }

    // Check if email is the same as current
    if (user.email === newEmail) {
      return {
        success: false,
        error: 'New email is the same as current email'
      };
    }

    // Determine where to return after email confirmation.
    const { data: roleRows } = await supabase
      .from('roles')
      .select('role')
      .eq('user_id', user.id);
    const isAdmin = roleRows?.some((role) => role.role === 'admin') ?? false;
    const profileRedirectPath = isAdmin ? '/admin/profile' : '/teacher/profile';

    // Update email (this will send confirmation emails to both addresses)
    const { error: updateError } = await supabase.auth.updateUser(
      { email: newEmail },
      {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${profileRedirectPath}`
      }
    );

    if (updateError) {
      return {
        success: false,
        error: updateError.message || 'Failed to update email'
      };
    }

    return {
      success: true,
      message:
        'Confirmation emails sent. Please check both your current and new email addresses and click the links to complete the change.'
    };
  } catch (error) {
    console.error('Error in changeEmailAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Change user password (email/password auth only)
 */
export async function changePasswordAction(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { success: false, error: 'User not authenticated' };
  }

  // Check if user is using email/password auth
  const provider = (user.app_metadata?.provider as string) || 'email';
  if (provider !== 'email') {
    return {
      success: false,
      error:
        'Password cannot be changed for social login accounts. This is managed by your social provider.'
    };
  }

  try {
    // Validate passwords match
    if (data.newPassword !== data.confirmPassword) {
      return { success: false, error: 'New passwords do not match' };
    }

    // Validate password length
    if (data.newPassword.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters long'
      };
    }

    // Verify current password by attempting to sign in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: data.currentPassword
    });

    if (verifyError) {
      return { success: false, error: 'Current password is incorrect' };
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: data.newPassword
    });

    if (updateError) {
      return {
        success: false,
        error: updateError.message || 'Failed to update password'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in changePasswordAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

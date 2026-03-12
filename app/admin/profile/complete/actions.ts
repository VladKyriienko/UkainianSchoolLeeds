'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';
import {
  validateProfileCompletion,
  markUserCompletionComplete
} from '@/utils/auth-helpers/completion';

/**
 * Save profile data to the users table
 */
export async function saveProfileDataAction(profileData: {
  fullName?: string;
  birthdate?: string | null;
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
    } = {};

    if (profileData.fullName !== undefined)
      updateData.full_name = profileData.fullName;
    if (profileData.birthdate !== undefined)
      updateData.birthdate = profileData.birthdate;

    // Use admin client to update user profile data (bypasses RLS modify policy)
    const adminSupabase = createAdminClient();
    const { error: updateError } = await adminSupabase
      .from('users')
      .update(updateData)
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      return { success: false, error: 'Failed to save profile data' };
    }

    // Revalidate the page to ensure fresh data
    revalidatePath('/admin/profile/complete');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error in saveProfileDataAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Complete the user's profile (creates completion record if validation passes)
 */
export async function completeProfileAction(): Promise<{
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
    // Validate if user can complete their profile
    const validation = await validateProfileCompletion(user.id);

    if (!validation.canComplete) {
      return {
        success: false,
        error: `Please complete the following required fields: ${validation.missingRequiredFields.join(', ')}`
      };
    }

    // Mark profile as complete (only if validation passes)
    const result = await markUserCompletionComplete(user.id);

    if (!result) {
      return { success: false, error: 'Failed to save completion status' };
    }

    // Revalidate paths to ensure fresh data
    revalidatePath('/admin/profile/complete');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error in completeProfileAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Get profile validation status using the completion utility
 */
export async function getProfileValidationAction(): Promise<{
  success: boolean;
  error?: string;
  canComplete?: boolean;
  missingRequiredFields?: string[];
}> {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    const validation = await validateProfileCompletion(user.id);
    console.log('validation', validation);
    return {
      success: true,
      canComplete: validation.canComplete,
      missingRequiredFields: validation.missingRequiredFields
    };
  } catch (error) {
    console.error('Error in getProfileValidationAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

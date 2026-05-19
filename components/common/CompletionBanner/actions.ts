import {
  calculateProfileCompletion,
  calculateProfileCompletionFromUserRow,
  DEFAULT_COMPLETION_FIELDS
} from '@/lib/auth/completion';
import { getPostSignupSettings } from '@/lib/auth/settings';
import type { CompletionFieldConfig } from '@/lib/auth/completion';
import type { CompletionBannerData } from './types';

/**
 * Get completion banner data for a user.
 * Pass profileData when already loaded (e.g. from getCurrentUser) to avoid an extra DB round-trip.
 */
export async function getCompletionBannerData(
  userId?: string,
  fieldConfig?: CompletionFieldConfig[],
  profileData?: Record<string, unknown> | null
): Promise<CompletionBannerData | null> {
  if (!userId) {
    return null;
  }

  const postSignupSettings = getPostSignupSettings();
  const settings = {
    showCompletionBanner: postSignupSettings.requirePostSignupCompletion
  };

  if (!postSignupSettings.requirePostSignupCompletion) {
    return null;
  }

  const configToUse = fieldConfig || DEFAULT_COMPLETION_FIELDS;

  try {
    const completionData = profileData
      ? calculateProfileCompletionFromUserRow(profileData, configToUse)
      : await calculateProfileCompletion(userId, configToUse);

    if (completionData.percentage >= 100) {
      return null;
    }

    return {
      completionData,
      settings,
      postSignupSettings,
      fieldConfig: configToUse
    };
  } catch (error) {
    console.error('Error getting completion banner data:', error);
    return null;
  }
}

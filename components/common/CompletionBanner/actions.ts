import {
  calculateProfileCompletion,
  DEFAULT_COMPLETION_FIELDS
} from '@/utils/auth-helpers/completion';
import { getPostSignupSettings } from '@/utils/auth-helpers/settings';
import type { CompletionFieldConfig } from '@/utils/auth-helpers/completion';
import type { CompletionBannerData } from './types';

/**
 * Get completion banner data for a user
 */
export async function getCompletionBannerData(
  userId?: string,
  fieldConfig?: CompletionFieldConfig[]
): Promise<CompletionBannerData | null> {
  // Return null if no user ID provided
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

  // Use provided field config or default
  const configToUse = fieldConfig || DEFAULT_COMPLETION_FIELDS;

  try {
    // Calculate profile completion
    const completionData = await calculateProfileCompletion(
      userId,
      configToUse
    );

    // Don't show banner if profile is 100% complete
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

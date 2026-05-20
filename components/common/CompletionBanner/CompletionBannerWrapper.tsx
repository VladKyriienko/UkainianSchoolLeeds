import { CompletionBanner } from './CompletionBanner';
import { getCompletionBannerData } from './actions';
import { DEFAULT_COMPLETION_FIELDS } from '@/lib/auth/completion';
import type { CompletionFieldConfig } from '@/types';

type CompletionBannerWrapperProps = {
  userId?: string;
  fieldConfig?: CompletionFieldConfig[];
  className?: string;
  variant?: 'sidebar' | 'top-banner' | 'card';
  showDismiss?: boolean;
  onDismiss?: () => void;
  showCompleteProfileButton?: boolean;
};

export async function CompletionBannerWrapper({
  userId,
  fieldConfig = DEFAULT_COMPLETION_FIELDS,
  className,
  variant = 'card',
  showDismiss = false,
  onDismiss,
  showCompleteProfileButton = true
}: CompletionBannerWrapperProps) {
  const bannerData = await getCompletionBannerData(userId, fieldConfig);

  // Don't render if no data (banner disabled, user not found, or profile complete)
  if (!bannerData) {
    return null;
  }

  return (
    <CompletionBanner
      completionData={bannerData.completionData}
      settings={bannerData.settings}
      postSignupSettings={bannerData.postSignupSettings}
      fieldConfig={bannerData.fieldConfig}
      className={className || ''}
      variant={variant}
      showDismiss={showDismiss}
      {...(onDismiss && { onDismiss })}
      showCompleteProfileButton={showCompleteProfileButton}
    />
  );
}

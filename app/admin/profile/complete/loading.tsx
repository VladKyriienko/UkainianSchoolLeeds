import { FullPageLoader } from '@/components/common/FullPageLoader';

export default function CompleteProfileLoading() {
  return (
    <FullPageLoader
      message="Loading your profile information..."
      size="lg"
      variant="default"
    />
  );
}

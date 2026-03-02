import { getCurrentUser } from '@/utils/auth-helpers/server';
import { AuthenticatedHomeClient, PublicHomeClient } from './client';
import { AuthenticatedLayout } from '@/app/(authenticated)/AuthenticatedLayout';
import { PublicLayout } from '@/components/common/RootLayout/PublicLayout';
import { getCompletionBannerData } from '@/components/common/CompletionBanner';
import {
  getAccessibleRoutes,
  navigationRoutes
} from '@/utils/route-protection';

export default async function HomePage() {
  // Get user data (cached, deduplicated with layout.tsx)
  const { user, profileData } = await getCurrentUser();

  // Show different content based on authentication status
  if (user) {

    // Get completion banner data
    const completionBannerData = await getCompletionBannerData(user.id);

    // Get accessible navigation routes
    const navItems = getAccessibleRoutes(
      navigationRoutes,
      user,
      profileData?.roles[0]?.role
    );

    return (
      <AuthenticatedLayout
        navItems={navItems}
        completionBannerData={completionBannerData}
        mobileBurgerPosition="right"
        showDarkModeToggle={false}
        defaultOpen={true}
      >
        <AuthenticatedHomeClient />
      </AuthenticatedLayout>
    );
  }

  return (
    <PublicLayout showHeader={true} showDarkModeToggle={false} showFooter={true}>
      <PublicHomeClient />
    </PublicLayout>
  );
}

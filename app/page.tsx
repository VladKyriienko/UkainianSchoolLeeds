import { createClient, UserWithRoles } from '@/utils/supabase/server';
import { AuthenticatedHomeClient, PublicHomeClient } from './client';
import { AuthenticatedLayout } from '@/app/(authenticated)/AuthenticatedLayout';
import { PublicLayout } from '@/components/common/RootLayout/PublicLayout';
import { getCompletionBannerData } from '@/components/common/CompletionBanner';
import {
  getAccessibleRoutes,
  navigationRoutes
} from '@/utils/route-protection';

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  // Show different content based on authentication status
  if (user) {
    // Get user profile data
    const profileData: UserWithRoles | null = (
      await supabase
        .from('users')
        .select('*, roles(*)')
        .eq('id', user.id)
        .single()
    ).data;

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

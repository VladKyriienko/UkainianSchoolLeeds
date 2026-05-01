import { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/utils/auth-helpers/server';
import { hasAdminRole } from '@/utils/auth-helpers/roles';
import { getCompletionBannerData } from '@/components/common/CompletionBanner';
import { AuthenticatedLayout } from './AuthenticatedLayout';
import {
  getAccessibleRoutes,
  navigationRoutes
} from '@/utils/route-protection';

export default async function Layout({ children }: PropsWithChildren) {
  const { user, profileData } = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const completionBannerData = await getCompletionBannerData(
    user.id,
    undefined,
    profileData ?? undefined
  );

  // Get accessible navigation routes based on user role
  const navItems = getAccessibleRoutes(
    navigationRoutes,
    user,
    profileData?.roles[0]?.role
  );

  const isAdmin = hasAdminRole(profileData);

  return (
    <AuthenticatedLayout
      navItems={navItems}
      completionBannerData={completionBannerData}
      showLanguageToggle={!isAdmin}
      mobileBurgerPosition="right"
      showDarkModeToggle={false}
      defaultOpen={true}
    >
      {children}
    </AuthenticatedLayout>
  );
}

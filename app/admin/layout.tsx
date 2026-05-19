import { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/server';
import { hasAdminRole, hasTeacherRole } from '@/lib/auth/roles';
import { getCompletionBannerData } from '@/components/common/CompletionBanner';
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout';
import {
  getAccessibleRoutes,
  navigationRoutes
} from '@/utils/route-protection';

export default async function Layout({ children }: PropsWithChildren) {
  const { user, profileData } = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  if (!hasAdminRole(profileData)) {
    if (hasTeacherRole(profileData)) {
      redirect('/teacher');
    }
    redirect('/');
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

  const isAdmin = true;

  return (
    <AuthenticatedLayout
      navItems={navItems}
      completionBannerData={completionBannerData}
      showLanguageToggle={!isAdmin}
      mobileBurgerPosition="right"
      showDarkModeToggle={false}
      defaultOpen={true}
      disableCardHover
    >
      {children}
    </AuthenticatedLayout>
  );
}

import { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { createClient, UserWithRoles } from '@/utils/supabase/server';
import { getCompletionBannerData } from '@/components/common/CompletionBanner';
import { AuthenticatedLayout } from './AuthenticatedLayout';
import {
  getAccessibleRoutes,
  navigationRoutes
} from '@/utils/route-protection';

export default async function Layout({ children }: PropsWithChildren) {
  const supabase = createClient();

  // Get user data
  const {
    data: { user }
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/auth/login');
  }

  // Get user profile data from users table
  const profileData: UserWithRoles | null = (
    await supabase
      .from('users')
      .select('*, roles(*)')
      .eq('id', user.id)
      .single()
  ).data;

  // Get completion banner data
  const completionBannerData = await getCompletionBannerData(user.id);

  // Get accessible navigation routes based on user role
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
      {children}
    </AuthenticatedLayout>
  );
}

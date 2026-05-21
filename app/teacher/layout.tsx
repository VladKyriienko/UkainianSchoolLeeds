import { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/server';
import { hasAdminRole, hasTeacherRole } from '@/lib/auth/roles';
import { getCompletionBannerData } from '@/components/common/CompletionBanner';
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout';
import type { RouteConfig } from '@/utils/route-protection';

/** Teacher routes require session cookies — skip static prerender at build time. */
export const dynamic = 'force-dynamic';

const teacherNavigation: RouteConfig[] = [
  {
    path: '/teacher',
    label: 'Home',
    icon: 'Home',
    requiredRole: 'teacher',
    requiresAuth: true
  },
  {
    path: '/teacher/class-gallery',
    label: 'Class Gallery',
    icon: 'Images',
    requiredRole: 'teacher',
    requiresAuth: true
  },
  {
    path: '/teacher/class',
    label: 'Class',
    icon: 'School',
    requiredRole: 'teacher',
    requiresAuth: true
  }
];

export default async function TeacherLayout({ children }: PropsWithChildren) {
  const { user, profileData } = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  if (hasAdminRole(profileData)) {
    redirect('/admin');
  }

  if (!hasTeacherRole(profileData)) {
    redirect('/');
  }

  const completionBannerData = await getCompletionBannerData(
    user.id,
    undefined,
    profileData ?? undefined
  );

  return (
      <AuthenticatedLayout
        navItems={teacherNavigation}
        completionBannerData={completionBannerData}
        showLanguageToggle={true}
        mobileBurgerPosition="right"
        showDarkModeToggle={false}
        defaultOpen={true}
      >
      {children}
    </AuthenticatedLayout>
  );
}

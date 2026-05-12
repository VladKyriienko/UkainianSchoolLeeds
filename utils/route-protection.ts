import type { UserRole, RouteConfig } from '@/types';

export type { UserRole, RouteConfig };

export const navigationRoutes: RouteConfig[] = [
  {
    path: '/admin',
    label: 'Home',
    icon: 'Home',
    requiredRole: 'admin',
    requiresAuth: true
  },
  {
    path: '/admin/users',
    label: 'User Management',
    icon: 'Users',
    requiredRole: 'admin',
    requiresAuth: true
  },
  {
    path: '/admin/teachers',
    label: 'Teachers',
    icon: 'GraduationCap',
    requiredRole: 'admin',
    requiresAuth: true
  },
  {
    path: '/admin/events',
    label: 'Events',
    icon: 'Calendar',
    requiredRole: 'admin',
    requiresAuth: true
  },
  {
    path: '/admin/donations',
    label: 'Donations',
    icon: 'PoundSterling',
    requiredRole: 'admin',
    requiresAuth: true
  },
  {
    path: '/admin/messages',
    label: 'Messages',
    icon: 'MessageSquare',
    requiredRole: 'admin',
    requiresAuth: true
  },
  {
    path: '/admin/documents',
    label: 'Documents',
    icon: 'FileText',
    requiredRole: 'admin',
    requiresAuth: true
  },
  {
    path: '/admin/news',
    label: 'News',
    icon: 'Newspaper',
    requiredRole: 'admin',
    requiresAuth: true
  },
  {
    path: '/admin/reviews',
    label: 'Reviews',
    icon: 'Star',
    requiredRole: 'admin',
    requiresAuth: true
  },
  {
    path: '/admin/classes',
    label: 'Classes',
    icon: 'BookOpen',
    requiredRole: 'admin',
    requiresAuth: true
  },
  {
    path: '/admin/class-gallery',
    label: 'Class Gallery',
    icon: 'Images',
    requiredRole: 'admin',
    requiresAuth: true
  },
  {
    path: '/admin/schedule',
    label: 'Schedule',
    icon: 'CalendarClock',
    requiredRole: 'admin',
    requiresAuth: true
  }
];

export const adminPathPrefixes = ['/admin'] as const;

export function isAdminPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === '/admin' || pathname.startsWith('/admin/');
}

export function getAccessibleRoutes(
  routes: RouteConfig[],
  user?: { id: string; email?: string } | null,
  userRole?: UserRole
): RouteConfig[] {
  return routes
    .filter((route) => {
      // If route requires authentication and user is not logged in
      if (route.requiresAuth && !user) {
        return false;
      }

      // If route requires a specific role and user doesn't have it
      if (route.requiredRole && route.requiredRole !== userRole) {
        return false;
      }

      return true;
    })
    .map((route) => {
      const accessibleChildren = route.children
        ? getAccessibleRoutes(route.children, user, userRole)
        : undefined;

      return {
        ...route,
        ...(accessibleChildren && { children: accessibleChildren })
      };
    });
}

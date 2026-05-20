import type { ValidLucideIconName } from '@/utils/lucide-icons';

export type UserRole = 'admin' | 'teacher' | 'user' | null;

export type RouteConfig = {
  path: string;
  label: string;
  icon: ValidLucideIconName;
  requiredRole?: UserRole;
  requiresAuth?: boolean;
  children?: RouteConfig[];
};

export type NavItem = {
  label: string;
  href: string;
  key: string;
  children?: { label: string; href: string }[];
};

export type Language = 'en' | 'uk';

import type { ValidLucideIconName } from '@/utils/lucide-icons';

// Route & auth
export type UserRole = 'admin' | 'user' | null;

export type RouteConfig = {
  path: string;
  label: string;
  icon: ValidLucideIconName;
  requiredRole?: UserRole;
  requiresAuth?: boolean;
  children?: RouteConfig[];
};

// Navigation
export type NavItem = {
  label: string;
  href: string;
  key: string;
  children?: { label: string; href: string }[];
};

// Language
export type Language = 'en' | 'uk';

// Re-exports from other modules
export type { DocumentType } from '@/app/admin/documents/constants';

export type {
  CompletionData,
  CompletionBannerData
} from '@/components/common/CompletionBanner/types';

export type { Database, Tables, Enums } from '@/utils/supabase/types';

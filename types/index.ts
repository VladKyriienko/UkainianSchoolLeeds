import type { ValidLucideIconName } from '@/utils/lucide-icons';
import type { Tables } from '@/utils/supabase/types';

// Route & auth
export type UserRole = 'admin' | 'teacher' | 'user' | null;

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

/** Public news row with resolved storage URL for the list card image. */
export type PublicNews = Tables<'news'> & {
  photoUrl: string | null;
};

/** Home “school atmosphere” strip — rows from `class_photo_galery` with public URLs. */
export type SchoolAtmosphereGalleryImage = {
  id: string;
  src: string;
  altEn: string;
  altUk: string | null;
};

/** Public home — parent testimonial rows from `review` (anon RLS SELECT). */
export type PublicParentVoiceReview = Pick<
  Tables<'review'>,
  'id' | 'content' | 'content_uk' | 'perens' | 'perens_uk'
>;

/** Props for the public marketing home client (`/`). */
export type PublicHomeClientProps = {
  initialNews: PublicNews[];
  /** From `class_photo_galery`; when empty, `HOME_CONTENT.schoolAtmosphere.images` is used. */
  atmosphereGalleryImages: SchoolAtmosphereGalleryImage[];
  /** From `review`; when empty, the parent-voices carousel is hidden. */
  parentVoices: PublicParentVoiceReview[];
};

// Re-exports from other modules
export type { DocumentType } from '@/app/admin/documents/constants';

export type {
  CompletionData,
  CompletionBannerData
} from '@/components/common/CompletionBanner/types';

export type { Database, Tables, Enums } from '@/utils/supabase/types';

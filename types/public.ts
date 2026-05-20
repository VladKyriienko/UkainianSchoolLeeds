import type { Tables } from '@/lib/supabase/types';
import type { PublicEvent } from '@/types/calendar';

export type PublicNews = Tables<'news'> & {
  photoUrl: string | null;
};

export type SchoolAtmosphereGalleryImage = {
  id: string;
  src: string;
  altEn: string;
  altUk: string | null;
};

export type PublicParentVoiceReview = Pick<
  Tables<'review'>,
  'id' | 'content' | 'content_uk' | 'perens' | 'perens_uk'
>;

export type PublicHomeClientProps = {
  initialNews: PublicNews[];
  initialEvents: PublicEvent[];
  atmosphereGalleryImages: SchoolAtmosphereGalleryImage[];
  parentVoices: PublicParentVoiceReview[];
};

export type PublicClass = Tables<'classes'>;

export type PublicTeacher = Tables<'teachers'> & {
  photoUrl: string | null;
};

export type CreateMessageInput = {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
};

export type PublicCookiesPolicyDocument = {
  id: string;
  title: string;
  title_uk: string | null;
  content: string;
  content_uk: string | null;
  created_at: string;
};

export type PublicPrivacyPolicyDocument = PublicCookiesPolicyDocument;

export type PublicKeyInfoDocument = {
  id: string;
  title: string;
  title_uk: string | null;
  content: string;
  content_uk: string | null;
  created_at: string;
};

export type PublicKeyInfoDocumentSummary = Pick<
  PublicKeyInfoDocument,
  'id' | 'title' | 'title_uk' | 'created_at'
> & {
  slug: string;
};

export type ParentVoiceItem = { quote: string; attribution: string };

export type AtmosphereStripImage = {
  key: string;
  src: string;
  alt: string;
};

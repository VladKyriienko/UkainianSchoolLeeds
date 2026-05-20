import { DOCUMENT_TYPES } from '@/app/admin/documents/constants';
import type { Tables } from '@/lib/supabase/types';

export type OrganisationMembership = {
  id: string;
  user_id: string;
  organisation_id: string;
  role: string;
  organisation?: {
    id: string;
    name: string;
    slug: string;
  };
  user?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
};

export type AdminUser = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  email_confirmed_at?: string;
  created_at?: string;
  last_sign_in_at?: string;
  role?: string;
  is_active?: boolean;
  teacher_class_id?: string | null;
  organisations?: OrganisationMembership[];
};

export type CreateUserData = {
  email: string;
  full_name?: string;
  role?: 'admin' | 'teacher' | 'user';
  class_id?: string;
  organisation_id?: string;
  organisation_role?: string;
};

export type UpdateUserData = {
  email?: string;
  full_name?: string;
  role?: string;
  class_id?: string;
  password?: string;
};

export type AdminOrganisation = {
  organisation_memberships?: OrganisationMembership[];
} & Tables<'organisations'>;

export type AdminDashboardStats = {
  usersCount: number;
  teachersTotal: number;
  eventsTotal: number;
  messagesTotal: number;
  donationsTotal: number;
  documentsTotal: number;
  newsTotal: number;
  reviewsTotal: number;
  classesTotal: number;
  galleryTotal: number;
  schoolGalleryTotal: number;
};

export type AdminSchedule = {
  id: string;
  date: string;
  file: string;
  created_at: string;
  publicUrl: string;
};

export type AdminClass = Tables<'classes'>;
export type AdminDocument = Tables<'documents'>;
export type AdminDonation = Tables<'donations'>;
export type AdminEvent = Tables<'events'>;
export type AdminMessage = Tables<'messages'>;
export type AdminNews = Tables<'news'>;
export type AdminReview = Tables<'review'>;
export type AdminTeacher = Tables<'teachers'>;
export type AdminSchoolGalleryItem = Tables<'gallery'>;
export type AdminGalleryItem = Tables<'class_photo_galery'>;
export type GalleryClass = Tables<'classes'>;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

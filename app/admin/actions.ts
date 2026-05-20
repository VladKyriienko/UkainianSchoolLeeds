'use server';

import { getUsersCount } from '@/app/admin/users/actions';
import { listTeachers } from '@/app/admin/teachers/actions';
import { listEvents } from '@/app/admin/events/actions';
import { listMessages } from '@/app/admin/messages/actions';
import { listDonations } from '@/app/admin/donations/actions';
import { listDocuments } from '@/app/admin/documents/actions';
import { listNews } from '@/app/admin/news/actions';
import { listClasses } from '@/app/admin/classes/actions';
import { listGalleryItems } from '@/lib/class-gallery/actions';
import { listSchoolGalleryItems } from '@/app/admin/gallery/actions';
import { listReviews } from '@/app/admin/reviews/actions';
import type { AdminDashboardStats } from '@/types';

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [
    usersCount,
    teachersResult,
    eventsResult,
    messagesResult,
    donationsResult,
    documentsResult,
    newsResult,
    reviewsResult,
    classesResult,
    galleryResult,
    schoolGalleryResult
  ] = await Promise.all([
    getUsersCount(),
    listTeachers({ page: 1, limit: 1 }),
    listEvents({ page: 1, limit: 1 }),
    listMessages({ page: 1, limit: 1 }),
    listDonations({ page: 1, limit: 1 }),
    listDocuments({ page: 1, limit: 1 }),
    listNews({ page: 1, limit: 1 }),
    listReviews({ page: 1, limit: 1 }),
    listClasses({ page: 1, limit: 1 }),
    listGalleryItems({ page: 1, limit: 1 }),
    listSchoolGalleryItems({ page: 1, limit: 1 })
  ]);

  return {
    usersCount,
    teachersTotal: teachersResult.total,
    eventsTotal: eventsResult.total,
    messagesTotal: messagesResult.total,
    donationsTotal: donationsResult.total,
    documentsTotal: documentsResult.total,
    newsTotal: newsResult.total,
    reviewsTotal: reviewsResult.total,
    classesTotal: classesResult.total,
    galleryTotal: galleryResult.total,
    schoolGalleryTotal: schoolGalleryResult.total
  };
}

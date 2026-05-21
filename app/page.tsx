import { getCurrentUser } from '@/lib/auth/server';
import { hasAdminRole, hasTeacherRole } from '@/lib/auth/roles';
import { redirect } from 'next/navigation';
import { PublicHomeClient } from './client';
import { PublicLayout } from '@/components/common/RootLayout/PublicLayout';
import { getNews } from '@/app/(public)/parents/news/actions';
import { getUpcomingPublicEvents } from '@/app/(public)/parents/calendar/actions';
import {
  getPublicParentVoices,
  getSchoolAtmosphereGalleryImages
} from '@/lib/data/home';

const HOME_NEWS_LIMIT = 3;
const HOME_EVENTS_LIMIT = 3;

export default async function HomePage() {
  const { user, profileData } = await getCurrentUser();

  if (user && hasAdminRole(profileData)) {
    redirect('/admin');
  }
  if (user && hasTeacherRole(profileData)) {
    redirect('/teacher');
  }

  const [latestNews, upcomingEvents, atmosphereGalleryImages, parentVoices] =
    await Promise.all([
      getNews(HOME_NEWS_LIMIT),
      getUpcomingPublicEvents(HOME_EVENTS_LIMIT),
      getSchoolAtmosphereGalleryImages(),
      getPublicParentVoices()
    ]);

  return (
    <PublicLayout showHeader={true} showDarkModeToggle={false} showFooter={true}>
      <PublicHomeClient
        initialNews={latestNews}
        initialEvents={upcomingEvents}
        atmosphereGalleryImages={atmosphereGalleryImages}
        parentVoices={parentVoices}
      />
    </PublicLayout>
  );
}

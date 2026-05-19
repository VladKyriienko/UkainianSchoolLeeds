import { getCurrentUser } from '@/utils/auth-helpers/server';
import { hasAdminRole, hasTeacherRole } from '@/utils/auth-helpers/roles';
import { redirect } from 'next/navigation';
import { PublicHomeClient } from './client';
import { PublicLayout } from '@/components/common/RootLayout/PublicLayout';
import { getNews } from '@/app/(not-aunthenticated)/parents/news/actions';
import { getUpcomingPublicEvents } from '@/app/(not-aunthenticated)/parents/calendar/actions';
import { getPublicParentVoices, getSchoolAtmosphereGalleryImages } from './actions';

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

  const [allNews, upcomingEvents, atmosphereGalleryImages, parentVoices] =
    await Promise.all([
      getNews(),
      getUpcomingPublicEvents(HOME_EVENTS_LIMIT),
      getSchoolAtmosphereGalleryImages(),
      getPublicParentVoices()
    ]);
  const latestNews = allNews.slice(0, HOME_NEWS_LIMIT);

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

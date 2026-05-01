import { getCurrentUser } from '@/utils/auth-helpers/server';
import { hasAdminRole } from '@/utils/auth-helpers/roles';
import { redirect } from 'next/navigation';
import { PublicHomeClient } from './client';
import { PublicLayout } from '@/components/common/RootLayout/PublicLayout';
import { getNews } from '@/app/(not-aunthenticated)/parents/news/actions';

const HOME_NEWS_LIMIT = 3;

export default async function HomePage() {
  const { user, profileData } = await getCurrentUser();

  if (user && hasAdminRole(profileData)) {
    redirect('/admin');
  }

  const allNews = await getNews();
  const latestNews = allNews.slice(0, HOME_NEWS_LIMIT);

  return (
    <PublicLayout showHeader={true} showDarkModeToggle={false} showFooter={true}>
      <PublicHomeClient initialNews={latestNews} />
    </PublicLayout>
  );
}

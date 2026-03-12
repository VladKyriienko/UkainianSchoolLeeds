import NewsContent from './client';
import { PageWrapper } from '@/components/common/PageWrapper';
import { NEWS_CONTENT } from '@/content/news';
import { getNews } from './actions';

export default async function NewsPage() {
  const news = await getNews();
  return (
    <PageWrapper
      title={{
        en: NEWS_CONTENT.pageTitle,
        uk: NEWS_CONTENT.pageTitleUk
      }}
      description={{
        en: NEWS_CONTENT.pageDescription,
        uk: NEWS_CONTENT.pageDescriptionUk
      }}
    >
      <NewsContent news={news} />
    </PageWrapper>
  );
}

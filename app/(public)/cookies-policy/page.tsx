import { PageWrapper } from '@/components/common/PageWrapper';
import CookiesPolicyContent from './client';
import { getLatestCookiesPolicyDocument } from './actions';

const PAGE_CONTENT = {
  title: {
    en: 'Cookies Policy',
    uk: 'Політика cookies'
  },
  description: {
    en: 'How we use cookies and similar technologies.',
    uk: 'Як ми використовуємо cookies та подібні технології.'
  }
} as const;

export default async function CookiesPolicyPage() {
  const document = await getLatestCookiesPolicyDocument();
  return (
    <PageWrapper title={PAGE_CONTENT.title} description={PAGE_CONTENT.description}>
      <CookiesPolicyContent document={document} />
    </PageWrapper>
  );
}

import { PageWrapper } from '@/components/common/PageWrapper';
import PrivacyPolicyContent from './client';
import { getLatestPrivacyPolicyDocument } from './actions';

const PAGE_CONTENT = {
  title: {
    en: 'Privacy Policy',
    uk: 'Політика конфіденційності'
  },
  description: {
    en: 'How we collect, use, and protect personal data.',
    uk: 'Як ми збираємо, використовуємо та захищаємо персональні дані.'
  }
} as const;

export default async function PrivacyPolicyPage() {
  const document = await getLatestPrivacyPolicyDocument();

  return (
    <PageWrapper title={PAGE_CONTENT.title} description={PAGE_CONTENT.description}>
      <PrivacyPolicyContent document={document} />
    </PageWrapper>
  );
}

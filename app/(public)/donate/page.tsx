import DonateClient from './client';
import { PageWrapper } from '@/components/common/PageWrapper';
import { DONATE_CONTENT } from '@/content/donate';

export default function DonatePage() {
  return (
    <PageWrapper
      title={{
        en: DONATE_CONTENT.en.pageTitle,
        uk: DONATE_CONTENT.uk.pageTitle
      }}
      description={{
        en: DONATE_CONTENT.en.pageDescription,
        uk: DONATE_CONTENT.uk.pageDescription
      }}
    >
      <DonateClient />
    </PageWrapper>
  );
}

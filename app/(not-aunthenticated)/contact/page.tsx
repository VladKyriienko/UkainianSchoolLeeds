import ContactContent from '@/app/(not-aunthenticated)/contact/client';
import { PageWrapper } from '@/components/common/PageWrapper';
import { CONTACT_CONTENT } from '@/content/contact';

export default function ContactPage() {
  return (
    <PageWrapper
      title={{
        en: CONTACT_CONTENT.en.pageTitle,
        uk: CONTACT_CONTENT.uk.pageTitle
      }}
      description={{
        en: CONTACT_CONTENT.en.pageDescription,
        uk: CONTACT_CONTENT.uk.pageDescription
      }}
    >
      <ContactContent />
    </PageWrapper>
  );
}


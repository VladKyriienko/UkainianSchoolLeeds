import ContactContent from '@/app/(not-aunthenticated)/contact/client';
import { PageWrapper } from '@/components/common/PageWrapper';
import { CONTACT_COPY } from '@/content/contact';

export default function ContactPage() {
  // Server component: use English copy for initial render
  const copy = CONTACT_COPY.en;

  return (
    <PageWrapper
      title={copy.pageTitle}
      description={copy.pageDescription}
      className="py-8"
    >
      <ContactContent />
    </PageWrapper>
  );
}


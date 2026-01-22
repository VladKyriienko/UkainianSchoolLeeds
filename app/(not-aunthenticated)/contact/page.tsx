import ContactContent from '@/app/(not-aunthenticated)/contact/client';
import { PageWrapper } from '@/components/common/PageWrapper';

export default function ContactPage() {
  return (
    <PageWrapper title="Contact Us" description="Please fill out the form below to contact us." className="py-8 px-4">
      <ContactContent />
    </PageWrapper>
  );
}


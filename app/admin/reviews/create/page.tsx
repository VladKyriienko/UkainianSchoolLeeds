import { PageWrapper } from '@/components/common/PageWrapper';
import { ReviewForm } from '@/app/admin/components/ReviewForm';

export default async function CreateReviewPage() {
  return (
    <PageWrapper
      title="Add review"
      description="Create a parent testimonial for the public site."
    >
      <ReviewForm mode="create" />
    </PageWrapper>
  );
}

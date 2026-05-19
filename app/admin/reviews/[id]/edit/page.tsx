import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/common/PageWrapper';
import { ReviewForm } from '@/components/features/admin/ReviewForm';
import { getReviewById } from '@/app/admin/reviews/actions';

export default async function EditReviewPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let item = null;
  try {
    item = await getReviewById(id);
  } catch {
    // fallthrough
  }

  if (!item) {
    notFound();
  }

  return (
    <PageWrapper title="Edit review" description={`Editing: ${item.perens}`}>
      <ReviewForm mode="edit" reviewItem={item} />
    </PageWrapper>
  );
}

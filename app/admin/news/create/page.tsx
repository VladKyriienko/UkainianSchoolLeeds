import { PageWrapper } from '@/components/common/PageWrapper';
import { NewsForm } from '@/app/admin/components/NewsForm';

export default async function CreateNewsPage() {
  return (
    <PageWrapper
      title="Add news"
      description="Create a new news item for the public site."
    >
      <NewsForm mode="create" />
    </PageWrapper>
  );
}

import { notFound } from 'next/navigation';
import { createAdminClient } from '@/utils/supabase/admin';
import { PageWrapper } from '@/components/common/PageWrapper';
import { NewsForm } from '@/app/admin/components/NewsForm';
import { getNewsById } from '@/app/admin/news/actions';

export default async function EditNewsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let item = null;
  try {
    item = await getNewsById(id);
  } catch {
    // fallthrough
  }

  if (!item) {
    notFound();
  }

  const supabaseAdmin = createAdminClient();
  const currentPhotoUrl = item.photo
    ? supabaseAdmin.storage.from('news-photos').getPublicUrl(item.photo).data.publicUrl
    : null;

  return (
    <PageWrapper
      title="Edit news"
      description={`Editing: ${item.title}`}
    >
      <NewsForm mode="edit" newsItem={item} currentPhotoUrl={currentPhotoUrl} />
    </PageWrapper>
  );
}

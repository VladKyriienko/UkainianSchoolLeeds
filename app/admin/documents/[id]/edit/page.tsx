import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/common/PageWrapper';
import { DocumentForm } from '@/components/features/admin/DocumentForm';
import { getDocumentById } from '@/app/admin/documents/actions';

export default async function EditDocumentPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let doc = null;
  try {
    doc = await getDocumentById(id);
  } catch {
    // fallthrough
  }

  if (!doc) {
    notFound();
  }

  return (
    <PageWrapper
      title="Edit document"
      description={`Editing: ${doc.title}`}
    >
      <DocumentForm mode="edit" document={doc} />
    </PageWrapper>
  );
}

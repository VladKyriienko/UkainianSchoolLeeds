import { PageWrapper } from '@/components/common/PageWrapper';
import { DocumentForm } from '@/app/admin/components/DocumentForm';
import { listDocuments } from '@/app/admin/documents/actions';

const SINGLETON_DOCUMENT_TYPES = ['COOKIES_POLICY', 'PRIVACY_POLICY'] as const;

export default async function CreateDocumentPage() {
  const existingSingletonTypes = await Promise.all(
    SINGLETON_DOCUMENT_TYPES.map(async (type) => {
      const { total } = await listDocuments({ type, limit: 1 });
      return total > 0 ? type : null;
    })
  );
  const unavailableTypes = existingSingletonTypes.filter(
    (
      type
    ): type is (typeof SINGLETON_DOCUMENT_TYPES)[number] => type !== null
  );

  return (
    <PageWrapper
      title="Add document"
      description="Create a new document (policy or other content) for the public site."
    >
      <DocumentForm mode="create" unavailableTypes={unavailableTypes} />
    </PageWrapper>
  );
}

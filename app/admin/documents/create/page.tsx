import { PageWrapper } from '@/components/common/PageWrapper';
import { DocumentForm } from '@/app/admin/components/DocumentForm';

export default async function CreateDocumentPage() {
  return (
    <PageWrapper
      title="Add document"
      description="Create a new document (policy or other content) for the public site."
    >
      <DocumentForm mode="create" />
    </PageWrapper>
  );
}

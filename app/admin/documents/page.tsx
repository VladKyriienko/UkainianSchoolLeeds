import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DocumentsManagementTable from '@/app/admin/components/DocumentsManagementTable';
import { DocumentsSearchForm } from '@/app/admin/components/DocumentsSearchForm';
import { listDocuments } from '@/app/admin/documents/actions';
import { PaginationComponent } from '@/components/common/Pagination';
import { PaginationInfo } from '@/components/common/PaginationInfo';
import { PageWrapper } from '@/components/common/PageWrapper';

type AdminDocumentsPageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    type?: string;
  }>;
};

export default async function AdminDocumentsPage({
  searchParams
}: AdminDocumentsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const limit = parseInt(params.limit || '20', 10);
  const search = params.search || '';
  const type = params.type || '';

  let documents: Awaited<ReturnType<typeof listDocuments>>['documents'] = [];
  let totalDocuments = 0;
  let error: string | null = null;

  try {
    const result = await listDocuments({
      page,
      limit,
      ...(search && { search }),
      ...(type && { type })
    });
    documents = result.documents;
    totalDocuments = result.total;
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }

  const totalPages = Math.ceil(totalDocuments / limit) || 1;

  return (
    <PageWrapper
      title="Documents"
      description="Manage policy and other documents."
      actions={
        <Button asChild>
          <Link href="/admin/documents/create">
            <Plus className="h-4 w-4 mr-2" />
            Add document
          </Link>
        </Button>
      }
    >
      <DocumentsSearchForm initialSearch={search} initialType={type} />
      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading documents: {error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <PaginationInfo
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalDocuments}
            itemsPerPage={limit}
            itemName="documents"
            className="mb-4 mt-6"
          />
          <DocumentsManagementTable documents={documents} />
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/admin/documents"
            limit={limit}
            {...(search || type
              ? { searchParams: { ...(search && { search }), ...(type && { type }) } }
              : {})}
            className="mt-6"
          />
        </>
      )}
    </PageWrapper>
  );
}

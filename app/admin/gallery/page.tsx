import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import GalleryManagementTable from '@/app/admin/components/GalleryManagementTable';
import { listSchoolGalleryItems } from '@/app/admin/gallery/actions';
import { PaginationComponent } from '@/components/common/Pagination';
import { PaginationInfo } from '@/components/common/PaginationInfo';
import { PageWrapper } from '@/components/common/PageWrapper';

type AdminGalleryPageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
};

export default async function AdminGalleryPage({
  searchParams
}: AdminGalleryPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const limit = parseInt(params.limit || '20', 10);

  let items: Awaited<ReturnType<typeof listSchoolGalleryItems>>['items'] = [];
  let totalItems = 0;
  let error: string | null = null;

  try {
    const result = await listSchoolGalleryItems({ page, limit });
    items = result.items;
    totalItems = result.total;
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }

  const totalPages = Math.ceil(totalItems / limit) || 1;

  return (
    <PageWrapper
      title="Gallery"
      description="Manage photos for the school gallery."
      actions={
        <Button asChild>
          <Link href="/admin/gallery/create">
            <Plus className="h-4 w-4 mr-2" />
            Add photo
          </Link>
        </Button>
      }
    >
      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading gallery: {error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <PaginationInfo
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={limit}
            itemName="photos"
            className="mb-4"
          />
          <GalleryManagementTable items={items} />
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/admin/gallery"
            limit={limit}
            className="mt-6"
          />
        </>
      )}
    </PageWrapper>
  );
}

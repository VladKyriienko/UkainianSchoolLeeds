import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ClassGalleryManagementTable from '@/components/features/class-gallery/ClassGalleryManagementTable';
import { ClassGallerySearchForm } from '@/components/features/class-gallery/ClassGallerySearchForm';
import { listGalleryItems } from '@/lib/class-gallery/actions';
import { listClasses, type AdminClass } from '@/app/admin/classes/actions';
import { PaginationComponent } from '@/components/common/Pagination';
import { PaginationInfo } from '@/components/common/PaginationInfo';
import { PageWrapper } from '@/components/common/PageWrapper';

type AdminClassGalleryPageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    classId?: string;
  }>;
};

export default async function AdminClassGalleryPage({
  searchParams
}: AdminClassGalleryPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const limit = parseInt(params.limit || '20', 10);
  const classId = params.classId?.trim() || '';

  let items: Awaited<ReturnType<typeof listGalleryItems>>['items'] = [];
  let totalItems = 0;
  let error: string | null = null;
  let classTitleMap: Map<string, string> = new Map();
  let classesList: AdminClass[] = [];

  try {
    const [galleryResult, classesResult] = await Promise.all([
      listGalleryItems({ page, limit, ...(classId && { classId }) }),
      listClasses({ page: 1, limit: 500 })
    ]);
    items = galleryResult.items;
    totalItems = galleryResult.total;
    classesList = classesResult.classes;
    classTitleMap = new Map(classesResult.classes.map((c) => [c.id, c.title]));
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }

  const totalPages = Math.ceil(totalItems / limit) || 1;

  return (
    <PageWrapper
      title="Class Gallery"
      description="Manage photos in class galleries."
      actions={
        <Button asChild>
          <Link href="/admin/class-gallery/create">
            <Plus className="h-4 w-4 mr-2" />
            Add photo
          </Link>
        </Button>
      }
    >
      <ClassGallerySearchForm
        classes={classesList}
        initialClassId={classId}
      />
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
            className="mb-4 mt-6"
          />
          <ClassGalleryManagementTable
            items={items}
            classTitleMap={classTitleMap}
          />
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/admin/class-gallery"
            limit={limit}
            {...(classId ? { searchParams: { classId } } : {})}
            className="mt-6"
          />
        </>
      )}
    </PageWrapper>
  );
}

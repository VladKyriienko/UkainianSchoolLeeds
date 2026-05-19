import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ClassGalleryManagementTable from '@/components/features/class-gallery/ClassGalleryManagementTable';
import {
  getTeacherAssignedClassForGallery,
  listGalleryItems
} from '@/lib/class-gallery/actions';
import { PaginationComponent } from '@/components/common/Pagination';
import { PaginationInfo } from '@/components/common/PaginationInfo';
import { PageWrapper } from '@/components/common/PageWrapper';

type TeacherClassGalleryPageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
};

export default async function TeacherClassGalleryPage({
  searchParams
}: TeacherClassGalleryPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const limit = parseInt(params.limit || '20', 10);

  let items: Awaited<ReturnType<typeof listGalleryItems>>['items'] = [];
  let totalItems = 0;
  let error: string | null = null;
  let classTitleMap: Map<string, string> = new Map();
  let assignedClassTitle = 'your class';

  try {
    const assignedClass = await getTeacherAssignedClassForGallery();

    if (!assignedClass) {
      error = 'No class is assigned to your account.';
    } else {
      const galleryResult = await listGalleryItems({
        page,
        limit,
        classId: assignedClass.id
      });
      assignedClassTitle = assignedClass.title;
      classTitleMap = new Map([[assignedClass.id, assignedClass.title]]);
      items = galleryResult.items;
      totalItems = galleryResult.total;
    }
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }

  const totalPages = Math.ceil(totalItems / limit) || 1;

  return (
    <PageWrapper
      title="Class Gallery"
      description={`Manage photos in ${assignedClassTitle}.`}
      actions={
        <Button asChild>
          <Link href="/teacher/class-gallery/create">
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
            className="mb-4 mt-6"
          />
          <ClassGalleryManagementTable
            items={items}
            classTitleMap={classTitleMap}
            basePath="/teacher/class-gallery"
          />
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/teacher/class-gallery"
            limit={limit}
            className="mt-6"
          />
        </>
      )}
    </PageWrapper>
  );
}

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ClassesManagementTable from '@/components/features/admin/ClassesManagementTable';
import { AdminListSearchForm } from '@/components/common/admin/AdminListSearchForm';
import { listClasses } from '@/app/admin/classes/actions';
import { PaginationComponent } from '@/components/common/Pagination';
import { PaginationInfo } from '@/components/common/PaginationInfo';
import { PageWrapper } from '@/components/common/PageWrapper';

type AdminClassesPageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
  }>;
};

export default async function AdminClassesPage({
  searchParams
}: AdminClassesPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const limit = parseInt(params.limit || '20', 10);
  const search = params.search || '';

  let classes: Awaited<ReturnType<typeof listClasses>>['classes'] = [];
  let totalClasses = 0;
  let error: string | null = null;

  try {
    const result = await listClasses({
      page,
      limit,
      ...(search && { search })
    });
    classes = result.classes;
    totalClasses = result.total;
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }

  const totalPages = Math.ceil(totalClasses / limit) || 1;

  return (
    <PageWrapper
      title="Classes"
      description="Create and manage classes. Drag rows to change display order on the public site."
      actions={
        <Button asChild>
          <Link href="/admin/classes/create">
            <Plus className="h-4 w-4 mr-2" />
            Add class
          </Link>
        </Button>
      }
    >
      <AdminListSearchForm
        searchInputId="classes-search"
        searchLabel="Search classes"
        searchPlaceholder="Title..."
        initialSearch={search}
        showDateRange={false}
        className="flex flex-col gap-4 sm:max-w-md"
      />
      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading classes: {error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <PaginationInfo
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalClasses}
            itemsPerPage={limit}
            itemName="classes"
            className="mb-4 mt-6"
          />
          <ClassesManagementTable classes={classes} />
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/admin/classes"
            limit={limit}
            {...(search ? { searchParams: { search } } : {})}
            className="mt-6"
          />
        </>
      )}
    </PageWrapper>
  );
}

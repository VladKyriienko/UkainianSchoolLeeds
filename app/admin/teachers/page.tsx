import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import TeacherManagementTable from '@/app/admin/components/TeacherManagementTable';
import { listTeachers } from '@/app/admin/teachers/actions';
import type { AdminTeacher } from '@/app/admin/teachers/actions';
import { TeacherSearchForm } from '@/app/admin/components/TeacherSearchForm';
import { PaginationComponent } from '@/components/common/Pagination';
import { PaginationInfo } from '@/components/common/PaginationInfo';
import { PageWrapper } from '@/components/common/PageWrapper';

type AdminTeachersPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
    limit?: string;
  }>;
};

export default async function AdminTeachersPage({
  searchParams
}: AdminTeachersPageProps) {
  const params = await searchParams;
  const search = params.search || '';
  const category = params.category || 'all';
  const page = parseInt(params.page || '1', 10);
  const limit = parseInt(params.limit || '20', 10);

  let teachers: AdminTeacher[] = [];
  let totalTeachers = 0;
  let error: string | null = null;

  try {
    const result = await listTeachers({
      page,
      limit,
      search,
      ...(category !== 'all' && { category })
    });
    teachers = result.teachers;
    totalTeachers = result.total;
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }

  const totalPages = Math.ceil(totalTeachers / limit);

  return (
    <PageWrapper
      title="Teachers"
      description="Create and manage teacher profiles"
      actions={
        <Button asChild>
          <Link href="/admin/teachers/create">Add Teacher</Link>
        </Button>
      }
    >

      <TeacherSearchForm
        initialSearch={search}
        initialCategory={category}
        initialLimit={limit}
      />

      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading teachers: {error}
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <PaginationInfo
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalTeachers}
            itemsPerPage={limit}
            itemName="teachers"
            className="mb-4 mt-6"
          />
          <TeacherManagementTable teachers={teachers} />
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/admin/teachers"
            limit={limit}
            searchParams={{
              search,
              ...(category !== 'all' && { category })
            }}
            className="mt-6"
          />
        </>
      )}
    </PageWrapper>
  );
}


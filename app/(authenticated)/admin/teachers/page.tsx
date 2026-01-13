import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import TeacherManagementTable from '@/app/(authenticated)/admin/components/TeacherManagementTable';
import { listTeachers } from '@/app/(authenticated)/admin/teachers/actions';
import type { AdminTeacher } from '@/app/(authenticated)/admin/teachers/actions';
import { TeacherSearchForm } from '@/app/(authenticated)/admin/components/TeacherSearchForm';
import { PaginationComponent } from '@/components/common/Pagination';
import { PaginationInfo } from '@/components/common/PaginationInfo';

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
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Teachers</h1>
          <p className="text-muted-foreground">
            Create and manage teacher profiles
          </p>
        </div>
        <div className="flex gap-4">

          <Button asChild>
            <Link href="/admin/teachers/create">Add Teacher</Link>
          </Button>
        </div>
      </div>

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
    </div>
  );
}


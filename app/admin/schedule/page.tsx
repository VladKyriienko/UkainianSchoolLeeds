import { PageWrapper } from '@/components/common/PageWrapper';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { listSchedule } from './actions';
import { AdminListSearchForm } from '@/components/common/admin/AdminListSearchForm';
import ScheduleManagementTable from '@/components/features/admin/ScheduleManagementTable';
import { PaginationComponent } from '@/components/common/Pagination';
import { PaginationInfo } from '@/components/common/PaginationInfo';

type AdminSchedulePageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
};

export default async function AdminSchedulePage({
  searchParams
}: AdminSchedulePageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const limit = parseInt(params.limit || '20', 10);
  const dateFrom = params.dateFrom || '';
  const dateTo = params.dateTo || '';

  let schedule: Awaited<ReturnType<typeof listSchedule>>['schedule'] = [];
  let totalSchedule = 0;
  let error: string | null = null;

  try {
    const result = await listSchedule({
      page,
      limit,
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo })
    });
    schedule = result.schedule;
    totalSchedule = result.total;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }

  const totalPages = Math.ceil(totalSchedule / limit) || 1;

  return (
    <PageWrapper
      title="Schedule"
      description="Manage timetable PDF files by date."
      actions={
        <Button asChild>
          <Link href="/admin/schedule/create">
            <Plus className="h-4 w-4 mr-2" />
            Add schedule
          </Link>
        </Button>
      }
    >
      <AdminListSearchForm
        searchInputId="schedule-dates"
        showSearch={false}
        initialDateFrom={dateFrom}
        initialDateTo={dateTo}
      />

      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <PaginationInfo
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalSchedule}
            itemsPerPage={limit}
            itemName="schedule files"
            className="mb-4 mt-6"
          />
          <ScheduleManagementTable schedule={schedule} />
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/admin/schedule"
            limit={limit}
            {...(dateFrom || dateTo
              ? { searchParams: { ...(dateFrom && { dateFrom }), ...(dateTo && { dateTo }) } }
              : {})}
            className="mt-6"
          />
        </>
      )}
    </PageWrapper>
  );
}

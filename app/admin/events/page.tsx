import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import EventManagementTable from '@/app/admin/components/EventManagementTable';
import { listEvents } from '@/app/admin/events/actions';
import type { AdminEvent } from '@/app/admin/events/actions';
import { EventSearchForm } from '@/app/admin/components/EventSearchForm';
import { PaginationComponent } from '@/components/common/Pagination';
import { PaginationInfo } from '@/components/common/PaginationInfo';
import { PageWrapper } from '@/components/common/PageWrapper';

type AdminEventsPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    limit?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
};

export default async function AdminEventsPage({
  searchParams
}: AdminEventsPageProps) {
  const params = await searchParams;
  const search = params.search || '';
  const page = parseInt(params.page || '1', 10);
  const limit = parseInt(params.limit || '20', 10);
  const dateFrom = params.dateFrom || '';
  const dateTo = params.dateTo || '';

  let events: AdminEvent[] = [];
  let totalEvents = 0;
  let error: string | null = null;

  try {
    const result = await listEvents({
      page,
      limit,
      search,
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo })
    });
    events = result.events;
    totalEvents = result.total;
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }

  const totalPages = Math.ceil(totalEvents / limit);

  return (
    <PageWrapper
      title="Events"
      description="Create and manage school events"
      actions={
        <Button asChild>
          <Link href="/admin/events/create">Add Event</Link>
        </Button>
      }
    >
      <EventSearchForm
        initialSearch={search}
        initialLimit={limit}
        initialDateFrom={dateFrom || undefined}
        initialDateTo={dateTo || undefined}
      />

      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading events: {error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <PaginationInfo
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalEvents}
            itemsPerPage={limit}
            itemName="events"
            className="mb-4 mt-6"
          />
          <EventManagementTable events={events} />
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/admin/events"
            limit={limit}
            searchParams={{
            ...(search && { search }),
            ...(dateFrom && { dateFrom }),
            ...(dateTo && { dateTo })
          }}
            className="mt-6"
          />
        </>
      )}
    </PageWrapper>
  );
}

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import NewsManagementTable from '@/components/features/admin/NewsManagementTable';
import { AdminListSearchForm } from '@/components/common/admin/AdminListSearchForm';
import { listNews } from '@/app/admin/news/actions';
import { PaginationComponent } from '@/components/common/Pagination';
import { PaginationInfo } from '@/components/common/PaginationInfo';
import { PageWrapper } from '@/components/common/PageWrapper';

type AdminNewsPageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
};

export default async function AdminNewsPage({
  searchParams
}: AdminNewsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const limit = parseInt(params.limit || '20', 10);
  const search = params.search || '';
  const dateFrom = params.dateFrom || '';
  const dateTo = params.dateTo || '';

  let news: Awaited<ReturnType<typeof listNews>>['news'] = [];
  let totalNews = 0;
  let error: string | null = null;

  try {
    const result = await listNews({
      page,
      limit,
      ...(search && { search }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo })
    });
    news = result.news;
    totalNews = result.total;
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }

  const totalPages = Math.ceil(totalNews / limit) || 1;

  return (
    <PageWrapper
      title="News"
      description="Create and manage news items."
      actions={
        <Button asChild>
          <Link href="/admin/news/create">
            <Plus className="h-4 w-4 mr-2" />
            Add news
          </Link>
        </Button>
      }
    >
      <AdminListSearchForm
        searchInputId="news-search"
        searchLabel="Search by title"
        searchPlaceholder="Title..."
        initialSearch={search}
        initialDateFrom={dateFrom}
        initialDateTo={dateTo}
      />
      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading news: {error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <PaginationInfo
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalNews}
            itemsPerPage={limit}
            itemName="news"
            className="mb-4 mt-6"
          />
          <NewsManagementTable news={news} />
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/admin/news"
            limit={limit}
            {...((search || dateFrom || dateTo)
              ? { searchParams: { ...(search && { search }), ...(dateFrom && { dateFrom }), ...(dateTo && { dateTo }) } }
              : {})}
            className="mt-6"
          />
        </>
      )}
    </PageWrapper>
  );
}

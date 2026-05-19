import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ReviewsManagementTable from '@/components/features/admin/ReviewsManagementTable';
import { AdminListSearchForm } from '@/components/common/admin/AdminListSearchForm';
import { listReviews } from '@/app/admin/reviews/actions';
import { PaginationComponent } from '@/components/common/Pagination';
import { PaginationInfo } from '@/components/common/PaginationInfo';
import { PageWrapper } from '@/components/common/PageWrapper';

type AdminReviewsPageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    parents?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
};

export default async function AdminReviewsPage({
  searchParams
}: AdminReviewsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const limit = parseInt(params.limit || '20', 10);
  const parents = params.parents || '';
  const dateFrom = params.dateFrom || '';
  const dateTo = params.dateTo || '';

  let reviews: Awaited<ReturnType<typeof listReviews>>['reviews'] = [];
  let totalReviews = 0;
  let error: string | null = null;

  try {
    const result = await listReviews({
      page,
      limit,
      ...(parents && { parents }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo })
    });
    reviews = result.reviews;
    totalReviews = result.total;
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }

  const totalPages = Math.ceil(totalReviews / limit) || 1;

  return (
    <PageWrapper
      title="Reviews"
      description="Parent testimonials for the public site."
      actions={
        <Button asChild>
          <Link href="/admin/reviews/create">
            <Plus className="mr-2 h-4 w-4" />
            Add review
          </Link>
        </Button>
      }
    >
      <AdminListSearchForm
        searchInputId="reviews-parents"
        searchParamKey="parents"
        searchLabel="Filter by parents (attribution)"
        searchPlaceholder="e.g. Maria, Sofia's mum"
        initialSearch={parents}
        initialDateFrom={dateFrom}
        initialDateTo={dateTo}
      />
      {error ? (
        <Alert variant="destructive" className="mb-6 mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading reviews: {error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <PaginationInfo
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalReviews}
            itemsPerPage={limit}
            itemName="reviews"
            className="mb-4 mt-6"
          />
          <ReviewsManagementTable reviews={reviews} />
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/admin/reviews"
            limit={limit}
            searchParams={{
              ...(parents ? { parents } : {}),
              ...(dateFrom ? { dateFrom } : {}),
              ...(dateTo ? { dateTo } : {})
            }}
            className="mt-6"
          />
        </>
      )}
    </PageWrapper>
  );
}

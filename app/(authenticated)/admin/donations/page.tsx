import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import DonationManagementTable from '@/app/(authenticated)/admin/components/DonationManagementTable';
import { listDonations } from '@/app/(authenticated)/admin/donations/actions';
import { PaginationComponent } from '@/components/common/Pagination';
import { PaginationInfo } from '@/components/common/PaginationInfo';
import { PageWrapper } from '@/components/common/PageWrapper';

type AdminDonationsPageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
};

export default async function AdminDonationsPage({
  searchParams
}: AdminDonationsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const limit = parseInt(params.limit || '20', 10);

  let donations: Awaited<ReturnType<typeof listDonations>>['donations'] = [];
  let totalDonations = 0;
  let error: string | null = null;

  try {
    const result = await listDonations({ page, limit });
    donations = result.donations;
    totalDonations = result.total;
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }

  const totalPages = Math.ceil(totalDonations / limit) || 1;

  return (
    <PageWrapper
      title="Donations"
      description="View donation history"
    >
      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading donations: {error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <PaginationInfo
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalDonations}
            itemsPerPage={limit}
            itemName="donations"
            className="mb-4 mt-6"
          />
          <DonationManagementTable donations={donations} />
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/admin/donations"
            limit={limit}
            className="mt-6"
          />
        </>
      )}
    </PageWrapper>
  );
}

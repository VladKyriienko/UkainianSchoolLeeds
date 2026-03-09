import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import MessagesManagementTable from '@/app/admin/components/MessagesManagementTable';
import { listMessages } from '@/app/admin/messages/actions';
import { PaginationComponent } from '@/components/common/Pagination';
import { PaginationInfo } from '@/components/common/PaginationInfo';
import { PageWrapper } from '@/components/common/PageWrapper';

type AdminMessagesPageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
};

export default async function AdminMessagesPage({
  searchParams
}: AdminMessagesPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const limit = parseInt(params.limit || '20', 10);

  let messages: Awaited<ReturnType<typeof listMessages>>['messages'] = [];
  let totalMessages = 0;
  let error: string | null = null;

  try {
    const result = await listMessages({ page, limit });
    messages = result.messages;
    totalMessages = result.total;
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }

  const totalPages = Math.ceil(totalMessages / limit) || 1;

  return (
    <PageWrapper title="Messages" description="View contact form messages">
      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading messages: {error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <PaginationInfo
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalMessages}
            itemsPerPage={limit}
            itemName="messages"
            className="mb-4 mt-6"
          />
          <MessagesManagementTable messages={messages} />
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/admin/messages"
            limit={limit}
            className="mt-6"
          />
        </>
      )}
    </PageWrapper>
  );
}

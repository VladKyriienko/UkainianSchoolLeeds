import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMessageById } from '@/app/admin/messages/actions';
import { MessagesDetailsActions } from '@/app/admin/components/MessagesDetailsActions';
import { MessageReadStatus } from '@/app/admin/components/MessageReadStatus';
import { PageWrapper } from '@/components/common/PageWrapper';
import { BackButton } from '@/components/common/BackButton';
import { formatDateTimeLabel } from '@/utils/date-format';

export default async function MessageViewPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let item = null;
  try {
    item = await getMessageById(id);
  } catch {
    // fallthrough
  }

  if (!item) {
    notFound();
  }

  return (
    <PageWrapper
      title={item.subject}
      description={formatDateTimeLabel(item.created_at)}
      goBackButton={<BackButton />}
      actions={
        <MessagesDetailsActions messageId={item.id} subject={item.subject} />
      }
    >
      <Card className="min-w-0 overflow-hidden">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <CardTitle>Message details</CardTitle>
          <MessageReadStatus messageId={item.id} initialRead={item.read} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-1 text-sm text-muted-foreground">Name</div>
            <div className="font-medium">{item.name}</div>
          </div>
          <div>
            <div className="mb-1 text-sm text-muted-foreground">Email</div>
            <a href={`mailto:${item.email}`} className="font-medium hover:underline">
              {item.email}
            </a>
          </div>
          {item.phone ? (
            <div>
              <div className="mb-1 text-sm text-muted-foreground">Phone</div>
              <a href={`tel:${item.phone}`} className="font-medium hover:underline">
                {item.phone}
              </a>
            </div>
          ) : null}
          <div>
            <div className="mb-1 text-sm text-muted-foreground">Message</div>
            <div className="whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-4 text-sm leading-relaxed">
              {item.message}
            </div>
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

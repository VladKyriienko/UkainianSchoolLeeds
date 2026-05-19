import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getReviewById } from '@/app/admin/reviews/actions';
import { AdminEntityDetailsActions } from '@/components/common/admin/AdminEntityDetailsActions';
import { deleteReview } from '@/app/admin/reviews/actions';
import { PageWrapper } from '@/components/common/PageWrapper';
import { BackButton } from '@/components/common/BackButton';
import { format } from 'date-fns';
import { formatDateTimeLabel } from '@/utils/date-format';
import { isHtmlContent } from '@/utils/rich-text';

export default async function ReviewViewPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let item = null;
  try {
    item = await getReviewById(id);
  } catch {
    // fallthrough
  }

  if (!item) {
    notFound();
  }

  return (
    <PageWrapper
      title={item.perens}
      description={formatDateTimeLabel(item.data)}
      goBackButton={<BackButton />}
      actions={
        <AdminEntityDetailsActions
          editHref={`/admin/reviews/${item.id}/edit`}
          listPath="/admin/reviews"
          confirmMessage={`Delete this review from "${item.perens}"? This action cannot be undone.`}
          deleteErrorMessage="Failed to delete review"
          entityId={item.id}
          deleteAction={deleteReview}
        />
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Review details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-1 text-sm text-muted-foreground">Parents / attribution (English)</div>
            <div className="text-lg font-medium">{item.perens}</div>
          </div>
          {item.perens_uk ? (
            <div>
              <div className="mb-1 text-sm text-muted-foreground">Parents / attribution (Ukrainian)</div>
              <div className="text-lg font-medium">{item.perens_uk}</div>
            </div>
          ) : null}
          <div>
            <div className="mb-1 text-sm text-muted-foreground">Date</div>
            <div className="font-medium">
              {item.data
                ? format(new Date(item.data), 'MMMM d, yyyy')
                : '—'}
            </div>
          </div>
          <div>
            <div className="mb-1 text-sm text-muted-foreground">Content (English)</div>
            {isHtmlContent(item.content) ? (
              <div
                className="rich-text-content"
                dangerouslySetInnerHTML={{ __html: item.content || '' }}
              />
            ) : (
              <div className="whitespace-pre-wrap">{item.content}</div>
            )}
          </div>
          {item.content_uk ? (
            <div>
              <div className="mb-1 text-sm text-muted-foreground">Content (Ukrainian)</div>
              {isHtmlContent(item.content_uk) ? (
                <div
                  className="rich-text-content"
                  dangerouslySetInnerHTML={{ __html: item.content_uk || '' }}
                />
              ) : (
                <div className="whitespace-pre-wrap">{item.content_uk}</div>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getNewsById } from '@/app/admin/news/actions';
import { AdminEntityDetailsActions } from '@/components/common/admin/AdminEntityDetailsActions';
import { deleteNews } from '@/app/admin/news/actions';
import { PageWrapper } from '@/components/common/PageWrapper';
import { BackButton } from '@/components/common/BackButton';
import { createAdminClient } from '@/lib/supabase/admin';
import { format } from 'date-fns';
import { isHtmlContent } from '@/utils/rich-text';
import { AdminDetailPhoto } from '@/components/common/admin/AdminDetailPhoto';

export default async function NewsViewPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let item = null;
  try {
    item = await getNewsById(id);
  } catch {
    // fallthrough
  }

  if (!item) {
    notFound();
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return '—';
    }
  };

  const supabaseAdmin = createAdminClient();
  const photoUrl = item.photo
    ? supabaseAdmin.storage.from('news-photos').getPublicUrl(item.photo).data
        .publicUrl
    : null;

  return (
    <PageWrapper
      title={item.title}
      description={formatDate(item.date)}
      goBackButton={<BackButton />}
      actions={
        <AdminEntityDetailsActions
          editHref={`/admin/news/${item.id}/edit`}
          listPath="/admin/news"
          confirmMessage={`Are you sure you want to delete "${item.title}"? This action cannot be undone.`}
          deleteErrorMessage="Failed to delete news"
          entityId={item.id}
          deleteAction={deleteNews}
        />
      }
    >
      <Card className="min-w-0 overflow-hidden">
        <CardHeader>
          <CardTitle>News Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Title</div>
            <div className="font-medium text-lg">{item.title}</div>
          </div>

          {photoUrl && <AdminDetailPhoto src={photoUrl} alt={item.title} />}

          <div>
            <div className="text-sm text-muted-foreground mb-1">Description</div>
            {isHtmlContent(item.description) ? (
              <div
                className="rich-text-content"
                dangerouslySetInnerHTML={{ __html: item.description || '' }}
              />
            ) : (
              <div className="whitespace-pre-wrap">{item.description || '—'}</div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Date</div>
              <div className="font-medium">{formatDate(item.date)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Order</div>
              <div className="font-medium">{item.order}</div>
            </div>
          </div>

          {(item.title_uk || item.description_uk) && (
            <div className="space-y-4 border-t pt-4">
              {item.title_uk && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Title (Ukrainian)
                  </div>
                  <div className="font-medium text-lg">{item.title_uk}</div>
                </div>
              )}
              {item.description_uk && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Description (Ukrainian)
                  </div>
                  {isHtmlContent(item.description_uk) ? (
                    <div
                      className="rich-text-content"
                      dangerouslySetInnerHTML={{ __html: item.description_uk }}
                    />
                  ) : (
                    <div className="whitespace-pre-wrap">{item.description_uk}</div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="text-sm text-muted-foreground pt-4 border-t">
            Created:{' '}
            {item.created_at
              ? format(new Date(item.created_at), 'MMMM d, yyyy h:mm a')
              : '—'}
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getClassById } from '@/app/admin/classes/actions';
import { ClassDetailsActions } from '@/app/admin/components/ClassDetailsActions';
import { PageWrapper } from '@/components/common/PageWrapper';
import { BackButton } from '@/components/common/BackButton';
import { format } from 'date-fns';
import { isHtmlContent } from '@/utils/rich-text';

export default async function ClassViewPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let item = null;
  try {
    item = await getClassById(id);
  } catch {
    // fallthrough
  }

  if (!item) {
    notFound();
  }

  return (
    <PageWrapper
      title={item.title}
      description={`Order: ${item.order}`}
      goBackButton={<BackButton />}
      actions={<ClassDetailsActions classId={item.id} classTitle={item.title} />}
    >
      <Card>
        <CardHeader>
          <CardTitle>Class Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Title</div>
            <div className="font-medium text-lg">{item.title}</div>
          </div>

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
              <div className="text-sm text-muted-foreground mb-1">Order</div>
              <div className="font-medium">{item.order}</div>
            </div>
          </div>

          {(item.title_uk || item.description_uk) && (
            <div className="pt-4 border-t space-y-2">
              {item.title_uk && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Title (Ukrainian)
                  </div>
                  <div className="font-medium">{item.title_uk}</div>
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

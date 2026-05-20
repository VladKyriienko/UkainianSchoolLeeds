import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDocumentById } from '@/app/admin/documents/actions';
import { AdminEntityDetailsActions } from '@/components/common/admin/AdminEntityDetailsActions';
import { deleteDocument } from '@/app/admin/documents/actions';
import { PageWrapper } from '@/components/common/PageWrapper';
import { BackButton } from '@/components/common/BackButton';
import { DOCUMENT_TYPE_LABELS } from '@/app/admin/documents/constants';
import type { DocumentType } from '@/types';
import { format } from 'date-fns';
import { isHtmlContent } from '@/utils/rich-text';

export default async function DocumentViewPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let doc = null;
  try {
    doc = await getDocumentById(id);
  } catch {
    // fallthrough
  }

  if (!doc) {
    notFound();
  }

  const typeLabel = DOCUMENT_TYPE_LABELS[doc.type as DocumentType] ?? doc.type;

  return (
    <PageWrapper
      title={doc.title}
      description={typeLabel}
      goBackButton={<BackButton />}
      actions={
        <AdminEntityDetailsActions
          editHref={`/admin/documents/${doc.id}/edit`}
          listPath="/admin/documents"
          confirmMessage={`Are you sure you want to delete "${doc.title}"? This cannot be undone.`}
          deleteErrorMessage="Failed to delete document"
          entityId={doc.id}
          deleteAction={deleteDocument}
        />
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Document Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Title</div>
            <div className="font-medium text-lg">{doc.title}</div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1">Type</div>
            <div className="font-medium">{typeLabel}</div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1">Content</div>
            {isHtmlContent(doc.content) ? (
              <div
                className="rich-text-content"
                dangerouslySetInnerHTML={{ __html: doc.content || '' }}
              />
            ) : (
              <div className="whitespace-pre-wrap">{doc.content || '—'}</div>
            )}
          </div>

          {(doc.title_uk || doc.content_uk) && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Content (Ukrainian){doc.title_uk ? ` — ${doc.title_uk}` : ''}
              </div>
              {isHtmlContent(doc.content_uk) ? (
                <div
                  className="rich-text-content"
                  dangerouslySetInnerHTML={{ __html: doc.content_uk || '' }}
                />
              ) : (
                <div className="whitespace-pre-wrap">{doc.content_uk || '—'}</div>
              )}
            </div>
          )}

          <div className="text-sm text-muted-foreground pt-4 border-t">
            Created:{' '}
            {doc.created_at
              ? format(new Date(doc.created_at), 'MMMM d, yyyy h:mm a')
              : '—'}
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

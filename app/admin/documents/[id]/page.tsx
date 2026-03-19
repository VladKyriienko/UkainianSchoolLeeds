import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDocumentById } from '@/app/admin/documents/actions';
import { DocumentDetailsActions } from '@/app/admin/components/DocumentDetailsActions';
import { PageWrapper } from '@/components/common/PageWrapper';
import { BackButton } from '@/components/common/BackButton';
import { DOCUMENT_TYPE_LABELS, type DocumentType } from '@/app/admin/documents/constants';
import { format } from 'date-fns';

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return '—';
    }
  };

  const typeLabel = DOCUMENT_TYPE_LABELS[doc.type as DocumentType] ?? doc.type;

  return (
    <PageWrapper
      title={doc.title}
      description={typeLabel}
      goBackButton={<BackButton />}
      actions={
        <DocumentDetailsActions
          documentId={doc.id}
          documentTitle={doc.title}
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
            <div className="whitespace-pre-wrap">{doc.content || '—'}</div>
          </div>

          {(doc.title_uk || doc.content_uk) && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Content (Ukrainian){doc.title_uk ? ` — ${doc.title_uk}` : ''}
              </div>
              <div className="whitespace-pre-wrap">{doc.content_uk || '—'}</div>
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

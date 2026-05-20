'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { FileText } from 'lucide-react';
import type { AdminDocument } from '@/types';
import { deleteDocument } from '@/app/admin/documents/actions';
import { DOCUMENT_TYPE_LABELS } from '@/app/admin/documents/constants';
import { isHtmlContent } from '@/utils/rich-text';
import { formatDateLabel } from '@/utils/date-format';
import { EntityEmptyState } from '@/components/common/admin/EntityEmptyState';
import { EntityTableShell } from '@/components/common/admin/EntityTableShell';
import { RowActionMenu } from '@/components/common/admin/RowActionMenu';
import { useConfirmAction } from '@/hooks/useConfirmAction';

type DocumentsManagementTableProps = {
  documents: AdminDocument[];
};

export default function DocumentsManagementTable({
  documents
}: DocumentsManagementTableProps) {
  const router = useRouter();
  const [loadingDocId, setLoadingDocId] = useState<string | null>(null);
  const { runWithConfirm } = useConfirmAction();

  const handleDelete = async (docId: string, title: string) => {
    await runWithConfirm({
      confirmMessage: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      onAction: async () => {
        setLoadingDocId(docId);
        try {
          const result = await deleteDocument(docId);
          if (!result.success) {
            alert(result.error ?? 'Failed to delete document');
            return;
          }
          router.refresh();
        } finally {
          setLoadingDocId(null);
        }
      },
      onError: (error) => {
        console.error('Failed to delete document:', error);
        alert('Failed to delete document');
      }
    });
  };

  if (documents.length === 0) {
    return (
      <EntityEmptyState
        icon={FileText}
        title="No documents yet"
        description="Create a document to display policy or other content on the site."
      />
    );
  }

  return (
    <EntityTableShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-50">Title</TableHead>
            <TableHead className="w-30">Type</TableHead>
            <TableHead>Content preview</TableHead>
            <TableHead className="w-30">Created</TableHead>
            <TableHead className="w-15"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">{doc.title}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {DOCUMENT_TYPE_LABELS[doc.type as keyof typeof DOCUMENT_TYPE_LABELS] ?? doc.type}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm max-w-80">
                {isHtmlContent(doc.content) ? (
                  <div
                    className="rich-text-preview"
                    dangerouslySetInnerHTML={{ __html: doc.content || '' }}
                  />
                ) : (
                  <span className="line-clamp-3" title={doc.content}>
                    {doc.content || '—'}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDateLabel(doc.created_at)}
              </TableCell>
              <TableCell>
                <RowActionMenu
                  isLoading={loadingDocId === doc.id}
                  onView={() => router.push(`/admin/documents/${doc.id}`)}
                  onEdit={() => router.push(`/admin/documents/${doc.id}/edit`)}
                  onDelete={() => handleDelete(doc.id, doc.title)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </EntityTableShell>
  );
}

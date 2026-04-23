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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { FileText, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import type { AdminDocument } from '@/app/admin/documents/actions';
import { deleteDocument } from '@/app/admin/documents/actions';
import { DOCUMENT_TYPE_LABELS } from '@/app/admin/documents/constants';
import { format } from 'date-fns';

type DocumentsManagementTableProps = {
  documents: AdminDocument[];
};

function isHtmlContent(content: string | null): boolean {
  if (!content) return false;
  return /<\/?[a-z][\s\S]*>/i.test(content);
}

export default function DocumentsManagementTable({
  documents
}: DocumentsManagementTableProps) {
  const router = useRouter();
  const [loadingDocId, setLoadingDocId] = useState<string | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return '—';
    }
  };

  const handleDelete = async (docId: string, title: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`
      )
    ) {
      return;
    }
    setLoadingDocId(docId);
    try {
      const result = await deleteDocument(docId);
      if (!result.success) {
        alert(result.error ?? 'Failed to delete document');
        return;
      }
      router.refresh();
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('Failed to delete document');
    } finally {
      setLoadingDocId(null);
    }
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No documents yet
        </h3>
        <p className="text-muted-foreground">
          Create a document to display policy or other content on the site.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Title</TableHead>
              <TableHead className="w-[120px]">Type</TableHead>
              <TableHead>Content preview</TableHead>
              <TableHead className="w-[120px]">Created</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.title}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {DOCUMENT_TYPE_LABELS[doc.type as keyof typeof DOCUMENT_TYPE_LABELS] ?? doc.type}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[320px]">
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
                  {formatDate(doc.created_at)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={loadingDocId === doc.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        onClick={() => router.push(`/admin/documents/${doc.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/documents/${doc.id}/edit`)
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(doc.id, doc.title)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

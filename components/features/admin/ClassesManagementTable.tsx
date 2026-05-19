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
import { BookOpen } from 'lucide-react';
import type { AdminClass } from '@/app/admin/classes/actions';
import { deleteClass } from '@/app/admin/classes/actions';
import { formatDateLabel } from '@/utils/date-format';
import { isHtmlContent } from '@/utils/rich-text';
import { EntityEmptyState } from '@/components/common/admin/EntityEmptyState';
import { EntityTableShell } from '@/components/common/admin/EntityTableShell';
import { RowActionMenu } from '@/components/common/admin/RowActionMenu';
import { useConfirmAction } from '@/hooks/useConfirmAction';

type ClassesManagementTableProps = {
  classes: AdminClass[];
};

export default function ClassesManagementTable({
  classes: classesList
}: ClassesManagementTableProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { runWithConfirm } = useConfirmAction();

  const handleDelete = async (id: string, title: string) => {
    await runWithConfirm({
      confirmMessage: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      onAction: async () => {
        setLoadingId(id);
        try {
          const result = await deleteClass(id);
          if (!result.success) {
            alert(result.error ?? 'Failed to delete class');
            return;
          }
          router.refresh();
        } finally {
          setLoadingId(null);
        }
      },
      onError: (err) => {
        console.error('Failed to delete class:', err);
        alert('Failed to delete class');
      }
    });
  };

  if (classesList.length === 0) {
    return (
      <EntityEmptyState
        icon={BookOpen}
        title="No classes yet"
        description="Create your first class."
      />
    );
  }

  return (
    <EntityTableShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-55">Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-20">Order</TableHead>
            <TableHead className="w-30">Created</TableHead>
            <TableHead className="w-15"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classesList.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell className="text-muted-foreground text-sm max-w-70">
                {isHtmlContent(item.description) ? (
                  <div
                    className="rich-text-preview"
                    dangerouslySetInnerHTML={{ __html: item.description || '' }}
                  />
                ) : (
                  <span className="line-clamp-3" title={item.description ?? ''}>
                    {item.description || '—'}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {item.order}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDateLabel(item.created_at)}
              </TableCell>
              <TableCell>
                <RowActionMenu
                  isLoading={loadingId === item.id}
                  onView={() => router.push(`/admin/classes/${item.id}`)}
                  onEdit={() => router.push(`/admin/classes/${item.id}/edit`)}
                  onDelete={() => handleDelete(item.id, item.title)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </EntityTableShell>
  );
}

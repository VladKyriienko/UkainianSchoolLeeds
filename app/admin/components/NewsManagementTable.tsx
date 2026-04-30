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
import { Newspaper } from 'lucide-react';
import type { AdminNews } from '@/app/admin/news/actions';
import { deleteNews } from '@/app/admin/news/actions';
import { formatDateLabel } from '@/utils/date-format';
import { EntityEmptyState } from '@/components/common/admin/EntityEmptyState';
import { EntityTableShell } from '@/components/common/admin/EntityTableShell';
import { RowActionMenu } from '@/components/common/admin/RowActionMenu';
import { useConfirmAction } from '@/hooks/useConfirmAction';

type NewsManagementTableProps = {
  news: AdminNews[];
};

const DESC_PREVIEW_LENGTH = 60;

export default function NewsManagementTable({
  news: newsItems
}: NewsManagementTableProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { runWithConfirm } = useConfirmAction();

  const handleDelete = async (id: string, title: string) => {
    await runWithConfirm({
      confirmMessage: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      onAction: async () => {
        setLoadingId(id);
        try {
          const result = await deleteNews(id);
          if (!result.success) {
            alert(result.error ?? 'Failed to delete news');
            return;
          }
          router.refresh();
        } finally {
          setLoadingId(null);
        }
      },
      onError: (err) => {
        console.error('Failed to delete news:', err);
        alert('Failed to delete news');
      }
    });
  };

  if (newsItems.length === 0) {
    return (
      <EntityEmptyState
        icon={Newspaper}
        title="No news yet"
        description="Create your first news item."
      />
    );
  }

  return (
    <EntityTableShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[220px]">Title</TableHead>
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[80px]">Order</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {newsItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDateLabel(item.date)}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm max-w-[280px]">
                <span title={item.description ?? ''}>
                  {item.description
                    ? item.description.length > DESC_PREVIEW_LENGTH
                      ? `${item.description.slice(0, DESC_PREVIEW_LENGTH)}…`
                      : item.description
                    : '—'}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {item.order}
              </TableCell>
              <TableCell>
                <RowActionMenu
                  isLoading={loadingId === item.id}
                  onView={() => router.push(`/admin/news/${item.id}`)}
                  onEdit={() => router.push(`/admin/news/${item.id}/edit`)}
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

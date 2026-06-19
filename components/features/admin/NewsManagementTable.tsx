'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Newspaper } from 'lucide-react';
import type { AdminNews } from '@/types';
import { deleteNews, reorderNews } from '@/app/admin/news/actions';
import { formatDateLabel } from '@/utils/date-format';
import { isHtmlContent } from '@/utils/rich-text';
import { EntityEmptyState } from '@/components/common/admin/EntityEmptyState';
import { RowActionMenu } from '@/components/common/admin/RowActionMenu';
import {
  adminDateCellClass,
  adminDateHeadClass
} from '@/components/common/admin/dateColumnClasses';
import { SortableTable } from '@/components/common/admin/SortableTableDynamic';
import { useConfirmAction } from '@/hooks/useConfirmAction';

type NewsManagementTableProps = {
  news: AdminNews[];
};

function getNewsPhotoUrl(photoPath: string | null): string | null {
  if (!photoPath) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  if (!base) return null;
  return `${base}/storage/v1/object/public/news-photos/${photoPath}`;
}

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

  const handleReorder = async (orderedIds: string[]) => {
    const result = await reorderNews(orderedIds);
    if (result.success) {
      router.refresh();
    }
    return result;
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

  const canDrag = newsItems.length > 1;

  return (
    <SortableTable
      items={newsItems}
      onReorder={handleReorder}
      header={
        <TableHeader>
          <TableRow>
            {canDrag ? <TableHead className="w-12" /> : null}
            <TableHead className="w-20">Order</TableHead>
            <TableHead className="w-55">Title</TableHead>
            <TableHead className="w-22">Photo</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className={adminDateHeadClass}>Created</TableHead>
            <TableHead className="w-15"></TableHead>
          </TableRow>
        </TableHeader>
      }
      renderRow={(item, { canDrag: rowCanDrag, displayIndex }) => {
        const photoUrl = getNewsPhotoUrl(item.photo);
        return (
          <>
            <TableCell className="text-sm text-muted-foreground">
              {rowCanDrag ? displayIndex : item.order}
            </TableCell>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>
              {photoUrl ? (
                <div className="size-14 shrink-0 overflow-hidden rounded border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell className="max-w-70 text-sm text-muted-foreground">
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
            <TableCell className={adminDateCellClass}>
              {formatDateLabel(item.created_at)}
            </TableCell>
            <TableCell>
              <RowActionMenu
                isLoading={loadingId === item.id}
                onView={() => router.push(`/admin/news/${item.id}`)}
                onEdit={() => router.push(`/admin/news/${item.id}/edit`)}
                onDelete={() => handleDelete(item.id, item.title)}
              />
            </TableCell>
          </>
        );
      }}
    />
  );
}

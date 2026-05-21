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
import { Star } from 'lucide-react';
import type { AdminReview } from '@/types';
import { deleteReview } from '@/app/admin/reviews/actions';
import { formatDateLabel } from '@/utils/date-format';
import { isHtmlContent } from '@/utils/rich-text';
import { EntityEmptyState } from '@/components/common/admin/EntityEmptyState';
import {
  adminDateCellClass,
  adminDateHeadClass
} from '@/components/common/admin/dateColumnClasses';
import { EntityTableShell } from '@/components/common/admin/EntityTableShell';
import { RowActionMenu } from '@/components/common/admin/RowActionMenu';
import { useConfirmAction } from '@/hooks/useConfirmAction';

type ReviewsManagementTableProps = {
  reviews: AdminReview[];
};

export default function ReviewsManagementTable({
  reviews: reviewItems
}: ReviewsManagementTableProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { runWithConfirm } = useConfirmAction();

  const handleDelete = async (id: string, label: string) => {
    await runWithConfirm({
      confirmMessage: `Delete this review from "${label}"? This cannot be undone.`,
      onAction: async () => {
        setLoadingId(id);
        try {
          const result = await deleteReview(id);
          if (!result.success) {
            alert(result.error ?? 'Failed to delete review');
            return;
          }
          router.refresh();
        } finally {
          setLoadingId(null);
        }
      },
      onError: (err) => {
        console.error('Failed to delete review:', err);
        alert('Failed to delete review');
      }
    });
  };

  if (reviewItems.length === 0) {
    return (
      <EntityEmptyState
        icon={Star}
        title="No reviews yet"
        description="Add a parent review for the public site."
      />
    );
  }

  return (
    <EntityTableShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-45">Parents (EN)</TableHead>
            <TableHead className="w-45">Parents (UK)</TableHead>
            <TableHead className={adminDateHeadClass}>Date</TableHead>
            <TableHead className="min-w-50">Content (EN)</TableHead>
            <TableHead className="min-w-50">Content (UK)</TableHead>
            <TableHead className="w-15" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviewItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.perens}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {item.perens_uk ? (
                  <span className="line-clamp-2" title={item.perens_uk}>
                    {item.perens_uk}
                  </span>
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell className={adminDateCellClass}>
                {formatDateLabel(item.data)}
              </TableCell>
              <TableCell className="max-w-70 text-sm text-muted-foreground">
                {isHtmlContent(item.content) ? (
                  <div
                    className="rich-text-preview"
                    dangerouslySetInnerHTML={{ __html: item.content || '' }}
                  />
                ) : (
                  <span className="line-clamp-3" title={item.content}>
                    {item.content || '—'}
                  </span>
                )}
              </TableCell>
              <TableCell className="max-w-70 text-sm text-muted-foreground">
                {item.content_uk ? (
                  isHtmlContent(item.content_uk) ? (
                    <div
                      className="rich-text-preview"
                      dangerouslySetInnerHTML={{ __html: item.content_uk }}
                    />
                  ) : (
                    <span className="line-clamp-3" title={item.content_uk}>
                      {item.content_uk}
                    </span>
                  )
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell>
                <RowActionMenu
                  isLoading={loadingId === item.id}
                  onView={() => router.push(`/admin/reviews/${item.id}`)}
                  onEdit={() => router.push(`/admin/reviews/${item.id}/edit`)}
                  onDelete={() => handleDelete(item.id, item.perens)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </EntityTableShell>
  );
}

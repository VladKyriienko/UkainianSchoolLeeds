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
import { Images } from 'lucide-react';
import type { AdminGalleryItem } from '@/lib/class-gallery/actions';
import { deleteGalleryItem } from '@/lib/class-gallery/actions';
import { formatDateLabel } from '@/utils/date-format';
import { EntityEmptyState } from '@/components/common/admin/EntityEmptyState';
import { EntityTableShell } from '@/components/common/admin/EntityTableShell';
import { RowActionMenu } from '@/components/common/admin/RowActionMenu';
import { useConfirmAction } from '@/hooks/useConfirmAction';

type ClassGalleryManagementTableProps = {
  items: AdminGalleryItem[];
  classTitleMap: Map<string, string>;
  basePath?: string;
};

function getPhotoUrl(photoPath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  if (!base) return '';
  return `${base}/storage/v1/object/public/class-gallery/${photoPath}`;
}

export default function ClassGalleryManagementTable({
  items,
  classTitleMap,
  basePath = '/admin/class-gallery'
}: ClassGalleryManagementTableProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { runWithConfirm } = useConfirmAction();

  const handleDelete = async (id: string) => {
    await runWithConfirm({
      confirmMessage: 'Delete this photo from the gallery?',
      onAction: async () => {
        setLoadingId(id);
        try {
          const result = await deleteGalleryItem(id);
          if (!result.success) {
            alert(result.error ?? 'Failed to delete');
            return;
          }
          router.refresh();
        } finally {
          setLoadingId(null);
        }
      },
      onError: (err) => {
        console.error('Failed to delete:', err);
        alert('Failed to delete');
      }
    });
  };

  if (items.length === 0) {
    return (
      <EntityEmptyState
        icon={Images}
        title="No photos yet"
        description="Add a photo to a class gallery."
      />
    );
  }

  return (
    <EntityTableShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">Photo</TableHead>
            <TableHead className="w-50">Class</TableHead>
            <TableHead className="w-20">Order</TableHead>
            <TableHead className="w-30">Created</TableHead>
            <TableHead className="w-15"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="size-14 rounded border overflow-hidden bg-muted shrink-0">
                  <img
                    src={getPhotoUrl(item.photo)}
                    alt=""
                    className="size-full object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {classTitleMap.get(item.class_id) ?? item.class_id}
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
                  onView={() => router.push(`${basePath}/${item.id}`)}
                  onEdit={() => router.push(`${basePath}/${item.id}/edit`)}
                  onDelete={() => handleDelete(item.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </EntityTableShell>
  );
}

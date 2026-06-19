'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Images } from 'lucide-react';
import type { AdminSchoolGalleryItem } from '@/types';
import {
  deleteSchoolGalleryItem,
  reorderSchoolGallery
} from '@/app/admin/gallery/actions';
import { formatDateLabel } from '@/utils/date-format';
import { EntityEmptyState } from '@/components/common/admin/EntityEmptyState';
import {
  adminDateCellClass,
  adminDateHeadClass
} from '@/components/common/admin/dateColumnClasses';
import { SortableTable } from '@/components/common/admin/SortableTableDynamic';
import { RowActionMenu } from '@/components/common/admin/RowActionMenu';
import { useConfirmAction } from '@/hooks/useConfirmAction';

const GALLERY_BUCKET = 'gallery-photos';

function getPhotoUrl(photoPath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  if (!base) return '';
  return `${base}/storage/v1/object/public/${GALLERY_BUCKET}/${photoPath}`;
}

export default function GalleryManagementTable({
  items
}: {
  items: AdminSchoolGalleryItem[];
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { runWithConfirm } = useConfirmAction();

  const handleDelete = async (id: string) => {
    await runWithConfirm({
      confirmMessage: 'Delete this photo from the gallery?',
      onAction: async () => {
        setLoadingId(id);
        try {
          const result = await deleteSchoolGalleryItem(id);
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

  const handleReorder = async (orderedIds: string[]) => {
    const result = await reorderSchoolGallery(orderedIds);
    if (result.success) {
      router.refresh();
    }
    return result;
  };

  if (items.length === 0) {
    return (
      <EntityEmptyState
        icon={Images}
        title="No photos yet"
        description="Add a photo to the school gallery."
      />
    );
  }

  const canDrag = items.length > 1;

  return (
    <SortableTable
      items={items}
      onReorder={handleReorder}
      header={
        <TableHeader>
          <TableRow>
            {canDrag ? <TableHead className="w-12" /> : null}
            <TableHead className="w-20">Order</TableHead>
            <TableHead className="w-25">Photo</TableHead>
            <TableHead className={adminDateHeadClass}>Created</TableHead>
            <TableHead className="w-15"></TableHead>
          </TableRow>
        </TableHeader>
      }
      renderRow={(item, { canDrag: rowCanDrag, displayIndex }) => (
        <>
          <TableCell className="text-sm text-muted-foreground">
            {rowCanDrag ? displayIndex : item.order}
          </TableCell>
          <TableCell>
            <div className="relative size-14 shrink-0 overflow-hidden rounded border bg-muted">
              <Image
                src={getPhotoUrl(item.photo)}
                alt=""
                width={56}
                height={56}
                sizes="56px"
                className="size-full object-cover"
              />
            </div>
          </TableCell>
          <TableCell className={adminDateCellClass}>
            {formatDateLabel(item.created_at)}
          </TableCell>
          <TableCell>
            <RowActionMenu
              isLoading={loadingId === item.id}
              onView={() => router.push(`/admin/gallery/${item.id}`)}
              onEdit={() => router.push(`/admin/gallery/${item.id}/edit`)}
              onDelete={() => handleDelete(item.id)}
            />
          </TableCell>
        </>
      )}
    />
  );
}

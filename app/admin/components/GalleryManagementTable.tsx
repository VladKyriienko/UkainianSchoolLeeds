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
import type { AdminSchoolGalleryItem } from '@/app/admin/gallery/actions';
import { deleteSchoolGalleryItem } from '@/app/admin/gallery/actions';
import { formatDateLabel } from '@/utils/date-format';
import { EntityEmptyState } from '@/components/common/admin/EntityEmptyState';
import { EntityTableShell } from '@/components/common/admin/EntityTableShell';
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

  if (items.length === 0) {
    return (
      <EntityEmptyState
        icon={Images}
        title="No photos yet"
        description="Add a photo to the school gallery."
      />
    );
  }

  return (
    <EntityTableShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Photo</TableHead>
            <TableHead className="w-[80px]">Order</TableHead>
            <TableHead className="w-[120px]">Created</TableHead>
            <TableHead className="w-[60px]"></TableHead>
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
              <TableCell className="text-muted-foreground text-sm">
                {item.order}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </EntityTableShell>
  );
}

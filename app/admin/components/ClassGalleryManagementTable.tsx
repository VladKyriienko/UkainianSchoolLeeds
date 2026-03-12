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
import { Images, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import type { AdminGalleryItem } from '@/app/admin/class-gallery/actions';
import { deleteGalleryItem } from '@/app/admin/class-gallery/actions';
import { format } from 'date-fns';

type ClassGalleryManagementTableProps = {
  items: AdminGalleryItem[];
  classTitleMap: Map<string, string>;
};

function getPhotoUrl(photoPath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  if (!base) return '';
  return `${base}/storage/v1/object/public/class-gallery/${photoPath}`;
}

export default function ClassGalleryManagementTable({
  items,
  classTitleMap
}: ClassGalleryManagementTableProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return '—';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this photo from the gallery?')) return;
    setLoadingId(id);
    try {
      const result = await deleteGalleryItem(id);
      if (!result.success) alert(result.error ?? 'Failed to delete');
      else router.refresh();
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Failed to delete');
    } finally {
      setLoadingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Images className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No photos yet
        </h3>
        <p className="text-muted-foreground">
          Add a photo to a class gallery.
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
              <TableHead className="w-[100px]">Photo</TableHead>
              <TableHead className="w-[200px]">Class</TableHead>
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
                <TableCell className="font-medium">
                  {classTitleMap.get(item.class_id) ?? item.class_id}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {item.order}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(item.created_at)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={loadingId === item.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        onClick={() => router.push(`/admin/class-gallery/${item.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/class-gallery/${item.id}/edit`)
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(item.id)}
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

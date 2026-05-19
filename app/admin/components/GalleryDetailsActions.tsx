'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { deleteSchoolGalleryItem } from '@/app/admin/gallery/actions';

export function GalleryDetailsActions({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this photo from the gallery?')) return;
    setIsDeleting(true);
    try {
      const result = await deleteSchoolGalleryItem(itemId);
      if (result.success) {
        router.push('/admin/gallery');
        router.refresh();
      } else {
        alert(result.error ?? 'Failed to delete');
      }
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Button asChild variant="outline">
        <Link href={`/admin/gallery/${itemId}/edit`}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Link>
      </Button>
      <Button
        type="button"
        variant="destructive"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        {isDeleting ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  );
}

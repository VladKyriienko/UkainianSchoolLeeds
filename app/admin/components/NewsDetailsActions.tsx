'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { deleteNews } from '@/app/admin/news/actions';

export function NewsDetailsActions({
  newsId,
  newsTitle
}: {
  newsId: string;
  newsTitle: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete "${newsTitle}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteNews(newsId);
      if (result.success) {
        router.push('/admin/news');
        router.refresh();
      } else {
        alert(result.error ?? 'Failed to delete news');
      }
    } catch (err) {
      console.error('Failed to delete news:', err);
      alert('Failed to delete news');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Button asChild variant="outline">
        <Link href={`/admin/news/${newsId}/edit`}>
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

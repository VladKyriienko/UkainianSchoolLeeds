'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { deleteReview } from '@/app/admin/reviews/actions';

export function ReviewDetailsActions({
  reviewId,
  attribution
}: {
  reviewId: string;
  attribution: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        `Delete this review from "${attribution}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteReview(reviewId);
      if (result.success) {
        router.push('/admin/reviews');
        router.refresh();
      } else {
        alert(result.error ?? 'Failed to delete review');
      }
    } catch (err) {
      console.error('Failed to delete review:', err);
      alert('Failed to delete review');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Button asChild variant="outline">
        <Link href={`/admin/reviews/${reviewId}/edit`}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Link>
      </Button>
      <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
        <Trash2 className="mr-2 h-4 w-4" />
        {isDeleting ? 'Deleting…' : 'Delete'}
      </Button>
    </div>
  );
}

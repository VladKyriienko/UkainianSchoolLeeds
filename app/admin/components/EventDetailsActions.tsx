'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { deleteEvent } from '@/app/admin/events/actions';

export function EventDetailsActions({
  eventId,
  eventTitle
}: {
  eventId: string;
  eventTitle: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete event "${eventTitle}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteEvent(eventId);
      if (!result.success) {
        alert(result.error || 'Failed to delete event');
        setIsDeleting(false);
        return;
      }
      router.push('/admin/events');
      router.refresh();
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event');
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Button asChild variant="outline">
        <Link href={`/admin/events/${eventId}/edit`}>
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

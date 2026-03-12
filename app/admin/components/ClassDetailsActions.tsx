'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { deleteClass } from '@/app/admin/classes/actions';

export function ClassDetailsActions({
  classId,
  classTitle
}: {
  classId: string;
  classTitle: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete "${classTitle}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteClass(classId);
      if (result.success) {
        router.push('/admin/classes');
        router.refresh();
      } else {
        alert(result.error ?? 'Failed to delete class');
      }
    } catch (err) {
      console.error('Failed to delete class:', err);
      alert('Failed to delete class');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Button asChild variant="outline">
        <Link href={`/admin/classes/${classId}/edit`}>
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

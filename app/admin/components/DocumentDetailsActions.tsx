'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { deleteDocument } from '@/app/admin/documents/actions';

export function DocumentDetailsActions({
  documentId,
  documentTitle
}: {
  documentId: string;
  documentTitle: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete "${documentTitle}"? This cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteDocument(documentId);
      if (result.success) {
        router.push('/admin/documents');
        router.refresh();
      } else {
        alert(result.error ?? 'Failed to delete document');
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('Failed to delete document');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Button asChild variant="outline">
        <Link href={`/admin/documents/${documentId}/edit`}>
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

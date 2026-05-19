'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

type DeleteResult = { success?: boolean; error?: string };

type AdminEntityDetailsActionsProps = {
  editHref?: string;
  listPath: string;
  confirmMessage: string;
  deleteErrorMessage?: string;
  entityId: string;
  deleteAction: (id: string) => Promise<DeleteResult | void>;
};

export function AdminEntityDetailsActions({
  editHref,
  listPath,
  confirmMessage,
  deleteErrorMessage = 'Failed to delete',
  entityId,
  deleteAction
}: AdminEntityDetailsActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(confirmMessage)) return;

    setIsDeleting(true);
    try {
      const result = await deleteAction(entityId);
      if (result?.success === false) {
        alert(result.error ?? deleteErrorMessage);
        return;
      }
      router.push(listPath);
      router.refresh();
    } catch (err) {
      console.error('Delete failed:', err);
      alert(err instanceof Error ? err.message : deleteErrorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {editHref ? (
        <Button asChild variant="outline">
          <Link href={editHref}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      ) : null}
      <Button
        type="button"
        variant="destructive"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {isDeleting ? 'Deleting…' : 'Delete'}
      </Button>
    </div>
  );
}

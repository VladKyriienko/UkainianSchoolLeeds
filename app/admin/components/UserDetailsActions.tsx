'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { deleteUser } from '@/app/admin/users/actions';

export function UserDetailsActions({
  userId,
  userEmail
}: {
  userId: string;
  userEmail: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete user ${userEmail}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUser(userId);
      router.push('/admin/users');
      router.refresh();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert(
        error instanceof Error ? error.message : 'Failed to delete user'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Button asChild variant="outline">
        <Link href={`/admin/users/${userId}/edit`}>
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

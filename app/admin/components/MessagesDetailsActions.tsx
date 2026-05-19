'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteMessage } from '@/app/admin/messages/actions';

export function MessagesDetailsActions({
  messageId,
  subject
}: {
  messageId: string;
  subject: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        `Delete message "${subject}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteMessage(messageId);
      if (result.success) {
        router.push('/admin/messages');
        router.refresh();
      } else {
        alert(result.error ?? 'Failed to delete message');
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
      alert('Failed to delete message');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      {isDeleting ? 'Deleting…' : 'Delete'}
    </Button>
  );
}

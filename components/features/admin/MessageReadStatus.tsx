'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { markMessageAsRead } from '@/app/admin/messages/actions';
import { StatusBadge } from '@/components/common/admin/StatusBadge';

type MessageReadStatusProps = {
  messageId: string;
  initialRead: boolean;
};

export function MessageReadStatus({ messageId, initialRead }: MessageReadStatusProps) {
  const router = useRouter();
  const [read, setRead] = useState(initialRead);

  useEffect(() => {
    if (initialRead) return;

    void markMessageAsRead(messageId).then(() => {
      setRead(true);
      router.refresh();
    });
  }, [messageId, initialRead, router]);

  return (
    <StatusBadge
      label={read ? 'Read' : 'New'}
      variant={read ? 'muted' : 'info'}
    />
  );
}

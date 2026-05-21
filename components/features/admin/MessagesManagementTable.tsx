'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { MessageSquare } from 'lucide-react';
import type { AdminMessage } from '@/types';
import { deleteMessage } from '@/app/admin/messages/actions';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { formatDateTimeLabel } from '@/utils/date-format';
import { EntityEmptyState } from '@/components/common/admin/EntityEmptyState';
import {
  adminDateTimeCellClass,
  adminDateTimeHeadClass
} from '@/components/common/admin/dateColumnClasses';
import { EntityTableShell } from '@/components/common/admin/EntityTableShell';
import { StatusBadge } from '@/components/common/admin/StatusBadge';
import { RowActionMenu } from '@/components/common/admin/RowActionMenu';

type MessagesManagementTableProps = {
  messages: AdminMessage[];
};

const MESSAGE_PREVIEW_LENGTH = 60;

export default function MessagesManagementTable({
  messages
}: MessagesManagementTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = (id: string, subject: string) => {
    if (
      !confirm(
        `Delete message "${subject}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setLoadingId(id);
    startTransition(async () => {
      try {
        const result = await deleteMessage(id);
        if (!result.success) {
          alert(result.error ?? 'Failed to delete message');
        } else {
          router.refresh();
        }
      } catch (err) {
        console.error('Failed to delete message:', err);
        alert('Failed to delete message');
      } finally {
        setLoadingId(null);
      }
    });
  };

  if (messages.length === 0) {
    return (
      <EntityEmptyState
        icon={MessageSquare}
        title="No messages yet"
        description="Messages from the contact form will appear here."
      />
    );
  }

  return (
    <EntityTableShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={adminDateTimeHeadClass}>Date</TableHead>
            <TableHead className="w-30">Name</TableHead>
            <TableHead className="w-45">Email</TableHead>
            <TableHead className="w-35">Subject</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="w-22">Status</TableHead>
            <TableHead className="w-18 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((msg) => (
            <TableRow
              key={msg.id}
              className={msg.read ? '' : 'bg-muted/30'}
            >
              <TableCell className={adminDateTimeCellClass}>
                {formatDateTimeLabel(msg.created_at)}
              </TableCell>
              <TableCell className="font-medium">{msg.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                <a
                  href={`mailto:${msg.email}`}
                  className="block max-w-45 truncate hover:underline"
                >
                  {msg.email}
                </a>
              </TableCell>
              <TableCell className="text-sm">{msg.subject}</TableCell>
              <TableCell className="max-w-70 text-sm text-muted-foreground">
                <span title={msg.message}>
                  {msg.message.length > MESSAGE_PREVIEW_LENGTH
                    ? `${msg.message.slice(0, MESSAGE_PREVIEW_LENGTH)}…`
                    : msg.message}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge
                  label={msg.read ? 'Read' : 'New'}
                  variant={msg.read ? 'muted' : 'info'}
                />
              </TableCell>
              <TableCell className="text-right">
                <RowActionMenu
                  isLoading={isPending && loadingId === msg.id}
                  onView={() => router.push(`/admin/messages/${msg.id}`)}
                  onDelete={() => handleDelete(msg.id, msg.subject)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </EntityTableShell>
  );
}

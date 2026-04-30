'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import type { AdminMessage } from '@/app/admin/messages/actions';
import { markMessageAsRead } from '@/app/admin/messages/actions';
import { useTransition } from 'react';
import { formatDateTimeLabel } from '@/utils/date-format';
import { EntityEmptyState } from '@/components/common/admin/EntityEmptyState';
import { EntityTableShell } from '@/components/common/admin/EntityTableShell';
import { StatusBadge } from '@/components/common/admin/StatusBadge';

type MessagesManagementTableProps = {
  messages: AdminMessage[];
};

const MESSAGE_PREVIEW_LENGTH = 60;

export default function MessagesManagementTable({
  messages
}: MessagesManagementTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleMarkAsRead = (id: string) => {
    startTransition(async () => {
      await markMessageAsRead(id);
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
            <TableHead className="w-[140px]">Date</TableHead>
            <TableHead className="w-[120px]">Name</TableHead>
            <TableHead className="w-[180px]">Email</TableHead>
            <TableHead className="w-[140px]">Subject</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="w-[90px]">Status</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((msg) => (
            <TableRow key={msg.id} className={msg.read ? '' : 'bg-muted/30'}>
              <TableCell className="text-muted-foreground text-sm">
                {formatDateTimeLabel(msg.created_at)}
              </TableCell>
              <TableCell className="font-medium">{msg.name}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                <a
                  href={`mailto:${msg.email}`}
                  className="hover:underline truncate block max-w-[180px]"
                >
                  {msg.email}
                </a>
              </TableCell>
              <TableCell className="text-sm">{msg.subject}</TableCell>
              <TableCell className="text-muted-foreground text-sm max-w-[280px]">
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
                {!msg.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleMarkAsRead(msg.id)}
                  >
                    Mark read
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </EntityTableShell>
  );
}

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
import { format } from 'date-fns';
import { markMessageAsRead } from '@/app/admin/messages/actions';
import { useTransition } from 'react';

type MessagesManagementTableProps = {
  messages: AdminMessage[];
};

const MESSAGE_PREVIEW_LENGTH = 60;

export default function MessagesManagementTable({
  messages
}: MessagesManagementTableProps) {
  const [isPending, startTransition] = useTransition();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm');
    } catch {
      return '—';
    }
  };

  const handleMarkAsRead = (id: string) => {
    startTransition(async () => {
      await markMessageAsRead(id);
    });
  };

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No messages yet
        </h3>
        <p className="text-muted-foreground">
          Messages from the contact form will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
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
                  {formatDate(msg.created_at)}
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
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      msg.read
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {msg.read ? 'Read' : 'New'}
                  </span>
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
      </div>
    </div>
  );
}

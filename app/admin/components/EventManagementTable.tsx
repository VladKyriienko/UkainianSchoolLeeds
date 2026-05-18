'use client';

import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Calendar } from 'lucide-react';
import type { AdminEvent } from '@/app/admin/events/actions';
import { deleteEvent } from '@/app/admin/events/actions';
import { useState } from 'react';
import { formatDateLabel } from '@/utils/date-format';
import { EntityEmptyState } from '@/components/common/admin/EntityEmptyState';
import { EntityTableShell } from '@/components/common/admin/EntityTableShell';
import { RowActionMenu } from '@/components/common/admin/RowActionMenu';
import { useConfirmAction } from '@/hooks/useConfirmAction';

type EventManagementTableProps = {
  events: AdminEvent[];
};

function getEventPhotoUrl(photoPath: string | null): string | null {
  if (!photoPath) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  if (!base) return null;
  return `${base}/storage/v1/object/public/events-photos/${photoPath}`;
}

export default function EventManagementTable({
  events
}: EventManagementTableProps) {
  const router = useRouter();
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const { runWithConfirm } = useConfirmAction();

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '—';
    const parts = timeString.split(':');
    if (parts.length < 2) return timeString;
    const hour = parseInt(parts[0] || '0', 10);
    const minute = parts[1] || '00';
    if (hour === 0) return `12:${minute} am`;
    if (hour < 12) return `${hour}:${minute} am`;
    if (hour === 12) return `12:${minute} pm`;
    return `${hour - 12}:${minute} pm`;
  };

  const handleDelete = async (eventId: string, title: string) => {
    await runWithConfirm({
      confirmMessage: `Are you sure you want to delete event "${title}"? This action cannot be undone.`,
      onAction: async () => {
        setLoadingEventId(eventId);
        try {
          const result = await deleteEvent(eventId);
          if (!result.success) {
            alert(result.error || 'Failed to delete event');
            return;
          }
          router.refresh();
        } finally {
          setLoadingEventId(null);
        }
      },
      onError: (error) => {
        console.error('Failed to delete event:', error);
        alert('Failed to delete event');
      }
    });
  };

  if (events.length === 0) {
    return (
      <EntityEmptyState
        icon={Calendar}
        title="No events found"
        description="Create your first event."
      />
    );
  }

  return (
    <EntityTableShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[88px]">Photo</TableHead>
            <TableHead className="w-[260px]">Title</TableHead>
            <TableHead className="w-[140px]">Date</TableHead>
            <TableHead className="w-[120px]">Start Time</TableHead>
            <TableHead className="w-[120px]">End Time</TableHead>
            <TableHead className="w-[200px]">Location</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => {
            const photoUrl = getEventPhotoUrl(event.photo);
            return (
            <TableRow key={event.id}>
              <TableCell>
                {photoUrl ? (
                  <div className="size-14 rounded border overflow-hidden bg-muted shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  </div>
                ) : (
                  <span className="text-muted-foreground text-xs">—</span>
                )}
              </TableCell>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDateLabel(event.date)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatTime(event.start_time)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatTime(event.end_time)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {event.location || '—'}
              </TableCell>
              <TableCell>
                <RowActionMenu
                  isLoading={loadingEventId === event.id}
                  onView={() => router.push(`/admin/events/${event.id}`)}
                  onEdit={() => router.push(`/admin/events/${event.id}/edit`)}
                  onDelete={() => handleDelete(event.id, event.title)}
                />
              </TableCell>
            </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </EntityTableShell>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Calendar, MoreHorizontal, Edit, Eye, Trash2 } from 'lucide-react';
import type { AdminEvent } from '@/app/(authenticated)/admin/events/actions';
import { deleteEvent } from '@/app/(authenticated)/admin/events/actions';
import { useState } from 'react';
import { format } from 'date-fns';

type EventManagementTableProps = {
  events: AdminEvent[];
};

export default function EventManagementTable({
  events
}: EventManagementTableProps) {
  const router = useRouter();
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return '—';
    }
  };

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
    if (
      !confirm(
        `Are you sure you want to delete event "${title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setLoadingEventId(eventId);
    try {
      const result = await deleteEvent(eventId);
      if (!result.success) {
        alert(result.error || 'Failed to delete event');
        return;
      }
      router.refresh();
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event');
    } finally {
      setLoadingEventId(null);
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No events found
        </h3>
        <p className="text-muted-foreground">Create your first event.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[260px]">Title</TableHead>
              <TableHead className="w-[140px]">Date</TableHead>
              <TableHead className="w-[120px]">Start Time</TableHead>
              <TableHead className="w-[120px]">End Time</TableHead>
              <TableHead className="w-[200px]">Location</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(event.date)}
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={loadingEventId === event.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        onClick={() => router.push(`/admin/events/${event.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/events/${event.id}/edit`)
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(event.id, event.title)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

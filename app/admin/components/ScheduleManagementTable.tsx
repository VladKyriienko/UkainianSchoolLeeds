'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { CalendarClock, MoreHorizontal, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { deleteSchedule, type AdminSchedule } from '@/app/admin/schedule/actions';

type Props = {
  schedule: AdminSchedule[];
};

export default function ScheduleManagementTable({ schedule }: Props) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string, dateLabel: string) => {
    if (
      !confirm(
        `Are you sure you want to delete schedule for "${dateLabel}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setLoadingId(id);
    try {
      const result = await deleteSchedule(id);
      if (!result.success) {
        alert(result.error ?? 'Failed to delete schedule');
        return;
      }
      router.refresh();
    } catch (err) {
      console.error('Failed to delete schedule:', err);
      alert('Failed to delete schedule');
    } finally {
      setLoadingId(null);
    }
  };

  if (schedule.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarClock className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No schedules yet
        </h3>
        <p className="text-muted-foreground">Upload your first timetable PDF.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Date</TableHead>
              <TableHead>File</TableHead>
              <TableHead className="w-[180px]">Uploaded</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map((item) => {
              const dateLabel = format(new Date(item.date), 'MMM d, yyyy');
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{dateLabel}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {item.file}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(item.created_at), 'MMM d, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={loadingId === item.id}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          onClick={() => window.open(item.publicUrl, '_blank')}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Open PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(item.id, dateLabel)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

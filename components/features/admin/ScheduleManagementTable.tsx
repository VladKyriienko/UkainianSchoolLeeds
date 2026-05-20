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
import { CalendarClock } from 'lucide-react';
import { deleteSchedule } from '@/app/admin/schedule/actions';
import type { AdminSchedule } from '@/types';
import { formatDateLabel, formatDateTimeLabel } from '@/utils/date-format';
import { EntityEmptyState } from '@/components/common/admin/EntityEmptyState';
import { EntityTableShell } from '@/components/common/admin/EntityTableShell';
import { RowActionMenu } from '@/components/common/admin/RowActionMenu';
import { useConfirmAction } from '@/hooks/useConfirmAction';

type Props = {
  schedule: AdminSchedule[];
};

export default function ScheduleManagementTable({ schedule }: Props) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { runWithConfirm } = useConfirmAction();

  const handleDelete = async (id: string, dateLabel: string) => {
    await runWithConfirm({
      confirmMessage: `Are you sure you want to delete schedule for "${dateLabel}"? This action cannot be undone.`,
      onAction: async () => {
        setLoadingId(id);
        try {
          const result = await deleteSchedule(id);
          if (!result.success) {
            alert(result.error ?? 'Failed to delete schedule');
            return;
          }
          router.refresh();
        } finally {
          setLoadingId(null);
        }
      },
      onError: (err) => {
        console.error('Failed to delete schedule:', err);
        alert('Failed to delete schedule');
      }
    });
  };

  if (schedule.length === 0) {
    return (
      <EntityEmptyState
        icon={CalendarClock}
        title="No schedules yet"
        description="Upload your first timetable PDF."
      />
    );
  }

  return (
    <EntityTableShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-45">Date</TableHead>
            <TableHead>File</TableHead>
            <TableHead className="w-45">Uploaded</TableHead>
            <TableHead className="w-15"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedule.map((item) => {
            const dateLabel = formatDateLabel(item.date);
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{dateLabel}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {item.file}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDateTimeLabel(item.created_at)}
                </TableCell>
                <TableCell>
                  <RowActionMenu
                    isLoading={loadingId === item.id}
                    onView={() => window.open(item.publicUrl, '_blank')}
                    onDelete={() => handleDelete(item.id, dateLabel)}
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

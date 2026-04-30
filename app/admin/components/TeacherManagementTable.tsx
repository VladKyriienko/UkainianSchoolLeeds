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
import { GraduationCap } from 'lucide-react';
import type { AdminTeacher } from '@/app/admin/teachers/actions';
import { deleteTeacher } from '@/app/admin/teachers/actions';
import { useState } from 'react';
import { EntityEmptyState } from '@/components/common/admin/EntityEmptyState';
import { EntityTableShell } from '@/components/common/admin/EntityTableShell';
import { RowActionMenu } from '@/components/common/admin/RowActionMenu';
import { useConfirmAction } from '@/hooks/useConfirmAction';

type TeacherManagementTableProps = {
  teachers: AdminTeacher[];
};

export default function TeacherManagementTable({
  teachers
}: TeacherManagementTableProps) {
  const router = useRouter();
  const [loadingTeacherId, setLoadingTeacherId] = useState<string | null>(null);
  const { runWithConfirm } = useConfirmAction();

  const handleDelete = async (teacherId: string, name: string) => {
    await runWithConfirm({
      confirmMessage: `Are you sure you want to delete teacher "${name}"? This will also delete the photo from storage.`,
      onAction: async () => {
        setLoadingTeacherId(teacherId);
        try {
          await deleteTeacher(teacherId);
          router.refresh();
        } finally {
          setLoadingTeacherId(null);
        }
      },
      onError: (error) => {
        console.error('Failed to delete teacher:', error);
        alert('Failed to delete teacher');
      }
    });
  };

  if (teachers.length === 0) {
    return (
      <EntityEmptyState
        icon={GraduationCap}
        title="No teachers found"
        description="Create your first teacher."
      />
    );
  }

  return (
    <EntityTableShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[260px]">Name</TableHead>
            <TableHead className="w-[180px]">Title</TableHead>
            <TableHead className="w-[160px]">Category</TableHead>
            <TableHead className="w-[220px]">Email</TableHead>
            <TableHead className="w-[180px]">Phone</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {t.title || '—'}
              </TableCell>
              <TableCell>{t.category}</TableCell>
              <TableCell className="text-muted-foreground">
                {t.email || '—'}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {t.phone || '—'}
              </TableCell>
              <TableCell>
                <RowActionMenu
                  isLoading={loadingTeacherId === t.id}
                  onView={() => router.push(`/admin/teachers/${t.id}`)}
                  onEdit={() => router.push(`/admin/teachers/${t.id}/edit`)}
                  onDelete={() => handleDelete(t.id, t.name)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </EntityTableShell>
  );
}


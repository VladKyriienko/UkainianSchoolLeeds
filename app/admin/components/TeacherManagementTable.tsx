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
import { GraduationCap, MoreHorizontal, Edit, Eye, Trash2 } from 'lucide-react';
import type { AdminTeacher } from '@/app/admin/teachers/actions';
import { deleteTeacher } from '@/app/admin/teachers/actions';
import { useState } from 'react';

type TeacherManagementTableProps = {
  teachers: AdminTeacher[];
};

export default function TeacherManagementTable({
  teachers
}: TeacherManagementTableProps) {
  const router = useRouter();
  const [loadingTeacherId, setLoadingTeacherId] = useState<string | null>(null);

  const handleDelete = async (teacherId: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete teacher "${name}"? This will also delete the photo from storage.`
      )
    ) {
      return;
    }

    setLoadingTeacherId(teacherId);
    try {
      await deleteTeacher(teacherId);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete teacher:', error);
      alert('Failed to delete teacher');
    } finally {
      setLoadingTeacherId(null);
    }
  };

  if (teachers.length === 0) {
    return (
      <div className="text-center py-12">
        <GraduationCap className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No teachers found
        </h3>
        <p className="text-muted-foreground">Create your first teacher.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={loadingTeacherId === t.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        onClick={() => router.push(`/admin/teachers/${t.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/teachers/${t.id}/edit`)
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(t.id, t.name)}
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


'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
import { BookOpen, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import type { AdminClass } from '@/app/admin/classes/actions';
import { deleteClass } from '@/app/admin/classes/actions';
import { format } from 'date-fns';

type ClassesManagementTableProps = {
  classes: AdminClass[];
};

const DESC_PREVIEW_LENGTH = 60;

export default function ClassesManagementTable({
  classes: classesList
}: ClassesManagementTableProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return '—';
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`
      )
    ) {
      return;
    }
    setLoadingId(id);
    try {
      const result = await deleteClass(id);
      if (!result.success) {
        alert(result.error ?? 'Failed to delete class');
        return;
      }
      router.refresh();
    } catch (err) {
      console.error('Failed to delete class:', err);
      alert('Failed to delete class');
    } finally {
      setLoadingId(null);
    }
  };

  if (classesList.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No classes yet
        </h3>
        <p className="text-muted-foreground">
          Create your first class.
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
              <TableHead className="w-[220px]">Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[80px]">Order</TableHead>
              <TableHead className="w-[120px]">Created</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classesList.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[280px]">
                  <span title={item.description ?? ''}>
                    {item.description
                      ? item.description.length > DESC_PREVIEW_LENGTH
                        ? `${item.description.slice(0, DESC_PREVIEW_LENGTH)}…`
                        : item.description
                      : '—'}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {item.order}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(item.created_at)}
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
                        onClick={() => router.push(`/admin/classes/${item.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/classes/${item.id}/edit`)
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(item.id, item.title)}
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

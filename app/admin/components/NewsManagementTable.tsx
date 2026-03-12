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
import { Newspaper, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import type { AdminNews } from '@/app/admin/news/actions';
import { deleteNews } from '@/app/admin/news/actions';
import { format } from 'date-fns';

type NewsManagementTableProps = {
  news: AdminNews[];
};

const DESC_PREVIEW_LENGTH = 60;

export default function NewsManagementTable({
  news: newsItems
}: NewsManagementTableProps) {
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
      const result = await deleteNews(id);
      if (!result.success) {
        alert(result.error ?? 'Failed to delete news');
        return;
      }
      router.refresh();
    } catch (err) {
      console.error('Failed to delete news:', err);
      alert('Failed to delete news');
    } finally {
      setLoadingId(null);
    }
  };

  if (newsItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Newspaper className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No news yet
        </h3>
        <p className="text-muted-foreground">
          Create your first news item.
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
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[80px]">Order</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {newsItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(item.date)}
                </TableCell>
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
                        onClick={() => router.push(`/admin/news/${item.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/news/${item.id}/edit`)
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

'use client';

import dynamic from 'next/dynamic';

const SortableTableLazy = dynamic(
  () =>
    import('./SortableTable').then((mod) => ({
      default: mod.SortableTable
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-48 w-full animate-pulse rounded-md border bg-muted/40"
        aria-hidden
      />
    )
  }
);

export const SortableTable =
  SortableTableLazy as typeof import('./SortableTable').SortableTable;

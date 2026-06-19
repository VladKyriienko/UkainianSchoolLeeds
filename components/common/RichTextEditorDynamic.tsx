'use client';

import dynamic from 'next/dynamic';
import { cn } from '@/utils/cn';

const RichTextEditorLazy = dynamic(
  () =>
    import('./RichTextEditor').then((mod) => ({
      default: mod.RichTextEditor
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className={cn(
          'min-h-editor w-full animate-pulse rounded-md border border-input bg-muted/40'
        )}
        aria-hidden
      />
    )
  }
);

export const RichTextEditor =
  RichTextEditorLazy as typeof import('./RichTextEditor').RichTextEditor;

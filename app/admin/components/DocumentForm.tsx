'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { AdminDocument } from '@/app/admin/documents/actions';
import { createDocument, updateDocument } from '@/app/admin/documents/actions';
import {
  DOCUMENT_TYPES,
  DOCUMENT_TYPE_LABELS,
  type DocumentType
} from '@/app/admin/documents/constants';

type DocumentFormProps = {
  mode: 'create' | 'edit';
  document?: AdminDocument | null;
};

export function DocumentForm({ mode, document: doc }: DocumentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typeValue, setTypeValue] = useState<string>(doc?.type ?? 'DOCUMEND');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set('type', typeValue);

    try {
      let result;
      if (mode === 'create') {
        result = await createDocument(formData);
      } else {
        if (!doc?.id) {
          throw new Error('Document ID is required for editing');
        }
        result = await updateDocument(doc.id, formData);
      }

      if (!result.success) {
        setError(result.error ?? 'Failed to save document');
        setIsSubmitting(false);
        return;
      }

      router.push('/admin/documents');
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to save document';
      setError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={doc?.title ?? ''}
            placeholder="Document title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title_uk">Title (Ukrainian)</Label>
          <Input
            id="title_uk"
            name="title_uk"
            defaultValue={doc?.title_uk ?? ''}
            placeholder="Назва документа українською"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type *</Label>
        <Select
          value={typeValue}
          onValueChange={setTypeValue}
          required
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {DOCUMENT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {DOCUMENT_TYPE_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            name="content"
            required
            defaultValue={doc?.content ?? ''}
            placeholder="Document content (supports markdown)"
            rows={10}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content_uk">Content (Ukrainian)</Label>
          <Textarea
            id="content_uk"
            name="content_uk"
            defaultValue={doc?.content_uk ?? ''}
            placeholder="Зміст документа українською"
            rows={10}
            className="font-mono text-sm"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving...'
            : mode === 'create'
              ? 'Create document'
              : 'Update document'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

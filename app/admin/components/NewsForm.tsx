'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploadField } from '@/components/ui/image-upload-field';
import type { AdminNews } from '@/app/admin/news/actions';
import { createNews, updateNews } from '@/app/admin/news/actions';
import { format } from 'date-fns';

type NewsFormProps = {
  mode: 'create' | 'edit';
  newsItem?: AdminNews | null;
  currentPhotoUrl?: string | null;
};

function formatDateForInput(dateString: string | null): string {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'yyyy-MM-dd');
  } catch {
    return '';
  }
}

export function NewsForm({ mode, newsItem, currentPhotoUrl }: NewsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    if (photoFile) formData.set('photo', photoFile);

    try {
      let result;
      if (mode === 'create') {
        result = await createNews(formData);
      } else {
        if (!newsItem?.id) {
          throw new Error('News ID is required for editing');
        }
        result = await updateNews(newsItem.id, formData);
      }

      if (!result.success) {
        setError(result.error ?? 'Failed to save news');
        setIsSubmitting(false);
        return;
      }

      router.push('/admin/news');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save news';
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
            defaultValue={newsItem?.title ?? ''}
            placeholder="News title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title_uk">Title (Ukrainian)</Label>
          <Input
            id="title_uk"
            name="title_uk"
            defaultValue={newsItem?.title_uk ?? ''}
            placeholder="Назва новини українською"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={newsItem?.description ?? ''}
            placeholder="News description"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description_uk">Description (Ukrainian)</Label>
          <Textarea
            id="description_uk"
            name="description_uk"
            defaultValue={newsItem?.description_uk ?? ''}
            placeholder="Опис новини українською"
            rows={4}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={formatDateForInput(newsItem?.date ?? null)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="order">Order</Label>
          <Input
            id="order"
            name="order"
            type="number"
            min={0}
            defaultValue={newsItem?.order ?? 0}
            placeholder="0"
          />
        </div>
      </div>

      <ImageUploadField
        id="photo"
        name="photo"
        label="Photo (optional)"
        currentImageUrl={currentPhotoUrl}
        removePhotoFieldName="remove_photo"
        onFileChange={setPhotoFile}
      />

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving...'
            : mode === 'create'
              ? 'Create news'
              : 'Update news'}
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

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUploadField } from '@/components/ui/image-upload-field';
import type { AdminNews } from '@/app/admin/news/actions';
import { createNews, updateNews } from '@/app/admin/news/actions';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { parseInputDate, toInputDateValue } from '@/utils/date-format';
import { DatePicker } from '@/app/admin/profile/components/DatePicker';
import { prepareAdminPhotoForUpload } from '@/utils/image-compression';

type NewsFormProps = {
  mode: 'create' | 'edit';
  newsItem?: AdminNews | null;
  currentPhotoUrl?: string | null;
};

export function NewsForm({ mode, newsItem, currentPhotoUrl }: NewsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [description, setDescription] = useState(newsItem?.description ?? '');
  const [descriptionUk, setDescriptionUk] = useState(newsItem?.description_uk ?? '');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    parseInputDate(newsItem?.date ?? '')
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      if (photoFile) {
        formData.set('photo', await prepareAdminPhotoForUpload(photoFile));
      }
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
        <RichTextEditor
          id="description"
          name="description"
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="News description"
          disabled={isSubmitting}
        />

        <RichTextEditor
          id="description_uk"
          name="description_uk"
          label="Description (Ukrainian)"
          value={descriptionUk}
          onChange={setDescriptionUk}
          placeholder="Опис новини українською"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <DatePicker
            date={selectedDate}
            onDateChange={setSelectedDate}
            placeholder="Select date"
            buttonClassName="h-10"
          />
          <input name="date" type="hidden" required value={toInputDateValue(selectedDate)} />
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

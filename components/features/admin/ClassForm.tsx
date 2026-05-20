'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AdminClass } from '@/types';
import { createClass, updateClass } from '@/app/admin/classes/actions';
import { RichTextEditor } from '@/components/common/RichTextEditor';

type ClassFormProps = {
  mode: 'create' | 'edit';
  classItem?: AdminClass | null;
};

export function ClassForm({ mode, classItem }: ClassFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState(classItem?.description ?? '');
  const [descriptionUk, setDescriptionUk] = useState(classItem?.description_uk ?? '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      let result;
      if (mode === 'create') {
        result = await createClass(formData);
      } else {
        if (!classItem?.id) {
          throw new Error('Class ID is required for editing');
        }
        result = await updateClass(classItem.id, formData);
      }

      if (!result.success) {
        setError(result.error ?? 'Failed to save class');
        setIsSubmitting(false);
        return;
      }

      router.push('/admin/classes');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save class';
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
            defaultValue={classItem?.title ?? ''}
            placeholder="Class title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title_uk">Title (Ukrainian)</Label>
          <Input
            id="title_uk"
            name="title_uk"
            defaultValue={classItem?.title_uk ?? ''}
            placeholder="Назва класу українською"
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
          placeholder="Class description"
          disabled={isSubmitting}
        />

        <RichTextEditor
          id="description_uk"
          name="description_uk"
          label="Description (Ukrainian)"
          value={descriptionUk}
          onChange={setDescriptionUk}
          placeholder="Опис класу українською"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2 max-w-xs">
        <Label htmlFor="order">Order</Label>
        <Input
          id="order"
          name="order"
          type="number"
          min={0}
          defaultValue={classItem?.order ?? 0}
          placeholder="0"
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving...'
            : mode === 'create'
              ? 'Create class'
              : 'Update class'}
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

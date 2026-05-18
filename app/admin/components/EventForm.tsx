'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUploadField } from '@/components/ui/image-upload-field';
import type { AdminEvent } from '@/app/admin/events/actions';
import { createEvent, updateEvent } from '@/app/admin/events/actions';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import {
  formatTimeForInput,
  parseInputDate,
  toInputDateValue
} from '@/utils/date-format';
import { DatePicker } from '@/app/admin/profile/components/DatePicker';

type EventFormProps = {
  mode: 'create' | 'edit';
  event?: AdminEvent | null;
  currentPhotoUrl?: string | null;
};

export function EventForm({ mode, event, currentPhotoUrl }: EventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [description, setDescription] = useState(event?.description || '');
  const [descriptionUk, setDescriptionUk] = useState(event?.description_uk || '');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    parseInputDate(event?.date ?? '')
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    if (photoFile) formData.set('photo', photoFile);

    try {
      let result;
      if (mode === 'create') {
        result = await createEvent(formData);
      } else {
        if (!event?.id) {
          throw new Error('Event ID is required for editing');
        }
        result = await updateEvent(event.id, formData);
      }

      if (!result.success) {
        setError(result.error || 'Failed to save event');
        setIsSubmitting(false);
        return;
      }

      router.push('/admin/events');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save event';
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
            defaultValue={event?.title || ''}
            placeholder="Event title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title_uk">Title (Ukrainian)</Label>
          <Input
            id="title_uk"
            name="title_uk"
            defaultValue={event?.title_uk || ''}
            placeholder="Назва події українською"
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
          placeholder="Event description"
          disabled={isSubmitting}
        />

        <RichTextEditor
          id="description_uk"
          name="description_uk"
          label="Description (Ukrainian)"
          value={descriptionUk}
          onChange={setDescriptionUk}
          placeholder="Опис події українською"
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
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            defaultValue={event?.location || ''}
            placeholder="e.g. School Hall, Sports Field"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location_uk">Location (Ukrainian)</Label>
          <Input
            id="location_uk"
            name="location_uk"
            defaultValue={event?.location_uk || ''}
            placeholder="Місце проведення українською"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start_time">Start Time</Label>
          <Input
            id="start_time"
            name="start_time"
            type="time"
            defaultValue={formatTimeForInput(event?.start_time || null)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">End Time</Label>
          <Input
            id="end_time"
            name="end_time"
            type="time"
            defaultValue={formatTimeForInput(event?.end_time || null)}
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
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Event' : 'Update Event'}
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

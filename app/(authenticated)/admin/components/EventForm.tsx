'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { AdminEvent } from '@/app/(authenticated)/admin/events/actions';
import { createEvent, updateEvent } from '@/app/(authenticated)/admin/events/actions';
import { format } from 'date-fns';

type EventFormProps = {
  mode: 'create' | 'edit';
  event?: AdminEvent | null;
};

export function EventForm({ mode, event }: EventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch {
      return '';
    }
  };

  // Format time for input (HH:mm)
  const formatTimeForInput = (timeString: string | null) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Extract HH:mm from HH:mm:ss
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

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
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={event?.description || ''}
            placeholder="Event description"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description_uk">Description (Ukrainian)</Label>
          <Textarea
            id="description_uk"
            name="description_uk"
            defaultValue={event?.description_uk || ''}
            placeholder="Опис події українською"
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
            defaultValue={formatDateForInput(event?.date || null)}
          />
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

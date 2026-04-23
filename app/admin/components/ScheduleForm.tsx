'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/app/admin/profile/components/DatePicker';
import { createSchedule } from '@/app/admin/schedule/actions';

export function ScheduleForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      if (!selectedDate) {
        setError('Date is required');
        setIsSubmitting(false);
        return;
      }

      formData.set('date', format(selectedDate, 'yyyy-MM-dd'));
      const result = await createSchedule(formData);
      if (!result.success) {
        setError(result.error ?? 'Failed to save schedule');
        setIsSubmitting(false);
        return;
      }
      router.push('/admin/schedule');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save schedule';
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
          <Label htmlFor="date">Date (Saturday only) *</Label>
          <DatePicker
            date={selectedDate}
            onDateChange={setSelectedDate}
            placeholder="Pick a Saturday"
            disabled={(date) => date.getDay() !== 6}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="file">PDF file *</Label>
          <Input id="file" name="file" type="file" accept="application/pdf" required />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Uploading...' : 'Create schedule'}
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

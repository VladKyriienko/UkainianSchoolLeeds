'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import type { AdminReview } from '@/app/admin/reviews/actions';
import { createReview, updateReview } from '@/app/admin/reviews/actions';
import { parseInputDate, toInputDateValue } from '@/utils/date-format';
import { DatePicker } from '@/components/common/admin/DatePicker';

type ReviewFormProps = {
  mode: 'create' | 'edit';
  reviewItem?: AdminReview | null;
};

export function ReviewForm({ mode, reviewItem }: ReviewFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string>(reviewItem?.content ?? '');
  const [contentUk, setContentUk] = useState<string>(reviewItem?.content_uk ?? '');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    if (reviewItem?.data) {
      return parseInputDate(reviewItem.data.slice(0, 10));
    }
    return new Date();
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const dateVal =
      toInputDateValue(selectedDate) ?? toInputDateValue(new Date());
    formData.set('data', dateVal);

    try {
      let result;
      if (mode === 'create') {
        result = await createReview(formData);
      } else {
        if (!reviewItem?.id) {
          throw new Error('Review ID is required for editing');
        }
        result = await updateReview(reviewItem.id, formData);
      }

      if (!result.success) {
        setError(result.error ?? 'Failed to save review');
        setIsSubmitting(false);
        return;
      }

      router.push('/admin/reviews');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save review';
      setError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <div className="rounded border border-destructive bg-destructive/10 px-4 py-3 text-destructive">
          {error}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="perens">Parents / attribution (English) *</Label>
        <Input
          id="perens"
          name="perens"
          required
          defaultValue={reviewItem?.perens ?? ''}
          placeholder="e.g. Maria, Sofia's mum"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="perens_uk">Parents / attribution (Ukrainian)</Label>
        <Input
          id="perens_uk"
          name="perens_uk"
          defaultValue={reviewItem?.perens_uk ?? ''}
          placeholder="Необовʼязково, наприклад: Марія, мама Софії"
        />
        <p className="text-xs text-muted-foreground">Optional. Shown when the site language is Ukrainian.</p>
      </div>

      <div className="space-y-4">
        <RichTextEditor
          id="content"
          name="content"
          label="Review text (English) *"
          value={content}
          onChange={setContent}
          placeholder="What parents said about the school…"
          required
          disabled={isSubmitting}
        />

        <RichTextEditor
          id="content_uk"
          name="content_uk"
          label="Review text (Ukrainian)"
          value={contentUk}
          onChange={setContentUk}
          placeholder="Текст відгуку українською…"
          disabled={isSubmitting}
        />
        <p className="text-xs text-muted-foreground">Ukrainian body is optional. Shown when the site language is Ukrainian.</p>
      </div>

      <div className="space-y-2">
        <Label>Review date *</Label>
        <DatePicker
          date={selectedDate}
          onDateChange={setSelectedDate}
          placeholder="Pick date"
          buttonClassName="h-10 w-50"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : mode === 'create' ? 'Create review' : 'Save changes'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/reviews')}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

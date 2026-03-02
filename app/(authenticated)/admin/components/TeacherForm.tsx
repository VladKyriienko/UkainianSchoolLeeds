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
import type { AdminTeacher } from '@/app/(authenticated)/admin/teachers/actions';
import {
  createTeacher,
  updateTeacher
} from '@/app/(authenticated)/admin/teachers/actions';

type TeacherFormProps = {
  mode: 'create' | 'edit';
  teacher?: AdminTeacher | null;
};

export function TeacherForm({ mode, teacher }: TeacherFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState<string>(
    teacher?.category || 'TEACHER'
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set('category', category);

    try {
      if (mode === 'create') {
        await createTeacher(formData);
        router.push('/admin/teachers');
        return;
      }

      if (!teacher?.id) {
        throw new Error('Teacher ID is required for editing');
      }

      await updateTeacher(teacher.id, formData);
      router.push('/admin/teachers');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save teacher';
      setError(msg);
    } finally {
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
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={teacher?.name || ''}
            placeholder="Teacher name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name_uk">Name (Ukrainian)</Label>
          <Input
            id="name_uk"
            name="name_uk"
            defaultValue={teacher?.name_uk || ''}
            placeholder="Ім'я українською"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={teacher?.title || ''}
            placeholder="e.g. Math Teacher"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title_uk">Title (Ukrainian)</Label>
          <Input
            id="title_uk"
            name="title_uk"
            defaultValue={teacher?.title_uk || ''}
            placeholder="e.g. Вчитель математики"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={teacher?.email || ''}
            placeholder="teacher@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={teacher?.phone || ''}
            placeholder="+1 555 000 0000"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HEADTEACHER">Headteacher</SelectItem>
              <SelectItem value="TEACHER">Teacher</SelectItem>
              <SelectItem value="STAF">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="photo">Photo</Label>
          <Input id="photo" name="photo" type="file" accept="image/*" />
          {teacher?.photo && (
            <p className="text-sm text-muted-foreground break-all">
              Current: {teacher.photo}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={teacher?.description || ''}
            placeholder="Short bio / description"
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description_uk">Description (Ukrainian)</Label>
          <Textarea
            id="description_uk"
            name="description_uk"
            defaultValue={teacher?.description_uk || ''}
            placeholder="Коротка біографія українською"
            rows={5}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving...'
            : mode === 'create'
              ? 'Create Teacher'
              : 'Update Teacher'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}


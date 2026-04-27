'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUploadField } from '@/components/ui/image-upload-field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { AdminTeacher } from '@/app/admin/teachers/actions';
import {
  createTeacher,
  updateTeacher
} from '@/app/admin/teachers/actions';
import { RichTextEditor } from '@/components/common/RichTextEditor';

type TeacherFormProps = {
  mode: 'create' | 'edit';
  teacher?: AdminTeacher | null;
  currentPhotoUrl?: string | null;
};

export function TeacherForm({ mode, teacher, currentPhotoUrl }: TeacherFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [description, setDescription] = useState(teacher?.description || '');
  const [descriptionUk, setDescriptionUk] = useState(teacher?.description_uk || '');

  const [category, setCategory] = useState<string>(
    teacher?.category || 'TEACHER'
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set('category', category);
    if (photoFile) formData.set('photo', photoFile);

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

        <ImageUploadField
          id="photo"
          name="photo"
          label="Photo"
          currentImageUrl={currentPhotoUrl}
          removePhotoFieldName="remove_photo"
          onFileChange={setPhotoFile}
        />
      </div>

      <div className="space-y-4">
        <RichTextEditor
          id="description"
          name="description"
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Short bio / description"
          disabled={isSubmitting}
        />

        <RichTextEditor
          id="description_uk"
          name="description_uk"
          label="Description (Ukrainian)"
          value={descriptionUk}
          onChange={setDescriptionUk}
          placeholder="Коротка біографія українською"
          disabled={isSubmitting}
        />
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


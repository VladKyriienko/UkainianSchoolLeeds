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
import type { AdminGalleryItem } from '@/types';
import { createGalleryItem, updateGalleryItem } from '@/lib/class-gallery/actions';
import type { AdminClass } from '@/types';
import { prepareAdminPhotoForUpload } from '@/utils/image-compression';

type ClassGalleryFormProps = {
  mode: 'create' | 'edit';
  item?: AdminGalleryItem | null;
  classes: AdminClass[];
  currentPhotoUrl?: string | null | undefined;
  successRedirectPath?: string;
  fixedClassId?: string;
  hideClassSelect?: boolean;
};

export function ClassGalleryForm({
  mode,
  item,
  classes: classesList,
  currentPhotoUrl,
  successRedirectPath = '/admin/class-gallery',
  fixedClassId,
  hideClassSelect = false
}: ClassGalleryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [classId, setClassId] = useState<string>(fixedClassId ?? item?.class_id ?? '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);
    setError(null);

    try {
      let fileToUpload: File | null = photoFile;
      if (photoFile) {
        fileToUpload = await prepareAdminPhotoForUpload(photoFile);
      }

      const selectedClassId = fixedClassId ?? classId;
      if (!selectedClassId) {
        setError('Class is required');
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData(form);
      formData.set('class_id', selectedClassId);
      if (fileToUpload) formData.set('photo', fileToUpload);

      let result;
      if (mode === 'create') {
        result = await createGalleryItem(formData);
      } else {
        if (!item?.id) throw new Error('Gallery item ID required');
        result = await updateGalleryItem(item.id, formData);
      }
      if (!result.success) {
        setError(result.error ?? 'Failed to save');
        setIsSubmitting(false);
        return;
      }
      router.push(successRedirectPath);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save');
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

      {!hideClassSelect && (
        <div className="space-y-2">
          <Label>Class *</Label>
          <Select
            value={classId}
            onValueChange={setClassId}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classesList.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <ImageUploadField
        id="photo"
        name="photo"
        label={mode === 'create' ? 'Photo *' : 'Photo (optional, upload to replace)'}
        currentImageUrl={currentPhotoUrl}
        removePhotoFieldName="remove_photo"
        onFileChange={setPhotoFile}
      />

      <div className="space-y-2 max-w-xs">
        <Label htmlFor="order">Order</Label>
        <Input
          id="order"
          name="order"
          type="number"
          min={0}
          defaultValue={item?.order ?? 0}
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Add photo' : 'Update'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

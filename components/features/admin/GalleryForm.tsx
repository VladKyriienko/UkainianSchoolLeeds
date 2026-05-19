'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUploadField } from '@/components/ui/image-upload-field';
import type { AdminSchoolGalleryItem } from '@/app/admin/gallery/actions';
import {
  createSchoolGalleryItem,
  updateSchoolGalleryItem
} from '@/app/admin/gallery/actions';
import { prepareAdminPhotoForUpload } from '@/utils/image-compression';

type GalleryFormProps = {
  mode: 'create' | 'edit';
  item?: AdminSchoolGalleryItem | null;
  currentPhotoUrl?: string | null;
};

export function GalleryForm({
  mode,
  item,
  currentPhotoUrl
}: GalleryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

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

      const formData = new FormData(form);
      if (fileToUpload) formData.set('photo', fileToUpload);

      let result;
      if (mode === 'create') {
        result = await createSchoolGalleryItem(formData);
      } else {
        if (!item?.id) throw new Error('Gallery item ID required');
        result = await updateSchoolGalleryItem(item.id, formData);
      }
      if (!result.success) {
        setError(result.error ?? 'Failed to save');
        setIsSubmitting(false);
        return;
      }
      router.push('/admin/gallery');
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

      <ImageUploadField
        id="photo"
        name="photo"
        label={mode === 'create' ? 'Photo *' : 'Photo (optional, upload to replace)'}
        currentImageUrl={currentPhotoUrl}
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

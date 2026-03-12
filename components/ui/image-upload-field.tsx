'use client';

import { useRef, useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { cn } from '@/utils/cn';

type ImageUploadFieldProps = {
  id: string;
  name?: string;
  label?: string;
  accept?: string;
  currentImageUrl?: string | null | undefined;
  removePhotoFieldName?: string;
  onFileChange?: (file: File | null) => void;
  className?: string;
};

export function ImageUploadField({
  id,
  label = 'Photo',
  accept = 'image/*',
  currentImageUrl,
  removePhotoFieldName = 'remove_photo',
  onFileChange,
  className
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);

  const clearPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setRemoved(true);
    onFileChange?.(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [previewUrl, onFileChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      onFileChange?.(null);
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setRemoved(false);
    onFileChange?.(file);
  };

  const showPreview = selectedFile && previewUrl;
  const showCurrent = currentImageUrl && !removed && !selectedFile;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id}>{label}</Label>
      )}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        aria-hidden
        onChange={handleInputChange}
      />
      {removePhotoFieldName && removed && currentImageUrl && (
        <input
          type="hidden"
          name={removePhotoFieldName}
          value="1"
        />
      )}

      {showPreview && (
        <div className="relative size-64 shrink-0">
          <div className="relative size-full rounded-lg border bg-muted overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview"
              className="absolute inset-0 size-full object-cover object-center"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md z-10"
            onClick={clearPreview}
            aria-label="Remove photo"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {showCurrent && (
        <div className="relative size-64 shrink-0">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="relative size-full rounded-lg border bg-muted overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Choose another photo"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImageUrl}
              alt="Current"
              className="absolute inset-0 size-full object-cover object-center pointer-events-none"
            />
          </button>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md z-10"
            onClick={(e) => {
              e.stopPropagation();
              clearPreview();
            }}
            aria-label="Remove photo"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!showPreview && !showCurrent && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center size-64 shrink-0 rounded-lg border-2 border-dashed border-muted-foreground/25',
            'bg-muted/30 hover:bg-muted/50 transition-colors p-4',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          )}
        >
          <Upload className="h-10 w-10 text-muted-foreground mb-2 shrink-0" />
          <span className="text-sm font-medium text-muted-foreground text-center">
            Click to upload
          </span>
          <span className="text-xs text-muted-foreground mt-1 text-center">
            PNG, JPG, GIF (max 5MB)
          </span>
        </button>
      )}
    </div>
  );
}

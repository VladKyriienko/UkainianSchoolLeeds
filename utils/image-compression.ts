/**
 * Image compression utility for avatar uploads
 * Compresses images while maintaining quality
 */

export type CompressionOptions = {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
  /**
   * When set (e.g. `image/jpeg`), forces `canvas.toBlob` to use this MIME type.
   * Use for large PNGs: PNG encoding often ignores quality and stays huge, breaking Server Action body limits.
   */
  outputMimeType?: string;
};

/**
 * Compress an image file while maintaining quality
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.8,
    maxSizeKB = 500,
    outputMimeType
  } = options;

  const blobMime =
    outputMimeType ??
    (file.type.startsWith('image/png') ? 'image/png' : 'image/jpeg');
  const outFileName =
    blobMime === 'image/jpeg'
      ? `${file.name.replace(/\.[^/.]+$/i, '') || 'photo'}.jpg`
      : file.name;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const handleImageLoad = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);

      // Try different quality levels to meet size requirements
      let currentQuality = quality;
      let attempts = 0;
      const maxAttempts = 5;

      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            const sizeKB = blob.size / 1024;

            // If size is acceptable or we've tried enough times, use this result
            if (
              sizeKB <= maxSizeKB ||
              attempts >= maxAttempts ||
              currentQuality <= 0.1
            ) {
              const compressedFile = new File([blob], outFileName, {
                type: blob.type,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              // Reduce quality and try again
              currentQuality = Math.max(0.1, currentQuality - 0.1);
              attempts++;
              tryCompress();
            }
          },
          blobMime,
          currentQuality
        );
      };

      tryCompress();
    };

    img.onload = handleImageLoad;
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Create object URL for the image
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    // Clean up object URL after image loads or errors
    const cleanup = () => URL.revokeObjectURL(objectUrl);
    img.addEventListener('load', cleanup, { once: true });
    img.addEventListener('error', cleanup, { once: true });
  });
}

/**
 * Validate image file type and size
 */
export function validateImageFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Please select an image file' };
  }

  // Check supported formats
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!supportedTypes.includes(file.type)) {
    return { isValid: false, error: 'Supported formats: JPEG, PNG, WebP' };
  }

  // Check file size (10MB limit before compression)
  const maxSizeMB = 10;
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB`
    };
  }

  return { isValid: true };
}

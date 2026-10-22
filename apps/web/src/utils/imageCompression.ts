/**
 * Utility for client-side image compression and resizing.
 * Scales down large images to max dimensions (e.g., 1280x1280) and
 * compresses to JPEG / WebP data URLs to ensure fast uploads and low bandwidth.
 */

export interface CompressionResult {
  dataUrl: string;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
  fileName: string;
}

export async function compressImage(
  file: File,
  maxWidth: number = 1280,
  maxHeight: number = 1280,
  quality: number = 0.8
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Failed to obtain canvas 2D context'));
        }

        // Draw image on canvas
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Prefer image/jpeg for broad compatibility
        const outputType = file.type === 'image/png' && hasAlpha(ctx, width, height) ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputType, quality);

        // Approximate size of base64
        const compressedSize = Math.round((dataUrl.length * 3) / 4);
        const originalSize = file.size;
        const reduction = originalSize > 0 ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100)) : 0;

        resolve({
          dataUrl,
          width,
          height,
          originalSize,
          compressedSize,
          reductionPercentage: reduction,
          fileName: file.name,
        });
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

function hasAlpha(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
  try {
    const imgData = ctx.getImageData(0, 0, Math.min(width, 100), Math.min(height, 100)).data;
    for (let i = 3; i < imgData.length; i += 4) {
      if (imgData[i] < 255) return true;
    }
  } catch {
    return false;
  }
  return false;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

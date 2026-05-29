/**
 * Client-side image downscaling for the audit upload paths.
 *
 * Why this exists: the analyze route forwards the uploaded screenshot to
 * Anthropic's vision API, which rejects images over ~5MB or with extreme
 * dimensions ("Could not process image" → surfaced as a generic 500). A raw
 * full-window / full-page PNG screenshot is routinely 3-10MB, so it must be
 * downscaled before upload. Re-encoding through a canvas also normalizes odd
 * encodings (16-bit, CMYK, animated PNG) into a plain RGB image Claude accepts.
 *
 * Images already within bounds are returned untouched (preserves PNG crispness
 * for small UI screenshots). Larger ones are scaled so the long edge is at most
 * MAX_EDGE (Anthropic's recommended max; it downsamples above this anyway) and
 * re-encoded as JPEG, which keeps the payload comfortably under the limit.
 */

const MAX_EDGE = 1568; // Anthropic's recommended max long edge
const JPEG_QUALITY = 0.85;
const SIZE_CEILING_BYTES = 4_000_000; // re-encode anything above this even if dims are small

export interface ProcessedImage {
  /** data: URL (the existing upload pipeline strips the prefix before sending). */
  base64: string;
  /** Original natural dimensions, for device-type detection (aspect ratio is preserved). */
  width: number;
  height: number;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = src;
  });
}

/**
 * Read a file, downscale/re-encode it if it would be too large for the vision
 * API, and return a data URL plus the original dimensions. Falls back to the
 * original data URL if canvas isn't available.
 */
export async function processImageFile(file: File): Promise<ProcessedImage> {
  const original = await readAsDataUrl(file);
  const img = await loadImage(original);
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  const longEdge = Math.max(width, height);

  // Small enough already — keep the original bytes (crisper for text-heavy UI).
  if (longEdge <= MAX_EDGE && file.size <= SIZE_CEILING_BYTES) {
    return { base64: original, width, height };
  }

  const scale = Math.min(1, MAX_EDGE / longEdge);
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { base64: original, width, height }; // fallback: better to try than to drop

  ctx.drawImage(img, 0, 0, w, h);
  const base64 = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  return { base64, width, height };
}

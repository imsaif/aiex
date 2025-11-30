export type DeviceType = 'mobile' | 'desktop';

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface DetectionResult {
  deviceType: DeviceType;
  dimensions: ImageDimensions;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Gets image dimensions from a base64 data URL
 */
function getImageDimensions(base64: string): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight,
      });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = base64;
  });
}

/**
 * Analyzes aspect ratio to determine device type
 *
 * Mobile indicators:
 * - Portrait orientation (height > width)
 * - Common mobile aspect ratios: 9:19.5 (~0.46), 9:16 (~0.56), 9:18 (~0.5)
 *
 * Desktop indicators:
 * - Landscape or square orientation (width >= height)
 * - Common desktop ratios: 16:9 (~1.78), 16:10 (~1.6), 4:3 (~1.33)
 */
function analyzeAspectRatio(dimensions: ImageDimensions): DetectionResult {
  const { aspectRatio } = dimensions;

  // Common mobile aspect ratios (portrait)
  const MOBILE_RATIOS = [0.46, 0.5, 0.52, 0.56];
  // Common desktop aspect ratios (landscape)
  const DESKTOP_RATIOS = [1.33, 1.6, 1.78, 2.35];

  // Mobile: aspect ratio < 0.65 (clearly portrait)
  if (aspectRatio < 0.65) {
    const closestRatio = findClosestRatio(aspectRatio, MOBILE_RATIOS);
    const confidence = Math.abs(aspectRatio - closestRatio) < 0.1 ? 'high' : 'medium';
    return { deviceType: 'mobile', dimensions, confidence };
  }

  // Desktop: aspect ratio >= 1.0 (landscape or square)
  if (aspectRatio >= 1.0) {
    const closestRatio = findClosestRatio(aspectRatio, DESKTOP_RATIOS);
    const confidence = Math.abs(aspectRatio - closestRatio) < 0.15 ? 'high' : 'medium';
    return { deviceType: 'desktop', dimensions, confidence };
  }

  // Edge case: nearly square (0.65-1.0) - default to desktop with low confidence
  return { deviceType: 'desktop', dimensions, confidence: 'low' };
}

/**
 * Finds the closest ratio from a list of common ratios
 */
function findClosestRatio(target: number, ratios: number[]): number {
  return ratios.reduce((closest, ratio) =>
    Math.abs(ratio - target) < Math.abs(closest - target) ? ratio : closest
  );
}

/**
 * Detects if an image is mobile or desktop based on dimensions and aspect ratio
 */
export async function detectDeviceType(base64Image: string): Promise<DetectionResult> {
  try {
    const dimensions = await getImageDimensions(base64Image);
    return analyzeAspectRatio(dimensions);
  } catch {
    // Fallback to desktop on error
    return {
      deviceType: 'desktop',
      dimensions: { width: 0, height: 0, aspectRatio: 1 },
      confidence: 'low',
    };
  }
}

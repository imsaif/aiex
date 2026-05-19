/**
 * A screenshot source returns candidate UI captures for pattern-classification.
 * Implementations: manualInbox (filesystem), mobbinSource (TODO Phase 2+).
 */

export interface ScreenshotCandidate {
  id: string;             // stable identifier (e.g., file path or remote id)
  sourceType: 'manual' | 'mobbin';
  sourceUrl: string;      // where this screenshot came from
  imageBase64: string;    // raw base64 (no data: prefix)
  mediaType: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';
  productName?: string;
  capturedAt?: Date;
}

export interface ScreenshotSource {
  name: string;
  enabled(): boolean;
  fetch(): Promise<ScreenshotCandidate[]>;
  /** Mark a candidate as processed so the source skips it next run. */
  acknowledge(id: string): Promise<void>;
}

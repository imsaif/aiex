import { promises as fs } from 'fs';
import path from 'path';
import type { ScreenshotCandidate, ScreenshotSource } from './screenshotSource';

const INBOX_DIR = path.join(process.cwd(), 'public', 'screenshots', 'inbox');
const PROCESSED_DIR = path.join(process.cwd(), 'public', 'screenshots', 'processed');

const EXT_TO_MEDIA: Record<string, ScreenshotCandidate['mediaType']> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

/**
 * Reads UI screenshots from public/screenshots/inbox/.
 * Filename convention: <productName>__<sourceUrlEncoded>.<ext>
 * sourceUrl is optional; if absent the file path is used.
 * After processing, files move to public/screenshots/processed/.
 */
export const manualInbox: ScreenshotSource = {
  name: 'manualInbox',

  enabled(): boolean {
    return true;
  },

  async fetch(): Promise<ScreenshotCandidate[]> {
    let entries: string[];
    try {
      entries = await fs.readdir(INBOX_DIR);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
      throw err;
    }

    const candidates: ScreenshotCandidate[] = [];
    for (const name of entries) {
      const ext = path.extname(name).toLowerCase();
      const mediaType = EXT_TO_MEDIA[ext];
      if (!mediaType) continue;

      const full = path.join(INBOX_DIR, name);
      const stat = await fs.stat(full);
      if (!stat.isFile()) continue;

      const buf = await fs.readFile(full);
      const base = name.slice(0, -ext.length);
      const [productName, encodedUrl] = base.split('__');
      const sourceUrl = encodedUrl ? decodeURIComponent(encodedUrl) : `file://${full}`;

      candidates.push({
        id: name,
        sourceType: 'manual',
        sourceUrl,
        imageBase64: buf.toString('base64'),
        mediaType,
        productName: productName || undefined,
        capturedAt: stat.mtime,
      });
    }
    return candidates;
  },

  async acknowledge(id: string): Promise<void> {
    await fs.mkdir(PROCESSED_DIR, { recursive: true });
    const src = path.join(INBOX_DIR, id);
    const dst = path.join(PROCESSED_DIR, id);
    try {
      await fs.rename(src, dst);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.warn('[manualInbox] ack failed:', err);
      }
    }
  },
};

import type { Metadata } from 'next';
import { HandbookPreviewClient } from './preview-client';

export const dynamic = 'force-dynamic'; // Preview pages shouldn't be prerendered
export const metadata: Metadata = {
  title: 'Preview Your Handbook | AI Design Patterns',
  description: 'Preview the AI Design Patterns Handbook before downloading.',
  robots: {
    index: false, // Don't index preview pages
  },
};

export default function PreviewPage() {
  return <HandbookPreviewClient />;
}

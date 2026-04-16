import type { Metadata } from 'next';
import { HandbookClient } from './handbook-client';

export const metadata: Metadata = {
  title: 'AIUX Design Checklist | 28 AI UX Patterns Audit Checklist',
  description: '28 AI UX patterns across 7 categories in a printable audit checklist. Score your AI product during design reviews. Free PDF download.',
  openGraph: {
    title: 'AIUX Design Checklist | 28 AI UX Patterns Audit Checklist',
    description: '28 AI UX patterns across 7 categories in a printable audit checklist. Score your AI product during design reviews.',
    type: 'website',
    url: 'https://aiuxdesign.guide/handbook',
    images: [{ url: '/api/og/page?slug=handbook', width: 1200, height: 630 }],
  },
};

export default function HandbookPage() {
  return <HandbookClient />;
}

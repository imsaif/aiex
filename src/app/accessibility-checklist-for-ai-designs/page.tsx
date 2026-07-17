import type { Metadata } from 'next';
import { AccessibilityChecklistClient } from './accessibility-checklist-client';

export const revalidate = 3600;

const DESCRIPTION =
  'A 10-point accessibility review for AI-generated interfaces, ordered by failure rate. Skip links, landmarks, form labels, heading structure, and more. Free PDF download.';

export const metadata: Metadata = {
  title: 'Accessibility Checklist for AI-Generated Design | Free Download | aiuxdesign.guide',
  description: DESCRIPTION,
  alternates: { canonical: 'https://www.aiuxdesign.guide/accessibility-checklist-for-ai-designs' },
  openGraph: {
    title: 'Accessibility Checklist for AI-Generated Design | Free Download',
    description: DESCRIPTION,
    url: 'https://www.aiuxdesign.guide/accessibility-checklist-for-ai-designs',
    siteName: 'AI UX Design Guide',
    type: 'website',
    images: [{ url: '/api/og/page?slug=accessibility-checklist', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Accessibility Checklist for AI-Generated Design | Free Download',
    description: DESCRIPTION,
    images: ['/api/og/page?slug=accessibility-checklist'],
  },
};

export default function AccessibilityChecklistPage() {
  // <main> gives the page the labeled landmark its own checklist asks for (check #2).
  return (
    <main id="main-content">
      <AccessibilityChecklistClient />
    </main>
  );
}

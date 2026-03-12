import type { Metadata } from 'next';
import { AgenticChecklistClient } from './agentic-checklist-client';

export const metadata: Metadata = {
  title: 'Agentic UX Checklist | Free Download | aiuxdesign.guide',
  description:
    'An 8-pattern checklist for designing trustworthy AI agents. Covers autonomy, intent preview, audit trails, escalation, and more. Free PDF download.',
  openGraph: {
    title: 'Agentic UX Checklist | Free Download',
    description:
      'An 8-pattern checklist for designing trustworthy AI agents. Covers autonomy, intent preview, audit trails, escalation, and more. Free PDF download.',
    url: 'https://www.aiuxdesign.guide/agentic-ux-checklist',
    siteName: 'AI UX Design Guide',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agentic UX Checklist | Free Download',
    description:
      'An 8-pattern checklist for designing trustworthy AI agents. Covers autonomy, intent preview, audit trails, escalation, and more. Free PDF download.',
  },
};

export default function AgenticChecklistPage() {
  return <AgenticChecklistClient />;
}

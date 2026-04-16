import type { Metadata } from 'next';
import { AuditKitClient } from './audit-kit-client';

export const metadata: Metadata = {
  title: 'Agent Readability Audit | Free Download | aiuxdesign.guide',
  description:
    'A 4-page toolkit to test how AI agents read, understand, and represent your product. Free PDF download.',
  openGraph: {
    title: 'Agent Readability Audit | Free Download',
    description:
      'A 4-page toolkit to test how AI agents read, understand, and represent your product. Free PDF download.',
    url: 'https://www.aiuxdesign.guide/agent-readability-audit-kit',
    siteName: 'AI UX Design Guide',
    type: 'website',
    images: [{ url: '/api/og/page?slug=agent-readability-audit-kit', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agent Readability Audit | Free Download',
    description:
      'A 4-page toolkit to test how AI agents read, understand, and represent your product. Free PDF download.',
    images: ['/api/og/page?slug=agent-readability-audit-kit'],
  },
};

export default function AuditKitPage() {
  return <AuditKitClient />;
}

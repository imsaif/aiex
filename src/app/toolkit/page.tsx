import type { Metadata } from 'next';
import { ToolkitClient } from './toolkit-client';

export const metadata: Metadata = {
  title: 'AI Interaction Toolkit | Free Download | aiuxdesign.guide',
  description:
    'A practical 2-page framework for deciding when AI should talk vs. act. Includes the Intent-Clarity Spectrum and Conversation Checklist.',
  openGraph: {
    title: 'AI Interaction Toolkit | Free Download',
    description:
      'A practical 2-page framework for deciding when AI should talk vs. act. Includes the Intent-Clarity Spectrum and Conversation Checklist.',
    url: 'https://www.aiuxdesign.guide/toolkit',
    siteName: 'AI UX Design Guide',
    type: 'website',
    images: [
      {
        url: '/images/toolkit-og.png',
        width: 1200,
        height: 630,
        alt: 'AI Interaction Toolkit - Free PDF Download',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Interaction Toolkit | Free Download',
    description:
      'A practical 3-page framework for deciding when AI should talk vs. act.',
    images: ['/images/toolkit-og.png'],
  },
};

export default function ToolkitPage() {
  return <ToolkitClient />;
}

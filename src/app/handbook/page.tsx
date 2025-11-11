import type { Metadata } from 'next';
import { HandbookClient } from './handbook-client';

export const metadata: Metadata = {
  title: 'Free AI Design Patterns Handbook | 6 Essential Patterns',
  description: 'Master AI design with 6 proven patterns used by Apple, Google, GitHub, and Figma. Learn when, where, and how to add AI without overwhelming users. Download free.',
  openGraph: {
    title: 'Free AI Design Patterns Handbook | 6 Essential Patterns',
    description: 'Master AI design with 6 proven patterns used by Apple, Google, GitHub, and Figma. Learn when, where, and how to add AI without overwhelming users.',
    type: 'website',
    url: 'https://aiuxdesign.guide/handbook',
  },
};

export default function HandbookPage() {
  return <HandbookClient />;
}

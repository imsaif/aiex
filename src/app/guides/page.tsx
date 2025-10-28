import { Metadata } from 'next';
import GuidesClient from './guides-client';

export const metadata: Metadata = {
  title: 'Designer Guides | aiux',
  description:
    'Comprehensive guides for designers to learn how to use AI tools like Claude Code, Cursor, and GitHub in their design workflows.',
  openGraph: {
    title: 'Designer Guides | aiux',
    description:
      'Comprehensive guides for designers to learn how to use AI tools like Claude Code, Cursor, and GitHub in their design workflows.',
    type: 'website',
  },
};

export default function GuidesPage() {
  return <GuidesClient />;
}

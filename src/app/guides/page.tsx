import { Metadata } from 'next';
import GuidesClient from './guides-client';

export const metadata: Metadata = {
  title: 'AI Design Tool Guides | Claude Code, Cursor & GitHub for Designers',
  description:
    'Learn how to use Claude Code, Cursor, and GitHub in your design workflow. Step-by-step guides for designers building AI-powered products.',
  openGraph: {
    title: 'AI Design Tool Guides | Claude Code, Cursor & GitHub for Designers',
    description:
      'Learn how to use Claude Code, Cursor, and GitHub in your design workflow. Step-by-step guides for designers building AI-powered products.',
    type: 'website',
  },
};

export default function GuidesPage() {
  return <GuidesClient />;
}

import { Metadata } from 'next';
import { DownloadClient } from '../download-client';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Download AI Design Patterns Handbook',
  description: 'Download the AI Design Patterns Handbook PDF directly.',
};

interface DownloadPageProps {
  params: Promise<{ token: string }>;
}

export default async function DownloadPage({ params }: DownloadPageProps) {
  const { token } = await params;

  // Check if download token is set and matches
  const downloadToken = process.env.NEXT_PUBLIC_DOWNLOAD_TOKEN;

  if (!downloadToken || token !== downloadToken) {
    redirect('/');
  }

  return <DownloadClient />;
}

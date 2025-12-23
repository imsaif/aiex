import { Metadata } from 'next';
import { checkAdminAuth } from '@/lib/admin-auth';
import AdminNewsletterClient from './admin-newsletter-client';

export const metadata: Metadata = {
  title: 'Newsletter Admin | AI UX Design',
  description: 'Review and approve newsletter drafts',
  robots: 'noindex, nofollow',
};

export const dynamic = 'force-dynamic';

export default async function AdminNewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const isAuthenticated = await checkAdminAuth();
  const selectedId = params.id;

  // Pass empty drafts initially - client will fetch after auth
  // This prevents exposing draft data to unauthenticated users
  return (
    <AdminNewsletterClient
      drafts={[]}
      selectedId={selectedId}
      initialAuth={isAuthenticated}
    />
  );
}

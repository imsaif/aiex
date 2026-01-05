import { Metadata } from 'next';
import { checkAdminAuth } from '@/lib/admin-auth';
import SubscribersClient from './subscribers-client';

export const metadata: Metadata = {
  title: 'Subscribers | Admin | AI UX Design',
  description: 'Manage newsletter subscribers',
  robots: 'noindex, nofollow',
};

export const dynamic = 'force-dynamic';

export default async function SubscribersPage() {
  const isAuthenticated = await checkAdminAuth();

  return <SubscribersClient initialAuth={isAuthenticated} />;
}

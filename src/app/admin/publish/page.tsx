import { checkAdminAuth } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import PublishClient from './publish-client';

export const metadata = {
  title: 'Publish to Beehiiv - Admin',
};

export default async function PublishPage() {
  const isAuthenticated = await checkAdminAuth();

  if (!isAuthenticated) {
    redirect('/admin/newsletter');
  }

  return <PublishClient />;
}

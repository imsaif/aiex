import { checkAdminAuth } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import SocialAccountsClient from './social-accounts-client';

export const metadata = {
  title: 'Social Accounts - Admin',
};

export default async function SocialAccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const isAuthenticated = await checkAdminAuth();

  if (!isAuthenticated) {
    redirect('/admin/newsletter');
  }

  const params = await searchParams;

  return (
    <SocialAccountsClient
      initialSuccess={params.success}
      initialError={params.error}
    />
  );
}

import { Metadata } from 'next';
import { checkAdminAuth } from '@/lib/admin-auth';
import AuditSamplesClient from './samples-client';

export const metadata: Metadata = {
  title: 'Audit Samples | Admin | AI UX Design',
  description: 'Observe audit funnel outcomes',
  robots: 'noindex, nofollow',
};

export const dynamic = 'force-dynamic';

export default async function AuditSamplesPage() {
  const isAuthenticated = await checkAdminAuth();
  return <AuditSamplesClient initialAuth={isAuthenticated} />;
}

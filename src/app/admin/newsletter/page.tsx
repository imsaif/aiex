import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import AdminNewsletterClient from './admin-newsletter-client';

export const metadata: Metadata = {
  title: 'Newsletter Admin | AI UX Design',
  description: 'Review and approve newsletter drafts',
  robots: 'noindex, nofollow',
};

export const dynamic = 'force-dynamic';

async function getDrafts() {
  const drafts = await prisma.newsletterDraft.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  return drafts;
}

export default async function AdminNewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const drafts = await getDrafts();
  const selectedId = params.id;

  return <AdminNewsletterClient drafts={drafts} selectedId={selectedId} />;
}

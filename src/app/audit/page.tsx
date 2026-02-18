import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuditClient from './audit-client';

export const metadata: Metadata = {
  title: 'AI UX Audit Tool | Analyze Your AI Interface Design',
  description: 'Upload a screenshot of your AI interface and get instant, actionable UX feedback based on 36 proven AI design patterns.',
  openGraph: {
    title: 'AI UX Audit Tool | AIUX',
    description: 'Upload a screenshot of your AI interface and get instant, actionable UX feedback based on 36 proven AI design patterns.',
  },
};

export default function AuditPage() {
  return (
    <>
      <Navbar />
      <AuditClient />
      <Footer />
    </>
  );
}

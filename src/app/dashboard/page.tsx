import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DashboardClient from './dashboard-client';

export const metadata: Metadata = {
  title: 'Your Dashboard — Saved AI UX Patterns',
  description:
    'Save the AI UX patterns you want to build and generate a Claude Code / IDE handoff file to implement them in your own design and dev workflow.',
  robots: { index: false, follow: true },
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />
      <DashboardClient />
      <Footer />
    </main>
  );
}

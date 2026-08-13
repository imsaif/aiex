import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { guides } from '@/data/guides';
import DashboardClient from './dashboard-client';

// Compact course index built server-side so the client bundle never imports
// the full guides data file (thousands of lines of lesson content).
const courseIndex = guides.map((guide) => ({
  slug: guide.slug,
  title: guide.title,
  lessonCount: guide.lessons?.length ?? guide.lessonCount ?? 0,
  readTime: guide.readTime,
  relatedPatterns: guide.relatedPatterns ?? [],
}));

export const metadata: Metadata = {
  title: 'Your Dashboard — Saved AI UX Audits & Patterns',
  description:
    'Keep the AI UX audits you have run and the patterns you want to build, then generate a Claude Code / IDE handoff file to implement them in your own design and dev workflow.',
  robots: { index: false, follow: true },
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#F0F1F5] dark:bg-[#162036] bg-grain text-text-primary">
      <Navbar />
      <DashboardClient courses={courseIndex} />
      <Footer />
    </main>
  );
}

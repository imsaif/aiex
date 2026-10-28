import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import LearnShell from '@/components/learn/LearnShell';
import LearnSidebar from '@/components/learn/LearnSidebar';
import { ContinueLearning } from '@/components/learn/CourseProgress';
import { getLessonLinks } from '@/lib/guides/lesson-urls';
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

// Every course with its lesson links, so the Continue card can point at the
// next unfinished lesson. Titles and URLs only; no lesson content.
const continueCourses = guides.map((guide) => ({
  slug: guide.slug,
  title: guide.title,
  lessons: getLessonLinks(guide).map((l) => ({ slug: l.url.split('/').pop() || '', url: l.url, title: l.title })),
}));

export const metadata: Metadata = {
  title: 'Your Dashboard — Saved AI UX Audits & Patterns',
  description:
    'Keep the AI UX audits you have run and the patterns you want to build, then generate a Claude Code / IDE handoff file to implement them in your own design and dev workflow.',
  robots: { index: false, follow: true },
};

export default function DashboardPage() {
  return (
    // Inside the console (2026-10-28), like Patterns, Skills, Courses and the
    // audit tool. It was the last page left on the old dotted ground.
    <>
      <Navbar inConsole />
      <LearnShell sidebar={<LearnSidebar />}>
        <main className="text-text-primary">
          <DashboardClient courses={courseIndex} continueSlot={<ContinueLearning courses={continueCourses} />} />
        </main>
      </LearnShell>
    </>
  );
}

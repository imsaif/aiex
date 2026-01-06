'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Claude, Cursor, Github, Replit, V0, Copilot } from '@lobehub/icons';
import { ArrowLeftIcon, ArrowRightIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { Guide } from '@/types';
import { useGuideProgress } from '@/hooks/useGuideProgress';
import CopyButton from '@/components/ui/CopyButton';
import CourseMetadataBar from '@/components/ui/CourseMetadataBar';
import IntroductionSection from '@/components/ui/IntroductionSection';
import ModuleSection from '@/components/ui/ModuleSection';
import ProgressBar from '@/components/ui/ProgressBar';
import DownloadPDFModal from '@/components/ui/DownloadPDFModal';

interface GuideClientProps {
  guide: Guide;
  previousGuide: Guide | null;
  nextGuide: Guide | null;
}

export default function GuideClient({
  guide,
  previousGuide,
  nextGuide,
}: GuideClientProps) {
  const router = useRouter();
  const {
    getLessonProgress,
    getGuideStatus,
  } = useGuideProgress();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Calculate lesson progress
  const hasLessons = guide.lessons && guide.lessons.length > 0;
  const totalLessons = guide.lessons?.length || 0;
  const lessonProgress = hasLessons ? getLessonProgress(guide.id, totalLessons) : { completed: 0, total: 0, percentage: 0 };
  const guideStatus = hasLessons ? getGuideStatus(guide.id, totalLessons) : 'not-started';


  // Extract and enhance code blocks in guide content
  const enhancedContent = guide.content
    ? guide.content.replace(/<code>([\s\S]*?)<\/code>/g, (match, code) => {
        const encodedCode = code
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'");
        return match; // Keep original for now, we'll add button separately
      })
    : '';

  // Get the appropriate icon for the guide
  const getIcon = () => {
    const iconProps = { size: 24 };
    switch (guide.tool?.toLowerCase()) {
      case 'claude code':
        return <div style={{ color: '#D97757' }}><Claude {...iconProps} /></div>;
      case 'cursor':
        return <div className="text-gray-900 dark:text-gray-100"><Cursor {...iconProps} /></div>;
      case 'github':
        return <div className="text-gray-900 dark:text-gray-100"><Github {...iconProps} /></div>;
      case 'github copilot':
        return <Copilot.Color {...iconProps} />;
      case 'replit ai':
      case 'replit':
        return <div style={{ color: '#FD5402' }}><Replit {...iconProps} /></div>;
      case 'v0 by vercel':
      case 'v0':
        return <div className="text-gray-900 dark:text-gray-100"><V0 {...iconProps} /></div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background-primary text-text-primary">
      {/* Main Content */}
      <div className="pt-12 md:pt-16 pb-12 md:pb-16">
        <div className="max-w-5xl mx-auto px-6">
          {/* Back Link */}
          <button
            type="button"
            onClick={() => {
              console.log('Back button clicked');
              router.push('/guides');
            }}
            className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover hover:underline mb-6 transition-colors cursor-pointer bg-transparent border-none p-2 -ml-2 focus:outline-none active:opacity-80 relative z-10 font-medium"
            tabIndex={0}
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Guides
          </button>

          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-semibold mb-8">{guide.title}</h1>
            <p className="text-lg text-text-secondary mb-6">{guide.description}</p>

            {/* Lesson Progress (if lessons exist and guide started) */}
            {hasLessons && guideStatus !== 'not-started' && (
              <div className="mb-6 p-6 bg-surface-secondary/50 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {lessonProgress.completed} of {lessonProgress.total} lessons complete
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      {guideStatus === 'completed' && 'Guide completed!'}
                      {guideStatus === 'in-progress' && 'Continue learning'}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-accent-primary">{lessonProgress.percentage}%</span>
                </div>
                <ProgressBar percentage={lessonProgress.percentage} size="sm" showPercentage={false} />
              </div>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-gray-300 dark:border-gray-600">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-accent-subtle text-accent-primary font-medium group">
                <div>
                  {getIcon()}
                </div>
                {guide.tool}
              </div>

              <span className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-text-secondary font-medium">
                {guide.skillLevel}
              </span>

              {/* Download PDF Button */}
              <button
                type="button"
                onClick={() => setIsDownloadModalOpen(true)}
                className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-secondary border border-gray-200 dark:border-gray-700 text-text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium text-sm"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </header>

          {/* Guide Introduction */}
          <IntroductionSection
            title="Course Overview"
            description={guide.description}
            content={enhancedContent || '<p>Guide content coming soon...</p>'}
          />

          {/* Lessons Section - Modular Structure */}
          {hasLessons && guide.lessons && (() => {
            // Map module IDs to their display titles, descriptions, and icons
            const moduleConfig: Record<string, { title: string; description: string; icon: string }> = {
              setup: {
                title: 'Setup',
                description: 'Get started and set up your environment',
                icon: 'cog',
              },
              features: {
                title: 'Core Features',
                description: 'Master the main features and capabilities',
                icon: 'code',
              },
              prototype: {
                title: 'Prototype',
                description: 'Build and test your first project',
                icon: 'monitor',
              },
              prototyping: {
                title: 'Prototyping Workflows',
                description: 'Create interactive prototypes and designs',
                icon: 'download',
              },
              collaboration: {
                title: 'Developer Collaboration',
                description: 'Work effectively with your development team',
                icon: 'user',
              },
              github: {
                title: 'GitHub',
                description: 'Manage your projects with version control',
                icon: 'github',
              },
              practices: {
                title: 'Best Practices',
                description: 'Learn industry standards and patterns',
                icon: 'check',
              },
            };

            // Extract unique module IDs from lessons in order of appearance
            const moduleIds = Array.from(
              new Map(
                guide.lessons!.map((lesson) => [lesson.module || 'uncategorized', lesson.module || 'uncategorized'])
              ).values()
            );

            let lessonNumber = 1;

            return (
              <section className="mb-12 pb-12 border-b border-gray-300 dark:border-gray-600 space-y-6">
                {moduleIds.map((moduleId) => {
                  const moduleLessons = guide.lessons!.filter(
                    (lesson) => lesson.module === moduleId
                  );

                  if (moduleLessons.length === 0) return null;

                  const config = moduleConfig[moduleId] || {
                    title: moduleId.charAt(0).toUpperCase() + moduleId.slice(1),
                    description: 'Learn more about this module',
                    icon: 'code',
                  };

                  const moduleStartLessonNumber = lessonNumber;
                  lessonNumber += moduleLessons.length;

                  return (
                    <ModuleSection
                      key={moduleId}
                      moduleTitle={config.title}
                      moduleDescription={config.description}
                      moduleIcon={config.icon}
                      lessons={moduleLessons}
                      startLessonNumber={moduleStartLessonNumber}
                      guideId={guide.id}
                      guideTitle={guide.title}
                    />
                  );
                })}
              </section>
            );
          })()}

          {/* Previous/Next Guide Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 mt-12">
            {previousGuide ? (
              <Link
                href={`/guides/${previousGuide.slug}`}
                className="flex items-center gap-3 text-text-primary hover:text-accent-primary group transition-colors flex-1"
              >
                <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-text-secondary">Previous Guide</p>
                  <p className="font-medium truncate">{previousGuide.title}</p>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            <button
              type="button"
              onClick={() => {
                console.log('View All Guides button clicked');
                router.push('/guides');
              }}
              className="px-6 py-2 rounded-full bg-accent-primary text-white dark:text-gray-900 font-medium hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98] transition-all flex-shrink-0 cursor-pointer focus:outline-none"
              tabIndex={0}
            >
              View All Guides
            </button>

            {nextGuide ? (
              <Link
                href={`/guides/${nextGuide.slug}`}
                className="flex items-center gap-3 text-text-primary hover:text-accent-primary group transition-colors justify-end flex-1"
              >
                <div className="min-w-0 text-right">
                  <p className="text-xs text-text-secondary">Next Guide</p>
                  <p className="font-medium truncate">{nextGuide.title}</p>
                </div>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </div>
      </div>

      {/* Download PDF Modal */}
      <DownloadPDFModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        guideTitle={guide.title}
        guideSlug={guide.slug}
      />
    </div>
  );
}

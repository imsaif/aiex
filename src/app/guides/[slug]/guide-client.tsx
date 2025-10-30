'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Guide } from '@/types';
import { useGuideProgress } from '@/hooks/useGuideProgress';
import CopyButton from '@/components/ui/CopyButton';
import CourseMetadataBar from '@/components/ui/CourseMetadataBar';
import IntroductionSection from '@/components/ui/IntroductionSection';
import ModuleSection from '@/components/ui/ModuleSection';
import ProgressBar from '@/components/ui/ProgressBar';

interface GuideClientProps {
  guide: Guide;
  previousGuide: Guide | null;
  nextGuide: Guide | null;
  relatedPatterns: any[];
}

export default function GuideClient({
  guide,
  previousGuide,
  nextGuide,
  relatedPatterns,
}: GuideClientProps) {
  const {
    isGuideCompleted,
    markGuideComplete,
    markGuideIncomplete,
    getLessonProgress,
    getGuideStatus,
    getGuideTotalTimeSpent,
    getGuideAverageTimePerLesson,
    getTimeSpentDisplay,
  } = useGuideProgress();
  const [isCompleted, setIsCompleted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showCompletionNotice, setShowCompletionNotice] = useState(false);

  // Calculate lesson progress
  const hasLessons = guide.lessons && guide.lessons.length > 0;
  const totalLessons = guide.lessons?.length || 0;
  const lessonProgress = hasLessons ? getLessonProgress(guide.id, totalLessons) : { completed: 0, total: 0, percentage: 0 };
  const guideStatus = hasLessons ? getGuideStatus(guide.id, totalLessons) : 'not-started';

  // Load completion status on mount
  useEffect(() => {
    setIsCompleted(isGuideCompleted(guide.id));
  }, [guide.id, isGuideCompleted]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const totalScroll = documentHeight - windowHeight;
      const progress = totalScroll > 0 ? (scrollTop / totalScroll) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleComplete = () => {
    if (isCompleted) {
      markGuideIncomplete(guide.id);
      setIsCompleted(false);
      setShowCompletionNotice(false);
    } else {
      markGuideComplete(guide.id);
      setIsCompleted(true);
      setShowCompletionNotice(true);
      setTimeout(() => setShowCompletionNotice(false), 3000);
    }
  };

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

  return (
    <div className="min-h-screen bg-background-primary text-text-primary">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-primary to-blue-500 z-50"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrollProgress / 100 }}
        transition={{ duration: 0.2 }}
        style={{ transformOrigin: 'left' }}
      />

      {/* Completion Notification */}
      <AnimatePresence>
        {showCompletionNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-green-500 dark:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-5 h-5"
            >
              <polyline points="20 6 9 17 4 12" fill="none" stroke="white" strokeWidth="3" />
            </svg>
            <span className="font-medium">Great! Guide marked as complete</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="py-12 md:py-16">
        <div className="max-w-[900px] mx-auto px-8 md:px-12 lg:px-16">
          {/* Back Link */}
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover mb-6 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Guides
          </Link>

          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{guide.title}</h1>
            <p className="text-xl text-text-secondary mb-6">{guide.description}</p>

            {/* Lesson Progress (if lessons exist) */}
            {hasLessons && (
              <div className="mb-6 p-4 bg-surface-secondary/50 rounded-lg border border-border-primary">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {lessonProgress.completed} of {lessonProgress.total} lessons complete
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      {guideStatus === 'completed' && 'Guide completed!'}
                      {guideStatus === 'in-progress' && 'Continue learning'}
                      {guideStatus === 'not-started' && 'Start this guide'}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-accent-primary">{lessonProgress.percentage}%</span>
                </div>
                <ProgressBar percentage={lessonProgress.percentage} size="sm" showPercentage={false} />
              </div>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-border-primary">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-secondary">Tool:</span>
                <span className="px-3 py-1 rounded-full text-sm bg-accent-subtle text-accent-primary font-medium">
                  {guide.tool}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-secondary">Level:</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-text-secondary">
                  {guide.skillLevel}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4 text-text-secondary"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="text-sm text-text-secondary">{guide.readTime} min read</span>
              </div>

              {/* Time Spent Tracker */}
              {hasLessons && (
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-4 h-4 text-accent-primary"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="text-sm font-medium text-accent-primary">
                    {getTimeSpentDisplay(getGuideTotalTimeSpent(guide.id))} spent
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-secondary">Domain:</span>
                <span className="text-sm text-text-secondary">{guide.designDomain}</span>
              </div>
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
            const modules = [
              {
                id: 'setup',
                title: 'Setup',
                description: 'Get started with Claude Code',
              },
              {
                id: 'prototype',
                title: 'Prototype',
                description: 'Build and test your first project',
              },
              {
                id: 'github',
                title: 'GitHub',
                description: 'Manage your projects with version control',
              },
              {
                id: 'practices',
                title: 'Best Practices',
                description: 'Learn industry standards and patterns',
              },
            ];

            let lessonNumber = 1;

            return (
              <section className="mb-12 pb-12 border-b border-border-primary space-y-6">
                {modules.map((module) => {
                  const moduleLessons = guide.lessons!.filter(
                    (lesson) => lesson.module === module.id
                  );

                  if (moduleLessons.length === 0) return null;

                  const moduleStartLessonNumber = lessonNumber;
                  lessonNumber += moduleLessons.length;

                  return (
                    <ModuleSection
                      key={module.id}
                      moduleTitle={module.title}
                      moduleDescription={module.description}
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

          {/* Related Patterns Section */}
          {relatedPatterns.length > 0 && (
            <section className="mt-16 pt-12 border-t border-border-primary">
              <h2 className="text-2xl font-bold mb-6">Related Patterns</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPatterns.map((pattern) => (
                  <Link
                    key={pattern.id}
                    href={`/patterns/${pattern.slug}`}
                    className="group p-4 rounded-lg bg-surface-primary border border-border-primary
                             hover:border-border-secondary hover:shadow-md transition-all duration-300"
                  >
                    <h3 className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                      {pattern.title}
                    </h3>
                    <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                      {pattern.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Completion Button */}
          <motion.button
            onClick={handleToggleComplete}
            className={`fixed bottom-8 right-8 flex items-center gap-2 px-6 py-3 rounded-full font-medium
                       transition-all duration-300 shadow-lg hover:shadow-xl
                       ${
                         isCompleted
                           ? 'bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700'
                           : 'bg-accent-primary text-background-primary hover:bg-accent-hover'
                       }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCompleted ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-5 h-5"
                >
                  <polyline points="20 6 9 17 4 12" fill="none" stroke="white" strokeWidth="3" />
                </svg>
                Completed
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Mark Complete
              </>
            )}
          </motion.button>

          {/* Previous/Next Guide Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-border-primary pt-8 mt-12">
            {previousGuide ? (
              <Link
                href={`/guides/${previousGuide.slug}`}
                className="flex items-center gap-3 text-text-primary hover:text-accent-primary group transition-colors flex-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:-translate-x-1 transition-transform flex-shrink-0"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <div className="min-w-0">
                  <p className="text-xs text-text-secondary">Previous Guide</p>
                  <p className="font-medium truncate">{previousGuide.title}</p>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            <Link
              href="/guides"
              className="px-6 py-2 rounded-full bg-accent-subtle text-accent-primary font-medium hover:bg-accent-primary hover:text-background-primary transition-colors border border-accent-primary/20 flex-shrink-0"
            >
              View All Guides
            </Link>

            {nextGuide ? (
              <Link
                href={`/guides/${nextGuide.slug}`}
                className="flex items-center gap-3 text-text-primary hover:text-accent-primary group transition-colors justify-end flex-1"
              >
                <div className="min-w-0 text-right">
                  <p className="text-xs text-text-secondary">Next Guide</p>
                  <p className="font-medium truncate">{nextGuide.title}</p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-1 transition-transform flex-shrink-0"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

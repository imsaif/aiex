'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Claude, Cursor, Github, Replit, V0, Copilot } from '@lobehub/icons';
import { ClockIcon, BookOpenIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  index?: number;
}

// Key highlights for each guide
const guideHighlights: Record<string, string[]> = {
  'cursor-learning-path': ['Tab autocomplete & AI suggestions', 'Chat & Composer for code generation', 'Design-to-code workflows'],
  'copilot-course': ['Inline code suggestions', 'AI pair programming', 'Works in VS Code, JetBrains & more'],
  'github-learning-path': ['Version control basics', 'Pull requests & code review', 'Team collaboration workflows'],
};

// What makes each tool unique
const toolTaglines: Record<string, string> = {
  'cursor-learning-path': 'AI-native code editor built for speed',
  'copilot-course': 'AI pair programmer in your favorite IDE',
  'github-learning-path': 'Industry-standard version control',
};

// Module names for each guide
const guideModules: Record<string, string[]> = {
  'cursor-learning-path': ['Setup', 'Core Features', 'Design-to-code', 'Customization'],
  'copilot-course': ['Setup', 'Core Features', 'Collaboration', 'Best Practices'],
  'github-learning-path': ['Setup', 'Core Features', 'Collaboration', 'Best Practices'],
};

export default function CourseCard({ course, index = 0 }: CourseCardProps) {
  const guide = course as any;

  // Extract metadata
  const lessonCount = guide.lessons?.length || guide.lessonCount || 0;
  const readTime = guide.readTime || 0;

  // Get highlights, tagline, and modules
  const highlights = guideHighlights[course.slug] || [];
  const tagline = toolTaglines[course.slug] || '';
  const modules = guideModules[course.slug] || [];

  // Get the appropriate icon for the course
  const getIcon = () => {
    const iconProps = { size: 32 };
    const tool = guide.tool?.toLowerCase();
    switch (tool) {
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
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ delay: index * 0.05 }}
      className="h-full"
    >
      <Link href={`/guides/${course.slug}`} className="block group h-full">
        <div
          className="bg-surface-primary rounded-2xl border border-gray-200 dark:border-gray-700 shadow-card
                    hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 h-full
                    flex flex-col overflow-hidden hover:shadow-card-hover p-6"
        >
          {/* Header: Icon + Title */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-primary transition-colors mb-1">
                {course.title}
              </h3>
              {tagline && (
                <p className="text-sm text-text-secondary">{tagline}</p>
              )}
            </div>
          </div>

          {/* What you'll learn */}
          {highlights.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">
                What you'll learn
              </p>
              <ul className="space-y-1.5">
                {highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-1.5 flex-shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Modules */}
          {modules.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">
                Modules
              </p>
              <div className="flex flex-wrap gap-2">
                {modules.map((module, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-text-secondary"
                  >
                    <span className="w-4 h-4 rounded-full bg-accent-subtle text-accent-primary text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    {module}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer: Metadata + CTA */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-text-secondary">
              {readTime > 0 && (
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span>{readTime} min</span>
                </div>
              )}
              {lessonCount > 0 && (
                <div className="flex items-center gap-1">
                  <BookOpenIcon className="w-3.5 h-3.5" />
                  <span>{lessonCount} lessons</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-accent-primary group-hover:gap-2 transition-all">
              Start
              <ArrowRightIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

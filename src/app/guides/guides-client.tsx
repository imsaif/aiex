'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Claude, Cursor, Github, Copilot } from '@lobehub/icons';
import { ClockIcon, BookOpenIcon, FolderIcon, ArrowRightIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { guides } from '@/data/guides';

// Guide metadata
const guideData: Record<string, { tagline: string; highlights: string[]; modules: string[] }> = {
  'claude-code-learning-path': {
    tagline: 'Start Here',
    highlights: ['Figma MCP design-to-code', 'AI-powered prototyping', 'Version control basics'],
    modules: ['Setup', 'Figma ↔ Code', 'Prototyping', 'GitHub', 'Best Practices'],
  },
  'cursor-learning-path': {
    tagline: 'AI-native code editor',
    highlights: ['Tab autocomplete & AI suggestions', 'Chat & Composer for code generation', 'Design-to-code workflows'],
    modules: ['Setup', 'Core Features', 'Design-to-code', 'Customization'],
  },
  'github-copilot-learning-path': {
    tagline: 'AI pair programmer',
    highlights: ['Inline code suggestions', 'AI pair programming', 'Works in VS Code, JetBrains & more'],
    modules: ['Setup', 'Core Features', 'Collaboration', 'Best Practices'],
  },
  'github-learning-path': {
    tagline: 'Industry-standard version control',
    highlights: ['Version control basics', 'Pull requests & code review', 'Team collaboration workflows'],
    modules: ['Setup', 'Core Features', 'Collaboration', 'Best Practices'],
  },
  'conversational-ui-guide': {
    tagline: 'Design & implementation guide',
    highlights: ['Chat bubbles, streaming & typing indicators', 'Context management & error recovery', 'Agentic AI patterns & accessibility'],
    modules: ['Foundations', 'Building', 'Advanced Patterns', 'Ship It'],
  },
};

// Get icon component for a guide
function GuideIcon({ tool, size = 40 }: { tool: string; size?: number }) {
  const iconProps = { size };
  switch (tool?.toLowerCase()) {
    case 'claude code':
      return <div className="text-[--claude-brand]" style={{ '--claude-brand': '#D97757' } as React.CSSProperties}><Claude {...iconProps} /></div>;
    case 'cursor':
      return <div className="text-gray-900 dark:text-gray-100"><Cursor {...iconProps} /></div>;
    case 'github':
      return <div className="text-gray-900 dark:text-gray-100"><Github {...iconProps} /></div>;
    case 'github copilot':
      return <Copilot.Color {...iconProps} />;
    default:
      return <div className="text-accent-primary"><ChatBubbleLeftRightIcon style={{ width: size, height: size }} /></div>;
  }
}

export default function GuidesClient() {
  const featuredSlugs = ['claude-code-learning-path', 'conversational-ui-guide'];
  const featuredGuides = useMemo(() => guides.filter(g => featuredSlugs.includes(g.slug)), []);
  const otherGuides = useMemo(() => guides.filter(g => !featuredSlugs.includes(g.slug)), []);

  // Get metadata for a guide
  const getGuideMeta = (guide: any) => {
    const lessons = guide.lessons?.length || guide.lessonCount || 0;
    const uniqueModules = guide.lessons
      ? [...new Set(guide.lessons.map((l: any) => l.module).filter(Boolean))]
      : [];
    return {
      lessons,
      moduleCount: uniqueModules.length,
      readTime: guide.readTime || 0,
    };
  };

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-12 md:pt-16 pb-8 md:pb-12 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4">
              Master AI Design Tools
            </h1>
            <p className="text-lg md:text-xl text-text-secondary">
              Practical tutorials. Complete learning paths.
            </p>
          </div>
        </div>
      </section>

      {/* Recommended Start Section */}
      {featuredGuides.length > 0 && (
        <section className="py-12 md:py-16 border-b border-border-secondary">
          <div className="max-w-7xl mx-auto px-6">
            {/* Section Label */}
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent-subtle text-accent-primary border border-accent-primary/20">
                Recommended Start
              </span>
            </div>

            {/* Featured Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredGuides.map((guide) => {
                const meta = getGuideMeta(guide);
                const data = guideData[guide.slug] || { tagline: '', highlights: [], modules: [] };

                return (
                  <Link key={guide.id} href={`/guides/${guide.slug}`} className="block group">
                    <div className="h-full bg-surface-secondary rounded-3xl border border-gray-200 dark:border-gray-700 p-8 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg">
                      {/* Icon & Title */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent-subtle flex items-center justify-center flex-shrink-0">
                          <GuideIcon tool={guide.tool} size={28} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-accent-primary mb-0.5">
                            {data.tagline}
                          </p>
                          <h2 className="text-xl font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                            {guide.title}
                          </h2>
                        </div>
                      </div>

                      {/* Highlights */}
                      {data.highlights.length > 0 && (
                        <ul className="space-y-2 mb-5">
                          {data.highlights.map((highlight, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent-primary flex-shrink-0" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-5 text-sm text-text-secondary mb-6">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="w-4 h-4" />
                          <span>{meta.readTime} min</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpenIcon className="w-4 h-4" />
                          <span>{meta.lessons} lessons</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FolderIcon className="w-4 h-4" />
                          <span>{meta.moduleCount} modules</span>
                        </div>
                      </div>

                      {/* Modules */}
                      {data.modules.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-3">
                            Modules
                          </p>
                          <div className="space-y-2">
                            {data.modules.map((module, i) => (
                              <div
                                key={module}
                                className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                              >
                                <span className="w-6 h-6 rounded-full bg-accent-subtle text-accent-primary text-xs font-bold flex items-center justify-center">
                                  {i + 1}
                                </span>
                                <span className="text-sm font-medium text-text-primary">
                                  {module}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CTA */}
                      <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-primary text-white dark:text-gray-900 font-medium group-hover:bg-accent-hover transition-colors">
                        Start Learning
                        <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* More Guides Section */}
      {otherGuides.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-6">
            {/* Section Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-2">More Guides</h2>
              <p className="text-text-secondary">
                Explore other AI tools to expand your workflow
              </p>
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {otherGuides.map((guide) => {
                const meta = getGuideMeta(guide);
                const data = guideData[guide.slug] || { tagline: '', highlights: [], modules: [] };

                return (
                  <Link key={guide.id} href={`/guides/${guide.slug}`} className="block group">
                    <div className="h-full bg-surface-primary rounded-2xl border border-gray-200 dark:border-gray-700 p-8 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg flex flex-col">
                      {/* Icon & Title */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                          <GuideIcon tool={guide.tool} size={28} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-accent-primary mb-0.5">
                            {data.tagline}
                          </p>
                          <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                            {guide.title}
                          </h3>
                        </div>
                      </div>

                      {/* Highlights */}
                      {data.highlights.length > 0 && (
                        <ul className="space-y-2 mb-5">
                          {data.highlights.map((highlight, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent-primary flex-shrink-0" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-5 text-sm text-text-secondary mt-auto mb-6">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="w-4 h-4" />
                          <span>{meta.readTime} min</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpenIcon className="w-4 h-4" />
                          <span>{meta.lessons} lessons</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FolderIcon className="w-4 h-4" />
                          <span>{meta.moduleCount} modules</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-primary text-white dark:text-gray-900 font-medium group-hover:bg-accent-hover transition-colors">
                        Start Learning
                        <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <ScrollToTop />
    </main>
  );
}

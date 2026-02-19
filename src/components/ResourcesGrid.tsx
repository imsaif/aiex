'use client';

import { useState, useMemo, useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import UnifiedSearchBar from '@/components/ui/UnifiedSearchBar';
import FilterPills from '@/components/ui/FilterPills';
import CategoryFilterSheet from '@/components/ui/CategoryFilterSheet';
import ScrollToTop from '@/components/ui/ScrollToTop';
import {
  MagnifyingGlassCircleIcon,
  NewspaperIcon,
  WrenchScrewdriverIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

interface Resource {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  category: string;
  type: string;
  tags: string[];
  href: string;
  ctaText: string;
  linkType: 'internal' | 'external' | 'download';
}

const ICON_CLASS = 'w-5 h-5 text-accent-primary';

const RESOURCES: Resource[] = [
  {
    id: 'pattern-audit',
    title: 'Pattern Audit',
    description: 'Score your AI product against 36 validated design patterns. Get a prioritized report with quick wins and recommendations.',
    icon: <MagnifyingGlassCircleIcon className={ICON_CLASS} />,
    category: 'Interactive Tools',
    type: 'Web App',
    tags: ['audit', 'scoring', 'patterns'],
    href: '/audit',
    ctaText: 'Start Audit',
    linkType: 'internal',
  },
  {
    id: 'ai-ux-weekly',
    title: 'AI UX Weekly',
    description: 'Weekly analysis of AI product design decisions. What patterns they use, what works, and what to do differently.',
    icon: <NewspaperIcon className={ICON_CLASS} />,
    category: 'Interactive Tools',
    type: 'Newsletter',
    tags: ['newsletter', 'weekly', 'analysis'],
    href: '/news',
    ctaText: 'Browse Issues',
    linkType: 'internal',
  },
  {
    id: 'ai-interaction-toolkit',
    title: 'AI Interaction Toolkit',
    description: 'PDF toolkit covering interaction patterns, component specs, and implementation checklists for AI-powered products.',
    icon: <WrenchScrewdriverIcon className={ICON_CLASS} />,
    category: 'Downloads',
    type: 'PDF',
    tags: ['toolkit', 'components', 'checklist'],
    href: '/toolkit',
    ctaText: 'Get Toolkit',
    linkType: 'internal',
  },
  {
    id: 'agent-readability-audit',
    title: 'Agent Readability Audit',
    description: 'Evaluate how well your UI communicates agent status, actions, and boundaries. Covers all 8 agentic patterns.',
    icon: <CpuChipIcon className={ICON_CLASS} />,
    category: 'Downloads',
    type: 'PDF',
    tags: ['agent', 'audit', 'readability'],
    href: '/agent-readability-audit-kit',
    ctaText: 'Get Audit Kit',
    linkType: 'internal',
  },
  {
    id: 'permission-boundary-worksheet',
    title: 'Permission Boundary Worksheet',
    description: 'Map out where your AI agent needs user approval, auto-executes, or escalates. Essential for agentic UX.',
    icon: <ShieldCheckIcon className={ICON_CLASS} />,
    category: 'Downloads',
    type: 'PDF',
    tags: ['permissions', 'agent', 'boundaries'],
    href: '/downloads/permission-boundary-worksheet.pdf', /* TODO: upload PDF */
    ctaText: 'Download PDF',
    linkType: 'download',
  },
  {
    id: 'figma-make-prompts',
    title: 'Figma Make Prompts',
    description: '36 copy-paste prompts for generating AI pattern components directly in Figma with Make. Ready to use.',
    icon: <PaintBrushIcon className={ICON_CLASS} />,
    category: 'Prompts & Code',
    type: 'Prompts',
    tags: ['figma', 'prompts', 'components'],
    href: '/prompts',
    ctaText: 'View Prompts',
    linkType: 'internal',
  },
  {
    id: 'designer-guide',
    title: "Designer's Guide to AI Tools",
    description: 'Step-by-step learning paths for Claude Code, Cursor, and GitHub Copilot. Written for designers, not developers.',
    icon: <BookOpenIcon className={ICON_CLASS} />,
    category: 'Learning',
    type: 'Guide',
    tags: ['guides', 'learning', 'tools'],
    href: '/guides',
    ctaText: 'Start Learning',
    linkType: 'internal',
  },
  {
    id: 'pattern-checklist',
    title: 'AIUX Design Checklist',
    description: '28 patterns across 7 categories in a printable audit checklist. Use during design reviews to score your AI product.',
    icon: <ClipboardDocumentCheckIcon className={ICON_CLASS} />,
    category: 'Learning',
    type: 'PDF',
    tags: ['checklist', 'reference', 'print'],
    href: '/handbook',
    ctaText: 'Get Checklist',
    linkType: 'internal',
  },
  {
    id: 'deep-dives-medium',
    title: 'Deep Dives on Medium',
    description: 'Long-form analysis of AI product design decisions. Detailed breakdowns of how top products implement these patterns.',
    icon: <PencilSquareIcon className={ICON_CLASS} />,
    category: 'Learning',
    type: 'Articles',
    tags: ['medium', 'articles', 'deep-dives'],
    href: 'https://medium.com/@imsaif',
    ctaText: 'Read on Medium',
    linkType: 'external',
  },
];

const CATEGORIES = [
  { id: 'interactive-tools', title: 'Interactive Tools' },
  { id: 'downloads', title: 'Downloads' },
  { id: 'prompts-code', title: 'Prompts & Code' },
  { id: 'learning', title: 'Learning' },
];

function getArrow(linkType: Resource['linkType']) {
  if (linkType === 'external') return '↗';
  if (linkType === 'download') return '↓';
  return '→';
}

function ResourceCard({ resource }: { resource: Resource }) {
  const isExternal = resource.linkType === 'external';
  const isDownload = resource.linkType === 'download';

  const cardContent = (
    <div className="group bg-surface-primary border border-gray-200 dark:border-gray-700 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 flex flex-col h-full">
      <div className="p-6 flex flex-col flex-1">
        {/* Top: Icon + Type Badge */}
        <div className="flex items-start justify-between mb-4">
          <span className="flex items-center justify-center w-11 h-11 bg-accent-subtle rounded-xl">
            {resource.icon}
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary border border-border-primary rounded-full px-2.5 py-0.5">
            {resource.type}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-text-primary mb-2">{resource.title}</h3>

        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">{resource.description}</p>

      </div>

      {/* CTA Row */}
      <div className="border-t border-border-primary px-6 py-3.5 flex items-center justify-between">
        <span className="text-sm font-medium text-accent-primary group-hover:text-accent-hover transition-colors">
          {resource.ctaText}
        </span>
        <span className="text-accent-primary group-hover:text-accent-hover transition-colors text-lg">
          {getArrow(resource.linkType)}
        </span>
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a href={resource.href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {cardContent}
      </a>
    );
  }

  if (isDownload) {
    return (
      <a href={resource.href} download className="block h-full">
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={resource.href} className="block h-full">
      {cardContent}
    </Link>
  );
}

export default function ResourcesGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const filteredResources = useMemo(() => {
    let results = selectedCategory === 'All Categories'
      ? RESOURCES
      : RESOURCES.filter((r) => r.category === selectedCategory);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    return results;
  }, [searchQuery, selectedCategory]);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
    setIsFilterSheetOpen(false);
  }, []);

  return (
    <>
      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-16 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="bg-surface-primary rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-card sticky top-24">
              <h3 className="font-semibold text-lg mb-4 text-text-primary">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSelectedCategory('All Categories')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                      selectedCategory === 'All Categories'
                        ? 'bg-white dark:bg-gray-800 text-black dark:text-white font-semibold shadow-sm'
                        : 'text-text-secondary hover:bg-white dark:hover:bg-gray-800 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    All Resources ({RESOURCES.length})
                  </button>
                </li>
                {CATEGORIES.map((cat) => {
                  const count = RESOURCES.filter((r) => r.category === cat.title).length;
                  return (
                    <li key={cat.id}>
                      <button
                        onClick={() => setSelectedCategory(cat.title)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                          selectedCategory === cat.title
                            ? 'bg-white dark:bg-gray-800 text-black dark:text-white font-semibold shadow-sm'
                            : 'text-text-secondary hover:bg-white dark:hover:bg-gray-800 hover:text-black dark:hover:text-white'
                        }`}
                      >
                        {cat.title} ({count})
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Resources Grid */}
          <div className="flex-1">
            {/* Search */}
            <div className="mb-6 bg-surface-primary rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-card">
              <UnifiedSearchBar
                placeholder="Search resources..."
                value={searchQuery}
                onChange={setSearchQuery}
                size="sm"
              />
            </div>

            {/* Mobile Filter Pills */}
            <div className="lg:hidden mb-6">
              <FilterPills
                selectedCategory={selectedCategory}
                onFilterClick={() => setIsFilterSheetOpen(true)}
              />
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-text-secondary">
                {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'}
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {filteredResources.map((resource, index) => (
                <div
                  key={resource.id}
                  className="animate-slide-in"
                  style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
                >
                  <ResourceCard resource={resource} />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-secondary text-lg mb-2">No resources found</p>
                {searchQuery && (
                  <p className="text-text-tertiary text-sm">
                    Try adjusting your search or filters
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <CategoryFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        categories={[
          { id: 'all', title: 'All Categories' },
          ...CATEGORIES,
        ]}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      <ScrollToTop />
    </>
  );
}

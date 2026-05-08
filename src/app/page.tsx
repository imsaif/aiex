import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { generateHomeMetadata } from '@/utils/metadata';
import Navbar from '@/components/layout/Navbar';
import HeroAuditExperience from '@/components/audit/HeroAuditExperience';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { InlineNewsletterSignup } from '@/components/newsletter/InlineNewsletterSignup';
import PatternGrid from './pattern-grid';
import patterns from '@/data/patterns';
import categories from '@/data/categories';
import { guides } from '@/data/guides';
import { getAllProducts, getProductsForPattern } from '@/data/utils/product-utils';
import { getAllIndustries, getIndustriesForPattern } from '@/data/utils/industry-utils';
import { PatternSummary } from '@/types';

// Featured courses for the homepage band — the 4 with the strongest GSC
// search demand ("claude for designers course," etc.). Order is editorial.
// Icon paths point at the self-hosted simple-icons set in /public/images/logos.
const FEATURED_COURSES: Array<{ slug: string; icon: string }> = [
  { slug: 'claude-code-learning-path', icon: '/images/logos/claude.svg' },
  { slug: 'claude-design-learning-path', icon: '/images/logos/simple-icons/claude-design.svg' },
  { slug: 'cursor-learning-path', icon: '/images/logos/simple-icons/cursor.svg' },
  { slug: 'github-copilot-learning-path', icon: '/images/logos/simple-icons/githubcopilot.svg' },
];

const featuredCourses = FEATURED_COURSES.map(({ slug, icon }) => {
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return null;
  return {
    slug: guide.slug,
    title: guide.title,
    tool: guide.tool,
    lessonCount: guide.lessons?.length ?? 0,
    excerpt: guide.excerpt || guide.description,
    icon,
  };
}).filter((c): c is NonNullable<typeof c> => c !== null);

export const metadata: Metadata = generateHomeMetadata();

// Compute lightweight pattern summaries server-side to avoid sending
// full pattern data (code examples, guidelines, figma prompts) to the client
const patternSummaries: PatternSummary[] = patterns.map(p => ({
  id: p.id,
  title: p.title,
  slug: p.slug,
  description: p.description,
  category: p.category,
  tags: p.tags,
  thumbnail: p.thumbnail,
  products: getProductsForPattern(p),
  industries: getIndustriesForPattern(p),
}));

const allProducts = getAllProducts(patterns);
const allIndustries = getAllIndustries(patterns);

export default function Home() {
  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      {/* Hero — marketing copy + newsletter capture by default; transforms in
          place into the upload/analyze/results flow when the user clicks
          "Start your audit". Same component used by /audit handles the tool
          mode so behavior stays in one place. */}
      <HeroAuditExperience />

      {/* Courses band — supporting element, not a second hero. Compact
          treatment so it sits *below* the audit moat in visual weight. */}
      <section className="max-w-7xl mx-auto px-6 pt-12 md:pt-16">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-xl md:text-2xl font-semibold text-text-primary">
            Free courses for designers using AI
          </h2>
          <Link
            href="/guides"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            See all
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredCourses.map((course) => (
            <Link
              key={course.slug}
              href={`/guides/${course.slug}`}
              className="group block bg-surface-primary rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-accent-primary transition-colors h-full flex flex-col"
            >
              <div className="flex items-center gap-2.5 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={course.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6 dark:invert opacity-80"
                />
                <span className="text-sm text-text-secondary">{course.tool}</span>
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-3 group-hover:text-accent-primary transition-colors leading-snug">
                {course.title}
              </h3>
              <span className="text-sm text-text-tertiary mt-auto">
                {course.lessonCount} lessons · free
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Pattern Grid - Client component */}
      <PatternGrid
        patterns={patternSummaries}
        categories={categories}
        allProducts={allProducts}
        allIndustries={allIndustries}
      />

      {/* Newsletter signup — moved out of hero in Stage A repositioning.
          Catches readers who finished browsing patterns and want recurring
          updates. Trust copy unchanged to preserve the 192 subs' contract. */}
      <section className="max-w-2xl mx-auto px-6 py-16 md:py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-3">
          Daily AI UX news
        </h2>
        <InlineNewsletterSignup variant="hero" source="direct" />
      </section>

      {/* SEO — keyword-rich server-rendered text for Googlebot */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <p className="text-base md:text-lg text-text-secondary text-center leading-relaxed">
          The AI UX design pattern library for product designers and teams building AI-powered experiences. Each pattern is documented from 3+ real implementations across products like ChatGPT, Claude, GitHub Copilot, Midjourney, Google, and Notion, with examples, code demos, and research-backed guidance you can apply today.
        </p>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Footer */}
      <Footer />
    </main>
  );
}

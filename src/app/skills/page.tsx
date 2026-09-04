import type { Metadata } from 'next';
import { patterns } from '@/data/patterns';
import categories from '@/data/categories';
import { siteConfig } from '@/config/seo';
import { skillName } from '@/lib/skills/composeSkill';
import { exampleProducts } from '@/lib/skills/usedBy';
import { SkillsDirectory, type SkillRow } from '@/components/skills/SkillsDirectory';
import { InstallCommand } from '@/components/skills/InstallCommand';
import Navbar from '@/components/layout/Navbar';
import LearnSidebar from '@/components/learn/LearnSidebar';
import LearnShell from '@/components/learn/LearnShell';
import Footer from '@/components/layout/Footer';
import SavedItemsBar from '@/components/handoff/SavedItemsBar';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Free Claude Code Skills for AI UX Design',
  description:
    'Install free Claude Code skills, one per AI UX pattern. Save the ones you need and your coding agent gains that pattern\'s design judgment: when it applies and the moves that make it real.',
  alternates: { canonical: `${siteConfig.url}/skills` },
};

const GENERIC_COMMAND = 'npx skills add imsaif/aiux-skills';

export default function SkillsPage() {
  const categoryNames = categories.map((c) => c.title);
  const rows: SkillRow[] = [...patterns]
    .sort(
      (a, b) =>
        categoryNames.indexOf(a.category) - categoryNames.indexOf(b.category) ||
        a.title.localeCompare(b.title)
    )
    .map((pattern) => ({
      slug: pattern.slug,
      skillName: skillName(pattern),
      title: pattern.title,
      category: pattern.category,
      trigger: pattern.content.skillDescription ?? pattern.description,
      products: exampleProducts(pattern),
    }));

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Claude Code skills for AI UX patterns',
    numberOfItems: rows.length,
    itemListElement: rows.map((row, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: row.skillName,
      url: `${siteConfig.url}/patterns/${row.slug}`,
    })),
  };

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <Navbar inConsole />

      {/* Learn console shell — same rail as /guides and the course pages, so
          Explore's own links do not drop you out of the area they belong to.
          Opened directly under the navbar so the rail runs the full length of
          the page rather than starting below a full-width hero. */}
      <LearnShell sidebar={<LearnSidebar active="skills" />}>

      {/* Split page header, following the reference: identity on the left,
          the thing you actually came to copy on the right. No centred hero —
          inside a console column that reads as a page within a page. */}
      <header className="border-b border-border-primary pt-10 pb-10">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
          <div>
            <p className="type-eyebrow mb-3 font-semibold text-accent-primary">
              Free Claude Code Skills
            </p>
            <h1 className="type-h1 mb-3" style={{ color: 'var(--text-hero)' }}>
              {rows.length} AI UX Skills for Claude Code
            </h1>
            <p className="type-lead max-w-xl text-text-secondary">
              Design judgment your coding agent applies on its own. Install
              once, no prompting.
            </p>
            <p className="type-caption mt-4 text-text-secondary">
              New to skills?{' '}
              <Link
                href="/guides/ai-ux-skills-guide"
                className="font-medium text-accent-primary transition-colors hover:text-accent-hover"
              >
                Read how skills work
              </Link>{' '}
              (6 lessons, about 20 minutes).
            </p>
          </div>

          <div className="mt-8 lg:mt-0">
            <div className="rounded-card border border-border-primary bg-surface-primary p-5">
              <p className="type-caption mb-3 font-semibold text-text-primary">
                Install the skills
              </p>
              <InstallCommand command={GENERIC_COMMAND} />
            </div>
          </div>
        </div>
      </header>

      <div className="py-12 md:py-16">
        <SkillsDirectory rows={rows} categories={categoryNames} />
      </div>

      {/* Bottom CTA */}
      <section className="border-t border-border-primary">
        <div className="py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Want several at once?</h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Save patterns as you browse and download them as one pack from your{' '}
            <Link href="/dashboard" className="text-accent-primary hover:text-accent-hover font-medium transition-colors">
              dashboard
            </Link>
            . Not sure which patterns your product needs?{' '}
            <Link href="/audit" className="text-accent-primary hover:text-accent-hover font-medium transition-colors">
              Run the free audit
            </Link>
            . First time using skills?{' '}
            <Link href="/guides/ai-ux-skills-guide" className="text-accent-primary hover:text-accent-hover font-medium transition-colors">
              Learn how skills work
            </Link>
            .
          </p>
        </div>
      </section>

      </LearnShell>

      <SavedItemsBar />
      <Footer />
    </main>
  );
}

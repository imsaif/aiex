import type { Metadata } from 'next';
import { patterns } from '@/data/patterns';
import categories from '@/data/categories';
import { siteConfig } from '@/config/seo';
import { skillName } from '@/lib/skills/composeSkill';
import { skillInstallCommand } from '@/lib/skills/installCommand';
import { exampleProducts } from '@/lib/skills/usedBy';
import { SkillsDirectory, type SkillRow } from '@/components/skills/SkillsDirectory';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Free Claude Code Skills for AI UX Design',
  description:
    'Install free Claude Code skills, one per AI UX pattern. Copy one command and your coding agent gains that pattern\'s design judgment: when it applies and the moves that make it real.',
  alternates: { canonical: `${siteConfig.url}/skills` },
};

const GENERIC_COMMAND =
  'mkdir -p .claude/skills/aiux-<slug> && curl -fsSL https://aiuxdesign.guide/skills/aiux-<slug>.md -o .claude/skills/aiux-<slug>/SKILL.md';

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
      command: skillInstallCommand(pattern),
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
      <Navbar />

      {/* Hero Section - centered, matching resources/patterns/news style */}
      <section className="pt-12 md:pt-16 pb-12 md:pb-16 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent-subtle text-accent-primary border border-info">
                Free Claude Code Skills
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: 'var(--text-hero)' }}>
              {rows.length} AI UX Skills for Claude Code
            </h1>
            <p className="text-lg md:text-xl text-text-secondary">
              A skill is persistent design guidance for your coding agent. Install one and it triggers on
              its own whenever the work matches: no prompting, no reminders. Copy a command, paste it in
              your terminal at your repo root, done.
            </p>
            <pre className="max-w-2xl mx-auto mt-8 overflow-x-auto rounded-input bg-surface-secondary p-snug text-sm text-text-primary text-left">
              {GENERIC_COMMAND}
            </pre>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <SkillsDirectory rows={rows} categories={categoryNames} />
      </div>

      {/* Bottom CTA */}
      <section className="border-t border-border-primary bg-surface-primary">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 text-center">
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
            .
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

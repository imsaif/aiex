import type { Metadata } from 'next';
import { patterns } from '@/data/patterns';
import categories from '@/data/categories';
import { SITE } from '@/lib/handoff/composeHandoff';
import { siteConfig } from '@/config/seo';
import { skillName } from '@/lib/skills/composeSkill';
import { skillInstallCommand } from '@/lib/skills/installCommand';
import { exampleProducts } from '@/lib/skills/usedBy';
import { SkillsDirectory, type SkillRow } from '@/components/skills/SkillsDirectory';
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
    <main className="mx-auto max-w-5xl px-default py-roomy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <h1 className="type-h1 text-text-primary">
        {rows.length} free Claude Code skills, one per AI UX pattern
      </h1>
      <p className="mt-snug max-w-2xl text-text-secondary">
        A skill is persistent design guidance for your coding agent. Install one and it triggers on
        its own whenever the work matches: no prompting, no reminders. Copy a command, paste it in
        your terminal at your repo root, done.
      </p>
      <pre className="mt-default overflow-x-auto rounded-input bg-surface-secondary p-snug text-sm text-text-primary">
        {GENERIC_COMMAND}
      </pre>

      <div className="mt-roomy">
        <SkillsDirectory rows={rows} categories={categoryNames} />
      </div>

      <footer className="mt-roomy border-t border-border-primary pt-loose text-sm text-text-secondary">
        <p>
          Want several at once? Save patterns as you browse and download them as one pack from your{' '}
          <Link href="/dashboard" className="text-text-primary hover:underline">
            dashboard
          </Link>
          . Not sure which patterns your product needs?{' '}
          <Link href="/audit" className="text-text-primary hover:underline">
            Run the free audit
          </Link>
          .
        </p>
      </footer>
    </main>
  );
}

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
import ConsoleSignup from '@/components/learn/ConsoleSignup';
import Footer from '@/components/layout/Footer';
import SavedItemsBar from '@/components/handoff/SavedItemsBar';
import Link from 'next/link';
import { NewspaperIcon } from '@heroicons/react/24/outline';
import { ClaudeMark } from '@/components/icons/ClaudeMark';
import {
  CyclingAgentMark,
  AgentLogoRow,
} from '@/components/skills/AgentMarks';

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

  // A real skill's frontmatter for the "what a skill looks like" block, built
  // from the same data the installer writes rather than hand-copied, so the
  // example cannot drift from the file people actually get. Progressive
  // Disclosure is the sample because its trigger line is the most legible to
  // someone who has never seen a skill; any row would do if it disappears.
  const sample = rows.find((r) => r.slug === 'progressive-disclosure') ?? rows[0];
  const sampleSkill = [
    '---',
    `name: ${sample.skillName}`,
    `description: ${sample.trigger}`,
    '---',
  ].join('\n');

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

      {/* Split page header: what this is on the left, the thing you came to
          copy on the right. The right column is a stack of hairline-separated
          blocks rather than one boxed card — a card reads as a widget parked
          in the corner, while blocks with their own icon, heading and footnote
          read as content that happens to sit beside the title.

          Same typographic ladder as /patterns: display for the title on one
          line, h3 at normal weight for the lead, leading opened on both since
          those tokens are tuned for single lines. */}
      <header className="border-b border-border-primary pt-16 pb-12">
        {/* Proportional split rather than a fixed 380px sidebar. A fixed width
            squeezed the install column at every viewport the console is
            actually read at: the command wrapped, the copy ran three words to
            a line, and the whole thing read as a squashed sidebar. Roughly
            60/40 gives the commands room to sit on one line. */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-0">
          <div className="lg:pr-12">
            <p className="type-eyebrow mb-4 font-semibold uppercase text-accent-primary">
              Free Claude Code Skills
            </p>
            <h1
              className="type-display mb-6 leading-tight"
              style={{ color: 'var(--text-hero)' }}
            >
              {rows.length} AI UX Skills for Claude Code
            </h1>
            <p className="type-h3 mb-9 max-w-2xl font-normal leading-relaxed text-text-secondary">
              Design judgment your coding agent applies on its own. Install
              once, no prompting.
            </p>
            <p className="type-caption text-text-secondary">
              New to skills?{' '}
              <Link
                href="/guides/ai-ux-skills-guide"
                className="font-medium text-accent-primary transition-colors hover:text-accent-hover"
              >
                Read how skills work
              </Link>{' '}
              (6 lessons, about 20 minutes).
            </p>

            {/* The left column ran out of content well before the install
                column did, leaving a large hole under the lead. Rather than
                pad it, show the thing itself: a real skill's frontmatter,
                taken from the pattern data rather than typed out here, so it
                cannot drift from what actually installs. It answers the
                question the page provokes — "what is a skill, exactly?" —
                without sending anyone to the course first. */}
            <div className="mt-10 rounded-card border border-border-primary">
              <p className="type-caption border-b border-border-primary px-5 py-3 font-semibold text-text-primary">
                What a skill looks like
              </p>
              <pre className="whitespace-pre-wrap break-words px-5 py-4 type-caption font-mono leading-relaxed text-text-secondary">
                <code>{sampleSkill}</code>
              </pre>
              <p className="type-caption border-t border-border-primary px-5 py-3 text-text-secondary">
                Your agent reads the trigger line and applies the pattern when
                it fits. You never mention it.
              </p>
            </div>
          </div>

          <div className="mt-10 lg:mt-0 lg:border-l lg:border-border-primary lg:pl-12">
            {/* Each block: a solid mark, a heading with real weight, one line
                of body copy, the command, then a footnote row splitting the
                secondary detail left and the way out right. The mark is filled
                rather than outlined so it reads as a marker at the head of a
                section instead of another empty box among the bordered ones
                below it. */}
            <section>
              <h2 className="type-lead mb-3 flex items-center gap-3 font-semibold text-text-primary">
                <CyclingAgentMark />
                Install every skill
              </h2>
              <p className="type-body mb-5 leading-relaxed text-text-secondary">
                One file per pattern, written into your project and editable
                afterwards.
              </p>
              <InstallCommand command={GENERIC_COMMAND} />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="type-caption font-mono text-text-secondary">
                  {rows.length} skills · free · MIT
                </p>
                <Link
                  href="/guides/ai-ux-skills-guide"
                  className="type-caption text-text-secondary transition-colors hover:text-text-primary"
                >
                  How skills work ↗
                </Link>
              </div>
            </section>

            <section className="mt-8 border-t border-border-primary pt-8">
              <h2 className="type-lead mb-3 flex items-center gap-3 font-semibold text-text-primary">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-card border border-border-primary bg-background-primary">
                  <ClaudeMark className="h-[18px] w-[18px] text-brand-claude" />
                </span>
                Claude Code
              </h2>
              <p className="type-body mb-4 leading-relaxed text-text-secondary">
                Skills land in <code className="font-mono">.claude/skills/</code>{' '}
                and Claude Code picks them up on its own. No config, and
                nothing to remember at the prompt.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="type-caption font-mono text-text-secondary">
                  Only need a few?
                </p>
                <Link
                  href="/dashboard"
                  className="type-caption text-text-secondary transition-colors hover:text-text-primary"
                >
                  Build a pack ↗
                </Link>
              </div>
            </section>

            <section className="mt-8 border-t border-border-primary pt-8">
              <h2 className="type-lead mb-3 font-semibold text-text-primary">
                Works with any agent
              </h2>
              <AgentLogoRow />
            </section>
          </div>
        </div>
      </header>

      {/* The email offer, on its own line under the header rather than inside
          it, for the same reason as /patterns: in the header it competes with
          the title for the opening beat. */}
      <section className="flex flex-col gap-snug border-b border-border-primary py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-loose">
        <p className="flex items-center gap-2.5 type-caption text-text-secondary">
          <NewspaperIcon
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-text-secondary"
          />
          Daily AI UX news and pattern breakdowns, straight to your inbox.
        </p>
        <ConsoleSignup
          source="skills-hero"
          className="w-full lg:max-w-md"
          subheading=""
        />
      </section>

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

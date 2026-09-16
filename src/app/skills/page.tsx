import type { Metadata } from 'next';
import { patterns } from '@/data/patterns';
import categories from '@/data/categories';
import { siteConfig } from '@/config/seo';
import { skillName } from '@/lib/skills/composeSkill';
import { exampleProducts } from '@/lib/skills/usedBy';
import { SkillsDirectory, type SkillRow } from '@/components/skills/SkillsDirectory';
import { InstallPicker, type InstallOption } from '@/components/skills/InstallPicker';
import Navbar from '@/components/layout/Navbar';
import LearnSidebar from '@/components/learn/LearnSidebar';
import LearnShell from '@/components/learn/LearnShell';
import ConsoleSignup from '@/components/learn/ConsoleSignup';
import Footer from '@/components/layout/Footer';
import SavedItemsBar from '@/components/handoff/SavedItemsBar';
import Link from 'next/link';
import { NewspaperIcon } from '@heroicons/react/24/outline';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Free Claude Code Skills for AI UX Design',
  description:
    'Install free Claude Code skills, one per AI UX pattern. Save the ones you need and your coding agent gains that pattern\'s design judgment: when it applies and the moves that make it real.',
  alternates: { canonical: `${siteConfig.url}/skills` },
};

const GENERIC_COMMAND = 'npx skills add imsaif/aiux-skills';

/**
 * The plugin install, which is three commands and only works as three.
 *
 * Verified against the CLI on 2026-09-16 rather than taken from the docs:
 *
 *   1. Required. Installing without adding the marketplace fails outright —
 *      "Plugin aiux not found in marketplace aiux-skills".
 *   2. Required, obviously.
 *   3. Required HERE, which is the part worth writing down. A session started
 *      after the install sees all 38 skills with no reload, so the line looks
 *      redundant when you test it from a terminal. But these are slash commands,
 *      so the reader is inside a session whose context was built before the
 *      plugin existed, and that session is exactly the one that needs it.
 *
 * Dropping it would produce the failure this project has already paid for once:
 * installed, inert, and no error anywhere to say so. The CLI's install output no
 * longer mentions the reload, which makes the silence more likely, not less.
 *
 * The marketplace name is our own (`imsaif/aiux-skills`) rather than Anthropic's
 * catalogue, because the plugin is not listed there: it passed review in the
 * console on 2026-09-10 and, as of 2026-09-16, searching the official
 * marketplace for "aiux" returns nothing. Until that changes, adding the
 * marketplace by name is the only way anyone installs it.
 */
const PLUGIN_COMMANDS = [
  '/plugin marketplace add imsaif/aiux-skills',
  '/plugin install aiux@aiux-skills',
  '/reload-plugins',
];

/**
 * Order is the recommendation: the first option is the default anyone who does
 * not have a preference will take.
 *
 * The plugin leads because it installs once and applies everywhere, which is
 * the right default for an audience that does not think in repos. Copying the
 * files stays because it is the only route where the files are real, editable
 * and committable, and because the plugin format is Claude Code's own — so it
 * is also what every other agent uses.
 *
 * The second label is "Any agent", not "Any other agent", and that one word is
 * load-bearing. "Other" excludes Claude Code, which is false — this is also the
 * route a Claude Code user takes when they want the files committed so their
 * team gets them. The old label needed a sentence of apology after it ("works
 * in Claude Code too"); the accurate label needs none.
 *
 * It also does not name Cursor, Copilot and Codex. The label covers them and
 * the mark beside it cycles their logos, so spelling them out was the same fact
 * a third time.
 */
const INSTALL_OPTIONS: InstallOption[] = [
  {
    id: 'plugin',
    label: 'Claude Code',
    mark: 'claude',
    description:
      'Install once as a plugin. Every project has them, and nothing is copied into your repo.',
    command: PLUGIN_COMMANDS,
    prompt: null,
    note: 'All three lines. Without the reload the skills are installed but inert, and nothing says so.',
  },
  {
    id: 'files',
    label: 'Any agent',
    mark: 'agents',
    description:
      'Writes one file per pattern into your project, yours to edit and commit.',
    command: GENERIC_COMMAND,
  },
];

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

      {/* Page header: what this is, then the two ways to get it.

          The installs are blocks with their own mark, heading and footnote
          rather than one boxed card — a card reads as a widget parked on the
          page, while blocks read as content.

          Same typographic ladder as /patterns: display for the title on one
          line, h3 at normal weight for the lead, leading opened on both since
          those tokens are tuned for single lines. */}
      <header className="border-b border-border-primary pt-16 pb-12">
        <div>
          {/* No max-width on the lead any more. It was capped for a two-column
              header, where the title had to share the row with the install
              column; on the full width those caps only forced a wrap that was
              not needed — "38 AI UX Skills for Claude Code" broke after
              "Claude", splitting the product name across two lines. */}
          <div>
            <p className="type-eyebrow mb-4 font-semibold uppercase text-accent-primary">
              Free Claude Code Skills
            </p>
            <h1
              className="type-display mb-6 text-balance leading-tight"
              style={{ color: 'var(--text-hero)' }}
            >
              {rows.length} AI UX Skills for Claude Code
            </h1>
            <p className="type-h3 mb-7 max-w-4xl font-normal leading-relaxed text-text-secondary">
              Design judgment your coding agent applies on its own. Install
              once, no prompting.
            </p>

          </div>

          {/* One command, with a switch above it.

              Showing both at once was honest and still wrong: two commands of
              equal weight make a visitor compare before they can act, and the
              comparison is not one they have the information to make. A switch
              turns it into a choice with a default, which is what it always
              was, and gives the page back the space two sections were using.

              The agent logo row went with the earlier layout. It answered "does
              this work with what I use", and the second option now answers that
              by name, in the place where the question arises. */}
          <div className="mt-12 max-w-3xl">
            <InstallPicker options={INSTALL_OPTIONS} />
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border-primary pt-4">
              <p className="type-footnote font-mono text-text-secondary">
                {rows.length} skills · free · MIT
              </p>
              <div className="flex flex-wrap items-center gap-5">
                <Link
                  href="/dashboard"
                  className="type-footnote text-text-secondary transition-colors hover:text-text-primary"
                >
                  Only need a few? Build a pack ↗
                </Link>
                <Link
                  href="/guides/ai-ux-skills-guide"
                  className="type-footnote text-text-secondary transition-colors hover:text-text-primary"
                >
                  How skills work ↗
                </Link>
              </div>
            </div>
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

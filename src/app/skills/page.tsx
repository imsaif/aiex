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
} from '@/components/skills/AgentMarks';

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
 * `/plugin install` does not activate anything on its own — Claude Code's own
 * wording is "Run /reload-plugins to activate successfully installed plugins".
 * Hand someone the first two lines and they get a plugin that is present and
 * does nothing, with no error to explain it.
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

          {/* The two installs sit under the lead rather than beside it.

              As a right-hand column they were squeezed into roughly a third of
              the page, which is what pushed the copy to three or four words a
              line and made a short section look like a dense one. Side by side
              at full width they are the same words in half the lines.

              The agent logo row went with the old layout. It was answering
              "does this work with what I use", and the second block now answers
              that by name — Cursor, Copilot, Codex — in the place where the
              question actually arises. */}
          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-12">
            {/* Each block: a mark, a heading, one line of copy, the command,
                then a footnote row splitting the secondary detail left and the
                way out right.

                Deliberately quiet, and quiet in the way labels are quiet:
                small caps in secondary ink, marks left unframed, footnotes a
                step smaller again. Only the command itself keeps a surface,
                because it is the one thing here anybody came to act on.

                Two ways in, and the order is the recommendation.

                They used to sit as separate sections with headings that did not
                read as alternatives — "Install every skill" and "Claude Code" —
                so a visitor had to work out for themselves that these were two
                routes to the same 38 files, and then which one they wanted.
                The headings now name the act rather than the scope, and the
                "Or" does the work of saying these are alternatives. */}
            <section>
              <h2 className="type-eyebrow mb-3 flex items-center gap-2 uppercase text-text-secondary">
                <ClaudeMark className="h-4 w-4 shrink-0 text-brand-claude" />
                Claude Code
              </h2>
              <p className="type-caption mb-5 leading-loose text-text-secondary">
                Install once. Every project has them, and nothing is copied into
                your repo.
              </p>
              <InstallCommand command={PLUGIN_COMMANDS} prompt={null} />
              <p className="type-footnote mt-3 leading-loose text-text-secondary">
                All three lines. Without the reload the skills are installed but
                inert, and nothing says so.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <p className="type-footnote font-mono text-text-secondary">
                  {rows.length} skills · free · MIT
                </p>
                <Link
                  href="/guides/ai-ux-skills-guide"
                  className="type-footnote text-text-secondary transition-colors hover:text-text-primary"
                >
                  How skills work ↗
                </Link>
              </div>
            </section>

            {/* Side by side now, so the rule between them is vertical and only
                at the width where they actually sit in two columns. */}
            <section className="border-t border-border-primary pt-9 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              <h2 className="type-eyebrow mb-3 flex items-center gap-2 uppercase text-text-secondary">
                <CyclingAgentMark />
                Any other agent
              </h2>
              {/* Kept, and kept second, for two reasons that are easy to lose:
                  it is the only route where the files are real and editable, so
                  a team can commit them and change them; and the plugin is
                  Claude Code's own format, so this is what the other agents in
                  the row below actually use. Demoting it is a recommendation,
                  not a deprecation. */}
              {/* The heading says "any other agent" because the plugin format
                  is Claude Code's own. The last line is not a footnote: without
                  it the heading reads as "not for Claude Code", and this is in
                  fact the better route there too for anyone who wants the files
                  in the repo rather than loaded from outside it. */}
              <p className="type-caption mb-5 leading-loose text-text-secondary">
                Cursor, Copilot, Codex and the rest. One file per pattern,
                written into the project you are in, then yours to edit and
                commit. Works in Claude Code too, if you would rather have the
                files.
              </p>
              <InstallCommand command={GENERIC_COMMAND} />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <p className="type-footnote font-mono text-text-secondary">
                  Only need a few?
                </p>
                <Link
                  href="/dashboard"
                  className="type-footnote text-text-secondary transition-colors hover:text-text-primary"
                >
                  Build a pack ↗
                </Link>
              </div>
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

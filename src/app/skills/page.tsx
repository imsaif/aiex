import type { Metadata } from 'next';
import { patterns } from '@/data/patterns';
import categories from '@/data/categories';
import { guides } from '@/data/guides';
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

  // Two courses, not a menu: what a skill is, then the agent this page is
  // named after. A third row turned a nudge into a directory and competed
  // with the skills list further down, which is where browsing belongs.
  // Titles and lesson counts are read from the guides data rather than typed
  // here, so a renamed or re-cut course cannot leave a stale claim on this
  // page.
  const STARTING_COURSE_SLUGS = [
    'ai-ux-skills-guide',
    'claude-code-learning-path',
  ];
  const startingCourses = STARTING_COURSE_SLUGS.map((slug) =>
    guides.find((g) => g.slug === slug)
  )
    .filter((g): g is NonNullable<typeof g> => g != null)
    .map((g) => ({
      slug: g.slug,
      title: g.title,
      tool: g.tool,
      lessonCount: g.lessons?.length ?? g.lessonCount ?? 0,
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
            <p className="type-h3 mb-7 max-w-2xl font-normal leading-relaxed text-text-secondary">
              Design judgment your coding agent applies on its own. Install
              once, no prompting.
            </p>

            {/* Moved up from the bottom of the install column, where it was the
                last thing on the page and answered a question the reader has at
                the top: the title says Claude Code, so "does this work with what
                I use" is the first doubt, not the last. It sits under the lead
                as a quiet qualifier rather than a section of its own. */}
            <div>
              <h2 className="type-eyebrow mb-3 uppercase text-text-secondary">
                Works with any agent
              </h2>
              <AgentLogoRow />
            </div>

            {/* The left column ran out of content well before the install
                column did, leaving a large hole under the lead. It held a
                sample skill file for a while, which answered "what is a skill"
                but answered it to someone who had not yet asked — a wall of
                frontmatter is the second question, not the first.

                A course list is the better neighbour to an install command:
                whoever is not ready to run the command is ready to read, and
                these are the courses that end with them running it anyway.
                Titles and lesson counts come from the guides data, so a course
                renamed or re-cut here cannot go stale. */}
            <div className="mt-10 rounded-card border border-border-primary">
              <p className="type-caption border-b border-border-primary px-5 py-3 font-semibold text-text-primary">
                New here? Start with a course
              </p>
              <ul>
                {startingCourses.map((course, index) => (
                  <li
                    key={course.slug}
                    className={index > 0 ? 'border-t border-border-primary' : ''}
                  >
                    <Link
                      href={`/guides/${course.slug}`}
                      className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-secondary"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="type-body block font-semibold text-text-primary transition-colors group-hover:text-accent-primary">
                          {course.title}
                        </span>
                        <span className="type-caption block text-text-secondary">
                          {course.lessonCount} lessons · {course.tool}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="type-body shrink-0 text-text-secondary transition-colors group-hover:text-accent-primary"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/guides"
                className="type-caption block border-t border-border-primary px-5 py-3 text-text-secondary transition-colors hover:text-text-primary"
              >
                All courses ↗
              </Link>
            </div>
          </div>

          <div className="mt-10 lg:mt-0 lg:border-l lg:border-border-primary lg:pl-12">
            {/* Each block: a small framed mark, a heading, one line of copy,
                the command, then a footnote row splitting the secondary detail
                left and the way out right.

                Deliberately quiet, and quiet in the way labels are quiet:
                small caps in secondary ink, marks left unframed, footnotes a
                step smaller again. Only the command itself keeps a surface,
                because it is the one thing in this column anybody came to act
                on. Leading is loose throughout — at this size air is what
                makes a column readable rather than cramped, and it costs
                nothing here since the column is shorter than the one beside
                it. */}
            {/* Two ways in, and the order is the recommendation.

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

            <section className="mt-9 border-t border-border-primary pt-9">
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

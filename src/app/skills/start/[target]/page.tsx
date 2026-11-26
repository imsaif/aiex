import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LearnShell from '@/components/learn/LearnShell';
import LearnSidebar from '@/components/learn/LearnSidebar';
import { PackExample, PackWalkthrough, Part } from '@/components/skills/PackWalkthrough';
import { SayLine } from '@/components/skills/SayLine';
import { siteConfig } from '@/config/seo';
import { MORE, PACK_GUIDE_LIST, guidePath } from '@/lib/skills/packSteps';

/**
 * What to do after downloading the skill pack, one page per answer to "Where
 * will you use them?". Reached from the dialog, the email and START HERE.
 *
 * Path segments rather than a query string, so all three stay static.
 */
export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return PACK_GUIDE_LIST.map(({ slug }) => ({ target: slug }));
}

type Props = { params: Promise<{ target: string }> };

const find = (slug: string) => PACK_GUIDE_LIST.find((g) => g.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = find((await params).target);
  if (!guide) return {};
  return {
    title: guide.pageTitle,
    description: guide.pageIntro,
    alternates: { canonical: `${siteConfig.url}${guidePath(guide.target)}` },
    // Help for people who already have the pack. /skills is the page to find.
    robots: { index: false, follow: true },
  };
}

const linkClass =
  'font-medium text-accent-primary underline underline-offset-4 transition-colors hover:text-accent-hover';

export default async function SkillPackStartPage({ params }: Props) {
  const guide = find((await params).target);
  if (!guide) notFound();

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar inConsole />
      <LearnShell sidebar={<LearnSidebar active="skills" />}>
        <div className="space-y-16 pb-20 pt-16">
          {/* The navy band from the dialog and the daily email, so the page someone
              lands on from either reads as the same product. */}
          <header className="relative overflow-hidden rounded-card bg-band-surface px-loose pt-roomy md:px-12 md:pt-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -right-24 hidden md:block h-72 w-[27rem] bg-[url('/images/newsletter/cta-grid.png')] bg-contain bg-no-repeat opacity-80"
            />
            <h1 className="relative type-h1 max-w-2xl text-balance text-text-on-band">{guide.pageTitle}</h1>
            <p className="relative type-body mt-snug max-w-2xl text-text-on-band-muted">{guide.pageIntro}</p>
            <nav
              aria-label="Where you will use the skills"
              className="relative mt-roomy flex flex-wrap gap-x-loose border-t border-band-border"
            >
              {PACK_GUIDE_LIST.map((g) => {
                const current = g.slug === guide.slug;
                return (
                  <Link
                    key={g.slug}
                    href={guidePath(g.target)}
                    prefetch={false}
                    aria-current={current ? 'page' : undefined}
                    className={`border-b-2 text-base py-snug transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-text-on-band ${
                      current
                        ? 'border-text-on-band font-semibold text-text-on-band'
                        : 'border-transparent font-medium text-text-on-band-muted hover:text-text-on-band'
                    }`}
                  >
                    {g.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          {guide.target === 'unsure' ? (
            <PackExample />
          ) : (
            <>
              <PackWalkthrough target={guide.target} />
              <Part
                title="Keep using it"
                note={guide.target === 'claude' ? 'Start with /aiux-skills to be sure it uses them' : 'If it skips the skills, ask for them by name'}
              >
                <div className="grid gap-loose pt-loose @2xl:grid-cols-3">
                  {MORE.map(({ title, say }) => (
                    <div key={title} className="space-y-tight">
                      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
                      <SayLine text={say} />
                    </div>
                  ))}
                </div>
              </Part>
            </>
          )}

          <footer className="space-y-tight border-t border-border-primary pt-loose text-sm text-text-secondary">
            {guide.target === 'code' && (
              <p>
                Using Cursor or GitHub Copilot? Their guides say they read the same skills, and START HERE covers them,
                but we have not tried it yet.
              </p>
            )}
            <p>
              Don&rsquo;t have the skills yet?{' '}
              <Link href="/?skills=1" prefetch={false} className={linkClass}>
                Get them free
              </Link>
              . Just want to read?{' '}
              <Link href="/patterns" prefetch={false} className={linkClass}>
                Every pattern is on the site
              </Link>
              .
            </p>
          </footer>
        </div>
      </LearnShell>
      <Footer />
    </main>
  );
}

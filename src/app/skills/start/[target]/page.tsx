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
          <header>
            <h1 className="type-h1 text-balance text-text-primary">{guide.pageTitle}</h1>
            <p className="type-body mt-snug text-text-secondary">{guide.pageIntro}</p>
            <nav
              aria-label="Where you will use the skills"
              className="mt-roomy flex flex-wrap gap-x-loose border-b border-border-primary"
            >
              {PACK_GUIDE_LIST.map((g) => {
                const current = g.slug === guide.slug;
                return (
                  <Link
                    key={g.slug}
                    href={guidePath(g.target)}
                    prefetch={false}
                    aria-current={current ? 'page' : undefined}
                    className={`-mb-px border-b-2 text-base py-tight transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary ${
                      current
                        ? 'border-accent-primary font-semibold text-text-primary'
                        : 'border-transparent font-medium text-text-secondary hover:text-text-primary'
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
              <Part title="Keep using it" note="If it skips the skills, ask for them by name">
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

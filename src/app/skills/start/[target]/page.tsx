import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LearnShell from '@/components/learn/LearnShell';
import LearnSidebar from '@/components/learn/LearnSidebar';
import { PackExample } from '@/components/skills/PackExample';
import { PackSteps } from '@/components/skills/PackSteps';
import { SayLine } from '@/components/skills/SayLine';
import { siteConfig } from '@/config/seo';
import { MORE_PROMPTS, PACK_GUIDE_LIST, guidePath } from '@/lib/skills/packSteps';

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
  const unsure = guide.target === 'unsure';

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar inConsole />
      <LearnShell sidebar={<LearnSidebar active="skills" />}>
        <div className="max-w-3xl space-y-14 pb-20 pt-16">
          <header className="space-y-default">
            <h1 className="type-h1 text-balance text-text-primary">{guide.pageTitle}</h1>
            <p className="type-body text-text-secondary">{guide.pageIntro}</p>
            <nav aria-label="Where you will use the skills" className="flex flex-wrap gap-tight pt-2">
              {PACK_GUIDE_LIST.map((g) => (
                <Link
                  key={g.slug}
                  href={guidePath(g.target)}
                  prefetch={false}
                  aria-current={g.slug === guide.slug ? 'page' : undefined}
                  className={`rounded-pill border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary ${
                    g.slug === guide.slug
                      ? 'border-accent-primary bg-accent-primary text-text-on-accent'
                      : 'border-border-primary text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {g.label}
                </Link>
              ))}
            </nav>
          </header>

          {unsure ? (
            <>
              <PackExample />
              <section aria-labelledby="pack-choose" className="space-y-default">
                <h2 id="pack-choose" className="type-h2 text-text-primary">
                  Choose how to use them
                </h2>
                <ul className="space-y-default">
                  {PACK_GUIDE_LIST.filter((g) => g.target !== 'unsure').map((g) => (
                    <li key={g.slug} className="rounded-card border border-border-primary p-loose">
                      <p className="type-body font-medium text-text-primary">{g.label}</p>
                      <p className="mt-tight text-sm text-text-secondary">{g.pageIntro}</p>
                      <Link
                        href={guidePath(g.target)}
                        prefetch={false}
                        className={`mt-snug inline-block text-sm ${linkClass}`}
                      >
                        {`${g.label} steps`}
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-text-secondary">
                  The zip you were sent is the one for the Claude app. For Claude Code,{' '}
                  <Link href="/?skills=1" prefetch={false} className={linkClass}>
                    get that version
                  </Link>
                  .
                </p>
              </section>
            </>
          ) : (
            <>
              <section aria-label="Steps">
                <PackSteps steps={guide.steps} full />
              </section>
              <PackExample />
              <section aria-labelledby="pack-more" className="space-y-default">
                <h2 id="pack-more" className="type-h2 text-text-primary">
                  Day to day
                </h2>
                <p className="type-body text-text-secondary">
                  More to ask. If it does not use a skill, ask for it by name.
                </p>
                <div className="space-y-tight">
                  {MORE_PROMPTS.map((prompt) => (
                    <SayLine key={prompt} text={prompt} />
                  ))}
                </div>
                {guide.target === 'code' && (
                  <p className="text-sm text-text-secondary">
                    Using Cursor or GitHub Copilot? Their guides say they read the same skills, and START HERE covers
                    them, but we have not tried it yet.
                  </p>
                )}
              </section>
            </>
          )}

          <p className="text-sm text-text-secondary">
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
        </div>
      </LearnShell>
      <Footer />
    </main>
  );
}

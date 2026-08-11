import patterns from '@/data/patterns';
import { composeSkillMd, skillFilename } from '@/lib/skills/composeSkill';

/**
 * Serves one Claude Code SKILL.md per pattern at
 * `/skills/aiux-<slug>.md`, so the pattern page can offer a one-line
 * curl install. Fully static: the content is derived from pattern data
 * that only changes at build time.
 *
 * Deliberately absent from the sitemap. These are install targets for a
 * copy-pasted command, not pages we want indexed.
 */

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return patterns.map((pattern) => ({ slug: skillFilename(pattern) }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params;
  const pattern = patterns.find((p) => skillFilename(p) === slug);

  if (!pattern) {
    return new Response('Not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return new Response(composeSkillMd(pattern), {
    status: 200,
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}

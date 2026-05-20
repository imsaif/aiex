import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { scaffoldPattern, patchPatternsRegistry, patchScaffoldedRegistry } from '@/lib/agents/pattern-intel/scaffolder';
import { commitPatternFiles } from '@/lib/github';

type Kind = 'match' | 'example' | 'candidate';
type Action = 'approve' | 'reject';

interface Body {
  kind: Kind;
  action: Action;
}

async function fetchFileFromGitHub(path: string): Promise<{ content: string; sha: string }> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN not set');
  const res = await fetch(
    `https://api.github.com/repos/imsaif/aiex/contents/${path}?ref=master`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );
  if (!res.ok) throw new Error(`GitHub fetch ${path} failed: ${res.status}`);
  const data = await res.json() as { content: string; sha: string };
  return {
    content: Buffer.from(data.content, 'base64').toString('utf-8'),
    sha: data.sha,
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { kind, action } = body;
  if (!['match', 'example', 'candidate'].includes(kind)) {
    return NextResponse.json({ error: 'Invalid kind' }, { status: 400 });
  }
  if (!['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  const status = action === 'approve' ? 'approved' : 'rejected';

  try {
    if (kind === 'match') {
      const updated = await prisma.newsPatternMatch.update({
        where: { id },
        data: { status },
      });
      revalidatePath(`/patterns/${updated.patternSlug}`);
      const draft = await prisma.newsletterDraft.findUnique({
        where: { id: updated.newsletterId },
        select: { slug: true },
      });
      if (draft) revalidatePath(`/news/${draft.slug}`);

    } else if (kind === 'example') {
      await prisma.patternExampleCandidate.update({
        where: { id },
        data: { status },
      });

    } else {
      // Candidate — scaffold on approve, just mark rejected on dismiss
      if (action === 'reject') {
        await prisma.patternCandidate.update({ where: { id }, data: { status: 'rejected' } });
        return NextResponse.json({ ok: true, id, status: 'rejected' });
      }

      const candidate = await prisma.patternCandidate.findUnique({ where: { id } });
      if (!candidate) {
        return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
      }

      if (!process.env.GITHUB_TOKEN) {
        return NextResponse.json(
          { error: 'GITHUB_TOKEN not configured — add it to Vercel environment variables' },
          { status: 503 },
        );
      }

      // Generate all pattern files
      const scaffold = await scaffoldPattern({
        slug: candidate.proposedSlug,
        title: candidate.proposedTitle,
        category: candidate.proposedCategory,
        problem: candidate.problem,
        solution: candidate.solution,
        rationale: candidate.rationale,
      });

      // Patch patterns.ts + scaffolded demo registry in parallel
      const [{ content: patternsContent }, { content: scaffoldedRegContent }] = await Promise.all([
        fetchFileFromGitHub('src/data/patterns.ts'),
        fetchFileFromGitHub('src/components/examples/scaffolded/registry.ts'),
      ]);
      const patchedPatterns = patchPatternsRegistry(
        patternsContent,
        candidate.proposedSlug,
        scaffold.exportName,
      );
      const patchedScaffoldedReg = patchScaffoldedRegistry(scaffoldedRegContent, scaffold.demoSlug);

      const allFiles = {
        ...scaffold.files,
        'src/data/patterns.ts': patchedPatterns,
        'src/components/examples/scaffolded/registry.ts': patchedScaffoldedReg,
      };
      await commitPatternFiles(allFiles, candidate.proposedTitle);

      // Mark as approved
      await prisma.patternCandidate.update({ where: { id }, data: { status: 'approved' } });

      return NextResponse.json({
        ok: true,
        id,
        status: 'approved',
        slug: candidate.proposedSlug,
        filesCommitted: Object.keys(allFiles).length,
      });
    }
  } catch (err) {
    console.error('[pattern-review] update failed:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Update failed' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, id, status });
}

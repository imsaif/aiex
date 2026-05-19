import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

type Kind = 'match' | 'example' | 'candidate';
type Action = 'approve' | 'reject';

interface Body {
  kind: Kind;
  action: Action;
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
      await prisma.patternCandidate.update({
        where: { id },
        data: { status },
      });
    }
  } catch (err) {
    console.error('[pattern-review] update failed:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id, status });
}

import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import patterns from '@/data/patterns';
import { generatePatternDeepDive } from '@/lib/social/pattern-deepdive';

/**
 * Generate a product-first pattern deep-dive draft for social (LinkedIn + X).
 * Admin-only. Returns a DRAFT for human review + manual posting — it does not
 * publish anything (LinkedIn company tags only fire from the native composer).
 *
 * POST /api/social/deepdive  { patternSlug: string, featuredProduct?: string }
 */
export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { patternSlug, featuredProduct } = body || {};

    if (!patternSlug || typeof patternSlug !== 'string') {
      return NextResponse.json({ error: 'patternSlug is required' }, { status: 400 });
    }

    const pattern = patterns.find((p) => p.slug === patternSlug);
    if (!pattern) {
      return NextResponse.json({ error: `Unknown pattern: ${patternSlug}` }, { status: 404 });
    }

    const deepDive = await generatePatternDeepDive(pattern, {
      featuredProduct: typeof featuredProduct === 'string' ? featuredProduct : undefined,
    });

    return NextResponse.json({ deepDive });
  } catch (error) {
    console.error('[social/deepdive] generation failed:', error);
    const message = error instanceof Error ? error.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

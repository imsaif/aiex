import { NextRequest, NextResponse } from 'next/server';
import { patterns } from '@/data/patterns';
import type { LookupPatternInput, LookupPatternOutput, PatternDetails, MentorAPIError } from '@/types/mentor';

/**
 * Convert Pattern to PatternDetails for the mentor API
 */
function toPatternDetails(pattern: typeof patterns[0]): PatternDetails {
  return {
    id: pattern.id,
    title: pattern.title,
    slug: pattern.slug,
    category: pattern.category,
    description: pattern.description,
    problem: pattern.content.problem,
    solution: pattern.content.solution,
    guidelines: pattern.content.guidelines,
    considerations: pattern.content.considerations,
    examples: pattern.content.examples.map((ex) => ({
      title: ex.title,
      description: ex.description,
      image: ex.image || ex.imagePath,
    })),
    codeExamples: pattern.content.codeExamples.map((ce) => ({
      title: ce.title,
      description: ce.description,
      code: ce.code,
      language: ce.language,
    })),
  };
}

/**
 * Find pattern by ID or name (case-insensitive)
 */
function findPattern(patternId?: string, patternName?: string): typeof patterns[0] | undefined {
  if (patternId) {
    return patterns.find(
      (p) => p.id.toLowerCase() === patternId.toLowerCase() ||
             p.slug.toLowerCase() === patternId.toLowerCase()
    );
  }

  if (patternName) {
    const normalizedName = patternName.toLowerCase().replace(/[-_\s]/g, '');
    return patterns.find((p) => {
      const normalizedTitle = p.title.toLowerCase().replace(/[-_\s]/g, '');
      const normalizedId = p.id.toLowerCase().replace(/[-_\s]/g, '');
      return normalizedTitle.includes(normalizedName) ||
             normalizedId.includes(normalizedName) ||
             normalizedName.includes(normalizedTitle);
    });
  }

  return undefined;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patternId, patternName } = body as LookupPatternInput;

    // Validation
    if (!patternId && !patternName) {
      const error: MentorAPIError = {
        error: 'Missing required field: patternId or patternName',
        code: 'INVALID_INPUT',
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Find the pattern
    const pattern = findPattern(patternId, patternName);

    if (!pattern) {
      const result: LookupPatternOutput = {
        found: false,
        error: `Pattern not found: ${patternId || patternName}`,
      };
      return NextResponse.json(result);
    }

    // Convert to PatternDetails
    const details = toPatternDetails(pattern);

    const result: LookupPatternOutput = {
      found: true,
      pattern: details,
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('[Mentor Pattern] Error:', error);

    const apiError: MentorAPIError = {
      error: 'Pattern lookup failed',
      code: 'INTERNAL_ERROR',
      details: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(apiError, { status: 500 });
  }
}

/**
 * GET: List all patterns (summary only)
 */
export async function GET() {
  try {
    const patternList = patterns.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      description: p.description,
    }));

    return NextResponse.json({
      patterns: patternList,
      total: patternList.length,
    });

  } catch (error) {
    console.error('[Mentor Pattern] Error:', error);

    const apiError: MentorAPIError = {
      error: 'Failed to list patterns',
      code: 'INTERNAL_ERROR',
      details: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(apiError, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

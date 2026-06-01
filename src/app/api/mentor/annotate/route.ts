import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type {
  GenerateAnnotationsInput,
  GenerateAnnotationsOutput,
  Annotation,
  MentorAPIError,
} from '@/types/mentor';
import type { PatternResult } from '@/types/audit';
import { getAnnotationLimit, type UserTier } from '@/lib/mentor-tier';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface AnnotationRequest extends GenerateAnnotationsInput {
  imageBase64: string; // Need the image for Vision analysis
  tier?: 'free' | 'premium';
}

function buildAnnotationPrompt(
  patterns: { weak: PatternResult[]; missing: PatternResult[] },
  uiElements: string[],
  focusPatterns?: string[]
): string {
  // Filter patterns if focus is specified
  let weakPatterns = patterns.weak;
  let missingPatterns = patterns.missing;

  if (focusPatterns && focusPatterns.length > 0) {
    weakPatterns = weakPatterns.filter((p) => focusPatterns.includes(p.id));
    missingPatterns = missingPatterns.filter((p) => focusPatterns.includes(p.id));
  }

  const allIssues = [
    ...weakPatterns.map((p) => ({ ...p, type: 'weak' })),
    ...missingPatterns.map((p) => ({ ...p, type: 'missing' })),
  ].sort((a, b) => {
    // Sort by priority (high > medium > low), then by type (missing > weak)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const typeOrder = { missing: 0, weak: 1 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return typeOrder[a.type as 'missing' | 'weak'] - typeOrder[b.type as 'missing' | 'weak'];
  });

  return `You are creating visual annotations for a design audit. Your task is to identify WHERE on the screen each issue occurs.

**UI Elements Detected:**
${uiElements.map((el, i) => `${i + 1}. ${el}`).join('\n')}

**Issues to Annotate:**
${allIssues.map((issue, i) => `
${i + 1}. **${issue.name}** (${issue.id})
   - Status: ${issue.type === 'missing' ? 'MISSING' : 'WEAK implementation'}
   - Priority: ${issue.priority}
   - Evidence: ${issue.evidence}
   - Improvement: ${issue.improvement || 'N/A'}
`).join('\n')}

**Your Task:**
For each issue, identify the most relevant area on the screenshot and provide coordinates.

**Output Format (JSON):**
{
  "annotations": [
    {
      "id": "ann-1",
      "x": 45,
      "y": 30,
      "width": 20,
      "height": 15,
      "label": "Missing: Confidence Visualization",
      "severity": "critical",
      "patternId": "confidence-visualization",
      "patternName": "Confidence Visualization",
      "description": "Users can't see how confident the AI is in its responses. Add confidence indicators.",
      "learnMorePrompt": "Tell me more about Confidence Visualization and how to implement it"
    }
  ]
}

**Coordinate Guidelines:**
- All values are PERCENTAGES (0-100) relative to image dimensions
- x, y: top-left corner of the annotation box
- width, height: size of the annotation box
- Place annotations where the issue is MOST relevant in the UI
- For missing patterns, annotate where it SHOULD be implemented
- For weak patterns, annotate where the weak implementation EXISTS

**Severity Mapping:**
- "critical": Missing high-priority patterns
- "warning": Weak implementations or missing medium-priority patterns
- "suggestion": Missing low-priority patterns

**Important:**
- Be precise with coordinates - try to highlight the specific UI element
- If a pattern applies to the whole interface, use a small indicator in a relevant corner
- Ensure annotations don't overlap significantly
- Order annotations by severity (critical first)`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      analysisResults,
      imageBase64,
      focusPatterns,
      maxAnnotations,
      tier = 'free',
    } = body as AnnotationRequest;

    // Validation
    if (!sessionId || !analysisResults || !imageBase64) {
      const error: MentorAPIError = {
        error: 'Missing required fields: sessionId, analysisResults, imageBase64',
        code: 'INVALID_INPUT',
      };
      return NextResponse.json(error, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      const error: MentorAPIError = {
        error: 'ANTHROPIC_API_KEY not configured',
        code: 'INTERNAL_ERROR',
      };
      return NextResponse.json(error, { status: 500 });
    }

    // Calculate issues count
    const totalIssues =
      analysisResults.patterns.weak.length + analysisResults.patterns.missing.length;

    // Determine annotation limit based on tier using utility
    const tierLimit = getAnnotationLimit(tier as UserTier);
    const limit = maxAnnotations || tierLimit;

    const prompt = buildAnnotationPrompt(
      analysisResults.patterns,
      analysisResults.uiElements,
      focusPatterns
    );

    console.log('[Mentor Annotate] Generating annotations for session:', sessionId);

    // Call Claude Vision API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/png',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    // Extract text content
    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    // Parse JSON response
    let annotationData;
    try {
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      annotationData = JSON.parse(jsonMatch[0]);
    } catch {
      console.error('[Mentor Annotate] Failed to parse response:', textContent.text);
      throw new Error('Failed to parse Claude response as JSON');
    }

    // Apply tier limit
    let annotations: Annotation[] = annotationData.annotations || [];
    const limitedByTier = annotations.length > limit;

    if (limitedByTier) {
      annotations = annotations.slice(0, limit);
    }

    const result: GenerateAnnotationsOutput = {
      annotations,
      totalIssues,
      limitedByTier,
    };

    console.log(
      '[Mentor Annotate] Generated',
      annotations.length,
      'annotations.',
      limitedByTier ? `(limited from ${annotationData.annotations?.length || 0})` : ''
    );

    return NextResponse.json(result);

  } catch (error) {
    console.error('[Mentor Annotate] Error:', error);

    const apiError: MentorAPIError = {
      error: 'Annotation generation failed',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

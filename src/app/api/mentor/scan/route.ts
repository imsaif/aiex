import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { ScanDesignInput, ScanDesignOutput, MentorAPIError } from '@/types/mentor';
import type { PatternResult } from '@/types/audit';
import { canPerformScan, recordScan, getUsageSummary, type UserTier } from '@/lib/mentor-tier';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// All 36 AI UX patterns
const PATTERNS = [
  { id: 'adaptive-interfaces', name: 'Adaptive Interfaces' },
  { id: 'ambient-intelligence', name: 'Ambient Intelligence' },
  { id: 'anti-manipulation', name: 'Anti-Manipulation Safeguards' },
  { id: 'augmented-creation', name: 'Augmented Creation' },
  { id: 'collaborative-ai', name: 'Collaborative AI' },
  { id: 'confidence-visualization', name: 'Confidence Visualization' },
  { id: 'context-switching', name: 'Context Switching' },
  { id: 'contextual-assistance', name: 'Contextual Assistance' },
  { id: 'conversational-ui', name: 'Conversational UI' },
  { id: 'crisis-detection', name: 'Crisis Detection & Escalation' },
  { id: 'error-recovery', name: 'Error Recovery' },
  { id: 'explainable-ai', name: 'Explainable AI' },
  { id: 'feedback-loops', name: 'Feedback Loops' },
  { id: 'graceful-handoff', name: 'Graceful Handoff' },
  { id: 'guided-learning', name: 'Guided Learning' },
  { id: 'human-in-the-loop', name: 'Human-in-the-Loop' },
  { id: 'intelligent-caching', name: 'Intelligent Caching' },
  { id: 'multimodal-interaction', name: 'Multimodal Interaction' },
  { id: 'predictive-anticipation', name: 'Predictive Anticipation' },
  { id: 'privacy-first', name: 'Privacy-First Design' },
  { id: 'progressive-disclosure', name: 'Progressive Disclosure' },
  { id: 'progressive-enhancement', name: 'Progressive Enhancement' },
  { id: 'responsible-ai', name: 'Responsible AI Design' },
  { id: 'safe-exploration', name: 'Safe Exploration' },
  { id: 'selective-memory', name: 'Selective Memory' },
  { id: 'session-degradation', name: 'Session Degradation Prevention' },
  { id: 'universal-access', name: 'Universal Access Patterns' },
  { id: 'vulnerable-user-protection', name: 'Vulnerable User Protection' },
];

function buildScanPrompt(productType: string, userGoal?: string): string {
  return `You are an expert AI UX analyst. Analyze this interface screenshot for AI design patterns.

**Context:**
- Product Type: ${productType}
${userGoal ? `- User Goal: ${userGoal}` : ''}

**Your Tasks:**

1. **Identify UI Elements**: List the key interactive elements you see (buttons, inputs, cards, modals, etc.) with their approximate locations.

2. **Pattern Analysis**: For each of the 36 AI UX patterns, determine:
   - Status: "well-implemented", "weak", or "missing"
   - Evidence: What you see (or don't see) in the screenshot
   - Priority: "high", "medium", or "low" based on product type
   - Improvement: Specific suggestion if weak or missing

**Patterns to Analyze:**
${PATTERNS.map((p, i) => `${i + 1}. ${p.name} (${p.id})`).join('\n')}

**Output Format (JSON):**
{
  "uiElements": [
    "Primary CTA button (bottom-right)",
    "Chat input field (bottom-center)",
    "Message history area (center)",
    "Settings icon (top-right)"
  ],
  "patterns": {
    "adaptive-interfaces": {
      "id": "adaptive-interfaces",
      "name": "Adaptive Interfaces",
      "status": "well-implemented|weak|missing",
      "evidence": "Observed evidence from screenshot",
      "priority": "high|medium|low",
      "improvement": "Suggestion if needed",
      "category": "Adaptive & Intelligent Systems"
    }
  },
  "summary": "2-3 sentence overview of the analysis",
  "overallScore": 14
}

**Important:**
- Be specific about WHERE you see patterns (reference UI elements)
- Score = count of well-implemented patterns (max 36)
- Focus on actionable, specific feedback
- Consider the product type when setting priorities`;
}

function categorizePatterns(patterns: Record<string, PatternResult>): {
  detected: PatternResult[];
  weak: PatternResult[];
  missing: PatternResult[];
} {
  const detected: PatternResult[] = [];
  const weak: PatternResult[] = [];
  const missing: PatternResult[] = [];

  Object.values(patterns).forEach((pattern) => {
    switch (pattern.status) {
      case 'well-implemented':
        detected.push(pattern);
        break;
      case 'weak':
        weak.push(pattern);
        break;
      case 'missing':
        missing.push(pattern);
        break;
    }
  });

  return { detected, weak, missing };
}

interface ScanRequest extends ScanDesignInput {
  userId?: string;
  tier?: UserTier;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, productType, userGoal, userId, tier } = body as ScanRequest;

    // Default userId for MVP (would come from auth in production)
    const effectiveUserId = userId || 'anonymous';
    const effectiveTier: UserTier = tier || 'free';

    // Check if user can perform scan based on tier limits
    const scanCheck = canPerformScan(effectiveUserId, effectiveTier);
    if (!scanCheck.allowed) {
      const error: MentorAPIError = {
        error: scanCheck.reason || 'Scan limit reached',
        code: 'TIER_LIMIT',
        details: JSON.stringify(getUsageSummary(effectiveUserId, effectiveTier)),
      };
      return NextResponse.json(error, { status: 429 });
    }

    // Validation
    if (!imageBase64) {
      const error: MentorAPIError = {
        error: 'Missing required field: imageBase64',
        code: 'INVALID_INPUT',
      };
      return NextResponse.json(error, { status: 400 });
    }

    if (!productType) {
      const error: MentorAPIError = {
        error: 'Missing required field: productType',
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

    const prompt = buildScanPrompt(productType, userGoal);

    console.log('[Mentor Scan] Analyzing design for:', productType);

    // Call Claude Vision API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
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
    let analysisData;
    try {
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      analysisData = JSON.parse(jsonMatch[0]);
    } catch {
      console.error('[Mentor Scan] Failed to parse response:', textContent.text);
      throw new Error('Failed to parse Claude response as JSON');
    }

    // Generate session ID
    const sessionId = `mentor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Record this scan for usage tracking
    recordScan(effectiveUserId, sessionId);

    // Categorize patterns
    const categorized = categorizePatterns(analysisData.patterns || {});

    // Build response
    const result: ScanDesignOutput = {
      sessionId,
      patterns: categorized,
      uiElements: analysisData.uiElements || [],
      overallScore: analysisData.overallScore || categorized.detected.length,
      summary: analysisData.summary || '',
      timestamp: new Date().toISOString(),
    };

    console.log('[Mentor Scan] Complete. Score:', result.overallScore, '/ 36');

    return NextResponse.json(result);

  } catch (error) {
    console.error('[Mentor Scan] Error:', error);

    const apiError: MentorAPIError = {
      error: 'Scan failed',
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

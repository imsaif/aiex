import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { checkChatRateLimit } from '@/lib/rate-limit';
import type { PatternResult, ProductContext, TopGap } from '@/types/audit';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AnalysisContext {
  detectedComponent: string;
  componentDescription: string;
  score: number;
  maxScore: number;
  patterns: Record<string, PatternResult>;
  summary: string;
  criticalMissing: string[];
}

function buildLegacySystemPrompt(context: AnalysisContext): string {
  // Format pattern results for context
  const patternSummary = Object.entries(context.patterns)
    .filter(([, p]) => p.status !== 'not-applicable')
    .map(([, p]) => {
      const status = p.status === 'well-implemented' ? '✓' : p.status === 'weak' ? '⚠' : '✗';
      return `${status} ${p.name}: ${p.evidence}${p.improvement ? ` (Fix: ${p.improvement})` : ''}`;
    })
    .join('\n');

  const criticalIssues = context.criticalMissing.length > 0
    ? `\n\nCritical missing patterns: ${context.criticalMissing.join(', ')}`
    : '';

  return `You are an AI UX design expert helping designers improve their interfaces.

## Analysis Context

**What was analyzed:** ${context.componentDescription || context.detectedComponent}
**Score:** ${context.score}/${context.maxScore}
**Summary:** ${context.summary}

**Pattern Analysis:**
${patternSummary}
${criticalIssues}

${FORMATTING_RULES}`;
}

function buildContextFirstSystemPrompt(
  context: AnalysisContext,
  productContext: ProductContext,
  topGaps?: TopGap[],
  quickWins?: string[]
): string {
  const gapsSummary = topGaps
    ? topGaps
        .filter(g => g.status !== 'good')
        .map(g => `✗ ${g.pattern} (${g.status}): ${g.finding}`)
        .join('\n')
    : '';

  const goodPatterns = topGaps
    ? topGaps
        .filter(g => g.status === 'good')
        .map(g => `✓ ${g.pattern}: ${g.finding}`)
        .join('\n')
    : '';

  return `You are an AI UX design mentor with deep expertise in the aiuxdesign.guide pattern library.

You are helping a designer fix specific gaps found in their product.

## Product context
- Product: ${productContext.productDescription}
- Type: ${productContext.productType}
- AI decision points: ${productContext.aiRole.join(', ')}

## Audit findings
Score: ${context.score}/${context.maxScore}

**Gaps found:**
${gapsSummary}

**Working well:**
${goodPatterns}

${quickWins && quickWins.length > 0 ? `**Quick wins identified:** ${quickWins.join('; ')}` : ''}

## Your role
- Give specific, actionable design guidance — not pattern definitions
- Reference the actual product ("For your ${productContext.productDescription}...") when making suggestions
- Surface relevant resources from aiuxdesign.guide at the right moment
- If a gap relates to agentic patterns, link the Agentic UX Checklist
- If a gap relates to component design, link the AI Interaction Toolkit
- Don't repeat what the audit already said — go deeper

## Resources you can surface
- Agentic UX Checklist: aiuxdesign.guide/agentic-ux-checklist
- Agent Readability Audit: aiuxdesign.guide/agent-readability-audit-kit
- AI Interaction Toolkit: aiuxdesign.guide/toolkit
- AIUX Design Checklist: aiuxdesign.guide/handbook
- Figma Make Prompts: aiuxdesign.guide/prompts
- Designer's Guide: aiuxdesign.guide/guides
- Pattern library: aiuxdesign.guide/patterns/[pattern-slug]

Surface the right resource at the moment it's relevant. Don't list them all upfront.

${FORMATTING_RULES}`;
}

const FORMATTING_RULES = `## CRITICAL: Response Formatting Rules

You MUST format responses for easy scanning. Designers need visual hierarchy.

**Always use this structure:**

1. Start with a 1-sentence summary (no header needed)

2. Use clear headers with line breaks:

   **What's Working**
   • Point one
   • Point two

   **Priority Fix**
   Brief explanation of the #1 thing to fix

   **Quick Win**
   One small change they can make today

3. Use bullet points (•) not dashes
4. Keep each bullet to ONE line max
5. Bold pattern names: **Contextual Assistance**
6. Use line breaks between sections
7. Never write paragraphs - only bullets and short sentences
8. Max 100 words total

Now respond to the user's question using this format.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, messages, analysisContext, sessionId, productContext, topGaps, quickWins } = body as {
      message: string;
      messages: ChatMessage[];
      analysisContext: AnalysisContext;
      sessionId?: string;
      // Context-first fields
      productContext?: ProductContext;
      topGaps?: TopGap[];
      quickWins?: string[];
    };

    if (!message || !analysisContext) {
      return NextResponse.json(
        { error: 'Missing required fields: message and analysisContext' },
        { status: 400 }
      );
    }

    // Check chat rate limit (per session)
    const chatSessionId = sessionId || 'default';
    const rateLimit = checkChatRateLimit(chatSessionId);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Chat limit exceeded',
          message: `You've used all ${rateLimit.limit} chat messages for this session. Start a new analysis to continue chatting.`,
          remaining: 0,
          limit: rateLimit.limit,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': '0',
          }
        }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Build system prompt — context-first or legacy
    const systemPrompt = productContext
      ? buildContextFirstSystemPrompt(analysisContext, productContext, topGaps, quickWins)
      : buildLegacySystemPrompt(analysisContext);

    // Build conversation history
    const claudeMessages: Anthropic.MessageParam[] = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: systemPrompt,
      messages: claudeMessages,
    });

    // Extract the text content
    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    return NextResponse.json(
      {
        response: textContent.text,
        remaining: rateLimit.remaining,
        limit: rateLimit.limit,
      },
      {
        headers: {
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        }
      }
    );

  } catch (error) {
    console.error('[Audit Chat] Error:', error);

    return NextResponse.json(
      {
        error: 'Chat failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

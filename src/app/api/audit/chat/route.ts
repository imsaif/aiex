import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { PatternResult } from '@/types/audit';

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

function buildSystemPrompt(context: AnalysisContext): string {
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

## CRITICAL: Response Formatting Rules

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

**Example good response:**

Your main interface has strong foundations.

**What's Working**
• **Adaptive Interfaces** - Good touch targets
• **Multimodal** - Voice, text, camera options

**Priority Fix**
Add contextual suggestions when health topics detected - users typing "diabetic" should see nutrition tools.

**Quick Win**
Show relevant capability buttons based on input content.

---

Now respond to the user's question using this format.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, messages, analysisContext } = body as {
      message: string;
      messages: ChatMessage[];
      analysisContext: AnalysisContext;
    };

    if (!message || !analysisContext) {
      return NextResponse.json(
        { error: 'Missing required fields: message and analysisContext' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Build system prompt with analysis context
    const systemPrompt = buildSystemPrompt(analysisContext);

    // Build conversation history
    const claudeMessages: Anthropic.MessageParam[] = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: systemPrompt,
      messages: claudeMessages,
    });

    // Extract the text content
    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    return NextResponse.json({ response: textContent.text });

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

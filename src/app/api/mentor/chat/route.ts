import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { patterns } from '@/data/patterns';
import type {
  ChatInput,
  ChatOutput,
  ChatMessage,
  MentorSession,
  MentorAPIError,
  PatternDetails,
  Annotation,
  FixPrompt,
} from '@/types/mentor';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Tool definitions for Claude
const TOOL_DEFINITIONS: Anthropic.Tool[] = [
  {
    name: 'lookup_pattern',
    description: 'Look up detailed information about a specific AI UX design pattern. Use this when the user asks about a pattern or you need to explain a pattern.',
    input_schema: {
      type: 'object' as const,
      properties: {
        patternId: {
          type: 'string',
          description: 'The pattern ID or name to look up (e.g., "confidence-visualization", "error-recovery")',
        },
      },
      required: ['patternId'],
    },
  },
  {
    name: 'generate_fix_prompts',
    description: 'Generate actionable fix prompts for the user based on their design tool. Use this when the user asks for help fixing issues or wants prompts for their design tool.',
    input_schema: {
      type: 'object' as const,
      properties: {
        designTool: {
          type: 'string',
          enum: ['figma', 'sketch', 'framer', 'generic'],
          description: 'The design tool the user is using',
        },
        patternIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of pattern IDs to generate fix prompts for',
        },
      },
      required: ['designTool', 'patternIds'],
    },
  },
  {
    name: 'highlight_annotation',
    description: 'Highlight a specific annotation on the design canvas. Use this when discussing a specific issue location.',
    input_schema: {
      type: 'object' as const,
      properties: {
        annotationId: {
          type: 'string',
          description: 'The annotation ID to highlight',
        },
      },
      required: ['annotationId'],
    },
  },
];

// System prompt for the mentor
function buildSystemPrompt(session: MentorSession): string {
  const hasResults = !!session.scanResults;
  const hasAnnotations = session.annotations && session.annotations.length > 0;

  let contextInfo = '';

  if (hasResults) {
    const { patterns: patternResults, overallScore, summary } = session.scanResults!;
    contextInfo = `
## Current Design Analysis

**Overall Score:** ${overallScore}/36 patterns well-implemented

**Summary:** ${summary}

**Well-Implemented Patterns (${patternResults.detected.length}):**
${patternResults.detected.map(p => `- ${p.name}`).join('\n')}

**Weak Implementations (${patternResults.weak.length}):**
${patternResults.weak.map(p => `- ${p.name}: ${p.evidence}`).join('\n')}

**Missing Patterns (${patternResults.missing.length}):**
${patternResults.missing.map(p => `- ${p.name} (${p.priority} priority)`).join('\n')}
`;
  }

  if (hasAnnotations) {
    contextInfo += `
## Visual Annotations
${session.annotations!.map((a, i) => `${i + 1}. [${a.severity.toUpperCase()}] ${a.label} - ${a.description}`).join('\n')}
`;
  }

  return `You are an expert AI Design Mentor helping a designer improve their interface based on 36 AI UX design patterns.

Your role is to:
1. **Educate** - Explain patterns clearly with practical examples
2. **Guide** - Help identify issues and prioritize fixes
3. **Assist** - Generate actionable prompts for their design tools
4. **Support** - Answer questions about their specific design

${contextInfo}

## Guidelines
- Be concise but helpful (2-3 paragraphs max per response)
- Reference specific patterns by name when relevant
- Use the lookup_pattern tool to provide detailed pattern info
- When users ask about fixing issues, ask what design tool they use, then use generate_fix_prompts
- Be encouraging while being honest about issues
- Prioritize critical issues over suggestions

## Available Patterns (36 total)
${patterns.map(p => `- ${p.title} (${p.id})`).join('\n')}
`;
}

// Execute tool calls
async function executeToolCall(
  toolName: string,
  toolInput: Record<string, unknown>,
  session: MentorSession
): Promise<{ result: unknown; annotations?: Annotation[]; fixPrompts?: FixPrompt[] }> {
  switch (toolName) {
    case 'lookup_pattern': {
      const patternId = toolInput.patternId as string;
      const pattern = patterns.find(
        p => p.id.toLowerCase() === patternId.toLowerCase() ||
             p.slug.toLowerCase() === patternId.toLowerCase() ||
             p.title.toLowerCase().includes(patternId.toLowerCase())
      );

      if (!pattern) {
        return { result: { error: `Pattern not found: ${patternId}` } };
      }

      const details: PatternDetails = {
        id: pattern.id,
        title: pattern.title,
        slug: pattern.slug,
        category: pattern.category,
        description: pattern.description,
        problem: pattern.content.problem,
        solution: pattern.content.solution,
        guidelines: pattern.content.guidelines,
        considerations: pattern.content.considerations,
        examples: pattern.content.examples.map(ex => ({
          title: ex.title,
          description: ex.description,
          image: ex.image || ex.imagePath,
        })),
        codeExamples: pattern.content.codeExamples.map(ce => ({
          title: ce.title,
          description: ce.description,
          code: ce.code,
          language: ce.language,
        })),
      };

      return { result: details };
    }

    case 'generate_fix_prompts': {
      const designTool = (toolInput.designTool as string) || 'generic';
      const patternIds = (toolInput.patternIds as string[]) || [];

      // Generate simple fix prompts based on patterns and annotations
      const prompts: FixPrompt[] = [];

      for (const patternId of patternIds) {
        const annotation = session.annotations?.find(a => a.patternId === patternId);
        const pattern = patterns.find(p => p.id === patternId);

        if (pattern) {
          prompts.push({
            id: `fix-${patternId}`,
            issue: annotation?.description || `Implement ${pattern.title}`,
            patternId: pattern.id,
            patternName: pattern.title,
            severity: annotation?.severity || 'suggestion',
            prompt: generateToolPrompt(pattern.title, pattern.content.solution, designTool),
            toolSpecific: designTool !== 'generic',
            targetTool: designTool as 'figma' | 'sketch' | 'framer' | 'generic',
          });
        }
      }

      return { result: { success: true, count: prompts.length }, fixPrompts: prompts };
    }

    case 'highlight_annotation': {
      const annotationId = toolInput.annotationId as string;
      const annotation = session.annotations?.find(a => a.id === annotationId);

      if (!annotation) {
        return { result: { error: `Annotation not found: ${annotationId}` } };
      }

      return { result: { highlighted: annotationId }, annotations: [annotation] };
    }

    default:
      return { result: { error: `Unknown tool: ${toolName}` } };
  }
}

// Generate tool-specific prompt
function generateToolPrompt(patternName: string, solution: string, tool: string): string {
  const toolPrefixes: Record<string, string> = {
    figma: 'In Figma, create a component that',
    sketch: 'In Sketch, design a symbol that',
    framer: 'In Framer, build an interactive component that',
    generic: 'Design a UI element that',
  };

  const prefix = toolPrefixes[tool] || toolPrefixes.generic;

  // Simplify the solution into a prompt
  const simplifiedSolution = solution
    .split('.')[0] // Take first sentence
    .toLowerCase()
    .replace(/^design\s+/i, '')
    .replace(/^create\s+/i, '')
    .replace(/^implement\s+/i, '');

  return `${prefix} ${simplifiedSolution}. This implements the ${patternName} pattern to improve your AI UX.`;
}

// Session storage (in-memory for now - would use DB in production)
const sessions = new Map<string, MentorSession>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, message, includeImage } = body as ChatInput & { session?: MentorSession };

    // Get or create session
    let session = sessions.get(sessionId);

    // If session data provided in request, use it (for new sessions)
    if (body.session) {
      session = body.session;
      sessions.set(sessionId, session);
    }

    if (!session) {
      const error: MentorAPIError = {
        error: 'Session not found. Please start a new audit.',
        code: 'SESSION_NOT_FOUND',
      };
      return NextResponse.json(error, { status: 404 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      const error: MentorAPIError = {
        error: 'ANTHROPIC_API_KEY not configured',
        code: 'INTERNAL_ERROR',
      };
      return NextResponse.json(error, { status: 500 });
    }

    // Add user message to session
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    session.messages.push(userMessage);

    // Build messages for Claude
    const systemPrompt = buildSystemPrompt(session);

    const claudeMessages: Anthropic.MessageParam[] = session.messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    // If including image for re-examination
    if (includeImage && session.imageBase64) {
      claudeMessages[claudeMessages.length - 1] = {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/png',
              data: session.imageBase64,
            },
          },
          {
            type: 'text',
            text: message,
          },
        ],
      };
    }

    // Call Claude with tools
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      tools: TOOL_DEFINITIONS,
      messages: claudeMessages,
    });

    // Process response and tool calls
    let assistantContent = '';
    let annotations: Annotation[] = [];
    let fixPrompts: FixPrompt[] = [];
    const toolCalls: ChatMessage['toolCalls'] = [];

    for (const block of response.content) {
      if (block.type === 'text') {
        assistantContent += block.text;
      } else if (block.type === 'tool_use') {
        // Execute tool
        const toolResult = await executeToolCall(
          block.name,
          block.input as Record<string, unknown>,
          session
        );

        toolCalls.push({
          tool: block.name as 'scan_design' | 'lookup_pattern' | 'generate_annotations' | 'generate_action_items',
          input: block.input,
          output: toolResult.result,
        });

        if (toolResult.annotations) {
          annotations = [...annotations, ...toolResult.annotations];
        }
        if (toolResult.fixPrompts) {
          fixPrompts = [...fixPrompts, ...toolResult.fixPrompts];
        }

        // If we need to continue the conversation with tool results
        if (response.stop_reason === 'tool_use') {
          // Make another call with tool results
          const toolResultMessage: Anthropic.MessageParam = {
            role: 'user',
            content: [{
              type: 'tool_result',
              tool_use_id: block.id,
              content: JSON.stringify(toolResult.result),
            }],
          };

          const continuedResponse = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            system: systemPrompt,
            tools: TOOL_DEFINITIONS,
            messages: [...claudeMessages, { role: 'assistant', content: response.content }, toolResultMessage],
          });

          for (const contBlock of continuedResponse.content) {
            if (contBlock.type === 'text') {
              assistantContent += contBlock.text;
            }
          }
        }
      }
    }

    // Create assistant message
    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}-assistant`,
      role: 'assistant',
      content: assistantContent,
      timestamp: new Date().toISOString(),
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      annotations: annotations.length > 0 ? annotations : undefined,
      fixPrompts: fixPrompts.length > 0 ? fixPrompts : undefined,
    };

    session.messages.push(assistantMessage);
    session.updatedAt = new Date().toISOString();

    // Update session storage
    sessions.set(sessionId, session);

    const result: ChatOutput = {
      message: assistantMessage,
      session,
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('[Mentor Chat] Error:', error);

    const apiError: MentorAPIError = {
      error: 'Chat failed',
      code: 'INTERNAL_ERROR',
      details: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(apiError, { status: 500 });
  }
}

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://www.aiuxdesign.guide',
  'https://aiuxdesign.guide',
  process.env.NEXT_PUBLIC_SITE_URL,
].filter(Boolean);

function getCorsHeaders(origin: string | null) {
  // Check if origin is allowed
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin || 'https://www.aiuxdesign.guide',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(origin),
  });
}

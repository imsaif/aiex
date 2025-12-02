import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type {
  GenerateActionItemsInput,
  GenerateActionItemsOutput,
  FixPrompt,
  ChecklistTask,
  DesignTool,
  Annotation,
  MentorAPIError,
} from '@/types/mentor';
import { getFixPromptLimit, type UserTier } from '@/lib/mentor-tier';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Tool-specific prompt templates
const TOOL_INSTRUCTIONS: Record<DesignTool, string> = {
  figma: `Generate prompts optimized for Figma AI / Figma Make:
- Use Figma-specific terminology (frames, components, auto-layout, variants)
- Reference Figma's design system capabilities
- Suggest component-based solutions
- Keep prompts actionable within Figma's AI assistant`,

  sketch: `Generate prompts optimized for Sketch:
- Use Sketch terminology (artboards, symbols, overrides)
- Reference Sketch's component and style system
- Suggest symbol-based solutions
- Keep prompts clear for manual implementation`,

  framer: `Generate prompts optimized for Framer:
- Use Framer terminology (frames, stacks, components)
- Reference Framer's motion and interaction capabilities
- Suggest component-based solutions with interactions
- Include animation suggestions where relevant`,

  generic: `Generate universal design improvement prompts:
- Use standard design terminology
- Focus on the UX principle, not tool-specific features
- Provide clear, actionable guidance
- Include rationale for each suggestion`,
};

function buildActionItemsPrompt(
  annotations: Annotation[],
  designTool: DesignTool
): string {
  const toolInstructions = TOOL_INSTRUCTIONS[designTool];

  return `You are generating actionable fix prompts and a checklist for a designer based on a design audit.

**Design Tool: ${designTool.toUpperCase()}**
${toolInstructions}

**Issues to Address:**
${annotations.map((ann, i) => `
${i + 1}. **${ann.patternName}** (${ann.severity})
   - Location: x=${ann.x}%, y=${ann.y}%
   - Label: ${ann.label}
   - Description: ${ann.description}
`).join('\n')}

**Your Tasks:**

1. **Fix Prompts**: For each issue, generate a ready-to-use prompt the designer can paste into their tool.
2. **Checklist**: Create a project management checklist with all fixes.

**Output Format (JSON):**
{
  "fixPrompts": [
    {
      "id": "fix-1",
      "issue": "Missing confidence indicators",
      "patternId": "confidence-visualization",
      "patternName": "Confidence Visualization",
      "severity": "critical",
      "prompt": "Add a confidence indicator below the AI response showing certainty level. Use a horizontal bar with percentage (e.g., '85% confident'). Style: subtle gray bar, 4px height, rounded corners, with percentage text in small muted font to the right.",
      "toolSpecific": true,
      "targetTool": "figma"
    }
  ],
  "checklist": {
    "markdown": "## Design Fixes Checklist\\n\\n- [ ] Add confidence indicators to AI responses\\n- [ ] Implement error recovery flow\\n",
    "tasks": [
      {
        "id": "task-1",
        "title": "Add confidence indicators",
        "description": "Show AI certainty levels below responses",
        "patternId": "confidence-visualization",
        "priority": "high",
        "completed": false
      }
    ]
  }
}

**Prompt Writing Guidelines:**
- Be SPECIFIC: Include exact measurements, colors, spacing where helpful
- Be ACTIONABLE: The designer should be able to implement immediately
- Be CONTEXTUAL: Reference the specific location/element in their design
- For ${designTool}: ${designTool === 'figma' ? 'Use Figma AI syntax and capabilities' : designTool === 'generic' ? 'Keep tool-agnostic' : `Optimize for ${designTool}`}

**Checklist Guidelines:**
- Group related tasks if applicable
- Order by priority (high → medium → low)
- Keep titles concise (under 50 chars)
- Descriptions should be 1-2 sentences max`;
}

function generateMarkdownChecklist(tasks: ChecklistTask[]): string {
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const lines = ['## Design Fixes Checklist', ''];

  // Group by priority
  const highPriority = sortedTasks.filter((t) => t.priority === 'high');
  const mediumPriority = sortedTasks.filter((t) => t.priority === 'medium');
  const lowPriority = sortedTasks.filter((t) => t.priority === 'low');

  if (highPriority.length > 0) {
    lines.push('### 🔴 High Priority');
    highPriority.forEach((task) => {
      lines.push(`- [ ] **${task.title}** - ${task.description}`);
    });
    lines.push('');
  }

  if (mediumPriority.length > 0) {
    lines.push('### 🟡 Medium Priority');
    mediumPriority.forEach((task) => {
      lines.push(`- [ ] **${task.title}** - ${task.description}`);
    });
    lines.push('');
  }

  if (lowPriority.length > 0) {
    lines.push('### 🔵 Low Priority');
    lowPriority.forEach((task) => {
      lines.push(`- [ ] ${task.title} - ${task.description}`);
    });
    lines.push('');
  }

  return lines.join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      annotations,
      designTool = 'generic',
      // outputFormat is received but not used currently - kept for future use
      maxPrompts,
    } = body as GenerateActionItemsInput & { tier?: 'free' | 'premium' };

    const tier = body.tier || 'free';

    // Validation
    if (!sessionId || !annotations || annotations.length === 0) {
      const error: MentorAPIError = {
        error: 'Missing required fields: sessionId, annotations',
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

    // Determine prompt limit based on tier using utility
    const tierLimit = getFixPromptLimit(tier as UserTier);
    const limit = maxPrompts || tierLimit;

    const prompt = buildActionItemsPrompt(annotations, designTool);

    console.log('[Mentor Actions] Generating action items for:', designTool);

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract text content
    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    // Parse JSON response
    let actionData;
    try {
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      actionData = JSON.parse(jsonMatch[0]);
    } catch {
      console.error('[Mentor Actions] Failed to parse response:', textContent.text);
      throw new Error('Failed to parse Claude response as JSON');
    }

    // Apply tier limit
    let fixPrompts: FixPrompt[] = actionData.fixPrompts || [];
    const totalItems = fixPrompts.length;
    const limitedByTier = fixPrompts.length > limit;

    if (limitedByTier) {
      fixPrompts = fixPrompts.slice(0, limit);
    }

    // Ensure checklist has proper markdown
    const tasks: ChecklistTask[] = actionData.checklist?.tasks || [];
    const markdown = generateMarkdownChecklist(tasks);

    const result: GenerateActionItemsOutput = {
      fixPrompts,
      checklist: {
        markdown,
        tasks,
      },
      totalItems,
      limitedByTier,
    };

    console.log(
      '[Mentor Actions] Generated',
      fixPrompts.length,
      'fix prompts.',
      limitedByTier ? `(limited from ${totalItems})` : ''
    );

    return NextResponse.json(result);

  } catch (error) {
    console.error('[Mentor Actions] Error:', error);

    const apiError: MentorAPIError = {
      error: 'Action items generation failed',
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

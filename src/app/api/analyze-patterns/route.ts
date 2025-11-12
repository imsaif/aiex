import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json()

    if (!imageBase64) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      )
    }

    // Extract base64 data (remove data:image/...;base64, prefix if present)
    const base64Data = imageBase64.includes(',')
      ? imageBase64.split(',')[1]
      : imageBase64

    // Determine media type from the prefix
    let mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif' = 'image/jpeg'
    if (imageBase64.includes('image/png')) {
      mediaType = 'image/png'
    } else if (imageBase64.includes('image/webp')) {
      mediaType = 'image/webp'
    } else if (imageBase64.includes('image/gif')) {
      mediaType = 'image/gif'
    }

    // Prepare prompt for pattern detection
    const prompt = `Analyze this UI/website screenshot for AI UX design patterns. You are an expert at identifying AI-powered user experience patterns in interfaces.

IMPORTANT: Only mark a pattern as present (true) if there is clear visual evidence of AI/ML functionality, not just basic UX features.

Patterns to detect:

1. **explainableAI**: Shows why AI made specific decisions
   - Look for: "Why?" buttons, explanation text, reasoning displays, decision factors shown
   - Examples: "We recommended this because...", "Factors considered:", AI reasoning panels

2. **confidenceIndicators**: Displays AI certainty/confidence levels
   - Look for: Confidence percentages, certainty bars, probability indicators, "low/medium/high confidence"
   - Examples: "85% confident", confidence meters, uncertainty warnings

3. **humanInTheLoop**: Requires human approval or allows human control over AI actions
   - Look for: Accept/reject buttons, "Review before sending", approve/deny options, manual override controls
   - Examples: "Approve changes", "Review AI suggestion", edit-before-use interfaces

4. **progressiveDisclosure**: AI reveals information gradually based on context
   - Look for: Smart expandable sections, "Show more" with intelligent filtering, contextual reveals
   - Examples: AI-curated "Show relevant details", intelligent accordion panels

5. **undoRedo**: Allows reversing or redoing AI actions
   - Look for: Undo/redo buttons, "Revert AI changes", version history for AI outputs
   - Examples: Undo button for AI edits, restore previous AI version

6. **gracefulDegradation**: Handles AI failures with fallback options
   - Look for: "Try manual mode", "Skip AI", fallback to human input, alternative paths when AI fails
   - Examples: "AI unavailable, enter manually", manual override options

7. **contextualAssistance**: AI help relevant to current task/context
   - Look for: Smart tooltips, inline AI suggestions, context-aware help bubbles, AI assistant panels
   - Examples: Contextual AI suggestions, inline smart help, task-specific AI guidance

Return JSON with this exact structure (no markdown formatting, just raw JSON):
{
  "detected_patterns": {
    "explainableAI": true/false,
    "confidenceIndicators": true/false,
    "humanInTheLoop": true/false,
    "progressiveDisclosure": true/false,
    "undoRedo": true/false,
    "gracefulDegradation": true/false,
    "contextualAssistance": true/false
  },
  "pattern_count": number,
  "summary": "One sentence describing the AI maturity of this design"
}`

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620', // Using Sonnet for cost efficiency
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    })

    // Parse Claude's response
    const content = response.content[0].type === 'text' ? response.content[0].text : ''

    // Extract JSON from response (handle markdown code blocks if present)
    let jsonContent = content
    if (content.includes('```json')) {
      const match = content.match(/```json\s*([\s\S]*?)\s*```/)
      if (match) {
        jsonContent = match[1]
      }
    } else if (content.includes('```')) {
      const match = content.match(/```\s*([\s\S]*?)\s*```/)
      if (match) {
        jsonContent = match[1]
      }
    }

    const analysisResult = JSON.parse(jsonContent.trim())

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
    })

  } catch (error) {
    console.error('Pattern analysis error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze patterns'
      },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildContextAwarePrompt } from '@/lib/patterns/detection-prompts';
import type { ContextData, AnalysisResults } from '@/types/audit';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Detect image media type from base64 data
function detectMediaType(base64: string): 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif' {
  // Check magic bytes in base64
  if (base64.startsWith('/9j/')) return 'image/jpeg';
  if (base64.startsWith('iVBORw')) return 'image/png';
  if (base64.startsWith('UklGR')) return 'image/webp';
  if (base64.startsWith('R0lGOD')) return 'image/gif';
  // Default to JPEG as it's most common
  return 'image/jpeg';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { context, imageBase64 } = body as {
      context: ContextData;
      imageBase64: string;
    };

    if (!context || !imageBase64) {
      return NextResponse.json(
        { error: 'Missing required fields: context and imageBase64' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Build the context-aware prompt
    const prompt = buildContextAwarePrompt(context);

    // Detect the image media type
    const mediaType = detectMediaType(imageBase64);
    console.log('[Pattern Audit] Analyzing with context:', context.interfaceType, 'Media type:', mediaType);

    // Call Claude Vision API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
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

    // Extract the text content
    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    // Parse the JSON response
    let analysisData;
    try {
      // Extract JSON from the response (Claude might wrap it in markdown)
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      analysisData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('[Pattern Audit] Failed to parse response:', textContent.text);
      throw new Error('Failed to parse Claude response as JSON');
    }

    // Generate a unique ID for this analysis
    const id = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create the analysis results with new context-aware fields
    const results: AnalysisResults = {
      id,
      context,
      score: analysisData.score || 0,
      maxScore: analysisData.maxScore || analysisData.applicablePatternCount || 28,
      detectedComponent: analysisData.detectedComponent || 'unknown',
      componentDescription: analysisData.componentDescription || '',
      patterns: analysisData.patterns || {},
      summary: analysisData.summary || '',
      criticalMissing: analysisData.criticalMissing || [],
      timestamp: new Date().toISOString(),
    };

    console.log('[Pattern Audit] Analysis complete. Score:', results.score);

    return NextResponse.json(results);

  } catch (error) {
    console.error('[Pattern Audit] Error:', error);

    return NextResponse.json(
      {
        error: 'Analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Enable CORS if needed
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

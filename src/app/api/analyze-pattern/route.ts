import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildContextAwarePrompt } from '@/lib/patterns/detection-prompts';
import { checkAnalysisRateLimit, formatTimeUntilReset } from '@/lib/rate-limit';
import type { ContextData, AnalysisResults, DeviceType } from '@/types/audit';

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
    // Get client IP for rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    const rateLimit = checkAnalysisRateLimit(ip);
    if (!rateLimit.allowed) {
      const timeUntilReset = formatTimeUntilReset(rateLimit.resetAt);
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `You've used all ${rateLimit.limit} free analyses for today. Come back in ${timeUntilReset}!`,
          resetAt: rateLimit.resetAt,
          remaining: 0,
          limit: rateLimit.limit,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetAt.toString(),
          }
        }
      );
    }

    const body = await request.json();
    const { context, imageBase64, images, deviceType } = body as {
      context: ContextData;
      imageBase64: string;
      images?: Array<{ base64: string; deviceType: DeviceType }>;
      deviceType?: DeviceType;
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

    // Build the context-aware prompt with device type context
    const basePrompt = buildContextAwarePrompt(context);
    const deviceContext = deviceType === 'mobile'
      ? '\n\nIMPORTANT: This is a MOBILE interface screenshot. Consider mobile-specific patterns like touch targets, thumb zones, mobile navigation patterns, and responsive design. Mobile interfaces have different UX considerations than desktop.'
      : '\n\nIMPORTANT: This is a DESKTOP interface screenshot. Consider desktop-specific patterns like hover states, keyboard navigation, larger information density, and multi-panel layouts.';

    // Build image content blocks
    const imageList = images && images.length > 1 ? images : [{ base64: imageBase64, deviceType: deviceType || 'desktop' as DeviceType }];
    const imageBlocks: Anthropic.ImageBlockParam[] = imageList.map((img) => ({
      type: 'image' as const,
      source: {
        type: 'base64' as const,
        media_type: detectMediaType(img.base64),
        data: img.base64,
      },
    }));

    const multiImageContext = imageList.length > 1
      ? `\n\nYou are analyzing ${imageList.length} screenshots of the same product/flow. Consider all images together to get a complete picture of the user experience. Look for patterns across screens — continuity, consistency, flow progression, and cross-screen UX patterns.`
      : '';

    const prompt = basePrompt + deviceContext + multiImageContext;

    console.log('[Pattern Audit] Analyzing with context:', context.interfaceType, 'Device:', deviceType || 'unknown', 'Images:', imageList.length);

    // Call Claude Vision API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            ...imageBlocks,
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

    return NextResponse.json(results, {
      headers: {
        'X-RateLimit-Limit': rateLimit.limit.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': rateLimit.resetAt.toString(),
      }
    });

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

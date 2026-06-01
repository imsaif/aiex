import { after, NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildContextAwarePrompt } from '@/lib/patterns/detection-prompts';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/audit/prompts';
import { parseAnalysisResponse } from '@/lib/audit/parseAnalysis';
import { recordAuditSample } from '@/lib/audit/sample';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { buildMockResponse, isE2EMode, pickScenario } from '@/lib/audit/e2e-mock';
import { checkAnalysisRateLimit, formatTimeUntilReset } from '@/lib/rate-limit';
import type { ContextData, AnalysisResults, DeviceType, ProductType } from '@/types/audit';

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
  const startedAt = Date.now();
  const userAgent = request.headers.get('user-agent');
  // Get client IP for rate limiting
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown';
  let role: string | null = null;

  // Auto-detect admin session cookie — if the requester is logged into
  // /admin/* their audits are self-testing and should be tagged so they
  // stay out of the AuditSample dashboard's default view.
  try {
    if (await isAdminAuthenticated(request)) {
      role = 'admin';
    }
  } catch {
    // Cookie parse failure shouldn't break the analyze path.
  }

  // E2E_MODE short-circuit — Playwright specs hit this branch so they don't
  // call Anthropic or burn API spend. Header picks scenario; default is
  // "success" (gaps present). Keep before rate-limit + body parse so tests
  // never see flake from limiter state.
  if (isE2EMode()) {
    try {
      const body = await request.json().catch(() => ({} as Record<string, unknown>));
      const scenario = pickScenario(request.headers.get('x-e2e-scenario'));
      const images = (body as { images?: unknown[] }).images;
      const imageCount = Array.isArray(images) && images.length > 0 ? images.length : 1;
      const productType = ((body as { productType?: string }).productType ?? null) as
        | import('@/types/audit').ProductType
        | null;
      return NextResponse.json(buildMockResponse({ scenario, productType, imageCount }));
    } catch {
      return NextResponse.json(buildMockResponse({ scenario: 'success', productType: null, imageCount: 1 }));
    }
  }

  try {
    // Check rate limit
    const rateLimit = checkAnalysisRateLimit(ip);
    if (!rateLimit.allowed) {
      const timeUntilReset = formatTimeUntilReset(rateLimit.resetAt);
      after(() =>
        recordAuditSample({
          outcome: 'rate_limited',
          latencyMs: Date.now() - startedAt,
          ip,
          userAgent,
          role,
        })
      );
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
    const { context, imageBase64, images, deviceType, productType, productDescription, aiRole, role: bodyRole } = body as {
      context: ContextData;
      imageBase64: string;
      images?: Array<{ base64: string; deviceType: DeviceType }>;
      deviceType?: DeviceType;
      // New context-first fields
      productType?: ProductType;
      productDescription?: string;
      aiRole?: string[];
      role?: string;
    };
    // Admin auto-detection (above) takes precedence over a client-supplied
    // role — don't let a stale `aiux:role=test` localStorage value downgrade
    // an admin tag, and don't let a missing flag erase it.
    if (role !== 'admin' && typeof bodyRole === 'string' && bodyRole.length > 0) {
      role = bodyRole;
    }

    if (!imageBase64) {
      after(() =>
        recordAuditSample({
          outcome: 'bad_request',
          productType: productType ?? null,
          deviceType: deviceType ?? null,
          isContextFirst: !!productType,
          errorReason: 'missing_image',
          latencyMs: Date.now() - startedAt,
          ip,
          userAgent,
          role,
        })
      );
      return NextResponse.json(
        { error: 'Missing required field: imageBase64' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Determine if this is a context-first request (new flow) or legacy request
    const isContextFirst = !!productType;

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

    const deviceContext = deviceType === 'mobile'
      ? '\n\nIMPORTANT: This is a MOBILE interface screenshot. Consider mobile-specific patterns like touch targets, thumb zones, mobile navigation patterns, and responsive design. Mobile interfaces have different UX considerations than desktop.'
      : '\n\nIMPORTANT: This is a DESKTOP interface screenshot. Consider desktop-specific patterns like hover states, keyboard navigation, larger information density, and multi-panel layouts.';

    let systemPrompt: string | undefined;
    let userPrompt: string;

    if (isContextFirst) {
      // New context-first flow — use product-aware prompts
      systemPrompt = buildSystemPrompt(productType!);
      userPrompt = buildUserPrompt(productType!, productDescription) + deviceContext + multiImageContext;
      console.log('[Pattern Audit] Context-first analysis:', productType, '| Device:', deviceType || 'unknown', '| Images:', imageList.length);
    } else {
      // Legacy flow — use component-detection prompts
      const basePrompt = buildContextAwarePrompt(context);
      userPrompt = basePrompt + deviceContext + multiImageContext;
      console.log('[Pattern Audit] Legacy analysis:', context?.interfaceType, '| Device:', deviceType || 'unknown', '| Images:', imageList.length);
    }

    // Call Claude Vision API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      temperature: 0,
      ...(systemPrompt ? { system: systemPrompt } : {}),
      messages: [
        {
          role: 'user',
          content: [
            ...imageBlocks,
            {
              type: 'text',
              text: userPrompt,
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

    // Parse + validate the JSON response. Never throws — returns a typed
    // Result so we can surface upstream model failures as 502 instead of a
    // generic 500 (and so the user sees a real error instead of a blank UI).
    const parseResult = parseAnalysisResponse(textContent.text);
    if (!parseResult.ok) {
      console.error(
        '[Pattern Audit] Response parse failed:',
        parseResult.reason,
        '|',
        parseResult.detail,
        '\n--- raw response ---\n',
        parseResult.raw.slice(0, 2000),
      );
      after(() =>
        recordAuditSample({
          outcome: 'parse_error',
          isContextFirst,
          productType: productType ?? null,
          deviceType: deviceType ?? null,
          imageCount: imageList.length,
          errorReason: parseResult.reason,
          errorDetail: parseResult.detail,
          latencyMs: Date.now() - startedAt,
          ip,
          userAgent,
          role,
        })
      );
      return NextResponse.json(
        {
          error: 'Upstream analysis returned an invalid response',
          reason: parseResult.reason,
          detail: parseResult.detail,
        },
        { status: 502 },
      );
    }
    const analysisData = parseResult.data;

    // Generate a unique ID for this analysis
    const id = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    if (isContextFirst) {
      // Return context-aware results format
      const results = {
        id,
        score: analysisData.score ?? 0,
        maxScore: analysisData.maxScore ?? 36,
        productTypeSummary: analysisData.productTypeSummary || '',
        surfaceDescription: analysisData.surfaceDescription || '',
        applicablePatterns: analysisData.applicablePatterns || [],
        topGaps: analysisData.topGaps || [],
        quickWins: analysisData.quickWins || [],
        chatContext: analysisData.chatContext || '',
        productContext: {
          productType: productType!,
          productDescription: productDescription!,
          aiRole: aiRole || [],
        },
        // Also include legacy fields for backward compat with ResultsPanel
        context: context || { interfaceType: 'other', mainConcern: 'usability', userGoal: 'exploring-options', deviceType },
        detectedComponent: analysisData.detectedComponent || productType || 'unknown',
        componentDescription: analysisData.productTypeSummary || productDescription || '',
        patterns: analysisData.patterns || {},
        summary: analysisData.chatContext || analysisData.summary || '',
        criticalMissing: (analysisData.topGaps || [])
          .filter((g: { status: string }) => g.status === 'missing')
          .map((g: { pattern: string }) => g.pattern),
        timestamp: new Date().toISOString(),
      };

      console.log('[Pattern Audit] Context-first analysis complete. Score:', results.score, '/', results.maxScore);

      after(() =>
        recordAuditSample({
          outcome: results.topGaps.length === 0 ? 'empty_gaps' : 'success',
          isContextFirst: true,
          productType: productType ?? null,
          deviceType: deviceType ?? null,
          imageCount: imageList.length,
          score: results.score,
          maxScore: results.maxScore,
          applicablePatternCount: results.applicablePatterns.length,
          gapCount: results.topGaps.length,
          criticalMissingCount: results.criticalMissing.length,
          surfaceDescription: results.surfaceDescription || null,
          latencyMs: Date.now() - startedAt,
          ip,
          userAgent,
          role,
        })
      );

      return NextResponse.json(results, {
        headers: {
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetAt.toString(),
        }
      });
    }

    // Legacy results format
    const results: AnalysisResults = {
      id,
      context,
      score: analysisData.score || 0,
      maxScore: analysisData.maxScore || (analysisData.applicablePatterns?.length ?? 0) || 28,
      detectedComponent: analysisData.detectedComponent || 'unknown',
      componentDescription: analysisData.componentDescription || '',
      patterns: (analysisData.patterns as AnalysisResults['patterns']) || {},
      summary: analysisData.summary || '',
      criticalMissing: analysisData.criticalMissing || [],
      timestamp: new Date().toISOString(),
    };

    console.log('[Pattern Audit] Legacy analysis complete. Score:', results.score);

    after(() =>
      recordAuditSample({
        outcome: results.criticalMissing.length === 0 && (!results.patterns || Object.keys(results.patterns).length === 0)
          ? 'empty_gaps'
          : 'success',
        isContextFirst: false,
        productType: null,
        deviceType: deviceType ?? null,
        imageCount: imageList.length,
        score: results.score,
        maxScore: results.maxScore,
        applicablePatternCount: Object.keys(results.patterns || {}).length,
        gapCount: results.criticalMissing.length,
        criticalMissingCount: results.criticalMissing.length,
        surfaceDescription: results.componentDescription || null,
        latencyMs: Date.now() - startedAt,
        ip,
        userAgent,
      })
    );

    return NextResponse.json(results, {
      headers: {
        'X-RateLimit-Limit': rateLimit.limit.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': rateLimit.resetAt.toString(),
      }
    });

  } catch (error) {
    console.error('[Pattern Audit] Error:', error);

    after(() =>
      recordAuditSample({
        outcome: 'api_error',
        errorReason: 'unhandled_exception',
        errorDetail: error instanceof Error ? `${error.name}: ${error.message}\n${error.stack ?? ''}` : String(error),
        latencyMs: Date.now() - startedAt,
        ip,
        userAgent,
      })
    );

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

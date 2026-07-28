import { after, NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildContextAwarePrompt } from '@/lib/patterns/detection-prompts';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/audit/prompts';
import { parseAnalysisResponse } from '@/lib/audit/parseAnalysis';
import { recordAuditSample } from '@/lib/audit/sample';
import { clampScore } from '@/lib/audit/score';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { buildMockResponse, isE2EMode, pickScenario } from '@/lib/audit/e2e-mock';
import { checkAnalysisRateLimit, formatTimeUntilReset } from '@/lib/rate-limit';
import { runVerificationLoop } from '@/lib/audit/verifyLoop';
import type { ContextData, AnalysisResults, DeviceType, ProductType } from '@/types/audit';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// The verify loop can make up to 3 sequential Sonnet vision calls (analyze,
// critic, revise). This project runs on Vercel Hobby, where 60s is a hard
// ceiling, not a raisable default. What keeps the function under that cap is
// the per-call abort budgets threaded through runVerificationLoop (see
// LOOP_DEADLINE_MS below), not a higher maxDuration.
export const maxDuration = 60;

// Wall-clock headroom the loop must respect so the function never hard-times-out.
// Leaves ~5s under maxDuration for JSON serialization + the after() sample write.
const LOOP_DEADLINE_MS = 55000;

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
      // The hourly health monitor pings this route with an empty body purely to
      // assert it still returns 400 (see api/health/audit/route.ts). Don't record
      // a sample for it — it only checks the status code, and writing one bloats
      // the table (was 98.6% of all rows) and skews raw queries.
      if (role !== 'monitor') {
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
      }
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
      // Cache the large, static analysis rubric (36-pattern library + process +
      // output format). It's identical for a given productType, so repeat audits
      // and the eval harness (which loops many fixtures) read it from cache.
      ...(systemPrompt
        ? { system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }] }
        : {}),
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

    // Verification-critic loop (flag-gated). Re-examines the screenshot(s),
    // drops/sharpens unverifiable findings, and falls back to the draft on any
    // failure or when the time budget is spent. Context-first flow only.
    let finalData = analysisData;
    if (isContextFirst && process.env.AUDIT_VERIFY_LOOP === '1') {
      try {
        const loop = await runVerificationLoop({
          client: anthropic,
          imageBlocks,
          systemPrompt,
          draft: analysisData,
          deadlineMs: startedAt + LOOP_DEADLINE_MS,
        });
        finalData = loop.result;
        // Structured log for the prod signal on whether the loop fired, whether
        // it revised the draft, and whether the critic produced a verdict at
        // all (false means the critic call failed or was skipped on budget).
        // Persisting fired/revised onto AuditSample is a deferred follow-up
        // for when the AUDIT_VERIFY_LOOP flag is enabled by default.
        console.log(
          '[Pattern Audit] Verify loop:',
          JSON.stringify({ fired: true, revised: loop.revised, hadVerdict: loop.verdict !== null }),
        );
      } catch (loopErr) {
        // The loop is best-effort; never let it break the response.
        console.error('[Pattern Audit] Verify loop error (using draft):', loopErr);
        finalData = analysisData;
      }
    }

    // Generate a unique ID for this analysis
    const id = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    if (isContextFirst) {
      // Return context-aware results format
      const csMaxScore = finalData.maxScore ?? 36;
      const results = {
        id,
        score: clampScore(finalData.score ?? 0, csMaxScore),
        maxScore: csMaxScore,
        productTypeSummary: finalData.productTypeSummary || '',
        surfaceDescription: finalData.surfaceDescription || '',
        applicablePatterns: finalData.applicablePatterns || [],
        topGaps: finalData.topGaps || [],
        quickWins: finalData.quickWins || [],
        generalObservations: finalData.generalObservations || [],
        chatContext: finalData.chatContext || '',
        productContext: {
          productType: productType!,
          productDescription: productDescription!,
          aiRole: aiRole || [],
        },
        // Also include legacy fields for backward compat with ResultsPanel
        context: context || { interfaceType: 'other', mainConcern: 'usability', userGoal: 'exploring-options', deviceType },
        detectedComponent: finalData.detectedComponent || productType || 'unknown',
        componentDescription: finalData.productTypeSummary || productDescription || '',
        patterns: finalData.patterns || {},
        summary: finalData.chatContext || finalData.summary || '',
        criticalMissing: (finalData.topGaps || [])
          .filter((g: { status: string }) => g.status === 'missing')
          .map((g: { pattern: string }) => g.pattern),
        timestamp: new Date().toISOString(),
      };

      console.log('[Pattern Audit] Context-first analysis complete. Score:', results.score, '/', results.maxScore);

      // 0 applicable patterns => the user audited a non-AI surface. Distinguish it
      // from a genuine no-gaps run so we can measure it (it was ~22% of real audits,
      // all with applicablePatternCount 0) and render the hybrid "not an AI surface
      // + general UX notes" state instead of a blank result.
      const outcome: 'no_ai_surface' | 'empty_gaps' | 'success' =
        results.applicablePatterns.length === 0
          ? 'no_ai_surface'
          : results.topGaps.length === 0
            ? 'empty_gaps'
            : 'success';

      after(() =>
        recordAuditSample({
          outcome,
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
          sessionId: id,
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
    const legacyMaxScore = analysisData.maxScore || (analysisData.applicablePatterns?.length ?? 0) || 28;
    const results: AnalysisResults = {
      id,
      context,
      score: clampScore(analysisData.score || 0, legacyMaxScore),
      maxScore: legacyMaxScore,
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
        sessionId: id,
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

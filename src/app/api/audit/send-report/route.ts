import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend';
import { checkRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import { getPatternSlug } from '@/utils/pattern-links';
import { validateEmailSecurity } from '@/lib/email-validation';
import { addSubscriberToBeehiiv } from '@/lib/beehiiv';
import type { AnalysisResults, PatternResult } from '@/types/audit';

// Request validation schema
const productContextSchema = z.object({
  productType: z.string(),
  productDescription: z.string(),
  aiRole: z.array(z.string()),
}).optional();

const sendReportSchema = z.object({
  email: z.string().email('Invalid email address'),
  productContext: productContextSchema,
  results: z.object({
    id: z.string(),
    score: z.number(),
    maxScore: z.number(),
    detectedComponent: z.string(),
    componentDescription: z.string().optional(),
    patterns: z.record(z.object({
      id: z.string().optional(),
      name: z.string(),
      status: z.enum(['well-implemented', 'weak', 'missing', 'not-applicable']),
      evidence: z.string(),
      priority: z.enum(['high', 'medium', 'low', 'none']),
      improvement: z.string().optional(),
      category: z.string().optional(),
    })),
    summary: z.string(),
    criticalMissing: z.array(z.string()),
    timestamp: z.string(),
    context: z.object({
      interfaceType: z.string(),
      userGoal: z.string(),
      mainConcern: z.string(),
      industry: z.string().optional(),
      stage: z.string().optional(),
      deviceType: z.string().optional(),
    }),
  }),
});

export async function POST(request: NextRequest) {
  // Rate limiting by IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const rateLimit = checkRateLimit(
    ip,
    'audit-send-report',
    RATE_LIMIT_PRESETS.SUBSCRIBE.limit,
    RATE_LIMIT_PRESETS.SUBSCRIBE.windowMs
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many email requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000)),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { email, results, productContext } = sendReportSchema.parse(body);

    // Bot protection: honeypot + disposable email check
    const securityError = validateEmailSecurity(email, body);
    if (securityError) {
      return NextResponse.json({ error: securityError }, { status: 400 });
    }

    // Generate and send the email
    const emailHtml = generateAuditReportEmail(results as AnalysisResults, productContext);

    await resend.emails.send({
      from: 'AI UX Patterns <imran@aiuxdesign.guide>',
      replyTo: 'imranrizom@gmail.com',
      to: email,
      subject: `Your AI UX Audit Report - Score: ${results.score}/${results.maxScore}`,
      html: emailHtml,
    });

    // Auto-subscribe to newsletter (non-blocking — don't fail the email)
    try {
      const existingSubscriber = await prisma.subscriber.findUnique({
        where: { email },
      });

      if (!existingSubscriber) {
        await prisma.subscriber.create({ data: { email } });
      } else if (!existingSubscriber.active) {
        await prisma.subscriber.update({ where: { email }, data: { active: true } });
      }
    } catch {
      // DB unreachable — email already sent, subscriber sync is best-effort
    }

    // Sync to Beehiiv (fire-and-forget)
    addSubscriberToBeehiiv(email).catch(() => {});

    return NextResponse.json(
      { message: 'Report sent successfully! Check your inbox.' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    console.error('Send audit report error:', error);
    return NextResponse.json(
      { error: 'Failed to send report. Please try again.' },
      { status: 500 }
    );
  }
}

// Get top 3 priority patterns
function getTopPriorities(patterns: Record<string, PatternResult>): PatternResult[] {
  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2, none: 3 };

  const allPatterns = Object.values(patterns);
  const missingPatterns = allPatterns.filter(p => p.status === 'missing');
  const weakPatterns = allPatterns.filter(p => p.status === 'weak');

  const combined = [
    ...missingPatterns.map(p => ({ ...p, isMissing: true })),
    ...weakPatterns.map(p => ({ ...p, isMissing: false })),
  ].sort((a, b) => {
    if (a.isMissing !== b.isMissing) return a.isMissing ? -1 : 1;
    return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
  });

  return combined.slice(0, 3);
}

// Generate pattern list HTML for a group
function generatePatternListHtml(patterns: PatternResult[], color: string): string {
  if (patterns.length === 0) return '';

  return patterns.map(pattern => {
    const patternSlug = getPatternSlug(pattern.id);
    const patternUrl = `https://www.aiuxdesign.guide/patterns/${patternSlug}`;
    return `
      <tr>
        <td style="padding: 8px 0;">
          <a href="${patternUrl}" style="color: ${color}; text-decoration: none; font-size: 14px;">
            • ${pattern.name} →
          </a>
        </td>
      </tr>
    `;
  }).join('');
}

function formatProductType(type: string): string {
  const labels: Record<string, string> = {
    'chat-interface': 'Chat Interface',
    'ai-agent': 'AI Agent / Workflow',
    'recommendation-system': 'Recommendation System',
    'content-generation': 'Content Generation',
    'other': 'AI Product',
  };
  return labels[type] || type;
}

// Top products that implement each pattern — used in email CTAs for social proof
const PATTERN_PRODUCTS: Record<string, string> = {
  'adaptive-interfaces': 'Netflix, Spotify, Duolingo',
  'ambient-intelligence': 'Google Home, Apple, Nest',
  'augmented-creation': 'Notion AI, GitHub Copilot, Midjourney',
  'collaborative-ai': 'Figma AI, Google Docs, Miro',
  'confidence-visualization': 'Google Search, Grammarly, ChatGPT',
  'contextual-assistance': 'GitHub Copilot, Notion AI, Cursor',
  'conversational-ui': 'ChatGPT, Claude, Gemini',
  'error-recovery': 'ChatGPT, Claude, Midjourney',
  'explainable-ai': 'Google, LinkedIn, Spotify',
  'feedback-loops': 'ChatGPT, Midjourney, Notion AI',
  'guided-learning': 'Duolingo, Notion, Figma',
  'human-in-the-loop': 'GitHub Copilot, ChatGPT, Cursor',
  'multimodal-interaction': 'ChatGPT, Gemini, Claude',
  'predictive-anticipation': 'Google, Spotify, Netflix',
  'progressive-disclosure': 'Notion, Linear, ChatGPT',
  'responsible-ai-design': 'Claude, Google, OpenAI',
  'safe-exploration': 'Cursor, GitHub Copilot, Replit',
  'selective-memory': 'ChatGPT, Claude, Notion AI',
  'privacy-first-design': 'Apple, Signal, DuckDuckGo',
  'context-switching': 'Notion, Linear, ChatGPT',
  'graceful-handoff': 'Intercom, Zendesk, ChatGPT',
  'intelligent-caching': 'Google, Notion, Figma',
  'progressive-enhancement': 'GitHub, Vercel, Notion',
  'anti-manipulation-safeguards': 'Claude, Google, Apple',
  'crisis-detection': 'Google, Meta, ChatGPT',
  'session-degradation-prevention': 'ChatGPT, Claude, Gemini',
  'vulnerable-user-protection': 'Google, Apple, Meta',
  'universal-access-patterns': 'Apple, Google, Microsoft',
  'autonomy-spectrum': 'Cursor, GitHub Copilot, Claude',
  'intent-preview': 'Cursor, Claude, GitHub Copilot',
  'plan-summary': 'Claude, Cursor, ChatGPT',
  'action-audit-trail': 'Linear, GitHub, Claude',
  'escalation-pathways': 'Intercom, Claude, ChatGPT',
  'trust-calibration': 'Claude, Google, ChatGPT',
  'mixed-initiative-control': 'Cursor, GitHub Copilot, Claude',
  'agent-status-monitoring': 'Claude, Cursor, ChatGPT',
};

function getPatternProducts(patternId: string): string {
  return PATTERN_PRODUCTS[patternId] || 'leading AI products';
}

function getBenchmark(productType?: string): { range: string; note: string } {
  const benchmarks: Record<string, { range: string; note: string }> = {
    'chat-interface': { range: '14-20', note: 'Chat interfaces typically score higher on conversational patterns but often miss transparency and feedback mechanisms' },
    'ai-agent': { range: '10-16', note: 'Agentic products are newer and often lack trust, control, and escalation patterns that users need' },
    'recommendation-system': { range: '12-18', note: 'Recommendation systems tend to be strong on personalization but often miss explainability and user control' },
    'content-generation': { range: '13-19', note: 'Content generation tools usually handle creation well but often lack confidence indicators and safe exploration' },
    'other': { range: '10-18', note: 'AI products vary widely, but most have room to improve transparency and user feedback' },
  };
  return benchmarks[productType || 'other'] || benchmarks['other'];
}

function generateAuditReportEmail(results: AnalysisResults, productContext?: { productType: string; productDescription: string; aiRole: string[] }): string {
  const allPatterns = Object.values(results.patterns);
  const goodPatterns = allPatterns.filter(p => p.status === 'well-implemented');
  const weakPatterns = allPatterns.filter(p => p.status === 'weak');
  const missingPatterns = allPatterns.filter(p => p.status === 'missing');
  const topPriorities = getTopPriorities(results.patterns);
  const percentage = Math.round((results.score / results.maxScore) * 100);
  const benchmark = getBenchmark(productContext?.productType);

  // Brand colors — navy palette, minimal color use
  const navy = '#162036';
  const secondaryText = '#4b5563'; // gray-600
  const mutedText = '#6b7280'; // gray-500
  const border = '#e5e7eb';
  const bgLight = '#f9fafb';

  const productName = productContext?.productDescription || results.detectedComponent || 'your AI interface';

  // Top strengths (max 3, with evidence)
  const strengthsHtml = goodPatterns.slice(0, 3).map(pattern => {
    const patternSlug = getPatternSlug(pattern.id);
    const patternUrl = `https://www.aiuxdesign.guide/patterns/${patternSlug}`;
    return `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid ${border};">
          <a href="${patternUrl}" style="color: ${navy}; text-decoration: none; font-weight: 600; font-size: 15px;">${pattern.name}</a>
          ${pattern.evidence ? `<p style="margin: 4px 0 0 0; color: ${secondaryText}; font-size: 14px; line-height: 1.5;">${pattern.evidence}</p>` : ''}
        </td>
      </tr>
    `;
  }).join('');

  // Top actions (max 3, with evidence + improvement)
  const actionsHtml = topPriorities.map((pattern, index) => {
    const patternSlug = getPatternSlug(pattern.id);
    const patternUrl = `https://www.aiuxdesign.guide/patterns/${patternSlug}`;
    const statusLabel = pattern.status === 'missing' ? 'Missing' : 'Weak';
    return `
      <tr>
        <td style="padding: 20px 0; ${index < topPriorities.length - 1 ? `border-bottom: 1px solid ${border};` : ''}">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="32" valign="top" style="padding-right: 12px;">
                <div style="width: 28px; height: 28px; background: ${navy}; color: #fff; border-radius: 50%; text-align: center; line-height: 28px; font-weight: 700; font-size: 13px;">${index + 1}</div>
              </td>
              <td valign="top">
                <div style="margin-bottom: 8px;">
                  <a href="${patternUrl}" style="color: ${navy}; text-decoration: none; font-weight: 600; font-size: 15px;">${pattern.name}</a>
                  <span style="display: inline-block; margin-left: 8px; padding: 2px 8px; border-radius: 3px; font-size: 11px; font-weight: 500; background: ${bgLight}; color: ${mutedText}; border: 1px solid ${border};">${statusLabel}</span>
                </div>
                ${pattern.evidence ? `<p style="margin: 0 0 8px 0; color: ${secondaryText}; font-size: 14px; line-height: 1.5;"><strong style="color: ${navy};">What we found:</strong> ${pattern.evidence}</p>` : ''}
                ${pattern.improvement ? `<p style="margin: 0; color: ${navy}; font-size: 14px; line-height: 1.5; font-weight: 500;">${pattern.improvement}</p>` : ''}
                <a href="${patternUrl}" style="display: inline-block; margin-top: 8px; color: ${navy}; font-size: 13px; text-decoration: underline;">See how ${getPatternProducts(pattern.id)} do this &rarr;</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }).join('');

  // Compact pattern list for full breakdown
  const compactList = (patterns: PatternResult[]) => patterns.map(p => {
    const slug = getPatternSlug(p.id);
    return `<a href="https://www.aiuxdesign.guide/patterns/${slug}" style="color: ${secondaryText}; text-decoration: none; font-size: 13px;">${p.name}</a>`;
  }).join(' &nbsp;&middot;&nbsp; ');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI UX Audit Report</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: ${navy}; max-width: 680px; margin: 0 auto; padding: 20px; background: #f5f5f5;">

        <!-- Header -->
        <div style="background: ${navy}; padding: 32px 28px; border-radius: 10px 10px 0 0;">
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">AI UX Audit Report</p>
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">${productName}</h1>
          ${productContext ? `<p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 14px;">${formatProductType(productContext.productType)}${productContext.aiRole.length > 0 ? ' &middot; ' + productContext.aiRole.join(', ') : ''}</p>` : ''}
        </div>

        <!-- How We Audited -->
        <div style="background: ${bgLight}; padding: 20px 28px; border-left: 1px solid ${border}; border-right: 1px solid ${border};">
          <h2 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 600; color: ${mutedText}; text-transform: uppercase; letter-spacing: 0.5px;">What we analyzed</h2>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              ${productContext ? `<td style="padding: 4px 16px 4px 0; vertical-align: top;">
                <p style="margin: 0; font-size: 12px; color: ${mutedText};">Product</p>
                <p style="margin: 2px 0 0 0; font-size: 14px; color: ${navy};">${productContext.productDescription}</p>
              </td>
              <td style="padding: 4px 16px 4px 0; vertical-align: top;">
                <p style="margin: 0; font-size: 12px; color: ${mutedText};">Type</p>
                <p style="margin: 2px 0 0 0; font-size: 14px; color: ${navy};">${formatProductType(productContext.productType)}</p>
              </td>` : ''}
              ${results.context.deviceType ? `<td style="padding: 4px 0; vertical-align: top;">
                <p style="margin: 0; font-size: 12px; color: ${mutedText};">Screenshot</p>
                <p style="margin: 2px 0 0 0; font-size: 14px; color: ${navy};">${results.context.deviceType}</p>
              </td>` : ''}
            </tr>
          </table>
          ${productContext && productContext.aiRole.length > 0 ? `
          <p style="margin: 12px 0 0 0; font-size: 13px; color: ${secondaryText}; line-height: 1.5;"><strong style="color: ${navy};">AI capabilities:</strong> ${productContext.aiRole.join(', ')}</p>
          ` : ''}
          <p style="margin: 12px 0 0 0; font-size: 12px; color: ${mutedText}; line-height: 1.5;">
            Your screenshot was analyzed against ${results.maxScore} research-backed UX patterns for AI products. Each pattern was scored as well-implemented, weak, or missing based on visible interface elements.
          </p>
        </div>

        <!-- Executive Summary + Score -->
        <div style="background: #ffffff; padding: 28px; border-left: 1px solid ${border}; border-right: 1px solid ${border};">
          <p style="margin: 0 0 20px 0; color: ${secondaryText}; font-size: 15px; line-height: 1.6;">
            ${results.summary}
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: ${bgLight}; border-radius: 8px;">
            <tr>
              <td style="padding: 16px 20px; text-align: center; width: 33%;">
                <p style="margin: 0; font-size: 28px; font-weight: 700; color: ${navy};">${results.score}<span style="font-size: 16px; color: ${mutedText};">/${results.maxScore}</span></p>
                <p style="margin: 2px 0 0 0; font-size: 12px; color: ${mutedText};">${percentage}% detected</p>
              </td>
              <td style="padding: 16px 20px; text-align: center; width: 22%; border-left: 1px solid ${border};">
                <p style="margin: 0; font-size: 20px; font-weight: 700; color: ${navy};">${goodPatterns.length}</p>
                <p style="margin: 2px 0 0 0; font-size: 12px; color: ${mutedText};">Strong</p>
              </td>
              <td style="padding: 16px 20px; text-align: center; width: 22%; border-left: 1px solid ${border};">
                <p style="margin: 0; font-size: 20px; font-weight: 700; color: ${navy};">${weakPatterns.length}</p>
                <p style="margin: 2px 0 0 0; font-size: 12px; color: ${mutedText};">Improve</p>
              </td>
              <td style="padding: 16px 20px; text-align: center; width: 22%; border-left: 1px solid ${border};">
                <p style="margin: 0; font-size: 20px; font-weight: 700; color: ${navy};">${missingPatterns.length}</p>
                <p style="margin: 2px 0 0 0; font-size: 12px; color: ${mutedText};">Missing</p>
              </td>
            </tr>
          </table>

          <p style="margin: 16px 0 0 0; font-size: 13px; color: ${mutedText}; text-align: center;">
            Similar ${productContext ? formatProductType(productContext.productType).toLowerCase() + 's' : 'products'} typically score <strong style="color: ${navy};">${benchmark.range}</strong> out of ${results.maxScore}. ${benchmark.note}.
          </p>
        </div>

        ${goodPatterns.length > 0 ? `
        <!-- Strengths -->
        <div style="background: #ffffff; padding: 28px; border-left: 1px solid ${border}; border-right: 1px solid ${border}; border-top: 1px solid ${border};">
          <h2 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 700; color: ${navy};">What you're doing well</h2>
          <p style="margin: 0 0 16px 0; font-size: 13px; color: ${mutedText};">${goodPatterns.length} pattern${goodPatterns.length !== 1 ? 's' : ''} well implemented</p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            ${strengthsHtml}
          </table>
          ${goodPatterns.length > 3 ? `<p style="margin: 12px 0 0 0; font-size: 13px; color: ${mutedText};">+ ${goodPatterns.length - 3} more: ${compactList(goodPatterns.slice(3))}</p>` : ''}
        </div>
        ` : ''}

        <!-- Top Actions -->
        <div style="background: #ffffff; padding: 28px; border-left: 1px solid ${border}; border-right: 1px solid ${border}; border-top: 1px solid ${border};">
          <h2 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 700; color: ${navy};">
            ${topPriorities.length > 0 ? 'Your top 3 actions' : 'No critical gaps found'}
          </h2>
          <p style="margin: 0 0 16px 0; font-size: 13px; color: ${mutedText};">Highest impact improvements for ${productName}</p>
          ${topPriorities.length > 0 ? `
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            ${actionsHtml}
          </table>
          ` : `<p style="color: ${secondaryText}; font-size: 14px;">Your interface covers the key patterns. Consider exploring advanced patterns to stay ahead.</p>`}
        </div>

        ${topPriorities.length > 0 ? `
        <!-- Start Here -->
        <div style="background: #ffffff; padding: 24px 28px; border-left: 1px solid ${border}; border-right: 1px solid ${border}; border-top: 1px solid ${border};">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: ${bgLight}; border-radius: 8px; border: 1px solid ${border};">
            <tr>
              <td style="padding: 20px 24px;">
                <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; color: ${mutedText}; text-transform: uppercase; letter-spacing: 0.5px;">If you fix one thing</p>
                <p style="margin: 0 0 8px 0; font-size: 17px; font-weight: 700; color: ${navy};">
                  <a href="https://www.aiuxdesign.guide/patterns/${getPatternSlug(topPriorities[0].id)}" style="color: ${navy}; text-decoration: none;">
                    ${topPriorities[0].name} &rarr;
                  </a>
                </p>
                <p style="margin: 0; font-size: 14px; color: ${secondaryText}; line-height: 1.5;">${topPriorities[0].improvement || topPriorities[0].evidence}</p>
              </td>
            </tr>
          </table>
        </div>
        ` : ''}

        ${(weakPatterns.length > 3 || missingPatterns.length > 3) ? `
        <!-- Full Breakdown (compact) -->
        <div style="background: #ffffff; padding: 28px; border-left: 1px solid ${border}; border-right: 1px solid ${border}; border-top: 1px solid ${border};">
          <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: ${navy};">Full breakdown</h2>
          ${weakPatterns.length > 0 ? `
          <p style="margin: 0 0 8px 0; font-size: 13px;"><strong style="color: ${navy};">Needs improvement (${weakPatterns.length}):</strong></p>
          <p style="margin: 0 0 16px 0; font-size: 13px; line-height: 1.8; color: ${secondaryText};">${compactList(weakPatterns)}</p>
          ` : ''}
          ${missingPatterns.length > 0 ? `
          <p style="margin: 0 0 8px 0; font-size: 13px;"><strong style="color: ${navy};">Missing (${missingPatterns.length}):</strong></p>
          <p style="margin: 0; font-size: 13px; line-height: 1.8; color: ${secondaryText};">${compactList(missingPatterns)}</p>
          ` : ''}
        </div>
        ` : ''}

        <!-- CTA -->
        <div style="background: #ffffff; padding: 32px 28px; text-align: center; border-left: 1px solid ${border}; border-right: 1px solid ${border}; border-top: 1px solid ${border};">
          <a href="https://www.aiuxdesign.guide/audit"
             style="display: inline-block; background: ${navy}; color: #fff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">
            Run Another Audit &rarr;
          </a>
          <p style="margin: 12px 0 0 0; color: ${mutedText}; font-size: 13px;">Try with a different screen or product</p>
        </div>

        <!-- Footer -->
        <div style="background: ${bgLight}; padding: 24px 28px; text-align: center; border: 1px solid ${border}; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="margin: 0 0 8px 0; color: ${mutedText}; font-size: 12px;">
            <a href="https://www.aiuxdesign.guide" style="color: ${mutedText}; text-decoration: none;">aiuxdesign.guide</a>
          </p>
          <p style="margin: 0; font-size: 11px; color: #9ca3af;">
            <a href="https://www.aiuxdesign.guide/api/newsletter/unsubscribe?email=RECIPIENT" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
            &nbsp;&middot;&nbsp;
            <a href="https://www.aiuxdesign.guide/audit" style="color: #9ca3af; text-decoration: underline;">Run another audit</a>
          </p>
        </div>

      </body>
    </html>
  `;
}

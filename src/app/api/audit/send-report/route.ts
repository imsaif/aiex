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

    // Auto-subscribe to newsletter (upsert)
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (!existingSubscriber) {
      // Create new subscriber
      await prisma.subscriber.create({
        data: { email },
      });
    } else if (!existingSubscriber.active) {
      // Reactivate if inactive
      await prisma.subscriber.update({
        where: { email },
        data: { active: true },
      });
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

function generateAuditReportEmail(results: AnalysisResults, productContext?: { productType: string; productDescription: string; aiRole: string[] }): string {
  const allPatterns = Object.values(results.patterns);
  const goodPatterns = allPatterns.filter(p => p.status === 'well-implemented');
  const weakPatterns = allPatterns.filter(p => p.status === 'weak');
  const missingPatterns = allPatterns.filter(p => p.status === 'missing');
  const topPriorities = getTopPriorities(results.patterns);

  const percentage = Math.round((results.score / results.maxScore) * 100);

  // Determine score color
  let scoreColor = '#ef4444'; // red
  if (percentage >= 70) scoreColor = '#22c55e'; // green
  else if (percentage >= 40) scoreColor = '#f59e0b'; // amber

  const prioritiesHtml = topPriorities.length > 0
    ? topPriorities.map((pattern, index) => {
        const patternSlug = getPatternSlug(pattern.id);
        const patternUrl = `https://www.aiuxdesign.guide/patterns/${patternSlug}`;
        return `
        <tr>
          <td style="padding: 16px 16px 16px 16px; border-bottom: 1px solid #e5e7eb;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="40" valign="top" style="padding-right: 12px;">
                  <div style="width: 28px; height: 28px; background: #000; color: #fff; border-radius: 6px; text-align: center; line-height: 28px; font-weight: 700; font-size: 14px;">${index + 1}</div>
                </td>
                <td valign="top">
                  <a href="${patternUrl}" style="color: #1a1a1a; text-decoration: none; font-weight: 600; font-size: 15px; display: block; margin-bottom: 6px;">
                    ${pattern.name} →
                  </a>
                  <span style="display: inline-block; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 500; background: ${pattern.status === 'missing' ? '#fef2f2' : '#fffbeb'}; color: ${pattern.status === 'missing' ? '#dc2626' : '#d97706'};">
                    ${pattern.status === 'missing' ? 'Missing' : 'Needs Improvement'}
                  </span>
                  ${pattern.improvement ? `<p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">${pattern.improvement}</p>` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
      }).join('')
    : `
        <tr>
          <td style="padding: 24px; text-align: center;">
            <p style="margin: 0; color: #22c55e; font-weight: 600;">All patterns well implemented!</p>
          </td>
        </tr>
      `;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your AI UX Audit Report</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 32px 24px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">Your AI UX Audit Report</h1>
          <p style="color: #94a3b8; margin: 0; font-size: 14px;">${productContext?.productDescription || results.detectedComponent || 'AI Interface'}</p>
        </div>

        ${productContext ? `
        <!-- Product Context -->
        <div style="background: #f8fafc; padding: 20px 24px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding: 4px 0;">
                <span style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Product Type</span>
                <p style="margin: 2px 0 0 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">${formatProductType(productContext.productType)}</p>
              </td>
            </tr>
            ${productContext.aiRole.length > 0 ? `
            <tr>
              <td style="padding: 8px 0 0 0;">
                <span style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">AI Capabilities</span>
                <p style="margin: 2px 0 0 0; font-size: 14px; color: #1a1a1a;">${productContext.aiRole.join(' · ')}</p>
              </td>
            </tr>
            ` : ''}
          </table>
        </div>
        ` : ''}

        <!-- Score Section -->
        <div style="background: #ffffff; padding: 32px 24px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; padding: 20px 40px; background: #f8fafc; border-radius: 12px;">
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Pattern Score</p>
              <p style="margin: 0; font-size: 48px; font-weight: 700; color: ${scoreColor};">${results.score}<span style="font-size: 24px; color: #9ca3af;">/${results.maxScore}</span></p>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #6b7280;">${percentage}% of patterns detected</p>
            </div>
          </div>

          <!-- Summary Stats -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center">
                <table cellpadding="0" cellspacing="8" border="0">
                  <tr>
                    <td style="text-align: center; padding: 12px 20px; background: #f0fdf4; border-radius: 8px;">
                      <p style="margin: 0; font-size: 20px; font-weight: 700; color: #22c55e;">${goodPatterns.length}</p>
                      <p style="margin: 0; font-size: 12px; color: #6b7280;">Well Done</p>
                    </td>
                    <td style="text-align: center; padding: 12px 20px; background: #fffbeb; border-radius: 8px;">
                      <p style="margin: 0; font-size: 20px; font-weight: 700; color: #f59e0b;">${weakPatterns.length}</p>
                      <p style="margin: 0; font-size: 12px; color: #6b7280;">Improve</p>
                    </td>
                    <td style="text-align: center; padding: 12px 20px; background: #fef2f2; border-radius: 8px;">
                      <p style="margin: 0; font-size: 20px; font-weight: 700; color: #ef4444;">${missingPatterns.length}</p>
                      <p style="margin: 0; font-size: 12px; color: #6b7280;">Missing</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>

        <!-- Top Priorities Section -->
        <div style="background: #ffffff; padding: 24px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
          <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1a1a1a;">
            ${topPriorities.length > 0 ? 'Top Priorities' : 'Great Work!'}
          </h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            ${prioritiesHtml}
          </table>
        </div>

        <!-- Full Pattern Breakdown -->
        <div style="background: #ffffff; padding: 24px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
          <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #1a1a1a;">Full Pattern Breakdown</h2>

          <!-- Well Done Patterns -->
          ${goodPatterns.length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #22c55e; text-transform: uppercase; letter-spacing: 0.5px;">
              ✓ Well Done (${goodPatterns.length})
            </h3>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f0fdf4; border-radius: 8px; padding: 12px;">
              <tr><td style="padding: 12px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  ${generatePatternListHtml(goodPatterns, '#16a34a')}
                </table>
              </td></tr>
            </table>
          </div>
          ` : ''}

          <!-- Needs Improvement Patterns -->
          ${weakPatterns.length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px;">
              ⚠ Needs Improvement (${weakPatterns.length})
            </h3>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #fffbeb; border-radius: 8px; padding: 12px;">
              <tr><td style="padding: 12px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  ${generatePatternListHtml(weakPatterns, '#d97706')}
                </table>
              </td></tr>
            </table>
          </div>
          ` : ''}

          <!-- Missing Patterns -->
          ${missingPatterns.length > 0 ? `
          <div style="margin-bottom: 0;">
            <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px;">
              ✗ Missing (${missingPatterns.length})
            </h3>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #fef2f2; border-radius: 8px; padding: 12px;">
              <tr><td style="padding: 12px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  ${generatePatternListHtml(missingPatterns, '#dc2626')}
                </table>
              </td></tr>
            </table>
          </div>
          ` : ''}
        </div>

        <!-- CTA Section -->
        <div style="background: #ffffff; padding: 32px 24px; text-align: center; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
          <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">Learn how to implement these patterns:</p>
          <a href="https://www.aiuxdesign.guide"
             style="display: inline-block; background: #000; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Explore All 36 Patterns
          </a>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 24px; text-align: center; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px;">
            You're subscribed to AI UX Patterns updates.
          </p>
          <p style="margin: 0; font-size: 12px;">
            <a href="https://www.aiuxdesign.guide/audit" style="color: #6b7280; text-decoration: underline;">Run another audit</a>
          </p>
        </div>

      </body>
    </html>
  `;
}

import { createHash } from 'crypto';
import { prisma } from '@/lib/prisma';

export type AuditOutcome =
  | 'success'
  | 'empty_gaps'
  | 'no_ai_surface' // 0 applicable AI patterns — user audited a non-AI surface
  | 'parse_error'
  | 'api_error'
  | 'rate_limited'
  | 'bad_request';

export interface RecordAuditSampleInput {
  outcome: AuditOutcome;
  isContextFirst?: boolean;
  productType?: string | null;
  deviceType?: string | null;
  imageCount?: number;
  score?: number | null;
  maxScore?: number | null;
  applicablePatternCount?: number;
  gapCount?: number;
  criticalMissingCount?: number;
  errorReason?: string | null;
  errorDetail?: string | null;
  surfaceDescription?: string | null;
  latencyMs?: number | null;
  ip?: string | null;
  userAgent?: string | null;
  role?: string | null;
  sessionId?: string | null; // results.id — join key to UiEvent.sessionId
}

export function hashIp(ip: string | null | undefined): string | null {
  if (!ip || ip === 'unknown') return null;
  const salt = process.env.AUDIT_SAMPLE_IP_SALT || process.env.HANDBOOK_TOKEN_SECRET || 'aiux';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 16);
}

const DETAIL_MAX = 2000;
const UA_MAX = 200;
const SURFACE_MAX = 500;

export async function recordAuditSample(input: RecordAuditSampleInput): Promise<void> {
  try {
    await prisma.auditSample.create({
      data: {
        outcome: input.outcome,
        isContextFirst: input.isContextFirst ?? false,
        productType: input.productType ?? null,
        deviceType: input.deviceType ?? null,
        imageCount: input.imageCount ?? 1,
        score: input.score ?? null,
        maxScore: input.maxScore ?? null,
        applicablePatternCount: input.applicablePatternCount ?? 0,
        gapCount: input.gapCount ?? 0,
        criticalMissingCount: input.criticalMissingCount ?? 0,
        errorReason: input.errorReason ?? null,
        errorDetail: input.errorDetail ? input.errorDetail.slice(0, DETAIL_MAX) : null,
        surfaceDescription: input.surfaceDescription ? input.surfaceDescription.slice(0, SURFACE_MAX) : null,
        latencyMs: input.latencyMs ?? null,
        ipHash: hashIp(input.ip),
        userAgent: input.userAgent ? input.userAgent.slice(0, UA_MAX) : null,
        role: input.role && /^[a-z0-9_-]{1,32}$/i.test(input.role) ? input.role.toLowerCase() : null,
        sessionId: input.sessionId ?? null,
      },
    });
  } catch (err) {
    console.error('[AuditSample] write failed:', err instanceof Error ? err.message : err);
  }
}

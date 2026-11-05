import type { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { hashIp } from './sample';

const RETENTION_DAYS = 30;
const NOT_SAVED_ROLES = new Set(['admin', 'test', 'monitor']);
const PRODUCT_TYPE_SOURCES = new Set(['auto', 'manual', 'sample']);
const ROLE_SHAPE = /^[a-z0-9_-]{1,32}$/i; // Client-supplied, as in sample.ts and /api/events.

export interface SaveAuditRecordInput {
  sessionId: string | null;
  outcome: string;
  productType: string | null;
  productTypeSource: string | null;
  deviceType: string | null;
  /** Base64 screenshots, as the analyze route received them. */
  images: string[];
  rawAnswer: string | null;
  steps: Record<string, unknown>;
  ip: string | null;
  role: string | null;
}

/** Real visitors only: no sample screenshots, no self-testing, no monitors. */
export function shouldSaveAuditRecord({ role, isSample }: { role: string | null; isSample: boolean }): boolean {
  return !isSample && !NOT_SAVED_ROLES.has(role ?? '');
}

/** Keep one audit for review. Never throws: saving must not affect the visitor's audit. */
export async function saveAuditRecord(input: SaveAuditRecordInput): Promise<void> {
  try {
    await prisma.auditRecord.create({
      data: {
        sessionId: input.sessionId,
        outcome: input.outcome,
        productType: input.productType,
        productTypeSource: PRODUCT_TYPE_SOURCES.has(input.productTypeSource ?? '') ? input.productTypeSource : null,
        deviceType: input.deviceType,
        images: input.images.map((image) => Buffer.from(image, 'base64')),
        rawAnswer: input.rawAnswer,
        steps: input.steps as Prisma.InputJsonValue,
        ipHash: hashIp(input.ip),
        role: input.role && ROLE_SHAPE.test(input.role) ? input.role.toLowerCase() : null,
      },
    });
  } catch (err) {
    console.error('[AuditRecord] write failed:', err instanceof Error ? err.message : err);
  }
}

/** Visitors are told audits and ratings are kept for 30 days. Returns how many audits were deleted. */
export async function deleteExpiredAuditRecords(now: Date = new Date()): Promise<number> {
  const cutoff = new Date(now.getTime() - RETENTION_DAYS * 86_400_000);
  await prisma.uiEvent.deleteMany({ where: { name: 'audit_gap_rated', createdAt: { lt: cutoff } } });
  const { count } = await prisma.auditRecord.deleteMany({ where: { createdAt: { lt: cutoff } } });
  return count;
}

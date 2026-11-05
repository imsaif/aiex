import { deleteExpiredAuditRecords, saveAuditRecord, shouldSaveAuditRecord } from '../record';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: { auditRecord: { create: jest.fn(), deleteMany: jest.fn() } },
}));

const create = prisma.auditRecord.create as jest.Mock;
const deleteMany = prisma.auditRecord.deleteMany as jest.Mock;

const base = {
  sessionId: 'audit-1',
  outcome: 'success',
  productType: 'chat-interface',
  productTypeSource: 'auto',
  deviceType: 'desktop',
  images: [Buffer.from('hello').toString('base64')],
  rawAnswer: '{"topGaps":[]}',
  steps: { stopReason: 'end_turn' },
  ip: '1.2.3.4',
  role: null,
};

beforeEach(() => {
  create.mockReset();
  deleteMany.mockReset();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => jest.restoreAllMocks());

describe('shouldSaveAuditRecord', () => {
  it('saves a real visitor', () => {
    expect(shouldSaveAuditRecord({ role: null, isSample: false })).toBe(true);
  });

  it('skips sample runs', () => {
    expect(shouldSaveAuditRecord({ role: null, isSample: true })).toBe(false);
  });

  it.each(['admin', 'test', 'monitor'])('skips the %s role', (role) => {
    expect(shouldSaveAuditRecord({ role, isSample: false })).toBe(false);
  });
});

describe('saveAuditRecord', () => {
  it('never throws when the database fails', async () => {
    create.mockRejectedValue(new Error('database down'));
    await expect(saveAuditRecord(base)).resolves.toBeUndefined();
  });

  it('stores screenshots as bytes and a hashed IP, never the raw IP', async () => {
    create.mockResolvedValue({});
    await saveAuditRecord(base);
    const { data } = create.mock.calls[0][0];
    expect(Buffer.from(data.images[0]).toString()).toBe('hello');
    expect(data.ipHash).toBeTruthy();
    expect(JSON.stringify(data)).not.toContain('1.2.3.4');
    expect(data).not.toHaveProperty('ip');
  });

  it.each(['no_ai_surface', 'parse_error'])('keeps the raw answer for a %s run', async (outcome) => {
    create.mockResolvedValue({});
    await saveAuditRecord({ ...base, outcome, rawAnswer: 'not json' });
    const { data } = create.mock.calls[0][0];
    expect(data.outcome).toBe(outcome);
    expect(data.rawAnswer).toBe('not json');
  });
});

describe('deleteExpiredAuditRecords', () => {
  it('deletes only records older than 30 days', async () => {
    deleteMany.mockResolvedValue({ count: 2 });
    const now = new Date('2026-11-05T00:00:00Z');
    await expect(deleteExpiredAuditRecords(now)).resolves.toBe(2);
    const cutoff: Date = deleteMany.mock.calls[0][0].where.createdAt.lt;
    expect(cutoff.toISOString()).toBe('2026-10-06T00:00:00.000Z');
    const twentyNineDaysOld = new Date('2026-10-07T00:00:00Z');
    expect(twentyNineDaysOld > cutoff).toBe(true);
  });
});

import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';

/**
 * Local-only tracing for the audit flow: one JSON file per run, listing what
 * each step received and produced, so a bad audit can be traced to its source.
 *
 * Off unless AUDIT_TRACE_DIR is set, and never on Vercel, so visitors'
 * screenshots and answers are not recorded. A run is traced only when the
 * request also names itself with the x-audit-trace-label header. Screenshots
 * are never written: steps record their size, not their contents.
 */
export function auditTraceLabel(request: Request): string | null {
  if (!process.env.AUDIT_TRACE_DIR || process.env.VERCEL) return null;
  const label = request.headers.get('x-audit-trace-label');
  if (!label) return null;
  return label.replace(/[^a-zA-Z0-9._-]/g, '_') || null;
}

/** Add one step to the run's file. Tracing must never break an audit. */
export function auditTraceStep(label: string | null, step: string, data: Record<string, unknown>): void {
  const dir = process.env.AUDIT_TRACE_DIR;
  if (!label || !dir) return;
  try {
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${label}.json`);
    const trace = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { label, steps: [] };
    trace.steps.push({ step, at: new Date().toISOString(), ...data });
    fs.writeFileSync(file, JSON.stringify(trace, null, 2));
  } catch (err) {
    console.error('[audit trace] could not write step:', step, err);
  }
}

/** A short fingerprint, so two runs can be checked for using the same prompt. */
export function promptFingerprint(text: string): string {
  return createHash('sha256').update(text).digest('hex').slice(0, 12);
}

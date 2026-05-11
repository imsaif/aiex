import { ClaudeAnalysisResponseSchema, type ClaudeAnalysisResponse } from '@/types/audit';

export type ParseAnalysisResult =
  | { ok: true; data: ClaudeAnalysisResponse }
  | { ok: false; reason: 'no-json' | 'invalid-json' | 'schema-mismatch'; detail: string; raw: string };

/**
 * Extract the first plausible JSON object substring from a Claude response.
 *
 * Claude wraps strict-JSON responses inconsistently — sometimes as a bare
 * object, sometimes inside ```json fences, sometimes with prose preamble like
 * "Here is the analysis:". We strip fences first, then locate the outermost
 * balanced `{...}` block via brace counting (regex `\{[\s\S]*\}` was greedy
 * and would happily match across multiple top-level objects).
 */
export function extractJsonObject(text: string): string | null {
  if (!text) return null;

  // Drop ```json fences if present
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const haystack = fence ? fence[1] : text;

  const start = haystack.indexOf('{');
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < haystack.length; i++) {
    const ch = haystack[i];

    if (escape) {
      escape = false;
      continue;
    }
    if (ch === '\\' && inString) {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;

    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        return haystack.slice(start, i + 1);
      }
    }
  }

  // Unbalanced — return what we have so caller can decide
  return null;
}

/**
 * Parse and validate a Claude analyze response. Never throws.
 *
 * Returns a typed Result. Callers should treat `ok: false` as a 502 from the
 * upstream model and either retry or surface a "couldn't parse the analysis"
 * error to the user — NOT silently swallow it.
 */
export function parseAnalysisResponse(text: string): ParseAnalysisResult {
  const raw = text ?? '';
  const candidate = extractJsonObject(raw);
  if (!candidate) {
    return { ok: false, reason: 'no-json', detail: 'No JSON object found in response', raw };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(candidate);
  } catch (err) {
    return {
      ok: false,
      reason: 'invalid-json',
      detail: err instanceof Error ? err.message : 'JSON.parse threw',
      raw,
    };
  }

  const result = ClaudeAnalysisResponseSchema.safeParse(parsed);
  if (!result.success) {
    return {
      ok: false,
      reason: 'schema-mismatch',
      detail: result.error.issues
        .slice(0, 5)
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; '),
      raw,
    };
  }

  return { ok: true, data: result.data };
}

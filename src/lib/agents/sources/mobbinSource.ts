import type { ScreenshotCandidate, ScreenshotSource } from './screenshotSource';

/**
 * Mobbin doesn't publish a public MCP server or screenshot API today.
 * This stub satisfies the ScreenshotSource interface so the orchestrator
 * can iterate over all sources uniformly; when/if Mobbin exposes an API
 * (or a private MCP is wired in), implement fetch() here.
 *
 * Until then, set MOBBIN_API_KEY env to enable; otherwise the source stays disabled
 * and the orchestrator skips it.
 */
export const mobbinSource: ScreenshotSource = {
  name: 'mobbinSource',

  enabled(): boolean {
    return Boolean(process.env.MOBBIN_API_KEY);
  },

  async fetch(): Promise<ScreenshotCandidate[]> {
    console.log('[mobbinSource] stub — no Mobbin API integration available');
    return [];
  },

  async acknowledge(): Promise<void> {
    // no-op
  },
};

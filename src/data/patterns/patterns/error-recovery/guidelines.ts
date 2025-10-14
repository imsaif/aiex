export const guidelines: string[] = [
  "Use plain-language error messages that explain what happened (e.g., 'We're at capacity' not 'Error 503').",
  "Always show that user work is saved to reduce anxiety.",
  "Offer 2-3 clear recovery options: retry, wait in queue, or use offline/basic mode.",
  "Use warm colors (amber/yellow) for capacity issues, not harsh red.",
  "Provide graceful degradation - basic features that work when AI services fail.",
  "Preserve user context across errors - don't lose their input or workflow state."
];

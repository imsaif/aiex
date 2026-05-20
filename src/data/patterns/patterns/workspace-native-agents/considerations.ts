export const considerations: string[] = [
  "Deep integration requires access to the host application's plugin or extension API—assess API maturity and stability before committing to native embedding.",
  "Workspace-native agents must handle the host app's performance budget; a slow agent response that blocks the UI is worse than a separate panel.",
  "Undo/redo integration is technically complex in many frameworks; plan for this early or users will distrust agent edits.",
  "Agent outputs that modify the workspace state need clear provenance markers so users can distinguish AI-generated content from their own work.",
  "Multi-user or collaborative workspaces require careful handling of agent actions—who 'owns' an AI edit in a shared document?",
  "Plugin/extension sandboxing may limit what context the agent can access; design graceful degradation when full workspace context isn't available.",
  "Versioning and update cycles of the host application can break native integrations; build against stable, documented extension points."
];

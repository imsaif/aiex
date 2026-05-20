export const guidelines: string[] = [
  "Anchor agent entry points to existing workspace affordances—command palettes, right-click menus, toolbar slots—rather than introducing new navigation destinations.",
  "Give the agent read and write access to the workspace's native data model so outputs are immediately applied, not just suggested in a separate panel.",
  "Surface agent controls at the layer of abstraction the user is already working at: file-level for project tasks, selection-level for targeted edits, cursor-level for inline completions.",
  "Preserve workspace undo/redo semantics for all agent actions so users can treat AI outputs like any other edit.",
  "Use the workspace's own visual language for agent UI—match icon style, panel conventions, and interaction patterns to the host application.",
  "Provide a clear, low-friction way to dismiss or ignore agent suggestions without disrupting the primary workflow.",
  "Scope agent context to what's visible or selected in the workspace before expanding to broader project context, to keep responses relevant and fast."
];

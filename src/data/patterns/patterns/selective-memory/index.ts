import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const selectivememory: Pattern = {
  id: "selective-memory",
  title: "Selective Memory",
  slug: "selective-memory",
  status: 'implemented',
  description: "Control what AI remembers, forgets, or ignores with transparent settings.",
  category: "Privacy & Control",
  tags: ["memory", "control", "privacy", "context", "personalization", "user control"],
  thumbnail: "/api/og/patterns?slug=selective-memory",
  introduction: "Selective Memory gives users explicit control over what AI remembers, forgets, or ignores. Instead of opaque memory, the system provides transparent controls to view, edit, or delete stored information. It's essential for personal assistants, conversational systems, or tools building context over time. Examples include ChatGPT's memory settings for viewing and deleting memories, Google Assistant's activity controls, or Replika marking conversations as temporary.",
  datePublished: "2024-01-15",
  dateModified: "2025-11-18",
  content: {
    problem: "AI systems remember information without user visibility or control, risking privacy issues and inappropriate responses based on outdated or sensitive context.",
    solution: "Provide transparent memory controls letting users view, categorize (important/temporary/forget), and understand how stored information influences AI responses.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Privacy-First Design",
      "Context Switching",
      "Explainable AI"
    ],
    codeExamples,
    figmaPrompt: {
      prompt: `Design a memory management interface for an AI assistant that gives users explicit control over what the AI remembers. Create a settings screen or modal with these key elements:

**Memory Dashboard:**
- A searchable list/grid showing all stored memories with timestamps and context
- Each memory card displays: the information stored, when it was learned, how many times it's been referenced, and memory category
- Visual indicators for memory types: important (green), temporary (yellow), forgotten/ignored (gray)

**Memory Controls:**
- Individual memory actions: Edit, Categorize, Delete with confirmation
- Bulk actions: Select multiple memories to categorize or delete at once
- Quick filters: Show all/important/temporary memories
- "Clear All" option with a serious warning dialog

**Memory Categories:**
- Toggle switches or buttons to categorize each memory:
  • "Remember Always" (important) - green checkmark icon
  • "Temporary" (auto-delete after X days) - clock icon with countdown
  • "Forget This" - trash icon with confirmation
- Visual badge system showing memory category at a glance

**Transparency Features:**
- "How This Affects AI" tooltip showing how specific memories influence responses
- Usage counter showing how often each memory has been referenced
- Auto-memory indicator showing which memories were automatically captured vs user-added

**Empty States:**
- Helpful illustration when no memories exist
- Clear explanation of how memory collection works
- CTA to enable memory features if disabled

Use a privacy-focused design with clear iconography, gentle colors (greens for important, yellows for temporary, reds for delete), and obvious confirmation dialogs for destructive actions. Prioritize transparency and user control.`,
      tips: [
        "Add privacy indicators showing whether memories are stored locally vs cloud",
        "Include memory export/download feature for portability",
        "Show memory timeline visualization to see memory growth over time",
        "Add auto-expiry settings for temporary memories (1 day, 1 week, 1 month)",
        "Include memory search with filters by date, category, or topic",
        "Add undo/restore recently deleted memories feature (7-day retention)"
      ]
    }
  }
};

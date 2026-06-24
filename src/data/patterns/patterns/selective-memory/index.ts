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
  hideFAQ: true,
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
    },
    judgmentCall: {
      explainWhen: [
        "The product accumulates personal context over time (assistants, companions, long-running chats) and stale or wrong facts will degrade answers. Memory needs an off switch the user can reach.",
        "What the AI retains is sensitive or identity-shaping: health, relationships, finances, past mistakes. The user has a legitimate need to see it and revise it.",
        "Memory is the feature, not a side effect. If personalization is your pitch, you owe the user a window into what you kept and a lever to change it."
      ],
      dontWhen: [
        "Nothing persists between sessions. Bolting a 'Memory' panel onto a stateless tool invents a control for data that does not exist and implies retention you are not doing.",
        "The only thing you can offer is hide-from-view. If delete cannot reach the embeddings, the fine-tune, the logs, and the cache, do not ship a button that says 'Forget.' Say 'Hide' and mean it.",
        "You are hoarding everything and calling the dashboard 'control.' Remembering every trivia detail while missing the two preferences that matter is not selective memory, it is a junk drawer with a search bar."
      ],
      trap: "The ghost memory: a 'Forget' or 'Delete' that only drops the item from the list while the fact still lives in the model's store, the retrieval index, or the system prompt, and keeps shaping every answer. The user watches the card slide away, believes the thing is gone, then gets a reply that could only come from what they just 'deleted.' This is worse than no forget button at all. A product with no delete is merely opaque, the user knows the AI remembers. A fake delete is a lie the user acted on: they disclosed the secret, hit Forget, trusted it, and you kept it. The betrayal is not that you remembered, it is that you told them you didn't."
    },
    installPrompt: `You are implementing the Selective Memory design pattern in this codebase.

The pattern in one line: let the user see what the AI kept, decide what stays, and trust that "forget" actually forgets.

Apply the following moves wherever this codebase persists user context that feeds back into AI output (memory stores, embedding indexes, fine-tune corpora, retrieval caches, long-lived system prompts). DO NOT add a memory panel to stateless surfaces that retain nothing between sessions; a control for data you don't store implies retention you aren't doing and erodes trust.

1. Make "forget" reach every copy, or rename the button.
   Trace each piece of remembered context to ALL the places it lives: primary DB, vector index, cache, prompt assembly, analytics/logs. A delete action must purge or tombstone every one. If any copy is out of reach, the button must say "Hide," not "Forget," and the UI must state the fact still exists. Never ship a Forget that only hides from the list.

2. Show the user what you actually kept.
   Build a memory view that lists stored facts in plain language with when each was captured and whether the user added it or the system inferred it. No silent inference. If the AI decided to remember something, it appears here.

3. Remember what matters, not everything.
   Memory is a budget, not a tape recorder. Rank what you retain by whether it changes future answers (stated preferences, constraints, corrections) over trivia. Give the user a way to pin the load-bearing facts and let the rest expire. A full junk drawer is not personalization.

4. Make memory's influence legible at the point of use.
   When an answer leans on a stored memory, surface which one, with a one-click "this is wrong, forget it" that runs move 1's real delete. Closing that loop is what turns a settings page into actual control.

The trap to avoid: the ghost memory. A Forget button that only hides the card while the fact keeps steering outputs is a lie the user acted on. If you cannot delete it everywhere, do not call it Forget.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which of the four moves you applied at each
- Surfaces flagged but not updated: file path + why (e.g. stateless surface, delete can't reach a copy yet, inferred-memory source not yet surfaced)
- New endpoints / data flows you added (e.g. cascade-delete across the vector index, a "forget" tombstone, an inferred-memory audit list) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "If 'forget' doesn't delete everywhere, don't call it forget.",
        body: "A delete that drops the card but leaves the fact in the embeddings, the cache, or the system prompt is the worst outcome in this pattern: the user disclosed something, trusted the button, and you kept it. No delete is merely opaque. A fake delete is a betrayal the user acted on. Either purge every copy or label it 'Hide' and say so."
      },
      {
        heading: "Show what you actually kept, including what you inferred.",
        body: "Selective memory starts with a window, not a switch. List stored facts in plain language, when each was captured, and whether the user added it or the system guessed it. Silent inference is the thing users find creepy. If the AI decided to remember it, it belongs on the screen."
      },
      {
        heading: "Remember what matters, not everything.",
        body: "Hoarding every trivia detail while missing the two preferences that actually change answers is not control, it's a junk drawer with a search bar. Treat memory as a budget. Rank by what steers future output: stated preferences, constraints, corrections. Let the trivia expire."
      },
      {
        heading: "Make memory's influence visible at the moment it acts.",
        body: "A settings page buried three menus deep is not control. When an answer leans on a stored memory, show which one, right there, with a one-click 'this is wrong, forget it.' Control the user can reach mid-conversation beats a dashboard they have to go hunting for."
      },
      {
        heading: "Forgetting is a feature, not a failure.",
        body: "Teams treat deletion as data loss to be discouraged with friction and 'are you sure' walls. In a memory product the opposite is true: a clean, trusted forget is what makes users comfortable telling the AI anything in the first place. The off switch is what sells the on switch."
      }
    ]
  }
};

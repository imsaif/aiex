import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const safeexploration: Pattern = {
  id: "safe-exploration",
  title: "Safe Exploration",
  slug: "safe-exploration",
  status: 'implemented',
  description: "Provide sandbox environments for experimenting with AI without risk.",
  category: "Trustworthy & Reliable AI",
  thumbnail: "/images/examples/huggingface-models.gif",
  introduction: "Safe Exploration provides controlled sandbox environments where users can experiment with AI without fear of mistakes. Instead of learning in production, the system offers clear boundaries between testing and real operations with easy undo. It's critical for creative tools, code generation, or systems where mistakes could be costly. Examples include Hugging Face Spaces for testing models, Figma's AI playground, or GitHub Copilot's preview mode.",
  datePublished: "2024-10-21",
  dateModified: "2026-09-07",
  hideFAQ: true,
  content: {
    skillDescription:
      "Use when users fear breaking something by trying the AI: sandbox or preview modes, 'let them experiment without consequences', undo-everything trials, test environments. Safe Exploration makes trying risk-free.",
    problem: "Users want to experiment with AI capabilities but fear mistakes or unintended consequences.",
    solution: "Provide safe, controlled environments for exploring AI features with sandboxing, undo mechanisms, and clear safe/production boundaries.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Contextual Assistance",
      "Progressive Disclosure",
      "Human-in-the-Loop"
    ],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "The action is expensive, public, or irreversible: sending to customers, spending money, writing to production data, publishing.",
        "The user cannot predict what the AI will do, so refusing to try is the rational choice and adoption stalls there.",
        "The cost of learning by doing is paid by someone other than the person experimenting."
      ],
      dontWhen: [
        "Undo already covers it. A sandbox on top of working undo is a second place to learn the same thing, and users have to be taught which one they are in.",
        "The sandbox cannot be made faithful. A safe space that behaves differently from production teaches the wrong lesson confidently.",
        "The real risk is the user misunderstanding the output, not the action. That needs explanation, not a playground."
      ],
      trap: "The unfaithful sandbox: a practice mode running smaller models, stale data, or relaxed limits, so everything works there and breaks in production. Users leave it more confident and less correct than when they went in, and they blame themselves for the gap."
    },
    installPrompt: `You are implementing the Safe Exploration design pattern in this codebase.

The pattern in one line: let people try the AI on real conditions without paying real consequences.

Apply the following four moves to every surface where an AI action is expensive, public, or irreversible (sends, purchases, publishes, writes to production data, bulk edits). DO NOT apply to surfaces already covered by working undo. A sandbox layered on top of undo is redundant and forces users to track which mode they are in.

1. Find the irreversible actions first.
   Enumerate every AI-triggered action in the codebase that spends money, contacts a third party, or mutates production state. Output that list before writing any code. Sandbox those and nothing else.

2. Keep the sandbox faithful, or say it is not.
   The sandbox must call the same model, the same prompt version, and the same rate limits as production. Only the final side effect is stubbed. If any of those must differ, render a visible notice at the top of the sandbox naming exactly what differs. Never silently downgrade the model in practice mode.

3. Make the boundary impossible to misread.
   Sandbox state must be visible without scrolling and must persist across navigation within the session. Use a persistent banner or frame, not a badge that scrolls away. The control that exits the sandbox must be distinct from the control that performs the real action.

4. Carry the work across.
   When a user is satisfied with a sandbox result, offer a single action that promotes that exact input to the real run. If the work cannot be carried across, the sandbox is a demo and users will not use it twice.

The trap to avoid: the unfaithful sandbox. Practice mode on a smaller model, stale data, or relaxed limits. Everything works there and breaks in production, and the user blames themselves.

When you're done, output a Markdown report with three sections:
- Irreversible actions found: file path + whether it is now sandboxed
- Fidelity gaps: anything that differs between sandbox and production, and the notice you added for it
- Promote-to-real paths added, and anything that still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Sandbox the irreversible, not the unfamiliar.",
        body: "The test is not whether a feature is new or confusing. It is whether the action can be taken back. If undo already covers it, adding a practice mode gives users a second thing to learn and a mode they can be lost in."
      },
      {
        heading: "A sandbox that differs from production is worse than none.",
        body: "Run the same model, the same prompt, the same limits. Stub only the final side effect. The moment practice mode is cheaper to run than the real thing, it starts teaching a version of your product that does not exist."
      },
      {
        heading: "Name the difference you could not remove.",
        body: "Some gaps are unavoidable: no real customer data, no live inventory. Say so in the sandbox, in a sentence, where the user is working. An unstated gap is the one that surprises them later."
      },
      {
        heading: "Make the boundary a place, not a badge.",
        body: "Users do not read status chips. Frame the whole surface, keep it visible without scrolling, and make the exit control look nothing like the button that does the real thing. Every mode error in a sandbox is a design failure, not a user error."
      },
      {
        heading: "Let the work leave the sandbox.",
        body: "If a good result has to be recreated by hand in production, people stop practising and go straight to the real thing. One button that promotes the exact input to a real run is what turns a demo into a habit."
      }
    ]
  }
};

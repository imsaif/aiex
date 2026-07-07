import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const augmentedcreation: Pattern = {
  id: "augmented-creation",
  title: "Augmented Creation",
  slug: "augmented-creation",
  description: "Empower users to create content with AI as a collaborative partner.",
  category: "Human-AI Collaboration",
  thumbnail: "/images/examples/github-copilot-highlighting.gif",
  introduction: "Augmented Creation is an AI design pattern where AI acts as a collaborative partner during content creation, offering suggestions and improvements while you maintain full control and authorship. Instead of AI generating everything from scratch, it enhances your creative process by suggesting alternatives, completing patterns, and refining ideas as you work. It's ideal for writers facing creative blocks, designers exploring variations, developers writing code, or any creator who wants AI assistance without losing their unique voice. Examples include GitHub Copilot suggesting code completions, Midjourney helping iterate on art concepts, or writing tools like Jasper offering alternative phrasings while you craft the narrative.",
  datePublished: "2024-01-15",
  dateModified: "2026-07-07",
  hideFAQ: true,
  content: {
    problem: "Content creation is time-consuming, especially with creative blocks or need for high-quality output.",
    solution: "Provide AI tools that collaborate with users, offering suggestions and improvements while maintaining human control and authorship.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Contextual Assistance",
      "Progressive Disclosure",
      "Human-in-the-Loop"
    ],
    codeExamples,
    figmaPrompt: {
      prompt: `Design an AI-powered creation interface where AI assists without taking over:

Create a content editor showing:
1. **Creation Canvas**: Main workspace for user content (text, design, code)
2. **AI Suggestions Panel**: Side panel with AI-generated alternatives or improvements
3. **Accept/Modify Controls**: Easy buttons to accept, edit, or dismiss AI suggestions
4. **Collaboration Indicator**: Visual distinction between human-created and AI-suggested content
5. **Inspiration Mode**: Toggle for AI to generate multiple creative options

Show the workflow: User creates → AI suggests improvements → User chooses → Final output. Include clear attribution showing what's AI-assisted vs. human-created.`,
      tips: [
        "Keep AI suggestions non-intrusive (side panel)",
        "Provide multiple suggestion options",
        "Make accept/reject actions one-click",
        "Show clear attribution for AI contributions",
        "Allow users to easily iterate on AI suggestions"
      ]
    },
    judgmentCall: {
      explainWhen: [
        "The user already has intent and a voice, and wants leverage, not authorship. The AI clears friction (the blank page, the boilerplate, the tenth variation) so the person spends their energy on the parts only they can do.",
        "The work rewards exploration: many drafts, alternatives, and what-ifs, where a fast partner widens the option space and the human picks the direction.",
        "Control and attribution stay with the person. Every suggestion is opt-in, editable, and clearly marked, so they can always tell (and prove) which parts are theirs."
      ],
      dontWhen: [
        "The user has no point of view yet. Handing a blank-slate user a finished draft doesn't augment their idea, it substitutes the model's, and they ship something they can't defend.",
        "The output carries the human's name and accountability but the AI did the thinking. That isn't collaboration, it's ghostwriting, and it breaks the moment someone asks a follow-up question.",
        "The value of the work IS the human doing it: learning the craft, a personal voice, a judgment call only they can be accountable for. Augment that away and you hollow out the thing you were building."
      ],
      trap: "The ghostwriter: the tool quietly crosses from suggesting in your voice to drafting in its own, and you slide from author to approver. It feels productive because pages appear and you click accept, but you're rubber-stamping a stranger's copy under your name, picking what's 'good enough' instead of what you meant. Every draft converges on the same flavorless median everyone else's tool produces. It is worse than writing it slowly yourself: you lose the voice you set out to augment, and the judgment to notice it's gone."
    },
    installPrompt: `You are implementing the Augmented Creation design pattern in this codebase.

The pattern in one line: make the AI a partner that widens the user's options and clears friction, while the human keeps authorship, voice, and the final call.

Apply the following moves at every creation surface where the AI contributes to user content (editor, canvas, code, design). DO NOT turn these surfaces into one-click full-draft generators that reduce the human to an approver, and DO NOT auto-apply model output into the user's work.

1. Suggest, never autocommit.
   Every AI contribution enters as an opt-in suggestion the user accepts, edits, or dismisses. Nothing writes itself into the user's document without an explicit accept. If a surface auto-applies model output today, flag it instead of shipping it.

2. Offer alternatives, not a single answer.
   Where the AI proposes content, return 2 to 3 distinct options rather than one, so the user chooses a direction instead of ratifying the model's. Cap the count so it stays a choice, not a wall of text.

3. Keep attribution visible and durable.
   Visually distinguish AI-suggested from human-authored content, and preserve that provenance in the document model (a flag per span or block), so the user can always tell and prove what is theirs. Do not strip provenance on accept.

4. Make accept, edit, and reject symmetric.
   Rejecting must be as cheap as accepting: one move each. If accept is one click and dismiss is buried, you have built a nudge toward the model's output, not a genuine choice.

5. Preserve the blank-slate escape.
   On any surface that can generate a full draft, keep a path for the user to start from their own words first. Never make model-first the only way in.

The trap to avoid: the ghostwriter. When the tool drafts in its own voice and the user only approves, you have replaced the author, not augmented them. If a surface produces finished output the human merely ratifies, that is the smell.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which of the five moves you applied at each
- Surfaces flagged but not updated: file path + why (e.g. auto-applies output, no blank-slate path, single-answer generation)
- New affordances you added (provenance flags, alternative-option UI, symmetric reject controls) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Augment the friction, not the thinking.",
        body: "The parts worth handing off are the ones that drain energy without expressing you: the blank page, the boilerplate, the tenth variation. The point of view, the taste, the final call stay yours. If the AI is doing the deciding, it isn't augmenting you, it's replacing you."
      },
      {
        heading: "Suggest, don't autocomplete the intent away.",
        body: "A suggestion the user opts into keeps them the author. A finished draft that appears before they've formed a thought anchors them to the model's idea, and they'll spend more effort escaping it than they ever saved. Offer options, don't pre-commit the direction."
      },
      {
        heading: "Keep the human's hand visible.",
        body: "Mark what's AI-suggested versus human-made, and make accept, edit, and reject one move each. When the user can always tell (and show) what's theirs, they stay accountable for it, which is the entire reason to keep them the author."
      },
      {
        heading: "Widen the option space, then get out of the way.",
        body: "The best augmentation hands you three directions you wouldn't have reached alone and lets you pick. Not one polished answer you're nudged to accept. Divergence is the gift the AI gives; convergence is the user's job to keep."
      },
      {
        heading: "Protect the skill you're augmenting.",
        body: "If the tool does all of it, the user's own ability rots, and so does their judgment about whether the output is any good. Leave enough of the work in human hands that they stay sharp enough to catch the AI when it's wrong."
      }
    ]
  }
};

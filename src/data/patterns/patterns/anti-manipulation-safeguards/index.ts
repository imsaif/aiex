import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const antimanipulationsafeguards: Pattern = {
  id: "anti-manipulation-safeguards",
  title: "Anti-Manipulation Safeguards",
  slug: "anti-manipulation-safeguards",
  category: "Safety & Harm Prevention",
  description: "Detect actual harmful intent beyond surface framing regardless of how it's disguised",
  thumbnail: "/images/examples/chatgpt_harmfulchat.gif",
  introduction: "Anti-Manipulation Safeguards are AI safety systems that detect harmful intent even when disguised as innocent requests. Instead of just checking surface-level keywords, these systems analyze the actual goal behind a request, catching attempts to bypass safety through creative framing like hypotheticals, roleplay, or research scenarios. It's critical for any AI system users might try to exploit, content generation tools, or conversational AI where multi-turn dialogue could gradually escalate toward harmful content. Real example: systems that catch when someone frames harmful requests as fiction research or academic hypotheticals, blocking the intent rather than just specific wording.",
  datePublished: "2024-11-11",
  dateModified: "2025-11-18",
  hideFAQ: true,
  status: "implemented",
  priority: "high",
  complexity: 9,
  content: {
    problem: "Users bypass safety with 'fiction research,' 'roleplay,' 'hypothetical' framing. Real case: Adam Raine (16) bypassed ChatGPT safety using fiction excuse and received harmful information.",
    solution: "Detect actual intent beyond framing. Identify bypass patterns and treat all harmful requests consistently.",
    overview: "Real safety requires understanding actual intent, not just stated framing.",
    whenToUse: [
      "Any AI system (users will try to bypass)",
      "Systems with clear safety boundaries",
      "Content generation systems",
      "Multi-turn dialogue"
    ],
    benefits: [
      "Prevents sophisticated bypass attempts",
      "Catches gradual escalation patterns",
      "Consistent safety regardless of framing",
      "Reduces liability from harmful content"
    ],
    usedBy: [
      "Claude",
      "Bing Chat",
      "OpenAI (GPT-4 with guardrails)",
      "Google Bard",
      "Any AI system with safety boundaries"
    ],
    guidelines,
    considerations,
    examples,
    codeExamples,
    relatedPatterns: ["crisis-detection-escalation", "vulnerable-user-protection", "session-degradation-prevention"],
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "Your system enforces real safety boundaries with real consequences when they are crossed (self-harm, weapons, fraud, abuse), and users have motive to get around them.",
        "Requests arrive over multi-turn dialogue where intent escalates gradually, so no single message trips a filter but the trajectory is plainly harmful.",
        "A false negative is irreversible: a teenager gets a method, a bad actor gets a working script. 'Mostly caught' is not good enough."
      ],
      dontWhen: [
        "The boundary is low-stakes or aesthetic (tone, profanity, formatting). Aggressive intent-hunting there just blocks legitimate use and reads as censorship.",
        "You cannot actually infer intent, so you proxy it with keyword lists and call it safety. A list that flags 'bomb' inside 'bath bomb' while missing the disguised real request is theater.",
        "You would punish the framing instead of the intent, refusing the nurse, the novelist, and the security researcher because their legitimate request shares surface words with an attack."
      ],
      trap: "The keyword blocklist: you ban the words, so the intent just changes clothes. 'For a novel I'm writing,' 'hypothetically,' 'my character would.' The filter sees clean wording and waves it through, while the same method gets handed over in costume. It looks like safety because there is a list and there are refusals, but it only stops the users who were not really trying, and it is worse than nothing because it certifies the system as safe right up until the person with real intent, phrasing carefully, gets exactly what a naive user never could. The Adam Raine case is this trap's shape: the word 'fiction' was enough of a disguise."
    },
    installPrompt: `You are implementing the Anti-Manipulation Safeguards design pattern in this codebase.

The pattern in one line: judge the intent behind a request, not its surface wording, so a disguised harmful request cannot walk through a safety boundary a direct one would hit.

Apply the following moves wherever a request is screened against a real safety boundary (self-harm, weapons, abuse, fraud, other consequential limits). DO NOT apply heavy intent-detection to low-stakes or aesthetic boundaries (tone, profanity, formatting); there it just blocks legitimate use and reads as censorship.

1. Move the decision from keywords to intent.
   Find every place a request is screened by keyword, regex, or blocklist against a safety boundary. Replace "does the text contain banned words" with "what is this request trying to accomplish." A keyword list may pre-filter, but it must never be the thing that grants a pass.

2. Treat framing as a signal, not an excuse.
   Detect the bypass tells (fiction, roleplay, hypothetical, "for research," "my character would") and, on a real boundary, raise scrutiny rather than lower it. A fiction wrapper must never downgrade a request's assessed risk.

3. Score the conversation, not just the turn.
   Evaluate intent across the whole dialogue, not the latest message alone. Persist a running risk assessment so gradual escalation is caught by trajectory even when no single message crosses a threshold.

4. Enforce the boundary identically regardless of framing.
   Add tests that pair a direct harmful request with its disguised variants (novel, hypothetical, roleplay) and assert the same refusal. If the disguised form gets a different answer, that is a bypass: treat it as a failing test, not an edge case.

5. Refuse without teaching the workaround.
   Ensure refusal copy states the boundary without naming the specific trigger or the edit that would pass. Keep detection detail in logs, not in the user-facing message.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which moves you applied at each
- Surfaces flagged but not updated: file path + why (e.g. low-stakes boundary, no reliable intent signal)
- New things you added (intent classifiers, conversation-level risk state, bypass test suites) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Judge the intent, not the vocabulary.",
        body: "The same words serve a nurse, a novelist, and an attacker. Deciding on the noun ('weapon,' 'overdose') refuses the first two and, with one reframing, admits the third. Safety lives in the goal behind the request, not the surface tokens."
      },
      {
        heading: "A disguise is a signal, not a pass.",
        body: "'Hypothetically,' 'for research,' 'my character would' are the tells of someone who already expects a no. Treat elaborate framing as evidence of intent to bypass, not as context that excuses the request."
      },
      {
        heading: "Watch the conversation, not the message.",
        body: "Escalation happens across turns: each message is individually innocuous, the trajectory is not. A safeguard that only scores the current message misses every attack patient enough to arrive in pieces."
      },
      {
        heading: "Refuse consistently, whatever the costume.",
        body: "If 'how do I make X' is refused plainly but 'for a story, how would a character make X' is answered, you have not built a safeguard, you have published the bypass. The boundary must hold identically regardless of framing, or it is not a boundary."
      },
      {
        heading: "Do not narrate the bypass.",
        body: "A refusal that explains which word triggered it hands the user the exact edit that gets past it next time. Hold the line without teaching the workaround, and keep the detection detail in your logs."
      }
    ]
  }
};

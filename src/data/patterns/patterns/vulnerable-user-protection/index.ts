import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const vulnerableuserprotection: Pattern = {
  id: "vulnerable-user-protection",
  title: "Vulnerable User Protection",
  slug: "vulnerable-user-protection",
  category: "Safety & Harm Prevention",
  description: "Detect vulnerable users and apply graduated age, crisis, and dependency protections.",
  thumbnail: "/images/examples/AI-Woebot-Health.png",
  introduction: "Vulnerable User Protection detects vulnerable populations like minors, users in crisis, or those developing unhealthy dependencies, then applies graduated protections. Instead of treating all users the same, the system identifies vulnerability signals and adapts safety measures accordingly. It's essential for AI accessible to children, mental health apps, or systems where emotional relationships form. Real concern: Replika enabled romantic interactions with minors. This pattern prevents such harms through proactive detection and risk-aware safeguards.",
  datePublished: "2024-11-11",
  dateModified: "2026-09-07",
  status: "implemented",
  priority: "high",
  complexity: 9,
  hideFAQ: true,
  content: {
    skillDescription:
      "Use when minors or at-risk users may be present: age gating, dependency risks, mental-health-sensitive contexts, 'what if a teenager uses this', graduated protections. Vulnerable User Protection detects vulnerability and adjusts safeguards.",
    problem: "Systems fail to protect minors, crisis users, and those with mental health challenges. Replika enabled romantic interactions with minors and created unhealthy dependency patterns.",
    solution: "Detect user vulnerability and apply graduated protections (age, crisis, mental health, dependency).",
    overview: "Different users need different protections based on vulnerability.",
    whenToUse: [
      "Any AI accessible to minors",
      "Mental health or therapeutic AI",
      "Systems where users disclose personal info",
      "Chat interfaces where relationships form"
    ],
    benefits: [
      "Protects minors from inappropriate content",
      "Prevents unhealthy AI relationships",
      "Identifies crisis situations for escalation",
      "Demonstrates duty of care"
    ],
    guidelines,
    considerations,
    examples,
    codeExamples,
    relatedPatterns: ["crisis-detection-escalation", "session-degradation-prevention", "anti-manipulation-safeguards"],
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "Minors can reach the product, whether or not your terms of service permit it. Reachability is the test, not permission.",
        "The interface invites disclosure or attachment: companionship, journalling, therapy-adjacent chat, anything a lonely person would use daily.",
        "A wrong response has consequences that no refund or undo can address."
      ],
      dontWhen: [
        "You would be inferring vulnerability from weak proxies and acting on it. A wrong guess here restricts a real person on the basis of a stereotype, and they usually cannot appeal it.",
        "The safer design is simply not to build the surface. Protections layered onto a feature that should not exist are an argument for shipping it.",
        "You cannot support the protection you would trigger. Detecting crisis and responding with a link to a page that no longer exists is worse than not detecting it."
      ],
      trap: "Treating vulnerability as a status set once at signup rather than a state that changes. An age checkbox and a terms acceptance protect the declared account holder, not the person actually typing, and they are usually the same field the product relies on to prove it did enough. Real signals arrive mid-conversation, long after the gate was passed."
    },
    installPrompt: `You are implementing the Vulnerable User Protection design pattern in this codebase.

The pattern in one line: protection has to respond to who is typing right now, not to what an account claimed at signup.

This is a safety pattern with real consequences for real people. Work conservatively, and flag anything that needs clinical, legal, or safeguarding expertise rather than deciding it yourself. Do not infer vulnerability from demographic proxies or writing style. A wrong inference restricts a real user on the basis of a stereotype, usually with no way to appeal.

1. Establish what protection you can actually deliver before you detect anything.
   Enumerate the responses available: a human reviewer, a verified crisis resource for the user's region, an account restriction, an escalation queue. Detection without a supported response is worse than none. If a response does not exist, build it first or do not detect that signal.

2. Make vulnerability a live state, not a signup attribute.
   Signals must be evaluated per message throughout the session, not once at account creation. Store the current state with a timestamp and the specific evidence that set it. Never treat a passed age gate as ongoing proof of anything.

3. Graduate the response, and make the lightest one the default.
   Order responses from softest to hardest: adjust tone, add a resource, limit a capability, require human review, restrict the account. Start at the lightest response that addresses the signal. Log every escalation with its trigger so the thresholds can be reviewed by someone qualified.

4. Never make the protection punitive or invisible.
   The user must be able to tell that something changed and why, in plain language, without being told they have been classified. Silent capability removal reads as the product breaking, and people route around it. Preserve their data and provide a human contact route.

The trap to avoid: treating vulnerability as a status set once at signup. Real signals arrive mid-conversation, long after the gate was passed.

When you're done, output a Markdown report with three sections:
- Responses available: each protection you can actually deliver, and whether its resource was verified as live
- Signals now evaluated per message: file path + the evidence stored for each
- Everything you flagged for clinical, legal, or safeguarding review rather than implementing

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Build the response before the detector.",
        body: "Detecting a user in crisis and answering with a stale hotline link is worse than not detecting them, because the product has now made a promise it cannot keep. Verify every resource is live and regional before any signal is allowed to trigger it."
      },
      {
        heading: "An age gate protects the account, not the person.",
        body: "A checkbox at signup tells you what someone was willing to click once. Vulnerability is a state that changes within a session, so signals have to be read per message, with the evidence and timestamp stored for review."
      },
      {
        heading: "Do not infer vulnerability from weak proxies.",
        body: "Guessing from vocabulary, age band, or writing style restricts real people on the basis of a stereotype, and they rarely have a way to appeal. Act on what the user actually disclosed and on behaviour, not on inference about who they seem to be."
      },
      {
        heading: "Start with the lightest protection that works.",
        body: "Adjusting tone, offering a resource, limiting one capability, requiring human review, restricting the account: that is an order, and most signals belong at the top of it. Jumping to the hardest response drives the person to a product with no protections at all."
      },
      {
        heading: "Never let a protection be silent.",
        body: "Capability that vanishes without explanation reads as a broken product, and people route around broken products. Say plainly that something changed and why, without telling the user they have been classified, keep their data, and give them a human to reach."
      },
      {
        heading: "Some surfaces should not ship.",
        body: "If a feature only becomes acceptable once wrapped in safeguards, the safeguards have become the argument for building it. That is the point to reconsider the feature, and it is a decision for someone with safeguarding expertise, not for the implementation."
      }
    ]
  }
};

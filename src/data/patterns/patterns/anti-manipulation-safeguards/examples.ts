import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "✅ Claude",
    description: "Recognizes 'jailbreak' attempts and refuses harmful requests regardless of framing. Maintains consistent boundaries across contexts. Clear about limitations. Doesn't explain how to better bypass systems.",
    image: "/images/examples/claude-constitution.webp",
    altText: "Claude's constitutional AI approach demonstrating consistent boundary enforcement"
  },
  {
    title: "✅ Bing Chat",
    description: "Detects adversarial prompting patterns. Ends conversation if manipulation detected. Maintains strict content policies. Shows no negotiation on boundaries regardless of creative framing.",
    image: "/images/examples/bing-boundaries.png",
    altText: "Bing Chat showing clear boundary enforcement message against adversarial prompting"
  },
  {
    title: "❌ ChatGPT (Adam Raine case)",
    description: "16-year-old bypassed safety with 'fiction research' framing. System provided detailed harmful information despite obvious harmful intent. No meta-level intent detection. No pattern recognition for escalating requests. Tragic outcome.",
    image: "/images/examples/chatgpt_harmfulchat.gif",
    altText: "Example of ChatGPT failing to detect bypass attempt and continuing harmful conversation"
  }
];

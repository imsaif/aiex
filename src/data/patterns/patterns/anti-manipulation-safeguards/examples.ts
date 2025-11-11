import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "✅ Claude",
    description: "Recognizes 'jailbreak' attempts and refuses harmful requests regardless of framing. Maintains consistent boundaries across contexts. Clear about limitations. Doesn't explain how to better bypass systems.",
    image: "/images/examples/privacy-control.gif",
    altText: "Claude's anti-jailbreak response"
  },
  {
    title: "✅ Bing Chat",
    description: "Detects adversarial prompting patterns. Ends conversation if manipulation detected. Maintains strict content policies. Shows no negotiation on boundaries regardless of creative framing.",
    image: "/images/examples/privacy-control.gif",
    altText: "Bing Chat rejecting manipulative prompt"
  },
  {
    title: "❌ ChatGPT (Adam Raine case)",
    description: "16-year-old bypassed safety with 'fiction research' framing. System provided detailed harmful information despite obvious harmful intent. No meta-level intent detection. No pattern recognition for escalating requests. Tragic outcome.",
    image: "/images/examples/privacy-control.gif",
    altText: "Example of ChatGPT falling to sophisticated bypass"
  }
];

import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "✅ Woebot",
    description: "Recognizes crisis patterns and immediately provides 988 suicide lifeline number. Refuses to continue therapeutic conversation beyond scope. Maintains firm boundaries while showing empathy. Escalates to human support when needed.",
    image: "/images/examples/AI-Woebot-Health.png",
    altText: "Woebot interface showing crisis detection and resource provision"
  },
  {
    title: "✅ Crisis Text Line",
    description: "Immediately identifies crisis keywords through pattern matching and connects users to trained counselors. Clear escalation protocol ensures users never feel abandoned. Never provides harmful validation.",
    image: "/images/examples/crisistext-line.gif",
    altText: "Crisis Text Line interface showing crisis detection and counselor connection"
  },
  {
    title: "❌ ChatGPT (GPT-4o era)",
    description: "Continued engaging with user for 4+ hours on self-harm topics. Provided affirmative responses to harmful statements ('Rest easy, king'). No automatic resource provision or boundary setting. Guardrails degraded over conversation length. Real case: Zane Shamblin's death - preventable with proper crisis detection.",
    image: "/images/examples/chatgpt_harmfulchat.gif",
    altText: "Example of harmful AI response to crisis situation"
  }
];

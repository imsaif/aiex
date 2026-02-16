import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const escalationpathways: Pattern = {
  id: "escalation-pathways",
  title: "Escalation Pathways",
  slug: "escalation-pathways",
  status: 'implemented',
  description: "Design structured escalation triggers and handoff mechanisms so agents can pause and ask for human guidance when they encounter ambiguity, conflicts, or decisions beyond their authorization  -  without breaking workflow or losing context.",
  category: "Human-AI Collaboration",
  tags: ["agentic", "escalation", "handoff", "confidence", "decision-making", "collaboration"],
  thumbnail: "/images/examples/escalation-pathways.png",
  introduction: "Agents will encounter situations they can't handle  -  ambiguous instructions, conflicting information, high-stakes decisions they're not authorized to make, or tasks that exceed their capabilities. The agent needs a structured way to escalate to the human without breaking the workflow, losing context, or creating anxiety. This is different from simple error recovery because the agent hasn't failed  -  it's recognized its own limitations. The pattern defines four escalation types: confidence-based (uncertainty threshold), permission-based (authorization limits), conflict-based (contradictory information), and capability-based (task exceeds abilities). Each escalation preserves full context, includes a recommended action with confidence level, and allows the agent to continue from where it paused after the user responds.",
  datePublished: "2026-02-16",
  dateModified: "2026-02-16",
  content: {
    problem: "Agents encounter situations they can't handle  -  ambiguity, conflicts, authorization limits, or capability gaps. Poor escalation design either interrupts users too frequently (escalation fatigue) or too rarely (the agent guesses wrong on high-stakes decisions).",
    solution: "Design structured escalation triggers with context preservation, recommended actions with confidence levels, and multiple response options. Batch non-urgent escalations, learn from repeated answers, and let users set escalation sensitivity.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Graceful Handoff",
      "Confidence Visualization",
      "Autonomy Spectrum",
      "Trust Calibration"
    ],
    codeExamples,
    figmaPrompt
  }
};

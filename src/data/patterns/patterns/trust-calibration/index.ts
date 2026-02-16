import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const trustcalibration: Pattern = {
  id: "trust-calibration",
  title: "Trust Calibration",
  slug: "trust-calibration",
  status: 'implemented',
  description: "Design a system that progressively builds appropriate trust through demonstrated competence  -  showing track records per domain, celebrating milestones, and adjusting oversight based on actual agent performance.",
  category: "Trustworthy & Reliable AI",
  tags: ["agentic", "trust", "calibration", "performance", "reliability", "progressive"],
  thumbnail: "/images/examples/trust-calibration.png",
  introduction: "Users either over-trust or under-trust AI agents. Over-trust leads to passive reliance on inaccurate outputs where users stop checking and mistakes compound. Under-trust means users micromanage every action, defeating the purpose of delegation. Trust calibration is the design challenge of aligning a user's perception of the agent's reliability with its actual performance over time. Unlike one-time confidence scores, this is a relationship that evolves  -  the agent earns more or less trust based on its track record with that specific user. The pattern starts agents supervised with high visibility, shows per-domain track records, proactively repairs trust after mistakes, and offers autonomy upgrades only when earned. Trust builds slowly and breaks quickly, and the design must account for this asymmetry.",
  datePublished: "2026-02-16",
  dateModified: "2026-02-16",
  content: {
    problem: "Users either over-trust or under-trust AI agents. Over-trust leads to missed errors; under-trust leads to micromanagement. Trust calibration aligns user perception of agent reliability with actual performance, but it evolves over time per domain.",
    solution: "Build appropriate trust through demonstrated competence: start supervised, show per-domain track records, celebrate milestones, proactively repair trust after errors, and only offer autonomy upgrades when performance warrants it.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Confidence Visualization",
      "Autonomy Spectrum",
      "Escalation Pathways",
      "Action Audit Trail"
    ],
    codeExamples,
    figmaPrompt
  }
};

export const guidelines: string[] = [
  "Never increase autonomy without asking. Even if the agent has been 100% accurate, the user should consciously opt into higher autonomy.",
  "Make the agent's confidence visible, not just its outputs. 'I'm very confident about this' vs. 'I'm guessing here' helps users calibrate their own trust.",
  "After errors, show corrective learning. 'I made an error with X. I've adjusted my approach  -  here's what I'll do differently.'",
  "Provide a trust dashboard for power users  -  accuracy by domain, error log, escalation history.",
  "Celebrate milestones: 'I've completed 100 tasks for you with 97% accuracy.' This reinforces appropriate trust.",
  "Calibrate trust per domain  -  an agent might be reliable for scheduling but unreliable for financial analysis.",
  "Design for trust asymmetry: trust builds slowly and breaks quickly. A single visible failure should trigger proportional, not total, trust reduction."
];

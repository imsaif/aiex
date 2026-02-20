import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "Microsoft Copilot - Context-Dependent Autonomy",
    description: "Copilot operates at different autonomy levels depending on context  -  suggesting text completions (Level 1), drafting full emails for review (Level 2), or auto-formatting documents (Level 3). Users experience different levels of AI independence without explicit configuration.",
    altText: "Microsoft Copilot showing different autonomy levels across email drafting and document formatting tasks"
  },
  {
    title: "GitHub Copilot Workspace - Plan-Review-Execute",
    description: "Lets developers review a plan of proposed code changes before the agent executes them, operating at Level 2 by default with the option to accept individual steps. Users can selectively approve or reject each planned change.",
    altText: "GitHub Copilot Workspace showing a plan of proposed code changes with accept and reject controls for each step"
  },
  {
    title: "Tesla Autopilot - Driving Mode Spectrum",
    description: "The autonomy spectrum is visible in driving modes  -  from lane-keeping assist (Level 1) to Navigate on Autopilot with auto-lane-changes (Level 3), each requiring different levels of driver engagement. Trust builds progressively as the system demonstrates competence.",
    altText: "Tesla Autopilot interface showing different driving autonomy modes from lane-keeping assist to full navigation"
  },
  {
    title: "Notion AI - Fixed Level 2 Autonomy",
    description: "Currently operates only at Level 2 (propose and confirm). The user always reviews before AI content is inserted. No option to increase autonomy for routine tasks, showing how some products choose a single fixed point on the spectrum.",
    altText: "Notion AI showing propose-and-confirm workflow where users review AI content before insertion"
  }
];

import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "Devin AI - Live Terminal Status View",
    description: "Shows a live terminal-style view of what the agent is doing in real-time  -  running tests, reading files, writing code  -  with the ability to zoom in on any step or zoom out to a high-level summary.",
    image: "/images/examples/agent-status-monitoring.png",
    altText: "Devin AI showing live terminal view with real-time agent activity and zoom controls for detail levels"
  },
  {
    title: "ChatGPT Deep Research - Research Progress Panel",
    description: "Shows a status panel with 'Researching...' and a live feed of sources being checked. Transitions smoothly to a summary when complete, keeping users informed without demanding attention.",
    image: "/images/examples/agent-status-monitoring-chatgpt.png",
    altText: "ChatGPT Deep Research showing progress panel with live source feed and completion summary"
  },
  {
    title: "Slack Workflow Builder - In-Channel Progress",
    description: "Automated workflows show a progress indicator in-channel, with results posted when complete. Failures trigger notifications, keeping status ambient until attention is needed.",
    image: "/images/examples/agent-status-monitoring-slack.png",
    altText: "Slack Workflow Builder showing in-channel progress indicator with completion notification"
  },
  {
    title: "macOS Shortcuts - Background Automation Banners",
    description: "Background automations show a brief notification banner when triggered and completed, without interrupting the user's current activity. Status is ambient by default and only surfaces when relevant.",
    image: "/images/examples/agent-status-monitoring-macos.png",
    altText: "macOS Shortcuts showing subtle notification banners for background automation progress"
  }
];

import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a privacy-first AI settings interface inspired by Apple's Privacy settings, Signal's privacy controls, and DuckDuckGo's privacy dashboard. Create a comprehensive privacy control panel showing: (1) Privacy mode toggle switches with clear on/off states and status indicators (enabled/disabled), (2) Privacy level badges showing 'High Privacy' (green), 'Medium Privacy' (amber), 'Low Privacy' (red) with visual impact, (3) Expandable sections for each privacy setting with detailed explanations of what data is used and why, (4) Visual data flow diagram showing the path: Device → Encryption → Cloud with icons and clear flow direction, (5) Trade-off warnings and explanations (e.g., 'Enabling on-device processing = faster responses but less personalization'), (6) Data categories panel clearly showing which types of data are stored, processed locally, or not collected (e.g., Conversations, Location, Device Info, Usage Patterns), (7) Action buttons for 'Export My Data', 'Delete All Data', and 'View Privacy Policy', (8) Progress indicators or metrics showing data savings or privacy score. Style: Clean, trustworthy, professional, transparent. Use green for privacy-positive actions, red for privacy risks, subtle animations for state changes. Typography: Clear hierarchy with readable labels. Platform: Web application, fully responsive for mobile and desktop.",
  figmaFileUrl: undefined, // Will be added in future when component library is ready
  tips: [
    "Model privacy controls after iOS Privacy settings for familiarity and user trust - Apple's design has proven effective",
    "Use traffic light color system: green (🟢 high privacy), amber (🟡 medium privacy), red (🔴 low privacy) for immediate visual understanding",
    "Show data flow visually with clear progression icons: phone → lock → cloud to illustrate the privacy journey",
    "Make trade-offs explicit with visual separators: create a dedicated 'Trade-offs' section showing 'Better Privacy = Less Personalization'",
    "Include 'Learn more' expandable sections or help icons for complex privacy settings - don't overwhelm users with too much text",
    "For mobile: Stack controls vertically, use bottom sheets for data flow diagrams, ensure toggle switches are at least 44px tall for accessibility",
    "Add data retention timelines (e.g., 'Data deleted after 30 days', 'Conversations stored locally only') to show concrete privacy guarantees",
    "Create a privacy score or percentage indicator (e.g., '85% Private') to give users positive feedback about their privacy choices"
  ]
};

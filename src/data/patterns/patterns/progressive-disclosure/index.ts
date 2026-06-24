import { Pattern } from '../../../../types';

export const progressivedisclosure: Pattern = {
  id: "progressive-disclosure",
  title: "Progressive Disclosure",
  slug: "progressive-disclosure",
  category: "Natural Interaction",
  description: "Gradually reveal information, options, or AI features to reduce cognitive load and simplify complex tasks.",
  tags: ["step by step", "gradual reveal", "complexity management", "UX layers", "feature discovery", "simplification", "cognitive load"],
  thumbnail: "/images/examples/loom-ai.gif",
  introduction: "Progressive Disclosure is an AI design pattern that reveals complexity gradually. It shows simple features first, then unveils advanced capabilities as needed. Instead of overwhelming users with every AI setting and option upfront, this pattern starts with essentials and expands on demand. It's ideal for powerful AI tools with many features, onboarding new users, or preventing decision paralysis. Think of how Loom shows basic video tools first, then reveals AI transcription when you click 'more options,' or how ChatGPT starts simple but offers advanced settings in a menu.",
  datePublished: "2024-01-15",
  dateModified: "2025-11-18",
  hideFAQ: true,
  content: {
    problem: "Complex AI features shown all at once can overwhelm users, causing abandonment or difficulty finding advanced options.",
    solution: "Progressively reveal information and AI features. Start with essentials, then offer advanced features as users interact or request more.",
    examples: [
      {
        title: "Loom AI Video Tools",
        description: "Basic video editing options are shown; advanced AI features (e.g., auto-transcription, highlights) are revealed as needed.",
        image: "/images/examples/loom-ai.gif",
        altText: "Loom AI progressive disclosure in action"
      },
      {
        title: "Google Docs AI Features",
        description: "Google Docs starts with basic writing tools, then progressively reveals AI features like Smart Compose and grammar suggestions as users engage with the document.",
        image: "/images/examples/google-docs-ai.gif",
        altText: "Google Docs AI progressive feature disclosure"
      },
      {
        title: "Superhuman AI Email",
        description: "Superhuman's email interface shows essential actions, then reveals AI features like smart replies and email scheduling as users explore.",
        image: "/images/examples/superhuman-ai.gif",
        altText: "Superhuman AI progressive email features"
      }
    ],
    codeExamples: [
      {
        title: "Progressive Disclosure in Email Summarization",
        description: "This React component demonstrates progressive disclosure by revealing AI email summaries and actions step-by-step, maintaining a clean interface by showing additional options only when requested.",
        language: "tsx",
        componentId: "progressive-disclosure-email-demo",
        code: `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Type definitions
interface EmailData {
  id: string;
  subject: string;
  sender: string;
  content: string;
  date: string;
  attachments: string[];
}

interface EmailSummary {
  shortSummary: string;
  detailedSummary: string;
  suggestedActions: string[];
  keypoints: string[];
}

// Mock email data
const mockEmail: EmailData = {
  id: "email-123",
  subject: "Project Update: Q3 Roadmap and Timeline",
  sender: "Sarah Johnson <sarah.j@example.com>",
  date: "Today, 2:45 PM",
  content: \`Hi Team,

I wanted to share an update on our Q3 roadmap and timelines. We've made significant progress on the feature development for the mobile app redesign, but we're facing some challenges with the API integration that might push our timeline by about a week.

Key updates:
- Mobile app redesign is 70% complete
- Backend API integration is behind schedule (est. 1 week delay)
- User testing is scheduled for June 15-18
- Marketing materials are ready for review

We'll need to decide if we want to push the release date or adjust the scope to meet our original deadline. I've attached the detailed timeline doc and would appreciate your input by Friday.

Also, I'd like to schedule a sync meeting next Monday at 10 AM to discuss options. Please let me know if this works for your schedule.

Thanks,
Sarah\`,
  attachments: ["Q3_Timeline_v2.pdf", "Feature_Priorities.xlsx"]
};

// Mock AI summary service - in a real app, replace with actual API call
const getMockEmailSummary = (): EmailSummary => {
  return {
    shortSummary: "Q3 project update: Mobile redesign on track, API integration delayed by ~1 week.",
    detailedSummary: "Sarah is sharing a Q3 roadmap update. The mobile app redesign is 70% complete, but API integration is delayed by about a week. User testing is scheduled for June 15-18. A decision is needed on whether to delay the release or reduce scope. Input is requested by Friday, and a meeting is proposed for Monday at 10 AM.",
    suggestedActions: [
      "Respond about Monday's meeting availability",
      "Review timeline documents", 
      "Provide input on scope vs. timeline decision"
    ],
    keypoints: [
      "Mobile app: 70% complete",
      "API integration: ~1 week delay",
      "User testing: June 15-18",
      "Decision needed: adjust timeline or scope",
      "Input needed by: Friday",
      "Proposed meeting: Monday, 10 AM"
    ]
  };
};

export default function ProgressiveDisclosureEmailDemo() {
  const [email] = useState<EmailData>(mockEmail);
  const [summary] = useState<EmailSummary>(getMockEmailSummary());
  
  // State for progressive disclosure levels
  const [showSummary, setShowSummary] = useState(false);
  const [showDetailed, setShowDetailed] = useState(false);
  
  // Handle toggling the summary visibility
  const toggleSummary = () => {
    if (showDetailed) {
      // If detailed view is open, close everything
      setShowDetailed(false);
      setShowSummary(false);
    } else if (showSummary) {
      // If basic summary is shown, show detailed view
      setShowDetailed(true);
    } else {
      // If nothing is shown, show basic summary
      setShowSummary(true);
    }
  };

  // Handle clicking on a suggested action
  const handleOptionClick = (action: string) => {
    // In a real app, this would perform the action
    alert(\`Action selected: \${action}\`);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg border border-primary shadow-sm overflow-hidden">
      {/* Email header */}
      <div className="px-6 py-4 border-b border-primary">
        <h3 className="text-lg font-semibold text-text-primary">{email.subject}</h3>
        <div className="flex justify-between mt-1">
          <div className="text-sm text-text-secondary">From: {email.sender}</div>
          <div className="text-sm text-text-tertiary">{email.date}</div>
        </div>
      </div>

      {/* AI Summary Toggle Button - First level of disclosure */}
      <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/30 flex justify-between items-center">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Assistant</span>
        </div>
        <button
          onClick={toggleSummary}
          className="text-sm px-3 py-1 rounded-full bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {showDetailed ? "Hide AI Summary" : showSummary ? "Show More" : "Show AI Summary"}
        </button>
      </div>
      
      {/* Progressive disclosure content */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Basic summary - First level of content */}
            <div className="px-6 py-3 bg-blue-50/50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800">
              <p className="text-sm text-text-secondary">
                <span className="font-medium">Summary: </span>
                {summary.shortSummary}
              </p>
            </div>

            {/* Detailed summary - Second level of content */}
            <AnimatePresence>
              {showDetailed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {/* Detailed summary */}
                  <div className="px-6 py-3 bg-blue-50/30 dark:bg-blue-900/10 border-t border-blue-100 dark:border-blue-800">
                    <p className="text-sm text-text-secondary mb-3">
                      <span className="font-medium">Detailed: </span>
                      {summary.detailedSummary}
                    </p>

                    {/* Key Points */}
                    <div className="mb-3">
                      <h4 className="text-xs uppercase font-semibold text-text-tertiary mb-2">Key Points</h4>
                      <ul className="grid grid-cols-2 gap-2">
                        {summary.keypoints.map((point, index) => (
                          <li key={index} className="text-xs flex items-start">
                            <svg className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400 mr-1 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-text-secondary">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggested Actions */}
                    <div>
                      <h4 className="text-xs uppercase font-semibold text-text-tertiary mb-2">Suggested Actions</h4>
                      <div className="flex flex-wrap gap-2">
                        {summary.suggestedActions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleOptionClick(action)}
                            className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email content */}
      <div className="px-6 py-4">
        <p className="text-sm text-text-secondary whitespace-pre-line">{email.content}</p>
      </div>

      {/* Email footer */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex gap-2">
          {email.attachments.map((attachment, index) => (
            <div key={index} className="text-xs py-1 px-2 bg-surface-secondary rounded flex items-center text-text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-text-tertiary mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
              </svg>
              {attachment}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`
      }
    ],
    guidelines: [
      "Start with essential information; reveal advanced AI features only when needed.",
      "Use clear triggers (e.g., 'Show more', tooltips, step-by-step flows) to access additional AI options.",
      "Avoid overwhelming users with too many choices or settings.",
      "Test with novice and advanced users to balance simplicity and power.",
      "Provide contextual explanations or AI tips as users progress."
    ],
    considerations: [
      "Limit disclosure to 2-3 layers to avoid user frustration.",
      "Clearly indicate how to access more options.",
      "Ensure accessibility for all users (keyboard, screen reader support).",
      "Tailor progressive disclosure to user segments (e.g., show more to advanced users).",
      "Monitor usage analytics to refine default hidden/revealed content."
    ],
    relatedPatterns: [
      "Contextual Assistance",
      "Adaptive Interfaces",
      "Transparent Feedback",
      "Intent Preview"
    ],
    figmaPrompt: {
      prompt: `Design an interface with progressive disclosure that reveals AI features gradually:

Create 3 states:
1. **Initial view**: Show essential content only (summary, key action)
2. **Expanded view**: Reveal more details (AI insights, key points)
3. **Full view**: Show all options (actions, settings, advanced features)

Include clear expand/collapse triggers (chevrons, "Show more" buttons) and smooth transitions between states.`,
      tips: [
        "Limit to 2-3 disclosure layers maximum",
        "Use chevrons or +/- icons as visual triggers",
        "Add smooth animations for expand/collapse",
        "Design all states: collapsed → partial → expanded",
        "Test that users can easily discover hidden features"
      ]
    },
    judgmentCall: {
      explainWhen: [
        "The feature set is genuinely tiered: most users need a few things and a minority need the deep surface. Hiding the long tail keeps the common path clean.",
        "Showing everything at once would cause decision paralysis or bury the primary action in noise.",
        "The hidden depth is revealed on demand, at the moment of need, through an obvious trigger, not buried in a distant menu."
      ],
      dontWhen: [
        "The 'advanced' option is something most users actually need. Putting a core action behind 'more options' is friction dressed as minimalism, and it's dark-pattern adjacent.",
        "The total option set is small (3-5 items). Disclosure adds a click without reducing real load. Just show them.",
        "The reveal isn't discoverable. If users can't find the hidden feature, you didn't disclose progressively, you hid it."
      ],
      trap: "Hiding the important thing to make the UI look simple. Clean is not the same as usable: a screenshot-perfect interface that buries the one action a user came for has optimized for the demo, not the person. Progressive disclosure is for the rare, never the necessary."
    },
    installPrompt: `You are implementing the Progressive Disclosure design pattern in this codebase.

The pattern in one line: reveal complexity gradually, hiding the rare so the common path stays clean, never hiding what users actually need.

Apply the following moves wherever this codebase shows a dense set of features, options, or AI settings. DO NOT apply to small option sets (3-5 items) or to primary actions. There, disclosure adds cost without reducing load.

1. Separate core from long-tail by real usage, not taste.
   For each dense surface, identify which actions most users need (core, always visible) versus a minority (long-tail, behind a reveal). If you don't have usage data, instrument the surface first. Do not guess what to hide based on what looks clean.

2. Never hide a primary action.
   The main thing a user came to do must be reachable without a click. Audit every "more options" / overflow menu; if it contains something most users need, promote it out into the visible layer.

3. Label the trigger.
   Every reveal needs a discoverable, labeled affordance ("Show 3 more", "Advanced settings"), not a bare icon. Where possible, show the count of hidden items in the label so users know depth exists.

4. Cap nesting at two layers.
   collapsed → expanded is the default. A third nested layer needs explicit justification; flag any surface that nests deeper, because users lose track of where things live past two.

5. Reveal in context, and remember the choice.
   Put the "show more" next to the content it expands, not in a global settings page. Persist each user's expanded/collapsed preference per surface so they don't re-dig every visit.

The trap to avoid: using disclosure to bury functionality so the UI looks simple. If a user can't find the thing they need, you hid it, you didn't disclose it. Hide the rare, never the necessary.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which of the five moves you applied at each
- Surfaces flagged but not changed: file path + why (e.g. small option set, contains a primary action, no usage data yet)
- New instrumentation / state you added (usage tracking, per-surface preference persistence, trigger labels) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Hide the rare, never the necessary.",
        body: "Progressive disclosure is for the long tail, not the core action. If most users need it, it isn't 'advanced', and putting it behind a click is friction pretending to be minimalism. Clean UI that buries what people came for has optimized for the screenshot, not the user."
      },
      {
        heading: "Make the door obvious.",
        body: "A reveal users can't find isn't disclosure, it's a hidden feature. A labeled trigger ('Show 4 more') beats a mystery chevron. Discoverability is the entire contract: the moment depth becomes invisible, you've broken the pattern and the user's trust."
      },
      {
        heading: "Cap the depth at two layers.",
        body: "collapsed → expanded. Past that, users lose the map of where things live. Each layer should answer a question the previous one raised, not nest for its own sake. If you need a third layer, the information architecture is the real problem."
      },
      {
        heading: "Default to the data, not to white space.",
        body: "What you hide by default should be driven by real usage, not a designer's taste for empty margins. Watch the analytics: if people keep expanding to reach the same thing, it has earned a place in the visible layer. Promote it."
      },
      {
        heading: "Reveal at the moment of need, in context.",
        body: "The best disclosure appears right where and when the user needs it, next to the thing it expands, not in a distant settings menu. Proximity is what makes depth feel effortless instead of buried."
      }
    ]
  }
};

import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a personalized recommendation feed where user feedback visibly closes the loop, drawing inspiration from Spotify (skips and likes reshaping recommendations) and Gmail (correcting spam improving the filter). The screen must prove the loop closes, not just collect a rating. Include: a 'For You' content feed of 4 cards, each with a topic tag, title, source, and a 'why you're seeing this' reason line tied to past feedback ('Because you asked for more Design'); per-card 'More like this' and 'Show less' controls; a named-consequence confirmation after each action ('Got it, you'll see less Sports') rather than a generic 'thanks for your feedback'; the feed re-ranking in place with a smooth layout animation so the change is visible; and a 'What it has learned about you' profile panel showing learned preferences as chips, each with a one-click undo. Style: clean, trustworthy, minimal. Make the cause-and-effect between a tap and the changed feed unmistakable. Platform: web and mobile responsive.",
  figmaFileUrl: undefined,
  tips: [
    "Show the consequence of feedback, not a thank-you. Name what changed ('less Sports'), so the user sees the loop close",
    "Re-rank the feed in front of the user with a layout animation. The visible change is the whole point",
    "Tie each recommendation to a reason ('Because you asked for more Design') to make the learning legible",
    "Make correcting cheaper than tolerating the error: one tap per card, no forms or modals",
    "Expose what the system learned as a profile the user can see and undo with one click",
    "Avoid vanity counters ('X feedbacks received'). A tally is not a closed loop, it's theater",
    "Maintain consistent control size and spacing across web and mobile views",
    "Test tap target sizes, ensure controls are at least 44px for mobile accessibility"
  ]
};

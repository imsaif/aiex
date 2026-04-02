'use client';

/**
 * Small, self-contained preview components for the Conversational UI guide.
 * Each one renders a visual demo of a code pattern discussed in the lessons.
 *
 * brand-audit-ignore: These components intentionally use hardcoded colors to
 * render realistic chat UI demos (blue user bubbles, gray AI bubbles, red
 * error states, etc.). They are isolated previews, not site-wide chrome.
 */
/* brand-audit-ignore-file */

import { useState } from 'react';

// ─── Chat Message Bubbles ────────────────────────────────────────────────────

function Avatar({ role }: { role: 'user' | 'assistant' }) {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
      role === 'user'
        ? 'bg-blue-500 text-white'
        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
    }`}>
      {role === 'user' ? 'U' : 'AI'}
    </div>
  );
}

export function ChatMessagePreview() {
  const messages = [
    { id: '1', role: 'user' as const, content: 'What color palette works best for a wellness app?', timestamp: '2:41 PM' },
    { id: '2', role: 'assistant' as const, content: 'For wellness apps, soft and calming tones work best:\n\n• Sage green (#B2C9AD) for trust and calm\n• Warm beige (#F5F0EB) for the background\n• Muted coral (#E8A598) as an accent\n\nAvoid high-saturation colors — they feel energizing rather than relaxing.', timestamp: '2:41 PM' },
    { id: '3', role: 'user' as const, content: 'Can you suggest a darker variant for the evening mode?', timestamp: '2:42 PM' },
    { id: '4', role: 'assistant' as const, content: 'Great idea! For an evening/dark mode:\n\n• Deep teal (#1A3C40) as the base\n• Soft cream (#F0E6D3) for text\n• Dusty rose (#C4917B) for accents\n\nThis keeps the calming feel without harsh contrast.', timestamp: '2:42 PM' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md mx-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <Avatar role="assistant" />
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">AI Assistant</span>
      </div>
      {/* Messages */}
      <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && <Avatar role="assistant" />}
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}>
                <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                <time className={`text-[10px] mt-1 block ${
                  isUser ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {msg.timestamp}
                </time>
              </div>
              {isUser && <Avatar role="user" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Typing Indicator ────────────────────────────────────────────────────────

export function TypingIndicatorPreview() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md mx-auto">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <Avatar role="assistant" />
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">AI Assistant</span>
      </div>
      <div className="p-4 space-y-3">
        {/* Previous message */}
        <div className="flex gap-2 justify-end">
          <div className="max-w-[75%] rounded-2xl px-4 py-2 bg-blue-500 text-white">
            <div className="text-sm">How should I handle empty states in my dashboard?</div>
          </div>
          <Avatar role="user" />
        </div>
        {/* Typing indicator */}
        <div className="flex gap-2 justify-start">
          <Avatar role="assistant" />
          <div className="rounded-2xl px-4 py-3 bg-gray-100 dark:bg-gray-800">
            <div className="flex gap-1.5 items-center">
              <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Streaming Text ──────────────────────────────────────────────────────────

export function StreamingPreview() {
  const fullText = 'Empty states are a great opportunity to guide users. Instead of showing a blank screen, use illustrations, a short explanation of what will appear here, and a clear call-to-action button to help them get started.';
  const [displayLength, setDisplayLength] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);

  const startStream = () => {
    setDisplayLength(0);
    setIsStreaming(true);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      if (i >= fullText.length) {
        clearInterval(interval);
        setIsStreaming(false);
        setDisplayLength(fullText.length);
      } else {
        setDisplayLength(i);
      }
    }, 25);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md mx-auto">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <Avatar role="assistant" />
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">AI Assistant</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex gap-2 justify-end">
          <div className="max-w-[75%] rounded-2xl px-4 py-2 bg-blue-500 text-white">
            <div className="text-sm">How should I handle empty states in my dashboard?</div>
          </div>
          <Avatar role="user" />
        </div>
        {displayLength > 0 && (
          <div className="flex gap-2 justify-start">
            <Avatar role="assistant" />
            <div className="max-w-[75%] rounded-2xl px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              <div className="text-sm">
                {fullText.slice(0, displayLength)}
                {isStreaming && <span className="inline-block w-0.5 h-4 bg-gray-900 dark:bg-gray-100 ml-0.5 animate-pulse align-text-bottom" />}
              </div>
            </div>
          </div>
        )}
        <div className="text-center pt-2">
          <button
            onClick={startStream}
            disabled={isStreaming}
            className="px-4 py-1.5 text-xs font-medium rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 disabled:opacity-50 cursor-pointer"
          >
            {isStreaming ? 'Streaming...' : displayLength > 0 ? 'Replay' : 'Start Stream'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Suggested Prompts ───────────────────────────────────────────────────────

const SCENARIOS = [
  {
    label: 'After a detailed answer',
    aiMessage: 'For your onboarding flow, I\'d recommend a progressive approach:\n\n1. Welcome screen with value proposition\n2. One key setup action (not five)\n3. Success moment — show them what they unlocked',
    prompts: ['Show me examples from real apps', 'What about mobile onboarding?', 'How many steps is too many?'],
  },
  {
    label: 'After a comparison',
    aiMessage: 'Modal vs. inline editing:\n\n• Modals work for complex, focused tasks\n• Inline editing is faster for quick changes\n• Side panels split the difference — context + focus',
    prompts: ['When should I use each?', 'Show me side panel examples', 'What does Figma do?'],
  },
  {
    label: 'Empty state (starters)',
    aiMessage: '',
    prompts: ['Review my onboarding flow', 'Help me pick a color palette', 'What makes a good empty state?'],
  },
];

export function SuggestedPromptsPreview() {
  const [activeScenario, setActiveScenario] = useState(0);
  const scenario = SCENARIOS[activeScenario];

  return (
    <div className="space-y-3 max-w-md mx-auto">
      {/* Scenario selector */}
      <div className="flex gap-1.5 flex-wrap">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setActiveScenario(i)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors cursor-pointer ${
              i === activeScenario
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Chat preview */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <Avatar role="assistant" />
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">AI Assistant</span>
        </div>
        <div className="p-4">
          {/* AI response (or empty state) */}
          {scenario.aiMessage ? (
            <div className="flex gap-2 justify-start mb-4">
              <Avatar role="assistant" />
              <div className="max-w-[75%] rounded-2xl px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <pre className="text-xs whitespace-pre-wrap font-mono m-0">{scenario.aiMessage}</pre>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 mb-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">How can I help you?</p>
            </div>
          )}

          {/* Contextual prompts — the point of this demo */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
            <p className="text-[10px] uppercase tracking-wide font-semibold text-gray-400 dark:text-gray-500 mb-2">
              Suggested follow-ups
            </p>
            <div className="flex flex-wrap gap-2">
              {scenario.prompts.map((prompt) => (
                <span
                  key={prompt}
                  className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900"
                >
                  {prompt}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Error Message with Retry ────────────────────────────────────────────────

export function ErrorMessagePreview() {
  const [showError, setShowError] = useState(true);
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      setShowError(false);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md mx-auto">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <Avatar role="assistant" />
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">AI Assistant</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex gap-2 justify-end">
          <div className="max-w-[75%] rounded-2xl px-4 py-2 bg-blue-500 text-white">
            <div className="text-sm">Create 3 homepage layout variations for my SaaS product</div>
          </div>
          <Avatar role="user" />
        </div>
        {showError ? (
          <div className="flex gap-2 items-start">
            <Avatar role="assistant" />
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl px-4 py-3 max-w-[75%]">
              <p className="text-sm text-red-800 dark:text-red-300">
                {retrying ? 'Retrying...' : 'Something went wrong generating your response.'}
              </p>
              {!retrying && (
                <button
                  onClick={handleRetry}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline cursor-pointer font-medium"
                >
                  ↻ Try again
                </button>
              )}
              {retrying && (
                <div className="mt-2 flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-2 justify-start">
            <Avatar role="assistant" />
            <div className="max-w-[75%] rounded-2xl px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              <div className="text-sm">Here are 3 layout options for your homepage. Option A leads with social proof...</div>
            </div>
          </div>
        )}
        {!showError && (
          <div className="text-center pt-1">
            <button
              onClick={() => setShowError(true)}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
            >
              Reset demo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Intent Preview Card (Agentic) ──────────────────────────────────────────

export function IntentPreviewPreview() {
  const [status, setStatus] = useState<'pending' | 'confirmed' | 'cancelled'>('pending');

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md mx-auto">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <Avatar role="assistant" />
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">AI Agent</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex gap-2 justify-end">
          <div className="max-w-[75%] rounded-2xl px-4 py-2 bg-blue-500 text-white">
            <div className="text-sm">Schedule a meeting with Sarah for next Tuesday</div>
          </div>
          <Avatar role="user" />
        </div>
        <div className="flex gap-2 justify-start">
          <Avatar role="assistant" />
          <div className="max-w-[85%]">
            {status === 'pending' ? (
              <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">📅</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Create Meeting</span>
                </div>
                <div className="space-y-1 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>With: <span className="text-gray-900 dark:text-gray-100">Sarah Johnson</span></div>
                  <div>Date: <span className="text-gray-900 dark:text-gray-100">Tuesday, Apr 8 at 10:00 AM</span></div>
                  <div>Duration: <span className="text-gray-900 dark:text-gray-100">30 minutes</span></div>
                  <div>Location: <span className="text-gray-900 dark:text-gray-100">Google Meet</span></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStatus('confirmed')} className="px-4 py-1.5 text-xs font-semibold rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer">Confirm</button>
                  <button className="px-4 py-1.5 text-xs font-medium rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">Edit</button>
                  <button onClick={() => setStatus('cancelled')} className="px-4 py-1.5 text-xs font-medium rounded-full text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors cursor-pointer">Cancel</button>
                </div>
              </div>
            ) : status === 'confirmed' ? (
              <div className="rounded-2xl px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-300">✓ Meeting scheduled with Sarah for Tuesday, Apr 8 at 10:00 AM</p>
                <button onClick={() => setStatus('pending')} className="mt-1 text-xs text-green-600 dark:text-green-400 hover:underline cursor-pointer">Reset demo</button>
              </div>
            ) : (
              <div className="rounded-2xl px-4 py-3 bg-gray-100 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">Meeting cancelled. What would you like to do instead?</p>
                <button onClick={() => setStatus('pending')} className="mt-1 text-xs text-gray-500 dark:text-gray-400 hover:underline cursor-pointer">Reset demo</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Plan Summary (Agentic) ─────────────────────────────────────────────────

export function PlanSummaryPreview() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const steps = [
    'Audit current onboarding screens for drop-off points',
    'Generate 3 simplified flow variations',
    'Create before/after comparison with rationale',
  ];

  const runPlan = () => {
    setCurrentStep(0);
    setIsRunning(true);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step >= steps.length) {
        clearInterval(interval);
        setCurrentStep(steps.length);
        setIsRunning(false);
      } else {
        setCurrentStep(step);
      }
    }, 1200);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md mx-auto">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <Avatar role="assistant" />
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">AI Agent</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex gap-2 justify-end">
          <div className="max-w-[75%] rounded-2xl px-4 py-2 bg-blue-500 text-white">
            <div className="text-sm">Redesign the onboarding to reduce drop-off</div>
          </div>
          <Avatar role="user" />
        </div>
        <div className="flex gap-2 justify-start">
          <Avatar role="assistant" />
          <div className="max-w-[85%] rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              I&apos;ll redesign the onboarding in 3 steps:
            </p>
            <div className="space-y-2 mb-4">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 text-xs border ${
                    i < currentStep
                      ? 'bg-green-500 border-green-500 text-white'
                      : i === currentStep && isRunning
                        ? 'border-blue-500 text-blue-500 animate-pulse'
                        : 'border-gray-300 dark:border-gray-600 text-gray-400'
                  }`}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <span className={`text-sm ${
                    i < currentStep
                      ? 'text-gray-500 dark:text-gray-400 line-through'
                      : i === currentStep && isRunning
                        ? 'text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
            {currentStep < 0 && (
              <div className="flex gap-2">
                <button onClick={runPlan} className="px-4 py-1.5 text-xs font-semibold rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer">Start</button>
                <button className="px-4 py-1.5 text-xs font-medium rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 cursor-pointer">Modify Plan</button>
              </div>
            )}
            {isRunning && (
              <p className="text-xs text-blue-500 animate-pulse">Running step {currentStep + 1} of {steps.length}...</p>
            )}
            {currentStep >= steps.length && !isRunning && (
              <div>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">✓ All steps completed</p>
                <button onClick={() => { setCurrentStep(-1); setIsRunning(false); }} className="mt-1 text-xs text-gray-400 hover:underline cursor-pointer">Reset demo</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Accessibility: Screen Reader Markup ─────────────────────────────────────

export function AccessibilityPreview() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md mx-auto">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Accessibility Annotations</span>
      </div>
      <div className="p-4">
        {/* Message area with visible ARIA annotations */}
        <div className="relative rounded-lg border-2 border-dashed border-purple-300 dark:border-purple-700 p-3 mb-3">
          <span className="absolute -top-2.5 left-2 px-1.5 text-[10px] font-mono bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">role=&quot;log&quot; aria-live=&quot;polite&quot;</span>
          <div className="space-y-2 mt-1">
            <div className="relative rounded-lg border border-dashed border-blue-300 dark:border-blue-700 p-2">
              <span className="absolute -top-2 left-2 px-1 text-[9px] font-mono bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">aria-label=&quot;You said&quot;</span>
              <div className="flex gap-2 justify-end mt-1">
                <div className="rounded-xl px-3 py-1.5 bg-blue-500 text-white text-xs">Hello!</div>
              </div>
            </div>
            <div className="relative rounded-lg border border-dashed border-green-300 dark:border-green-700 p-2">
              <span className="absolute -top-2 left-2 px-1 text-[9px] font-mono bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">aria-label=&quot;AI Assistant said&quot;</span>
              <div className="flex gap-2 justify-start mt-1">
                <div className="rounded-xl px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs">Hi! How can I help?</div>
              </div>
            </div>
          </div>
        </div>
        {/* Status region */}
        <div className="relative rounded-lg border-2 border-dashed border-amber-300 dark:border-amber-700 p-2">
          <span className="absolute -top-2.5 left-2 px-1.5 text-[10px] font-mono bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded">role=&quot;status&quot; aria-live=&quot;assertive&quot;</span>
          <div className="flex gap-1.5 items-center mt-1 ml-1">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-1">AI is typing...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Registry ────────────────────────────────────────────────────────────────

const PREVIEW_REGISTRY: Record<string, React.ComponentType> = {
  'chat-message-bubbles': ChatMessagePreview,
  'typing-indicator': TypingIndicatorPreview,
  'streaming-text': StreamingPreview,
  'suggested-prompts': SuggestedPromptsPreview,
  'error-message-retry': ErrorMessagePreview,
  'intent-preview-card': IntentPreviewPreview,
  'plan-summary-card': PlanSummaryPreview,
  'accessibility-annotations': AccessibilityPreview,
};

export function getPreviewComponent(previewId: string): React.ComponentType | null {
  return PREVIEW_REGISTRY[previewId] || null;
}

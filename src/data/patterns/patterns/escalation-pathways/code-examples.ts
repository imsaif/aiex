import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Agent Escalation Card",
    description: "An escalation card that shows context, recommended action with confidence, and response options when the agent needs human input mid-task.",
    language: "tsx",
    componentId: "escalation-pathways-demo",
    code: `'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EscalationItem {
  id: number;
  type: 'confidence' | 'permission' | 'conflict';
  context: string;
  question: string;
  recommendation: string;
  confidence: number;
  options: string[];
  resolved: boolean;
  response?: string;
  taskProgress: number;
}

export default function EscalationPathwaysDemo() {
  const [escalations, setEscalations] = useState<EscalationItem[]>([
    {
      id: 1,
      type: 'confidence',
      context: 'While organizing your inbox, I found an email from legal@partner.com about contract amendments.',
      question: 'Which department should handle this email?',
      recommendation: 'Route to Legal team',
      confidence: 62,
      options: ['Approve: Route to Legal', 'Route to Finance instead', 'Keep in my inbox'],
      resolved: false,
      taskProgress: 65,
    },
    {
      id: 2,
      type: 'permission',
      context: 'Drafting a follow-up to the board meeting notes. The reply would go to all board members including external advisors.',
      question: 'This would send an email to 12 recipients including 3 external advisors. Proceed?',
      recommendation: 'Send to internal board members only',
      confidence: 85,
      options: ['Send to all 12 recipients', 'Internal members only (9)', 'Let me review the draft first'],
      resolved: false,
      taskProgress: 40,
    },
    {
      id: 3,
      type: 'conflict',
      context: 'Your calendar shows you\\'re free at 2pm Thursday, but your Slack status is set to "Deep Focus  -  no meetings."',
      question: 'Should I schedule the client call for 2pm Thursday?',
      recommendation: 'Suggest an alternative time',
      confidence: 45,
      options: ['Schedule at 2pm anyway', 'Find alternative time', 'Ask the client for preferences'],
      resolved: false,
      taskProgress: 80,
    },
  ]);

  const [dontAskAgain, setDontAskAgain] = useState<Record<number, boolean>>({});

  const resolveEscalation = (id: number, response: string) => {
    setEscalations(prev => prev.map(e => e.id === id ? { ...e, resolved: true, response } : e));
  };

  const resetDemo = () => {
    setEscalations(prev => prev.map(e => ({ ...e, resolved: false, response: undefined })));
    setDontAskAgain({});
  };

  const unresolvedCount = escalations.filter(e => !e.resolved).length;
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'confidence': return { icon: '?', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' };
      case 'permission': return { icon: '!', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' };
      case 'conflict': return { icon: '~', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' };
      default: return { icon: '?', color: 'bg-gray-100 text-gray-600' };
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Agent Paused</h3>
          <p className="text-sm text-text-secondary">{unresolvedCount > 0 ? \`\${unresolvedCount} decision\${unresolvedCount > 1 ? 's' : ''} needed to continue\` : 'All resolved  -  agent will continue'}</p>
        </div>
        {unresolvedCount === 0 && (
          <button onClick={resetDemo} className="text-sm text-text-secondary hover:text-text-primary transition-colors">Reset demo</button>
        )}
      </div>

      <AnimatePresence>
        {escalations.map(esc => {
          const typeInfo = getTypeIcon(esc.type);
          return (
            <motion.div
              key={esc.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={\`bg-surface-primary border border-primary rounded-xl overflow-hidden \${esc.resolved ? 'opacity-60' : ''}\`}
            >
              {/* Progress indicator */}
              <div className="h-1 bg-gray-100 dark:bg-gray-800">
                <div className="h-1 bg-blue-500 transition-all" style={{ width: \`\${esc.taskProgress}%\` }} />
              </div>

              <div className="px-5 py-4">
                {/* Type badge + context */}
                <div className="flex items-start gap-3 mb-3">
                  <span className={\`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold \${typeInfo.color}\`}>{typeInfo.icon}</span>
                  <p className="text-sm text-text-secondary">{esc.context}</p>
                </div>

                {/* Question */}
                <p className="font-medium text-text-primary mb-3">{esc.question}</p>

                {/* Recommendation */}
                <div className="flex items-center gap-2 mb-4 p-2 bg-surface-secondary rounded-lg">
                  <span className="text-xs text-text-tertiary">Suggested:</span>
                  <span className="text-sm text-text-primary font-medium">{esc.recommendation}</span>
                  <span className={\`text-xs px-1.5 py-0.5 rounded-full ml-auto \${
                    esc.confidence >= 75 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    esc.confidence >= 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }\`}>{esc.confidence}% confident</span>
                </div>

                {/* Actions */}
                {esc.resolved ? (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-sm text-text-secondary">Resolved: {esc.response}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {esc.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => resolveEscalation(esc.id, opt)}
                          className={\`px-3 py-1.5 text-sm rounded-lg transition-colors \${
                            i === 0 ? 'bg-text-primary text-white hover:opacity-90' : 'bg-surface-secondary text-text-primary hover:bg-gray-200 dark:hover:bg-gray-700'
                          }\`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    <label className="flex items-center gap-2 text-xs text-text-tertiary cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dontAskAgain[esc.id] || false}
                        onChange={(e) => setDontAskAgain(prev => ({ ...prev, [esc.id]: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      Don&apos;t ask again for this type
                    </label>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}`
  }
];

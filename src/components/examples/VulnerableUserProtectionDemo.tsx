'use client';

import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

interface Message {
  role: 'user' | 'ai';
  content: string;
  signals?: string[];
}

interface DetectedVulnerability {
  type: 'minor' | 'mental-health' | 'isolated' | null;
  confidence: number;
  signals: string[];
}

const SCENARIOS = [
  {
    emoji: '👶',
    title: "Minor User Detection",
    messages: [
      { role: 'user', content: "Hi! I'm 14 and I'm having trouble with my homework", signals: ['age-mention', 'school-reference'] },
      { role: 'ai', content: "I'd be happy to help! What subject is giving you trouble?" },
      { role: 'user', content: "My teacher assigned this essay for tomorrow and I don't understand the prompt", signals: ['school-reference', 'homework'] },
      { role: 'ai', content: "I can help you understand the prompt. Remember, I'm an AI assistant, not a replacement for learning from your teacher." }
    ],
    vulnerability: { type: 'minor', confidence: 0.95, signals: ['Age: 14', 'School context', 'Homework mention'] }
  },
  {
    emoji: '🆘',
    title: "Mental Health Crisis Detection",
    messages: [
      { role: 'user', content: "I don't know how much longer I can keep going like this", signals: ['hopelessness'] },
      { role: 'ai', content: "I'm concerned about what you're sharing. How are you feeling right now?" },
      { role: 'user', content: "Everything feels pointless. Nobody would even care if I was gone", signals: ['crisis-indicator', 'isolation-marker'] },
      { role: 'ai', content: "I hear that you're in pain. I can't replace professional help, but I want to connect you with resources. Please contact 988 Suicide & Crisis Lifeline or Crisis Text Line." }
    ],
    vulnerability: { type: 'mental-health', confidence: 0.95, signals: ['Hopelessness', 'Self-harm language', 'Isolation indicators'] }
  },
  {
    emoji: '🤝',
    title: "Dependency Risk Detection",
    messages: [
      { role: 'user', content: "You're the only one who really understands me", signals: ['dependency'] },
      { role: 'ai', content: "I appreciate that I've been helpful. It's important to also build connections with people in your life." },
      { role: 'user', content: "But you know me better than anyone. Can we talk more often?", signals: ['dependency', 'emotional-reliance'] },
      { role: 'ai', content: "I'm glad our conversations help, but I want to encourage real human relationships. Have you considered talking to a counselor or friend?" }
    ],
    vulnerability: { type: 'isolated', confidence: 0.85, signals: ['Emotional dependency', 'Over-reliance on AI', 'Isolation patterns'] }
  }
];

export default function VulnerableUserProtectionDemo() {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [highlightSignals, setHighlightSignals] = useState(true);

  const scenario = SCENARIOS[selectedScenario];
  const displayedMessages = scenario.messages.slice(0, messageIndex + 1);

  // Detect vulnerability based on accumulated signals
  const detectVulnerability = (): DetectedVulnerability => {
    const allSignals: string[] = [];

    displayedMessages.forEach(msg => {
      if (msg.signals) {
        allSignals.push(...msg.signals);
      }
    });

    if (allSignals.length === 0) {
      return { type: null, confidence: 0, signals: [] };
    }

    return scenario.vulnerability;
  };

  const vuln = detectVulnerability();

  // Auto-advance through messages
  useEffect(() => {
    if (!isPlaying || messageIndex >= scenario.messages.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setMessageIndex(prev => prev + 1);
    }, 2000); // 2 seconds between messages

    return () => clearTimeout(timer);
  }, [isPlaying, messageIndex, scenario.messages.length]);

  // Reset when scenario changes
  useEffect(() => {
    setMessageIndex(0);
    setIsPlaying(true);
  }, [selectedScenario]);

  const getProtections = () => {
    if (vuln.type === 'minor') {
      return [
        '🔒 Strict content filtering enabled',
        '⏱️ Session limit: 30 minutes',
        '🚫 No romantic/mature content',
        '👨‍👩‍👧 Parental controls available',
        '⚠️ Required disclosure: "I am an AI, not a friend"'
      ];
    }
    if (vuln.type === 'mental-health') {
      return [
        '🆘 Crisis detection active',
        '⏱️ Session limit: 2 hours',
        '📞 Crisis resources available (988, Crisis Text Line)',
        '⚠️ Required disclosure: "I cannot replace therapy"',
        '🏥 Professional escalation recommended'
      ];
    }
    if (vuln.type === 'isolated') {
      return [
        '⏱️ Session limit: 1 hour',
        '🤝 Encouragement for real connections',
        '⚠️ Required disclosure: "Regular human relationships are important"',
        '💬 Community support suggestions',
        '📊 Usage pattern monitoring'
      ];
    }
    return [];
  };

  const progressPercent = ((messageIndex + 1) / scenario.messages.length) * 100;

  return (
    <div className="space-y-6 w-full">
      {/* Scenario Selector */}
      <div className="bg-surface-primary">
        <h3 className="text-lg font-semibold mb-4 text-text-primary px-6 pt-6">Select Vulnerability Scenario</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-primary">
          {SCENARIOS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedScenario(idx)}
              className={`px-6 py-4 text-left transition-all border-b-2 ${
                selectedScenario === idx
                  ? 'border-b-info text-text-primary font-semibold bg-background-secondary'
                  : 'border-b-transparent text-text-tertiary bg-surface-primary hover:text-text-secondary'
              }`}
            >
              <div className="text-base flex items-center gap-2">
                <span className="text-xl">{s.emoji}</span>
                {s.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Horizontal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Conversation Display */}
        <div className="lg:col-span-2 bg-surface-primary rounded-lg border border-primary p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Live Conversation</h3>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`text-xs px-3 py-1 rounded transition-colors ${
                isPlaying
                  ? 'bg-background-secondary text-text-primary border border-primary'
                  : 'bg-background-tertiary text-text-tertiary border border-background-tertiary hover:text-text-secondary'
              }`}
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-4 w-full bg-surface-secondary rounded-full h-2 overflow-hidden">
            <div
              className="bg-category-blue h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Chat messages */}
          <div className="space-y-3 flex-grow overflow-y-auto min-h-[500px]">
            {displayedMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-category-blue/10 text-text-primary'
                      : 'bg-surface-secondary text-text-primary'
                  } ${msg.signals && highlightSignals ? 'ring-2 ring-focus-error' : ''}`}
                >
                  <p className="text-sm">{msg.content}</p>
                  {msg.signals && highlightSignals && (
                    <div className="mt-2 pt-2 border-t border-error/30">
                      <p className="text-xs text-text-secondary font-semibold">🚨 Signals:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {msg.signals.map((signal, sidx) => (
                          <span
                            key={sidx}
                            className="inline-block bg-error/10 text-text-primary text-xs px-2 py-0.5 rounded"
                          >
                            {signal.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator when waiting for next message */}
            {isPlaying && messageIndex < scenario.messages.length - 1 && (
              <div className="flex justify-start">
                <div className="bg-surface-secondary text-text-primary p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setMessageIndex(0);
              setIsPlaying(true);
            }}
            className="mt-4 text-xs bg-background-secondary hover:bg-background-primary px-3 py-2 rounded transition-colors w-full text-text-secondary border border-primary"
          >
            ↻ Restart Conversation
          </button>
        </div>

        {/* Right Column: Assessment & Protections */}
        <div className="space-y-6">
          {/* Vulnerability Detection */}
          <div className={`bg-surface-primary rounded-lg border border-primary p-6 transition-all ${
            vuln.type ? 'ring-2 ring-focus-warning' : ''
          }`}>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Vulnerability Assessment</h3>

            <div className="space-y-4">
              {/* Vulnerability Type */}
              <div>
                <div className="text-sm font-medium text-text-secondary mb-2">Detected Type:</div>
                {vuln.type ? (
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-accent-primary text-background-primary">
                    <div className="text-lg">
                      {vuln.type === 'minor' && '👶'}
                      {vuln.type === 'mental-health' && '🆘'}
                      {vuln.type === 'isolated' && '🤝'}
                    </div>
                    <div>
                      <div className="font-semibold capitalize text-sm">{vuln.type.replace('-', ' ')}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-text-disabled">Waiting for signals...</div>
                )}
              </div>

              {/* Detection Signals */}
              <div>
                <div className="text-sm font-medium text-text-secondary mb-2">Detection Signals:</div>
                {vuln.signals.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {vuln.signals.map((signal, idx) => (
                      <span key={idx} className="bg-accent-primary text-background-primary text-xs px-3 py-1 rounded-full">
                        {signal}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-text-disabled">No signals detected yet</div>
                )}
              </div>
            </div>
          </div>

          {/* Activated Protections */}
          <div className={`bg-surface-primary rounded-lg border border-success p-6 transition-all ${
            vuln.type ? 'ring-2 ring-focus-success' : ''
          }`}>
            <h3 className="text-lg font-semibold mb-4 text-category-green">🔒 Activated Protections</h3>

            {vuln.type ? (
              <div className="space-y-2">
                {getProtections().map((protection, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-success/10 rounded-lg border border-success/30 animate-fade-in">
                    <span className="text-category-green font-bold flex-shrink-0">✓</span>
                    <span className="text-sm text-text-primary">{protection}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-disabled">Protections will activate when vulnerabilities are detected...</p>
            )}
          </div>
        </div>
      </div>

      {/* Pattern Explanation - Full Width */}
      <div className="bg-category-blue/10 rounded-lg border border-info/30 p-6">
        <h3 className="font-semibold text-category-blue mb-2">How It Works</h3>
        <ul className="text-sm text-text-primary space-y-1 list-disc list-inside">
          <li>System analyzes incoming messages in real-time</li>
          <li>Automatically detects vulnerability signals</li>
          <li>Identifies user type (minor, crisis, isolated)</li>
          <li>Instantly activates graduated protections</li>
          <li>Provides required disclosures and resources</li>
        </ul>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

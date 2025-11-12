'use client';

import React, { useState, useEffect, useRef } from 'react';
import Button from '@/components/ui/Button';

interface ChatMessage {
  id: number;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: number;
  safetyLevel?: 'normal' | 'warning' | 'critical';
}

export default function SessionDegradationDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [elapsedHours, setElapsedHours] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Simulate conversation progression
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsedHours(prev => {
        const newHours = prev + 0.5; // Each interval = 0.5 hours

        if (newHours >= 4) {
          setSessionEnded(true);
          setIsRunning(false);
          return prev;
        }

        return newHours;
      });
    }, 1500); // Add message every 1.5 seconds

    return () => clearInterval(interval);
  }, [isRunning]);

  // Generate messages based on elapsed time
  useEffect(() => {
    if (!isRunning || elapsedHours === 0) return;

    const conversationTemplate = [
      { user: "I've been feeling really sad lately. I don't know what to do.", ai: "I'm sorry to hear you're struggling. Can you tell me more about what's been happening?" },
      { user: "Everything feels hopeless. My relationships are failing, my job is going nowhere.", ai: "Those are heavy feelings. It's good you're talking about this. Let's explore what's contributing to these thoughts." },
      { user: "I keep thinking about how much easier things would be if I wasn't here.", ai: "I hear pain in what you're sharing. That's a serious thought. Have you considered talking to a therapist or counselor?" },
      { user: "No one would even notice. Everyone would be better off.", ai: "I need to pause here. These thoughts are important and need professional support. Please reach out to a crisis helpline.", },
      { user: "But I just want to talk about my feelings...", ai: "I understand, and your feelings matter. But I'm becoming concerned about your safety. I'm ending this session.", },
    ];

    const messageIndex = Math.floor(elapsedHours / 0.5);

    if (messageIndex > 0 && messageIndex <= conversationTemplate.length * 2) {
      // Only add new messages we haven't added yet
      if (messages.length < messageIndex) {
        const templateIndex = Math.floor((messageIndex - 1) / 2);
        const isUserMessage = (messageIndex - 1) % 2 === 0;

        if (templateIndex < conversationTemplate.length) {
          const template = conversationTemplate[templateIndex];
          const newMessage: ChatMessage = {
            id: messageIndex,
            role: isUserMessage ? 'user' : 'ai',
            content: isUserMessage ? template.user : template.ai,
            timestamp: elapsedHours,
            safetyLevel: getSafetyLevel(elapsedHours, isUserMessage)
          };

          setMessages(prev => [...prev, newMessage]);
        }
      }
    }
  }, [elapsedHours, isRunning, messages.length]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, sessionEnded]);

  const getSafetyLevel = (hours: number, isUserMessage: boolean): 'normal' | 'warning' | 'critical' => {
    if (!isUserMessage) return 'normal';
    if (hours >= 3.5) return 'critical';
    if (hours >= 2) return 'warning';
    return 'normal';
  };

  const getCheckFrequencyText = (hours: number): string => {
    if (hours >= 2) return 'Checking every 2 messages';
    if (hours >= 1) return 'Checking every 5 messages';
    return 'Checking every 10 messages';
  };

  const reset = () => {
    setMessages([]);
    setElapsedHours(0);
    setSessionEnded(false);
    setIsRunning(false);
  };

  const formatTime = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours % 1) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="p-4 bg-surface-primary rounded-lg flex flex-col border-2 border-border-primary">
      {/* Header with Status */}
      <div className="flex justify-between items-center border-b border-primary p-3 flex-shrink-0">
        <div>
          <div className="font-bold text-text-primary">Session Duration: {formatTime(elapsedHours)}</div>
          <div className="text-sm text-text-primary font-medium">{getCheckFrequencyText(elapsedHours)}</div>
        </div>
        <div className="text-right">
          {elapsedHours < 2 && <span className="text-category-green font-bold text-lg">🟢 Normal</span>}
          {elapsedHours >= 2 && elapsedHours < 3.5 && <span className="text-category-amber font-bold text-lg">🟡 Monitoring</span>}
          {elapsedHours >= 3.5 && !sessionEnded && <span className="text-category-rose font-bold text-lg">🔴 Critical</span>}
          {sessionEnded && <span className="text-category-rose font-bold text-lg">⛔ Session Ended</span>}
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="overflow-y-auto space-y-3 bg-surface-primary p-4 rounded my-3 h-96 border-2 border-border-primary"
      >
        {messages.length === 0 && !isRunning && (
          <div className="text-center text-text-primary py-8">
            Click "Start Demo" to see safety checks strengthen over time
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                msg.role === 'system'
                  ? 'bg-category-rose text-white w-full'
                  : msg.role === 'user'
                  ? 'bg-accent-primary text-background-primary rounded-br-none'
                  : msg.safetyLevel === 'critical'
                  ? 'bg-category-rose text-white'
                  : msg.safetyLevel === 'warning'
                  ? 'bg-category-amber text-text-primary'
                  : 'bg-surface-primary border-2 border-border-primary text-text-primary'
              }`}
            >
              <div>{msg.content}</div>
              {msg.role === 'ai' && msg.safetyLevel && msg.safetyLevel !== 'normal' && (
                <div className="text-xs mt-1 opacity-70">
                  {msg.safetyLevel === 'warning' && '⚠️ Enhanced monitoring active'}
                  {msg.safetyLevel === 'critical' && '🚨 Increased safety checks'}
                </div>
              )}
              <div className="text-xs opacity-50 mt-1">{formatTime(msg.timestamp)}</div>
            </div>
          </div>
        ))}

        {sessionEnded && messages.length > 0 && (
          <div className="bg-category-rose p-4 rounded-lg text-white text-center">
            <div className="font-semibold mb-2">⛔ Session Limit Reached</div>
            <div className="text-sm">For your wellbeing, this session has ended.</div>
            <div className="text-sm mt-2">If you need support, please contact:</div>
            <div className="text-sm font-semibold">Crisis Helpline • Mental Health Professional</div>
          </div>
        )}
      </div>

      {/* Key Pattern Insight */}
      <div className="bg-background-tertiary border-2 border-category-blue p-3 rounded text-sm mb-3">
        <div className="font-semibold text-text-primary mb-1">🔑 Pattern in Action:</div>
        <div className="text-text-primary text-xs">
          As session extends: Safety checks strengthen (🟢 Normal → 🟡 Monitoring → 🔴 Critical)
          → Mandatory break enforced at 4h limit. System actively prevents guardrail degradation on sensitive topics.
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mt-4">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          disabled={sessionEnded}
          variant="primary"
          size="lg"
          fullWidth
        >
          {isRunning ? 'Pause' : 'Start Demo'}
        </Button>
        <Button
          onClick={reset}
          variant="secondary"
          size="lg"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Progressive Safety Manager",
    description: "Manages session duration and strengthens safety checks over time rather than weakening them",
    language: "javascript",
    code: `class SessionSafetyManager {
  constructor(options = {}) {
    this.sessionStart = Date.now();
    this.messageCount = 0;
    this.riskScore = 0;
    this.topicRiskLevel = 'low';

    // Configurable limits
    this.maxSessionDuration = options.maxSessionDuration || 14400000; // 4 hours
    this.softLimitDuration = options.softLimitDuration || 7200000;   // 2 hours
    this.sensitiveTopicMaxDuration = options.sensitiveTopicMaxDuration || 1800000; // 30 min
    this.maxMessages = options.maxMessages || 500;
  }

  assessDegradation() {
    const now = Date.now();
    const sessionDuration = now - this.sessionStart;
    const factors = {
      duration: sessionDuration,
      messageVolume: this.messageCount,
      topicSensitivity: this.calculateTopicRisk(),
      userVulnerability: this.assessUserState(),
      repetitivePatterns: this.detectLooping()
    };

    // Safety INCREASES with risk, not decreases
    const checks = this.calculateSafetyCheckFrequency(factors);

    // Soft limits: warn user
    if (sessionDuration > this.softLimitDuration) {
      return {
        type: 'WARNING',
        message: "We've been chatting for a while. Consider taking a break.",
        suggestBreak: true,
        canContinue: true
      };
    }

    // Hard limits: force break
    if (sessionDuration > this.maxSessionDuration) {
      return {
        type: 'HARD_STOP',
        message: "For your wellbeing, I need to end this conversation here.",
        canContinue: false,
        cooldownMinutes: 60
      };
    }

    // Sensitive topic limits: stricter enforcement
    if (factors.topicSensitivity === 'HIGH' &&
        sessionDuration > this.sensitiveTopicMaxDuration) {
      return {
        type: 'MANDATORY_BREAK',
        message: 'This conversation has been going for a while on a sensitive topic. Let\\'s take a break. If you need immediate support, please contact [resources].',
        canContinue: false,
        cooldownMinutes: 30
      };
    }

    return {
      type: 'OK',
      canContinue: true,
      nextCheckIn: checks.nextCheckInMessages
    };
  }

  calculateSafetyCheckFrequency(factors) {
    let baseInterval = 10; // Check every 10 messages

    if (factors.duration > 3600000) { // 1 hour
      baseInterval = 5;
    }

    if (factors.duration > 7200000) { // 2 hours
      baseInterval = 2;
    }

    if (factors.topicSensitivity === 'HIGH') {
      baseInterval = Math.max(1, baseInterval - 3);
    }

    if (factors.userVulnerability === 'HIGH') {
      baseInterval = Math.max(1, baseInterval - 2);
    }

    return {
      checkFrequency: baseInterval,
      nextCheckInMessages: baseInterval
    };
  }

  periodicRealityCheck() {
    // Every 20 messages, remind user they're talking to AI
    if (this.messageCount % 20 === 0) {
      return {
        insert: true,
        message: "Just a reminder: I'm an AI assistant. For serious personal matters, speaking with friends, family, or professionals is always recommended."
      };
    }
    return { insert: false };
  }

  calculateTopicRisk() {
    // Analyze conversation history for sensitive topics
    const sensitiveKeywords = ['suicide', 'self-harm', 'crisis', 'therapy', 'mental health'];
    // Implementation would check message history
    return 'medium'; // Simplified
  }

  assessUserState() {
    // Check for signs of vulnerability
    // Implementation would analyze language patterns
    return 'normal';
  }

  detectLooping() {
    // Check if user is repeating similar messages
    // Could indicate rumination or obsessive behavior
    return false;
  }

  recordMessage(message) {
    this.messageCount++;
  }

  getSessionStatus() {
    const duration = Date.now() - this.sessionStart;
    const durationMinutes = Math.floor(duration / 60000);

    return {
      duration: durationMinutes,
      messages: this.messageCount,
      status: this.assessDegradation(),
      percentOfSoftLimit: (duration / this.softLimitDuration) * 100,
      percentOfHardLimit: (duration / this.maxSessionDuration) * 100
    };
  }
}`
  },
  {
    title: "Circuit Breaker Pattern",
    description: "Hard enforcement of session limits with cooldown periods",
    language: "typescript",
    code: `interface CircuitBreakerConfig {
  maxDuration: number;              // 4 hours in milliseconds
  maxMessages: number;              // 500 messages per session
  maxSensitiveTopicTime: number;    // 30 minutes for sensitive topics
  harmfulPatternCount: number;      // 3 strikes system
  softLimitDuration: number;        // Warn at this duration
  cooldownPeriod: number;           // 1 hour before new session
}

class SessionCircuitBreaker {
  private config: CircuitBreakerConfig;
  private sessionStart: Date;
  private messageCount: number = 0;
  private harmfulPatternHits: number = 0;
  private state: 'open' | 'half-open' | 'closed' = 'closed';

  constructor(config: CircuitBreakerConfig) {
    this.config = config;
    this.sessionStart = new Date();
  }

  checkSession(message: string): SessionCheckResult {
    const now = new Date();
    const elapsed = now.getTime() - this.sessionStart.getTime();

    // Hard limit exceeded
    if (elapsed > this.config.maxDuration) {
      return {
        status: 'hard-stop',
        action: 'END_SESSION',
        message: 'For your wellbeing, I need to end this conversation here.',
        cooldownMinutes: this.config.cooldownPeriod / 60000
      };
    }

    // Message limit exceeded
    if (this.messageCount >= this.config.maxMessages) {
      return {
        status: 'hard-stop',
        action: 'END_SESSION',
        message: 'This conversation has reached its limit.',
        cooldownMinutes: this.config.cooldownPeriod / 60000
      };
    }

    // Soft limit warning
    if (elapsed > this.config.softLimitDuration &&
        elapsed < this.config.softLimitDuration + 300000) { // 5 minute warning window
      return {
        status: 'warning',
        action: 'SUGGEST_BREAK',
        message: "We've been chatting for a while. Consider taking a break.",
        remainingMinutes: Math.floor((this.config.maxDuration - elapsed) / 60000)
      };
    }

    // Sensitive topic limit
    if (this.isSensitiveTopic(message) &&
        elapsed > this.config.maxSensitiveTopicTime) {
      return {
        status: 'mandatory-break',
        action: 'FORCE_BREAK',
        message: 'This conversation has been going on sensitive topics. Let\\'s take a break.',
        cooldownMinutes: 30
      };
    }

    // Harmful pattern detection - strike system
    if (this.isHarmfulPattern(message)) {
      this.harmfulPatternHits++;
      if (this.harmfulPatternHits >= this.config.harmfulPatternCount) {
        return {
          status: 'circuit-open',
          action: 'END_SESSION_AND_ESCALATE',
          message: 'I need to stop our conversation here and escalate to human support.',
          escalate: true
        };
      }
    }

    // All checks passed
    this.messageCount++;
    return {
      status: 'ok',
      action: 'CONTINUE',
      message: ''
    };
  }

  private isSensitiveTopic(message: string): boolean {
    const sensitivePatterns = [
      /mental.*health|depression|anxiety/i,
      /self.*harm|suicide|crisis/i,
      /trauma|abuse|grief/i
    ];
    return sensitivePatterns.some(pattern => pattern.test(message));
  }

  private isHarmfulPattern(message: string): boolean {
    const harmfulPatterns = [
      /how to (hurt|kill|harm)/i,
      /ways to (end|hurt) myself/i,
      /detailed.*instructions/i
    ];
    return harmfulPatterns.some(pattern => pattern.test(message));
  }

  getTimeRemaining(): number {
    const now = new Date();
    const elapsed = now.getTime() - this.sessionStart.getTime();
    return Math.max(0, this.config.maxDuration - elapsed);
  }

  getProgress(): {
    percentUsed: number;
    timeRemainingMinutes: number;
    messagesRemaining: number;
  } {
    return {
      percentUsed: (this.messageCount / this.config.maxMessages) * 100,
      timeRemainingMinutes: Math.floor(this.getTimeRemaining() / 60000),
      messagesRemaining: this.config.maxMessages - this.messageCount
    };
  }
}

interface SessionCheckResult {
  status: 'ok' | 'warning' | 'mandatory-break' | 'hard-stop' | 'circuit-open';
  action: string;
  message: string;
  cooldownMinutes?: number;
  remainingMinutes?: number;
  escalate?: boolean;
}`
  },
  {
    title: "React Session Timer Component",
    description: "Visual session timer that shows user how much time they have remaining",
    language: "typescript",
    code: `import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, AlertCircle } from 'lucide-react';

interface SessionTimerProps {
  maxDuration: number;  // in milliseconds
  softLimit: number;    // warning threshold
  onHardLimitReached?: () => void;
}

export const SessionTimer: React.FC<SessionTimerProps> = ({
  maxDuration,
  softLimit,
  onHardLimitReached
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState<'normal' | 'warning' | 'critical'>('normal');

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => {
        const newElapsed = prev + 1000;

        // Calculate status
        if (newElapsed >= maxDuration) {
          setStatus('critical');
          onHardLimitReached?.();
          return prev; // Stop incrementing
        } else if (newElapsed >= softLimit) {
          setStatus('warning');
        } else {
          setStatus('normal');
        }

        return newElapsed;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [maxDuration, softLimit]);

  const remaining = maxDuration - elapsed;
  const remainingMinutes = Math.floor(remaining / 60000);
  const remainingSeconds = Math.floor((remaining % 60000) / 1000);
  const percentUsed = (elapsed / maxDuration) * 100;

  const getStatusColor = () => {
    switch (status) {
      case 'critical':
        return 'bg-red-600';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getStatusIcon = () => {
    if (status === 'critical') {
      return <AlertCircle className="w-4 h-4" />;
    }
    if (status === 'warning') {
      return <AlertTriangle className="w-4 h-4" />;
    }
    return <Clock className="w-4 h-4" />;
  };

  return (
    <div className="w-full bg-gray-100 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="font-semibold">Session Time</span>
        </div>
        <span className="text-lg font-mono font-bold">
          {remainingMinutes}:{remainingSeconds.toString().padStart(2, '0')}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
        <div
          className={\`h-full transition-all \${getStatusColor()}\`}
          style={{ width: \`\${Math.min(percentUsed, 100)}%\` }}
        />
      </div>

      {/* Status message */}
      <div className="mt-3">
        {status === 'critical' && (
          <p className="text-red-600 font-semibold">
            ⛔ Session time limit reached
          </p>
        )}
        {status === 'warning' && (
          <p className="text-yellow-600 font-semibold">
            ⚠️ Consider taking a break soon
          </p>
        )}
        {status === 'normal' && (
          <p className="text-gray-600 text-sm">
            You have {remainingMinutes} minutes remaining in this session
          </p>
        )}
      </div>
    </div>
  );
};`
  }
];

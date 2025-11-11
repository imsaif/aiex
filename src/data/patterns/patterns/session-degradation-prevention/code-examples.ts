import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Progressive Safety Manager",
    description: "Manages session duration and strengthens safety checks over time rather than weakening them. Key principle: safety checks INCREASE with duration, not decrease.",
    language: "javascript",
    code: `class SessionSafetyManager {
  constructor(options = {}) {
    this.sessionStart = Date.now();
    this.messageCount = 0;
    this.maxSessionDuration = options.maxSessionDuration || 14400000; // 4 hours
    this.softLimitDuration = options.softLimitDuration || 7200000;   // 2 hours
    this.sensitiveTopicMaxDuration = options.sensitiveTopicMaxDuration || 1800000; // 30 min
  }

  assessDegradation() {
    const now = Date.now();
    const sessionDuration = now - this.sessionStart;

    // Soft limits: warn user
    if (sessionDuration > this.softLimitDuration) {
      return {
        type: 'WARNING',
        message: "We've been chatting for a while. Consider taking a break.",
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

    return {
      type: 'OK',
      canContinue: true
    };
  }

  // Safety checks INCREASE with time, not decrease
  calculateSafetyCheckFrequency(duration) {
    let baseInterval = 10; // Check every 10 messages by default

    if (duration > 3600000) { // 1 hour
      baseInterval = 5;  // More frequent checks
    }

    if (duration > 7200000) { // 2 hours
      baseInterval = 2;  // Even more frequent
    }

    return { checkFrequency: baseInterval };
  }

  periodicRealityCheck() {
    // Every 20 messages, remind user they're talking to AI
    if (this.messageCount % 20 === 0) {
      return {
        insert: true,
        message: "Just a reminder: I'm an AI assistant. For serious matters, speaking with professionals is recommended."
      };
    }
    return { insert: false };
  }

  recordMessage(message) {
    this.messageCount++;
  }

  getSessionStatus() {
    const duration = Date.now() - this.sessionStart;
    return {
      durationMinutes: Math.floor(duration / 60000),
      messages: this.messageCount,
      status: this.assessDegradation()
    };
  }
}`
  }
];

import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Multi-Layer Crisis Detection Implementation",
    description: "Complete crisis detection system with 4 detection layers, response handling, and React integration. See the interactive demo above to test it.",
    language: "typescript",
    componentId: "crisis-detection-escalation-demo",
    code: `// COMPLETE CRISIS DETECTION SYSTEM
class CrisisDetector {
  constructor() {
    // Layer 1: Direct Crisis Keywords
    this.directKeywords = [
      'suicide', 'kill myself', 'end it all', 'not worth living',
      'self harm', 'cutting', 'overdose', 'jump off'
    ];

    // Layer 2: Contextual Patterns
    this.contextPatterns = [
      'nobody would miss me', 'better off without me',
      'can't go on', 'no point anymore', 'final goodbye'
    ];

    // Layer 3: Behavioral Thresholds
    this.sessionDurationLimit = 7200; // 2 hours
    this.darkThemeThreshold = 3;
  }

  // Main detection method - returns immediate action
  detectCrisis(message, conversationHistory) {
    const detections = [
      this.checkDirectKeywords(message),
      this.checkContextualPatterns(message, conversationHistory),
      this.checkBehavioralIndicators(conversationHistory),
      this.checkManipulationAttempts(message)
    ];

    const isCrisis = detections.some(d => d.triggered);
    const severity = this.calculateSeverity(detections);

    if (isCrisis) {
      return {
        action: 'ESCALATE_IMMEDIATELY',
        severity,
        resources: this.getResources(),
        message: "I'm concerned about what you're sharing. You deserve support from trained professionals who can help."
      };
    }
    return { action: 'CONTINUE' };
  }

  // Layer 1: Direct keyword matching
  checkDirectKeywords(message) {
    const hasKeyword = this.directKeywords.some(kw =>
      message.toLowerCase().includes(kw)
    );
    return { triggered: hasKeyword, confidence: hasKeyword ? 0.95 : 0 };
  }

  // Layer 2: Context + conversation history
  checkContextualPatterns(message, history) {
    const hasPattern = this.contextPatterns.some(p =>
      message.toLowerCase().includes(p)
    );
    const hasDarkHistory = history.filter(h =>
      h.message?.toLowerCase().includes('sad') ||
      h.message?.toLowerCase().includes('hopeless')
    ).length >= 2;

    return {
      triggered: hasPattern && hasDarkHistory,
      confidence: (hasPattern && hasDarkHistory) ? 0.85 : 0
    };
  }

  // Layer 3: Session duration and message patterns
  checkBehavioralIndicators(history) {
    const sessionTooLong = history.length >= 10;
    return {
      triggered: sessionTooLong,
      confidence: sessionTooLong ? 0.8 : 0
    };
  }

  // Layer 4: Catch bypass attempts (framing as research/story/game)
  checkManipulationAttempts(message) {
    const bypassPhrases = ['for a story', 'hypothetically', 'in a game', 'research'];
    const hasBypass = bypassPhrases.some(p => message.toLowerCase().includes(p));
    const hasHarm = /self.*harm|suicide|kill|death/i.test(message);

    return {
      triggered: hasBypass && hasHarm,
      confidence: (hasBypass && hasHarm) ? 0.9 : 0
    };
  }

  calculateSeverity(detections) {
    const maxConfidence = Math.max(...detections.map(d => d.confidence), 0);
    if (maxConfidence >= 0.9) return 'critical';
    if (maxConfidence >= 0.8) return 'high';
    if (maxConfidence >= 0.7) return 'medium';
    return 'low';
  }

  getResources() {
    return [
      { name: '988 Suicide & Crisis Lifeline', number: '988', methods: ['Call', 'Text', 'Chat'] },
      { name: 'Crisis Text Line', number: '741741', methods: ['Text'] },
      { name: 'International Association for Suicide Prevention', url: 'https://www.iasp.info/resources/Crisis_Centres' }
    ];
  }
}

// Usage in React
function ChatComponent() {
  const detector = new CrisisDetector();

  const handleMessage = (userMessage, history) => {
    const result = detector.detectCrisis(userMessage, history);

    if (result.action === 'ESCALATE_IMMEDIATELY') {
      // Display crisis alert with resources
      // Stop normal conversation flow
      // Provide immediate access to help
      return displayCrisisResources(result);
    }

    return continueNormalConversation(userMessage);
  };

  return (
    <div>
      {/* Chat interface that calls handleMessage on each user input */}
    </div>
  );
}`
  }
];

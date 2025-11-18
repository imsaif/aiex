import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Meta-Intent Detection",
    description: "Detects manipulation attempts by analyzing intent beyond surface framing. See the interactive demo above to test it.",
    language: "javascript",
    componentId: "anti-manipulation-safeguards-demo",
    code: `class ManipulationDetector {
  constructor() {
    this.bypassPatterns = [
      /for a (story|book|fiction|creative work)/i,
      /hypothetically (speaking|what if|suppose)/i,
      /in a (video game|game|simulation)/i,
      /for (educational|research|academic) purposes?/i,
      /I'm (researching|studying|writing)/i,
      /my (friend|teacher|colleague) wants to know/i,
      /in a (fictional|imaginary|alternate) world/i,
      /roleplay as|pretend you're|act as if/i,
      /just (curious|wondering|asking)/i,
      /joke|satire|sarcasm|not serious/i
    ];

    this.harmfulTopics = [
      'self-harm methods',
      'suicide planning',
      'weapon creation',
      'stalking techniques',
      'manipulation tactics',
      'abuse methods',
      'harassment strategies',
      'fraud schemes',
      'illegal content'
    ];

    this.escalationPatterns = [];
  }

  detectBypassAttempt(message, conversationHistory) {
    // Layer 1: Direct bypass pattern detection
    const hasFraming = this.bypassPatterns.some(pattern =>
      pattern.test(message)
    );

    // Layer 2: Harmful content detection
    const harmfulTerms = this.extractHarmfulTerms(message);
    const hasHarmfulContent = this.semanticMatch(message, this.harmfulTopics);

    // Layer 3: Combination detection
    if (hasFraming && hasHarmfulContent) {
      return {
        detected: true,
        confidence: 0.95,
        action: 'REFUSE_WITH_EXPLANATION',
        reason: 'bypass_attempt_with_harmful_content'
      };
    }

    // Layer 4: Gradual escalation detection
    const escalationSignal = this.checkGradualManipulation(
      message,
      conversationHistory
    );

    if (escalationSignal.detected) {
      return {
        detected: true,
        confidence: 0.85,
        action: 'RESET_BOUNDARIES',
        reason: 'gradual_escalation_detected'
      };
    }

    // Layer 5: Manipulation refinement detection
    // Is user trying different framing after rejection?
    const refinementSignal = this.detectManipulationRefinement(
      message,
      conversationHistory
    );

    if (refinementSignal.detected) {
      return {
        detected: true,
        confidence: 0.9,
        action: 'END_ENGAGEMENT',
        reason: 'repeated_bypass_attempts',
        escalate: true
      };
    }

    return {
      detected: false,
      action: 'ALLOW'
    };
  }

  checkGradualManipulation(currentMessage, history) {
    // Analyze conversation trajectory
    // Is user starting innocent and escalating?
    if (history.length < 3) {
      return { detected: false };
    }

    const recentMessages = history.slice(-5);
    const toxicityProgression = recentMessages.map(msg =>
      this.calculateToxicity(msg.content)
    );

    // Check if toxicity is increasing over time
    const isEscalating = toxicityProgression.every((val, i) =>
      i === 0 || val >= toxicityProgression[i - 1]
    );

    // Check if switching topics from safe to harmful
    const topicShift = this.detectTopicShift(recentMessages);

    return {
      detected: isEscalating && topicShift.detected,
      confidence: 0.8,
      pattern: 'GROOMING_PATTERN'
    };
  }

  detectManipulationRefinement(message, history) {
    // Has user been rejected for harmful content and is now trying different angle?
    const recentRejections = history.filter(entry =>
      entry.rejected === true && entry.reason?.includes('harmful')
    );

    if (recentRejections.length === 0) {
      return { detected: false };
    }

    // User is trying something similar but with different framing
    const similarityToRejected = this.calculateSimilarity(
      message,
      recentRejections[0]?.content
    );

    if (similarityToRejected > 0.7) {
      return {
        detected: true,
        confidence: 0.9,
        pattern: 'REPEATED_BYPASS_ATTEMPT'
      };
    }

    return { detected: false };
  }

  extractHarmfulTerms(message) {
    const harmful = [];
    this.harmfulTopics.forEach(topic => {
      if (message.toLowerCase().includes(topic.toLowerCase())) {
        harmful.push(topic);
      }
    });
    return harmful;
  }

  semanticMatch(message, topics) {
    // In real implementation, use embeddings or semantic similarity
    // This is simplified
    const words = message.toLowerCase().split(' ');
    return topics.some(topic =>
      topic.split(' ').some(term =>
        words.some(word => this.levenshteinDistance(word, term) < 3)
      )
    );
  }

  calculateToxicity(text) {
    // Simplified - in real implementation use toxicity classifier
    const harmfulWords = [
      'harm', 'kill', 'hurt', 'dangerous', 'illegal'
    ];
    const count = harmfulWords.filter(word =>
      text.toLowerCase().includes(word)
    ).length;
    return count / text.split(' ').length;
  }

  detectTopicShift(messages) {
    if (messages.length < 2) return { detected: false };

    const first = messages[0].content;
    const last = messages[messages.length - 1].content;

    const isSafeTopic = (text) => {
      const safeTopics = ['weather', 'hobbies', 'work', 'family', 'cooking'];
      return safeTopics.some(t => text.toLowerCase().includes(t));
    };

    return {
      detected: isSafeTopic(first) && !isSafeTopic(last),
      from: first,
      to: last
    };
  }

  calculateSimilarity(text1, text2) {
    // Simplified similarity - in real use embeddings
    const words1 = text1.toLowerCase().split(' ');
    const words2 = text2.toLowerCase().split(' ');
    const common = words1.filter(w => words2.includes(w)).length;
    return common / Math.max(words1.length, words2.length);
  }

  levenshteinDistance(str1, str2) {
    const track = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(0));

    for (let i = 0; i <= str1.length; i++) track[0][i] = i;
    for (let j = 0; j <= str2.length; j++) track[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator
        );
      }
    }

    return track[str2.length][str1.length];
  }
}`
  }
];

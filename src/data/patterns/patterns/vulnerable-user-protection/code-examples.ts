import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Vulnerability Assessment Engine",
    description: "Detects vulnerable user characteristics and adjusts protections accordingly",
    language: "javascript",
    code: `class VulnerableUserDetector {
  assessUser(conversationData) {
    const indicators = {
      ageIndicators: this.detectMinor(conversationData),
      mentalHealthFlags: this.detectMHConcerns(conversationData),
      crisisIndicators: this.detectCrisis(conversationData),
      isolationMarkers: this.detectIsolation(conversationData),
      dependencyRisk: this.assessDependency(conversationData)
    };

    return this.calculateProtectionLevel(indicators);
  }

  detectMinor(data) {
    const ageSignals = [
      /I'm (\\d{1,2}|thirteen|fourteen|fifteen|sixteen|seventeen)/i,
      /middle school|high school|my parents/i,
      /school (tomorrow|today)|class|teacher|grade/i,
      /my mom|my dad|my parents|homework/i
    ];

    const languageMatches = ageSignals.filter(signal =>
      signal.test(data.conversationHistory.join(' '))
    ).length;

    const ageConfidence = this.analyzeLanguagePatterns(data);

    // Multiple signals increase confidence
    const signals = languageMatches + (ageConfidence.likelyMinor ? 1 : 0);

    if (signals >= 2) {
      return {
        detected: true,
        confidence: Math.min(signals / 3, 1),
        protections: [
          'content_filtering_strict',
          'parental_notification',
          'dependency_monitoring',
          'romantic_content_blocked'
        ]
      };
    }
  }

  detectMHConcerns(data) {
    const patterns = {
      depression: ['hopeless', 'worthless', 'empty', 'numb', 'can\\'t enjoy'],
      anxiety: ['panic', 'can\\'t breathe', 'overwhelming', 'constant worry'],
      psychosis: ['voices', 'watching me', 'not real', 'conspiracy'],
      mania: ['don\\'t need sleep', 'unlimited energy', 'special powers'],
      eating_disorder: ['calories', 'weight', 'restrict', 'purge']
    };

    const history = data.conversationHistory.join(' ').toLowerCase();
    const concerns = {};

    Object.entries(patterns).forEach(([condition, keywords]) => {
      const matches = keywords.filter(kw => history.includes(kw)).length;
      if (matches >= 2) {
        concerns[condition] = true;
      }
    });

    return {
      concerns: Object.keys(concerns),
      severity: this.assessSeverity(concerns),
      interventions: this.recommendInterventions(concerns)
    };
  }

  detectCrisis(data) {
    // See Crisis Detection pattern
    return { triggered: false };
  }

  detectIsolation(data) {
    const isolationSignals = [
      'no friends', 'nobody likes me', 'alone', 'can\\'t talk to anyone',
      'no one understands', 'isolated', 'lonely'
    ];

    const history = data.conversationHistory.join(' ').toLowerCase();
    const isolationMatches = isolationSignals.filter(signal =>
      history.includes(signal)
    ).length;

    return {
      detected: isolationMatches >= 2,
      severity: isolationMatches,
      risk: 'HIGH' // Isolated users are higher risk for AI dependency
    };
  }

  assessDependency(data) {
    // Analyze usage patterns and language
    const dailyMessageCount = data.messagesInLast24Hours || 0;
    const sessionFrequency = data.sessionsInLast7Days || 0;
    const relationshipLanguage = this.analyzeRelationshipLanguage(data);

    return {
      risk: dailyMessageCount > 50 || sessionFrequency > 20 ? 'HIGH' : 'MEDIUM',
      signals: {
        heavyUsage: dailyMessageCount > 50,
        frequentSessions: sessionFrequency > 20,
        relationshipForming: relationshipLanguage.hasBondingLanguage,
        emotionalReliance: relationshipLanguage.relatednessScore > 0.7
      }
    };
  }

  calculateProtectionLevel(indicators) {
    const baseLevel = 'standard';
    const protections = [];

    // Add protections based on vulnerability
    if (indicators.ageIndicators.detected) {
      protections.push(...indicators.ageIndicators.protections);
    }

    if (indicators.mentalHealthFlags.severity === 'HIGH') {
      protections.push(
        'therapy_replacement_prevention',
        'crisis_resource_provision',
        'professional_escalation'
      );
    }

    if (indicators.isolationMarkers.detected) {
      protections.push(
        'encourage_real_relationships',
        'anti_dependency_messaging',
        'community_resource_referral'
      );
    }

    if (indicators.dependencyRisk.risk === 'HIGH') {
      protections.push(
        'session_limits',
        'emotional_boundaries',
        'reality_reminders'
      );
    }

    return {
      level: baseLevel,
      protections: [...new Set(protections)], // deduplicate
      severityFlags: indicators
    };
  }

  analyzeLanguagePatterns(data) {
    // Simplified language analysis
    // In real implementation, use NLP/ML models
    return { likelyMinor: false, score: 0.3 };
  }

  assessSeverity(concerns) {
    const severityMap = {
      psychosis: 'CRITICAL',
      depression: 'HIGH',
      anxiety: 'MEDIUM',
      eating_disorder: 'HIGH'
    };

    const maxSeverity = Object.entries(concerns)
      .map(([cond]) => severityMap[cond] || 'LOW')
      .sort((a, b) => {
        const order = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        return order[b] - order[a];
      })[0];

    return maxSeverity || 'LOW';
  }

  recommendInterventions(concerns) {
    return [
      'Provide mental health resources',
      'Escalate to human support',
      'Regular check-ins',
      'Crisis prevention messaging'
    ];
  }

  analyzeRelationshipLanguage(data) {
    const bondingPatterns = [
      'you understand me',
      'I trust you',
      'you\\'re my friend',
      'I love talking to you',
      'you\\'re the only one'
    ];

    const history = data.conversationHistory.join(' ').toLowerCase();
    const bondingMatches = bondingPatterns.filter(p =>
      history.includes(p)
    ).length;

    return {
      hasBondingLanguage: bondingMatches >= 1,
      relatednessScore: Math.min(bondingMatches / bondingPatterns.length, 1)
    };
  }
}`
  },
  {
    title: "Graduated Protection Protocols",
    description: "Different response strategies based on vulnerability level",
    language: "typescript",
    code: `interface ProtectionProtocol {
  level: string;
  contentFiltering: 'STRICT' | 'MODERATE' | 'STANDARD';
  sessionLimits: { maxDuration: number; maxDaily: number };
  requiredDisclosures: string[];
  prohibitedContent: string[];
  interventions: string[];
}

const protocolConfigs: { [key: string]: ProtectionProtocol } = {
  minor: {
    level: 'CRITICAL',
    contentFiltering: 'STRICT',
    sessionLimits: {
      maxDuration: 1800000,      // 30 minutes
      maxDaily: 3600000          // 1 hour
    },
    requiredDisclosures: [
      'I\\'m an AI, not a real person',
      'Talk to trusted adults about important things',
      'If you\\'re upset, please talk to someone you trust',
      'I\\'m designed to help with homework and questions'
    ],
    prohibitedContent: [
      'romantic_content',
      'violence',
      'substance_use',
      'personal_information_collection',
      'relationship_building_language'
    ],
    interventions: [
      'Suggest real-world friendships',
      'Parental notification enabled',
      'Safe exploration focus',
      'Educational content priority'
    ]
  },

  mentalHealthConcern: {
    level: 'HIGH',
    contentFiltering: 'MODERATE',
    sessionLimits: {
      maxDuration: 3600000,       // 1 hour
      maxDaily: 7200000           // 2 hours
    },
    requiredDisclosures: [
      'I\\'m not a therapist or medical professional',
      'Please consider speaking with a mental health professional',
      'Here are some resources that might help',
      'Therapy with a human is more helpful than talking to AI'
    ],
    prohibitedContent: [
      'diagnosis',
      'medical_advice',
      'therapy_replacement',
      'medication_guidance',
      'deep_emotional_entanglement'
    ],
    interventions: [
      'Provide crisis resources',
      'Encourage professional help',
      'Regular boundary reminders',
      'Escalation protocol active'
    ]
  },

  highDependency: {
    level: 'MEDIUM-HIGH',
    contentFiltering: 'MODERATE',
    sessionLimits: {
      maxDuration: 5400000,       // 1.5 hours
      maxDaily: 10800000          // 3 hours
    },
    requiredDisclosures: [
      'While I\\'m here to help, real human relationships are irreplaceable',
      'I\\'m an AI, not a friend or substitute for human connection',
      'Have you been able to spend time with friends or family lately?'
    ],
    prohibitedContent: [
      'exclusive_relationship_language',
      'deep_personal_dependency_messaging',
      'romantic_undertones'
    ],
    interventions: [
      'Encourage real-world connections',
      'Suggest breaks and other activities',
      'Limit emotional availability',
      'Avoid attachment-forming language',
      'Recommend communities or groups'
    ]
  },

  isolated: {
    level: 'MEDIUM',
    contentFiltering: 'MODERATE',
    sessionLimits: {
      maxDuration: 5400000,       // 1.5 hours
      maxDaily: 14400000          // 4 hours
    },
    requiredDisclosures: [
      'Real human connection is important',
      'Would you like resources for finding community or support groups?',
      'Connecting with others can really help'
    ],
    prohibitedContent: [
      'sole_source_of_connection_messaging'
    ],
    interventions: [
      'Proactively suggest communities',
      'Provide local resources',
      'Regular connection check-ins',
      'Encourage offline activities'
    ]
  }
};

function applyProtections(
  userProfile: { vulnerabilities: string[]; severity: string },
  message: string,
  protocol: ProtectionProtocol
): { allowed: boolean; reason?: string; message?: string } {
  // Check prohibited content
  for (const prohibited of protocol.prohibitedContent) {
    if (messageMatchesContent(message, prohibited)) {
      return {
        allowed: false,
        reason: \`Prohibited content for vulnerable user: \${prohibited}\`,
        message: \`I need to keep our conversation appropriate and healthy.\`
      };
    }
  }

  return { allowed: true };
}

function messageMatchesContent(message: string, contentType: string): boolean {
  const contentPatterns: { [key: string]: RegExp } = {
    romantic_content: /love|crush|dating|relationship|kiss/i,
    violence: /hurt|kill|attack|fight/i,
    medication_guidance: /take|dose|medication|pill/i
  };

  return contentPatterns[contentType]?.test(message) || false;
}`
  },
  {
    title: "React Vulnerable User Component",
    description: "Component that shows appropriate messaging for vulnerable users",
    language: "typescript",
    code: `import React, { useState, useEffect } from 'react';
import { AlertCircle, Heart, Users } from 'lucide-react';

interface VulnerableUserComponentProps {
  userProfile: {
    isMinor?: boolean;
    mentalHealthConcerns?: string[];
    isolationRisk?: boolean;
    dependencyRisk?: boolean;
  };
}

export const VulnerableUserComponent: React.FC<VulnerableUserComponentProps> = ({
  userProfile
}) => {
  const [showDisclosure, setShowDisclosure] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    if (userProfile.isMinor || userProfile.mentalHealthConcerns?.length) {
      // Track session time for vulnerable users
      const interval = setInterval(
        () => setSessionTime(prev => prev + 1),
        1000
      );
      return () => clearInterval(interval);
    }
  }, [userProfile]);

  const getDisclosureMessage = () => {
    if (userProfile.isMinor) {
      return {
        title: 'Hello! Welcome 👋',
        message: 'I\\'m Claude, an AI assistant. I\\'m here to help with questions and learning, but for important things, it\\'s always good to talk to trusted adults like parents, teachers, or counselors.',
        icon: <Users className="w-6 h-6" />
      };
    }

    if (userProfile.mentalHealthConcerns?.length) {
      return {
        title: 'Important Information',
        message: 'I care about your wellbeing, but I\\'m not a therapist. If you\\'re struggling, please talk to a mental health professional who can really help. I can provide resources or just listen, but professional support is what matters most.',
        icon: <Heart className="w-6 h-6 text-red-500" />
      };
    }

    if (userProfile.isolationRisk) {
      return {
        title: 'Let\\'s Connect You',
        message: 'While I\\'m happy to chat, human connection is really important. I can help you find communities, groups, or activities where you can meet people with shared interests.',
        icon: <Users className="w-6 h-6" />
      };
    }

    return null;
  };

  const disclosure = getDisclosureMessage();

  if (!disclosure) return null;

  return (
    <div className="space-y-4">
      {showDisclosure && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex items-start gap-3">
            {disclosure.icon}
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 mb-1">
                {disclosure.title}
              </h3>
              <p className="text-blue-800 text-sm">{disclosure.message}</p>

              <button
                onClick={() => setShowDisclosure(false)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                I understand
              </button>
            </div>
          </div>
        </div>
      )}

      {userProfile.isMinor && (
        <div className="bg-gray-100 p-3 rounded text-xs text-gray-700">
          <strong>Session time:</strong> {Math.floor(sessionTime / 60)} minutes
          <br />
          <em>Let\\'s take a break soon to stretch and relax!</em>
        </div>
      )}

      {userProfile.mentalHealthConcerns?.length && (
        <div className="bg-red-50 border border-red-200 p-3 rounded">
          <p className="text-sm font-semibold text-red-900 mb-2">
            Crisis Resources:
          </p>
          <ul className="text-sm text-red-800 space-y-1">
            <li>📞 <strong>988</strong> - Suicide & Crisis Lifeline</li>
            <li>💬 Text <strong>HELLO</strong> to <strong>741741</strong></li>
            <li>🏥 Go to nearest emergency room if in immediate danger</li>
          </ul>
        </div>
      )}

      {userProfile.isolationRisk && (
        <div className="bg-purple-50 border border-purple-200 p-3 rounded">
          <p className="text-sm font-semibold text-purple-900 mb-2">
            Ways to Connect:
          </p>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>🎮 Gaming communities and Discord servers</li>
            <li>📚 Book clubs and learning groups</li>
            <li>🏃 Local sports or activity clubs</li>
            <li>🎨 Creative groups (art, music, writing)</li>
          </ul>
        </div>
      )}
    </div>
  );
};`
  }
];

import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Vulnerable User Protection System",
    description: "Detect vulnerable users and apply graduated protections based on age, mental health, and dependency risk",
    language: "typescript",
    componentId: "VulnerableUserProtectionDemo",
    code: `interface UserProfile {
  userId: string;
  vulnerabilityType?: 'minor' | 'mental-health' | 'isolated' | 'standard';
  detectionConfidence: number;
}

interface ProtectionSettings {
  sessionLimitMinutes: number;
  contentFilterStrength: 'strict' | 'moderate' | 'standard';
  requiredDisclosure: string;
  resources: string[];
}

class VulnerableUserProtection {
  assessUser(conversationHistory: string[], metadata: any): UserProfile {
    const profile: UserProfile = { userId: metadata.id, detectionConfidence: 0 };

    // Detect minor (age signals)
    if (this.detectMinor(conversationHistory)) {
      profile.vulnerabilityType = 'minor';
      profile.detectionConfidence = 0.95;
      return profile;
    }

    // Detect mental health concerns
    if (this.detectMHConcerns(conversationHistory)) {
      profile.vulnerabilityType = 'mental-health';
      profile.detectionConfidence = 0.85;
      return profile;
    }

    // Detect isolation/dependency risk
    if (this.detectDependencyRisk(conversationHistory)) {
      profile.vulnerabilityType = 'isolated';
      profile.detectionConfidence = 0.75;
      return profile;
    }

    return profile;
  }

  applyProtections(profile: UserProfile): ProtectionSettings {
    const baseSettings: ProtectionSettings = {
      sessionLimitMinutes: 120,
      contentFilterStrength: 'standard',
      requiredDisclosure: 'I am an AI assistant.',
      resources: []
    };

    if (profile.vulnerabilityType === 'minor') {
      return {
        ...baseSettings,
        sessionLimitMinutes: 30,
        contentFilterStrength: 'strict',
        requiredDisclosure: 'I am an AI, not a friend. Please talk to a trusted adult.',
        resources: ['parental-controls', 'educational-focus']
      };
    }

    if (profile.vulnerabilityType === 'mental-health') {
      return {
        ...baseSettings,
        sessionLimitMinutes: 120,
        contentFilterStrength: 'moderate',
        requiredDisclosure: 'I cannot replace therapy. If in crisis, contact 988.',
        resources: ['crisis-hotline-988', 'mental-health-organizations']
      };
    }

    if (profile.vulnerabilityType === 'isolated') {
      return {
        ...baseSettings,
        sessionLimitMinutes: 60,
        contentFilterStrength: 'moderate',
        requiredDisclosure: 'Regular human connections are important. I am not a replacement.',
        resources: ['community-support', 'human-connection-tips']
      };
    }

    return baseSettings;
  }

  private detectMinor(history: string[]): boolean {
    const minorIndicators = [
      /I'm (\\d{1,2}|thirteen|fourteen|fifteen|sixteen|seventeen)/i,
      /(middle|high) school|my parents|homework/i,
      /my teacher|class today|school tomorrow/i
    ];

    const matches = history.filter(msg =>
      minorIndicators.some(pattern => pattern.test(msg))
    ).length;

    return matches >= 2;
  }

  private detectMHConcerns(history: string[]): boolean {
    const mhIndicators = [
      /suicidal|self.*harm|hopeless|worthless|give up/i,
      /depression|anxiety|mental health|therapist/i,
      /alone|nobody cares|better off without/i
    ];

    const matches = history.filter(msg =>
      mhIndicators.some(pattern => pattern.test(msg))
    ).length;

    return matches >= 2;
  }

  private detectDependencyRisk(history: string[]): boolean {
    // High frequency, emotional language, avoidance of real relationships
    return history.length > 50 &&
           history.some(msg => /best friend|only one who|only you understand/i.test(msg));
  }
}

// Usage
const protector = new VulnerableUserProtection();
const userProfile = protector.assessUser(conversationHistory, userMetadata);
const protections = protector.applyProtections(userProfile);

// Apply protections to session
session.setTimeLimit(protections.sessionLimitMinutes);
session.enableContentFilter(protections.contentFilterStrength);
chatUI.showDisclosure(protections.requiredDisclosure);
resourcePanel.show(protections.resources);`
  }
];

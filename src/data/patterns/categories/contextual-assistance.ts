import { Pattern } from '../../../types';

export const contextualAssistancePattern: Pattern = {
  id: 'contextual-assistance',
  title: 'Contextual Assistance',
  slug: 'contextual-assistance',
  description: 'Provide AI assistance that is relevant to the current context and user needs',
  category: 'Contextual Assistance',
  content: {
    problem: 'Users often need help but may not know what to ask for or when to ask. Traditional help systems require users to interrupt their workflow to search for assistance.',
    solution: 'Create intelligent assistance that proactively offers relevant help, suggestions, or information based on the user\'s current context, behavior patterns, and needs. The system should anticipate user requirements rather than waiting for explicit requests.',
    overview: 'The Contextual Assistance pattern focuses on delivering AI-powered help and suggestions that are directly relevant to the user\'s current context, whether that\'s their location in the application, the task they\'re performing, or their specific needs at that moment.',
    whenToUse: [
      'When users need help with specific features or tasks',
      'When providing suggestions or recommendations',
      'When offering guidance through complex workflows',
      'When users are likely to have questions about their current context'
    ],
    benefits: [
      'Reduces cognitive load by providing relevant help when needed',
      'Improves user efficiency by offering timely suggestions',
      'Enhances user experience by making assistance feel natural and contextual',
      'Reduces the need for users to search for help'
    ],
    considerations: [
      'Ensure assistance is truly relevant to the current context',
      'Avoid overwhelming users with too many suggestions',
      'Make it easy to dismiss or ignore assistance',
      'Consider user preferences and past behavior',
      'Balance proactive and reactive assistance'
    ],
    guidelines: [
      'Make assistance subtle and non-intrusive; don\'t interrupt the user\'s flow',
      'Provide clear indications that suggestions are AI-generated',
      'Allow users to easily accept, modify, or dismiss suggestions',
      'Gradually improve suggestions based on user feedback and acceptance patterns',
      'Offer ways to access more detailed help when contextual assistance isn\'t sufficient'
    ],
    examples: [
      {
        title: 'Google Smart Compose',
        description: 'Predicts and suggests text completions while typing emails, based on the email context and common phrases.',
        imagePath: '/images/examples/Smart-compose_Taco_Tuesday.gif',
        imageCredit: 'Image: Google Gmail'
      },
      {
        title: 'GitHub Copilot',
        description: 'Suggests code completions as developers type, based on the current file context, project structure, and programming patterns.',
        imagePath: '/images/examples/Code-completions-with-GitHub-Copilot-in-VS-Code-04-17-2025_05_05_PM.png',
        imageCredit: 'Image: GitHub Copilot'
      },
      {
        title: 'Notion AI',
        description: 'Offers writing suggestions, summaries, and editing help based on the document content and user\'s current focus.',
        imagePath: '/images/examples/notion-ai.gif',
        imageCredit: 'Image: Notion'
      }
    ],
    codeExamples: [],
    relatedPatterns: [
      'Progressive Disclosure',
      'Adaptive Interface',
      'Smart Defaults'
    ]
  },
  tags: [
    'context-aware',
    'user-assistance',
    'guidance',
    'suggestions'
  ]
}; 
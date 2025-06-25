import { Pattern } from '../../../types';

export const progressiveDisclosurePattern: Pattern = {
  id: 'progressive-disclosure',
  title: 'Progressive Disclosure',
  slug: 'progressive-disclosure',
  description: 'Gradually reveal features and information to users based on their needs and expertise level',
  category: 'Progressive Disclosure',
  content: {
    problem: 'Complex applications often overwhelm users with too many features and options at once, leading to cognitive overload and reduced usability.',
    solution: 'Implement a system that gradually reveals features, options, and information to users based on their current needs, expertise level, and context. Start with essential features and progressively introduce more advanced functionality.',
    overview: 'The Progressive Disclosure pattern helps manage complexity by showing users only what they need when they need it. This approach reduces initial cognitive load while ensuring advanced features remain accessible as users become more familiar with the application.',
    whenToUse: [
      'When building applications with many features or complex functionality',
      'When serving users with varying levels of expertise',
      'When dealing with complex workflows or decision trees',
      'When implementing AI features that need to be introduced gradually'
    ],
    benefits: [
      'Reduces initial cognitive load for new users',
      'Improves learnability by introducing features progressively',
      'Maintains accessibility of advanced features for power users',
      'Creates a more focused and less overwhelming user experience'
    ],
    considerations: [
      'Carefully plan the order of feature disclosure',
      'Ensure essential features are immediately accessible',
      'Provide clear paths to discover advanced features',
      'Consider user expertise levels and learning curves',
      'Balance simplicity with feature accessibility'
    ],
    guidelines: [
      'Start with core features that meet basic user needs',
      'Use clear visual cues to indicate additional available features',
      'Provide contextual help for newly revealed features',
      'Allow users to customize their feature discovery pace',
      'Maintain consistency in how features are progressively revealed'
    ],
    examples: [
      {
        title: 'Adobe Photoshop',
        description: 'Offers a simplified interface for beginners while maintaining access to advanced features through menus and panels.',
        imagePath: '/images/examples/photoshop-interface.png',
        imageCredit: 'Image: Adobe Photoshop'
      },
      {
        title: 'Microsoft Office',
        description: 'Provides a simplified ribbon interface with expandable sections for advanced features.',
        imagePath: '/images/examples/office-ribbon.png',
        imageCredit: 'Image: Microsoft Office'
      },
      {
        title: 'Figma',
        description: 'Gradually introduces advanced design features and collaboration tools as users become more familiar with the platform.',
        imagePath: '/images/examples/figma-interface.png',
        imageCredit: 'Image: Figma'
      }
    ],
    codeExamples: [],
    relatedPatterns: [
      'Contextual Assistance',
      'Adaptive Interface',
      'Guided Learning'
    ]
  },
  tags: [
    'complexity-management',
    'user-experience',
    'feature-discovery',
    'learning-curve'
  ]
}; 
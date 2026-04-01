#!/usr/bin/env node

/**
 * AI Pattern Content Generator Agent
 * A specialized tool for generating complete AI design patterns for the aiex project
 * 
 * This agent understands the project structure and generates patterns following
 * established conventions including TypeScript interfaces, React components,
 * and consistent styling patterns.
 */

const fs = require('fs');
const path = require('path');

class AIPatternGenerator {
  constructor() {
    this.projectRoot = path.join(__dirname, '../..');
    this.patternsDir = path.join(this.projectRoot, 'src', 'data', 'patterns', 'patterns');
    this.categoriesPath = path.join(this.projectRoot, 'src', 'data', 'categories.ts');
    
    // Load existing categories to understand structure
    this.loadExistingCategories();
  }

  loadExistingCategories() {
    try {
      const categoriesContent = fs.readFileSync(this.categoriesPath, 'utf8');
      // Extract category information for pattern generation
      this.existingCategories = this.parseCategoriesFromFile(categoriesContent);
    } catch (error) {
      console.error('Error loading categories:', error);
      this.existingCategories = [];
    }
  }

  parseCategoriesFromFile(content) {
    const categories = [];
    const categoryMatches = content.match(/{\s*id:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",[\s\S]*?description:\s*"([^"]+)"[\s\S]*?}/g);
    
    if (categoryMatches) {
      categoryMatches.forEach(match => {
        const idMatch = match.match(/id:\s*"([^"]+)"/);
        const titleMatch = match.match(/title:\s*"([^"]+)"/);
        const descMatch = match.match(/description:\s*"([^"]+)"/);
        
        if (idMatch && titleMatch && descMatch) {
          categories.push({
            id: idMatch[1],
            title: titleMatch[1],
            description: descMatch[1]
          });
        }
      });
    }
    
    return categories;
  }

  /**
   * Generate a complete pattern based on category information
   */
  async generatePattern(categoryId, options = {}) {
    const category = this.existingCategories.find(cat => cat.id === categoryId);
    if (!category) {
      throw new Error(`Category ${categoryId} not found`);
    }

    console.log(`🤖 Generating pattern for: ${category.title}`);
    
    const patternData = this.generatePatternData(category, options);
    const patternDir = path.join(this.patternsDir, categoryId);
    
    // Create pattern directory
    if (!fs.existsSync(patternDir)) {
      fs.mkdirSync(patternDir, { recursive: true });
    }

    // Generate all required files
    await this.generatePatternFiles(patternDir, patternData);
    
    console.log(`✅ Pattern ${category.title} generated successfully!`);
    console.log(`📁 Location: ${patternDir}`);
    
    return patternData;
  }

  generatePatternData(category, options) {
    const patternId = category.id;
    const title = category.title;
    const description = category.description;

    // Generate pattern-specific content based on category
    const patternContent = this.generatePatternContent(category, options);

    return {
      id: patternId,
      title,
      description,
      category: title,
      ...patternContent
    };
  }

  generatePatternContent(category, options) {
    // Pattern-specific content generation based on category type
    const contentGenerators = {
      'augmented-creation': () => this.generateAugmentedCreationContent(),
      'responsible-ai-design': () => this.generateResponsibleAIContent(),
      'error-recovery': () => this.generateErrorRecoveryContent(),
      'collaborative-ai': () => this.generateCollaborativeAIContent(),
      'ambient-intelligence': () => this.generateAmbientIntelligenceContent(),
      'safe-exploration': () => this.generateSafeExplorationContent(),
    };

    const generator = contentGenerators[category.id];
    if (generator) {
      return generator();
    }

    // Default content generation
    return this.generateDefaultContent(category);
  }

  generateAugmentedCreationContent() {
    return {
      problem: "Content creation can be time-consuming and challenging, especially when users face creative blocks or need to produce high-quality content efficiently.",
      solution: "Provide AI-powered tools that collaborate with users in the creative process, offering suggestions, improvements, and assistance while maintaining human creative control and authorship.",
      examples: [
        {
          title: "GitHub Copilot",
          description: "AI pair programmer that suggests code completions and entire functions based on context and comments.",
          image: "/images/examples/github-copilot-highlighting.gif",
          altText: "GitHub Copilot suggesting code completions"
        },
        {
          title: "Figma AI",
          description: "Design assistant that generates layouts, suggests colors, and creates design variations based on user input.",
          image: "/images/examples/figma-ai-design.gif",
          altText: "Figma AI generating design variations"
        },
        {
          title: "GPT-4 Writing Assistant",
          description: "Collaborative writing tool that helps with brainstorming, drafting, and editing while preserving the author's voice.",
          image: "/images/examples/gpt-writing-assistant.gif",
          altText: "AI writing assistant providing suggestions"
        }
      ],
      guidelines: [
        "Maintain clear boundaries between AI suggestions and human decisions",
        "Provide multiple creative options rather than single solutions",
        "Allow users to easily iterate and refine AI-generated content",
        "Preserve the user's creative voice and intent throughout the process",
        "Make the AI's contribution transparent and adjustable"
      ],
      considerations: [
        "Ensure users maintain ownership and control over their creative work",
        "Provide clear attribution when AI contributes significantly to content",
        "Consider the learning curve for users new to AI-assisted creation",
        "Balance automation with human creativity to avoid over-dependence",
        "Address potential copyright and originality concerns"
      ]
    };
  }

  generateResponsibleAIContent() {
    return {
      problem: "AI systems can perpetuate biases, make unfair decisions, or cause harm if not designed with ethical considerations and inclusive practices in mind.",
      solution: "Implement design practices that prioritize fairness, transparency, accountability, and user welfare throughout the AI system lifecycle, from development to deployment.",
      examples: [
        {
          title: "LinkedIn Bias Detection",
          description: "Tools that detect and mitigate bias in job recommendations and candidate matching algorithms.",
          image: "/images/examples/linkedin-bias-detection.gif",
          altText: "LinkedIn bias detection interface"
        },
        {
          title: "Google AI Principles",
          description: "Comprehensive framework for responsible AI development with clear ethical guidelines and review processes.",
          image: "/images/examples/google-ai-principles.png",
          altText: "Google AI principles dashboard"
        },
        {
          title: "Microsoft Responsible AI",
          description: "Tools and practices for identifying and addressing potential harms in AI systems before deployment.",
          image: "/images/examples/microsoft-responsible-ai.gif",
          altText: "Microsoft responsible AI toolkit"
        }
      ],
      guidelines: [
        "Conduct regular bias audits and testing across diverse user groups",
        "Provide clear explanations for AI decisions that affect users",
        "Implement human oversight for high-stakes AI decisions",
        "Design inclusive interfaces that work for users with disabilities",
        "Establish clear accountability chains for AI system decisions"
      ],
      considerations: [
        "Balance personalization with user privacy and data protection",
        "Consider long-term societal impacts of AI system deployment",
        "Ensure diverse representation in AI development and testing teams",
        "Provide users with meaningful control over AI decision-making",
        "Regularly update systems to address newly identified ethical concerns"
      ]
    };
  }

  generateErrorRecoveryContent() {
    return {
      problem: "AI systems inevitably make mistakes or encounter situations they cannot handle, potentially frustrating users or causing system failures.",
      solution: "Design graceful degradation mechanisms and clear recovery paths that maintain user trust while providing alternative solutions when AI fails.",
      examples: [
        {
          title: "Google Assistant Fallbacks",
          description: "When voice recognition fails, the system offers alternative input methods and clarification prompts.",
          image: "/images/examples/google-assistant-fallback.gif",
          altText: "Google Assistant providing fallback options"
        },
        {
          title: "Spotify Recommendation Recovery",
          description: "When music recommendations miss the mark, users can easily provide feedback and get alternative suggestions.",
          image: "/images/examples/spotify-recovery.gif",
          altText: "Spotify recommendation feedback interface"
        },
        {
          title: "Tesla Autopilot Handoff",
          description: "Clear visual and audio cues alert drivers when the AI needs human intervention, ensuring safe transitions.",
          image: "/images/examples/tesla-handoff.gif",
          altText: "Tesla autopilot handoff interface"
        }
      ],
      guidelines: [
        "Provide clear indicators when AI confidence is low or uncertain",
        "Offer multiple recovery options when primary AI solutions fail",
        "Make error states informative rather than just displaying generic messages",
        "Allow users to easily bypass AI and use manual alternatives",
        "Learn from failures to improve future AI performance"
      ],
      considerations: [
        "Maintain user trust even when AI systems make mistakes",
        "Ensure critical functions have reliable non-AI backup options",
        "Provide appropriate user education about AI limitations",
        "Design recovery flows that don't frustrate or confuse users",
        "Consider the safety implications of AI failures in critical applications"
      ]
    };
  }

  generateCollaborativeAIContent() {
    return {
      problem: "Teams need to collaborate effectively with AI systems while maintaining coordination, shared understanding, and human relationships.",
      solution: "Create AI interfaces that enhance team collaboration by facilitating shared decision-making, maintaining context across team members, and supporting group workflows.",
      examples: [
        {
          title: "Notion Team AI",
          description: "AI assistant that helps teams collaboratively edit documents, suggest improvements, and maintain consistency across team content.",
          image: "/images/examples/notion-team-ai.gif",
          altText: "Notion AI team collaboration features"
        },
        {
          title: "Slack AI Coordinator",
          description: "Bot that helps teams schedule meetings, summarize discussions, and coordinate project tasks across channels.",
          image: "/images/examples/slack-ai-coordinator.gif",
          altText: "Slack AI coordinating team activities"
        },
        {
          title: "Figma AI Design System",
          description: "Collaborative design tool that maintains consistency and suggests improvements as teams work on shared projects.",
          image: "/images/examples/figma-collaborative-ai.gif",
          altText: "Figma AI maintaining design consistency"
        }
      ],
      guidelines: [
        "Maintain transparency about AI contributions in collaborative work",
        "Provide shared context and history accessible to all team members",
        "Enable easy handoffs between AI assistance and human collaboration",
        "Support different collaboration styles and team dynamics",
        "Preserve individual agency within collaborative AI-enhanced workflows"
      ],
      considerations: [
        "Balance AI efficiency with human relationship building",
        "Ensure equitable access to AI assistance across team members",
        "Consider privacy and confidentiality in team AI interactions",
        "Address potential over-reliance on AI for team coordination",
        "Maintain clear attribution for AI vs. human contributions"
      ]
    };
  }

  generateAmbientIntelligenceContent() {
    return {
      problem: "Users need intelligent assistance without the cognitive overhead of explicit interaction, especially in contexts where attention is focused elsewhere.",
      solution: "Create AI systems that operate unobtrusively in the background, sensing context and providing assistance without requiring direct user interaction or interrupting current tasks.",
      examples: [
        {
          title: "Apple Siri Suggestions",
          description: "Proactive suggestions for apps, contacts, and actions based on time, location, and usage patterns without explicit requests.",
          image: "/images/examples/siri-suggestions.gif",
          altText: "Siri providing contextual suggestions"
        },
        {
          title: "Google Pixel Call Screen",
          description: "Automatically screens unknown calls and provides context without user intervention, filtering spam while preserving important calls.",
          image: "/images/examples/pixel-call-screen.gif",
          altText: "Google Pixel call screening in action"
        },
        {
          title: "Nest Learning Thermostat",
          description: "Learns user preferences and schedules to automatically adjust temperature without manual programming.",
          image: "/images/examples/nest-learning.gif",
          altText: "Nest thermostat learning user patterns"
        }
      ],
      guidelines: [
        "Operate transparently without being intrusive or attention-demanding",
        "Provide value through passive observation rather than active interaction",
        "Make ambient actions easily discoverable and controllable when needed",
        "Respect user privacy while gathering contextual information",
        "Allow users to understand and modify ambient AI behavior"
      ],
      considerations: [
        "Balance helpful automation with user privacy and consent",
        "Avoid creating dependency on ambient systems for basic tasks",
        "Ensure ambient AI doesn't interfere with user focus or attention",
        "Provide clear ways to disable or modify ambient AI behavior",
        "Consider the psychological impact of pervasive background AI"
      ]
    };
  }

  generateSafeExplorationContent() {
    return {
      problem: "Users need to experiment with AI capabilities and learn through trial and error, but fear making mistakes or causing unintended consequences.",
      solution: "Provide safe, controlled environments where users can explore AI features without risk, including sandboxing, undo mechanisms, and clear boundaries between safe and production use.",
      examples: [
        {
          title: "OpenAI Playground",
          description: "Safe environment for experimenting with language models, testing prompts, and learning AI capabilities without production consequences.",
          image: "/images/examples/openai-playground.gif",
          altText: "OpenAI Playground interface"
        },
        {
          title: "GitHub Copilot Labs",
          description: "Experimental features and safe testing environment for new AI coding capabilities before they reach production.",
          image: "/images/examples/copilot-labs.gif",
          altText: "GitHub Copilot Labs experimental features"
        },
        {
          title: "Photoshop AI Beta",
          description: "Separate workspace for testing AI-powered editing features with easy revert options and non-destructive editing.",
          image: "/images/examples/photoshop-ai-beta.gif",
          altText: "Photoshop AI beta testing environment"
        }
      ],
      guidelines: [
        "Clearly distinguish between safe exploration and production environments",
        "Provide comprehensive undo and revert capabilities",
        "Offer guided tutorials and examples for safe experimentation",
        "Set clear boundaries and limitations for exploration features",
        "Make consequences of actions transparent before execution"
      ],
      considerations: [
        "Ensure exploration environments truly prevent unintended consequences",
        "Balance safety with realistic representation of AI capabilities",
        "Provide clear pathways from exploration to productive use",
        "Consider user confidence building through safe practice",
        "Address the learning curve from safe exploration to real-world application"
      ]
    };
  }

  generateDefaultContent(category) {
    return {
      problem: `Users face challenges related to ${category.description.toLowerCase()}.`,
      solution: `Implement ${category.title.toLowerCase()} to address these challenges effectively.`,
      examples: [
        {
          title: `Example 1: ${category.title}`,
          description: `A practical implementation of ${category.title.toLowerCase()}.`,
          image: "/images/examples/placeholder.gif",
          altText: `${category.title} example`
        }
      ],
      guidelines: [
        `Implement clear ${category.title.toLowerCase()} principles`,
        "Maintain user control and transparency",
        "Provide appropriate feedback and guidance"
      ],
      considerations: [
        "Consider user privacy and data protection",
        "Ensure accessibility and inclusive design",
        "Test with diverse user groups"
      ]
    };
  }

  async generatePatternFiles(patternDir, patternData) {
    // Generate index.ts
    const indexContent = this.generateIndexFile(patternData);
    fs.writeFileSync(path.join(patternDir, 'index.ts'), indexContent);

    // Generate examples.ts
    const examplesContent = this.generateExamplesFile(patternData.examples);
    fs.writeFileSync(path.join(patternDir, 'examples.ts'), examplesContent);

    // Generate guidelines.ts
    const guidelinesContent = this.generateGuidelinesFile(patternData.guidelines);
    fs.writeFileSync(path.join(patternDir, 'guidelines.ts'), guidelinesContent);

    // Generate considerations.ts
    const considerationsContent = this.generateConsiderationsFile(patternData.considerations);
    fs.writeFileSync(path.join(patternDir, 'considerations.ts'), considerationsContent);

    // Generate code-examples.ts
    const codeExamplesContent = this.generateCodeExamplesFile(patternData);
    fs.writeFileSync(path.join(patternDir, 'code-examples.ts'), codeExamplesContent);
  }

  generateIndexFile(patternData) {
    const slug = patternData.id;
    const exportName = slug.replace(/-/g, '');
    
    return `import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const ${exportName}: Pattern = {
  id: "${patternData.id}",
  title: "${patternData.title}",
  slug: "${slug}",
  description: "${patternData.description}",
  category: "${patternData.category}",
  thumbnail: "/images/examples/${patternData.examples[0]?.image?.split('/').pop() || 'placeholder.gif'}",
  content: {
    problem: "${patternData.problem}",
    solution: "${patternData.solution}",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Contextual Assistance",
      "Progressive Disclosure",
      "Human-in-the-Loop"
    ],
    codeExamples
  }
};
`;
  }

  generateExamplesFile(examples) {
    const examplesCode = examples.map(example => `  {
    title: "${example.title}",
    description: "${example.description}",
    image: "${example.image}",
    altText: "${example.altText}"
  }`).join(',\n');

    return `import { Example } from '../../../../types';

export const examples: Example[] = [
${examplesCode}
];
`;
  }

  generateGuidelinesFile(guidelines) {
    const guidelinesCode = guidelines.map(guideline => `  "${guideline}"`).join(',\n');
    
    return `export const guidelines: string[] = [
${guidelinesCode}
];
`;
  }

  generateConsiderationsFile(considerations) {
    const considerationsCode = considerations.map(consideration => `  "${consideration}"`).join(',\n');
    
    return `export const considerations: string[] = [
${considerationsCode}
];
`;
  }

  generateCodeExamplesFile(patternData) {
    const componentName = patternData.id.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('') + 'Demo';

    const componentCode = this.generateReactComponent(patternData, componentName);

    return `import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "${patternData.title} Interactive Demo",
    description: "This React component demonstrates ${patternData.title.toLowerCase()} with practical implementation following best practices for user experience and accessibility.",
    language: "tsx",
    componentId: "${patternData.id}-demo",
    code: \`${componentCode.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`
  }
];
`;
  }

  generateReactComponent(patternData, componentName) {
    // Generate component based on pattern type
    const componentGenerators = {
      'augmented-creation': () => this.generateAugmentedCreationComponent(),
      'responsible-ai-design': () => this.generateResponsibleAIComponent(),
      'error-recovery': () => this.generateErrorRecoveryComponent(),
      'collaborative-ai': () => this.generateCollaborativeAIComponent(),
      'ambient-intelligence': () => this.generateAmbientIntelligenceComponent(),
      'safe-exploration': () => this.generateSafeExplorationComponent(),
    };

    const generator = componentGenerators[patternData.id];
    return generator ? generator() : this.generateDefaultComponent(componentName);
  }

  generateAugmentedCreationComponent() {
    return `'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreativeSuggestion {
  id: string;
  type: 'text' | 'image' | 'style';
  content: string;
  confidence: number;
}

interface CreationSession {
  content: string;
  suggestions: CreativeSuggestion[];
  history: string[];
}

export default function AugmentedCreationDemo() {
  const [session, setSession] = useState<CreationSession>({
    content: '',
    suggestions: [],
    history: []
  });
  const [activeTab, setActiveTab] = useState<'write' | 'design' | 'code'>('write');
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const generateSuggestions = async (content: string) => {
    if (content.length < 10) return;
    
    setIsGenerating(true);
    
    // Simulate AI suggestion generation
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const suggestions: CreativeSuggestion[] = [
      {
        id: '1',
        type: 'text',
        content: 'Continue with: "This innovative approach could revolutionize how we think about..."',
        confidence: 0.85
      },
      {
        id: '2',
        type: 'style',
        content: 'Make this more conversational and engaging',
        confidence: 0.78
      },
      {
        id: '3',
        type: 'text',
        content: 'Add supporting examples or case studies here',
        confidence: 0.72
      }
    ];
    
    setSession(prev => ({ ...prev, suggestions }));
    setIsGenerating(false);
  };

  const applySuggestion = (suggestion: CreativeSuggestion) => {
    let newContent = session.content;
    
    if (suggestion.type === 'text') {
      newContent += ' ' + suggestion.content;
    }
    
    setSession(prev => ({
      ...prev,
      content: newContent,
      history: [...prev.history, prev.content],
      suggestions: prev.suggestions.filter(s => s.id !== suggestion.id)
    }));
  };

  const undoLastChange = () => {
    if (session.history.length > 0) {
      const previousContent = session.history[session.history.length - 1];
      setSession(prev => ({
        ...prev,
        content: previousContent,
        history: prev.history.slice(0, -1)
      }));
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateSuggestions(session.content);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [session.content]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Creative Assistant</h2>
        <p className="text-gray-600">Collaborate with AI to enhance your creative process</p>
      </header>

      <div className="flex mb-4 space-x-1 bg-gray-100 rounded-lg p-1">
        {(['write', 'design', 'code'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={\`flex-1 py-2 px-4 rounded-md transition-colors \${
              activeTab === tab 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }\`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Creative Canvas</span>
              <button
                onClick={undoLastChange}
                disabled={session.history.length === 0}
                className="text-xs px-3 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Undo
              </button>
            </div>
            <textarea
              ref={textareaRef}
              className="w-full p-4 h-64 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start creating... AI will suggest improvements as you work"
              value={session.content}
              onChange={(e) => setSession(prev => ({ ...prev, content: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-blue-900">AI Suggestions</h3>
              {isGenerating && (
                <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              )}
            </div>

            <AnimatePresence>
              {session.suggestions.length > 0 ? (
                <div className="space-y-2">
                  {session.suggestions.map((suggestion) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white border border-blue-200 rounded-md p-3 cursor-pointer hover:bg-blue-50 transition-colors"
                      onClick={() => applySuggestion(suggestion)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-xs font-medium text-blue-600 uppercase">
                          {suggestion.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {Math.round(suggestion.confidence * 100)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{suggestion.content}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-blue-600">
                  {isGenerating ? 'Analyzing your content...' : 'Start writing to get AI suggestions'}
                </p>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Creation Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Words:</span>
                <span className="font-medium">{session.content.trim().split(/\\s+/).filter(w => w).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">AI Assists:</span>
                <span className="font-medium">{session.history.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Active Suggestions:</span>
                <span className="font-medium">{session.suggestions.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;
  }

  generateResponsibleAIComponent() {
    return `'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BiasAlert {
  id: string;
  type: 'gender' | 'racial' | 'age' | 'accessibility';
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestion: string;
}

interface EthicsReport {
  overallScore: number;
  biasAlerts: BiasAlert[];
  inclusivityScore: number;
  transparencyScore: number;
}

export default function ResponsibleAIDemo() {
  const [content, setContent] = useState('');
  const [ethicsReport, setEthicsReport] = useState<EthicsReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPrinciples, setShowPrinciples] = useState(false);

  const analyzeContent = async (text: string) => {
    if (text.length < 20) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI ethics analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const biasAlerts: BiasAlert[] = [];
    
    // Simulate bias detection
    if (text.toLowerCase().includes('he') && !text.toLowerCase().includes('she')) {
      biasAlerts.push({
        id: '1',
        type: 'gender',
        severity: 'medium',
        description: 'Potential gender bias detected in pronoun usage',
        suggestion: 'Consider using gender-neutral pronouns or inclusive language'
      });
    }
    
    if (text.toLowerCase().includes('simple') || text.toLowerCase().includes('easy')) {
      biasAlerts.push({
        id: '2',
        type: 'accessibility',
        severity: 'low',
        description: 'Language may not be accessible to all users',
        suggestion: 'Consider that complexity varies for different users'
      });
    }

    const report: EthicsReport = {
      overallScore: Math.max(60, 90 - biasAlerts.length * 15),
      biasAlerts,
      inclusivityScore: Math.random() * 40 + 60,
      transparencyScore: Math.random() * 30 + 70
    };
    
    setEthicsReport(report);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      analyzeContent(content);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [content]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Responsible AI Analyzer</h2>
          <p className="text-gray-600">Detect bias and ensure ethical AI practices</p>
        </div>
        <button
          onClick={() => setShowPrinciples(!showPrinciples)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          AI Ethics Principles
        </button>
      </header>

      <AnimatePresence>
        {showPrinciples && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <h3 className="font-semibold text-blue-900 mb-3">Core AI Ethics Principles</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div>
                    <span className="font-medium text-blue-800">Fairness:</span>
                    <span className="text-blue-700"> Avoid discriminatory outcomes</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div>
                    <span className="font-medium text-blue-800">Transparency:</span>
                    <span className="text-blue-700"> Make AI decisions understandable</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div>
                    <span className="font-medium text-blue-800">Accountability:</span>
                    <span className="text-blue-700"> Clear responsibility chains</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div>
                    <span className="font-medium text-blue-800">Privacy:</span>
                    <span className="text-blue-700"> Protect user data and rights</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Content Analysis</span>
            </div>
            <textarea
              className="w-full p-4 h-64 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter content to analyze for bias, inclusivity, and ethical concerns..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Ethics Score</h3>
              {isAnalyzing && (
                <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              )}
            </div>

            {ethicsReport && (
              <div className="space-y-3">
                <div className="text-center">
                  <div className={\`text-3xl font-bold \${getScoreColor(ethicsReport.overallScore)}\`}>
                    {ethicsReport.overallScore}
                  </div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Inclusivity:</span>
                    <span className={\`font-medium \${getScoreColor(ethicsReport.inclusivityScore)}\`}>
                      {Math.round(ethicsReport.inclusivityScore)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transparency:</span>
                    <span className={\`font-medium \${getScoreColor(ethicsReport.transparencyScore)}\`}>
                      {Math.round(ethicsReport.transparencyScore)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {ethicsReport && ethicsReport.biasAlerts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-3">Bias Alerts</h3>
              <div className="space-y-2">
                {ethicsReport.biasAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={\`p-3 rounded-md border \${getSeverityColor(alert.severity)}\`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium uppercase">
                        {alert.type} bias
                      </span>
                      <span className="text-xs">{alert.severity}</span>
                    </div>
                    <p className="text-sm mb-2">{alert.description}</p>
                    <p className="text-xs italic">{alert.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Best Practices</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Use inclusive language</li>
              <li>• Test with diverse users</li>
              <li>• Provide clear explanations</li>
              <li>• Enable user control</li>
              <li>• Regular bias audits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}`;
  }

  generateErrorRecoveryComponent() {
    return `'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIError {
  id: string;
  type: 'confidence' | 'timeout' | 'unavailable' | 'unexpected';
  message: string;
  recoveryOptions: RecoveryOption[];
  confidence?: number;
}

interface RecoveryOption {
  id: string;
  label: string;
  action: 'retry' | 'fallback' | 'manual' | 'feedback';
  description: string;
}

type SystemState = 'working' | 'low-confidence' | 'error' | 'recovering';

export default function ErrorRecoveryDemo() {
  const [query, setQuery] = useState('');
  const [systemState, setSystemState] = useState<SystemState>('working');
  const [currentError, setCurrentError] = useState<AIError | null>(null);
  const [results, setResults] = useState<string[]>([]);
  const [confidence, setConfidence] = useState(100);
  const [retryCount, setRetryCount] = useState(0);

  const simulateAIProcess = async (input: string) => {
    if (input.length === 0) return;

    setResults([]);
    
    // Simulate different error scenarios based on input
    const scenarios: { [key: string]: () => void } = {
      'error': () => simulateError(),
      'timeout': () => simulateTimeout(),
      'low confidence': () => simulateLowConfidence(),
      'unavailable': () => simulateUnavailable(),
    };

    const lowerInput = input.toLowerCase();
    const matchedScenario = Object.keys(scenarios).find(key => lowerInput.includes(key));
    
    if (matchedScenario) {
      scenarios[matchedScenario]();
    } else {
      // Normal successful operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSystemState('working');
      setConfidence(Math.random() * 30 + 70);
      setResults([
        \`Result 1 for "\${input}"\`,
        \`Result 2 for "\${input}"\`,
        \`Result 3 for "\${input}"\`
      ]);
    }
  };

  const simulateError = () => {
    setSystemState('error');
    setCurrentError({
      id: 'unexpected-error',
      type: 'unexpected',
      message: 'An unexpected error occurred while processing your request.',
      recoveryOptions: [
        {
          id: 'retry',
          label: 'Try Again',
          action: 'retry',
          description: 'Retry the same request'
        },
        {
          id: 'simplify',
          label: 'Simplify Query',
          action: 'fallback',
          description: 'Try a simpler version of your request'
        },
        {
          id: 'manual',
          label: 'Manual Search',
          action: 'manual',
          description: 'Switch to traditional search'
        },
        {
          id: 'feedback',
          label: 'Report Issue',
          action: 'feedback',
          description: 'Help us improve by reporting this error'
        }
      ]
    });
  };

  const simulateTimeout = () => {
    setSystemState('error');
    setCurrentError({
      id: 'timeout-error',
      type: 'timeout',
      message: 'The AI is taking longer than expected to respond.',
      recoveryOptions: [
        {
          id: 'wait',
          label: 'Wait Longer',
          action: 'retry',
          description: 'Give the AI more time to process'
        },
        {
          id: 'fallback',
          label: 'Quick Results',
          action: 'fallback',
          description: 'Get faster, simpler results'
        },
        {
          id: 'manual',
          label: 'Manual Search',
          action: 'manual',
          description: 'Switch to traditional search'
        }
      ]
    });
  };

  const simulateLowConfidence = () => {
    setSystemState('low-confidence');
    setConfidence(35);
    setCurrentError({
      id: 'low-confidence',
      type: 'confidence',
      message: 'AI confidence is low for this query. Results may not be accurate.',
      confidence: 35,
      recoveryOptions: [
        {
          id: 'proceed',
          label: 'Show Results Anyway',
          action: 'fallback',
          description: 'View results with caution'
        },
        {
          id: 'rephrase',
          label: 'Rephrase Query',
          action: 'manual',
          description: 'Try asking in a different way'
        },
        {
          id: 'manual',
          label: 'Manual Search',
          action: 'manual',
          description: 'Use traditional search instead'
        }
      ]
    });
  };

  const simulateUnavailable = () => {
    setSystemState('error');
    setCurrentError({
      id: 'unavailable',
      type: 'unavailable',
      message: 'AI service is temporarily unavailable.',
      recoveryOptions: [
        {
          id: 'fallback',
          label: 'Basic Search',
          action: 'fallback',
          description: 'Use simplified search functionality'
        },
        {
          id: 'notify',
          label: 'Notify When Available',
          action: 'feedback',
          description: 'Get notified when AI is back online'
        },
        {
          id: 'manual',
          label: 'Manual Search',
          action: 'manual',
          description: 'Use traditional search'
        }
      ]
    });
  };

  const handleRecovery = async (option: RecoveryOption) => {
    setSystemState('recovering');
    setCurrentError(null);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    switch (option.action) {
      case 'retry':
        setRetryCount(prev => prev + 1);
        if (retryCount < 2) {
          simulateAIProcess(query);
        } else {
          // After multiple retries, show fallback
          setSystemState('working');
          setResults(['Simplified result for: ' + query]);
        }
        break;
      case 'fallback':
        setSystemState('working');
        setResults(['Fallback result for: ' + query]);
        break;
      case 'manual':
        setSystemState('working');
        setResults(['Manual search result for: ' + query]);
        break;
      case 'feedback':
        setSystemState('working');
        alert('Thank you for your feedback! Our team will review this issue.');
        break;
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      simulateAIProcess(query);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const getSystemStatusColor = () => {
    switch (systemState) {
      case 'working': return 'bg-green-100 text-green-800';
      case 'low-confidence': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'recovering': return 'bg-blue-100 text-blue-800';
    }
  };

  const getSystemStatusText = () => {
    switch (systemState) {
      case 'working': return 'AI Working Normally';
      case 'low-confidence': return 'Low Confidence Warning';
      case 'error': return 'Error Detected';
      case 'recovering': return 'Recovering...';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Error Recovery System</h2>
        <p className="text-gray-600">Demonstrating graceful error handling and recovery options</p>
      </header>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            AI Search Query
          </label>
          <div className={\`px-3 py-1 rounded-full text-xs font-medium \${getSystemStatusColor()}\`}>
            {getSystemStatusText()}
          </div>
        </div>
        
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Try: 'error', 'timeout', 'low confidence', 'unavailable', or any other query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
        <div className="mt-2 text-sm text-gray-500">
          Test different error scenarios: "error", "timeout", "low confidence", "unavailable"
        </div>
      </div>

      <AnimatePresence>
        {currentError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 mb-1">
                  {currentError.type.charAt(0).toUpperCase() + currentError.type.slice(1)} Error
                </h3>
                <p className="text-sm text-red-700 mb-3">{currentError.message}</p>
                
                {currentError.confidence && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-red-600 mb-1">
                      <span>Confidence Level</span>
                      <span>{currentError.confidence}%</span>
                    </div>
                    <div className="w-full bg-red-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: \`\${currentError.confidence}%\` }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-red-800">Recovery Options:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentError.recoveryOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleRecovery(option)}
                        className="text-left p-3 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <div className="font-medium text-red-800 text-sm">{option.label}</div>
                        <div className="text-xs text-red-600 mt-1">{option.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {systemState === 'working' && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden"
        >
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Search Results</span>
            {confidence < 70 && (
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                Confidence: {Math.round(confidence)}%
              </span>
            )}
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-800">{result}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {systemState === 'recovering' && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mr-3"></div>
          <span className="text-gray-600">Applying recovery solution...</span>
        </div>
      )}
    </div>
  );
}`;
  }

  generateCollaborativeAIComponent() {
    return `'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'busy';
}

interface AIContribution {
  id: string;
  type: 'suggestion' | 'edit' | 'analysis';
  content: string;
  timestamp: Date;
  confidence: number;
}

interface CollaborationSession {
  document: string;
  members: TeamMember[];
  aiContributions: AIContribution[];
  activeUsers: string[];
}

export default function CollaborativeAIDemo() {
  const [session, setSession] = useState<CollaborationSession>({
    document: '',
    members: [
      { id: '1', name: 'Alice Johnson', avatar: '👩‍💼', status: 'online' },
      { id: '2', name: 'Bob Smith', avatar: '👨‍💻', status: 'online' },
      { id: '3', name: 'Carol Williams', avatar: '👩‍🎨', status: 'away' }
    ],
    aiContributions: [],
    activeUsers: ['1', '2']
  });

  const [showAIInsights, setShowAIInsights] = useState(true);
  const [selectedContribution, setSelectedContribution] = useState<string | null>(null);

  const generateAIContribution = async (document: string) => {
    if (document.length < 20) return;

    await new Promise(resolve => setTimeout(resolve, 2000));

    const contributionTypes = ['suggestion', 'edit', 'analysis'] as const;
    const type = contributionTypes[Math.floor(Math.random() * contributionTypes.length)];
    
    const contributions = {
      suggestion: [
        "Consider adding more specific examples to support your main points",
        "This section could benefit from a clearer transition to the next topic",
        "The conclusion might be stronger with a call-to-action"
      ],
      edit: [
        "Suggested edit: Replace 'very good' with 'excellent' for stronger impact",
        "Grammar improvement: 'which are' should be 'that are' in this context",
        "Style suggestion: Consider breaking this long sentence into two shorter ones"
      ],
      analysis: [
        "Document sentiment: Positive (87% confidence)",
        "Readability score: Grade 8 level - appropriate for general audience",
        "Key themes identified: Innovation, collaboration, efficiency"
      ]
    };

    const newContribution: AIContribution = {
      id: Date.now().toString(),
      type,
      content: contributions[type][Math.floor(Math.random() * contributions[type].length)],
      timestamp: new Date(),
      confidence: Math.random() * 30 + 70
    };

    setSession(prev => ({
      ...prev,
      aiContributions: [...prev.aiContributions.slice(-4), newContribution]
    }));
  };

  const applyAIContribution = (contributionId: string) => {
    const contribution = session.aiContributions.find(c => c.id === contributionId);
    if (!contribution) return;

    // Simulate applying the AI contribution
    if (contribution.type === 'edit') {
      const improvedDocument = session.document + " [AI improvement applied]";
      setSession(prev => ({ ...prev, document: improvedDocument }));
    }

    // Remove the applied contribution
    setSession(prev => ({
      ...prev,
      aiContributions: prev.aiContributions.filter(c => c.id !== contributionId)
    }));
  };

  const simulateTeamActivity = () => {
    // Simulate team members joining/leaving
    setSession(prev => {
      const activeUsers = prev.members
        .filter(() => Math.random() > 0.3)
        .map(m => m.id);
      
      return { ...prev, activeUsers };
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateAIContribution(session.document);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [session.document]);

  useEffect(() => {
    const interval = setInterval(simulateTeamActivity, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'busy': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getContributionIcon = (type: string) => {
    switch (type) {
      case 'suggestion': return '💡';
      case 'edit': return '✏️';
      case 'analysis': return '📊';
      default: return '🤖';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Collaborative AI Workspace</h2>
          <p className="text-gray-600">Real-time collaboration with AI assistance</p>
        </div>
        <button
          onClick={() => setShowAIInsights(!showAIInsights)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showAIInsights ? 'Hide' : 'Show'} AI Insights
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Shared Document</span>
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {session.members
                    .filter(member => session.activeUsers.includes(member.id))
                    .map(member => (
                      <div
                        key={member.id}
                        className="relative w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white"
                        title={member.name}
                      >
                        <span className="text-sm">{member.avatar}</span>
                        <div className={\`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white \${getStatusColor(member.status)}\`}></div>
                      </div>
                    ))}
                </div>
                <span className="text-xs text-gray-500">
                  {session.activeUsers.length} active
                </span>
              </div>
            </div>
            <textarea
              className="w-full p-4 h-96 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start collaborating... AI will provide suggestions as your team works together"
              value={session.document}
              onChange={(e) => setSession(prev => ({ ...prev, document: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-3">Team Members</h3>
            <div className="space-y-2">
              {session.members.map(member => (
                <div key={member.id} className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm">{member.avatar}</span>
                    </div>
                    <div className={\`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white \${getStatusColor(member.status)}\`}></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{member.status}</div>
                  </div>
                  {session.activeUsers.includes(member.id) && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {showAIInsights && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-purple-50 border border-purple-200 rounded-lg p-4"
              >
                <h3 className="font-medium text-purple-900 mb-3 flex items-center">
                  <span className="mr-2">🤖</span>
                  AI Contributions
                </h3>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {session.aiContributions.length > 0 ? (
                    session.aiContributions.map(contribution => (
                      <motion.div
                        key={contribution.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white border border-purple-200 rounded-md p-3 cursor-pointer hover:bg-purple-50 transition-colors"
                        onClick={() => setSelectedContribution(
                          selectedContribution === contribution.id ? null : contribution.id
                        )}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{getContributionIcon(contribution.type)}</span>
                            <span className="text-xs font-medium text-purple-700 uppercase">
                              {contribution.type}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {Math.round(contribution.confidence)}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{contribution.content}</p>
                        
                        <AnimatePresence>
                          {selectedContribution === contribution.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 pt-2 border-t border-purple-200"
                            >
                              <div className="flex space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    applyAIContribution(contribution.id);
                                  }}
                                  className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                                >
                                  Apply
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSession(prev => ({
                                      ...prev,
                                      aiContributions: prev.aiContributions.filter(c => c.id !== contribution.id)
                                    }));
                                  }}
                                  className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                                >
                                  Dismiss
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-purple-600 italic">
                      AI will provide suggestions as you collaborate...
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Collaboration Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Active Members:</span>
                <span className="font-medium">{session.activeUsers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">AI Contributions:</span>
                <span className="font-medium">{session.aiContributions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Document Length:</span>
                <span className="font-medium">{session.document.length} chars</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;
  }

  generateAmbientIntelligenceComponent() {
    return `'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AmbientInsight {
  id: string;
  type: 'contextual' | 'predictive' | 'adaptive' | 'proactive';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  dismissed?: boolean;
}

interface UserContext {
  timeOfDay: string;
  activity: string;
  location: string;
  focus: number;
}

export default function AmbientIntelligenceDemo() {
  const [userContext, setUserContext] = useState<UserContext>({
    timeOfDay: 'morning',
    activity: 'working',
    location: 'office',
    focus: 85
  });

  const [ambientInsights, setAmbientInsights] = useState<AmbientInsight[]>([]);
  const [showInsights, setShowInsights] = useState(true);
  const [ambientMode, setAmbientMode] = useState<'active' | 'minimal' | 'off'>('active');

  const generateAmbientInsights = () => {
    const insights: AmbientInsight[] = [];
    
    // Time-based insights
    if (userContext.timeOfDay === 'morning') {
      insights.push({
        id: 'morning-productivity',
        type: 'contextual',
        title: 'Peak Productivity Window',
        description: 'Your focus levels are typically highest right now. Consider tackling complex tasks.',
        confidence: 87,
        priority: 'medium'
      });
    }

    // Activity-based insights
    if (userContext.activity === 'working' && userContext.focus < 70) {
      insights.push({
        id: 'focus-break',
        type: 'proactive',
        title: 'Break Suggestion',
        description: 'Your focus has decreased. A 5-minute break might help restore concentration.',
        confidence: 78,
        priority: 'low'
      });
    }

    // Location-based insights
    if (userContext.location === 'office') {
      insights.push({
        id: 'meeting-prep',
        type: 'predictive',
        title: 'Upcoming Meeting',
        description: 'You have a meeting in 30 minutes. Would you like to review the agenda?',
        confidence: 92,
        priority: 'high'
      });
    }

    // Adaptive insights based on patterns
    insights.push({
      id: 'workflow-optimization',
      type: 'adaptive',
      title: 'Workflow Pattern Detected',
      description: 'You tend to check email every 15 minutes. Batching could improve focus.',
      confidence: 65,
      priority: 'low'
    });

    return insights.filter(insight => !insight.dismissed);
  };

  const dismissInsight = (insightId: string) => {
    setAmbientInsights(prev =>
      prev.map(insight =>
        insight.id === insightId ? { ...insight, dismissed: true } : insight
      )
    );
  };

  const actOnInsight = (insightId: string) => {
    const insight = ambientInsights.find(i => i.id === insightId);
    if (insight) {
      // Simulate acting on the insight
      switch (insight.type) {
        case 'proactive':
          setUserContext(prev => ({ ...prev, focus: Math.min(100, prev.focus + 15) }));
          break;
        case 'adaptive':
          // Simulate workflow adjustment
          break;
      }
      dismissInsight(insightId);
    }
  };

  const updateContext = (changes: Partial<UserContext>) => {
    setUserContext(prev => ({ ...prev, ...changes }));
  };

  useEffect(() => {
    if (ambientMode !== 'off') {
      const insights = generateAmbientInsights();
      setAmbientInsights(insights);
    } else {
      setAmbientInsights([]);
    }
  }, [userContext, ambientMode]);

  useEffect(() => {
    // Simulate ambient intelligence monitoring
    const interval = setInterval(() => {
      // Gradually decrease focus over time
      setUserContext(prev => ({
        ...prev,
        focus: Math.max(20, prev.focus - Math.random() * 5)
      }));

      // Update time of day
      const hour = new Date().getHours();
      let timeOfDay = 'morning';
      if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
      else if (hour >= 17) timeOfDay = 'evening';
      
      setUserContext(prev => ({ ...prev, timeOfDay }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-300 bg-red-50';
      case 'medium': return 'border-yellow-300 bg-yellow-50';
      case 'low': return 'border-blue-300 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contextual': return '🎯';
      case 'predictive': return '🔮';
      case 'adaptive': return '🧠';
      case 'proactive': return '⚡';
      default: return '🤖';
    }
  };

  const visibleInsights = ambientInsights.filter(insight => !insight.dismissed);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ambient Intelligence Dashboard</h2>
          <p className="text-gray-600">AI that works quietly in the background</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={ambientMode}
            onChange={(e) => setAmbientMode(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="active">Active Mode</option>
            <option value="minimal">Minimal Mode</option>
            <option value="off">Off</option>
          </select>
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {showInsights ? 'Hide' : 'Show'} Insights
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-4">Context Simulation</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time of Day</label>
                <select
                  value={userContext.timeOfDay}
                  onChange={(e) => updateContext({ timeOfDay: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity</label>
                <select
                  value={userContext.activity}
                  onChange={(e) => updateContext({ activity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="working">Working</option>
                  <option value="meeting">In Meeting</option>
                  <option value="break">On Break</option>
                  <option value="commuting">Commuting</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={userContext.location}
                  onChange={(e) => updateContext({ location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="office">Office</option>
                  <option value="home">Home</option>
                  <option value="cafe">Cafe</option>
                  <option value="travel">Traveling</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Focus Level: {userContext.focus}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={userContext.focus}
                  onChange={(e) => updateContext({ focus: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={\`h-2 rounded-full transition-all duration-300 \${
                      userContext.focus >= 70 ? 'bg-green-500' :
                      userContext.focus >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }\`}
                    style={{ width: \`\${userContext.focus}%\` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Main Workspace</span>
            </div>
            <div className="p-8 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💻</span>
              </div>
              <p>Your main work area</p>
              <p className="text-sm">AI observes context and provides subtle assistance</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 mb-3">Ambient Mode</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-purple-700">Status:</span>
                <span className={\`font-medium \${ambientMode === 'active' ? 'text-green-600' : ambientMode === 'minimal' ? 'text-yellow-600' : 'text-gray-600'}\`}>
                  {ambientMode.charAt(0).toUpperCase() + ambientMode.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Active Insights:</span>
                <span className="font-medium">{visibleInsights.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Context Updates:</span>
                <span className="font-medium">Real-time</span>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showInsights && ambientMode !== 'off' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <h3 className="font-medium text-gray-900">Ambient Insights</h3>
                {visibleInsights.length > 0 ? (
                  visibleInsights.map((insight) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={\`border rounded-lg p-3 \${getPriorityColor(insight.priority)}\`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span>{getTypeIcon(insight.type)}</span>
                          <span className="text-xs font-medium uppercase text-gray-600">
                            {insight.type}
                          </span>
                        </div>
                        <button
                          onClick={() => dismissInsight(insight.id)}
                          className="text-gray-400 hover:text-gray-600 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {insight.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {insight.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {insight.confidence}% confidence
                        </span>
                        {insight.type === 'proactive' && (
                          <button
                            onClick={() => actOnInsight(insight.id)}
                            className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                          >
                            Act
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    <p>No ambient insights at the moment</p>
                    <p className="text-xs mt-1">AI is quietly monitoring context...</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Privacy Controls</h3>
            <div className="space-y-2 text-sm text-green-700">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                Context awareness
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                Productivity insights
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Location tracking
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Biometric monitoring
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;
  }

  generateSafeExplorationComponent() {
    return `'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExperimentSession {
  id: string;
  name: string;
  description: string;
  changes: string[];
  canUndo: boolean;
  isActive: boolean;
}

interface SafetyGuard {
  id: string;
  type: 'data' | 'permission' | 'reversibility' | 'scope';
  message: string;
  level: 'info' | 'warning' | 'error';
}

export default function SafeExplorationDemo() {
  const [currentSession, setCurrentSession] = useState<ExperimentSession | null>(null);
  const [experiments, setExperiments] = useState<ExperimentSession[]>([]);
  const [safetyGuards, setSafetyGuards] = useState<SafetyGuard[]>([]);
  const [explorationMode, setExplorationMode] = useState<'sandbox' | 'guided' | 'freeform'>('sandbox');
  const [experimentName, setExperimentName] = useState('');
  const [showSafetyInfo, setShowSafetyInfo] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const startExperiment = (name: string, description: string) => {
    const newExperiment: ExperimentSession = {
      id: Date.now().toString(),
      name,
      description,
      changes: [],
      canUndo: true,
      isActive: true
    };

    setCurrentSession(newExperiment);
    setExperiments(prev => [...prev, newExperiment]);

    // Generate appropriate safety guards
    generateSafetyGuards(explorationMode);
  };

  const generateSafetyGuards = (mode: string) => {
    const guards: SafetyGuard[] = [];

    if (mode === 'sandbox') {
      guards.push({
        id: 'sandbox-isolation',
        type: 'scope',
        message: 'This experiment is isolated from your main data and settings',
        level: 'info'
      });
    }

    guards.push({
      id: 'auto-backup',
      type: 'data',
      message: 'Automatic backup created before starting experiment',
      level: 'info'
    });

    guards.push({
      id: 'time-limit',
      type: 'scope',
      message: 'Experiment will auto-expire in 24 hours for safety',
      level: 'warning'
    });

    if (mode === 'freeform') {
      guards.push({
        id: 'advanced-warning',
        type: 'permission',
        message: 'Advanced mode: Some changes may require manual review',
        level: 'warning'
      });
    }

    setSafetyGuards(guards);
  };

  const makeExperimentalChange = (change: string) => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      changes: [...currentSession.changes, change]
    };

    setCurrentSession(updatedSession);
    setExperiments(prev =>
      prev.map(exp => exp.id === updatedSession.id ? updatedSession : exp)
    );

    // Simulate safety checks
    if (change.toLowerCase().includes('delete') || change.toLowerCase().includes('remove')) {
      setSafetyGuards(prev => [...prev, {
        id: 'destructive-action',
        type: 'data',
        message: 'Destructive action detected - backup automatically created',
        level: 'warning'
      }]);
    }
  };

  const undoLastChange = () => {
    if (!currentSession || currentSession.changes.length === 0) return;

    const updatedSession = {
      ...currentSession,
      changes: currentSession.changes.slice(0, -1)
    };

    setCurrentSession(updatedSession);
    setExperiments(prev =>
      prev.map(exp => exp.id === updatedSession.id ? updatedSession : exp)
    );
  };

  const endExperiment = (save: boolean = false) => {
    if (!currentSession) return;

    if (save) {
      // Simulate saving experimental changes
      alert('Experimental changes have been saved to your main workspace!');
    } else {
      // Simulate discarding changes
      alert('Experimental changes have been discarded. Your main workspace is unchanged.');
    }

    setCurrentSession(null);
    setSafetyGuards([]);
  };

  const getSafetyGuardColor = (level: string) => {
    switch (level) {
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getSafetyGuardIcon = (type: string) => {
    switch (type) {
      case 'data': return '🔒';
      case 'permission': return '⚠️';
      case 'reversibility': return '↩️';
      case 'scope': return '🎯';
      default: return '🛡️';
    }
  };

  const predefinedExperiments = [
    {
      name: 'AI Writing Style',
      description: 'Experiment with different AI writing styles and tones'
    },
    {
      name: 'Interface Layout',
      description: 'Try new interface arrangements and components'
    },
    {
      name: 'Data Visualization',
      description: 'Explore different ways to visualize your data'
    },
    {
      name: 'Automation Rules',
      description: 'Test new automation workflows safely'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Safe Exploration Playground</h2>
          <p className="text-gray-600">Experiment freely without fear of breaking anything</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={explorationMode}
            onChange={(e) => setExplorationMode(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="sandbox">Sandbox Mode</option>
            <option value="guided">Guided Mode</option>
            <option value="freeform">Freeform Mode</option>
          </select>
          <button
            onClick={() => setShowSafetyInfo(!showSafetyInfo)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Safety Info
          </button>
        </div>
      </header>

      <AnimatePresence>
        {showSafetyInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <h3 className="font-semibold text-green-900 mb-3">🛡️ Safety Features</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700">
              <div className="space-y-2">
                <div>• <strong>Isolated Environment:</strong> Changes don't affect your main workspace</div>
                <div>• <strong>Automatic Backups:</strong> Your data is automatically backed up</div>
                <div>• <strong>Easy Undo:</strong> Every action can be reversed</div>
              </div>
              <div className="space-y-2">
                <div>• <strong>Time Limits:</strong> Experiments auto-expire for safety</div>
                <div>• <strong>Clear Boundaries:</strong> You'll always know what's experimental</div>
                <div>• <strong>Choose Your Level:</strong> From guided tutorials to free exploration</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {!currentSession ? (
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-4">Start New Experiment</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experiment Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="My AI Experiment"
                      value={experimentName}
                      onChange={(e) => setExperimentName(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => startExperiment(
                      experimentName || 'Quick Experiment',
                      'Custom experiment created by user'
                    )}
                    disabled={!experimentName.trim()}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Start Custom Experiment
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Quick Start Templates</span>
                </div>
                <div className="p-4 space-y-3">
                  {predefinedExperiments.map((experiment, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => startExperiment(experiment.name, experiment.description)}
                    >
                      <h4 className="font-medium text-gray-900">{experiment.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{experiment.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-blue-900">
                    🧪 Active Experiment: {currentSession.name}
                  </h3>
                  <div className="space-x-2">
                    <button
                      onClick={undoLastChange}
                      disabled={currentSession.changes.length === 0}
                      className="text-xs px-3 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Undo Last
                    </button>
                    <button
                      onClick={() => endExperiment(false)}
                      className="text-xs px-3 py-1 bg-red-200 text-red-600 rounded hover:bg-red-300"
                    >
                      Discard
                    </button>
                    <button
                      onClick={() => endExperiment(true)}
                      className="text-xs px-3 py-1 bg-green-200 text-green-600 rounded hover:bg-green-300"
                    >
                      Save & Apply
                    </button>
                  </div>
                </div>
                <p className="text-sm text-blue-700">{currentSession.description}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Experiment Workspace</span>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Try an experimental change:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => makeExperimentalChange('Changed color scheme to dark mode')}
                        className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                      >
                        Dark Mode
                      </button>
                      <button
                        onClick={() => makeExperimentalChange('Enabled advanced AI suggestions')}
                        className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                      >
                        AI Boost
                      </button>
                      <button
                        onClick={() => makeExperimentalChange('Rearranged interface layout')}
                        className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        New Layout
                      </button>
                      <button
                        onClick={() => makeExperimentalChange('Added experimental feature')}
                        className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Beta Feature
                      </button>
                    </div>
                  </div>

                  {currentSession.changes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Changes Made:</h4>
                      <div className="space-y-1">
                        {currentSession.changes.map((change, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-gray-50 rounded px-2 py-1">
                            {index + 1}. {change}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {safetyGuards.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-3">🛡️ Safety Guards</h3>
              <div className="space-y-2">
                {safetyGuards.map(guard => (
                  <div
                    key={guard.id}
                    className={\`p-2 rounded border \${getSafetyGuardColor(guard.level)}\`}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-sm">{getSafetyGuardIcon(guard.type)}</span>
                      <div className="flex-1">
                        <p className="text-xs font-medium uppercase tracking-wide mb-1">
                          {guard.type}
                        </p>
                        <p className="text-sm">{guard.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Exploration History</h3>
            {experiments.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {experiments.map(experiment => (
                  <div
                    key={experiment.id}
                    className={\`p-2 rounded border \${
                      experiment.isActive && currentSession?.id === experiment.id
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }\`}
                  >
                    <div className="font-medium text-sm">{experiment.name}</div>
                    <div className="text-xs text-gray-600">
                      {experiment.changes.length} changes made
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 italic">No experiments yet</p>
            )}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Safe Exploration Tips</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Start with templates if you're new</li>
              <li>• All changes are reversible</li>
              <li>• Experiment freely - nothing can break</li>
              <li>• Save only changes you want to keep</li>
              <li>• Ask for help anytime</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}`;
  }

  generateDefaultComponent(componentName) {
    return `'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ${componentName}() {
  const [isActive, setIsActive] = useState(false);
  const [counter, setCounter] = useState(0);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Pattern Demo</h2>
        <p className="text-gray-600">Interactive demonstration of this AI design pattern</p>
      </header>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Pattern Status</span>
          <button
            onClick={() => setIsActive(!isActive)}
            className={\`px-4 py-2 rounded-lg transition-colors \${
              isActive 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }\`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </button>
        </div>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <h3 className="font-medium text-blue-900 mb-2">Pattern is Active</h3>
              <p className="text-sm text-blue-700 mb-3">
                This demonstrates the AI pattern in action with interactive elements.
              </p>
              <button
                onClick={() => setCounter(counter + 1)}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Interact ({counter})
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Pattern Features</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Interactive demonstration</li>
            <li>• Real-time feedback</li>
            <li>• User-controlled activation</li>
            <li>• Accessible design</li>
          </ul>
        </div>
      </div>
    </div>
  );
}`;
  }

  async getUnimplementedPatterns() {
    const implementedIds = ['contextual-assistance', 'progressive-disclosure', 'human-in-the-loop', 
                           'explainable-ai', 'conversational-ui', 'adaptive-interfaces', 
                           'multimodal-interaction', 'guided-learning'];
    
    return this.existingCategories.filter(category => 
      !implementedIds.includes(category.id)
    );
  }

  async generateAllUnimplementedPatterns() {
    const unimplemented = await this.getUnimplementedPatterns();
    const results = [];

    console.log(`🚀 Starting generation of ${unimplemented.length} unimplemented patterns...`);

    for (const category of unimplemented) {
      try {
        const result = await this.generatePattern(category.id);
        results.push(result);
        console.log(`✅ Generated: ${category.title}`);
      } catch (error) {
        console.error(`❌ Failed to generate ${category.title}:`, error);
      }
    }

    console.log(`🎉 Generation complete! Generated ${results.length} patterns.`);
    return results;
  }

  displayHelp() {
    console.log(`
🤖 AI Pattern Content Generator Agent

Usage:
  node scripts/ai-pattern-generator.js [command] [options]

Commands:
  generate <pattern-id>     Generate a specific pattern
  generate-all             Generate all unimplemented patterns
  list                     List available patterns to generate
  help                     Show this help message

Examples:
  node scripts/ai-pattern-generator.js generate augmented-creation
  node scripts/ai-pattern-generator.js generate-all
  node scripts/ai-pattern-generator.js list

This agent generates complete AI design patterns following your project's
established conventions and TypeScript interfaces.
    `);
  }
}

// CLI Interface
async function main() {
  const generator = new AIPatternGenerator();
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'help') {
    generator.displayHelp();
    return;
  }

  const command = args[0];

  switch (command) {
    case 'generate':
      if (args.length < 2) {
        console.error('❌ Please specify a pattern ID');
        console.log('💡 Use "list" command to see available patterns');
        return;
      }
      try {
        await generator.generatePattern(args[1]);
      } catch (error) {
        console.error('❌ Generation failed:', error.message);
      }
      break;

    case 'generate-all':
      await generator.generateAllUnimplementedPatterns();
      break;

    case 'list':
      console.log('📋 Available patterns to generate:');
      const unimplemented = await generator.getUnimplementedPatterns();
      unimplemented.forEach(pattern => {
        console.log(`  • ${pattern.id} - ${pattern.title}`);
      });
      break;

    default:
      console.error(`❌ Unknown command: ${command}`);
      generator.displayHelp();
  }
}

// Run CLI if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = AIPatternGenerator;
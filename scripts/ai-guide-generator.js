#!/usr/bin/env node

/**
 * AI Guide Content Generator Agent
 * Generates Designer Guide learning paths by learning from existing guides
 * (Claude Code and Cursor guides serve as templates)
 *
 * This agent analyzes the structure and patterns of existing guides
 * and generates new guides for other tools following the same structure.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class AIGuideGenerator {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.guidesPath = path.join(this.projectRoot, 'src', 'data', 'guides.ts');

    // Load existing guides to extract templates
    this.loadExistingGuides();
  }

  loadExistingGuides() {
    try {
      const guidesContent = fs.readFileSync(this.guidesPath, 'utf8');
      // Extract guide information from the TypeScript file
      this.existingGuides = this.parseGuidesFromFile(guidesContent);
      console.log(`✅ Loaded ${this.existingGuides.length} existing guides`);
    } catch (error) {
      console.error('Error loading guides:', error.message);
      this.existingGuides = [];
    }
  }

  parseGuidesFromFile(content) {
    const guides = [];

    // Extract guide objects - simplified parsing
    // We'll look for guide objects with specific patterns
    const guideTitles = content.match(/title:\s*"([^"]+)"/g) || [];
    const guideTools = content.match(/tool:\s*"([^"]+)"/g) || [];

    // For now, we'll identify the two complete guides we know exist
    // Claude Code and Cursor
    if (content.includes('Claude Code Learning Path') || content.includes('Claude Code')) {
      guides.push({
        name: 'Claude Code',
        slug: 'claude-code-learning-path',
        skillLevel: 'Beginner',
        modules: this.extractModulePattern(content, 'claude')
      });
    }

    if (content.includes('Cursor AI')) {
      guides.push({
        name: 'Cursor',
        slug: 'cursor-learning-path',
        skillLevel: 'Beginner',
        modules: this.extractModulePattern(content, 'cursor')
      });
    }

    return guides;
  }

  extractModulePattern(content, toolName) {
    // Extract module information - this is a simplified pattern extraction
    // In a real implementation, we'd parse the actual lesson structure

    const commonModules = [
      { name: 'setup', title: 'Setup & Installation', lessons: 3 },
      { name: 'features', title: 'Key Features', lessons: 3 },
      { name: 'workflows', title: 'Workflows & Patterns', lessons: 3 },
      { name: 'advanced', title: 'Advanced Techniques', lessons: 3 }
    ];

    return commonModules;
  }

  /**
   * Interactive guide generation
   */
  async generateGuideInteractive() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

    console.log('\n🤖 AI Guide Generator - Interactive Mode\n');
    console.log('This tool creates Designer Guide learning paths by analyzing existing guides.');
    console.log('(Currently: Claude Code ✅, Cursor ✅)\n');

    // Ask which tool to generate a guide for
    const toolName = await question('What tool do you want to create a guide for?\n(e.g., GitHub Copilot, Figma, Replit, V0): ');
    const slug = await question(`Enter guide slug (e.g., github-copilot-learning-path): `);
    const skillLevel = await question('Skill level (Beginner/Intermediate/Advanced) [default: Beginner]: ') || 'Beginner';
    const numLessons = parseInt(await question('Number of lessons (default: 12): ') || '12');
    const numModules = parseInt(await question('Number of modules (default: 4): ') || '4');

    rl.close();

    console.log(`\n📝 Generating guide: ${toolName}`);
    console.log(`   Slug: ${slug}`);
    console.log(`   Skill Level: ${skillLevel}`);
    console.log(`   Lessons: ${numLessons}`);
    console.log(`   Modules: ${numModules}\n`);

    const guideData = this.generateGuideData(
      toolName,
      slug,
      skillLevel,
      numLessons,
      numModules
    );

    return { guideData, slug };
  }

  /**
   * Generate guide data following the structure of existing guides
   */
  generateGuideData(toolName, slug, skillLevel, numLessons, numModules) {
    const lessonsPerModule = Math.ceil(numLessons / numModules);

    return {
      id: `${slug.replace(/-learning-path$/, '')}-guide`,
      slug: slug,
      title: `${toolName} Guide for Designers`,
      description: `Master ${toolName} with AI-powered assistance. Complete guide covering setup, key features, workflows, and best practices.`,
      excerpt: `Your ${toolName} education: ${numLessons} sequential lessons covering setup, core features, practical workflows, and professional best practices.`,
      tool: toolName,
      useCase: 'Learning Path',
      skillLevel: skillLevel,
      designDomain: 'UX Design',
      readTime: Math.ceil(numLessons * 1.5),
      author: 'Design Team',
      publishedDate: new Date().toISOString().split('T')[0],
      thumbnail: `https://commons.wikimedia.org/wiki/Special:FilePath/${toolName.replace(/\s+/g, '_')}_AI_symbol.svg`,
      tags: [slug.replace(/-learning-path$/, ''), 'learning-path', 'getting-started', 'course'],
      lessons: this.generateLessons(toolName, numLessons, numModules, lessonsPerModule)
    };
  }

  /**
   * Generate lessons following the structure of existing guides
   */
  generateLessons(toolName, numLessons, numModules, lessonsPerModule) {
    const lessons = [];
    const modules = [
      'setup',
      'features',
      'workflows',
      'advanced'
    ];

    let lessonCounter = 0;

    for (let moduleIdx = 0; moduleIdx < numModules && lessonCounter < numLessons; moduleIdx++) {
      const moduleName = modules[moduleIdx] || `module-${moduleIdx + 1}`;

      for (let lessonIdx = 0; lessonIdx < lessonsPerModule && lessonCounter < numLessons; lessonIdx++) {
        lessonCounter++;

        lessons.push({
          id: `lesson-${lessonCounter}`,
          title: this.generateLessonTitle(toolName, moduleName, lessonIdx),
          duration: 2,
          order: lessonCounter,
          module: moduleName,
          sections: this.generateLessonSections(toolName, moduleName, lessonIdx)
        });
      }
    }

    return lessons;
  }

  /**
   * Generate contextual lesson titles based on module
   */
  generateLessonTitle(toolName, module, lessonIdx) {
    const titlesByModule = {
      setup: [
        `Install ${toolName}`,
        `Create Your First Project`,
        `Configure Your Workspace`
      ],
      features: [
        `Understanding ${toolName}'s Core Features`,
        `AI-Powered Assistance`,
        `Code Completion & Suggestions`
      ],
      workflows: [
        `Setting Up Your Development Workflow`,
        `Collaboration & Sharing`,
        `Version Control Integration`
      ],
      advanced: [
        `Advanced Configuration`,
        `Custom Workflows & Extensions`,
        `Professional Best Practices`
      ]
    };

    const titles = titlesByModule[module] || [
      `Lesson ${lessonIdx + 1}`,
      `Advanced Topic ${lessonIdx + 1}`,
      `Best Practice ${lessonIdx + 1}`
    ];

    return titles[Math.min(lessonIdx, titles.length - 1)] || `${toolName} Lesson ${lessonIdx + 1}`;
  }

  /**
   * Generate lesson sections following the structure of existing guides
   */
  generateLessonSections(toolName, module, lessonIdx) {
    const sections = [];

    // Intro section
    sections.push({
      type: 'intro',
      content: `Learn about this key feature of ${toolName} and how to use it effectively in your workflow.`,
      icon: 'info'
    });

    // Text content
    sections.push({
      type: 'text',
      content: `${toolName} provides powerful tools for your design and development workflow. This lesson covers the essential concepts you need to know.`
    });

    // Steps section
    const stepCount = 3 + Math.floor(Math.random() * 2);
    const steps = [];
    for (let i = 0; i < stepCount; i++) {
      steps.push({
        number: i + 1,
        title: `Step ${i + 1}: ${this.generateStepTitle(module, i)}`,
        content: [
          `Open ${toolName} and navigate to the relevant section`,
          `Look for the option described in this step`,
          `Follow the prompts to complete the action`
        ],
        icon: 'check'
      });
    }
    sections.push({
      type: 'steps',
      steps: steps
    });

    // Image placeholder
    sections.push({
      type: 'image',
      alt: `${toolName} ${module} feature screenshot`,
      label: `Screenshot showing ${module} in ${toolName}`
    });

    // Callout section
    sections.push({
      type: 'callout',
      calloutType: 'tip',
      title: `${toolName} Pro Tip`,
      content: `You can speed up your workflow by learning keyboard shortcuts. Check ${toolName}'s documentation for the complete list of shortcuts for your platform.`,
      icon: 'lightbulb'
    });

    // Code example (if applicable)
    if (module !== 'setup') {
      sections.push({
        type: 'code',
        language: 'javascript',
        title: 'Example Code',
        code: `// Example code demonstrating ${toolName} features\nconst example = "${module}-lesson";\nconsole.log('Learning:', example);`
      });
    }

    return sections;
  }

  /**
   * Generate contextual step titles
   */
  generateStepTitle(module, stepIdx) {
    const stepsByModule = {
      setup: [
        'Create an account',
        'Install the software',
        'Configure your environment'
      ],
      features: [
        'Explore the main interface',
        'Enable AI-powered features',
        'Customize your preferences'
      ],
      workflows: [
        'Create your first project',
        'Set up collaboration',
        'Connect with other tools'
      ],
      advanced: [
        'Configure advanced settings',
        'Create custom workflows',
        'Integrate with your stack'
      ]
    };

    const steps = stepsByModule[module] || ['Complete setup', 'Configure', 'Test'];
    return steps[Math.min(stepIdx, steps.length - 1)] || `Step ${stepIdx + 1}`;
  }

  /**
   * Add generated guide to the guides.ts file
   */
  addGuideToFile(guideData) {
    try {
      let guidesContent = fs.readFileSync(this.guidesPath, 'utf8');

      // Generate the guide object as TypeScript code
      const guideObject = this.generateGuideTypeScript(guideData);

      // Find where to insert the new guide (before the closing bracket of the guides array)
      const guidesArrayEnd = guidesContent.lastIndexOf('];');

      if (guidesArrayEnd === -1) {
        throw new Error('Could not find guides array in guides.ts');
      }

      // Insert the new guide before the closing bracket
      const updatedContent =
        guidesContent.substring(0, guidesArrayEnd) +
        ',\n' +
        guideObject +
        guidesContent.substring(guidesArrayEnd);

      fs.writeFileSync(this.guidesPath, updatedContent, 'utf8');
      console.log(`✅ Guide added to guides.ts`);

      return true;
    } catch (error) {
      console.error('Error adding guide to file:', error.message);
      return false;
    }
  }

  /**
   * Generate TypeScript code for the guide object
   */
  generateGuideTypeScript(guideData) {
    const lessonsCode = guideData.lessons
      .map(lesson => this.generateLessonTypeScript(lesson))
      .join(',\n      ');

    return `  {
    id: '${guideData.id}',
    slug: '${guideData.slug}',
    title: '${guideData.title}',
    description: '${guideData.description}',
    excerpt: '${guideData.excerpt}',
    tool: '${guideData.tool}',
    useCase: '${guideData.useCase}',
    skillLevel: '${guideData.skillLevel}',
    designDomain: '${guideData.designDomain}',
    readTime: ${guideData.readTime},
    author: '${guideData.author}',
    publishedDate: '${guideData.publishedDate}',
    thumbnail: '${guideData.thumbnail}',
    tags: [${guideData.tags.map(t => `'${t}'`).join(', ')}],
    lessons: [
      ${lessonsCode}
    ]
  }`;
  }

  /**
   * Generate TypeScript code for a lesson
   */
  generateLessonTypeScript(lesson) {
    const sectionsCode = lesson.sections
      .map(section => this.generateSectionTypeScript(section))
      .join(',\n          ');

    return `    {
      id: '${lesson.id}',
      title: '${lesson.title}',
      duration: ${lesson.duration},
      order: ${lesson.order},
      module: '${lesson.module}',
      sections: [
        ${sectionsCode}
      ]
    }`;
  }

  /**
   * Generate TypeScript code for a section
   */
  generateSectionTypeScript(section) {
    if (section.type === 'intro') {
      return `        {
          type: 'intro',
          content: '${this.escapeQuotes(section.content)}',
          icon: '${section.icon}'
        }`;
    } else if (section.type === 'text') {
      return `        {
          type: 'text',
          content: '${this.escapeQuotes(section.content)}'
        }`;
    } else if (section.type === 'steps') {
      const stepsCode = section.steps
        .map(step => `            {
              number: ${step.number},
              title: '${this.escapeQuotes(step.title)}',
              content: [${step.content.map(c => `'${this.escapeQuotes(c)}'`).join(', ')}],
              icon: '${step.icon}'
            }`)
        .join(',\n');

      return `        {
          type: 'steps',
          steps: [
${stepsCode}
          ]
        }`;
    } else if (section.type === 'image') {
      return `        {
          type: 'image',
          alt: '${this.escapeQuotes(section.alt)}',
          label: '${this.escapeQuotes(section.label)}'
        }`;
    } else if (section.type === 'callout') {
      return `        {
          type: 'callout',
          calloutType: '${section.calloutType}',
          title: '${this.escapeQuotes(section.title)}',
          content: '${this.escapeQuotes(section.content)}',
          icon: '${section.icon}'
        }`;
    } else if (section.type === 'code') {
      return `        {
          type: 'code',
          language: '${section.language}',
          title: '${section.title}',
          code: \`${section.code}\`
        }`;
    }

    return '{}';
  }

  /**
   * Escape quotes in strings for TypeScript
   */
  escapeQuotes(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
  }

  /**
   * Main entry point
   */
  async run() {
    try {
      const { guideData, slug } = await this.generateGuideInteractive();

      console.log('\n📄 Generated Guide Data:');
      console.log(`   Title: ${guideData.title}`);
      console.log(`   Slug: ${guideData.slug}`);
      console.log(`   Lessons: ${guideData.lessons.length}`);

      const added = this.addGuideToFile(guideData);

      if (added) {
        console.log(`\n✅ Success! Guide generated and added to guides.ts`);
        console.log(`\nNext steps:`);
        console.log(`1. Review the generated guide content in src/data/guides.ts`);
        console.log(`2. Add images/GIFs to public/images/guides/${slug}/`);
        console.log(`3. Update lesson content with tool-specific details`);
        console.log(`4. Run tests: npm run test:guides`);
        console.log(`5. Preview at: http://localhost:3000/guides/${slug}`);
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  }
}

// Run the generator
const generator = new AIGuideGenerator();
generator.run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

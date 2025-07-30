#!/usr/bin/env node

/**
 * Design System Consistency Agent
 * A specialized tool for ensuring visual and code consistency across components
 * 
 * This agent analyzes your design system, validates Tailwind CSS usage,
 * ensures consistent patterns, and generates style guide documentation
 * for maintaining design system integrity.
 */

const fs = require('fs');
const path = require('path');

class DesignConsistencyAgent {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.componentsDir = path.join(this.projectRoot, 'src', 'components');
    this.stylesDir = path.join(this.projectRoot, 'src', 'app');
    
    // Load design system configuration
    this.loadDesignSystem();
    
    // Initialize consistency rules
    this.initializeRules();
  }

  loadDesignSystem() {
    try {
      // Load Tailwind config
      const tailwindConfigPath = path.join(this.projectRoot, 'tailwind.config.js');
      const tailwindConfigContent = fs.readFileSync(tailwindConfigPath, 'utf8');
      this.tailwindConfig = this.parseTailwindConfig(tailwindConfigContent);
      
      // Load global styles
      const globalStylesPath = path.join(this.stylesDir, 'globals.css');
      const globalStyles = fs.readFileSync(globalStylesPath, 'utf8');
      this.globalStyles = this.parseGlobalStyles(globalStyles);
      
    } catch (error) {
      console.error('Error loading design system:', error);
      this.tailwindConfig = {};
      this.globalStyles = {};
    }
  }

  parseTailwindConfig(content) {
    const colors = {
      primary: { light: '#60a5fa', default: '#2563eb', dark: '#1e40af' },
      secondary: { light: '#f472b6', default: '#db2777', dark: '#9d174d' },
      indigo: 'colors.indigo',
      purple: 'colors.purple'
    };
    
    const spacing = ['px', '0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '8', '10', '12', '16', '20', '24'];
    const borderRadius = ['none', 'sm', 'DEFAULT', 'md', 'lg', 'xl', '2xl', '3xl', 'full'];
    const fontSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];
    
    return {
      colors,
      spacing,
      borderRadius,
      fontSizes,
      fontFamily: ['inter', 'ui-sans-serif', 'system-ui']
    };
  }

  parseGlobalStyles(content) {
    return {
      customClasses: this.extractCustomClasses(content),
      customProperties: this.extractCustomProperties(content),
      animations: this.extractAnimations(content)
    };
  }

  extractCustomClasses(content) {
    const classRegex = /\\.([a-zA-Z-_]+)\\s*{/g;
    const classes = [];
    let match;
    
    while ((match = classRegex.exec(content)) !== null) {
      classes.push(match[1]);
    }
    
    return classes;
  }

  extractCustomProperties(content) {
    const propRegex = /--([a-zA-Z-_]+):\\s*([^;]+);/g;
    const properties = {};
    let match;
    
    while ((match = propRegex.exec(content)) !== null) {
      properties[match[1]] = match[2];
    }
    
    return properties;
  }

  extractAnimations(content) {
    const animationRegex = /@keyframes\\s+([a-zA-Z-_]+)\\s*{([^}]+)}/g;
    const animations = {};
    let match;
    
    while ((match = animationRegex.exec(content)) !== null) {
      animations[match[1]] = match[2];
    }
    
    return animations;
  }

  initializeRules() {
    this.consistencyRules = {
      // Color consistency rules
      colors: {
        preferredPrimary: ['bg-indigo-600', 'text-indigo-600', 'border-indigo-600'],
        preferredSecondary: ['bg-gray-100', 'text-gray-800', 'border-gray-300'],
        preferredAccent: ['bg-purple-600', 'text-purple-600', 'border-purple-600'],
        avoidedColors: ['bg-red-500', 'bg-yellow-500'], // Unless for alerts/warnings
      },
      
      // Spacing consistency rules
      spacing: {
        preferredPadding: ['p-4', 'px-4', 'py-2', 'p-6', 'px-6', 'py-3'],
        preferredMargin: ['mb-4', 'mt-6', 'mx-auto', 'mb-6', 'mt-8'],
        preferredGaps: ['gap-4', 'gap-6', 'space-x-4', 'space-y-4'],
      },
      
      // Typography consistency rules
      typography: {
        preferredHeadings: ['text-2xl', 'text-xl', 'text-lg', 'font-bold', 'font-semibold'],
        preferredBody: ['text-sm', 'text-base', 'text-gray-600', 'text-gray-800'],
        preferredFontWeights: ['font-medium', 'font-semibold', 'font-bold'],
      },
      
      // Layout consistency rules
      layout: {
        preferredContainers: ['max-w-4xl', 'max-w-6xl', 'mx-auto'],
        preferredFlexbox: ['flex', 'items-center', 'justify-between', 'justify-center'],
        preferredGrid: ['grid', 'grid-cols-1', 'lg:grid-cols-3', 'gap-6'],
      },
      
      // Component consistency rules
      components: {
        preferredButtons: ['rounded-full', 'px-4', 'py-2', 'font-medium'],
        preferredCards: ['bg-white', 'rounded-lg', 'shadow-lg', 'p-4', 'border'],
        preferredInputs: ['border', 'border-gray-300', 'rounded-lg', 'px-3', 'py-2'],
      },

      // Animation consistency rules
      animations: {
        preferredTransitions: ['transition-colors', 'transition-all', 'duration-200'],
        preferredHovers: ['hover:bg-gray-50', 'hover:text-blue-600', 'hover:shadow-md'],
        preferredFocus: ['focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'],
      }
    };
  }

  /**
   * Analyze a component file for design consistency
   */
  analyzeComponent(componentPath) {
    try {
      const content = fs.readFileSync(componentPath, 'utf8');
      const componentName = path.basename(componentPath, '.tsx');
      
      const analysis = {
        name: componentName,
        path: componentPath,
        classNames: this.extractClassNames(content),
        consistencyIssues: [],
        suggestions: [],
        score: 0
      };

      // Run consistency checks
      this.checkColorConsistency(analysis);
      this.checkSpacingConsistency(analysis);
      this.checkTypographyConsistency(analysis);
      this.checkLayoutConsistency(analysis);
      this.checkComponentConsistency(analysis);
      this.checkAnimationConsistency(analysis);
      
      // Calculate consistency score
      analysis.score = this.calculateConsistencyScore(analysis);
      
      return analysis;
    } catch (error) {
      console.error(`Error analyzing component ${componentPath}:`, error);
      return null;
    }
  }

  extractClassNames(content) {
    const classRegex = /className=["']([^"']+)["']/g;
    const classNames = [];
    let match;
    
    while ((match = classRegex.exec(content)) !== null) {
      const classes = match[1].split(/\\s+/).filter(cls => cls.length > 0);
      classNames.push(...classes);
    }
    
    // Also check template literals
    const templateRegex = /className={`([^`]+)`}/g;
    while ((match = templateRegex.exec(content)) !== null) {
      // Extract static classes from template literals
      const staticClasses = match[1].split(/\\s+/).filter(cls => 
        cls.length > 0 && !cls.includes('$') && !cls.includes('{')
      );
      classNames.push(...staticClasses);
    }
    
    return [...new Set(classNames)];
  }

  checkColorConsistency(analysis) {
    const { classNames } = analysis;
    const issues = [];
    const suggestions = [];
    
    // Check for consistent color usage
    const colorClasses = classNames.filter(cls => 
      cls.includes('bg-') || cls.includes('text-') || cls.includes('border-')
    );
    
    colorClasses.forEach(cls => {
      // Check for non-standard color usage
      if (cls.includes('red-') && !cls.includes('red-50') && !cls.includes('red-100')) {
        issues.push({
          type: 'color',
          severity: 'warning',
          class: cls,
          message: 'Consider using design system colors instead of direct red colors'
        });
        suggestions.push(`Replace ${cls} with appropriate semantic color`);
      }
      
      // Check for inconsistent primary color usage
      if (cls.includes('blue-') && !cls.includes('indigo-')) {
        suggestions.push(`Consider using indigo-* instead of ${cls} for consistency`);
      }
    });
    
    analysis.consistencyIssues.push(...issues);
    analysis.suggestions.push(...suggestions);
  }

  checkSpacingConsistency(analysis) {
    const { classNames } = analysis;
    const issues = [];
    const suggestions = [];
    
    const spacingClasses = classNames.filter(cls => 
      cls.match(/^(p|m|gap|space)-/) || cls.match(/^(px|py|mx|my|mt|mb|ml|mr|pt|pb|pl|pr)-/)
    );
    
    spacingClasses.forEach(cls => {
      // Check for non-standard spacing values
      const spacingValue = cls.split('-').pop();
      const standardSpacing = ['1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24'];
      
      if (!standardSpacing.includes(spacingValue) && spacingValue !== 'auto') {
        issues.push({
          type: 'spacing',
          severity: 'info',
          class: cls,
          message: 'Consider using standard spacing scale values'
        });
      }
      
      // Suggest consistent padding patterns
      if (cls.startsWith('p-') && !['p-4', 'p-6', 'p-8'].includes(cls)) {
        suggestions.push(`Consider using standard padding: p-4, p-6, or p-8 instead of ${cls}`);
      }
    });
    
    analysis.consistencyIssues.push(...issues);
    analysis.suggestions.push(...suggestions);
  }

  checkTypographyConsistency(analysis) {
    const { classNames } = analysis;
    const issues = [];
    const suggestions = [];
    
    const typographyClasses = classNames.filter(cls => 
      cls.includes('text-') || cls.includes('font-') || cls.includes('leading-')
    );
    
    typographyClasses.forEach(cls => {
      // Check for consistent text sizes
      if (cls.startsWith('text-') && cls.includes('px')) {
        issues.push({
          type: 'typography',
          severity: 'warning',
          class: cls,
          message: 'Avoid pixel-based text sizes, use Tailwind size scale'
        });
      }
      
      // Suggest consistent heading patterns
      if (cls === 'text-3xl' && !classNames.includes('font-bold')) {
        suggestions.push('Large text sizes should typically include font-bold for headings');
      }
    });
    
    analysis.consistencyIssues.push(...issues);
    analysis.suggestions.push(...suggestions);
  }

  checkLayoutConsistency(analysis) {
    const { classNames } = analysis;
    const suggestions = [];
    
    // Check for modern layout patterns
    const hasGrid = classNames.some(cls => cls.startsWith('grid'));
    const hasFlex = classNames.some(cls => cls === 'flex');
    
    if (!hasGrid && !hasFlex && classNames.length > 10) {
      suggestions.push('Consider using flexbox or grid for better layout management');
    }
    
    // Check for responsive design patterns
    const hasResponsive = classNames.some(cls => cls.includes('lg:') || cls.includes('md:'));
    if (!hasResponsive && classNames.length > 5) {
      suggestions.push('Consider adding responsive classes for better mobile experience');
    }
    
    analysis.suggestions.push(...suggestions);
  }

  checkComponentConsistency(analysis) {
    const { classNames } = analysis;
    const issues = [];
    const suggestions = [];
    
    // Check button consistency
    if (classNames.includes('button') || analysis.name.toLowerCase().includes('button')) {
      const hasRounded = classNames.some(cls => cls.includes('rounded'));
      const hasPadding = classNames.some(cls => cls.startsWith('px-') || cls.startsWith('py-'));
      
      if (!hasRounded) {
        suggestions.push('Buttons should include rounded classes for consistency');
      }
      if (!hasPadding) {
        suggestions.push('Buttons should include consistent padding (px-4 py-2)');
      }
    }
    
    // Check card consistency
    if (analysis.name.toLowerCase().includes('card')) {
      const hasBackground = classNames.some(cls => cls.includes('bg-'));
      const hasShadow = classNames.some(cls => cls.includes('shadow'));
      const hasRounded = classNames.some(cls => cls.includes('rounded'));
      
      if (!hasBackground) {
        suggestions.push('Cards should have background color (typically bg-white)');
      }
      if (!hasShadow) {
        suggestions.push('Cards should include shadow for depth (shadow-lg recommended)');
      }
      if (!hasRounded) {
        suggestions.push('Cards should include rounded corners (rounded-lg recommended)');
      }
    }
    
    analysis.consistencyIssues.push(...issues);
    analysis.suggestions.push(...suggestions);
  }

  checkAnimationConsistency(analysis) {
    const { classNames } = analysis;
    const suggestions = [];
    
    const hasHover = classNames.some(cls => cls.includes('hover:'));
    const hasTransition = classNames.some(cls => cls.includes('transition'));
    
    if (hasHover && !hasTransition) {
      suggestions.push('Add transition classes for smooth hover effects (transition-colors recommended)');
    }
    
    const hasFocus = classNames.some(cls => cls.includes('focus:'));
    if (!hasFocus && (classNames.includes('button') || analysis.name.toLowerCase().includes('button'))) {
      suggestions.push('Interactive elements should include focus styles for accessibility');
    }
    
    analysis.suggestions.push(...suggestions);
  }

  calculateConsistencyScore(analysis) {
    const maxScore = 100;
    const { consistencyIssues, suggestions } = analysis;
    
    let deductions = 0;
    
    consistencyIssues.forEach(issue => {
      switch (issue.severity) {
        case 'error': deductions += 15; break;
        case 'warning': deductions += 10; break;
        case 'info': deductions += 5; break;
      }
    });
    
    // Deduct points for missing best practices
    deductions += Math.min(suggestions.length * 2, 30);
    
    return Math.max(0, maxScore - deductions);
  }

  /**
   * Generate consistency report for all components
   */
  async generateConsistencyReport() {
    console.log('🎨 Starting Design System Consistency Analysis...');
    
    const componentFiles = this.getAllComponents();
    const results = {
      components: [],
      summary: {
        totalComponents: componentFiles.length,
        averageScore: 0,
        totalIssues: 0,
        totalSuggestions: 0
      },
      patterns: {
        mostUsedClasses: {},
        inconsistentPatterns: [],
        recommendations: []
      }
    };

    for (const componentPath of componentFiles) {
      console.log(`🔍 Analyzing: ${path.basename(componentPath)}`);
      
      const analysis = this.analyzeComponent(componentPath);
      if (analysis) {
        results.components.push(analysis);
        
        // Collect class usage statistics
        analysis.classNames.forEach(className => {
          results.patterns.mostUsedClasses[className] = 
            (results.patterns.mostUsedClasses[className] || 0) + 1;
        });
      }
    }

    // Calculate summary statistics
    if (results.components.length > 0) {
      results.summary.averageScore = results.components.reduce((sum, comp) => sum + comp.score, 0) / results.components.length;
      results.summary.totalIssues = results.components.reduce((sum, comp) => sum + comp.consistencyIssues.length, 0);
      results.summary.totalSuggestions = results.components.reduce((sum, comp) => sum + comp.suggestions.length, 0);
    }

    // Generate pattern recommendations
    results.patterns.recommendations = this.generatePatternRecommendations(results);

    console.log(`\\n📊 Analysis Complete!`);
    console.log(`✅ Components analyzed: ${results.summary.totalComponents}`);
    console.log(`📈 Average consistency score: ${Math.round(results.summary.averageScore)}%`);
    console.log(`⚠️  Total issues found: ${results.summary.totalIssues}`);
    console.log(`💡 Total suggestions: ${results.summary.totalSuggestions}`);

    return results;
  }

  getAllComponents() {
    const components = [];
    
    const findComponents = (dir) => {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory() && !item.includes('__tests__')) {
          findComponents(itemPath);
        } else if (item.endsWith('.tsx') && !item.includes('.test.')) {
          components.push(itemPath);
        }
      });
    };

    findComponents(this.componentsDir);
    return components;
  }

  generatePatternRecommendations(results) {
    const recommendations = [];
    const { mostUsedClasses } = results.patterns;
    
    // Analyze most used classes for patterns
    const sortedClasses = Object.entries(mostUsedClasses)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20);

    // Color pattern recommendations
    const colorClasses = sortedClasses.filter(([cls]) => 
      cls.includes('bg-') || cls.includes('text-') || cls.includes('border-')
    );
    
    if (colorClasses.length > 0) {
      recommendations.push({
        category: 'colors',
        title: 'Color Consistency',
        description: 'Most used color classes suggest these as standard patterns',
        items: colorClasses.slice(0, 5).map(([cls, count]) => `${cls} (used ${count} times)`)
      });
    }

    // Spacing pattern recommendations
    const spacingClasses = sortedClasses.filter(([cls]) => 
      cls.match(/^(p|m|gap)-/) || cls.match(/^(px|py|mx|my)-/)
    );
    
    if (spacingClasses.length > 0) {
      recommendations.push({
        category: 'spacing',
        title: 'Spacing Standards',
        description: 'Establish these as standard spacing patterns',
        items: spacingClasses.slice(0, 5).map(([cls, count]) => `${cls} (used ${count} times)`)
      });
    }

    // Layout pattern recommendations
    const layoutClasses = sortedClasses.filter(([cls]) => 
      cls.includes('flex') || cls.includes('grid') || cls.includes('max-w')
    );
    
    if (layoutClasses.length > 0) {
      recommendations.push({
        category: 'layout',
        title: 'Layout Patterns',
        description: 'Common layout patterns to standardize',
        items: layoutClasses.slice(0, 5).map(([cls, count]) => `${cls} (used ${count} times)`)
      });
    }

    return recommendations;
  }

  /**
   * Generate style guide documentation
   */
  async generateStyleGuide(consistencyReport) {
    const styleGuide = this.buildStyleGuideContent(consistencyReport);
    const outputPath = path.join(this.projectRoot, 'docs', 'style-guide.md');
    
    // Create docs directory if it doesn't exist
    const docsDir = path.dirname(outputPath);
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, styleGuide);
    console.log(`📚 Style guide generated: ${outputPath}`);
    
    return outputPath;
  }

  buildStyleGuideContent(report) {
    const { summary, patterns, components } = report;
    
    return `# AI Design Patterns - Style Guide

> Generated by Design System Consistency Agent

## 📊 Overview

- **Components Analyzed**: ${summary.totalComponents}
- **Average Consistency Score**: ${Math.round(summary.averageScore)}%
- **Issues Found**: ${summary.totalIssues}
- **Suggestions Generated**: ${summary.totalSuggestions}

## 🎨 Design System Standards

### Colors

Based on your Tailwind configuration and usage patterns:

#### Primary Colors
- **Primary**: \`indigo-600\` (main actions, links)
- **Primary Light**: \`indigo-500\` (hover states)
- **Primary Dark**: \`indigo-700\` (active states)

#### Secondary Colors
- **Secondary**: \`gray-100\` (backgrounds)
- **Secondary Text**: \`gray-800\` (readable text)
- **Secondary Border**: \`gray-300\` (subtle borders)

#### Accent Colors
- **Purple**: \`purple-600\` (special highlights)
- **Success**: \`green-600\` (positive actions)
- **Warning**: \`yellow-500\` (caution states)
- **Error**: \`red-600\` (errors, destructive actions)

### Typography

#### Headings
- **H1**: \`text-3xl font-bold text-gray-900\`
- **H2**: \`text-2xl font-bold text-gray-900\`
- **H3**: \`text-xl font-semibold text-gray-900\`

#### Body Text
- **Primary**: \`text-base text-gray-800\`
- **Secondary**: \`text-sm text-gray-600\`
- **Muted**: \`text-xs text-gray-500\`

### Spacing

#### Padding Standards
- **Small**: \`p-4\` or \`px-4 py-2\`
- **Medium**: \`p-6\` or \`px-6 py-3\`
- **Large**: \`p-8\` or \`px-8 py-4\`

#### Margin Standards
- **Section spacing**: \`mb-6\` or \`mb-8\`
- **Element spacing**: \`mb-4\`
- **Centered content**: \`mx-auto\`

### Layout Patterns

#### Containers
- **Content**: \`max-w-4xl mx-auto\`
- **Wide content**: \`max-w-6xl mx-auto\`
- **Full width**: \`w-full\`

#### Flexbox Patterns
- **Center items**: \`flex items-center justify-center\`
- **Space between**: \`flex items-center justify-between\`
- **Column layout**: \`flex flex-col space-y-4\`

#### Grid Patterns
- **3-column**: \`grid grid-cols-1 lg:grid-cols-3 gap-6\`
- **2-column**: \`grid grid-cols-1 md:grid-cols-2 gap-4\`

## 🧩 Component Standards

### Buttons

#### Primary Button
\`\`\`tsx
className="bg-indigo-600 text-white px-4 py-2 rounded-full font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
\`\`\`

#### Secondary Button
\`\`\`tsx
className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
\`\`\`

### Cards

#### Standard Card
\`\`\`tsx
className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
\`\`\`

#### Interactive Card
\`\`\`tsx
className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer"
\`\`\`

### Form Elements

#### Input Fields
\`\`\`tsx
className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
\`\`\`

## 📈 Most Common Patterns

${patterns.recommendations.map(rec => `
### ${rec.title}
${rec.description}

${rec.items.map(item => `- \`${item}\``).join('\\n')}
`).join('\\n')}

## ⚠️ Common Issues Found

${components
  .filter(comp => comp.consistencyIssues.length > 0)
  .slice(0, 10)
  .map(comp => `
### ${comp.name}
**Score**: ${comp.score}%

**Issues**:
${comp.consistencyIssues.map(issue => `- ${issue.severity.toUpperCase()}: ${issue.message} (\`${issue.class}\`)`).join('\\n')}

**Suggestions**:
${comp.suggestions.slice(0, 3).map(suggestion => `- ${suggestion}`).join('\\n')}
`).join('\\n')}

## 🎯 Recommendations

### High-Priority Fixes
1. **Standardize button styles** across all components
2. **Consistent spacing** using the established scale
3. **Color harmony** with the defined palette
4. **Typography consistency** for better readability

### Best Practices
1. Always include \`transition-colors\` with hover effects
2. Use \`focus:outline-none focus:ring-2\` for keyboard accessibility
3. Prefer \`rounded-lg\` over \`rounded\` for consistency
4. Use semantic color names (\`primary\`, \`secondary\`) when possible

### Animation Guidelines
1. **Transitions**: Use \`transition-colors duration-200\` for color changes
2. **Hover effects**: Subtle changes like \`hover:shadow-md\`
3. **Focus states**: Always include focus rings for accessibility
4. **Motion**: Use Framer Motion for complex animations

---

*Generated on ${new Date().toISOString().split('T')[0]} by Design System Consistency Agent*
`;
  }

  /**
   * Fix common consistency issues automatically
   */
  async fixConsistencyIssues(componentPath, analysis) {
    console.log(`🔧 Attempting to fix issues in: ${path.basename(componentPath)}`);
    
    try {
      let content = fs.readFileSync(componentPath, 'utf8');
      let fixes = 0;
      
      // Fix common issues
      analysis.consistencyIssues.forEach(issue => {
        if (issue.type === 'color' && issue.severity === 'warning') {
          // Example: Replace bg-blue-500 with bg-indigo-600
          if (issue.class.includes('blue-')) {
            const newClass = issue.class.replace('blue-', 'indigo-');
            content = content.replace(new RegExp(issue.class, 'g'), newClass);
            fixes++;
          }
        }
      });
      
      if (fixes > 0) {
        fs.writeFileSync(componentPath, content);
        console.log(`✅ Fixed ${fixes} issues in ${path.basename(componentPath)}`);
      } else {
        console.log(`ℹ️  No auto-fixable issues in ${path.basename(componentPath)}`);
      }
      
      return fixes;
    } catch (error) {
      console.error(`❌ Error fixing ${componentPath}:`, error);
      return 0;
    }
  }

  /**
   * Display usage help
   */
  displayHelp() {
    console.log(`
🎨 Design System Consistency Agent

Usage:
  node scripts/design-consistency-agent.js [command] [options]

Commands:
  analyze                     Analyze all components for consistency
  analyze <component-path>    Analyze specific component
  report                      Generate comprehensive consistency report
  style-guide                 Generate style guide documentation
  fix <component-path>        Auto-fix common issues in component
  fix-all                     Auto-fix issues in all components
  help                        Show this help message

Examples:
  node scripts/design-consistency-agent.js analyze
  node scripts/design-consistency-agent.js analyze src/components/ui/Button.tsx
  node scripts/design-consistency-agent.js report
  node scripts/design-consistency-agent.js style-guide
  node scripts/design-consistency-agent.js fix src/components/ui/Button.tsx

This agent ensures visual and code consistency across your design system
by analyzing Tailwind CSS usage, component patterns, and design standards.
    `);
  }
}

// CLI Interface
async function main() {
  const agent = new DesignConsistencyAgent();
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'help') {
    agent.displayHelp();
    return;
  }

  const command = args[0];

  switch (command) {
    case 'analyze':
      if (args.length > 1) {
        // Analyze specific component
        const analysis = agent.analyzeComponent(args[1]);
        if (analysis) {
          console.log(`\\n📊 Analysis for ${analysis.name}:`);
          console.log(`Score: ${analysis.score}%`);
          console.log(`Issues: ${analysis.consistencyIssues.length}`);
          console.log(`Suggestions: ${analysis.suggestions.length}`);
          
          if (analysis.consistencyIssues.length > 0) {
            console.log('\\n⚠️  Issues:');
            analysis.consistencyIssues.forEach(issue => {
              console.log(`  ${issue.severity.toUpperCase()}: ${issue.message}`);
            });
          }
          
          if (analysis.suggestions.length > 0) {
            console.log('\\n💡 Suggestions:');
            analysis.suggestions.forEach(suggestion => {
              console.log(`  • ${suggestion}`);
            });
          }
        }
      } else {
        // Analyze all components
        await agent.generateConsistencyReport();
      }
      break;

    case 'report':
      const report = await agent.generateConsistencyReport();
      const reportPath = path.join(agent.projectRoot, 'consistency-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`📊 Detailed report saved: ${reportPath}`);
      break;

    case 'style-guide':
      const consistencyReport = await agent.generateConsistencyReport();
      await agent.generateStyleGuide(consistencyReport);
      break;

    case 'fix':
      if (args.length < 2) {
        console.error('❌ Please specify a component path');
        return;
      }
      const analysis = agent.analyzeComponent(args[1]);
      if (analysis) {
        await agent.fixConsistencyIssues(args[1], analysis);
      }
      break;

    case 'fix-all':
      const allComponents = agent.getAllComponents();
      let totalFixes = 0;
      
      for (const componentPath of allComponents) {
        const analysis = agent.analyzeComponent(componentPath);
        if (analysis && analysis.consistencyIssues.length > 0) {
          const fixes = await agent.fixConsistencyIssues(componentPath, analysis);
          totalFixes += fixes;
        }
      }
      
      console.log(`\\n🎉 Applied ${totalFixes} fixes across ${allComponents.length} components`);
      break;

    default:
      console.error(`❌ Unknown command: ${command}`);
      agent.displayHelp();
  }
}

// Run CLI if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = DesignConsistencyAgent;
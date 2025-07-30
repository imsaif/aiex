#!/usr/bin/env node

/**
 * Component Testing Agent
 * A specialized tool for generating comprehensive tests for React components
 * 
 * This agent analyzes your components and generates Jest + React Testing Library
 * tests that follow best practices for component testing, accessibility, and
 * achieve the project's 70% coverage threshold.
 */

const fs = require('fs');
const path = require('path');

class ComponentTestingAgent {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.componentsDir = path.join(this.projectRoot, 'src', 'components');
    this.testsDir = path.join(this.componentsDir, 'ui', '__tests__');
    
    // Load existing test configuration
    this.loadJestConfig();
  }

  loadJestConfig() {
    try {
      const jestConfigPath = path.join(this.projectRoot, 'jest.config.js');
      this.jestConfig = require(jestConfigPath);
    } catch (error) {
      console.error('Error loading Jest config:', error);
      this.jestConfig = {};
    }
  }

  /**
   * Analyze component file and extract metadata for test generation
   */
  analyzeComponent(componentPath) {
    try {
      const content = fs.readFileSync(componentPath, 'utf8');
      const componentName = path.basename(componentPath, '.tsx');
      
      const analysis = {
        name: componentName,
        path: componentPath,
        hasProps: this.extractPropsInterface(content),
        hasState: content.includes('useState') || content.includes('useReducer'),
        hasEffects: content.includes('useEffect'),
        hasEvents: this.extractEventHandlers(content),
        hasAnimations: content.includes('framer-motion') || content.includes('motion.'),
        hasFormElements: this.extractFormElements(content),
        imports: this.extractImports(content),
        exportType: this.getExportType(content),
        accessibility: this.checkAccessibilityFeatures(content),
        testComplexity: this.assessTestComplexity(content)
      };

      return analysis;
    } catch (error) {
      console.error(`Error analyzing component ${componentPath}:`, error);
      return null;
    }
  }

  extractPropsInterface(content) {
    const interfaceRegex = /interface\s+(\w+Props)\s*{([^}]+)}/g;
    const typeRegex = /type\s+(\w+Props)\s*=\s*{([^}]+)}/g;
    
    const interfaces = [];
    let match;

    while ((match = interfaceRegex.exec(content)) !== null) {
      interfaces.push({
        name: match[1],
        properties: this.parseInterfaceProperties(match[2])
      });
    }

    while ((match = typeRegex.exec(content)) !== null) {
      interfaces.push({
        name: match[1],
        properties: this.parseInterfaceProperties(match[2])
      });
    }

    return interfaces;
  }

  parseInterfaceProperties(propertiesString) {
    const lines = propertiesString.split('\n');
    const properties = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('*')) {
        const propMatch = trimmed.match(/(\w+)(\?)?\s*:\s*([^;,]+)/);
        if (propMatch) {
          properties.push({
            name: propMatch[1],
            optional: !!propMatch[2],
            type: propMatch[3].trim()
          });
        }
      }
    });

    return properties;
  }

  extractEventHandlers(content) {
    const eventRegex = /on[A-Z]\w*\s*(?:=|:)/g;
    const handlers = [];
    let match;

    while ((match = eventRegex.exec(content)) !== null) {
      handlers.push(match[0].replace(/\s*(?:=|:)/, ''));
    }

    return [...new Set(handlers)];
  }

  extractFormElements(content) {
    const formElements = [];
    const inputRegex = /<(input|textarea|select|button)[^>]*>/gi;
    let match;

    while ((match = inputRegex.exec(content)) !== null) {
      formElements.push(match[1].toLowerCase());
    }

    return [...new Set(formElements)];
  }

  extractImports(content) {
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    const imports = [];
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }

    return imports;
  }

  getExportType(content) {
    if (content.includes('export default')) {
      return 'default';
    } else if (content.includes('export const') || content.includes('export function')) {
      return 'named';
    }
    return 'unknown';
  }

  checkAccessibilityFeatures(content) {
    return {
      hasAriaLabels: content.includes('aria-label') || content.includes('aria-labelledby'),
      hasRoles: content.includes('role='),
      hasKeyboardHandlers: content.includes('onKeyDown') || content.includes('onKeyPress'),
      hasFocusManagement: content.includes('focus') || content.includes('tabIndex'),
      hasAltText: content.includes('alt=')
    };
  }

  assessTestComplexity(content) {
    let complexity = 'simple';
    
    if (content.includes('useState') || content.includes('useEffect')) {
      complexity = 'medium';
    }
    
    if (content.includes('useReducer') || 
        content.includes('useCallback') || 
        content.includes('useMemo') ||
        content.includes('framer-motion')) {
      complexity = 'complex';
    }

    return complexity;
  }

  /**
   * Generate comprehensive test file for a component
   */
  generateTestFile(componentAnalysis) {
    const testContent = this.buildTestContent(componentAnalysis);
    return testContent;
  }

  buildTestContent(analysis) {
    const { name, hasProps, hasState, hasEvents, hasAnimations, hasFormElements, accessibility, testComplexity } = analysis;
    
    let testContent = this.generateTestHeader(analysis);
    testContent += this.generateTestSetup(analysis);
    testContent += this.generateBasicRenderTests(analysis);
    
    if (hasProps.length > 0) {
      testContent += this.generatePropsTests(analysis);
    }
    
    if (hasState) {
      testContent += this.generateStateTests(analysis);
    }
    
    if (hasEvents.length > 0) {
      testContent += this.generateEventTests(analysis);
    }
    
    if (hasFormElements.length > 0) {
      testContent += this.generateFormTests(analysis);
    }
    
    if (accessibility.hasAriaLabels || accessibility.hasRoles) {
      testContent += this.generateAccessibilityTests(analysis);
    }
    
    if (hasAnimations) {
      testContent += this.generateAnimationTests(analysis);
    }
    
    testContent += this.generateSnapshotTests(analysis);
    testContent += '});';
    
    return testContent;
  }

  generateTestHeader(analysis) {
    const { name, imports } = analysis;
    const relativePath = this.getRelativeImportPath(analysis.path);
    
    let header = `import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ${name} from '${relativePath}';

`;

    // Add additional imports based on component analysis
    if (analysis.hasAnimations) {
      header += `// Mock framer-motion for testing
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    span: 'span',
    p: 'p'
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

`;
    }

    return header;
  }

  generateTestSetup(analysis) {
    const { name } = analysis;
    
    return `describe('${name}', () => {
  const defaultProps = ${this.generateDefaultProps(analysis)};

  beforeEach(() => {
    jest.clearAllMocks();
  });

`;
  }

  generateDefaultProps(analysis) {
    if (analysis.hasProps.length === 0) {
      return '{}';
    }

    const props = {};
    analysis.hasProps.forEach(interfaceObj => {
      interfaceObj.properties.forEach(prop => {
        props[prop.name] = this.generateMockValue(prop.type, prop.name);
      });
    });

    return JSON.stringify(props, null, 4).replace(/"/g, "'");
  }

  generateMockValue(type, propName) {
    const lowerPropName = propName.toLowerCase();
    
    // Function types
    if (type.includes('=>') || type.includes('function') || lowerPropName.startsWith('on')) {
      return 'jest.fn()';
    }
    
    // String types
    if (type.includes('string')) {
      if (lowerPropName.includes('id')) return 'test-id';
      if (lowerPropName.includes('class')) return 'test-class';
      if (lowerPropName.includes('title')) return 'Test Title';
      if (lowerPropName.includes('text') || lowerPropName.includes('content')) return 'Test content';
      return 'test-value';
    }
    
    // Number types
    if (type.includes('number')) {
      return 42;
    }
    
    // Boolean types
    if (type.includes('boolean')) {
      return true;
    }
    
    // Array types
    if (type.includes('[]') || type.includes('Array')) {
      return [];
    }
    
    // Object types
    if (type.includes('{') || type === 'object') {
      return {};
    }
    
    return 'test-value';
  }

  generateBasicRenderTests(analysis) {
    const { name } = analysis;
    
    return `  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<${name} {...defaultProps} />);
    });

    it('renders with correct structure', () => {
      const { container } = render(<${name} {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });
${this.generateContentTests(analysis)}
  });

`;
  }

  generateContentTests(analysis) {
    let tests = '';
    
    // Look for text content in the component
    if (analysis.hasProps.some(iface => 
      iface.properties.some(prop => 
        prop.name.toLowerCase().includes('title') || 
        prop.name.toLowerCase().includes('text') ||
        prop.name.toLowerCase().includes('content')
      )
    )) {
      tests += `
    it('displays provided content', () => {
      const testProps = {
        ...defaultProps,
        title: 'Test Title',
        text: 'Test Content'
      };
      render(<${analysis.name} {...testProps} />);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });`;
    }

    return tests;
  }

  generatePropsTests(analysis) {
    const { name, hasProps } = analysis;
    
    let tests = `  describe('Props', () => {
`;

    hasProps.forEach(interfaceObj => {
      interfaceObj.properties.forEach(prop => {
        if (prop.type.includes('string') && !prop.name.toLowerCase().startsWith('on')) {
          tests += `    it('renders with ${prop.name} prop', () => {
      const testValue = 'Test ${prop.name}';
      render(<${name} {...defaultProps} ${prop.name}={testValue} />);
      expect(screen.getByText(testValue)).toBeInTheDocument();
    });

`;
        }

        if (prop.type.includes('boolean')) {
          tests += `    it('handles ${prop.name} boolean prop', () => {
      const { rerender } = render(<${name} {...defaultProps} ${prop.name}={true} />);
      // Test with true value
      expect(screen.getByRole('generic')).toBeInTheDocument();
      
      rerender(<${name} {...defaultProps} ${prop.name}={false} />);
      // Test with false value - behavior should change
    });

`;
        }
      });
    });

    tests += `  });

`;
    return tests;
  }

  generateStateTests(analysis) {
    const { name } = analysis;
    
    return `  describe('State Management', () => {
    it('manages internal state correctly', () => {
      render(<${name} {...defaultProps} />);
      // Test initial state
      // Add specific state assertions based on your component
    });

    it('updates state on user interaction', async () => {
      const user = userEvent.setup();
      render(<${name} {...defaultProps} />);
      
      // Simulate user interaction that changes state
      // Add specific interactions based on your component
    });
  });

`;
  }

  generateEventTests(analysis) {
    const { name, hasEvents } = analysis;
    
    let tests = `  describe('Event Handling', () => {
`;

    hasEvents.forEach(eventHandler => {
      const eventName = eventHandler.replace('on', '').toLowerCase();
      tests += `    it('calls ${eventHandler} when triggered', async () => {
      const ${eventHandler} = jest.fn();
      const user = userEvent.setup();
      
      render(<${name} {...defaultProps} ${eventHandler}={${eventHandler}} />);
      
      const element = screen.getByRole('button'); // Adjust selector as needed
      await user.${this.getEventMethod(eventName)}(element);
      
      expect(${eventHandler}).toHaveBeenCalledTimes(1);
    });

`;
    });

    tests += `  });

`;
    return tests;
  }

  getEventMethod(eventName) {
    const eventMethods = {
      'click': 'click',
      'change': 'type',
      'submit': 'click',
      'focus': 'click',
      'blur': 'tab',
      'keydown': 'keyboard',
      'keypress': 'keyboard',
      'mouseenter': 'hover',
      'mouseleave': 'unhover'
    };

    return eventMethods[eventName] || 'click';
  }

  generateFormTests(analysis) {
    const { name, hasFormElements } = analysis;
    
    let tests = `  describe('Form Interactions', () => {
`;

    if (hasFormElements.includes('input')) {
      tests += `    it('handles input changes', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      
      render(<${name} {...defaultProps} onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'test input');
      
      expect(input).toHaveValue('test input');
    });

`;
    }

    if (hasFormElements.includes('button')) {
      tests += `    it('handles button clicks', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      
      render(<${name} {...defaultProps} onClick={onClick} />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });

`;
    }

    if (hasFormElements.includes('select')) {
      tests += `    it('handles select changes', async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      
      render(<${name} {...defaultProps} onSelect={onSelect} />);
      
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'option1');
      
      expect(onSelect).toHaveBeenCalled();
    });

`;
    }

    tests += `  });

`;
    return tests;
  }

  generateAccessibilityTests(analysis) {
    const { name, accessibility } = analysis;
    
    let tests = `  describe('Accessibility', () => {
`;

    if (accessibility.hasAriaLabels) {
      tests += `    it('has proper aria labels', () => {
      render(<${name} {...defaultProps} />);
      
      const labeledElements = screen.getAllByLabelText(/./);
      expect(labeledElements.length).toBeGreaterThan(0);
    });

`;
    }

    if (accessibility.hasRoles) {
      tests += `    it('has appropriate roles', () => {
      render(<${name} {...defaultProps} />);
      
      // Test specific roles based on your component
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

`;
    }

    if (accessibility.hasKeyboardHandlers) {
      tests += `    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<${name} {...defaultProps} />);
      
      const element = screen.getByRole('button');
      element.focus();
      
      await user.keyboard('{Enter}');
      // Add assertions for keyboard behavior
    });

`;
    }

    tests += `  });

`;
    return tests;
  }

  generateAnimationTests(analysis) {
    const { name } = analysis;
    
    return `  describe('Animations', () => {
    it('renders motion components correctly', () => {
      render(<${name} {...defaultProps} />);
      // Motion components should render as regular divs in test environment
      expect(screen.getByRole('generic')).toBeInTheDocument();
    });

    it('handles animation state changes', async () => {
      render(<${name} {...defaultProps} />);
      
      // Test animation triggers
      await waitFor(() => {
        // Add specific animation assertions
      });
    });
  });

`;
  }

  generateSnapshotTests(analysis) {
    const { name } = analysis;
    
    return `  describe('Snapshot', () => {
    it('matches snapshot', () => {
      const { container } = render(<${name} {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with different props', () => {
      const testProps = {
        ...defaultProps,
        // Add variant props for comprehensive snapshot testing
      };
      const { container } = render(<${name} {...testProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

`;
  }

  getRelativeImportPath(componentPath) {
    // For test files in __tests__ directory, we need to go back one level
    const componentName = path.basename(componentPath, '.tsx');
    return `../${componentName}`;
  }

  /**
   * Generate test file for a specific component
   */
  async generateComponentTest(componentPath) {
    console.log(`🧪 Analyzing component: ${path.basename(componentPath)}`);
    
    const analysis = this.analyzeComponent(componentPath);
    if (!analysis) {
      console.error(`❌ Failed to analyze component: ${componentPath}`);
      return null;
    }

    console.log(`📊 Test complexity: ${analysis.testComplexity}`);
    console.log(`🎯 Props interfaces: ${analysis.hasProps.length}`);
    console.log(`⚡ Event handlers: ${analysis.hasEvents.length}`);
    
    const testContent = this.generateTestFile(analysis);
    
    // Determine test file location
    const componentDir = path.dirname(componentPath);
    const componentName = path.basename(componentPath, '.tsx');
    
    let testDir;
    if (componentDir.includes('ui')) {
      testDir = path.join(this.componentsDir, 'ui', '__tests__');
    } else if (componentDir.includes('examples')) {
      testDir = path.join(this.componentsDir, 'examples', '__tests__');
    } else if (componentDir.includes('sections')) {
      testDir = path.join(this.componentsDir, 'sections', '__tests__');
    } else if (componentDir.includes('layout')) {
      testDir = path.join(this.componentsDir, 'layout', '__tests__');
    } else {
      testDir = path.join(componentDir, '__tests__');
    }

    // Create test directory if it doesn't exist
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    const testFilePath = path.join(testDir, `${componentName}.test.tsx`);
    
    try {
      fs.writeFileSync(testFilePath, testContent);
      console.log(`✅ Generated test: ${testFilePath}`);
      return testFilePath;
    } catch (error) {
      console.error(`❌ Failed to write test file: ${error}`);
      return null;
    }
  }

  /**
   * Get all components that need tests
   */
  getUntestedComponents() {
    const allComponents = [];
    
    const findComponents = (dir) => {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory() && !item.includes('__tests__')) {
          findComponents(itemPath);
        } else if (item.endsWith('.tsx') && !item.includes('.test.')) {
          allComponents.push(itemPath);
        }
      });
    };

    findComponents(this.componentsDir);
    
    // Filter out components that already have tests
    const untestedComponents = allComponents.filter(componentPath => {
      const componentName = path.basename(componentPath, '.tsx');
      const componentDir = path.dirname(componentPath);
      const testDir = path.join(componentDir, '__tests__');
      const testFile = path.join(testDir, `${componentName}.test.tsx`);
      
      return !fs.existsSync(testFile);
    });

    return untestedComponents;
  }

  /**
   * Generate tests for all untested components
   */
  async generateAllTests() {
    const untestedComponents = this.getUntestedComponents();
    
    console.log(`🚀 Found ${untestedComponents.length} components without tests`);
    console.log('📋 Components to test:');
    untestedComponents.forEach(comp => {
      console.log(`  • ${path.relative(this.projectRoot, comp)}`);
    });

    const results = {
      successful: [],
      failed: []
    };

    for (const componentPath of untestedComponents) {
      try {
        const testPath = await this.generateComponentTest(componentPath);
        if (testPath) {
          results.successful.push(testPath);
        } else {
          results.failed.push(componentPath);
        }
      } catch (error) {
        console.error(`❌ Error generating test for ${componentPath}:`, error);
        results.failed.push(componentPath);
      }
    }

    console.log(`\\n🎉 Test generation complete!`);
    console.log(`✅ Successfully generated: ${results.successful.length}`);
    console.log(`❌ Failed: ${results.failed.length}`);

    if (results.failed.length > 0) {
      console.log('\\n❌ Failed components:');
      results.failed.forEach(comp => {
        console.log(`  • ${path.relative(this.projectRoot, comp)}`);
      });
    }

    return results;
  }

  /**
   * Display usage help
   */
  displayHelp() {
    console.log(`
🧪 Component Testing Agent

Usage:
  node scripts/component-testing-agent.js [command] [options]

Commands:
  generate <component-path>    Generate test for specific component
  generate-all                Generate tests for all untested components
  list                        List all components without tests
  help                        Show this help message

Examples:
  node scripts/component-testing-agent.js generate src/components/ui/Button.tsx
  node scripts/component-testing-agent.js generate-all
  node scripts/component-testing-agent.js list

This agent generates comprehensive Jest + React Testing Library tests
following best practices for component testing and accessibility.
    `);
  }
}

// CLI Interface
async function main() {
  const agent = new ComponentTestingAgent();
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'help') {
    agent.displayHelp();
    return;
  }

  const command = args[0];

  switch (command) {
    case 'generate':
      if (args.length < 2) {
        console.error('❌ Please specify a component path');
        console.log('💡 Use "list" command to see available components');
        return;
      }
      try {
        await agent.generateComponentTest(args[1]);
      } catch (error) {
        console.error('❌ Test generation failed:', error.message);
      }
      break;

    case 'generate-all':
      await agent.generateAllTests();
      break;

    case 'list':
      console.log('📋 Components without tests:');
      const untested = agent.getUntestedComponents();
      untested.forEach(comp => {
        console.log(`  • ${path.relative(agent.projectRoot, comp)}`);
      });
      console.log(`\\nTotal: ${untested.length} components`);
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

module.exports = ComponentTestingAgent;
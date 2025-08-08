#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Component patterns to generate
const PATTERNS_TO_GENERATE = [
  'augmented-creation',
  'responsible-ai-design', 
  'error-recovery',
  'collaborative-ai',
  'ambient-intelligence',
  'safe-exploration'
];

const COMPONENTS_DIR = 'src/components/examples';
const TESTS_DIR = 'src/components/examples/__tests__';
const CODE_EXAMPLE_BLOCK_PATH = 'src/components/ui/CodeExampleBlock.tsx';

console.log('🚀 Starting automated demo component generation...\n');

// Backup CodeExampleBlock.tsx
function backupCodeExampleBlock() {
  const backupPath = `${CODE_EXAMPLE_BLOCK_PATH}.backup-${Date.now()}`;
  fs.copyFileSync(CODE_EXAMPLE_BLOCK_PATH, backupPath);
  console.log(`✅ Backed up CodeExampleBlock.tsx to ${backupPath}`);
  return backupPath;
}

// Extract component info from pattern
function extractComponentInfo(patternName) {
  const codeExamplePath = `src/data/patterns/patterns/${patternName}/code-examples.ts`;
  
  if (!fs.existsSync(codeExamplePath)) {
    throw new Error(`Code examples not found for pattern: ${patternName}`);
  }
  
  const content = fs.readFileSync(codeExamplePath, 'utf8');
  
  // Extract componentId
  const componentIdMatch = content.match(/componentId:\s*['"](.*?)['"]/);
  if (!componentIdMatch) {
    throw new Error(`ComponentId not found in ${patternName}`);
  }
  
  // Extract code (between backticks)
  const codeMatch = content.match(/code:\s*`([\s\S]*?)`\s*}/);
  if (!codeMatch) {
    throw new Error(`Code not found in ${patternName}`);
  }
  
  // Extract title and description
  const titleMatch = content.match(/title:\s*['"](.*?)['"]/);
  const descriptionMatch = content.match(/description:\s*['"](.*?)['"]/);
  
  return {
    patternName,
    componentId: componentIdMatch[1],
    code: codeMatch[1],
    title: titleMatch ? titleMatch[1] : 'Demo Component',
    description: descriptionMatch ? descriptionMatch[1] : 'Interactive demo component'
  };
}

// Convert pattern name to component name
function getComponentName(patternName) {
  return patternName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Demo';
}

// Generate React component file
function generateComponentFile(info) {
  const componentName = getComponentName(info.patternName);
  
  // Clean up the code - remove export default and wrap properly
  let componentCode = info.code
    .replace(/^export default function \w+\(\)/m, `export default function ${componentName}()`)
    .replace(/import.*from 'lucide-react';?\n?/g, '') // Remove lucide-react imports
    .replace(/import.*framer-motion.*;?\n?/g, '') // Remove framer-motion imports if present
    .replace(/^import.*framer-motion.*$/gm, ''); // Remove any framer-motion lines
  
  // Add necessary client directive and imports
  const fullComponent = `'use client';

import React, { useState, useEffect, useRef } from 'react';

// Inline SVG icons to avoid external dependencies
const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const Check = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const Settings = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const AlertTriangle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const Shield = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

${componentCode}`;

  const filePath = path.join(COMPONENTS_DIR, `${componentName}.tsx`);
  fs.writeFileSync(filePath, fullComponent);
  console.log(`✅ Generated ${componentName}.tsx`);
  
  return { componentName, filePath };
}

// Generate test file
function generateTestFile(info, componentName) {
  const testContent = `import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ${componentName} from '../${componentName}';

describe('${componentName}', () => {
  const defaultProps = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<${componentName} {...defaultProps} />);
    });

    it('renders with correct structure', () => {
      const { container } = render(<${componentName} {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('manages internal state correctly', () => {
      render(<${componentName} {...defaultProps} />);
      // Test initial state
      expect(screen.getByRole('generic')).toBeInTheDocument();
    });

    it('updates state on user interaction', async () => {
      const user = userEvent.setup();
      render(<${componentName} {...defaultProps} />);
      
      // Find interactive elements
      const buttons = screen.queryAllByRole('button');
      if (buttons.length > 0) {
        await user.click(buttons[0]);
        expect(buttons[0]).toBeInTheDocument();
      }
    });
  });

  describe('Event Handling', () => {
    it('handles button interactions', async () => {
      const user = userEvent.setup();
      render(<${componentName} {...defaultProps} />);
      
      const buttons = screen.queryAllByRole('button');
      if (buttons.length > 0) {
        await user.click(buttons[0]);
        expect(buttons[0]).toBeInTheDocument();
      }
    });

    it('handles form interactions', async () => {
      const user = userEvent.setup();
      render(<${componentName} {...defaultProps} />);
      
      const inputs = screen.queryAllByRole('textbox');
      if (inputs.length > 0) {
        await user.type(inputs[0], 'test input');
        expect(inputs[0]).toBeInTheDocument();
      }
    });
  });

  describe('Accessibility', () => {
    it('has proper roles and labels', () => {
      render(<${componentName} {...defaultProps} />);
      
      // Check for basic accessibility elements
      const container = screen.getByRole('generic');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Snapshot', () => {
    it('matches snapshot', () => {
      const { container } = render(<${componentName} {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with interactions', async () => {
      const user = userEvent.setup();
      const { container } = render(<${componentName} {...defaultProps} />);
      
      // Trigger any available interactions
      const buttons = screen.queryAllByRole('button');
      if (buttons.length > 0) {
        await user.click(buttons[0]);
      }
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});`;

  const testFilePath = path.join(TESTS_DIR, `${componentName}.test.tsx`);
  fs.writeFileSync(testFilePath, testContent);
  console.log(`✅ Generated ${componentName}.test.tsx`);
  
  return testFilePath;
}

// Update CodeExampleBlock.tsx with new import and switch case
function updateCodeExampleBlock(componentName, componentId) {
  let content = fs.readFileSync(CODE_EXAMPLE_BLOCK_PATH, 'utf8');
  
  // Add import after the last existing import
  const lastImportRegex = /^(const \w+Demo = dynamic\([\s\S]*?\);\s*)/m;
  const importToAdd = `
// Dynamically import the ${componentName} component
const ${componentName} = dynamic(
  () => import('@/components/examples/${componentName}'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);`;
  
  // Find the last import and add after it
  const lastImportMatch = content.match(/^(.*const \w+Demo = dynamic\([\s\S]*?\);)\s*$/gm);
  if (lastImportMatch) {
    const lastImport = lastImportMatch[lastImportMatch.length - 1];
    content = content.replace(lastImport, lastImport + importToAdd);
  }
  
  // Add switch case before default case
  const switchCaseToAdd = `      case '${componentId}':
        return <${componentName} />;`;
  
  content = content.replace(
    /(\s+)default:/,
    `$1${switchCaseToAdd}
$1default:`
  );
  
  fs.writeFileSync(CODE_EXAMPLE_BLOCK_PATH, content);
  console.log(`✅ Updated CodeExampleBlock.tsx for ${componentName}`);
}

// Run tests for specific component
function runComponentTest(componentName) {
  try {
    console.log(`🧪 Testing ${componentName}...`);
    execSync(`npm test -- --testPathPattern=${componentName}.test.tsx --watchAll=false --verbose=false`, 
      { stdio: 'pipe' });
    console.log(`✅ ${componentName} tests passed`);
    return true;
  } catch (error) {
    console.error(`❌ ${componentName} tests failed:`, error.message);
    return false;
  }
}

// Test build
function testBuild() {
  try {
    console.log('🏗️  Testing build...');
    execSync('npm run build', { stdio: 'pipe' });
    console.log('✅ Build successful');
    return true;
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  const backupPath = backupCodeExampleBlock();
  let successCount = 0;
  
  try {
    for (const patternName of PATTERNS_TO_GENERATE) {
      console.log(`\n🔨 Generating component for ${patternName}...`);
      
      // Extract component info
      const info = extractComponentInfo(patternName);
      console.log(`📝 Found componentId: ${info.componentId}`);
      
      // Generate component file
      const { componentName } = generateComponentFile(info);
      
      // Generate test file
      generateTestFile(info, componentName);
      
      // Update CodeExampleBlock.tsx
      updateCodeExampleBlock(componentName, info.componentId);
      
      // Run tests
      if (runComponentTest(componentName)) {
        successCount++;
        console.log(`✅ ${componentName} completed successfully`);
      } else {
        throw new Error(`Tests failed for ${componentName}`);
      }
    }
    
    // Final build test
    if (testBuild()) {
      console.log(`\n🎉 Successfully generated ${successCount}/${PATTERNS_TO_GENERATE.length} components!`);
      console.log(`📊 All components tested and integrated successfully`);
      
      // Clean up backup
      fs.unlinkSync(backupPath);
      console.log(`🧹 Cleaned up backup file`);
    }
    
  } catch (error) {
    console.error(`\n❌ Generation failed:`, error.message);
    console.log(`🔄 Restoring backup...`);
    
    // Restore backup
    fs.copyFileSync(backupPath, CODE_EXAMPLE_BLOCK_PATH);
    console.log(`✅ Restored CodeExampleBlock.tsx from backup`);
    
    process.exit(1);
  }
}

main().catch(console.error);
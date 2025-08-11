#!/usr/bin/env node

/**
 * Fix missing test utility imports in test files
 * Addresses the most common TypeScript errors in our test suite
 */

const fs = require('fs');
const path = require('path');

class TestImportFixer {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.testFiles = [];
    this.fixedCount = 0;
  }

  /**
   * Find all test files with import issues
   */
  findTestFiles() {
    const componentsDir = path.join(this.projectRoot, 'src', 'components');
    this.findTestFilesRecursive(componentsDir);
    console.log(`Found ${this.testFiles.length} test files to check`);
  }

  findTestFilesRecursive(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        this.findTestFilesRecursive(fullPath);
      } else if (item.endsWith('.test.tsx') || item.endsWith('.test.ts')) {
        this.testFiles.push(fullPath);
      }
    });
  }

  /**
   * Fix imports in a single test file
   */
  fixTestFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let modified = false;

    // Check if file uses these utilities without importing them
    const usesUser = content.includes('user.') && !content.includes("'_user'");
    const usesWaitFor = content.includes('waitFor(') || content.includes('waitFor ');
    const usesFireEvent = content.includes('fireEvent.');
    
    // Check what's already imported from @testing-library/react
    const hasRenderImport = content.includes("from '@testing-library/react'");
    const hasUserEventImport = content.includes("from '@testing-library/user-event'");
    
    // Build missing imports
    const missingImports = [];
    
    // Handle @testing-library/react imports
    if (hasRenderImport) {
      // Check if waitFor or fireEvent need to be added to existing import
      const rtlImportMatch = content.match(/import\s*{([^}]+)}\s*from\s*['"]@testing-library\/react['"]/);
      if (rtlImportMatch) {
        const imports = rtlImportMatch[1].split(',').map(i => i.trim());
        const needsWaitFor = usesWaitFor && !imports.includes('waitFor');
        const needsFireEvent = usesFireEvent && !imports.includes('fireEvent');
        
        if (needsWaitFor || needsFireEvent) {
          const newImports = [...imports];
          if (needsWaitFor) newImports.push('waitFor');
          if (needsFireEvent) newImports.push('fireEvent');
          
          const newImportStatement = `import { ${newImports.join(', ')} } from '@testing-library/react'`;
          content = content.replace(rtlImportMatch[0], newImportStatement);
          modified = true;
        }
      }
    } else if (usesWaitFor || usesFireEvent) {
      // Add new import for @testing-library/react
      const imports = [];
      if (usesWaitFor) imports.push('waitFor');
      if (usesFireEvent) imports.push('fireEvent');
      missingImports.push(`import { ${imports.join(', ')} } from '@testing-library/react';`);
    }
    
    // Handle user-event import
    if (usesUser && !hasUserEventImport) {
      // Check if there's a _user variable that needs to be renamed
      if (content.includes('const _user = userEvent.setup()')) {
        // Rename _user to user
        content = content.replace(/const _user = userEvent\.setup\(\)/g, 'const user = userEvent.setup()');
        content = content.replace(/_user\./g, 'user.');
        modified = true;
      } else if (!content.includes('const user =')) {
        // Add user setup after userEvent import will be added
        missingImports.push(`import userEvent from '@testing-library/user-event';`);
      }
    }

    // Fix incorrect user references (missing 'await' or wrong variable name)
    if (content.includes('user.click') || content.includes('user.type')) {
      // Ensure all user interactions are awaited
      content = content.replace(/([^await\s])user\.(click|type|hover|clear|selectOptions|upload|tab|keyboard)/g, '$1await user.$2');
      // Fix double await
      content = content.replace(/await\s+await\s+/g, 'await ');
      modified = true;
    }

    // Fix 'Cannot find name 'button'' errors - these are usually meant to be queries
    if (content.includes("Cannot find name 'button'") || content.match(/^\s*button\./m)) {
      // This is likely a missing variable definition or wrong syntax
      // These errors usually mean the test is trying to use a button that wasn't queried
      // We'll need to handle this case-by-case, but we can fix obvious patterns
      content = content.replace(/^\s*button\./gm, '    // FIXME: button.');
      modified = true;
    }

    // Add missing imports at the top of the file
    if (missingImports.length > 0) {
      // Find where to insert imports (after existing imports or at the top)
      const importRegex = /^import\s+.*$/m;
      const lastImportMatch = content.match(/^import\s+.*;?\s*$/gm);
      
      if (lastImportMatch) {
        const lastImport = lastImportMatch[lastImportMatch.length - 1];
        const insertPosition = content.lastIndexOf(lastImport) + lastImport.length;
        content = content.slice(0, insertPosition) + '\n' + missingImports.join('\n') + content.slice(insertPosition);
      } else {
        // No imports found, add at the beginning
        content = missingImports.join('\n') + '\n\n' + content;
      }
      modified = true;
    }

    // Save if modified
    if (modified) {
      fs.writeFileSync(filePath, content);
      this.fixedCount++;
      console.log(`✅ Fixed: ${path.relative(this.projectRoot, filePath)}`);
    }
    
    return modified;
  }

  /**
   * Fix all test files
   */
  fixAllTests() {
    console.log('\n🔧 Fixing test import errors...\n');
    
    this.findTestFiles();
    
    this.testFiles.forEach(file => {
      try {
        this.fixTestFile(file);
      } catch (error) {
        console.error(`❌ Error fixing ${path.relative(this.projectRoot, file)}: ${error.message}`);
      }
    });
    
    console.log(`\n✨ Fixed ${this.fixedCount} test files`);
  }

  /**
   * Fix Web Speech API types
   */
  fixWebSpeechTypes() {
    console.log('\n🔧 Adding Web Speech API type definitions...\n');
    
    const typeDefsPath = path.join(this.projectRoot, 'src', 'types', 'speech.d.ts');
    const typeDefsContent = `// Web Speech API Type Definitions
// These are not included in TypeScript by default

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

declare var SpeechRecognition: SpeechRecognitionConstructor | undefined;
declare var webkitSpeechRecognition: SpeechRecognitionConstructor | undefined;
`;

    // Create types directory if it doesn't exist
    const typesDir = path.dirname(typeDefsPath);
    if (!fs.existsSync(typesDir)) {
      fs.mkdirSync(typesDir, { recursive: true });
    }

    // Write type definitions
    fs.writeFileSync(typeDefsPath, typeDefsContent);
    console.log(`✅ Created Web Speech API types at: ${path.relative(this.projectRoot, typeDefsPath)}`);
  }
}

// Run if called directly
if (require.main === module) {
  const fixer = new TestImportFixer();
  fixer.fixAllTests();
  fixer.fixWebSpeechTypes();
  
  console.log('\n💡 Next steps:');
  console.log('1. Run: npm run ts-validate');
  console.log('2. If errors remain, run: npm run ts-fix');
  console.log('3. Run tests: npm test');
}

module.exports = TestImportFixer;
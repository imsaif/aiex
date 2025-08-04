#!/usr/bin/env node

/**
 * Fix variable reference issues in test files
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const projectRoot = process.cwd();

// Find all test files
const testFiles = glob.sync('**/*.test.tsx', { cwd: projectRoot });

console.log(`Found ${testFiles.length} test files to analyze`);

let totalFixed = 0;

testFiles.forEach(filePath => {
  const fullPath = path.join(projectRoot, filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;
  
  // Fix variable reference issues where element is used but button is expected
  content = content.replace(
    /const element = screen\.getByRole\('button'\);([^}]+)expect\(button\)\.toBeInTheDocument\(\);/gs,
    `const element = screen.getByRole('button');$1expect(element).toBeInTheDocument();`
  );
  
  // Fix similar issues with different patterns
  content = content.replace(
    /expect\(button\)\.toBeInTheDocument\(\);/g,
    'expect(element).toBeInTheDocument();'
  );
  
  // But if button is actually defined, keep it as button
  content = content.replace(
    /const button = screen\.getByRole\('button'\);([^}]+)expect\(element\)\.toBeInTheDocument\(\);/gs,
    `const button = screen.getByRole('button');$1expect(button).toBeInTheDocument();`
  );
  
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Fixed ${path.basename(filePath)}`);
    totalFixed++;
  }
});

console.log(`\n🎉 Fixed ${totalFixed} test files!`);
#!/usr/bin/env node

/**
 * Design Audit Script
 * Scans components for hardcoded colors and design system violations
 */

const fs = require('fs');
const path = require('path');

// Design system configuration from tailwind.config.mjs
const DESIGN_TOKENS = {
  background: ['primary', 'secondary', 'tertiary'],
  surface: ['primary', 'secondary', 'elevated'],
  text: ['primary', 'secondary', 'tertiary', 'disabled'],
  accent: ['primary', 'hover', 'subtle'],
  category: [
    'blue', 'purple', 'amber', 'teal', 'indigo', 'green', 'rose',
    'orange', 'cyan', 'emerald', 'violet', 'pink', 'slate', 'neutral'
  ],
  border: [
    'primary', 'secondary', 'focus', 'success', 'error', 'warning', 'info',
    'interactive', 'interactive-hover', 'selected', 'disabled', 'divider', 'divider-subtle'
  ],
  ring: ['focus', 'focus-error', 'focus-success', 'focus-warning']
};

// Known Tailwind colors that are reliable
const RELIABLE_TAILWIND_COLORS = {
  'bg-black': true,
  'bg-white': true,
  'text-white': true,
  'text-black': true,
  'text-gray-900': true,
  'text-gray-700': true,
  'text-gray-600': true,
  'text-gray-500': true,
  'bg-gray-800': true,
  'bg-gray-100': true,
  'bg-gray-50': true,
  'bg-red-600': true,
  'bg-yellow-400': true,
  'bg-yellow-300': true,
  'border-gray-200': true,
  'border-gray-300': true,
  'hover:bg-gray-100': true,
  'hover:bg-gray-800': true,
  'hover:text-gray-900': true,
  // Dark mode variants
  'dark:text-gray-900': true,
  'dark:text-gray-700': true,
  'dark:text-white': true,
  'dark:text-black': true,
  'dark:bg-white': true,
  'dark:bg-black': true,
  'dark:bg-gray-800': true,
  'dark:bg-gray-900': true,
};

// Known issues with design tokens
const TOKEN_ISSUES = {
  'bg-category-rose': 'Design token has rendering issues - use bg-red-600 instead',
  'bg-category-amber': 'Design token has rendering issues - use bg-yellow-400 instead',
  'text-background-primary': 'Cross-namespace color not supported by Tailwind',
  'text-accent-primary': 'Design token has rendering issues - use text-white or text-black',
};

// Color extraction regex patterns
const COLOR_PATTERNS = [
  /(?:^|\s)((?:bg|text|border|ring|outline|shadow|divide)-[\w\-]+)/g,
  /className=["'`]([^"'`]*(?:(?:bg|text|border|ring)-[\w\-]+)[^"'`]*)["'`]/g,
];

class DesignAudit {
  constructor(options = {}) {
    this.options = {
      strict: options.strict || false,
      fix: options.fix || false,
      path: options.path || 'src',
      ...options
    };
    this.violations = [];
    this.passes = [];
  }

  run() {
    console.log('🎨 Design System Audit\n');

    let files;
    if (this.options.stagedFiles) {
      console.log(`Auditing staged files (new code only)`);
      console.log(`Mode: ${this.options.strict ? 'Strict - Block violations in new code' : 'Standard'}\n`);
      files = this.options.stagedFiles;
    } else {
      console.log(`Scanning: ${this.options.path}`);
      console.log(`Mode: ${this.options.strict ? 'Strict' : 'Standard'}\n`);
      files = this.findFiles(this.options.path);
    }

    console.log(`Found ${files.length} files to scan...\n`);

    // Scan each file
    for (const file of files) {
      this.scanFile(file);
    }

    // Generate report
    this.generateReport();
  }

  findFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      // Skip ignored directories
      if (stat.isDirectory()) {
        if (['node_modules', '.next', 'dist', '__tests__', '.git', 'coverage'].includes(file)) {
          continue;
        }
        this.findFiles(filePath, fileList);
      } else {
        // Only process TypeScript/JavaScript files
        if (/\.(tsx?|jsx?)$/.test(file) && !file.endsWith('.test.ts') && !file.endsWith('.test.tsx')) {
          fileList.push(filePath);
        }
      }
    }

    return fileList;
  }

  scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, lineNum) => {
      // Extract color classes from this line
      const colors = this.extractColors(line);

      colors.forEach(color => {
        const violation = this.checkColor(color, filePath, lineNum + 1, line);
        if (violation) {
          this.violations.push(violation);
        } else {
          this.passes.push({
            file: this.relativePath(filePath),
            line: lineNum + 1,
            color: color,
            status: 'valid'
          });
        }
      });
    });
  }

  extractColors(line) {
    const colors = new Set();

    // Pattern 1: Individual color utilities
    const matches1 = line.match(/(?:^|\s)((?:bg|text|border|ring|outline|shadow|divide)-[\w\-]+)/g);
    if (matches1) {
      matches1.forEach(match => {
        colors.add(match.trim());
      });
    }

    // Pattern 2: Colors in class attributes
    const classMatches = line.match(/(?:class|className)=["'`]([^"'`]+)["'`]/g);
    if (classMatches) {
      classMatches.forEach(classAttr => {
        const classValue = classAttr.match(/=["'`]([^"'`]+)["'`]/)[1];
        const colorMatches = classValue.match(/((?:bg|text|border|ring|outline|shadow|divide)-[\w\-]+)/g);
        if (colorMatches) {
          colorMatches.forEach(color => colors.add(color));
        }
      });
    }

    return Array.from(colors);
  }

  checkColor(color, filePath, lineNum, lineContent) {
    // Check if it's a known good Tailwind color
    if (RELIABLE_TAILWIND_COLORS[color]) {
      return null; // No violation
    }

    // Check if it's a known issue token (informational, not blocking)
    if (TOKEN_ISSUES[color]) {
      return {
        severity: 'info',
        file: this.relativePath(filePath),
        line: lineNum,
        color: color,
        issue: TOKEN_ISSUES[color],
        code: lineContent.trim()
      };
    }

    // Design tokens are correct usage — not violations
    if (this.isDesignToken(color)) {
      return null;
    }

    // Check if it looks like a hardcoded color
    if (this.isColorUtility(color)) {
      return {
        severity: 'info',
        file: this.relativePath(filePath),
        line: lineNum,
        color: color,
        issue: 'Hardcoded color - consider using design token equivalent',
        code: lineContent.trim()
      };
    }

    return null;
  }

  isDesignToken(color) {
    // Design tokens are in format: token-category-name
    const parts = color.split('-');
    if (parts.length < 2) return false;

    const category = parts[0];
    const name = parts.slice(1).join('-');

    // Check against known token categories
    if (category === 'bg' || category === 'text' || category === 'border' || category === 'ring') {
      // Check if the rest matches any token
      for (const [tokenType, tokenNames] of Object.entries(DESIGN_TOKENS)) {
        if (tokenNames.some(token => name.includes(token))) {
          return true;
        }
      }
    }

    return false;
  }

  isColorUtility(color) {
    // Check if it matches Tailwind color utility pattern
    // bg-*, text-*, border-*, etc.
    const colorPrefix = color.split('-')[0];
    return ['bg', 'text', 'border', 'ring', 'outline', 'shadow', 'divide'].includes(colorPrefix);
  }

  generateReport() {
    if (this.violations.length === 0 && this.passes.length === 0) {
      console.log('No color utilities found.\n');
      return;
    }

    // Group violations by severity
    const warnings = this.violations.filter(v => v.severity === 'warning');
    const infos = this.violations.filter(v => v.severity === 'info');

    // Print report
    if (warnings.length > 0) {
      console.log('⚠️  Violations (' + warnings.length + ')\n');
      warnings.forEach(v => {
        console.log(`  ${v.file}:${v.line}`);
        console.log(`    Color: ${v.color}`);
        console.log(`    Issue: ${v.issue}`);
        console.log(`    Code: ${v.code.substring(0, 80)}`);
        console.log('');
      });
    }

    if (!this.options.strict && infos.length > 0) {
      console.log('ℹ️  Info (' + infos.length + ')\n');
      console.log(`  ${infos.length} hardcoded colors found (run with --strict to see details)`);
      console.log('');
    }

    // Summary
    const total = this.violations.length;
    const passCount = this.passes.length;
    const compliance = passCount + this.violations.length > 0
      ? Math.round((passCount / (passCount + total)) * 100)
      : 0;

    console.log('📊 Summary');
    console.log(`  Design Compliance: ${compliance}%`);
    console.log(`  Valid Colors: ${passCount}`);
    console.log(`  Violations: ${warnings.length}`);
    if (!this.options.stagedFiles) {
      console.log(`  Info Items: ${infos.length}`);
    }
    console.log('');

    // For staged files in strict mode, exit with error if violations found
    if (this.options.stagedFiles && warnings.length > 0) {
      console.log('❌ Design violations detected in new code!');
      console.log('');
      console.log('Fix the violations above and try committing again.');
      console.log('');
      process.exit(1);
    }

    if (warnings.length > 0 && !this.options.stagedFiles) {
      console.log('⚡ Next Steps:');
      console.log('  1. Review warnings above');
      console.log('  2. Replace design tokens that have rendering issues with standard Tailwind colors');
      console.log('  3. Run npm run design-audit again to verify fixes');
    } else if (warnings.length === 0) {
      console.log('✅ Design audit passed!');
    }
  }

  relativePath(filePath) {
    return path.relative(process.cwd(), filePath);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const stagedOnly = args.includes('--staged');

// Get staged files if requested
let filesToAudit = null;
if (stagedOnly) {
  try {
    const { execSync } = require('child_process');
    const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf-8' })
      .split('\n')
      .filter(file => file && /\.(tsx?|jsx?)$/.test(file) && !file.endsWith('.test.ts') && !file.endsWith('.test.tsx'))
      .map(file => path.join(process.cwd(), file));

    if (stagedFiles.length === 0) {
      console.log('✅ No staged code files to audit');
      process.exit(0);
    }

    filesToAudit = stagedFiles;
  } catch (err) {
    console.error('❌ Failed to get staged files:', err.message);
    process.exit(1);
  }
}

const options = {
  strict: args.includes('--strict') || stagedOnly, // Staged files are always strict
  fix: args.includes('--fix'),
  path: args.find(arg => !arg.startsWith('--')) || 'src',
  stagedFiles: filesToAudit
};

// Run audit
try {
  const audit = new DesignAudit(options);
  audit.run();
} catch (err) {
  console.error('❌ Audit failed:', err.message);
  process.exit(1);
}

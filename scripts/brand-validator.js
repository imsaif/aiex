#!/usr/bin/env node

/**
 * Brand Design System Validator
 *
 * Validates code against BRAND_GUIDELINES.md
 * Runs on staged files (pre-commit) or specific files
 *
 * Usage:
 *   node scripts/brand-validator.js [--staged] [--fix] [--verbose]
 *
 * Flags:
 *   --staged    Only check staged git files (default for pre-commit)
 *   --fix       Auto-fix violations where possible
 *   --verbose   Show all details including warnings
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

const flags = {
  staged: process.argv.includes('--staged'),
  fix: process.argv.includes('--fix'),
  verbose: process.argv.includes('--verbose'),
};

// Track violations
const violations = {
  critical: [],
  warnings: [],
};

/**
 * Get list of files to validate
 */
function getFilesToValidate() {
  if (flags.staged) {
    try {
      const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
        encoding: 'utf-8',
      });
      return output
        .split('\n')
        .filter(f => f && /\.(tsx?|jsx?|css)$/.test(f))
        .filter(f => fs.existsSync(f));
    } catch (e) {
      return [];
    }
  }
  return [];
}

/**
 * ALLOWED PATTERNS - Skip validation for these specific patterns
 * These are intentional design decisions that require hardcoded values
 */
const allowedPatterns = [
  // Grain texture backgrounds require both light and dark mode hex values
  /bg-\[#F0F1F5\]\s+dark:bg-\[#162036\]/,
  /bg-\[#162036\]/,  // Dark mode grain when used alone
  /bg-\[#F0F1F5\]/,  // Light mode grain when used alone
  // Accent button text - white in light mode (navy bg), dark in dark mode (white bg)
  /text-white\s+dark:text-gray-900/,
  /dark:text-gray-900/,
  // Dark container contexts (fixed dark panels that don't follow global light/dark mode)
  // These are intentional for elements like toolkit download panel, CTAs on dark backgrounds
  /bg-gray-900/,         // Dark container backgrounds
  /bg-gray-800/,         // Dark panel secondary backgrounds
  /border-gray-700/,     // Dark container borders
  /border-gray-600/,     // Dark container lighter borders
  /text-gray-400/,       // Secondary text on dark panels
  /hover:border-gray-500/, // Hover states on dark panels
  /hover:bg-gray-800/,   // Hover states on dark panels
  /hover:bg-gray-100/,   // Light hover on dark panel buttons
  /bg-white.*text-gray-900/, // Light buttons on dark backgrounds
  /bg-emerald-500/,      // Success feedback colors
  /text-emerald-200/,    // Success feedback text
  /text-gray-900/,       // Dark text on light elements within dark containers
];

/**
 * Check if a line contains an allowed pattern
 */
function isAllowedPattern(line) {
  return allowedPatterns.some(pattern => pattern.test(line));
}

/**
 * CRITICAL VALIDATORS - Block commits
 */
const criticalValidators = [
  {
    name: 'hardcoded-colors',
    description: 'Hardcoded hex colors instead of design tokens',
    patterns: [
      // Hardcoded hex in className
      /className=["'`]([^"'`]*?)#[0-9a-fA-F]{3,6}([^"'`]*?)["'`]/g,
      // Hardcoded hex in inline style
      /style=\{\s*{[^}]*?color\s*:\s*["']#[0-9a-fA-F]{3,6}["'][^}]*?}\s*\}/g,
      // Direct color values without tokens
      /className=["'`]([^"'`]*(text|bg|border)-(?!text-|background-|surface-|category-|accent-|border-)[a-z]+-\d+[^"'`]*)["'`]/g,
    ],
    fix: (content, line) => {
      // Map common hardcoded colors to tokens
      const colorMap = {
        '#ff0000': 'text-error',
        '#ef4444': 'text-error',
        '#10b981': 'text-success',
        '#059669': 'text-success',
        '#f59e0b': 'text-warning',
        '#3b82f6': 'text-info',
        '#0d0d0d': 'text-text-primary',
        '#ffffff': 'bg-surface-primary',
        '#f5f5f5': 'bg-background-tertiary',
        '#F0F1F5': 'bg-background-grain',  // Grain texture background (light)
        '#162036': 'bg-background-grain',  // Grain texture background (dark)
      };

      let fixed = line;
      for (const [hex, token] of Object.entries(colorMap)) {
        fixed = fixed.replaceAll(hex, token);
      }
      return fixed !== line ? fixed : null;
    },
  },
  {
    name: 'arbitrary-spacing',
    description: 'Arbitrary spacing values instead of design scale',
    pattern: /(?:p|m|px|py|pl|pr|pt|pb|gap|space-[xy])-\[[\d.]+(?:px|rem|em)\]/g,
    fix: (content, line) => {
      // Map arbitrary values to nearest design system scale
      const spacingMap = {
        '8px': '2',
        '12px': '3',
        '16px': '4',
        '20px': '5',
        '24px': '6',
        '32px': '8',
        '40px': '10',
      };

      let fixed = line;
      for (const [arbitrary, token] of Object.entries(spacingMap)) {
        // Escape special regex characters in arbitrary values
        const escapedArbitrary = arbitrary.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`-\\[${escapedArbitrary}\\]`, 'g');
        fixed = fixed.replace(pattern, `-${token}`);
      }
      return fixed !== line ? fixed : null;
    },
  },
];

/**
 * WARNING VALIDATORS - Allowed but discouraged
 */
const warningValidators = [
  {
    name: 'missing-dark-mode',
    description: 'Component missing dark mode variant',
    pattern: /className=["'`][^"'`]*(bg-white|text-black)(?!.*dark:)[^"'`]*["'`]/g,
  },
  {
    name: 'arbitrary-font-size',
    description: 'Arbitrary font size instead of design scale',
    pattern: /text-\[[\d.]+(?:px|rem)\]/g,
  },
  {
    name: 'missing-alt-text',
    description: 'Image missing alt text',
    pattern: /<img\s+(?!.*alt=).*?\/>/g,
  },
  {
    name: 'missing-aria-label',
    description: 'Button or interactive element missing accessible label',
    pattern: /<button\s+(?!.*aria-label).*?>/g,
  },
];

/**
 * Validate a single file
 */
function validateFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Check critical validators
  for (const validator of criticalValidators) {
    const patterns = Array.isArray(validator.patterns) ? validator.patterns : [validator.pattern];

    lines.forEach((line, lineNum) => {
      // Skip lines with allowed patterns
      if (isAllowedPattern(line)) return;

      for (const pattern of patterns) {
        if (pattern.test(line)) {
          const fix = validator.fix ? validator.fix(content, line) : null;
          violations.critical.push({
            file: filePath,
            line: lineNum + 1,
            validator: validator.name,
            description: validator.description,
            content: line.trim(),
            fix,
          });
          pattern.lastIndex = 0; // Reset regex
        }
      }
    });
  }

  // Check warning validators
  if (flags.verbose) {
    for (const validator of warningValidators) {
      lines.forEach((line, lineNum) => {
        if (validator.pattern.test(line)) {
          violations.warnings.push({
            file: filePath,
            line: lineNum + 1,
            validator: validator.name,
            description: validator.description,
            content: line.trim(),
          });
          validator.pattern.lastIndex = 0; // Reset regex
        }
      });
    }
  }
}

/**
 * Apply auto-fixes
 */
function applyFixes() {
  const filesFixed = new Set();

  for (const violation of violations.critical) {
    if (violation.fix) {
      filesFixed.add(violation.file);
      let content = fs.readFileSync(violation.file, 'utf-8');
      const lines = content.split('\n');
      lines[violation.line - 1] = violation.fix;
      content = lines.join('\n');
      fs.writeFileSync(violation.file, content, 'utf-8');
    }
  }

  return Array.from(filesFixed);
}

/**
 * Format and display violations
 */
function reportViolations() {
  const hasBlockers = violations.critical.length > 0;
  const hasWarnings = violations.warnings.length > 0;

  if (!hasBlockers && !hasWarnings) {
    console.log(`${colors.green}✓${colors.reset} Brand validation passed (${colors.green}0 violations${colors.reset})`);
    return 0;
  }

  if (hasBlockers) {
    console.log(`\n${colors.red}❌ CRITICAL Brand Violations (commits blocked):${colors.reset}\n`);

    violations.critical.forEach(v => {
      console.log(`  ${colors.blue}${v.file}${colors.reset}:${colors.yellow}${v.line}${colors.reset}`);
      console.log(`    ${colors.red}✗${colors.reset} ${v.description}`);
      console.log(`      ${colors.gray}${v.content.substring(0, 80)}${colors.reset}`);

      if (v.fix) {
        console.log(`    ${colors.green}✓ Fix:${colors.reset} ${v.fix.substring(0, 80)}`);
      }
      console.log();
    });
  }

  if (hasWarnings && flags.verbose) {
    console.log(`\n${colors.yellow}⚠️  Minor Brand Violations (warnings):${colors.reset}\n`);

    violations.warnings.forEach(v => {
      console.log(`  ${colors.blue}${v.file}${colors.reset}:${colors.yellow}${v.line}${colors.reset}`);
      console.log(`    ${colors.yellow}!${colors.reset} ${v.description}`);
      console.log(`      ${colors.gray}${v.content.substring(0, 80)}${colors.reset}`);
      console.log();
    });
  }

  // Summary
  const criticalsCount = violations.critical.length;
  const warningsCount = violations.warnings.length;

  console.log(`\n${colors.gray}─────────────────────────────────────${colors.reset}`);
  if (criticalsCount > 0) {
    console.log(`${colors.red}Critical:${colors.reset} ${criticalsCount} violation${criticalsCount !== 1 ? 's' : ''}`);
  }
  if (warningsCount > 0) {
    console.log(`${colors.yellow}Warnings:${colors.reset} ${warningsCount} issue${warningsCount !== 1 ? 's' : ''}`);
  }

  if (flags.fix && violations.critical.some(v => v.fix)) {
    const fixedCount = violations.critical.filter(v => v.fix).length;
    console.log(`${colors.green}Auto-fixed:${colors.reset} ${fixedCount} violation${fixedCount !== 1 ? 's' : ''}`);
  } else if (violations.critical.some(v => v.fix)) {
    console.log(`\n${colors.blue}💡${colors.reset} Run ${colors.yellow}'npm run brand:fix'${colors.reset} to auto-apply ${violations.critical.filter(v => v.fix).length} fix(es)`);
  }

  console.log(`${colors.gray}─────────────────────────────────────${colors.reset}\n`);

  return hasBlockers ? 1 : 0;
}

/**
 * Main execution
 */
async function main() {
  const files = getFilesToValidate();

  if (files.length === 0) {
    if (!flags.staged) {
      console.log(`${colors.yellow}⚠️  No staged files to validate${colors.reset}`);
    }
    return 0;
  }

  // Validate each file
  files.forEach(file => validateFile(file));

  // Apply fixes if requested
  if (flags.fix && violations.critical.some(v => v.fix)) {
    const fixedFiles = applyFixes();
    console.log(`${colors.green}✓ Auto-fixed ${fixedFiles.length} file(s)${colors.reset}\n`);
    // Re-validate after fixes
    violations.critical = violations.critical.filter(v => !v.fix);
    files.forEach(file => validateFile(file));
  }

  // Report and exit
  const exitCode = reportViolations();
  process.exit(exitCode);
}

main().catch(err => {
  console.error(`${colors.red}Error:${colors.reset}`, err.message);
  process.exit(1);
});

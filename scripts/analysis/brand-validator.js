#!/usr/bin/env node

/**
 * Brand Design System Validator
 *
 * Validates code against the design system documented at /design-system.
 * Runs on staged files (pre-commit), the whole src/ tree (--all), or
 * specific files. Can produce a summary report (--report).
 *
 * Usage:
 *   node scripts/analysis/brand-validator.js [--staged|--all] [--fix] [--verbose] [--report]
 *
 * Flags:
 *   --staged    Only check staged git files (default for pre-commit)
 *   --all       Walk the entire src/ tree
 *   --fix       Auto-fix violations where possible
 *   --verbose   Show all details including warnings
 *   --report    Print summary (count, top offender files, by-rule breakdown)
 *               and exit 0 — does not block.
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
  bold: '\x1b[1m',
};

const flags = {
  staged: process.argv.includes('--staged'),
  all: process.argv.includes('--all'),
  fix: process.argv.includes('--fix'),
  verbose: process.argv.includes('--verbose'),
  report: process.argv.includes('--report'),
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
        .filter((f) => f && /\.(tsx?|jsx?|css)$/.test(f))
        .filter((f) => fs.existsSync(f));
    } catch (e) {
      return [];
    }
  }
  if (flags.all || flags.report) {
    return walkDirectory('src');
  }
  return [];
}

function walkDirectory(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip generated + test directories
      if (entry.name === 'generated' || entry.name === '__tests__' || entry.name.startsWith('.')) {
        continue;
      }
      out.push(...walkDirectory(full));
    } else if (/\.(tsx?|jsx?|css)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Specific shades + contexts that are intentional design choices.
 * NARROW. The previous version allowed `bg-green-`, `bg-red-`, etc. wholesale —
 * that neutralized the validator. Status indicators should use the design
 * system tokens (text-status-success, border-error, bg-status-error/10, etc.);
 * the exceptions below are the small set of places where the system doesn't
 * yet have a token at the exact opacity/shade needed.
 */
const allowedPatterns = [
  // Grain texture surface treatment (documented on /design-system)
  /bg-\[#F0F1F5\]\s+dark:bg-\[#162036\]/,
  /bg-\[#F0F1F5\]/,
  /bg-\[#162036\]/,

  // Newsletter list "Today" pill — soft success indicator at a shade the token system doesn't cover yet
  /bg-green-100\s+text-green-700\s+dark:bg-green-900\/30\s+dark:text-green-400/,

  // Browser-chrome traffic-light dots in mockup frames — semantic colors of the physical referent
  /backgroundColor:\s*['"]#FF5F57['"]/,  // macOS red close button
  /backgroundColor:\s*['"]#FEBC2E['"]/,  // macOS yellow minimize button
  /backgroundColor:\s*['"]#28C840['"]/,  // macOS green maximize button

  // Code example strings in guide / pattern data — TSX-as-content, not rendered classes
  /^\s+code:/,

  // Inline diff/log color indicators that need raw red/green for legibility
  /text-green-600.*['"]Added['"]/,
  /text-red-600.*['"]Removed['"]/,

  // Text on accent-primary fills: the house Button primitive itself uses this
  // exact literal pair (33 files); flagging it penalizes matching the design
  // system. Retire this exception if an on-accent text token is ever minted.
  /text-white\s+dark:text-gray-900/,
];

function isAllowedPattern(line) {
  return allowedPatterns.some((pattern) => pattern.test(line));
}

/**
 * Files that are exempted from validation entirely.
 */
const exemptedFiles = [
  // Pattern code examples — TSX-as-content
  /code-examples\.ts$/,
  // Guide chat previews — render realistic third-party chat UIs with intentional brand colors
  /guides\/chat-previews/,
  // Pattern demo components that render branded third-party UIs (e.g., real Slack/Notion mockups)
  /scaffolded\/.*-demo\.tsx$/,
  // Lead-magnet landing pages render an intentionally-inverted, always-dark accent
  // panel (navy + fixed gray cards) that must NOT flip with the theme — fixed gray
  // utilities are deliberate here, same rationale as the branded demos above.
  /(agentic-ux-checklist|accessibility-checklist-for-ai-designs)\/.*-client\.tsx$/,
];

function isExemptedFile(filePath) {
  return exemptedFiles.some((pattern) => pattern.test(filePath));
}

/**
 * Semantic prefixes that are legitimate (do NOT flag).
 * These match the token system in tailwind.config.mjs.
 */
const SEMANTIC_PREFIXES = [
  'text-',
  'background-',
  'surface-',
  'border-',
  'accent-',
  'status-',
  'social-',
  'category-',
  'ring-',
  // Spacing aliases use position prefixes (b/t/l/r/x/y/s/e) — keep these so border-b-2 doesn't trip
  'b-',
  't-',
  'l-',
  'r-',
  'x-',
  'y-',
  's-',
  'e-',
];

/**
 * CRITICAL VALIDATORS - Block commits
 */
const criticalValidators = [
  {
    name: 'raw-tailwind-color',
    description: 'Raw Tailwind color (use a semantic token from /design-system)',
    patterns: [
      // Catch text-/bg-/border- followed by a color family + shade number
      // e.g., bg-blue-500, text-gray-700, border-red-300
      new RegExp(
        `className=["'\`]([^"'\`]*(text|bg|border)-(?!${SEMANTIC_PREFIXES.join('|')})[a-z]+-\\d+[^"'\`]*)["'\`]`,
        'g'
      ),
    ],
    fix: (content, line) => {
      // Map common raw colors to design system tokens
      const colorMap = {
        '#ef4444': 'status-error',
        '#10b981': 'status-success',
        '#f59e0b': 'status-warning',
        '#3b82f6': 'status-info',
      };
      let fixed = line;
      for (const [hex, token] of Object.entries(colorMap)) {
        fixed = fixed.replaceAll(hex, token);
      }
      return fixed !== line ? fixed : null;
    },
  },
  {
    name: 'hardcoded-hex',
    description: 'Hardcoded hex color (use a CSS variable token from globals.css)',
    patterns: [
      // Hardcoded hex in className arbitrary value
      /className=["'`]([^"'`]*?-\[#[0-9a-fA-F]{3,6}\][^"'`]*?)["'`]/g,
      // Hardcoded hex in inline style color/background
      /style=\{\s*\{[^}]*?(color|backgroundColor)\s*:\s*["']#[0-9a-fA-F]{3,6}["'][^}]*?\}\s*\}/g,
    ],
  },
  {
    name: 'raw-z-index',
    description: 'Raw z-index (use a token: z-dropdown, z-sticky, z-overlay, z-modal, z-toast, z-tooltip)',
    // Only match z-* inside className attributes — not in text/code/documentation content
    pattern: /className=["'`][^"'`]*\bz-(?:10|20|30|40|50|60|70|80|90|100)\b[^"'`]*["'`]/g,
  },
  {
    name: 'arbitrary-radius',
    description: 'Arbitrary border radius (use rounded-input/card/modal/mockup/pill)',
    pattern: /\brounded-\[[\d.]+(?:px|rem|em)\]/g,
  },
  {
    name: 'arbitrary-spacing',
    description: 'Arbitrary component-level spacing (use the semantic aliases: tight/snug/default/loose/roomy)',
    // Only flag SMALL arbitrary values (px-based or sub-3rem) — layout-level spacing (3rem+) is allowed
    // because it's documented as a per-page composition decision, not a component concern.
    pattern: /\b(?:p|m|px|py|pl|pr|pt|pb|mx|my|mt|mb|ml|mr|gap|space-[xy])-\[(?:[\d.]+px|[0-2](?:\.\d+)?rem|[0-2](?:\.\d+)?em)\]/g,
  },
];

/**
 * WARNING VALIDATORS - Allowed but discouraged
 */
const warningValidators = [
  {
    name: 'missing-dark-mode',
    description: 'Light-only color without dark mode variant',
    pattern: /className=["'`][^"'`]*(bg-white|text-black)(?!.*dark:)[^"'`]*["'`]/g,
  },
  {
    name: 'arbitrary-font-size',
    description: 'Arbitrary font size (use a type-* utility)',
    pattern: /text-\[[\d.]+(?:px|rem)\]/g,
  },
  {
    name: 'arbitrary-shadow',
    description: 'Arbitrary shadow (use shadow-card/card-hover/elevated/modal/popover)',
    pattern: /\bshadow-\[[^\]]+\]/g,
  },
];

/**
 * Validate a single file
 */
function validateFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  if (isExemptedFile(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  for (const validator of criticalValidators) {
    const patterns = Array.isArray(validator.patterns) ? validator.patterns : [validator.pattern];

    lines.forEach((line, lineNum) => {
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
          pattern.lastIndex = 0;
        }
      }
    });
  }

  if (flags.verbose || flags.report) {
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
          validator.pattern.lastIndex = 0;
        }
      });
    }
  }
}

/**
 * Auto-fix
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
 * Group violations for the report
 */
function groupForReport() {
  const byRule = {};
  const byFile = {};
  for (const v of violations.critical) {
    byRule[v.validator] = (byRule[v.validator] || 0) + 1;
    byFile[v.file] = (byFile[v.file] || 0) + 1;
  }
  for (const v of violations.warnings) {
    byRule[v.validator] = (byRule[v.validator] || 0) + 1;
    byFile[v.file] = (byFile[v.file] || 0) + 1;
  }
  return { byRule, byFile };
}

/**
 * Summary report (--report)
 */
function printReport() {
  const total = violations.critical.length + violations.warnings.length;
  const { byRule, byFile } = groupForReport();

  console.log(`\n${colors.bold}Design System Audit${colors.reset}`);
  console.log(`${colors.gray}Source: /design-system on aiux${colors.reset}\n`);

  console.log(`${colors.bold}Totals${colors.reset}`);
  console.log(`  Critical: ${colors.red}${violations.critical.length}${colors.reset}`);
  console.log(`  Warnings: ${colors.yellow}${violations.warnings.length}${colors.reset}`);
  console.log(`  Total:    ${colors.bold}${total}${colors.reset}\n`);

  console.log(`${colors.bold}By rule${colors.reset}`);
  const rulesSorted = Object.entries(byRule).sort(([, a], [, b]) => b - a);
  for (const [rule, count] of rulesSorted) {
    console.log(`  ${count.toString().padStart(5)}  ${rule}`);
  }

  console.log(`\n${colors.bold}Top 15 offender files${colors.reset}`);
  const filesSorted = Object.entries(byFile).sort(([, a], [, b]) => b - a).slice(0, 15);
  for (const [file, count] of filesSorted) {
    console.log(`  ${count.toString().padStart(5)}  ${file}`);
  }

  console.log(`\n${colors.gray}Report mode: not blocking. Use --staged for pre-commit enforcement.${colors.reset}\n`);
}

/**
 * Per-violation listing (--staged + --all without --report)
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

    violations.critical.forEach((v) => {
      console.log(`  ${colors.blue}${v.file}${colors.reset}:${colors.yellow}${v.line}${colors.reset}`);
      console.log(`    ${colors.red}✗${colors.reset} ${v.description}`);
      console.log(`      ${colors.gray}${v.content.substring(0, 100)}${colors.reset}`);
      if (v.fix) {
        console.log(`    ${colors.green}✓ Fix:${colors.reset} ${v.fix.substring(0, 100)}`);
      }
      console.log();
    });
  }

  if (hasWarnings && flags.verbose) {
    console.log(`\n${colors.yellow}⚠️  Warnings:${colors.reset}\n`);
    violations.warnings.forEach((v) => {
      console.log(`  ${colors.blue}${v.file}${colors.reset}:${colors.yellow}${v.line}${colors.reset}`);
      console.log(`    ${colors.yellow}!${colors.reset} ${v.description}`);
      console.log(`      ${colors.gray}${v.content.substring(0, 100)}${colors.reset}`);
      console.log();
    });
  }

  console.log(`\n${colors.gray}─────────────────────────────────────${colors.reset}`);
  if (violations.critical.length > 0) {
    console.log(`${colors.red}Critical:${colors.reset} ${violations.critical.length}`);
  }
  if (violations.warnings.length > 0) {
    console.log(`${colors.yellow}Warnings:${colors.reset} ${violations.warnings.length}`);
  }
  if (flags.fix && violations.critical.some((v) => v.fix)) {
    const fixedCount = violations.critical.filter((v) => v.fix).length;
    console.log(`${colors.green}Auto-fixed:${colors.reset} ${fixedCount}`);
  } else if (violations.critical.some((v) => v.fix)) {
    console.log(`\n${colors.blue}💡${colors.reset} Run ${colors.yellow}'npm run brand:fix'${colors.reset} to auto-apply ${violations.critical.filter((v) => v.fix).length} fix(es)`);
  }
  console.log(`${colors.gray}─────────────────────────────────────${colors.reset}\n`);

  return hasBlockers ? 1 : 0;
}

async function main() {
  const files = getFilesToValidate();

  if (files.length === 0) {
    if (!flags.staged) {
      console.log(`${colors.yellow}⚠️  No files to validate${colors.reset}`);
    }
    return 0;
  }

  files.forEach((file) => validateFile(file));

  if (flags.fix && violations.critical.some((v) => v.fix)) {
    const fixedFiles = applyFixes();
    console.log(`${colors.green}✓ Auto-fixed ${fixedFiles.length} file(s)${colors.reset}\n`);
    violations.critical = violations.critical.filter((v) => !v.fix);
    files.forEach((file) => validateFile(file));
  }

  if (flags.report) {
    printReport();
    process.exit(0);
  }

  const exitCode = reportViolations();
  process.exit(exitCode);
}

main().catch((err) => {
  console.error(`${colors.red}Error:${colors.reset}`, err.message);
  process.exit(1);
});

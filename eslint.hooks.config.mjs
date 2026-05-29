/**
 * Minimal, focused ESLint config that enforces ONLY the React Rules of Hooks.
 *
 * Why this is separate from eslint.config.mjs: the main config (next + the
 * legacy codebase) reports hundreds of pre-existing style/`any`/unused-var
 * errors, which is why `next.config` sets `eslint.ignoreDuringBuilds: true`.
 * That means the build never runs ESLint — so `react-hooks/rules-of-hooks`,
 * though configured, never actually fires. A hooks-order violation
 * (handleCopyHandoff placed after an early return) shipped to production as a
 * React #310 crash because of exactly this gap.
 *
 * This config enforces just the one correctness-critical rule so it can block
 * commits via the pre-commit hook (`npm run lint:hooks`) WITHOUT requiring the
 * full legacy lint cleanup. The other plugins are registered with all rules
 * OFF purely so existing `// eslint-disable` comments referencing their rules
 * resolve (otherwise ESLint errors "Definition for rule … was not found").
 *
 * Run: `npm run lint:hooks`.
 */
import reactHooks from 'eslint-plugin-react-hooks';
import tsEslint from '@typescript-eslint/eslint-plugin';
import nextPlugin from '@next/eslint-plugin-next';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['src/**/*.{ts,tsx}'],
    linterOptions: {
      // Don't fail on disable directives for rules we don't enable here.
      reportUnusedDisableDirectives: 'off',
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      // Registered (rules stay off) so existing eslint-disable comments resolve.
      '@typescript-eslint': tsEslint,
      '@next/next': nextPlugin,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
    },
  },
];

/**
 * Validation utilities for AI Design Patterns
 * Provides helpful functions for validating patterns and categories
 */

import { 
  safeValidatePattern, 
  safeValidateCategory,
  Pattern
} from '../schemas/pattern.schema';
import { ZodError } from 'zod';

/**
 * Formats Zod validation errors into human-readable messages
 */
export const formatValidationErrors = (error: ZodError): string[] => {
  return error.issues.map(issue => {
    const path = issue.path.join('.');
    const message = issue.message;
    
    switch (issue.code) {
      case 'invalid_type':
        return `${path}: Expected ${issue.expected}, but got ${issue.received}`;
      case 'invalid_string':
        if (issue.validation === 'regex') {
          return `${path}: ${message}`;
        }
        return `${path}: Invalid string format - ${message}`;
      case 'too_small':
        if (issue.type === 'string') {
          return `${path}: String must be at least ${issue.minimum} characters`;
        }
        if (issue.type === 'array') {
          return `${path}: Array must have at least ${issue.minimum} items`;
        }
        return `${path}: Value too small - ${message}`;
      case 'too_big':
        if (issue.type === 'string') {
          return `${path}: String must be at most ${issue.maximum} characters`;
        }
        return `${path}: Value too large - ${message}`;
      default:
        return `${path}: ${message}`;
    }
  });
};

/**
 * Validates a pattern and returns detailed results
 */
export const validatePatternDetailed = (pattern: unknown) => {
  const result = safeValidatePattern(pattern);
  
  if (result.success) {
    return {
      valid: true,
      data: result.data,
      errors: []
    };
  }
  
  return {
    valid: false,
    data: null,
    errors: formatValidationErrors(result.error)
  };
};

/**
 * Validates multiple patterns and returns a summary
 */
export const validatePatternsDetailed = (patterns: unknown[]) => {
  const results = patterns.map((pattern, index) => ({
    index,
    pattern,
    validation: validatePatternDetailed(pattern)
  }));
  
  const valid = results.filter(r => r.validation.valid);
  const invalid = results.filter(r => !r.validation.valid);
  
  return {
    total: patterns.length,
    valid: valid.length,
    invalid: invalid.length,
    validPatterns: valid.map(r => r.validation.data).filter(Boolean) as Pattern[],
    errors: invalid.map(r => ({
      index: r.index,
      patternId: (r.pattern as Record<string, unknown>)?.id as string || `Pattern at index ${r.index}`,
      errors: r.validation.errors
    }))
  };
};

/**
 * Validates a category and returns detailed results
 */
export const validateCategoryDetailed = (category: unknown) => {
  const result = safeValidateCategory(category);
  
  if (result.success) {
    return {
      valid: true,
      data: result.data,
      errors: []
    };
  }
  
  return {
    valid: false,
    data: null,
    errors: formatValidationErrors(result.error)
  };
};

/**
 * Checks if an image path is valid according to our schema
 */
export const isValidImagePath = (path: string): boolean => {
  // Must start with / or be a URL
  if (!path.startsWith('/') && !path.startsWith('http://') && !path.startsWith('https://')) {
    return false;
  }
  
  // Must have valid extension
  return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(path);
};

/**
 * Checks if a color is valid according to our schema
 */
export const isValidColor = (color: string): boolean => {
  // Check hex color
  if (/^#[0-9A-F]{6}$/i.test(color)) return true;
  
  // Check Tailwind color names
  const validColors = [
    'blue', 'green', 'amber', 'purple', 'sky', 'gray', 'indigo', 
    'emerald', 'orange', 'rose', 'violet', 'lime', 'cyan', 'red',
    'yellow', 'teal', 'pink', 'slate', 'zinc', 'neutral', 'stone'
  ];
  
  return validColors.includes(color.toLowerCase());
};

/**
 * Validates pattern relationships (checks if related patterns exist)
 */
export const validatePatternRelationships = (
  pattern: Pattern, 
  allPatterns: Pattern[]
): string[] => {
  const errors: string[] = [];
  const patternTitles = new Set(allPatterns.map(p => p.title));
  
  pattern.content.relatedPatterns.forEach(relatedTitle => {
    if (!patternTitles.has(relatedTitle)) {
      errors.push(`Related pattern "${relatedTitle}" does not exist`);
    }
  });
  
  return errors;
};

/**
 * Generates a validation report for a pattern
 */
export const generatePatternValidationReport = (pattern: unknown): string => {
  const validation = validatePatternDetailed(pattern);
  const patternData = pattern as Record<string, unknown>;
  
  let report = `Pattern Validation Report\n`;
  report += `========================\n\n`;
  report += `Pattern: ${patternData?.title || 'Unknown'} (${patternData?.id || 'no-id'})\n`;
  report += `Status: ${validation.valid ? '✅ VALID' : '❌ INVALID'}\n\n`;
  
  if (!validation.valid) {
    report += `Errors Found:\n`;
    validation.errors.forEach((error, index) => {
      report += `${index + 1}. ${error}\n`;
    });
  } else {
    report += `All validation checks passed!\n`;
  }
  
  return report;
};

/**
 * CLI-friendly validation function for patterns
 */
export const validatePatternCLI = (patternPath: string) => {
  try {
    // Note: This is a CLI utility that uses require() for dynamic imports
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pattern = require(patternPath);
    const report = generatePatternValidationReport(pattern.default || pattern);
    console.log(report);
    return validatePatternDetailed(pattern.default || pattern).valid;
  } catch (error) {
    console.error(`Failed to load pattern from ${patternPath}:`, error);
    return false;
  }
}; 
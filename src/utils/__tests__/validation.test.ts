import {
  validatePatternDetailed,
  validatePatternsDetailed,
  validateCategoryDetailed,
  isValidImagePath,
  isValidColor,
  validatePatternRelationships,
  generatePatternValidationReport
} from '../validation';
import { Pattern } from '../../types';

describe('Validation Utilities', () => {
  describe('isValidImagePath', () => {
    it('should accept valid relative paths', () => {
      expect(isValidImagePath('/images/example.png')).toBe(true);
      expect(isValidImagePath('/images/patterns/test.jpg')).toBe(true);
      expect(isValidImagePath('/test.webp')).toBe(true);
    });

    it('should accept valid URLs', () => {
      expect(isValidImagePath('https://example.com/image.png')).toBe(true);
      expect(isValidImagePath('http://example.com/image.gif')).toBe(true);
    });

    it('should reject invalid paths', () => {
      expect(isValidImagePath('images/example.png')).toBe(false); // Missing leading /
      expect(isValidImagePath('/images/example.txt')).toBe(false); // Wrong extension
      expect(isValidImagePath('/images/example')).toBe(false); // No extension
      expect(isValidImagePath('ftp://example.com/image.png')).toBe(false); // Wrong protocol
    });

    it('should be case-insensitive for extensions', () => {
      expect(isValidImagePath('/image.PNG')).toBe(true);
      expect(isValidImagePath('/image.JPG')).toBe(true);
      expect(isValidImagePath('/image.WebP')).toBe(true);
    });
  });

  describe('isValidColor', () => {
    it('should accept valid hex colors', () => {
      expect(isValidColor('#FF0000')).toBe(true);
      expect(isValidColor('#00ff00')).toBe(true);
      expect(isValidColor('#0000FF')).toBe(true);
    });

    it('should accept valid Tailwind colors', () => {
      expect(isValidColor('blue')).toBe(true);
      expect(isValidColor('emerald')).toBe(true);
      expect(isValidColor('rose')).toBe(true);
    });

    it('should reject invalid colors', () => {
      expect(isValidColor('#FFF')).toBe(false); // Too short
      expect(isValidColor('#GGGGGG')).toBe(false); // Invalid hex
      expect(isValidColor('darkblue')).toBe(false); // Not in list
      expect(isValidColor('Blue')).toBe(true); // Case insensitive for color names
    });
  });

  describe('validatePatternDetailed', () => {
    const validPattern: Pattern = {
      id: 'test-pattern',
      title: 'Test Pattern',
      slug: 'test-pattern',
      description: 'This is a test pattern for validation testing',
      category: 'Contextual Assistance',
      thumbnail: '/images/test.png',
      content: {
        problem: 'This is the problem statement',
        solution: 'This is the solution statement',
        examples: [{
          title: 'Example 1',
          description: 'Example description',
          image: '/images/example.png',
          altText: 'Example alt text'
        }],
        codeExamples: [],
        guidelines: ['Guideline 1'],
        considerations: ['Consideration 1'],
        relatedPatterns: []
      }
    };

    it('should validate a correct pattern', () => {
      const result = validatePatternDetailed(validPattern);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.data).toEqual(validPattern);
    });

    it('should catch validation errors', () => {
      const invalidPattern = {
        ...validPattern,
        id: 'Test Pattern', // Invalid format
        description: 'Short', // Too short
        category: 'Invalid Category' // Not in enum
      };

      const result = validatePatternDetailed(invalidPattern);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.includes('id'))).toBe(true);
      expect(result.errors.some(e => e.includes('description'))).toBe(true);
      expect(result.errors.some(e => e.includes('category'))).toBe(true);
    });

    it('should validate nested content errors', () => {
      const invalidPattern = {
        ...validPattern,
        content: {
          ...validPattern.content,
          problem: 'Too short', // Less than 10 chars
          examples: [], // Empty array
          guidelines: [] // Empty array
        }
      };

      const result = validatePatternDetailed(invalidPattern);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('problem'))).toBe(true);
      expect(result.errors.some(e => e.includes('examples'))).toBe(true);
      expect(result.errors.some(e => e.includes('guidelines'))).toBe(true);
    });
  });

  describe('validatePatternsDetailed', () => {
    it('should validate multiple patterns', () => {
      const patterns = [
        {
          id: 'pattern-1',
          title: 'Pattern 1',
          slug: 'pattern-1',
          description: 'This is the first test pattern for batch validation',
          category: 'Contextual Assistance',
          content: {
            problem: 'Problem for pattern 1',
            solution: 'Solution for pattern 1',
            examples: [{
              title: 'Example',
              description: 'Example description',
              image: '/images/ex1.png',
              altText: 'Alt text'
            }],
            guidelines: ['Guideline'],
            considerations: ['Consideration'],
            codeExamples: [],
            relatedPatterns: []
          }
        },
        {
          id: 'invalid-pattern',
          title: 'Invalid'
          // Missing required fields
        }
      ];

      const result = validatePatternsDetailed(patterns);
      expect(result.total).toBe(2);
      expect(result.valid).toBe(1);
      expect(result.invalid).toBe(1);
      expect(result.validPatterns).toHaveLength(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].patternId).toBe('invalid-pattern');
    });
  });

  describe('validateCategoryDetailed', () => {
    it('should validate a correct category', () => {
      const category = {
        id: 'test-category',
        title: 'Test Category',
        description: 'Test category description',
        slug: 'test-category',
        color: 'blue',
        image: '/images/category.png'
      };

      const result = validateCategoryDetailed(category);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should catch category validation errors', () => {
      const invalidCategory = {
        id: 'Test Category', // Invalid format
        title: 'Test',
        description: 'Test',
        slug: 'test-category',
        color: 'darkblue', // Invalid color
        image: 'images/category.png' // Missing leading /
      };

      const result = validateCategoryDetailed(invalidCategory);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validatePatternRelationships', () => {
    const patterns: Pattern[] = [
      {
        id: 'pattern-1',
        title: 'Pattern One',
        slug: 'pattern-1',
        description: 'First pattern for relationship testing',
        category: 'Contextual Assistance',
        content: {
          problem: 'Problem statement',
          solution: 'Solution statement',
          examples: [{
            title: 'Example',
            description: 'Description',
            image: '/images/ex.png',
            altText: 'Alt'
          }],
          guidelines: ['Guide'],
          considerations: ['Consider'],
          codeExamples: [],
          relatedPatterns: ['Pattern Two']
        }
      },
      {
        id: 'pattern-2',
        title: 'Pattern Two',
        slug: 'pattern-2',
        description: 'Second pattern for relationship testing',
        category: 'Progressive Disclosure',
        content: {
          problem: 'Problem statement',
          solution: 'Solution statement',
          examples: [{
            title: 'Example',
            description: 'Description',
            image: '/images/ex.png',
            altText: 'Alt'
          }],
          guidelines: ['Guide'],
          considerations: ['Consider'],
          codeExamples: [],
          relatedPatterns: ['Pattern One', 'Non-existent Pattern']
        }
      }
    ];

    it('should find valid relationships', () => {
      const errors = validatePatternRelationships(patterns[0], patterns);
      expect(errors).toHaveLength(0);
    });

    it('should find invalid relationships', () => {
      const errors = validatePatternRelationships(patterns[1], patterns);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('Non-existent Pattern');
    });
  });

  describe('generatePatternValidationReport', () => {
    it('should generate a report for valid pattern', () => {
      const pattern = {
        id: 'test-pattern',
        title: 'Test Pattern',
        slug: 'test-pattern',
        description: 'This is a test pattern for report generation',
        category: 'Contextual Assistance',
        content: {
          problem: 'Problem statement for testing',
          solution: 'Solution statement for testing',
          examples: [{
            title: 'Example',
            description: 'Description',
            image: '/images/test.png',
            altText: 'Alt text'
          }],
          guidelines: ['Guideline'],
          considerations: ['Consideration'],
          codeExamples: [],
          relatedPatterns: []
        }
      };

      const report = generatePatternValidationReport(pattern);
      expect(report).toContain('Test Pattern');
      expect(report).toContain('✅ VALID');
      expect(report).toContain('All validation checks passed');
    });

    it('should generate a report for invalid pattern', () => {
      const pattern = {
        id: 'Invalid ID',
        title: 'Test'
      };

      const report = generatePatternValidationReport(pattern);
      expect(report).toContain('❌ INVALID');
      expect(report).toContain('Errors Found:');
    });
  });
}); 
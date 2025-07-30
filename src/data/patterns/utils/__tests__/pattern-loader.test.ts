import { 
  loadPattern, 
  loadAllPatterns, 
  getCachedPatterns, 
  isPatternCached,
  clearPatternCache,
  getLoadMetrics,
  getCacheStats,
  preloadPatterns
} from '../pattern-loader';

// Mock the pattern modules
jest.mock('../../patterns/contextual-assistance/index', () => ({
  contextualassistance: {
    id: 'contextual-assistance',
    title: 'Contextual Assistance',
    slug: 'contextual-assistance',
    description: 'This is a comprehensive test pattern for contextual assistance that meets minimum length requirements',
    category: 'Contextual Assistance',
    thumbnail: '/images/test-pattern.jpg',
    content: {
      problem: 'Test problem description that is comprehensive and detailed enough to meet validation requirements',
      solution: 'Test solution description that provides detailed information about the pattern implementation',
      examples: [
        {
          title: 'Test Example',
          description: 'Test example description',
          context: 'Test context',
          implementation: 'Test implementation details',
          image: '/images/test-example.jpg',
          altText: 'Test example image'
        }
      ],
      codeExamples: [
        {
          title: 'Test Code Example',
          language: 'javascript',
          code: 'console.log("test");',
          description: 'Test code description'
        }
      ],
      guidelines: ['Test guideline 1', 'Test guideline 2'],
      considerations: ['Test consideration 1', 'Test consideration 2'],
      relatedPatterns: ['progressive-disclosure']
    }
  }
}));

jest.mock('../../patterns/progressive-disclosure/index', () => ({
  progressivedisclosure: {
    id: 'progressive-disclosure',
    title: 'Progressive Disclosure',
    slug: 'progressive-disclosure',
    description: 'This is a comprehensive test pattern for progressive disclosure that meets minimum length requirements',
    category: 'Progressive Disclosure',
    thumbnail: '/images/test-pattern-2.jpg',
    content: {
      problem: 'Test problem description that is comprehensive and detailed enough to meet validation requirements',
      solution: 'Test solution description that provides detailed information about the pattern implementation',
      examples: [
        {
          title: 'Test Example 2',
          description: 'Test example description 2',
          context: 'Test context 2',
          implementation: 'Test implementation details 2',
          image: '/images/test-example-2.jpg',
          altText: 'Test example image 2'
        }
      ],
      codeExamples: [
        {
          title: 'Test Code Example 2',
          language: 'typescript',
          code: 'const test = "value";',
          description: 'Test code description 2'
        }
      ],
      guidelines: ['Test guideline 2-1', 'Test guideline 2-2'],
      considerations: ['Test consideration 2-1', 'Test consideration 2-2'],
      relatedPatterns: ['contextual-assistance']
    }
  }
}));

describe('Optimized Pattern Loader', () => {
  beforeEach(() => {
    clearPatternCache();
  });

  afterEach(() => {
    clearPatternCache();
  });

  describe('Caching', () => {
    it('should cache loaded patterns', async () => {
      const pattern1 = await loadPattern('contextual-assistance');
      const pattern2 = await loadPattern('contextual-assistance');
      
      expect(pattern1).toBeDefined();
      expect(pattern2).toBeDefined();
      expect(pattern1).toBe(pattern2); // Same reference due to caching
      expect(isPatternCached('contextual-assistance')).toBe(true);
    });

    it('should return cached patterns without reloading', async () => {
      // First load
      const pattern1 = await loadPattern('contextual-assistance');
      const initialMetrics = getLoadMetrics();
      
      // Second load (should be cached)
      const pattern2 = await loadPattern('contextual-assistance');
      const finalMetrics = getLoadMetrics();
      
      expect(pattern1).toBe(pattern2);
      expect(finalMetrics.cacheHits).toBeGreaterThan(initialMetrics.cacheHits);
    });
  });

  describe('Performance Monitoring', () => {
    it('should track load metrics', async () => {
      const initialMetrics = getLoadMetrics();
      
      await loadPattern('contextual-assistance');
      
      const finalMetrics = getLoadMetrics();
      expect(finalMetrics.totalLoads).toBeGreaterThan(initialMetrics.totalLoads);
      expect(finalMetrics.avgLoadTime).toBeGreaterThan(0);
    });

    it('should provide cache statistics', () => {
      const stats = getCacheStats();
      expect(stats).toHaveProperty('cachedPatterns');
      expect(stats).toHaveProperty('loadingPatterns');
      expect(stats).toHaveProperty('cacheKeys');
    });
  });

  describe('Batch Loading', () => {
    it('should load all patterns efficiently', async () => {
      const patterns = await loadAllPatterns();
      
      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns.every(p => p.id && p.title)).toBe(true);
    });

    it('should preload patterns', async () => {
      const preloadPromise = preloadPatterns(['contextual-assistance', 'progressive-disclosure']);
      
      // Should not throw
      await expect(preloadPromise).resolves.toBeUndefined();
      
      // Patterns should be cached after preloading
      expect(isPatternCached('contextual-assistance')).toBe(true);
      expect(isPatternCached('progressive-disclosure')).toBe(true);
    });
  });

  describe('Cache Management', () => {
    it('should clear cache correctly', async () => {
      await loadPattern('contextual-assistance');
      expect(isPatternCached('contextual-assistance')).toBe(true);
      
      clearPatternCache();
      expect(isPatternCached('contextual-assistance')).toBe(false);
      
      const stats = getCacheStats();
      expect(stats.cachedPatterns).toBe(0);
    });

    it('should get cached patterns', async () => {
      await loadPattern('contextual-assistance');
      await loadPattern('progressive-disclosure');
      
      const cachedPatterns = getCachedPatterns();
      expect(cachedPatterns.length).toBe(2);
      expect(cachedPatterns.some(p => p.id === 'contextual-assistance')).toBe(true);
      expect(cachedPatterns.some(p => p.id === 'progressive-disclosure')).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent patterns gracefully', async () => {
      const pattern = await loadPattern('non-existent-pattern');
      expect(pattern).toBeNull();
    });

    it('should continue loading other patterns when some fail', async () => {
      const patterns = await loadAllPatterns();
      // Should still load valid patterns even if some fail
      expect(patterns.length).toBeGreaterThan(0);
    });
  });
}); 
import { Pattern } from '../../../types';
import { validatePatternWithDetails, safeValidatePattern } from '../../../schemas/pattern.schema';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Cache for loaded patterns to avoid repeated loads
const patternCache = new Map<string, Pattern>();
const loadingPromises = new Map<string, Promise<Pattern | null>>();

// Performance monitoring
interface LoadMetrics {
  loadTime: number;
  cacheHit: boolean;
  validationTime: number;
  error?: string;
}

const loadMetrics: LoadMetrics[] = [];

/**
 * Get performance metrics for pattern loading
 */
export const getLoadMetrics = () => {
  const totalLoads = loadMetrics.length;
  const cacheHits = loadMetrics.filter(m => m.cacheHit).length;
  const avgLoadTime = loadMetrics.reduce((sum, m) => sum + m.loadTime, 0) / totalLoads;
  const avgValidationTime = loadMetrics.reduce((sum, m) => sum + m.validationTime, 0) / totalLoads;
  
  return {
    totalLoads,
    cacheHits,
    cacheHitRate: totalLoads > 0 ? (cacheHits / totalLoads) * 100 : 0,
    avgLoadTime,
    avgValidationTime,
    recentMetrics: loadMetrics.slice(-10) // Last 10 loads
  };
};

/**
 * Clear the pattern cache
 */
export const clearPatternCache = () => {
  patternCache.clear();
  loadingPromises.clear();
  loadMetrics.length = 0;
};

/**
 * Preload specific patterns for better UX
 */
export const preloadPatterns = async (patternIds: string[]): Promise<void> => {
  const preloadPromises = patternIds.map(id => loadPattern(id));
  await Promise.allSettled(preloadPromises);
};

/**
 * Validates a pattern and logs detailed errors in development mode
 */
const validateLoadedPattern = (pattern: unknown, patternId: string): Pattern | null => {
  const validationStart = performance.now();
  const result = validatePatternWithDetails(pattern);
  const validationTime = performance.now() - validationStart;
  
  if (!result.success) {
    if (isDevelopment) {
      console.error(`Pattern validation failed for ${patternId}:`);
      // validatePatternWithDetails already logs detailed errors
    }
    return null;
  }
  
  // Record validation time for performance monitoring
  const lastMetric = loadMetrics[loadMetrics.length - 1];
  if (lastMetric) {
    lastMetric.validationTime = validationTime;
  }
  
  return result.data;
};

/**
 * Optimized pattern loader with caching and performance monitoring
 */
export const loadPattern = async (patternId: string): Promise<Pattern | null> => {
  const loadStart = performance.now();
  
  // Check cache first
  if (patternCache.has(patternId)) {
    const cachedPattern = patternCache.get(patternId)!;
    loadMetrics.push({
      loadTime: performance.now() - loadStart,
      cacheHit: true,
      validationTime: 0
    });
    return cachedPattern;
  }
  
  // Check if already loading to prevent duplicate requests
  if (loadingPromises.has(patternId)) {
    const result = await loadingPromises.get(patternId)!;
    loadMetrics.push({
      loadTime: performance.now() - loadStart,
      cacheHit: false,
      validationTime: 0
    });
    return result;
  }
  
  // Create loading promise
  const loadPromise = (async (): Promise<Pattern | null> => {
    try {
      let pattern: Pattern | null = null;
      
      // First try the new modular structure
      try {
        const importedModule = await import(`../patterns/${patternId}/index`);
        pattern = importedModule[patternId.replace(/-/g, '')];
      } catch {
        // Fall back to the old structure
        try {
          const importedModule = await import(`../patterns/${patternId}`);
          pattern = importedModule[patternId.replace(/-/g, '')];
        } catch (error) {
          console.error(`Failed to load pattern ${patternId}:`, error);
          return null;
        }
      }
      
      // Validate the loaded pattern
      const validatedPattern = validateLoadedPattern(pattern, patternId);
      
      if (validatedPattern) {
        // Cache the validated pattern
        patternCache.set(patternId, validatedPattern);
      }
      
      return validatedPattern;
    } catch (error) {
      console.error(`Unexpected error loading pattern ${patternId}:`, error);
      return null;
    } finally {
      // Clean up loading promise
      loadingPromises.delete(patternId);
    }
  })();
  
  // Store the loading promise
  loadingPromises.set(patternId, loadPromise);
  
  const result = await loadPromise;
  
  // Record metrics
  loadMetrics.push({
    loadTime: performance.now() - loadStart,
    cacheHit: false,
    validationTime: 0 // Will be updated by validateLoadedPattern
  });
  
  return result;
};

/**
 * Optimized loader for all patterns with caching and parallel loading
 */
export const loadAllPatterns = async (): Promise<Pattern[]> => {
  const patternIds = [
    'contextual-assistance',
    'progressive-disclosure',
    'human-in-the-loop',
    'conversational-ui',
    'explainable-ai',
    'guided-learning',
    'adaptive-interfaces',
    'multimodal-interaction'
  ];

  // Load patterns in parallel, utilizing cache
  const patterns = await Promise.allSettled(
    patternIds.map(id => loadPattern(id))
  );

  const validPatterns: Pattern[] = patterns
    .filter((result): result is PromiseFulfilledResult<Pattern | null> => 
      result.status === 'fulfilled' && result.value !== null
    )
    .map(result => result.value!)
    .filter((pattern): pattern is Pattern => pattern !== null);
  
  if (isDevelopment) {
    const failedCount = patterns.length - validPatterns.length;
    if (failedCount > 0) {
      console.warn(
        `Warning: ${failedCount} patterns failed to load and were excluded.`
      );
    }
    
    // Log performance metrics in development
    const metrics = getLoadMetrics();
    console.log('Pattern loading metrics:', metrics);
  }

  return validPatterns;
};

/**
 * Loads a pattern with fallback data if validation fails
 * Useful for graceful degradation in production
 */
export const loadPatternWithFallback = async (
  patternId: string, 
  fallbackPattern?: Partial<Pattern>
): Promise<Pattern | null> => {
  const pattern = await loadPattern(patternId);
  
  if (pattern) {
    return pattern;
  }
  
  // If we have fallback data and we're in production, try to use it
  if (fallbackPattern && !isDevelopment) {
    const fallbackWithDefaults: Pattern = {
      id: patternId,
      title: fallbackPattern.title || 'Pattern Loading...',
      slug: patternId,
      description: fallbackPattern.description || 'Pattern information is being loaded.',
      category: fallbackPattern.category || 'Performance & Efficiency',
      thumbnail: fallbackPattern.thumbnail || '/images/placeholders/pattern.png',
      content: {
        problem: fallbackPattern.content?.problem || 'Loading...',
        solution: fallbackPattern.content?.solution || 'Loading...',
        examples: fallbackPattern.content?.examples || [],
        codeExamples: fallbackPattern.content?.codeExamples || [],
        guidelines: fallbackPattern.content?.guidelines || ['Loading guidelines...'],
        considerations: fallbackPattern.content?.considerations || ['Loading considerations...'],
        relatedPatterns: fallbackPattern.content?.relatedPatterns || []
      },
      ...fallbackPattern
    };
    
    // Validate the fallback pattern
    const result = safeValidatePattern(fallbackWithDefaults);
    return result.success ? result.data : null;
  }
  
  return null;
};

/**
 * Lazy loader for code examples to reduce initial bundle size
 */
export const loadCodeExample = async (patternId: string, exampleId: string) => {
  try {
    const importedModule = await import(`../examples/${patternId}/${exampleId}`);
    return importedModule.default;
  } catch (error) {
    console.error(`Failed to load code example for ${patternId}/${exampleId}:`, error);
    return null;
  }
};

/**
 * Batch load multiple code examples for a pattern
 */
export const loadCodeExamples = async (patternId: string, exampleIds: string[]) => {
  const examples = await Promise.allSettled(
    exampleIds.map(id => loadCodeExample(patternId, id))
  );
  
  return examples
    .filter((result): result is PromiseFulfilledResult<unknown> => 
      result.status === 'fulfilled' && result.value !== null
    )
    .map(result => result.value);
};

/**
 * Get cached patterns without loading
 */
export const getCachedPatterns = (): Pattern[] => {
  return Array.from(patternCache.values());
};

/**
 * Check if a pattern is cached
 */
export const isPatternCached = (patternId: string): boolean => {
  return patternCache.has(patternId);
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
  return {
    cachedPatterns: patternCache.size,
    loadingPatterns: loadingPromises.size,
    cacheKeys: Array.from(patternCache.keys())
  };
}; 
import { Pattern } from '../../types';
import patterns from '../patterns';

// Helper functions for pattern management
export const getPatternById = (id: string): Pattern | undefined => {
  return patterns.find(pattern => pattern.id === id);
};

export const getPatternsByCategory = (category: string): Pattern[] => {
  return patterns.filter(pattern => pattern.category === category);
};

// Lazy loading for code examples
export const loadCodeExample = async (patternId: string, exampleId: string) => {
  try {
    const module = await import(`./examples/${patternId}/${exampleId}`);
    return module.default;
  } catch (error) {
    console.error(`Failed to load code example for ${patternId}/${exampleId}:`, error);
    return null;
  }
};

// Export patterns array
export { patterns }; 
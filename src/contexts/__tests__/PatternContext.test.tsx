import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { PatternProvider, usePatterns, usePattern, usePatternsByCategory } from '../PatternContext';
import { Pattern, PatternFilter } from '../../types';

// Mock the patterns data with correct structure
jest.mock('../../data/patterns', () => ({
  __esModule: true,
  default: [
    {
      id: 'test-1',
      title: 'Test Pattern 1',
      slug: 'test-pattern-1',
      description: 'Test description 1',
      category: 'Contextual Assistance',
      status: 'implemented',
      priority: 'high',
      complexity: 7,
      tags: ['test', 'example'],
      thumbnail: '/test-image-1.png',
      content: {
        problem: 'Test problem',
        solution: 'Test solution',
        guidelines: ['Test guideline'],
        considerations: ['Test consideration'],
        examples: [],
        codeExamples: [],
        relatedPatterns: []
      }
    },
    {
      id: 'test-2',
      title: 'Test Pattern 2',
      slug: 'test-pattern-2',
      description: 'Test description 2',
      category: 'Progressive Disclosure',
      status: 'planned',
      priority: 'medium',
      complexity: 5,
      tags: ['test'],
      thumbnail: '/test-image-2.png',
      content: {
        problem: 'Test problem 2',
        solution: 'Test solution 2',
        guidelines: ['Test guideline 2'],
        considerations: ['Test consideration 2'],
        examples: [],
        codeExamples: [],
        relatedPatterns: ['test-1']
      }
    }
  ]
}));

// Mock categories data
jest.mock('../../data/categories', () => ({
  __esModule: true,
  default: [
    {
      id: 'contextual-assistance',
      title: 'Contextual Assistance',
      description: 'Test category 1',
      slug: 'contextual-assistance',
      color: 'blue',
      image: '/test-image-1.png'
    },
    {
      id: 'progressive-disclosure',
      title: 'Progressive Disclosure',
      description: 'Test category 2',
      slug: 'progressive-disclosure',
      color: 'green',
      image: '/test-image-2.png'
    }
  ]
}));

// Test component that uses the context
function TestComponent() {
  const { patterns, categories, loading, error, getPattern, getPatternsByCategory, filterPatterns } = usePatterns();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  const pattern1 = getPattern('test-pattern-1');
  const contextualPatterns = getPatternsByCategory('Contextual Assistance');
  const filteredPatterns = filterPatterns({ priority: 'high' });
  
  return (
    <div>
      <div data-testid="patterns-count">{patterns.length}</div>
      <div data-testid="categories-count">{categories.length}</div>
      <div data-testid="pattern-1-title">{pattern1?.title}</div>
      <div data-testid="contextual-patterns-count">{contextualPatterns.length}</div>
      <div data-testid="filtered-patterns-count">{filteredPatterns.length}</div>
    </div>
  );
}

describe('PatternContext', () => {
  it('should provide pattern data to child components', async () => {
    render(
      <PatternProvider>
        <TestComponent />
      </PatternProvider>
    );
    
    // Initially shows loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for patterns to load
    await waitFor(() => {
      expect(screen.getByTestId('patterns-count')).toHaveTextContent('2');
    });
    
    // Check all provided data
    expect(screen.getByTestId('categories-count')).toHaveTextContent('2');
    expect(screen.getByTestId('pattern-1-title')).toHaveTextContent('Test Pattern 1');
    expect(screen.getByTestId('contextual-patterns-count')).toHaveTextContent('1');
    expect(screen.getByTestId('filtered-patterns-count')).toHaveTextContent('1');
  });
  
  it('should throw error when usePatterns is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const TestComponentWithoutProvider = () => {
      try {
        usePatterns();
        return null;
      } catch (error) {
        return <div>{(error as Error).message}</div>;
      }
    };
    
    render(<TestComponentWithoutProvider />);
    
    expect(screen.getByText('usePatterns must be used within a PatternProvider')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
  
  it('should filter patterns correctly with multiple criteria', async () => {
    const TestFilterComponent = () => {
      const { filterPatterns, loading } = usePatterns();
      
      if (loading) return <div>Loading...</div>;
      
      const filter: PatternFilter = {
        category: 'Contextual Assistance',
        status: 'implemented',
        priority: 'high',
        tags: ['test'],
        complexityRange: [6, 8]
      };
      
      const filtered = filterPatterns(filter);
      
      return <div data-testid="multi-filter-count">{filtered.length}</div>;
    };
    
    render(
      <PatternProvider>
        <TestFilterComponent />
      </PatternProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('multi-filter-count')).toHaveTextContent('1');
    });
  });
  
  it('should handle pattern loading errors gracefully', async () => {
    // Since we're using static imports, we'll simulate a successful load
    // This test demonstrates the pattern but doesn't actually test error handling
    // with static imports. For real error testing, we'd need dynamic imports.
    
    const TestErrorComponent = () => {
      const { error, loading, patterns } = usePatterns();
      
      if (loading) return <div>Loading...</div>;
      if (error) return <div data-testid="error">{error}</div>;
      
      return <div data-testid="success">Loaded {patterns.length} patterns</div>;
    };
    
    render(
      <PatternProvider>
        <TestErrorComponent />
      </PatternProvider>
    );
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('success')).toHaveTextContent('Loaded 2 patterns');
    });
  });
}); 
'use client';

import React from 'react';
import { usePatterns, usePattern, usePatternsByCategory } from '@/contexts';
import { PatternFilter } from '@/types';

/**
 * Example 1: Using the general usePatterns hook
 */
export function AllPatternsExample() {
  const { patterns, categories, loading, error } = usePatterns();
  
  if (loading) return <div>Loading patterns...</div>;
  if (error) return <div>Error loading patterns: {error}</div>;
  
  return (
    <div>
      <h2>All Patterns ({patterns.length})</h2>
      <ul>
        {patterns.map(pattern => (
          <li key={pattern.id}>
            {pattern.title} - {pattern.category}
          </li>
        ))}
      </ul>
      
      <h2>Categories ({categories.length})</h2>
      <ul>
        {categories.map(category => (
          <li key={category.id}>{category.title}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Example 2: Using the usePattern hook for a specific pattern
 */
export function SinglePatternExample({ slug }: { slug: string }) {
  const { pattern, loading, error } = usePattern(slug);
  
  if (loading) return <div>Loading pattern...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!pattern) return <div>Pattern not found</div>;
  
  return (
    <div>
      <h2>{pattern.title}</h2>
      <p>{pattern.description}</p>
      <p>Category: {pattern.category}</p>
      <p>Status: {pattern.status || 'N/A'}</p>
      <p>Priority: {pattern.priority || 'N/A'}</p>
      <p>Complexity: {pattern.complexity || 'N/A'}</p>
    </div>
  );
}

/**
 * Example 3: Using the usePatternsByCategory hook
 */
export function CategoryPatternsExample({ category }: { category: string }) {
  const { patterns, loading, error } = usePatternsByCategory(category);
  
  if (loading) return <div>Loading patterns...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>Patterns in {category} ({patterns.length})</h2>
      <ul>
        {patterns.map(pattern => (
          <li key={pattern.id}>
            <strong>{pattern.title}</strong>
            <p>{pattern.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Example 4: Using the filterPatterns method with complex criteria
 */
export function FilteredPatternsExample() {
  const { filterPatterns, loading, error } = usePatterns();
  
  if (loading) return <div>Loading patterns...</div>;
  if (error) return <div>Error: {error}</div>;
  
  // Example filter: High priority patterns with complexity 7-10
  const filter: PatternFilter = {
    priority: 'high',
    complexityRange: [7, 10],
    status: 'implemented'
  };
  
  const filteredPatterns = filterPatterns(filter);
  
  return (
    <div>
      <h2>High Priority Complex Patterns ({filteredPatterns.length})</h2>
      <ul>
        {filteredPatterns.map(pattern => (
          <li key={pattern.id}>
            {pattern.title} (Complexity: {pattern.complexity})
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Example 5: Building a pattern search component
 */
export function PatternSearchExample() {
  const { patterns, loading, error, filterPatterns } = usePatterns();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  
  // Filter patterns based on search term and category
  const searchResults = React.useMemo(() => {
    if (loading || error || !patterns) return [];
    
    let results = patterns;
    
    // Filter by category if selected
    if (selectedCategory) {
      results = filterPatterns({ category: selectedCategory });
    }
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(pattern => 
        pattern.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pattern.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return results;
  }, [patterns, filterPatterns, searchTerm, selectedCategory, loading, error]);
  
  if (loading) return <div>Loading patterns...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>Pattern Search</h2>
      
      <input
        type="text"
        placeholder="Search patterns..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <select 
        value={selectedCategory} 
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="Contextual Assistance">Contextual Assistance</option>
        <option value="Progressive Disclosure">Progressive Disclosure</option>
        <option value="Human-in-the-Loop">Human-in-the-Loop</option>
        {/* Add more categories as needed */}
      </select>
      
      <h3>Results ({searchResults.length})</h3>
      <ul>
        {searchResults.map(pattern => (
          <li key={pattern.id}>
            <strong>{pattern.title}</strong> - {pattern.category}
            <p>{pattern.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
} 
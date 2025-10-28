import { Pattern } from '../../types';

/**
 * Represents a product with its metadata
 */
export interface Product {
  name: string;
  count: number; // Number of patterns that use this product
}

/**
 * Extract the product name from an example title
 * Examples: "Google Smart Compose" -> "Google", "GitHub Copilot" -> "GitHub", etc.
 */
function extractProductName(title: string): string {
  // Take the first word/brand name as the product
  const words = title.split(' ');
  return words[0];
}

/**
 * Get all unique products from patterns
 * Returns a sorted list of products with counts
 */
export function getAllProducts(patterns: Pattern[]): Product[] {
  const productMap = new Map<string, number>();

  patterns.forEach((pattern) => {
    pattern.content.examples.forEach((example) => {
      const productName = extractProductName(example.title);
      productMap.set(productName, (productMap.get(productName) || 0) + 1);
    });
  });

  // Convert to array and sort by count (descending), then by name
  return Array.from(productMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });
}

/**
 * Get all products mentioned in a specific pattern
 */
export function getProductsForPattern(pattern: Pattern): string[] {
  const products = new Set<string>();

  pattern.content.examples.forEach((example) => {
    const productName = extractProductName(example.title);
    products.add(productName);
  });

  return Array.from(products).sort();
}

/**
 * Filter patterns by product name
 * Case-insensitive matching
 */
export function filterPatternsByProduct(
  patterns: Pattern[],
  productName: string
): Pattern[] {
  if (!productName) return patterns;

  const lowerProductName = productName.toLowerCase();

  return patterns.filter((pattern) => {
    return pattern.content.examples.some((example) => {
      const exampleProductName = extractProductName(example.title).toLowerCase();
      return exampleProductName === lowerProductName;
    });
  });
}

/**
 * Filter patterns by multiple products (OR condition)
 * If selectedProducts is empty, returns all patterns
 */
export function filterPatternsByProducts(
  patterns: Pattern[],
  selectedProducts: string[]
): Pattern[] {
  if (!selectedProducts || selectedProducts.length === 0) return patterns;

  const lowerSelectedProducts = selectedProducts.map((p) => p.toLowerCase());

  return patterns.filter((pattern) => {
    return pattern.content.examples.some((example) => {
      const exampleProductName = extractProductName(example.title).toLowerCase();
      return lowerSelectedProducts.includes(exampleProductName);
    });
  });
}

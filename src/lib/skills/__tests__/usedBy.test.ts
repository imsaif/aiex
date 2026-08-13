import { patterns } from '@/data/patterns';
import { exampleProducts } from '../usedBy';

const hitl = patterns.find((p) => p.slug === 'human-in-the-loop')!;

describe('exampleProducts', () => {
  it('matches known companies from example titles and attaches their logo', () => {
    const products = exampleProducts(hitl);
    const grammarly = products.find((p) => p.name === 'Grammarly');
    expect(grammarly).toBeDefined();
    expect(grammarly!.logo).toBe('/images/logos/simple-icons/grammarly.svg');
  });

  it('falls back to the example title as a text-only product when no logo matches', () => {
    const fake = {
      ...hitl,
      content: {
        ...hitl.content,
        examples: [{ title: 'Obscure Tool Nobody Logos', description: '', image: '', altText: '' }],
      },
    };
    expect(exampleProducts(fake)).toEqual([{ name: 'Obscure Tool Nobody Logos' }]);
  });

  it('dedupes and caps at the limit, and never throws for any registry pattern', () => {
    for (const pattern of patterns) {
      const products = exampleProducts(pattern, 4);
      expect(products.length).toBeLessThanOrEqual(4);
      const names = products.map((p) => p.name);
      expect(new Set(names).size).toBe(names.length);
    }
  });
});

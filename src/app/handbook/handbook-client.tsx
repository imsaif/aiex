'use client';

import { HandbookHero } from '@/components/sections/handbook/HandbookHero';
import { HandbookPatternList } from '@/components/sections/handbook/HandbookPatternList';

export function HandbookClient() {
  return (
    <div className="bg-background-primary">
      <HandbookHero />
      <HandbookPatternList />
    </div>
  );
}

'use client';

import Link from 'next/link';
import { HandbookHero } from '@/components/sections/handbook/HandbookHero';

export function HandbookClient() {
  return (
    <div>
      {/* Subtle Header with Back Link */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-600 hover:text-black transition flex items-center gap-1">
            ← Back to Home
          </Link>
          <div className="text-xs text-gray-500">
            AI UX Design Handbook
          </div>
        </div>
      </header>

      {/* Main Content */}
      <HandbookHero />
    </div>
  );
}

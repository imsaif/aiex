'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Guide } from '@/types';

interface GuideCardProps {
  guide: Guide;
  index?: number;
}

export default function GuideCard({ guide, index = 0 }: GuideCardProps) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/guides/${guide.slug}`} className="block group">
        <div className="bg-surface-primary rounded-xl p-6 border border-border-primary
                      hover:border-border-secondary transition-all duration-300 h-full
                      flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent-primary transition-colors">
            {guide.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-text-secondary line-clamp-2 flex-grow mb-4">
            {guide.description}
          </p>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border-primary mb-4">
            {/* Tool Badge */}
            <span className="px-3 py-1 rounded-full text-xs bg-accent-subtle text-accent-primary font-medium">
              {guide.tool}
            </span>

            {/* Skill Level Badge */}
            <span className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-text-secondary text-xs">
              {guide.skillLevel}
            </span>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {guide.readTime} min read
            </span>
            <span>{guide.designDomain}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

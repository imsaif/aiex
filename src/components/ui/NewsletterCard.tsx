'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Newsletter } from '@/types';

interface NewsletterCardProps {
  newsletter: Newsletter;
  index?: number;
}

export default function NewsletterCard({ newsletter, index = 0 }: NewsletterCardProps) {
  const formattedDate = new Date(newsletter.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Link
        href={`/news/${newsletter.slug}`}
        className="block bg-surface-primary rounded-2xl border border-gray-200 dark:border-gray-700
                   shadow-card hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-card-hover
                   transition-all p-6 md:p-8"
      >
        {/* Header with date */}
        <div className="flex items-center gap-2 text-text-secondary text-sm mb-3">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <time dateTime={new Date(newsletter.publishedAt).toISOString()}>
            {formattedDate}
          </time>
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-semibold text-text-primary mb-3 hover:text-accent-primary transition-colors">
          {newsletter.title}
        </h2>

        {/* Summary */}
        <p className="text-text-secondary mb-4 line-clamp-3">
          {newsletter.summary}
        </p>

        {/* Tags */}
        {newsletter.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {newsletter.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Read More */}
        <span className="flex items-center gap-1 text-sm font-medium text-accent-primary hover:text-accent-hover transition-colors">
          Read full issue
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </Link>
    </motion.div>
  );
}

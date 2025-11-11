'use client';

import { motion } from 'framer-motion';

const companies = [
  { name: 'Apple', logo: 'https://cdn.simpleicons.org/apple' },
  { name: 'Google', logo: 'https://cdn.simpleicons.org/google' },
  { name: 'GitHub', logo: 'https://cdn.simpleicons.org/github' },
  { name: 'Figma', logo: 'https://cdn.simpleicons.org/figma' },
  { name: 'OpenAI', logo: 'https://cdn.simpleicons.org/openai' },
  { name: 'Anthropic', logo: 'https://cdn.simpleicons.org/anthropic' },
  { name: 'Microsoft', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/microsoft.svg' },
  { name: 'Slack', logo: 'https://cdn.simpleicons.org/slack' },
  { name: 'Notion', logo: 'https://cdn.simpleicons.org/notion' },
  { name: 'Adobe', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/adobe.svg' },
  { name: 'Tesla', logo: 'https://cdn.simpleicons.org/tesla' },
  { name: 'Netflix', logo: 'https://cdn.simpleicons.org/netflix' },
];

export function LogosCarousel() {
  // Duplicate the array to create seamless loop
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section className="py-3 sm:py-4 px-4 sm:px-6 lg:px-8 bg-background-primary">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-sm font-semibold text-foreground-secondary mb-4 uppercase tracking-wide">
          Patterns used by leading companies
        </p>

        <div className="overflow-hidden">
          <motion.div
            className="flex gap-12 md:gap-16"
            animate={{ x: [-2000, 0] }}
            transition={{
              duration: 50,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
            }}
          >
            {duplicatedCompanies.map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="flex-shrink-0 h-12 flex items-center justify-center min-w-max"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-8 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';

const companies = [
  { name: 'Apple', logo: '/images/logos/simple-icons/apple.svg' },
  { name: 'Google', logo: '/images/logos/simple-icons/google.svg' },
  { name: 'GitHub', logo: '/images/logos/simple-icons/github.svg' },
  { name: 'Figma', logo: '/images/logos/simple-icons/figma.svg' },
  { name: 'OpenAI', logo: '/images/logos/simple-icons/openai.svg' },
  { name: 'Anthropic', logo: '/images/logos/simple-icons/anthropic.svg' },
  { name: 'Microsoft', logo: '/images/logos/simple-icons/microsoft.svg' },
  { name: 'Slack', logo: '/images/logos/simple-icons/slack.svg' },
  { name: 'Notion', logo: '/images/logos/simple-icons/notion.svg' },
  { name: 'Adobe', logo: '/images/logos/simple-icons/adobe.svg' },
  { name: 'Tesla', logo: '/images/logos/simple-icons/tesla.svg' },
  { name: 'Netflix', logo: '/images/logos/simple-icons/netflix.svg' },
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
                  width={32}
                  height={32}
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

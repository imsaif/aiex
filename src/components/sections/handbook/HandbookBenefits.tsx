'use client';

import { motion } from 'framer-motion';

const benefits = [
  {
    icon: '🎯',
    title: 'Learn When AI Helps (Not Hurts)',
    description: 'Discover which AI patterns work in which contexts and when users actually want AI assistance',
  },
  {
    icon: '🛡️',
    title: 'Design with Confidence',
    description: 'Use proven patterns instead of guessing. Each pattern is backed by real product examples from industry leaders',
  },
  {
    icon: '⚡',
    title: 'Save Development Time',
    description: "Don't reinvent the wheel. Learn from Apple, Google, GitHub, and Figma's proven approaches",
  },
  {
    icon: '🤝',
    title: 'Build User Trust',
    description: 'Understand how to communicate AI capabilities transparently and manage user expectations',
  },
  {
    icon: '🚀',
    title: 'Stay Ahead of the Curve',
    description: 'Learn patterns that are becoming standard in AI product design as the space matures',
  },
  {
    icon: '💼',
    title: 'Get the Skills Employers Want',
    description: 'AI design is a critical skill for 2025+. Master these patterns to stand out in the job market',
  },
];

export function HandbookBenefits() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background-primary">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground-primary mb-4">
            Why This Handbook Matters
          </h2>
          <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
            The benefits of mastering AI design patterns
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-background-secondary border border-border-primary rounded-xl p-6 hover:border-accent-primary transition-all hover:shadow-lg group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground-primary mb-2 group-hover:text-accent-primary transition">
                {benefit.title}
              </h3>
              <p className="text-foreground-secondary text-sm">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-accent-primary/5 border border-accent-primary/20 rounded-xl p-8 sm:p-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-accent-primary mb-2">
                6
              </div>
              <p className="text-sm text-foreground-secondary">Proven Patterns</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-accent-primary mb-2">
                100+
              </div>
              <p className="text-sm text-foreground-secondary">Real Examples</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-accent-primary mb-2">
                15m
              </div>
              <p className="text-sm text-foreground-secondary">Read Time</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-accent-primary mb-2">
                ✓
              </div>
              <p className="text-sm text-foreground-secondary">100% Free</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

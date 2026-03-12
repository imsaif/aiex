const patterns = [
  {
    number: 1,
    name: 'Contextual Assistance',
    description: "Help users when they're actually stuck, not when you think they might be",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    number: 2,
    name: 'Confidence Visualization',
    description: 'Show certainty levels so users know when to trust AI results',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    number: 3,
    name: 'Error Recovery',
    description: 'Handle AI failures gracefully without blaming the user',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: 4,
    name: 'Privacy-First Design',
    description: 'Make users feel safe sharing data with transparent controls',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    number: 5,
    name: 'Explainable AI',
    description: 'Show why AI made each decision so users can verify it',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5h.01" />
      </svg>
    ),
  },
  {
    number: 6,
    name: 'Progressive Disclosure',
    description: 'Start simple, add power later as users gain confidence',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-3" />
      </svg>
    ),
  },
];

export function HandbookPatternList() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background-secondary">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground-primary mb-4">
            What's Inside
          </h2>
          <p className="text-lg text-foreground-secondary">
            Key patterns for designing human-centered AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patterns.map((pattern) => (
            <div
              key={pattern.number}
              className="group bg-background-primary border border-border-primary rounded-xl p-6 hover:border-accent-primary hover:shadow-lg transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-accent-subtle text-text-primary flex items-center justify-center mb-4 group-hover:bg-accent-primary/20 transition-colors">
                {pattern.icon}
              </div>

              {/* Pattern Number */}
              <p className="text-xs text-accent-primary font-semibold uppercase tracking-wide mb-2">
                Pattern {pattern.number}
              </p>

              {/* Title */}
              <h3 className="text-lg font-bold text-foreground-primary mb-3 group-hover:text-accent-primary transition-colors">
                {pattern.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-foreground-secondary leading-relaxed">
                {pattern.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

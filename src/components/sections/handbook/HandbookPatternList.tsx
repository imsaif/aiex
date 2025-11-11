const patterns = [
  {
    number: 1,
    name: 'Contextual Assistance',
    description: "Help users when they're actually stuck, not when you think they might be",
  },
  {
    number: 2,
    name: 'Confidence Visualization',
    description: 'Show certainty levels so users know when to trust AI results',
  },
  {
    number: 3,
    name: 'Error Recovery',
    description: 'Handle AI failures gracefully without blaming the user',
  },
  {
    number: 4,
    name: 'Privacy-First Design',
    description: 'Make users feel safe sharing data with transparent controls',
  },
  {
    number: 5,
    name: 'Explainable AI',
    description: 'Show why AI made each decision so users can verify it',
  },
  {
    number: 6,
    name: 'Progressive Disclosure',
    description: 'Start simple, add power later as users gain confidence',
  },
];

export function HandbookPatternList() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background-secondary">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground-primary mb-4 text-center">
          What's Inside
        </h2>
        <p className="text-foreground-secondary text-center mb-12">
          Six essential patterns for designing human-centered AI
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patterns.map((pattern) => (
            <div
              key={pattern.number}
              className="border border-border-primary rounded-lg p-4 hover:border-accent-primary transition"
            >
              <p className="text-xs text-accent-primary font-semibold mb-1">Pattern {pattern.number}</p>
              <h3 className="font-semibold text-foreground-primary mb-1">{pattern.name}</h3>
              <p className="text-sm text-foreground-secondary">{pattern.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'Is this handbook really free?',
    answer: 'Yes, completely free! No credit card required, no hidden upsells.',
  },
  {
    question: 'Will you spam my email?',
    answer: 'No. You\'ll get a daily AI UX news digest. Unsubscribe anytime.',
  },
  {
    question: 'Who is this for?',
    answer: 'Product designers, UX designers, product managers, and anyone working on AI products.',
  },
  {
    question: 'How long is it?',
    answer: 'About 15-20 minutes to read. Each pattern is designed to be skimmable with clear takeaways.',
  },
  {
    question: 'What format?',
    answer: 'A downloadable PDF with beautiful design, real product examples, and design guidelines.',
  },
  {
    question: 'Can I share with my team?',
    answer: 'Yes! Download and use it however you like for your team.',
  },
];

export function HandbookFAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background-primary">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground-primary mb-12 text-center">FAQ</h2>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-border-primary rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-background-secondary transition text-left"
              >
                <h3 className="font-semibold text-foreground-primary text-sm">{faq.question}</h3>
                <span className="text-foreground-secondary flex-shrink-0 ml-4">
                  {expandedIndex === index ? '−' : '+'}
                </span>
              </button>

              {expandedIndex === index && (
                <div className="px-4 py-3 bg-background-secondary border-t border-border-primary">
                  <p className="text-sm text-foreground-secondary">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

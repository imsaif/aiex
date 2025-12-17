/**
 * Seed script for newsletter data
 * Run with: npx ts-node scripts/seed-newsletters.ts
 * Or: npm run seed-newsletters
 */

import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

interface NewsletterSeed {
  title: string;
  slug: string;
  summary: string;
  content: string;
  publishedAt: Date;
  published: boolean;
  tags: string[];
}

const sampleNewsletters: NewsletterSeed[] = [
  {
    title: 'Welcome to AI UX Design Patterns',
    slug: 'welcome-to-ai-ux-design-patterns',
    summary:
      'Introducing our newsletter covering the latest in AI design patterns, UX insights, and practical implementation guides for designers and developers.',
    content: `
<h2>Welcome!</h2>
<p>We're excited to launch the AI UX Design Patterns newsletter. Each issue will bring you insights into designing better AI-powered interfaces.</p>

<h3>What to Expect</h3>
<ul>
  <li>Deep dives into specific AI design patterns</li>
  <li>Real-world examples from leading products</li>
  <li>Practical implementation tips</li>
  <li>Industry news and trends</li>
</ul>

<h3>Featured Pattern: Contextual Assistance</h3>
<p>This week we're highlighting the Contextual Assistance pattern - providing help exactly when and where users need it. Great examples include GitHub Copilot's inline suggestions and Notion AI's contextual prompts.</p>

<blockquote>
  <p>"The best interface is no interface. The best assistance appears before you need to ask for it."</p>
</blockquote>

<p>Stay tuned for more insights in upcoming issues!</p>
    `.trim(),
    publishedAt: new Date('2024-01-15'),
    published: true,
    tags: ['Introduction', 'AI Design', 'UX Patterns'],
  },
  {
    title: 'Deep Dive: Human-in-the-Loop Design',
    slug: 'deep-dive-human-in-the-loop-design',
    summary:
      'Exploring how to balance AI automation with human oversight. When should users have control, and how do we design for trust?',
    content: `
<h2>The Art of Human-AI Collaboration</h2>
<p>As AI becomes more capable, finding the right balance between automation and human control becomes crucial. Too much automation can feel unsettling; too little defeats the purpose of AI assistance.</p>

<h3>Key Principles</h3>
<ol>
  <li><strong>Transparency:</strong> Always show what the AI is doing and why</li>
  <li><strong>Control:</strong> Give users the ability to override, edit, or reject AI suggestions</li>
  <li><strong>Feedback:</strong> Make it easy to provide corrections that improve the system</li>
</ol>

<h3>Case Study: Gmail Smart Compose</h3>
<p>Gmail's Smart Compose is an excellent example of human-in-the-loop design. Suggestions appear inline, can be accepted with Tab, or simply ignored. The user always maintains control over their message.</p>

<h3>When to Use This Pattern</h3>
<ul>
  <li>High-stakes decisions (financial, medical, legal)</li>
  <li>Creative tasks where personal style matters</li>
  <li>Situations where errors could be costly</li>
</ul>

<p>Remember: AI should augment human capability, not replace human judgment.</p>
    `.trim(),
    publishedAt: new Date('2024-02-01'),
    published: true,
    tags: ['Human-in-the-Loop', 'AI Ethics', 'Trust'],
  },
  {
    title: 'Building Trust with Confidence Visualization',
    slug: 'building-trust-with-confidence-visualization',
    summary:
      'How showing AI confidence levels helps users make better decisions. Real examples from weather apps, search engines, and diagnostic tools.',
    content: `
<h2>Why Confidence Matters</h2>
<p>AI systems aren't always certain about their outputs. Communicating this uncertainty helps users calibrate their trust and make informed decisions.</p>

<h3>Visualization Techniques</h3>
<ul>
  <li><strong>Percentage indicators:</strong> "85% confident"</li>
  <li><strong>Visual meters:</strong> Progress bars or gauges</li>
  <li><strong>Color coding:</strong> Green/yellow/red for confidence levels</li>
  <li><strong>Language cues:</strong> "I'm fairly confident..." vs "I'm certain..."</li>
</ul>

<h3>Example: Weather Forecasting</h3>
<p>Modern weather apps don't just show "Rain on Tuesday." They show "70% chance of rain" with precipitation probability charts. This honest uncertainty actually increases user trust.</p>

<h3>Design Guidelines</h3>
<ol>
  <li>Match visualization complexity to user expertise</li>
  <li>Don't overwhelm with too many confidence indicators</li>
  <li>Be consistent in how you represent uncertainty</li>
  <li>Explain what confidence levels mean in context</li>
</ol>

<p>Transparency about limitations builds trust more effectively than false certainty.</p>
    `.trim(),
    publishedAt: new Date('2024-02-15'),
    published: true,
    tags: ['Confidence Visualization', 'Trust', 'UI Design'],
  },
  {
    title: 'Progressive Disclosure in AI Interfaces',
    slug: 'progressive-disclosure-ai-interfaces',
    summary:
      'Start simple, reveal complexity gradually. How progressive disclosure makes AI features more approachable for all users.',
    content: `
<h2>Less is More (Initially)</h2>
<p>AI systems often have powerful capabilities, but showing everything at once can overwhelm users. Progressive disclosure reveals features gradually based on user needs and expertise.</p>

<h3>The Three Layers</h3>
<ol>
  <li><strong>Essential:</strong> The core action everyone needs (e.g., "Ask AI")</li>
  <li><strong>Intermediate:</strong> Common customizations (e.g., tone, length)</li>
  <li><strong>Advanced:</strong> Power user features (e.g., custom prompts, API access)</li>
</ol>

<h3>Example: ChatGPT's Evolution</h3>
<p>ChatGPT starts with a simple text input. As users become comfortable, they discover features like conversation history, custom instructions, and GPTs. The complexity grows with the user.</p>

<h3>Implementation Tips</h3>
<ul>
  <li>Use expandable sections for advanced options</li>
  <li>Implement "Learn more" links for curious users</li>
  <li>Remember user preferences for future sessions</li>
  <li>A/B test different disclosure levels</li>
</ul>

<p>The goal: Make simple things simple, and complex things possible.</p>
    `.trim(),
    publishedAt: new Date('2024-03-01'),
    published: true,
    tags: ['Progressive Disclosure', 'UX Design', 'Onboarding'],
  },
  {
    title: 'Error Recovery: When AI Gets It Wrong',
    slug: 'error-recovery-when-ai-gets-it-wrong',
    summary:
      'AI will make mistakes. Great design helps users recover gracefully. Patterns for handling errors, corrections, and edge cases.',
    content: `
<h2>Embrace Imperfection</h2>
<p>No AI system is perfect. The key isn't preventing all errors—it's making recovery easy and learning from mistakes.</p>

<h3>Error Recovery Patterns</h3>
<ul>
  <li><strong>Undo/Redo:</strong> Always provide a way to reverse AI actions</li>
  <li><strong>Edit in place:</strong> Let users modify AI output directly</li>
  <li><strong>Regenerate:</strong> Offer to try again with the same or modified prompt</li>
  <li><strong>Explain:</strong> Help users understand why the error might have occurred</li>
</ul>

<h3>Example: Image Generation</h3>
<p>Midjourney's interface shows 4 variations per prompt. If none are right, users can easily regenerate, vary specific images, or refine their prompt. Every "failure" is a learning opportunity.</p>

<h3>Communication Guidelines</h3>
<ol>
  <li>Use friendly, non-technical language</li>
  <li>Take responsibility ("I didn't understand" not "Invalid input")</li>
  <li>Suggest specific next steps</li>
  <li>Make feedback submission effortless</li>
</ol>

<p>A graceful error recovery can actually increase user trust more than a perfect first attempt.</p>
    `.trim(),
    publishedAt: new Date('2024-03-15'),
    published: true,
    tags: ['Error Recovery', 'UX Design', 'Trust'],
  },
];

async function main() {
  console.log('🌱 Seeding newsletter data...\n');

  // Create or update tags
  const tagMap = new Map<string, string>();
  const allTags = Array.from(new Set(sampleNewsletters.flatMap((n) => n.tags)));

  console.log('Creating tags...');
  for (const tagName of allTags) {
    const slug = tagName.toLowerCase().replace(/\s+/g, '-');
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: { name: tagName },
      create: { name: tagName, slug },
    });
    tagMap.set(tagName, tag.id);
    console.log(`  ✓ Tag: ${tagName}`);
  }

  // Create or update newsletters
  console.log('\nCreating newsletters...');
  for (const newsletter of sampleNewsletters) {
    const { tags, ...data } = newsletter;

    // Delete existing newsletter tag relations if newsletter exists
    const existing = await prisma.newsletter.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      await prisma.newsletterTag.deleteMany({
        where: { newsletterId: existing.id },
      });
    }

    // Upsert newsletter
    const created = await prisma.newsletter.upsert({
      where: { slug: data.slug },
      update: {
        title: data.title,
        summary: data.summary,
        content: data.content,
        publishedAt: data.publishedAt,
        published: data.published,
      },
      create: data,
    });

    // Create tag relations
    for (const tagName of tags) {
      const tagId = tagMap.get(tagName);
      if (tagId) {
        await prisma.newsletterTag.create({
          data: {
            newsletterId: created.id,
            tagId,
          },
        });
      }
    }

    console.log(`  ✓ Newsletter: ${newsletter.title}`);
  }

  console.log('\n✅ Seeding complete!');
  console.log(`   - ${allTags.length} tags created/updated`);
  console.log(`   - ${sampleNewsletters.length} newsletters created/updated`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

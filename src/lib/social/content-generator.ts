import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface NewsletterItem {
  product: string;
  headline: string;
  description: string;
  sourceUrl: string;
  patternSlug?: string;
}

interface NewsletterData {
  title: string;
  summary: string;
  type: 'daily' | 'weekly';
  items: NewsletterItem[];
  takeaway?: string;
  stealThisWeek?: {
    product: string;
    feature: string;
    description?: string;
    insight?: string; // Alternative field name from weekly newsletter
  };
  patternToKnow?: {
    name: string;
    description: string;
    slug: string;
  };
}

interface TwitterContent {
  content: string; // Main tweet or hook tweet for thread
  threadContent?: string[]; // Additional tweets for thread
  hashtags: string[];
}

interface LinkedInContent {
  content: string;
  hashtags: string[];
}

interface RedditContent {
  content: string; // Full reddit post body (markdown)
  title: string; // Reddit post title
}

interface GeneratedSocialContent {
  twitter: TwitterContent;
  linkedin: LinkedInContent;
  reddit: RedditContent;
}

/**
 * Generates social media content for both Twitter/X and LinkedIn
 * from newsletter structured data
 */
export async function generateSocialContent(
  newsletterData: NewsletterData,
  newsletterUrl: string
): Promise<GeneratedSocialContent> {
  const [twitterContent, linkedInContent, redditContent] = await Promise.all([
    generateTwitterContent(newsletterData, newsletterUrl),
    generateLinkedInContent(newsletterData, newsletterUrl),
    generateRedditContent(newsletterData, newsletterUrl),
  ]);

  return {
    twitter: twitterContent,
    linkedin: linkedInContent,
    reddit: redditContent,
  };
}

/**
 * Generates Twitter/X content from newsletter data
 * Creates an opinion thread: hook tweet + one opinionated take per story + closing tweet
 */
export async function generateTwitterContent(
  newsletterData: NewsletterData,
  newsletterUrl: string
): Promise<TwitterContent> {
  const prompt = buildTwitterOpinionThreadPrompt(newsletterData, newsletterUrl);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: `You are a sharp, opinionated voice in the AI design and product space. You write for X (Twitter). Your posts are standalone opinions — not summaries, not teasers, not newsletter promotions. You write like someone who has a point of view and isn't afraid to state it plainly. Each tweet in a thread should hit hard on its own.`,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  try {
    // Extract JSON from the response (may be wrapped in markdown code blocks)
    const jsonMatch = content.text.match(/```json\n?([\s\S]*?)\n?```/) ||
                      content.text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content.text;
    const parsed = JSON.parse(jsonStr);

    return {
      content: parsed.hookTweet,
      threadContent: parsed.thread,
      hashtags: parsed.hashtags || [],
    };
  } catch (error) {
    console.error('Failed to parse Twitter content:', error);
    // Fallback to a simple format
    return {
      content: `${newsletterData.title}\n\nCheck out the latest AI+UX insights: ${newsletterUrl}`,
      hashtags: ['AIUX', 'DesignPatterns'],
    };
  }
}

/**
 * Generates LinkedIn content from newsletter data
 */
export async function generateLinkedInContent(
  newsletterData: NewsletterData,
  newsletterUrl: string
): Promise<LinkedInContent> {
  const prompt = buildLinkedInPrompt(newsletterData, newsletterUrl);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  try {
    // Extract JSON from the response
    const jsonMatch = content.text.match(/```json\n?([\s\S]*?)\n?```/) ||
                      content.text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content.text;
    const parsed = JSON.parse(jsonStr);

    return {
      content: parsed.post,
      hashtags: parsed.hashtags || [],
    };
  } catch (error) {
    console.error('Failed to parse LinkedIn content:', error);
    // Fallback to a simple format
    return {
      content: `${newsletterData.title}\n\n${newsletterData.summary}\n\nRead more: ${newsletterUrl}`,
      hashtags: ['AIUX', 'DesignPatterns', 'ProductDesign'],
    };
  }
}

function buildTwitterOpinionThreadPrompt(data: NewsletterData, url: string): string {
  const itemsList = data.items
    .map((item, i) => `${i + 1}. ${item.product}: ${item.headline} — ${item.description}`)
    .join('\n');

  const storyCount = data.items.length;

  return `Here is today's AI UX newsletter content:

Title: ${data.title}
Summary: ${data.summary}

Stories:
${itemsList}

${data.takeaway ? `Takeaway: ${data.takeaway}` : ''}
${data.stealThisWeek ? `Featured: ${data.stealThisWeek.product} — ${data.stealThisWeek.feature}` : ''}
${data.patternToKnow ? `Pattern: ${data.patternToKnow.name} — ${data.patternToKnow.description}` : ''}

Your task:
Write an opinion thread for X. The thread has 3 parts:

1. **Hook tweet** — A bold, opinionated opening that sets the theme across today's ${storyCount} stories. This is the tweet people see first. Make them want to read the thread.

2. **One tweet per story** (${storyCount} tweets) — For EACH story above, write one tweet (under 280 chars) with a strong opinion about what that story MEANS for designers and product builders. Not what happened — what it implies. Each tweet should stand on its own.

3. **Closing tweet** — Tie it together with a sharp takeaway. End with the newsletter link: ${url}

Rules:
- Every tweet must be under 280 characters
- Start each tweet with the insight or opinion, not the news event
- Use emojis naturally within tweets to add personality and visual interest (e.g. 🔥, 👀, 🤔, 💡, ⚡, 🚀, 🎯) — place them mid-sentence or at the end, not as the very first character
- No "here's what happened" or "let's break it down" framing
- Write in first person or as direct statements
- Each tweet must make sense on its own — not dependent on the previous one
- The hook should NOT list stories or say "X things happened today"
- Suggest 2-3 relevant hashtags (not included in character count)

Example of a BAD hook:
"5 big AI stories dropped today. Let me break them down 🧵"

Example of a GOOD hook:
"The AI product landscape shifted this week in ways most teams aren't ready for. A few things worth paying attention to 👀"

Example of a BAD story tweet:
"Google announced Gemini 2.0 with impressive multimodal capabilities and agentic features."

Example of a GOOD story tweet:
"Google positioning Gemini as an agent platform isn't a model upgrade — it's a bet that the next interface isn't a chatbox, it's an autonomous worker 🤔 Design teams need to start thinking about supervision UX, not conversation UX."

Respond with JSON only:
{
  "hookTweet": "Your bold opening tweet",
  "thread": [
    "Opinion tweet about story 1",
    "Opinion tweet about story 2",
    "Opinion tweet about story 3",
    "Closing tweet with takeaway and link"
  ],
  "hashtags": ["hashtag1", "hashtag2"]
}`;
}

function buildRedditPrompt(data: NewsletterData, url: string): string {
  const itemsList = data.items
    .map((item, i) => `${i + 1}. ${item.product}: ${item.headline} — ${item.description}`)
    .join('\n');

  return `Here is today's AI UX newsletter content:

Title: ${data.title}
Summary: ${data.summary}

Stories:
${itemsList}

${data.takeaway ? `Takeaway: ${data.takeaway}` : ''}
${data.stealThisWeek ? `Featured: ${data.stealThisWeek.product} — ${data.stealThisWeek.feature}` : ''}
${data.patternToKnow ? `Pattern: ${data.patternToKnow.name} — ${data.patternToKnow.description}` : ''}

Newsletter link: ${url}

Write a Reddit self-post that covers ALL of today's stories with opinionated commentary. This is for subreddits like r/UXDesign, r/ProductManagement, or r/artificial.

Structure:
1. **Title** — A compelling, discussion-provoking title (not clickbait). Should feel like a practitioner's observation, not a headline.
2. **Body** — A markdown-formatted self-post that:
   - Opens with a 1-2 sentence opinion or observation that ties the stories together
   - Covers each story with a brief summary + your take on what it means
   - Uses markdown headers (##) or bold (**text**) for each story
   - Ends with a discussion prompt (a genuine question to spark replies)
   - Includes the newsletter link naturally at the end (not as a hard CTA)

Rules:
- Write like a community member sharing insights, not promoting content
- Be opinionated but back it up — say WHY something matters
- Use Reddit-native markdown formatting
- Keep the total body between 300-600 words
- No emoji in the title
- Minimal emoji in body (Reddit culture is text-heavy)
- The discussion question at the end should be genuine and specific, not generic

Example of a BAD title:
"AI News Roundup: 5 Things That Happened This Week!"

Example of a GOOD title:
"The IDE is becoming the new OS — and most design teams aren't ready for what that means"

Respond with JSON only:
{
  "title": "Your Reddit post title",
  "body": "Your full markdown-formatted Reddit post body"
}`;
}

function buildLinkedInPrompt(data: NewsletterData, url: string): string {
  const itemsList = data.items
    .map((item) => `- ${item.product}: ${item.headline} - ${item.description}`)
    .join('\n');

  return `You are a social media expert for an AI+UX design newsletter. Create a professional LinkedIn post about the latest newsletter edition.

Newsletter Title: ${data.title}
Summary: ${data.summary}
Type: ${data.type}

Items covered:
${itemsList}

${data.takeaway ? `Key Takeaway: ${data.takeaway}` : ''}
${data.stealThisWeek ? `Featured: ${data.stealThisWeek.product} - ${data.stealThisWeek.feature}: ${data.stealThisWeek.description || data.stealThisWeek.insight || ''}` : ''}
${data.patternToKnow ? `Design Pattern Spotlight: ${data.patternToKnow.name} - ${data.patternToKnow.description}` : ''}

Newsletter URL: ${url}

Requirements:
- Length: 1000-1300 characters (optimal for LinkedIn engagement)
- Structure:
  1. Opening hook (1-2 lines) - question or bold statement
  2. Key insights (bullet points or short paragraphs) - use a relevant emoji at the start of each item (e.g. 🔍 for research, 🚀 for launches, 🛡️ for security, 🛒 for commerce, 📊 for analytics)
  3. Call-to-action with link
- Professional but engaging tone — use emojis to add visual interest like top LinkedIn creators do
- Add value beyond just summarizing
- Suggest 3-5 relevant hashtags

Respond with JSON only:
{
  "post": "Your full LinkedIn post text here including the URL at the end",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4"]
}`;
}

/**
 * Generates Reddit content from newsletter data
 * Creates a self-post with opinionated commentary for copy-paste
 */
export async function generateRedditContent(
  newsletterData: NewsletterData,
  newsletterUrl: string
): Promise<RedditContent> {
  const prompt = buildRedditPrompt(newsletterData, newsletterUrl);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: `You are a knowledgeable contributor to Reddit communities about AI, UX design, and product development. You write thoughtful, substantive self-posts that spark discussion. You sound like a practitioner sharing insights, not a marketer promoting a newsletter. Your tone is conversational, informed, and opinionated without being aggressive.`,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  try {
    const jsonMatch = content.text.match(/```json\n?([\s\S]*?)\n?```/) ||
                      content.text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content.text;
    const parsed = JSON.parse(jsonStr);

    return {
      title: parsed.title,
      content: parsed.body,
    };
  } catch (error) {
    console.error('Failed to parse Reddit content:', error);
    return {
      title: newsletterData.title,
      content: `${newsletterData.summary}\n\nRead more: ${newsletterUrl}`,
    };
  }
}

/**
 * Regenerates content for a specific platform
 */
export async function regeneratePlatformContent(
  platform: 'twitter' | 'linkedin' | 'reddit',
  newsletterData: NewsletterData,
  newsletterUrl: string
): Promise<TwitterContent | LinkedInContent | RedditContent> {
  if (platform === 'twitter') {
    return generateTwitterContent(newsletterData, newsletterUrl);
  } else if (platform === 'reddit') {
    return generateRedditContent(newsletterData, newsletterUrl);
  } else {
    return generateLinkedInContent(newsletterData, newsletterUrl);
  }
}

/**
 * Parses structured data from a newsletter draft
 */
export function parseNewsletterStructuredData(structuredData: unknown): NewsletterData | null {
  if (!structuredData || typeof structuredData !== 'object') {
    return null;
  }

  const data = structuredData as Record<string, unknown>;

  return {
    title: (data.title as string) || '',
    summary: (data.summary as string) || '',
    type: ((data.type as string) === 'weekly' ? 'weekly' : 'daily') as 'daily' | 'weekly',
    items: (data.items as NewsletterItem[]) || [],
    takeaway: data.takeaway as string | undefined,
    stealThisWeek: data.stealThisWeek as NewsletterData['stealThisWeek'],
    patternToKnow: data.patternToKnow as NewsletterData['patternToKnow'],
  };
}

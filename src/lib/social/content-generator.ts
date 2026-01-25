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

interface GeneratedSocialContent {
  twitter: TwitterContent;
  linkedin: LinkedInContent;
}

/**
 * Generates social media content for both Twitter/X and LinkedIn
 * from newsletter structured data
 */
export async function generateSocialContent(
  newsletterData: NewsletterData,
  newsletterUrl: string
): Promise<GeneratedSocialContent> {
  const [twitterContent, linkedInContent] = await Promise.all([
    generateTwitterContent(newsletterData, newsletterUrl),
    generateLinkedInContent(newsletterData, newsletterUrl),
  ]);

  return {
    twitter: twitterContent,
    linkedin: linkedInContent,
  };
}

/**
 * Generates Twitter/X content from newsletter data
 * Creates a thread if there are 3+ items, otherwise a single tweet
 */
export async function generateTwitterContent(
  newsletterData: NewsletterData,
  newsletterUrl: string
): Promise<TwitterContent> {
  const isThread = newsletterData.items.length >= 3;

  const prompt = isThread
    ? buildTwitterThreadPrompt(newsletterData, newsletterUrl)
    : buildTwitterSinglePrompt(newsletterData, newsletterUrl);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
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
    // Extract JSON from the response (may be wrapped in markdown code blocks)
    const jsonMatch = content.text.match(/```json\n?([\s\S]*?)\n?```/) ||
                      content.text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content.text;
    const parsed = JSON.parse(jsonStr);

    if (isThread) {
      return {
        content: parsed.hookTweet,
        threadContent: parsed.thread,
        hashtags: parsed.hashtags || [],
      };
    } else {
      return {
        content: parsed.tweet,
        hashtags: parsed.hashtags || [],
      };
    }
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
    model: 'claude-sonnet-4-20250514',
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

function buildTwitterSinglePrompt(data: NewsletterData, url: string): string {
  const itemsList = data.items
    .map((item) => `- ${item.product}: ${item.headline}`)
    .join('\n');

  return `You are a social media expert for an AI+UX design newsletter. Create a single engaging tweet (max 280 characters) about today's newsletter.

Newsletter Title: ${data.title}
Summary: ${data.summary}
Type: ${data.type}

Key items covered:
${itemsList}

${data.takeaway ? `Today's Takeaway: ${data.takeaway}` : ''}

Newsletter URL: ${url}

Requirements:
- Maximum 280 characters (including spaces and punctuation)
- Create curiosity and encourage clicks
- Professional but engaging tone
- Include the URL
- Suggest 2-3 relevant hashtags (not included in character count)

Respond with JSON only:
{
  "tweet": "Your tweet text here including the URL",
  "hashtags": ["hashtag1", "hashtag2"]
}`;
}

function buildTwitterThreadPrompt(data: NewsletterData, url: string): string {
  const itemsList = data.items
    .map((item, i) => `${i + 1}. ${item.product}: ${item.headline} - ${item.description}`)
    .join('\n');

  return `You are a social media expert for an AI+UX design newsletter. Create an engaging Twitter thread about today's newsletter.

Newsletter Title: ${data.title}
Summary: ${data.summary}
Type: ${data.type}

Items to cover:
${itemsList}

${data.takeaway ? `Today's Takeaway: ${data.takeaway}` : ''}
${data.stealThisWeek ? `Steal This Week: ${data.stealThisWeek.product} - ${data.stealThisWeek.feature}` : ''}
${data.patternToKnow ? `Pattern to Know: ${data.patternToKnow.name} - ${data.patternToKnow.description}` : ''}

Newsletter URL: ${url}

Requirements:
1. Hook tweet (max 280 chars): Grab attention, create curiosity
2. Thread tweets (max 280 chars each): One insight per major item, keep it punchy
3. Closing tweet (max 280 chars): Key takeaway + link to full newsletter
4. Each tweet must be under 280 characters
5. Professional but engaging tone
6. Suggest 2-3 relevant hashtags for the hook tweet

Respond with JSON only:
{
  "hookTweet": "Your attention-grabbing first tweet",
  "thread": [
    "Tweet about first insight",
    "Tweet about second insight",
    "Tweet about third insight",
    "Closing tweet with takeaway and link: ${url}"
  ],
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
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
  2. Key insights (bullet points or short paragraphs)
  3. Call-to-action with link
- Professional, thoughtful tone
- Add value beyond just summarizing
- Suggest 3-5 relevant hashtags

Respond with JSON only:
{
  "post": "Your full LinkedIn post text here including the URL at the end",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4"]
}`;
}

/**
 * Regenerates content for a specific platform
 */
export async function regeneratePlatformContent(
  platform: 'twitter' | 'linkedin',
  newsletterData: NewsletterData,
  newsletterUrl: string
): Promise<TwitterContent | LinkedInContent> {
  if (platform === 'twitter') {
    return generateTwitterContent(newsletterData, newsletterUrl);
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

import Anthropic from '@anthropic-ai/sdk';
import { WRITING_RULES, cleanCopy } from './copy-rules';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface NewsletterItem {
  product: string;
  headline: string;
  description: string;
  sourceUrl: string;
  patternSlug?: string;
  /** Per-story "Designer's Takeaway" (daily format since Oct 2026). */
  designerTakeaway?: string;
}

export interface NewsletterData {
  title: string;
  summary: string;
  type: 'daily' | 'weekly';
  items: NewsletterItem[];
  /** Today's Idea / This Week's Idea. Stored as structuredData.takeaway = { title, body }. */
  idea?: { title: string; body: string; patternSlug?: string };
  /** Pre-Oct 2026 issues stored the takeaway as a plain string. */
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
  /** Pattern drawing the issue's navy band used; the social images reuse it. */
  bandSlug?: string;
}

interface TwitterContent {
  content: string; // Hook tweet: the drafted take
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

/** The issue as plain text for a prompt: stories with their takeaways, then the idea. */
export function buildIssueContext(data: NewsletterData): string {
  const stories = data.items
    .map((item, i) => {
      const takeaway = item.designerTakeaway ? `\n   Designer's Takeaway: ${item.designerTakeaway}` : '';
      return `${i + 1}. ${item.product}: ${item.headline}. ${item.description}${takeaway}`;
    })
    .join('\n');
  const idea = data.idea
    ? `\n\n${data.type === 'weekly' ? "This Week's Idea" : "Today's Idea"}: ${data.idea.title}. ${data.idea.body}`
    : data.takeaway
      ? `\n\nTakeaway: ${data.takeaway}`
      : '';
  const extras = [
    data.stealThisWeek ? `Featured: ${data.stealThisWeek.product}, ${data.stealThisWeek.feature}` : '',
    data.patternToKnow ? `Pattern: ${data.patternToKnow.name}, ${data.patternToKnow.description}` : '',
  ].filter(Boolean);
  return `Title: ${data.title}
Summary: ${data.summary}

Stories:
${stories}${idea}${extras.length ? `\n\n${extras.join('\n')}` : ''}`;
}

function parseJson(text: string): Record<string, unknown> {
  const match = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[1] || match[0] : text);
}

/**
 * The take: one or two sentences of opinion that open both the LinkedIn post and
 * the X thread, drafted from Today's Idea and the stories' Designer's Takeaways.
 * Imran reviews and edits it in the Social tab. It states a view on the news and
 * never claims an experience (see WRITING_RULES).
 */
export async function generateTake(newsletterData: NewsletterData): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    system:
      "You write the opening line of a designer's daily social post about AI product news. Plain, specific and opinionated, in the voice of a senior product designer.",
    messages: [
      {
        role: 'user',
        content: `${buildIssueContext(newsletterData)}

Write the take: one or two sentences (under 240 characters) stating what designers should conclude from today's issue. Build it from the idea and the Designer's Takeaways. Name the concrete thing, not the theme. It must make sense on its own as the first tweet of a thread.

${WRITING_RULES}

Respond with JSON only: {"take": "..."}`,
      },
    ],
  });
  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type from Claude');
  try {
    const take = parseJson(content.text).take;
    if (typeof take === 'string' && take.trim()) return cleanCopy(take);
  } catch (error) {
    console.error('Failed to parse take:', error);
  }
  return cleanCopy(newsletterData.idea?.title || newsletterData.title);
}

/**
 * Generates the X thread, LinkedIn post and Reddit post for one issue. The take is
 * drafted first so both social posts open with the same line.
 */
export async function generateSocialContent(
  newsletterData: NewsletterData,
  newsletterUrl: string
): Promise<GeneratedSocialContent> {
  const take = await generateTake(newsletterData);
  const [twitterContent, linkedInContent, redditContent] = await Promise.all([
    generateTwitterContent(newsletterData, newsletterUrl, take),
    generateLinkedInContent(newsletterData, newsletterUrl, take),
    generateRedditContent(newsletterData, newsletterUrl),
  ]);

  return {
    twitter: twitterContent,
    linkedin: linkedInContent,
    reddit: redditContent,
  };
}

/**
 * Generates the X thread: the take as the hook tweet, one opinion per story, then
 * a closing tweet with the issue link.
 */
export async function generateTwitterContent(
  newsletterData: NewsletterData,
  newsletterUrl: string,
  take?: string
): Promise<TwitterContent> {
  const hook = take ?? (await generateTake(newsletterData));
  const prompt = buildTwitterOpinionThreadPrompt(newsletterData, newsletterUrl, hook);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: `You are a senior product designer with clear opinions about AI products, writing for X. Each tweet is a standalone opinion about what a story means for designers, stated plainly.`,
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
    const parsed = parseJson(content.text);
    const thread = Array.isArray(parsed.thread)
      ? (parsed.thread as unknown[]).filter((t): t is string => typeof t === 'string')
      : [];
    return {
      content: hook,
      threadContent: thread.map(cleanCopy),
      hashtags: (parsed.hashtags as string[]) || [],
    };
  } catch (error) {
    console.error('Failed to parse Twitter content:', error);
    return {
      content: hook,
      threadContent: [`Today's issue: ${newsletterUrl}`],
      hashtags: ['AIUX', 'DesignPatterns'],
    };
  }
}

/**
 * Generates the LinkedIn post. The take is the opening paragraph.
 */
export async function generateLinkedInContent(
  newsletterData: NewsletterData,
  newsletterUrl: string,
  take?: string
): Promise<LinkedInContent> {
  const opening = take ?? (await generateTake(newsletterData));
  const prompt = buildLinkedInPrompt(newsletterData, newsletterUrl, opening);

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
    const parsed = parseJson(content.text);
    return {
      // The take always leads, whatever the model did with its own opening.
      content: `${opening}\n\n${cleanCopy(String(parsed.post ?? ''))}`.trim(),
      hashtags: (parsed.hashtags as string[]) || [],
    };
  } catch (error) {
    console.error('Failed to parse LinkedIn content:', error);
    return {
      content: `${opening}\n\n${cleanCopy(newsletterData.summary)}\n\nToday's issue: ${newsletterUrl}`,
      hashtags: ['AIUX', 'DesignPatterns', 'ProductDesign'],
    };
  }
}

function buildTwitterOpinionThreadPrompt(data: NewsletterData, url: string, hook: string): string {
  const storyCount = data.items.length;

  return `Here is today's AI UX newsletter:

${buildIssueContext(data)}

The thread's first tweet is already written. It is the author's take:
"${hook}"

Write the rest of the thread for X:

1. One tweet per story (${storyCount} tweets). For EACH story, one tweet under 280 characters with a clear opinion about what it MEANS for designers and product builders, not a recap of what happened. Use the story's Designer's Takeaway as the starting point. Each tweet must make sense on its own.

2. A closing tweet that names the one thing to do this week, ending with the issue link: ${url}

Rules:
- Every tweet under 280 characters
- Start each tweet with the opinion, not the news event
- No "here's what happened", "let's break it down" or thread emoji
- Suggest 2-3 relevant hashtags (kept out of the tweets)

${WRITING_RULES}

Example of a BAD story tweet:
"Google announced Gemini 2.0 with impressive multimodal capabilities and agentic features."

Example of a GOOD story tweet:
"Gemini as an agent platform means the next interface is a worker you supervise. Design teams should start on supervision UX: what the agent is doing, and how to stop it."

Respond with JSON only:
{
  "thread": [
    "Opinion tweet about story 1",
    "Opinion tweet about story 2",
    "Closing tweet with the one thing to do and the link"
  ],
  "hashtags": ["hashtag1", "hashtag2"]
}`;
}

function buildRedditPrompt(data: NewsletterData, url: string): string {
  return `Here is today's AI UX newsletter content:

${buildIssueContext(data)}

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

function buildLinkedInPrompt(data: NewsletterData, url: string, opening: string): string {
  return `You write LinkedIn posts for a senior product designer who runs an AI UX newsletter. Write today's post from the issue below.

${buildIssueContext(data)}

Issue URL: ${url}

The post's opening paragraph is already written. It is the author's take:
"${opening}"

Write everything AFTER that opening. Do not repeat or rephrase it.

Requirements:
- 700-1100 characters for your part
- Two or three short paragraphs or a short list: what happened in the stories that back the take, and what a designer should do about it. Use the Designer's Takeaways.
- End with one line pointing to the full issue, with the URL
- Professional, plain and specific. Add value beyond summarising.
- Suggest 3-5 relevant hashtags (kept out of the post text)

${WRITING_RULES}

Respond with JSON only:
{
  "post": "Everything after the opening, including the URL at the end",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
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
    const parsed = parseJson(content.text);

    return {
      title: cleanCopy(String(parsed.title ?? '')),
      content: cleanCopy(String(parsed.body ?? '')),
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
 * Parses structured data from a newsletter draft. Handles both shapes of
 * `takeaway`: the Oct 2026 `{ title, body }` idea, and the older plain string.
 */
export function parseNewsletterStructuredData(structuredData: unknown): NewsletterData | null {
  if (!structuredData || typeof structuredData !== 'object') {
    return null;
  }

  const data = structuredData as Record<string, unknown>;
  const rawTakeaway = data.takeaway;
  const idea =
    rawTakeaway && typeof rawTakeaway === 'object' && typeof (rawTakeaway as { title?: unknown }).title === 'string'
      ? (rawTakeaway as NewsletterData['idea'])
      : undefined;

  return {
    title: (data.title as string) || '',
    summary: (data.summary as string) || '',
    type: ((data.type as string) === 'weekly' ? 'weekly' : 'daily') as 'daily' | 'weekly',
    items: (data.items as NewsletterItem[]) || [],
    idea,
    takeaway: typeof rawTakeaway === 'string' ? rawTakeaway : undefined,
    stealThisWeek: data.stealThisWeek as NewsletterData['stealThisWeek'],
    patternToKnow: data.patternToKnow as NewsletterData['patternToKnow'],
    bandSlug: typeof data.bandSlug === 'string' ? data.bandSlug : undefined,
  };
}

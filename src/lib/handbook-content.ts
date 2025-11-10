/**
 * 6 Essential AI Design Patterns - Content Structure
 * Visual-first design: Screenshots + minimal text
 * Designed for designers who visualize, not read
 */

export interface HandbookSection {
  title: string;
  subtitle?: string;
  content: string;
  icon?: string;
}

export const handbookContent = {
  meta: {
    title: "6 Essential AI Design Patterns",
    subtitle: "Proven patterns for designing human-centered AI interactions",
    version: "2.0",
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  },

  sections: {
    cover: {
      title: "6 Essential AI Design Patterns",
      subtitle: "Proven patterns for designing human-centered AI interactions",
      tagline: "Learn when, where, and how to add AI without overwhelming users",
    },

    introduction: {
      title: "The Problem",
      content: `Every app has an "Ask AI" button. Users tune it out.

This handbook shows 6 proven patterns from Apple, Google, GitHub, and Figma for AI that users actually want.

**When to use AI. When not to. How to do it right.**`,
    },

    pattern1: {
      title: "Pattern 1: Contextual Assistance",
      subtitle: "Help users when they're actually stuck, not when you think they might be",
      content: `**The Idea**
The best AI help is invisible until needed. Watch for signals. A pause, a mistake, a search. Offer suggestions at exactly that moment, then disappear if ignored. Like a helpful colleague who notices you're stuck, makes one suggestion, and steps back. Not someone interrupting every five minutes.

This respects user autonomy and keeps them in flow. Detect the signal, make the suggestion, respect the choice.

**When to Use**
<div class="decision-tree simple">
  <div class="tree-check">
    <div class="check-icon">✓</div>
    <div class="check-text">User is paused, stuck, or searching</div>
  </div>
  <div class="tree-check">
    <div class="check-icon">✓</div>
    <div class="check-text">Help is relevant to the current moment</div>
  </div>
  <div class="tree-check">
    <div class="check-icon">✓</div>
    <div class="check-text">User can dismiss or ignore it</div>
  </div>
  <div class="tree-result success">Use this pattern</div>
</div>

**Products Doing It Right**
Gmail Smart Compose • Suggests text when you pause writing
GitHub Copilot • Suggests code when you pause typing
Notion AI • Offers help in relevant moments

**DO ✓ | DON'T ✗**
Detect signals: pauses, mistakes, searches | "Ask AI" button everywhere
Offer as suggestion (not requirement) | Help even when user is performing well
Disappear if ignored | Force interaction

**Key Insight**
Invisible until needed. Clear when presented. Gone if rejected.`,
    },

    pattern2: {
      title: "Pattern 2: Confidence Visualization",
      subtitle: "Show certainty levels so users know when to trust AI results",
      content: `**The Idea**
AI can be wrong. Users forgive wrong answers if they see them coming. Show how sure you are. "94% confident," "42% sure," or "uncertain." This transforms trust from "Does the AI know?" to "Do I agree with its confidence level?"

Users can then decide: Trust it, verify it, or skip it. Different domains need different thresholds. 87% for medical diagnosis? Risky. For detection tasks? Good. Let users see the number and decide.

**When to Use**
<div class="decision-tree simple">
  <div class="tree-check">
    <div class="check-icon">✓</div>
    <div class="check-text">AI result has meaningful certainty variations</div>
  </div>
  <div class="tree-check">
    <div class="check-icon">✓</div>
    <div class="check-text">Users need to evaluate trustworthiness</div>
  </div>
  <div class="tree-check">
    <div class="check-icon">✓</div>
    <div class="check-text">High-stakes decisions or uncertain outcomes</div>
  </div>
  <div class="tree-result success">Use this pattern</div>
</div>

**Products Doing It Right**
GPTZero • Shows confidence levels with visual gauges for AI detection
AWS Rekognition • Displays confidence percentages for detected objects and faces

**DO ✓ | DON'T ✗**
Show confidence as %, labels, or visuals | Hide uncertainty
Explain what confidence means at each level | Treat 75% and 99% confidence the same
Let users make informed decisions | Show confidence but no explanation

**Key Insight**
Users forgive wrong answers but hate being misled. Transparency builds trust even in failure.`,
    },

    pattern3: {
      title: "Pattern 3: Error Recovery",
      subtitle: "How to handle failures so users stay confident",
      content: `**The Idea**
AI will fail. The question is how you handle it. Be honest about what failed. "Server at capacity," not "Error 503." Explain why and give recovery options. Users don't mind failures. They mind feeling helpless.

Failures with clear recovery paths actually build trust. ChatGPT's "at capacity" message tells users the system is honest about limits. Silent failures make it seem broken. Show what failed, explain why, and let users choose the next step.

**When to Use**
<div class="decision-tree simple">
  <div class="tree-check">
    <div class="check-icon">✓</div>
    <div class="check-text">AI might fail or produce unexpected results</div>
  </div>
  <div class="tree-check">
    <div class="check-icon">✓</div>
    <div class="check-text">Users need clear explanation when it fails</div>
  </div>
  <div class="tree-check">
    <div class="check-icon">✓</div>
    <div class="check-text">Multiple recovery options are available</div>
  </div>
  <div class="tree-result success">Use this pattern</div>
</div>

**Products Doing It Right**
ChatGPT • "At capacity" with clear retry options
Grammarly • Shows explanations + dismissal options
Google • "Did you mean?" (ask, don't assume)

**DO ✓ | DON'T ✗**
Be honest about failure | Silent failures
Explain what went wrong | Generic errors ("Something went wrong")
Provide recovery options (retry, override, manual) | Auto-correct without telling
Learn from errors | No way to fix it

**Key Insight**
Users forgive wrong answers. They don't forgive feeling helpless.`,
    },

    pattern4: {
      title: "Pattern 4: Privacy-First Design",
      subtitle: "Make users feel safe sharing data with AI",
      content: `**The Idea**
Users don't hate AI. They hate surprise. Be transparent by default. "We collect location data to improve search. It stays encrypted on-device. Deleted after 30 days. Here's how to turn it off." Not hidden three menus deep. Not vague language.

Apple works because users know data stays on-device. DuckDuckGo works because users know they're not tracked. Transparency builds trust and gives you competitive advantage.

**When to Use**
<div class="decision-tree simple">
  <div class="tree-check">
    <div class="check-icon">✓</div>
    <div class="check-text">AI collects or processes user data</div>
  </div>
  <div class="tree-check">
    <div class="check-icon">✓</div>
    <div class="check-text">Users need to understand data usage</div>
  </div>
  <div class="tree-check">
    <div class="check-icon">✓</div>
    <div class="check-text">Users can control or opt out</div>
  </div>
  <div class="tree-result success">Use this pattern</div>
</div>

**Products Doing It Right**
Apple • AI runs on-device, not on servers
DuckDuckGo • Anonymous AI chat (no logs, no profiles)
Signal • End-to-end encrypted AI features

**DO ✓ | DON'T ✗**
Explain what data you collect and why | Vague language ("improve experience")
Get consent (ask first, don't assume) | Hidden settings
Show user controls for data | Impossible to opt out
Make deletion easy | Collecting data "because we can"
Be specific ("we keep location for 30 days") |

**Key Insight**
Privacy isn't sacrifice. It's competitive advantage. Users trust and use AI more when they feel in control.`,
    },

    pattern5: {
      title: "Pattern 5: Explainable AI",
      subtitle: "Show users why AI made its decision",
      content: `**The Idea**
Black boxes are untrustworthy. Show users why you made a decision or recommendation in plain language. Claude shows step-by-step thinking. Perplexity cites sources. Users can then verify, evaluate, and understand the reasoning.

Explainability isn't about showing all 47 factors. It's about highlighting the 2-3 most important ones and showing where information came from. Users trust AI more when they understand it, even if they sometimes disagree.

**When to Use**
<div class="decision-tree simple">
  <div class="tree-check">
    <div class="check-icon">✓</div>
    <div class="check-text">AI makes recommendations or decisions</div>
  </div>
  <div class="tree-check">
    <div class="check-icon">✓</div>
    <div class="check-text">Users need to evaluate the reasoning</div>
  </div>
  <div class="tree-check">
    <div class="check-icon">✓</div>
    <div class="check-text">You can explain in simple language</div>
  </div>
  <div class="tree-result success">Use this pattern</div>
</div>

**Products Doing It Right**
Claude • Shows step-by-step thinking and reasoning for each conclusion
Perplexity AI • Shows exact sources for verification of information
Hugging Face • Provides detailed model documentation and capabilities

**DO ✓ | DON'T ✗**
Explain in plain language (not technical jargon) | Black box output (no explanation)
Show top 2-3 reasons (not all 47 factors) | Wrong explanation (users notice)
Be accurate (users double-check) | Too long explanation (users don't read)
Enable control (can users adjust based on explanation?) | Obvious statement ("Search results for 'apple'")

**Key Insight**
Explanations build confidence. Users trust AI that shows its thinking, even when they disagree.`,
    },

    pattern6: {
      title: "Pattern 6: Progressive Disclosure",
      subtitle: "Show simple first, power later, never overwhelm",
      content: `**The Idea**
Beginners and power users have different needs. Don't show all options at once. Start with the core action. One clear button. Then reveal advanced features as users ask for them. Loom shows basic editing first, then AI features appear on demand. Google Docs reveals features as you use it.

Make the simple path obvious. Let power users find their tools. Same feature. Different complexity curves for different expertise levels.

**When to Use**
<div class="decision-tree simple">
  <div class="tree-check">
    <div class="check-icon">✓</div>
    <div class="check-text">Feature has beginner and advanced modes</div>
  </div>
  <div class="tree-check">
    <div class="check-icon">✓</div>
    <div class="check-text">Most users need simple version</div>
  </div>
  <div class="tree-check">
    <div class="check-icon">✓</div>
    <div class="check-text">Advanced options can be revealed on demand</div>
  </div>
  <div class="tree-result success">Use this pattern</div>
</div>

**Products Doing It Right**
Loom AI • Basic video editing first, advanced AI features on demand
Google Docs AI • Progressively reveals features like Smart Compose as you engage
Superhuman AI Email • Shows essential actions, reveals AI features as you explore

**DO ✓ | DON'T ✗**
Start with core task (one button, clear purpose) | Show all options at once
Show 80% features by default | Hide important features
Reveal advanced options when users are ready | Bury simple tasks in menus
Keep UI consistent across levels | Drastically change UI between beginner/expert

**Key Insight**
Expertise is earned. Give beginners a path forward. Power users get their tools. Same feature. Different curves.`,
    },

    conclusion: {
      title: "Next Steps",
      content: `You now have 6 patterns from the best AI products in the world.

**But here's the key:** These aren't features to bolt onto your product. They're *mindsets*.

Every time you add AI, ask:
✓ Is it contextually helpful? (Or just an "Ask AI" button?)
✓ Will users know when to trust it? (Or blindly accept?)
✓ What happens when it fails? (Design for recovery)
✓ Are we being transparent about data? (Or hiding it?)
✓ Can users understand why? (Or is it a black box?)
✓ Will this overwhelm beginners? (Or progressively empower?)

**The teams doing AI best—Apple, GitHub, Google—aren't rushing to add AI everywhere. They're being thoughtful about where it actually helps. They're respecting user intelligence and autonomy.**

That's your competitive advantage.

**Next Steps:**
1. **Pick one pattern** that matches your most pressing problem
2. **Design for that pattern** in your next feature
3. **Test with real users** to validate your approach
4. **Learn from feedback** and iterate
5. **Add another pattern** when you're ready

**Remember:** The goal isn't AI for AI's sake. The goal is creating products where AI feels like a helpful colleague, not a manipulative algorithm.

You have the patterns. You have the knowledge. Now go build something users will actually love. 🚀

---

**One More Thing:**
These 6 patterns work together. Confidence + Explainability = trust. Privacy-First + Error Recovery = safety. Contextual Assistance + Progressive Disclosure = usability.

The products that win aren't the ones with the most AI. They're the ones with the most thoughtful AI.

Be thoughtful. Be respectful. Be honest. And remember: your users will forgive AI mistakes if you handle them well. They'll forgive missing features if you're clear about it. They'll forgive complexity if you reveal it progressively.

Build with care. 🖤`,
    },

    resources: {
      title: "Learn More & Go Deeper",
      content: `**Real Product Studies:**
Visit aiuxdesign.guide to see interactive examples of all these patterns in action. See how Slack, Notion, GitHub, and others implement them.

**Additional Patterns:**
This handbook covers the 6 most critical patterns. Your site includes 24 total patterns. When you're ready to go deeper, explore:
• Ambient Intelligence for invisible AI
• Multimodal Interaction for natural input
• Selective Memory for user control
• Human-in-the-Loop for high-stakes decisions

**Build Skills:**
• Design for accessibility—your AI patterns must work for everyone
• Learn your AI's limitations—know what it can/can't do
• Study your users—different industries need different patterns
• Test constantly—user research beats assumptions every time

**Join the Community:**
Connect with other designers thinking about these problems. Share what you learn. Ask questions. Push back on the "add AI everywhere" trend.

**Final Truth:**
The best AI experiences feel like they're not there—until you need them. At that point, they're exactly what you wanted. That's the north star.

Build toward that. 🎯`,
    },
  },
};

/**
 * Generate product logo grid HTML
 * Creates a card layout with logo on left, name and description on right
 */
function generateLogoGrid(productLines: string[]): string {
  // Parse product info from lines like "Product Name • Description"
  const products = productLines
    .map(line => {
      const parts = line.split('•');
      return {
        name: parts[0].trim(),
        description: parts[1] ? parts[1].trim() : ''
      };
    })
    .filter(p => p.name.length > 0);

  if (products.length === 0) return '';

  let html = '<div class="logo-grid">';

  products.forEach(product => {
    const logoUrl = getProductLogoUrl(product.name);
    html += `
      <div class="product-card">
        <div class="product-card-logo">
          ${logoUrl ? `<img src="${logoUrl}" alt="${product.name}" class="product-logo">` : `<div class="logo-placeholder">${product.name.charAt(0)}</div>`}
        </div>
        <div class="product-card-content">
          <div class="product-card-name">${product.name}</div>
          ${product.description ? `<div class="product-card-description">${product.description}</div>` : ''}
        </div>
      </div>
    `;
  });

  html += '</div>';
  return html;
}

/**
 * Get product logo URL from product-logos mapping
 */
function getProductLogoUrl(productName: string): string {
  // Map display names to logo database names
  const productNameMap: Record<string, string> = {
    'Gmail Smart Compose': 'Gmail',
    'GitHub Copilot': 'Copilot',
    'Notion AI': 'Notion',
    'GPTZero': 'GPTZero',
    'AWS Rekognition': 'AWS',
    'ChatGPT': 'ChatGPT',
    'Grammarly': 'Grammarly',
    'Figma AI': 'Figma',
    'GitHub': 'GitHub',
    'Slack': 'Slack',
    'Claude': 'Claude',
    'Perplexity AI': 'Perplexity',
    'Hugging Face': 'Hugging',
    'Loom AI': 'Loom',
    'Google Docs AI': 'Google',
    'Superhuman AI Email': 'Superhuman',
  };

  const logoDbName = productNameMap[productName];
  if (!logoDbName) return '';

  // Reference to product logos from the main app
  const productLogos: Record<string, string> = {
    Google: 'google',
    GitHub: 'github',
    Notion: 'notion',
    ChatGPT: 'openai',
    Claude: 'anthropic',
    Figma: 'figma',
    Slack: 'slack',
    Gmail: 'gmail',
    Copilot: 'github',
    Loom: 'loom',
    Superhuman: '/images/logos/superhumanlogo.png',
    Grammarly: 'grammarly',
    Perplexity: 'https://cdn.simpleicons.org/perplexity',
    Hugging: 'huggingface',
    GPTZero: 'https://cdn.simpleicons.org/openai',
    AWS: 'amazonaws',
  };

  const slug = productLogos[logoDbName];
  if (!slug) return '';

  // If slug is already a full URL, return it directly
  if (slug.startsWith('http') || slug.startsWith('/')) {
    return slug;
  }

  // Otherwise build the Simple Icons CDN URL
  return `https://cdn.simpleicons.org/${slug}`;
}

/**
 * Process pattern content to create two-column layout with The Idea and Products Doing It Right
 */
function processPatternContent(content: string): string {
  const ideaSectionRegex = /\*\*The Idea\*\*([\s\S]*?)(?=\n\n\*\*)/;
  const productsSectionRegex = /\*\*Products Doing It Right\*\*([\s\S]*?)(?=\n\n\*\*|$)/;

  const ideaMatch = content.match(ideaSectionRegex);
  const productsMatch = content.match(productsSectionRegex);

  if (!ideaMatch || !productsMatch) {
    return content;
  }

  const ideaText = ideaMatch[1].trim();
  const productsText = productsMatch[1];
  const productLines = productsText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const logoGrid = generateLogoGrid(productLines);

  // Create two-column layout
  const twoColumnLayout = `<div class="pattern-two-column">
    <div class="pattern-column-left">
      <strong>The Idea</strong>
      <p>${ideaText}</p>
    </div>
    <div class="pattern-column-right">
      <strong>Products Doing It Right</strong>
      ${logoGrid}
    </div>
  </div>`;

  // Replace both sections with the two-column layout
  let result = content.replace(/\*\*The Idea\*\*([\s\S]*?)(?=\n\n\*\*)/, twoColumnLayout);
  result = result.replace(/\*\*Products Doing It Right\*\*([\s\S]*?)(?=\n\n\*\*|$)/, '');

  return result;
}

/**
 * Convert pipe-delimited markdown table to HTML table
 * Handles format: | Header 1 | Header 2 | and regular rows
 */
function markdownTableToHTML(content: string): string {
  const lines = content.split('\n');
  let result = content;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check if this line contains pipes (potential table row)
    if (line.includes('|')) {
      // Check if next line is also a pipe line (indicating table structure)
      const nextLine = lines[i + 1];
      if (nextLine && nextLine.includes('|')) {
        // Extract table rows starting from current line
        const tableRows = [line];
        let j = i + 1;

        while (j < lines.length && lines[j].includes('|')) {
          tableRows.push(lines[j]);
          j++;
        }

        // Convert to HTML table
        const tableHTML = convertToHTMLTable(tableRows);
        const tableMarkdown = tableRows.join('\n');
        result = result.replace(tableMarkdown, tableHTML);

        i = j;
        continue;
      }
    }

    i++;
  }

  return result;
}

/**
 * Convert table rows to HTML table
 */
function convertToHTMLTable(rows: string[]): string {
  const cells = rows.map(row =>
    row.split('|').map(cell => cell.trim()).filter(cell => cell)
  );

  if (cells.length === 0) return '';

  let html = '<table class="markdown-table">';

  // Add header row
  html += '<thead><tr>';
  cells[0].forEach(cell => {
    // Remove markdown bold syntax from headers
    const cleanedCell = cell.replace(/\*\*/g, '');
    html += `<th>${cleanedCell}</th>`;
  });
  html += '</tr></thead>';

  // Add body rows
  if (cells.length > 1) {
    html += '<tbody>';
    for (let i = 1; i < cells.length; i++) {
      html += '<tr>';
      cells[i].forEach(cell => {
        html += `<td>${cell}</td>`;
      });
      html += '</tr>';
    }
    html += '</tbody>';
  }

  html += '</table>';
  return html;
}

/**
 * Generate handbook as HTML for PDF conversion
 * Screen-optimized, brand-compliant (black & white)
 */
export function generateHandbookHTML(): string {
  const { meta, sections } = handbookContent;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${meta.title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          line-height: 1.6;
          color: #0d0d0d;
          background: #ffffff;
          font-size: 16px;
        }

        .section {
          max-width: 900px;
          margin: 0 auto;
          padding: 60px 40px;
          page-break-after: always;
        }

        /* Table Styling */
        .markdown-table {
          width: 100%;
          border-collapse: collapse;
          margin: 25px 0;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          overflow: hidden;
        }

        .markdown-table thead {
          background: transparent;
          border-bottom: 2px solid #0d0d0d;
        }

        .markdown-table th {
          padding: 14px 16px;
          text-align: left;
          font-weight: 600;
          color: #0d0d0d;
          font-size: 14px;
        }

        .markdown-table th:first-child {
          color: #10b981;
        }

        .markdown-table th:last-child {
          color: #ef4444;
        }

        .markdown-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #e5e7eb;
          color: #1f2937;
          font-size: 14px;
          line-height: 1.5;
        }

        .markdown-table tbody tr:last-child td {
          border-bottom: none;
        }

        .markdown-table tbody tr:nth-child(even) {
          background: #f9fafb;
        }

        .markdown-table tbody tr:hover {
          background: #f3f4f6;
        }

        /* Two-Column Pattern Layout */
        .pattern-two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin: 20px 0;
        }

        .pattern-column-left {
          padding-right: 20px;
        }

        .pattern-column-left strong {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #0d0d0d;
          margin-bottom: 10px;
        }

        .pattern-column-left p {
          font-size: 15px;
          color: #1f2937;
          line-height: 1.7;
          margin: 0;
        }

        .pattern-column-right {
          border-left: 1px solid #e5e7eb;
          padding-left: 20px;
        }

        .pattern-column-right strong {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #0d0d0d;
          margin-bottom: 12px;
        }

        @media (max-width: 768px) {
          .pattern-two-column {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .pattern-column-left {
            padding-right: 0;
          }

          .pattern-column-right {
            border-left: none;
            border-top: 1px solid #e5e7eb;
            padding-left: 0;
            padding-top: 20px;
          }
        }

        /* Product Card Grid Styling */
        .logo-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin: 0;
          padding: 0;
        }

        .product-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          background: #f9f9f9;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
        }

        .product-card-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: #ffffff;
          border-radius: 6px;
          padding: 6px;
          flex-shrink: 0;
          border: 1px solid #e5e7eb;
        }

        .product-logo {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          filter: grayscale(0%);
          transition: filter 0.2s ease;
        }

        .logo-placeholder {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #0d0d0d;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 16px;
        }

        .product-card-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .product-card-name {
          font-size: 13px;
          font-weight: 600;
          color: #0d0d0d;
          line-height: 1.3;
        }

        .product-card-description {
          font-size: 12px;
          color: #525252;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .product-card {
            padding: 10px;
            gap: 10px;
          }

          .product-card-logo {
            width: 40px;
            height: 40px;
          }

          .product-card-name {
            font-size: 12px;
          }

          .product-card-description {
            font-size: 11px;
          }
        }

        /* Decision Tree Styling */
        .decision-tree {
          margin: 25px 0;
          padding: 20px;
          background: #fafafa;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .decision-tree.simple {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .tree-check {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px;
          background: #ffffff;
          border-radius: 6px;
          border-left: 3px solid #10b981;
        }

        .check-icon {
          flex-shrink: 0;
          font-size: 18px;
          font-weight: 700;
          color: #10b981;
          min-width: 24px;
        }

        .check-text {
          font-size: 14px;
          color: #1f2937;
          line-height: 1.5;
        }

        .tree-result {
          padding: 12px 16px;
          background: #f0fdf4;
          border: 2px solid #10b981;
          border-radius: 6px;
          font-size: 14px;
          color: #166534;
          font-weight: 600;
          text-align: center;
        }

        .tree-result.success {
          background: #f0fdf4;
          border-color: #10b981;
          color: #166534;
        }

        .cover {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          background: #0d0d0d;
          color: #ffffff;
          min-height: 100vh;
          padding: 40px 20px;
        }

        .cover h1 {
          font-size: 48px;
          margin-bottom: 20px;
          font-weight: 700;
          line-height: 1.2;
        }

        .cover .subtitle {
          font-size: 24px;
          margin-bottom: 30px;
          font-weight: 400;
          line-height: 1.3;
          color: #ffffff;
        }

        .cover .tagline {
          font-size: 16px;
          max-width: 500px;
          line-height: 1.8;
          color: #ffffff;
        }

        .cover .meta {
          margin-top: 60px;
          font-size: 12px;
          color: #ffffff;
        }

        h2 {
          font-size: 32px;
          margin-bottom: 15px;
          margin-top: 0;
          color: #0d0d0d;
          font-weight: 700;
          line-height: 1.2;
        }

        .subtitle {
          font-size: 20px;
          color: #525252;
          margin-bottom: 30px;
          font-weight: 500;
        }

        h3 {
          font-size: 18px;
          margin: 25px 0 12px 0;
          color: #0d0d0d;
          font-weight: 600;
        }

        p {
          margin-bottom: 20px;
          line-height: 2.0;
          color: #1f2937;
        }

        strong {
          color: #0d0d0d;
          font-weight: 600;
        }

        em {
          color: #525252;
          font-style: italic;
        }

        ul, ol {
          margin: 15px 0 15px 25px;
          line-height: 1.8;
        }

        li {
          margin-bottom: 8px;
          color: #1f2937;
        }

        .check {
          color: #10b981;
          font-weight: 600;
        }

        .cross {
          color: #ef4444;
          font-weight: 600;
        }

        .highlight {
          background: #f5f5f5;
          padding: 20px;
          border-left: 4px solid #0d0d0d;
          margin: 20px 0;
          border-radius: 4px;
        }

        .footer {
          text-align: center;
          font-size: 12px;
          color: #737373;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .section-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 30px 0;
        }

        code {
          background: #f5f5f5;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
        }

        .images-container {
          margin: 40px 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .pattern-image {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 30px 0;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .pattern-image img {
          width: 100%;
          height: auto;
          border-radius: 4px;
          display: block;
          max-height: 400px;
          object-fit: contain;
        }

        .pattern-image-caption {
          font-size: 13px;
          color: #525252;
          font-style: italic;
        }

        blockquote {
          border-left: 4px solid #0d0d0d;
          padding-left: 20px;
          margin: 20px 0;
          font-style: italic;
          color: #525252;
        }

        .toc {
          background: #fafafa;
          padding: 20px;
          border-radius: 4px;
          margin: 20px 0;
        }

        .pattern-nav {
          display: flex;
          justify-content: space-between;
          margin: 30px 0;
          padding: 20px 0;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .section {
            padding: 20px 15px;
          }

          h2 {
            font-size: 24px;
          }

          .cover h1 {
            font-size: 32px;
          }
        }
      </style>
    </head>
    <body>
      <!-- Cover Page -->
      <div class="section cover">
        <h1>${sections.cover.title}</h1>
        <p class="subtitle">${sections.cover.subtitle}</p>
        <p class="tagline">${sections.cover.tagline}</p>
        <div class="meta">
          <p>${meta.date} • Version ${meta.version}</p>
        </div>
      </div>

      <!-- Introduction -->
      <div class="section">
        <h2>${sections.introduction.title}</h2>
        ${sections.introduction.content.split('\n\n').map(p => `<p>${p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</p>`).join('')}
        <div class="footer">aiuxdesign.guide</div>
      </div>

      <!-- Pattern 1 -->
      <div class="section">
        <h2>${sections.pattern1.title}</h2>
        <p class="subtitle">${sections.pattern1.subtitle}</p>
        ${(() => {
          let content = processPatternContent(sections.pattern1.content);
          content = markdownTableToHTML(content);
          return content.split('\n\n').map(p => p.includes('<table') || p.includes('<div class="logo-grid') || p.includes('<div class="pattern-two-column') || p.includes('<div class="decision-tree') ? p : `<p>${p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/❌/g, '<span class="cross">✗</span>').replace(/✓/g, '<span class="check">✓</span>').replace(/☐/g, '<input type="checkbox" disabled>').replace(/\n/g, '<br>')}</p>`).join('');
        })()}
        <div class="images-container">
          <div class="pattern-image">
            <img src="/images/examples/Smart-compose_Taco_Tuesday.gif" alt="Gmail Smart Compose">
            <p class="pattern-image-caption">Gmail Smart Compose suggests text when you pause writing</p>
          </div>
          <div class="pattern-image">
            <img src="/images/examples/github-copilot-highlighting.gif" alt="GitHub Copilot">
            <p class="pattern-image-caption">GitHub Copilot suggests code completions in context</p>
          </div>
        </div>
        <div class="footer">aiuxdesign.guide</div>
      </div>

      <!-- Pattern 2 -->
      <div class="section">
        <h2>${sections.pattern2.title}</h2>
        <p class="subtitle">${sections.pattern2.subtitle}</p>
        ${(() => {
          let content = processPatternContent(sections.pattern2.content);
          content = markdownTableToHTML(content);
          return content.split('\n\n').map(p => p.includes('<table') || p.includes('<div class="logo-grid') || p.includes('<div class="pattern-two-column') || p.includes('<div class="decision-tree') ? p : `<p>${p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/❌/g, '<span class="cross">✗</span>').replace(/✓/g, '<span class="check">✓</span>').replace(/☐/g, '<input type="checkbox" disabled>').replace(/\n/g, '<br>')}</p>`).join('');
        })()}
        <div class="images-container">
          <div class="pattern-image">
            <img src="/images/examples/gptzero-high-confidence.png" alt="GPTZero Confidence Levels">
            <p class="pattern-image-caption">GPTZero shows confidence levels with visual gauges and percentages</p>
          </div>
          <div class="pattern-image">
            <img src="/images/examples/aws-rekognition-confidence.png" alt="AWS Rekognition">
            <p class="pattern-image-caption">AWS Rekognition displays confidence % for each detection</p>
          </div>
        </div>
        <div class="footer">aiuxdesign.guide</div>
      </div>

      <!-- Pattern 3 -->
      <div class="section">
        <h2>${sections.pattern3.title}</h2>
        <p class="subtitle">${sections.pattern3.subtitle}</p>
        ${(() => {
          let content = processPatternContent(sections.pattern3.content);
          content = markdownTableToHTML(content);
          return content.split('\n\n').map(p => p.includes('<table') || p.includes('<div class="logo-grid') || p.includes('<div class="pattern-two-column') || p.includes('<div class="decision-tree') ? p : `<p>${p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/❌/g, '<span class="cross">✗</span>').replace(/✓/g, '<span class="check">✓</span>').replace(/☐/g, '<input type="checkbox" disabled>').replace(/\n/g, '<br>')}</p>`).join('');
        })()}
        <div class="images-container">
          <div class="pattern-image">
            <img src="/images/examples/chatgpt-capacity-error.png" alt="ChatGPT Error Recovery">
            <p class="pattern-image-caption">ChatGPT shows clear error messages with retry options</p>
          </div>
          <div class="pattern-image">
            <img src="/images/examples/grammarly-error-recovery.png" alt="Grammarly Error Recovery">
            <p class="pattern-image-caption">Grammarly provides explanations and fallback functionality</p>
          </div>
        </div>
        <div class="footer">aiuxdesign.guide</div>
      </div>

      <!-- Pattern 4 -->
      <div class="section">
        <h2>${sections.pattern4.title}</h2>
        <p class="subtitle">${sections.pattern4.subtitle}</p>
        ${(() => {
          let content = processPatternContent(sections.pattern4.content);
          content = markdownTableToHTML(content);
          return content.split('\n\n').map(p => p.includes('<table') || p.includes('<div class="logo-grid') || p.includes('<div class="pattern-two-column') || p.includes('<div class="decision-tree') ? p : `<p>${p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/❌/g, '<span class="cross">✗</span>').replace(/✓/g, '<span class="check">✓</span>').replace(/☐/g, '<input type="checkbox" disabled>').replace(/\n/g, '<br>')}</p>`).join('');
        })()}
        <div class="images-container">
          <div class="pattern-image">
            <img src="/images/examples/privacyfirst-apple.webp" alt="Apple Privacy">
            <p class="pattern-image-caption">Apple's on-device intelligence keeps data private</p>
          </div>
          <div class="pattern-image">
            <img src="/images/examples/duckduckgoprivacyfirst.gif" alt="DuckDuckGo Privacy">
            <p class="pattern-image-caption">DuckDuckGo anonymous AI chat without tracking</p>
          </div>
        </div>
        <div class="footer">aiuxdesign.guide</div>
      </div>

      <!-- Pattern 5 -->
      <div class="section">
        <h2>${sections.pattern5.title}</h2>
        <p class="subtitle">${sections.pattern5.subtitle}</p>
        ${(() => {
          let content = processPatternContent(sections.pattern5.content);
          content = markdownTableToHTML(content);
          return content.split('\n\n').map(p => p.includes('<table') || p.includes('<div class="logo-grid') || p.includes('<div class="pattern-two-column') || p.includes('<div class="decision-tree') ? p : `<p>${p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/❌/g, '<span class="cross">✗</span>').replace(/✓/g, '<span class="check">✓</span>').replace(/☐/g, '<input type="checkbox" disabled>').replace(/\n/g, '<br>')}</p>`).join('');
        })()}
        <div class="images-container">
          <div class="pattern-image">
            <img src="/images/examples/claudethinking.gif" alt="Claude AI step-by-step reasoning">
            <p class="pattern-image-caption">Claude shows step-by-step thinking and reasoning for conclusions</p>
          </div>
          <div class="pattern-image">
            <img src="/images/examples/perplexity-attribution.gif" alt="Perplexity AI source attribution">
            <p class="pattern-image-caption">Perplexity shows exact sources for verification</p>
          </div>
        </div>
        <div class="footer">aiuxdesign.guide</div>
      </div>

      <!-- Pattern 6 -->
      <div class="section">
        <h2>${sections.pattern6.title}</h2>
        <p class="subtitle">${sections.pattern6.subtitle}</p>
        ${(() => {
          let content = processPatternContent(sections.pattern6.content);
          content = markdownTableToHTML(content);
          return content.split('\n\n').map(p => p.includes('<table') || p.includes('<div class="logo-grid') || p.includes('<div class="pattern-two-column') || p.includes('<div class="decision-tree') ? p : `<p>${p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/❌/g, '<span class="cross">✗</span>').replace(/✓/g, '<span class="check">✓</span>').replace(/☐/g, '<input type="checkbox" disabled>').replace(/\n/g, '<br>')}</p>`).join('');
        })()}
        <div class="images-container">
          <div class="pattern-image">
            <img src="/images/examples/figma-ai-design.gif" alt="Figma AI Design Progression">
            <p class="pattern-image-caption">Figma AI: Simple generate → Customize options → Advanced settings</p>
          </div>
          <div class="pattern-image">
            <img src="/images/examples/claudeprogressiveenhancement.gif" alt="Claude Progressive Enhancement">
            <p class="pattern-image-caption">Claude shows simple response first, then detailed options</p>
          </div>
        </div>
        <div class="footer">aiuxdesign.guide</div>
      </div>

      <!-- Conclusion -->
      <div class="section">
        <h2>${sections.conclusion.title}</h2>
        ${sections.conclusion.content.split('\n\n').map(p => `<p>${p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/✓/g, '<span class="check">✓</span>').replace(/🚀/g, '').replace(/🖤/g, '').replace(/\n/g, '<br>')}</p>`).join('')}
        <div class="footer">aiuxdesign.guide</div>
      </div>

      <!-- Resources -->
      <div class="section">
        <h2>${sections.resources.title}</h2>
        ${sections.resources.content.split('\n\n').map(p => `<p>${p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/🎯/g, '').replace(/\n/g, '<br>')}</p>`).join('')}
        <div class="footer">aiuxdesign.guide</div>
      </div>
    </body>
    </html>
  `;
}

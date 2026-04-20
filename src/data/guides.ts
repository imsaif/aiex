import { Guide, GuideFilter } from '@/types';

/**
 * Complete Claude Code Learning Path Course for Designers
 * Combines all lessons from Setup, First Prototype, GitHub, and Best Practices
 * into one comprehensive learning experience with 18 sequential lessons.
 */
export const guides: Guide[] = [
  {
    id: 'claude-code-course',
    slug: 'claude-code-learning-path',
    title: "Claude Code Guide for Designers",
    description:
      'Master Claude Code for design and prototyping with AI-powered assistance. Now with bidirectional Figma MCP integration — design-to-code and code-to-design.',
    excerpt:
      'Your complete Claude Code education: 23 sequential lessons covering setup, bidirectional Figma workflows, prototyping, version control, and professional best practices. Go from zero to confident in one comprehensive course.',
    tool: 'Claude Code',
    useCase: 'Learning Path',
    skillLevel: 'Beginner',
    designDomain: 'UX Design',
    readTime: 39,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    lastUpdatedDate: '2026-02-18',
    status: 'ready',
    thumbnail: 'https://commons.wikimedia.org/wiki/Special:FilePath/Claude_AI_symbol.svg',
    tags: ['claude-code', 'learning-path', 'getting-started', 'course', 'comprehensive', 'figma-mcp', 'design-to-code'],
    lessons: [
      // Setup Lessons (1-3)
      {
        id: 'lesson-1',
        title: 'Get Your Anthropic API Key',
        duration: 2,
        order: 1,
        module: 'setup',
        sections: [
          {
            type: 'intro',
            content: 'Claude Code needs an API key to connect to the Claude AI service. Your API key is like a secret password that tells Anthropic it\'s really you.',
            icon: 'info',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Create an Anthropic Account',
                content: [
                  'Go to console.anthropic.com in your web browser',
                  'Click "Sign up" in the top right',
                  'Create an account using your email and password',
                  'Check your email for a verification link and click it',
                ],
                icon: 'user',
              },
              {
                number: 2,
                title: 'Generate Your API Key',
                content: [
                  'Once logged in, find "API Keys" in the left menu',
                  'Click "Create Key"',
                  'Name it something like "Claude Code for Design"',
                  'Click "Create"',
                  'Copy your key immediately and save it somewhere safe (like a password manager)',
                ],
                icon: 'key',
              },
            ],
          },
          {
            type: 'image',
            src: '/images/guides/claude-code-learning-path/lesson-1/claudeapikey.gif',
            alt: 'Anthropic Console API Key Screenshot',
            label: 'Anthropic Console showing where to create and copy API keys',
          },
          {
            type: 'callout',
            calloutType: 'warning',
            title: 'Keep Your Key Secure',
            content:
              'Your API key is like a password. Never share it with anyone, post it in Slack/email/public docs, commit it to GitHub, or store it in plain text files in your projects.',
            icon: 'warning',
          },
          {
            type: 'completion',
            title: 'API key ready',
            items: [
              'Created an Anthropic Console account',
              'Generated and copied your first API key',
              'Stored it somewhere safe and out of any code files',
            ],
            message: 'Next up: getting Node.js running so Claude Code has somewhere to live.',
          },
        ],
      },
      {
        id: 'lesson-2',
        title: 'Install Node.js',
        duration: 2,
        order: 2,
        module: 'setup',
        sections: [
          {
            type: 'intro',
            content: 'Node.js is what lets your computer actually run Claude Code. If you\'ve never installed it before, that\'s fine — most designers haven\'t. You\'ll either confirm it\'s already there or grab it in two minutes.',
            icon: 'download',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Check if You Already Have Node.js',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'On Mac',
                content: [
                  'Press Command + Space, type "Terminal", and hit Enter',
                  'Paste this and press Enter: node --version',
                  'If you see a version number, you\'re done with this section!',
                ],
                icon: 'monitor',
              },
              {
                number: 2,
                title: 'On Windows',
                content: [
                  'Click the Windows logo, type "Command Prompt", and hit Enter',
                  'Paste this and press Enter: node --version',
                  'If you see a version number, skip to the next lesson!',
                ],
                icon: 'monitor',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Install Node.js (If You Need It)',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Go to nodejs.org',
                content: 'Visit the official Node.js website',
                icon: 'download',
              },
              {
                number: 2,
                title: 'Download the "LTS" version',
                content: 'This is the stable, recommended version for production use',
                icon: 'download',
              },
              {
                number: 3,
                title: 'Run the installer and follow the instructions',
                content: 'Just click "Next" on everything - the defaults are perfect for you',
                icon: 'cog',
              },
              {
                number: 4,
                title: 'Verify the installation',
                content: 'Open Terminal/Command Prompt again and run node --version to confirm it worked',
                icon: 'check',
              },
            ],
          },
          {
            type: 'completion',
            title: 'Node.js is in place',
            items: [
              'Checked whether Node.js was already installed',
              'Downloaded the LTS version from nodejs.org if needed',
              'Verified the install with node --version',
            ],
            message: 'One more install and your environment is ready. Next: Claude Code itself.',
          },
        ],
      },
      {
        id: 'lesson-3',
        title: 'Install Claude Code',
        duration: 2,
        order: 3,
        module: 'setup',
        sections: [
          {
            type: 'intro',
            content: 'Now that Node.js is in place, getting Claude Code is a single command. By the end of this lesson the CLI will be installed, verified, and waiting for your first prompt.',
            icon: 'terminal',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Open Terminal/Command Prompt',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'On Mac',
                content: 'Press Command + Space, type "Terminal", and hit Enter',
                icon: 'terminal',
              },
              {
                number: 2,
                title: 'On Windows',
                content: 'Click Windows logo, type "Command Prompt", and hit Enter',
                icon: 'terminal',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Install Claude Code',
          },
          {
            type: 'text',
            content: 'Copy and paste this command, then press Enter:',
          },
          {
            type: 'code',
            code: 'npm install -g claude-code',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'callout',
            calloutType: 'info',
            content: 'This takes 1-2 minutes. You\'ll see lots of text in the terminal—that\'s completely normal and means it\'s working!',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Verify Installation',
          },
          {
            type: 'text',
            content: 'Run this command to confirm Claude Code is installed:',
          },
          {
            type: 'code',
            code: 'claude --version',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'text',
            content: 'You should see a version number. If you do, you\'re ready to move on!',
          },
          {
            type: 'completion',
            title: 'Setup Complete!',
            items: [
              'An Anthropic account with an API key',
              'Node.js installed on your computer',
              'Claude Code installed and verified',
            ],
            message: 'You\'re ready to start building! Let\'s move on to creating your first prototype.',
          },
        ],
      },
      // Figma ↔ Code Lessons (4-8)
      {
        id: 'lesson-19',
        title: 'Set Up Figma MCP',
        duration: 2,
        order: 4,
        module: 'figma',
        sections: [
          {
            type: 'intro',
            content: 'The Figma MCP server connects your Figma designs directly to Claude Code. Instead of describing your designs in words, Claude Code can read your actual Figma files — components, colors, spacing, layout — and generate accurate code from them.',
            icon: 'info',
          },
          {
            type: 'callout',
            calloutType: 'info',
            title: 'What is MCP?',
            content: 'MCP (Model Context Protocol) is a standard that lets AI tools like Claude Code connect to external services. The Figma MCP server gives Claude Code direct access to your design files.',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Option A: Desktop MCP Server (Recommended)',
          },
          {
            type: 'text',
            content: 'The desktop server runs locally on your computer and lets you select frames directly in the Figma app. This is the best option for most designers.',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Update the Figma Desktop App',
                content: 'Open the Figma desktop app and make sure it\'s updated to the latest version. The MCP server requires a recent update.',
                icon: 'download',
              },
              {
                number: 2,
                title: 'Open a Design File',
                content: 'Open any Design file in the Figma desktop app (not FigJam — you need a Design file for the MCP toggle).',
                icon: 'monitor',
              },
              {
                number: 3,
                title: 'Switch to Dev Mode',
                content: 'Press Shift + D or click the Dev Mode toggle in the toolbar. The MCP server option lives in Dev Mode.',
                icon: 'code',
              },
              {
                number: 4,
                title: 'Enable the MCP Server',
                content: 'In the Dev Mode panel, find the "MCP" section and click "Enable desktop MCP server." The server will start running locally.',
                icon: 'cog',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Connect Claude Code to the Desktop Server',
          },
          {
            type: 'text',
            content: 'Add the Figma MCP server to your Claude Code configuration. Run this command in your terminal:',
          },
          {
            type: 'code',
            code: 'claude mcp add figma-desktop --transport http http://127.0.0.1:3845/mcp',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Option B: Remote MCP Server',
          },
          {
            type: 'text',
            content: 'If you don\'t have the desktop app or prefer a cloud connection, you can use the remote server instead. This works with any Figma plan.',
          },
          {
            type: 'code',
            code: 'claude mcp add figma-remote --transport http https://mcp.figma.com/mcp',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'callout',
            calloutType: 'warning',
            title: 'Desktop vs Remote',
            content: 'The desktop server lets you select frames directly in the app — a faster workflow. The remote server requires you to paste Figma URLs. Use desktop if you can.',
            icon: 'warning',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Verify the Connection',
          },
          {
            type: 'text',
            content: 'Start a new Claude Code session and ask it to check the Figma connection:',
          },
          {
            type: 'code',
            code: 'claude\n\n> Can you see my Figma MCP server? List the available tools.',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'text',
            content: 'Claude Code should respond listing Figma-related tools like reading files, getting design data, and extracting components.',
          },
          {
            type: 'completion',
            title: 'Figma MCP connected',
            items: [
              'Enabled the desktop MCP server in Figma\'s Dev Mode',
              'Added the figma-desktop transport to Claude Code',
              'Verified the connection by listing the available Figma tools',
            ],
            message: 'Claude Code can now read your actual Figma files. Next: turning a selected frame into working code.',
          },
        ],
      },
      {
        id: 'lesson-20',
        title: 'Turn Figma Frames into Code',
        duration: 3,
        order: 5,
        module: 'figma',
        sections: [
          {
            type: 'intro',
            content: 'Now that Figma is connected, you can select any frame in Figma and ask Claude Code to turn it into working code. No more describing hex codes and spacing — Claude Code reads your actual design.',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Select a Frame in Figma',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Open Your Design File',
                content: 'In the Figma desktop app, open the design file you want to turn into code.',
                icon: 'monitor',
              },
              {
                number: 2,
                title: 'Select a Frame or Component',
                content: 'Click on the frame, component, or screen you want to implement. You can select an entire page layout or just a single component like a button or card.',
                icon: 'check',
              },
              {
                number: 3,
                title: 'Ask Claude Code to Implement It',
                content: [
                  'Switch to your Claude Code terminal',
                  'Tell Claude Code what you want — it can see your Figma selection',
                ],
                icon: 'terminal',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Example Prompts',
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Simple component',
            content: 'Implement the card component I have selected in Figma using React and Tailwind CSS.',
            icon: 'check',
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Full page layout',
            content: 'Build the landing page I have selected in Figma. Use Next.js with Tailwind CSS. Make it responsive.',
            icon: 'check',
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'With specifications',
            content: 'Implement my selected Figma frame. Use the exact colors, spacing, and typography from the design. Add hover states for all buttons.',
            icon: 'check',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'What Claude Code Extracts',
          },
          {
            type: 'text',
            content: 'When you point Claude Code at a Figma frame, it reads:',
          },
          {
            type: 'list',
            items: [
              'Layout structure — how elements are arranged (rows, columns, grids)',
              'Colors — exact hex/RGB values from your design tokens',
              'Typography — font family, size, weight, line height',
              'Spacing — padding, margins, gaps between elements',
              'Components — reusable design system components',
              'Design variables — your Figma variables and styles',
            ],
          },
          {
            type: 'callout',
            calloutType: 'tip',
            title: 'Start Small',
            content: 'Begin with a single component (a button, a card) before asking Claude Code to implement an entire page. This helps you learn the workflow and check the output quality.',
            icon: 'info',
          },
          {
            type: 'completion',
            title: 'Frame to code, working',
            items: [
              'Selected a frame in Figma and asked Claude Code to implement it',
              'Saw how Claude Code reads layout, colors, type, spacing, and components',
              'Started small with a single component before scaling up to a full page',
            ],
            message: 'Selecting frames is the fast path. Next: when to use Figma URLs in your prompts instead.',
          },
        ],
      },
      {
        id: 'lesson-21',
        title: 'Using Figma Links in Prompts',
        duration: 2,
        order: 6,
        module: 'figma',
        sections: [
          {
            type: 'intro',
            content: 'You can also share specific Figma designs with Claude Code by pasting links. This is useful when using the remote MCP server or when you want to reference a specific layer or frame.',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Copy a Figma Link',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Select a Frame or Layer',
                content: 'In Figma, click on the frame, component, or layer you want to reference.',
                icon: 'monitor',
              },
              {
                number: 2,
                title: 'Copy the Link',
                content: [
                  'Right-click the selection and choose "Copy link to selection"',
                  'Or use the shortcut: Cmd + L (Mac) / Ctrl + L (Windows)',
                ],
                icon: 'code',
              },
              {
                number: 3,
                title: 'Paste in Claude Code',
                content: 'Paste the Figma URL directly into your Claude Code prompt along with your instructions.',
                icon: 'terminal',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Example Prompts with Links',
          },
          {
            type: 'code',
            code: '> Implement this Figma component as a React component:\n> https://www.figma.com/design/abc123/MyProject?node-id=42-1337\n> Use Tailwind CSS and make it responsive.',
            language: 'text',
            label: 'Claude Code prompt',
          },
          {
            type: 'code',
            code: '> Here are two Figma frames — the mobile and desktop versions:\n> Mobile: https://www.figma.com/design/abc123/MyProject?node-id=10-200\n> Desktop: https://www.figma.com/design/abc123/MyProject?node-id=10-300\n> Build a responsive component that matches both layouts.',
            language: 'text',
            label: 'Claude Code prompt',
          },
          {
            type: 'callout',
            calloutType: 'tip',
            title: 'Multiple Links Work Too',
            content: 'You can paste multiple Figma links in one prompt. This is great for showing Claude Code different states (default, hover, active) or responsive breakpoints (mobile, tablet, desktop).',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'When to Use Links vs Selection',
          },
          {
            type: 'list',
            items: [
              'Use frame selection (desktop MCP) for quick iteration — select, prompt, repeat',
              'Use links when sharing a specific part of a complex file',
              'Use links when working with the remote MCP server (no desktop app)',
              'Use links when referencing multiple frames or states in one prompt',
            ],
          },
          {
            type: 'completion',
            title: 'Sharing frames with links',
            items: [
              'Copied a Figma URL straight to a specific frame or layer',
              'Pasted multiple links in one prompt to show responsive states',
              'Learned when links beat selection (complex files, remote MCP, multi-frame references)',
            ],
            message: 'Two ways to point Claude Code at a frame. Next: tips for getting cleaner output from both.',
          },
        ],
      },
      {
        id: 'lesson-22',
        title: 'Figma to Code Best Practices',
        duration: 2,
        order: 7,
        module: 'figma',
        sections: [
          {
            type: 'intro',
            content: 'Get the best results from the Figma + Claude Code workflow with these practical tips learned from real designer workflows.',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Organize Your Figma File for Better Output',
          },
          {
            type: 'list',
            items: [
              'Use Auto Layout — Claude Code translates Auto Layout directly to Flexbox/Grid, giving much cleaner code than absolute positioning',
              'Name your layers clearly — "hero-section" and "cta-button" produce better code than "Frame 437" and "Rectangle 12"',
              'Use Figma variables for colors and spacing — Claude Code picks these up and can generate consistent design tokens',
              'Group related elements into components — Claude Code will create reusable React components from Figma components',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Prompting Tips for Figma + Claude Code',
          },
          {
            type: 'callout',
            calloutType: 'error',
            title: 'Too vague:',
            content: 'Build this Figma design.',
            icon: 'error',
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Better:',
            content: 'Implement my selected Figma frame as a React component with Tailwind CSS. Use the exact colors and spacing from the design. The button should have a hover state that darkens the background by 10%.',
            icon: 'check',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Iterate Between Figma and Code',
          },
          {
            type: 'text',
            content: 'The best workflow is a loop between design and code:',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Design in Figma',
                content: 'Create or refine your design in Figma as you normally would.',
                icon: 'monitor',
              },
              {
                number: 2,
                title: 'Generate Code',
                content: 'Select the frame and ask Claude Code to implement it.',
                icon: 'code',
              },
              {
                number: 3,
                title: 'Review in Browser',
                content: 'Check the result in your browser. Note what needs adjusting.',
                icon: 'check',
              },
              {
                number: 4,
                title: 'Refine',
                content: 'Either update the Figma design and regenerate, or ask Claude Code to adjust the code directly.',
                icon: 'cog',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Use Code Connect for Design Systems',
          },
          {
            type: 'text',
            content: 'If your team has a component library, Figma\'s Code Connect feature links Figma components to their code equivalents. When Claude Code encounters a connected component, it uses your existing code instead of generating new code from scratch.',
          },
          {
            type: 'callout',
            calloutType: 'tip',
            title: 'Design System Consistency',
            content: 'Code Connect ensures that a "Primary Button" in Figma maps to your team\'s actual <Button variant="primary" /> component — not a generic button with hardcoded styles.',
            icon: 'info',
          },
          {
            type: 'completion',
            title: 'Cleaner prompts, cleaner output',
            items: [
              'Organized Figma files (Auto Layout, named layers, variables) for better code',
              'Wrote specific prompts that describe exact framework, colors, and interactions',
              'Set up the Figma → code → review → refine loop as a working rhythm',
              'Learned how Code Connect maps Figma components to your real component library',
            ],
            message: 'You know the moves now. Last lesson in this module: closing the loop by bringing code back to Figma.',
          },
        ],
      },
      {
        id: 'lesson-23',
        title: 'Bring Code Back to Figma',
        duration: 3,
        order: 8,
        module: 'figma',
        sections: [
          {
            type: 'intro',
            content: 'Figma\'s Code to Canvas feature closes the loop: build UI in Claude Code, then bring it back to Figma as editable frames. This makes the Figma ↔ Code workflow truly bidirectional — not just design-to-code, but code-to-design too.',
            icon: 'info',
          },
          {
            type: 'callout',
            calloutType: 'info',
            title: 'Not Screenshots — Real Editable Frames',
            content: 'Code to Canvas doesn\'t just paste images. It converts your built UI into real Figma layers — editable text, vector shapes, and auto-layout frames that your design team can modify directly.',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'The 4-Step Code to Canvas Workflow',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Build Your UI in Claude Code',
                content: 'Create or update your component in Claude Code as you normally would. Run it locally so you can see the rendered output in your browser.',
                icon: 'code',
              },
              {
                number: 2,
                title: 'Capture the Screen',
                content: 'Ask Claude Code to capture the current UI state. It takes a structured snapshot of the rendered output — layout, styles, text content, and hierarchy.',
                icon: 'monitor',
              },
              {
                number: 3,
                title: 'Paste into Figma',
                content: 'Use the Figma MCP connection to push the captured UI into your Figma file. It arrives as editable frames with proper auto-layout, not flat images.',
                icon: 'download',
              },
              {
                number: 4,
                title: 'Collaborate and Refine',
                content: 'Your design team can now review, annotate, and refine the built UI directly in Figma. Leave comments, adjust spacing, or propose changes — all in the familiar Figma workflow.',
                icon: 'user',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Example Prompts for Code to Canvas',
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Capture a single screen',
            content: 'Capture the current state of my dashboard page and push it to Figma as an editable frame.',
            icon: 'check',
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Capture a multi-step flow',
            content: 'Capture the signup flow — show the email step, the password step, and the confirmation screen as three separate Figma frames.',
            icon: 'check',
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Compare design variants',
            content: 'I built two versions of the pricing card. Capture both and put them side by side in Figma so the team can compare.',
            icon: 'check',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'The Round-Trip Workflow',
          },
          {
            type: 'text',
            content: 'With Code to Canvas, the full design-development loop looks like this:',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Design in Figma',
                content: 'Start with your design in Figma as usual.',
                icon: 'monitor',
              },
              {
                number: 2,
                title: 'Generate Code',
                content: 'Use Figma MCP to turn your design into working code via Claude Code.',
                icon: 'code',
              },
              {
                number: 3,
                title: 'Capture Back to Figma',
                content: 'Push the built UI back into Figma as editable frames using Code to Canvas.',
                icon: 'download',
              },
              {
                number: 4,
                title: 'Refine in Figma',
                content: 'Designers review the built result, leave feedback, and propose adjustments in Figma.',
                icon: 'check',
              },
              {
                number: 5,
                title: 'Push Updates',
                content: 'Apply the feedback in code and iterate. The loop continues until the design and code are perfectly aligned.',
                icon: 'cog',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'When to Use Code to Canvas',
          },
          {
            type: 'list',
            items: [
              'Team review — share built UI with designers who prefer reviewing in Figma over a browser',
              'Comparing variants — capture multiple implementations side by side for design critique',
              'Designer feedback on built UI — let the team annotate and comment on actual code output',
              'Documentation — keep Figma files up to date with what\'s actually been built',
              'Handoff verification — confirm the code matches the original design by overlaying them in Figma',
            ],
          },
          {
            type: 'completion',
            title: 'Figma ↔ Code Complete!',
            items: [
              'How to connect Figma to Claude Code via MCP',
              'How to turn Figma frames into working code',
              'How to use Figma links for precise references',
              'Best practices for the Figma + Claude Code workflow',
              'How to bring code back to Figma with Code to Canvas',
            ],
            message: 'You now have a truly bidirectional design-to-code workflow. Design in Figma, build in Claude Code, and bring it back to Figma for review. The loop is complete.',
          },
        ],
      },
      // First Prototype Lessons (9-13)
      {
        id: 'lesson-4',
        title: 'Start Your First Claude Code Session',
        duration: 2,
        order: 9,
        module: 'prototype',
        sections: [
          {
            type: 'intro',
            content: 'Time to actually launch Claude Code. You\'ll open a terminal, run one command, paste your API key, and pick a model. Three minutes from here to a working session.',
            icon: 'terminal',
          },
          {
            type: 'heading',
            level: 'h2',
            content: 'Start Your First Claude Code Session',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Open Terminal',
          },
          {
            type: 'list',
            items: [
              'Mac: Command + Space → "Terminal" → Enter',
              'Windows: Windows logo → "Command Prompt" → Enter',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Launch Claude Code',
          },
          {
            type: 'text',
            content: 'Type this command and press Enter:',
          },
          {
            type: 'code',
            code: 'claude',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Paste Your API Key',
          },
          {
            type: 'text',
            content: 'Claude Code will ask for your API key. Paste the one you saved in the setup guide.',
          },
          {
            type: 'callout',
            calloutType: 'info',
            content: 'Your key won\'t appear as you type—that\'s normal for security!',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Choose a Model',
          },
          {
            type: 'text',
            content: 'Claude Code will ask which model you want. Choose Claude 3.5 Sonnet—it\'s the best balance of speed and power for designers.',
          },
          {
            type: 'completion',
            title: 'You\'re inside Claude Code',
            items: [
              'Opened a terminal session',
              'Launched Claude Code with the claude command',
              'Pasted your API key and picked a model',
            ],
            message: 'Next: giving Claude Code a project folder to work in so your files don\'t end up scattered.',
          },
        ],
      },
      {
        id: 'lesson-5',
        title: 'Create Your Project Folder',
        duration: 1,
        order: 10,
        module: 'prototype',
        sections: [
          {
            type: 'intro',
            content: 'Every project Claude Code touches lives in a folder. You\'ll create one, step into it, and re-launch Claude Code so it knows where home is for the rest of this lesson.',
            icon: 'cog',
          },
          {
            type: 'heading',
            level: 'h2',
            content: 'Create Your Project Folder',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Exit Claude Code Temporarily',
          },
          {
            type: 'text',
            content: 'Type exit and press Enter. You\'ll return to your regular Terminal.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Create a Project Folder',
          },
          {
            type: 'text',
            content: 'Run this command:',
          },
          {
            type: 'code',
            code: 'mkdir my-first-prototype',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'text',
            content: 'Then navigate into it:',
          },
          {
            type: 'code',
            code: 'cd my-first-prototype',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Start Claude Code in Your Project',
          },
          {
            type: 'text',
            content: 'Run:',
          },
          {
            type: 'code',
            code: 'claude',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'text',
            content: 'Paste your API key again. Now you\'re inside Claude Code, with your project as the working folder.',
          },
          {
            type: 'completion',
            title: 'Project folder ready',
            items: [
              'Created a my-first-prototype folder with mkdir',
              'Stepped into it with cd',
              'Re-launched Claude Code so it\'s scoped to your new project',
            ],
            message: 'You have an empty project. Time to ask Claude Code to fill it.',
          },
        ],
      },
      {
        id: 'lesson-6',
        title: 'Generate Your First Prototype',
        duration: 2,
        order: 11,
        module: 'prototype',
        sections: [
          {
            type: 'intro',
            content: 'This is the moment Claude Code earns its keep. You\'ll write a single sentence describing what you want, hit Enter, and watch a working component appear in your project folder.',
            icon: 'code',
          },
          {
            type: 'heading',
            level: 'h2',
            content: 'Generate Your First Prototype',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Ask Claude Code to Create Something',
          },
          {
            type: 'text',
            content: 'Try this simple request:',
          },
          {
            type: 'code',
            code: 'Create a React button component with a blue background and white text. Add a hover effect that makes the button slightly larger. Use Tailwind CSS for styling.',
            language: 'text',
            label: 'Claude Code',
          },
          {
            type: 'text',
            content: 'Press Enter and watch Claude Code generate code!',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Review What It Created',
          },
          {
            type: 'text',
            content: 'Claude Code will show you the files it made. Read through them to understand what happened.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Ask for Changes (Optional)',
          },
          {
            type: 'text',
            content: 'If you want to modify something, just ask:',
          },
          {
            type: 'code',
            code: 'Make the button green instead of blue and add rounded corners.',
            language: 'text',
            label: 'Claude Code',
          },
          {
            type: 'text',
            content: 'Claude Code will update the files immediately!',
          },
          {
            type: 'completion',
            title: 'First prototype generated',
            items: [
              'Wrote a specific prompt describing the component you wanted',
              'Watched Claude Code create the actual files',
              'Asked for a follow-up change and saw the files update in place',
            ],
            message: 'The files exist. Next: actually rendering them in a browser so you can see what you built.',
          },
        ],
      },
      {
        id: 'lesson-7',
        title: 'See Your Prototype Live',
        duration: 2,
        order: 12,
        module: 'prototype',
        sections: [
          {
            type: 'intro',
            content: 'Code without a preview is just text. You\'ll spin up a local dev server, open localhost:3000 in your browser, and see your prototype rendered in real-time — refreshing automatically every time Claude Code makes a change.',
            icon: 'monitor',
          },
          {
            type: 'heading',
            level: 'h2',
            content: 'See Your Prototype Live',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Exit Claude Code',
          },
          {
            type: 'text',
            content: 'Type exit and press Enter to return to Terminal.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Initialize a React App (If Needed)',
          },
          {
            type: 'text',
            content: 'Run:',
          },
          {
            type: 'code',
            code: 'npx create-react-app .',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'text',
            content: 'This sets up the structure React needs to run.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Start Your Development Server',
          },
          {
            type: 'text',
            content: 'Run:',
          },
          {
            type: 'code',
            code: 'npm start',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'text',
            content: 'Your prototype will automatically open in your browser at localhost:3000!',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Watch for Live Updates',
          },
          {
            type: 'text',
            content: 'When Claude Code makes changes, your browser automatically updates. No manual refresh needed!',
          },
          {
            type: 'completion',
            title: 'Live preview running',
            items: [
              'Set up the React project structure with create-react-app',
              'Started the dev server with npm start',
              'Confirmed the prototype renders at localhost:3000 with live reload',
            ],
            message: 'Two windows, one workflow. Last lesson in this module: keeping the dev server running while you keep editing.',
          },
        ],
      },
      {
        id: 'lesson-8',
        title: 'Get Back to Editing',
        duration: 1,
        order: 13,
        module: 'prototype',
        sections: [
          {
            type: 'intro',
            content: 'Your dev server needs its own terminal to keep running. The fix is simple: open a second terminal and put Claude Code there. From now on, the loop is "edit in one window, watch the browser update from the other."',
            icon: 'terminal',
          },
          {
            type: 'heading',
            level: 'h2',
            content: 'Get Back to Editing',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Open Another Terminal Window',
          },
          {
            type: 'text',
            content: 'To keep editing with Claude Code while your prototype runs, open a new Terminal window:',
          },
          {
            type: 'list',
            items: [
              'Mac: Command + T (in Terminal app)',
              'Windows: Ctrl + Shift + 2 (in Command Prompt)',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Navigate to Your Project',
          },
          {
            type: 'text',
            content: 'In the new Terminal, run:',
          },
          {
            type: 'code',
            code: 'cd my-first-prototype',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Start Claude Code Again',
          },
          {
            type: 'text',
            content: 'Run:',
          },
          {
            type: 'code',
            code: 'claude',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'text',
            content: 'Now you have:',
          },
          {
            type: 'list',
            items: [
              'Terminal #1: Your dev server (showing localhost:3000)',
              'Terminal #2: Claude Code (where you edit)',
              'Browser: Your live prototype updating in real-time',
            ],
          },
          {
            type: 'completion',
            title: 'Congratulations!',
            items: [
              'Created your first prototype with Claude Code',
              'Saw it live on your machine',
              'Understand the foundation of design workflows with Claude Code',
            ],
            message: 'You\'ve created your first prototype with Claude Code and seen it live on your machine. This is the foundation of everything you can do with Claude Code as a designer.',
          },
        ],
      },
      // GitHub Lessons (14-18)
      {
        id: 'lesson-9',
        title: 'Create a GitHub Account',
        duration: 1,
        order: 14,
        module: 'github',
        sections: [
          {
            type: 'intro',
            content: 'GitHub is where your code lives in the cloud — backup, history, and collaboration in one place. If you don\'t already have an account, this lesson is sixty seconds of clicking. If you do, skip ahead to the next one.',
            icon: 'github',
          },
          {
            type: 'heading',
            level: 'h2',
            content: 'Create a GitHub Account',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Why GitHub?',
          },
          {
            type: 'list',
            items: [
              'Backup: Your code is safe in the cloud, not just on your computer',
              'History: You can see every change you made and go back if needed',
              'Collaboration: Easy to share with developers and teammates',
              'Portfolio: Show your work and design-to-code process',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Sign Up',
          },
          {
            type: 'list',
            items: [
              'Go to github.com',
              'Click "Sign up"',
              'Create an account with your email (you can use your work or personal email)',
              'Verify your email by clicking the link they send you',
            ],
            ordered: true,
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'You\'re Ready!',
          },
          {
            type: 'text',
            content: 'GitHub account created. Let\'s connect your prototype.',
          },
          {
            type: 'completion',
            title: 'GitHub account ready',
            items: [
              'Created a github.com account',
              'Verified your email',
              'Understood why GitHub matters: backup, history, collaboration, portfolio',
            ],
            message: 'An account is just an empty room. Next: creating a repository to store your prototype.',
          },
        ],
      },
      {
        id: 'lesson-10',
        title: 'Create a Repository on GitHub',
        duration: 1,
        order: 15,
        module: 'github',
        sections: [
          {
            type: 'intro',
            content: 'A repository is a project folder that lives on GitHub. You\'ll create one with the same name as your local prototype folder, then keep the setup page open — you\'ll need its commands in the next lesson.',
            icon: 'github',
          },
          {
            type: 'heading',
            level: 'h2',
            content: 'Create a Repository on GitHub',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Create a New Repo',
          },
          {
            type: 'list',
            items: [
              'Click the "+" icon in the top right of GitHub',
              'Select "New repository"',
              'Name it "my-first-prototype" (same as your local folder)',
              'Add a description: "Design prototype created with Claude Code"',
              'Leave other settings as default',
              'Click "Create repository"',
            ],
            ordered: true,
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Copy the Setup Instructions',
          },
          {
            type: 'text',
            content: 'GitHub will show you commands. Keep this page open—you\'ll need the commands soon!',
          },
          {
            type: 'completion',
            title: 'Empty repo, waiting',
            items: [
              'Created a new repo named my-first-prototype',
              'Added a one-line description',
              'Kept the setup page open with the connection commands',
            ],
            message: 'The cloud side is set up. Next: connecting your local project to it.',
          },
        ],
      },
      {
        id: 'lesson-11',
        title: 'Connect Your Local Project to GitHub',
        duration: 2,
        order: 16,
        module: 'github',
        sections: [
          {
            type: 'intro',
            content: 'Three git commands to initialize your folder, three more to push it to GitHub. Follow them in order and your prototype will be in the cloud by the end of the lesson.',
            icon: 'terminal',
          },
          {
            type: 'heading',
            level: 'h2',
            content: 'Connect Your Local Project to GitHub',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Open Terminal (Not Claude Code)',
          },
          {
            type: 'text',
            content: 'You should be in your project folder. Check with:',
          },
          {
            type: 'code',
            code: 'pwd',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'text',
            content: 'You should see something like .../my-first-prototype',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Initialize Git',
          },
          {
            type: 'text',
            content: 'Run these commands one by one:',
          },
          {
            type: 'code',
            code: 'git init\ngit add .\ngit commit -m "Initial prototype created with Claude Code"',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Connect to GitHub',
          },
          {
            type: 'text',
            content: 'Copy the commands from GitHub\'s instructions. They\'ll look like:',
          },
          {
            type: 'code',
            code: 'git branch -M main\ngit remote add origin https://github.com/YOUR-USERNAME/my-first-prototype.git\ngit push -u origin main',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Check GitHub',
          },
          {
            type: 'text',
            content: 'Refresh your GitHub repo page. Your files should now be there!',
          },
          {
            type: 'completion',
            title: 'Local project linked to GitHub',
            items: [
              'Initialized git in your project folder',
              'Made your first commit',
              'Connected the local repo to your GitHub remote and pushed',
            ],
            message: 'Your prototype is in the cloud. Next: how to keep it there as you make changes.',
          },
        ],
      },
      {
        id: 'lesson-12',
        title: 'Save Your Changes Going Forward',
        duration: 2,
        order: 17,
        module: 'github',
        sections: [
          {
            type: 'intro',
            content: 'Connecting once isn\'t enough — every meaningful change needs a commit and a push. You\'ll learn the four-step save loop and how to write commit messages your future self will actually thank you for.',
            icon: 'check',
          },
          {
            type: 'heading',
            level: 'h2',
            content: 'Save Your Changes Going Forward',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Regular Save Workflow',
          },
          {
            type: 'text',
            content: 'Every time you make changes in Claude Code that you want to keep:',
          },
          {
            type: 'list',
            items: [
              'Exit Claude Code (type exit)',
              'Run: git add .',
              'Run: git commit -m "Description of what you changed"',
              'Run: git push',
            ],
            ordered: true,
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Write Good Commit Messages',
          },
          {
            type: 'text',
            content: 'Instead of "Updated stuff", try:',
          },
          {
            type: 'list',
            items: [
              'Changed button color from blue to green',
              'Added hover effect to navigation menu',
              'Fixed button padding on mobile',
            ],
          },
          {
            type: 'text',
            content: 'Good messages help you remember what you did and help teammates understand changes.',
          },
          {
            type: 'completion',
            title: 'Save loop, internalized',
            items: [
              'Learned the add → commit → push loop for every meaningful change',
              'Practiced writing commit messages that describe what changed, not just "stuff"',
              'Treated commits as documentation, not paperwork',
            ],
            message: 'Manual saves work, but Claude Code can handle most of this for you. Last lesson: the /save command.',
          },
        ],
      },
      {
        id: 'lesson-13',
        title: 'Share Your Work & Use Claude\'s /save Command',
        duration: 1,
        order: 18,
        module: 'github',
        sections: [
          {
            type: 'intro',
            content: 'You don\'t actually have to remember the four-step git loop every time. Claude Code\'s /save command does it for you, and your repo URL is the only thing you need to share work with anyone.',
            icon: 'github',
          },
          {
            type: 'heading',
            level: 'h2',
            content: 'Share Your Work & Use Claude\'s /save Command',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Pro Tip - Automatic Saving',
          },
          {
            type: 'text',
            content: 'Inside Claude Code, you can type:',
          },
          {
            type: 'code',
            code: '/save',
            language: 'bash',
            label: 'Claude Code',
          },
          {
            type: 'text',
            content: 'Claude Code will automatically handle git commands and create meaningful commit messages for you. This saves time!',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Sharing Your Work',
          },
          {
            type: 'text',
            content: 'Just send them the GitHub link, like:',
          },
          {
            type: 'code',
            code: 'https://github.com/YOUR-USERNAME/my-first-prototype',
            language: 'text',
            label: 'GitHub',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'They Can:',
          },
          {
            type: 'list',
            items: [
              'See your code and understand your design decisions',
              'Clone your project to run locally',
              'Leave comments or suggestions',
              'Collaborate on the prototype',
            ],
          },
          {
            type: 'completion',
            title: 'You\'re Now a Designer with Git Skills!',
            items: [
              'Save your work safely to the cloud',
              'Track every change you make',
              'Collaborate with developers',
              'Showcase your process on GitHub',
            ],
            message: 'You can save your work safely to the cloud, track every change you make, collaborate with developers, and showcase your process on GitHub.',
          },
        ],
      },
      // Best Practices Lessons (19-23)
      {
        id: 'lesson-14',
        title: 'How to Describe Your Design to Claude Code',
        duration: 2,
        order: 19,
        module: 'practices',
        sections: [
          {
            type: 'intro',
            content: 'The single biggest factor in code quality is how you describe what you want. Vague prompts get vague output. This lesson teaches you the level of detail Claude Code actually needs — colors, sizes, interactions, framework — and what to leave out.',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h2',
            content: 'How to Describe Your Design to Claude Code',
          },
          {
            type: 'callout',
            calloutType: 'tip',
            title: 'Even Better: Use Figma MCP',
            content: 'If you use Figma, you can skip manual descriptions entirely. Connect Figma to Claude Code via MCP and let it read your actual designs — colors, spacing, components, everything. See Module 2: Figma ↔ Code for setup instructions.',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Be Specific, Not Vague',
          },
          {
            type: 'callout',
            calloutType: 'error',
            title: 'Not this:',
            content: 'Create a nice button',
            icon: 'error',
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Do this:',
            content: 'Create a button with a #2563EB background, white text, 12px border radius, 16px padding, and a hover effect that makes it 5% larger',
            icon: 'check',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Include Design Details',
          },
          {
            type: 'list',
            items: [
              'Colors: Use hex codes (#2563EB, not "blue")',
              'Sizes: Specify padding, margins, font sizes (16px, not "normal")',
              'Interactions: Describe what happens on hover, click, etc.',
              'Responsiveness: Mention if it needs to work on mobile/tablet',
              'Framework: Say "Use React and Tailwind CSS"',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Good Prompt Examples',
          },
          {
            type: 'list',
            items: [
              'Create a form with email and password fields. Use #1F2937 text, light gray background, and make it responsive.',
              'Build a product card showing: image on top, title below, price, and a \'Buy Now\' button. Make it 300px wide.',
              'Design a navigation bar with a logo on the left and 4 menu items on the right. Make it sticky (stays at top when scrolling).',
            ],
          },
          {
            type: 'completion',
            title: 'Specific beats vague, every time',
            items: [
              'Replaced "nice button" with concrete colors, sizes, and interactions',
              'Always specified the framework (React + Tailwind)',
              'Built a mental template for prompts: structure → colors → sizes → interactions → responsiveness',
            ],
            message: 'Better prompts in. Better code out. Next: testing whether the code actually does what you wanted.',
          },
        ],
      },
      {
        id: 'lesson-15',
        title: 'Testing Your Prototype',
        duration: 1,
        order: 20,
        module: 'practices',
        sections: [
          {
            type: 'intro',
            content: 'Looking good in one browser doesn\'t mean it works for everyone. You\'ll learn the three things to check before sharing a prototype: cross-browser rendering, basic accessibility, and whether the interactions actually feel right.',
            icon: 'monitor',
          },
          {
            type: 'heading',
            level: 'h2',
            content: 'Testing Your Prototype',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Test in Different Browsers',
          },
          {
            type: 'list',
            items: [
              'Test in Chrome, Safari, Firefox (not every browser shows things the same)',
              'In your browser, press F12 to open "Developer Tools"',
              'You can simulate phones and tablets to test responsiveness',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Check Accessibility',
          },
          {
            type: 'text',
            content: 'Ask yourself:',
          },
          {
            type: 'list',
            items: [
              'Can I use this with just my keyboard? (Tab through elements)',
              'Is the text readable? (Good contrast between text and background)',
              'Does it work on small screens? (Phone, tablet, desktop)',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Test Interactions',
          },
          {
            type: 'list',
            items: [
              'Hover over buttons—does the effect work smoothly?',
              'Click buttons—do they do what you expect?',
              'Try animations—are they fast enough? Too slow?',
            ],
          },
          {
            type: 'completion',
            title: 'Tested across the basics',
            items: [
              'Checked the prototype in multiple browsers',
              'Ran a basic accessibility pass: keyboard, contrast, small screens',
              'Felt the interactions yourself instead of trusting the screenshot',
            ],
            message: 'Working prototype, real feedback coming. Next: how to ask for changes without rewriting from scratch.',
          },
        ],
      },
      {
        id: 'lesson-16',
        title: 'Iterating Based on Feedback',
        duration: 1,
        order: 21,
        module: 'practices',
        sections: [
          {
            type: 'intro',
            content: 'Saying "redo it" gets you a different version of the same problem. Saying "make the button taller and add more space between the inputs" gets you exactly what you wanted. This lesson is about that difference, plus using git to safely try things you might want to undo.',
            icon: 'cog',
          },
          {
            type: 'heading',
            level: 'h2',
            content: 'Iterating Based on Feedback',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Ask for Small Changes, Not Rewrites',
          },
          {
            type: 'callout',
            calloutType: 'error',
            title: 'Don\'t:',
            content: 'I don\'t like this design, redo it',
            icon: 'error',
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Do:',
            content: 'Make the button taller and add more space between the inputs',
            icon: 'check',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Use Version History',
          },
          {
            type: 'text',
            content: 'If you don\'t like a change, you can always go back to a previous version on GitHub:',
          },
          {
            type: 'list',
            items: [
              'View your commit history on GitHub',
              'Click on an old version',
              'Compare what changed',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Collaborate Effectively',
          },
          {
            type: 'list',
            items: [
              'Show your prototype to teammates early (don\'t wait for perfection)',
              'Ask specific questions: "Does this button feel clickable to you?"',
              'Document design decisions in code comments',
            ],
          },
          {
            type: 'completion',
            title: 'Iteration as a habit',
            items: [
              'Made small surgical changes instead of asking for full rewrites',
              'Used git history as a safety net for risky experiments',
              'Showed work early and asked specific questions instead of "what do you think?"',
            ],
            message: 'You can refine. Now the question is how to hand it off cleanly. Next lesson.',
          },
        ],
      },
      {
        id: 'lesson-17',
        title: 'Handing Off Work to Developers',
        duration: 1,
        order: 22,
        module: 'practices',
        sections: [
          {
            type: 'intro',
            content: 'A prototype that ships well to a developer is a prototype that gets built. You\'ll learn what to put on GitHub, what belongs in a README, and how to use Figma MCP so the handoff conversation is about decisions, not pixel pushing.',
            icon: 'user',
          },
          {
            type: 'heading',
            level: 'h2',
            content: 'Handing Off Work to Developers',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Prepare Your Code for Handoff',
          },
          {
            type: 'list',
            items: [
              'Push to GitHub: Make sure all your latest work is on GitHub',
              'Add comments: Explain why you made certain design choices in the code',
              'Create a README: A simple document explaining what the prototype does and how to run it',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Write a Good README',
          },
          {
            type: 'text',
            content: 'Create a file called README.md with:',
          },
          {
            type: 'list',
            items: [
              'What the prototype is for',
              'How to run it (e.g., "Run npm start to see the prototype")',
              'Design notes (e.g., "Button interactions should feel snappy")',
              'Links to design files (Figma, etc.)',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Be Available for Questions',
          },
          {
            type: 'text',
            content: 'Developers will have questions about your design. Be ready to:',
          },
          {
            type: 'list',
            items: [
              'Explain why you made certain choices',
              'Show design references or inspiration',
              'Discuss trade-offs (e.g., why animation smoothness matters)',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Streamline Handoff with Figma MCP',
          },
          {
            type: 'text',
            content: 'If your team uses Figma, the Figma MCP server makes handoff seamless. Developers can connect Claude Code to your Figma files and generate code that matches your designs exactly — same colors, spacing, and components. No more "the padding looks off" back-and-forth.',
          },
          {
            type: 'list',
            items: [
              'Share your Figma file link with the developer',
              'They can connect Claude Code to Figma MCP and reference your frames directly',
              'Code Connect can map your Figma components to the team\'s existing component library',
              'Design tokens and variables from Figma carry over to code automatically',
            ],
          },
          {
            type: 'completion',
            title: 'Handoff, ready',
            items: [
              'Prepared the repo with comments, a README, and a recent push',
              'Documented design intent so developers know the why, not just the what',
              'Used Figma MCP to short-circuit the "the padding looks off" loop',
            ],
            message: 'Last lesson coming up. Things will go wrong eventually — knowing how to fix them keeps the workflow running.',
          },
        ],
      },
      {
        id: 'lesson-18',
        title: 'Troubleshooting Common Issues',
        duration: 1,
        order: 23,
        module: 'practices',
        sections: [
          {
            type: 'intro',
            content: 'Three things break most often: Claude Code refusing to start, the dev server failing to launch, and git getting confused. Here are the fixes for each — bookmark this lesson, you\'ll come back to it.',
            icon: 'warning',
          },
          {
            type: 'heading',
            level: 'h2',
            content: 'Troubleshooting Common Issues',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Claude Code Won\'t Start',
          },
          {
            type: 'list',
            items: [
              'Check your API key (copy it again if needed)',
              'Make sure you\'ve updated Node.js: npm install -g npm',
              'Reinstall Claude Code: npm install -g claude-code@latest',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Development Server Won\'t Start',
          },
          {
            type: 'list',
            items: [
              'Press Ctrl + C to stop it',
              'Run npm start again',
              'Check if port 3000 is already in use by another program',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Git/GitHub Issues',
          },
          {
            type: 'list',
            items: [
              'Forgot to initialize git? Run git init',
              'Wrong remote? Check with git remote -v',
              'Need a fresh start? Delete the .git folder and start over',
            ],
          },
          {
            type: 'heading',
            level: 'h2',
            content: 'Key Takeaways',
          },
          {
            type: 'list',
            items: [
              'Specific is better than vague. The more detail you give Claude Code, the better the result.',
              'Test early and often. Don\'t wait until the end to see if something works.',
              'Iterate in small steps. Ask for one thing at a time, not everything at once.',
              'Document your decisions. Help future you and your teammates understand why you made choices.',
              'Use git effectively. Meaningful commit messages are your documentation.',
            ],
          },
          {
            type: 'completion',
            title: 'You\'re Ready!',
            items: [
              'How to set up Claude Code',
              'How to create prototypes',
              'How to save your work on GitHub',
              'Best practices for working with Claude Code',
            ],
            message: 'Congratulations! Start building! Create a prototype, share it with your team, and iterate. Claude Code is a tool to speed up your ideas—have fun with it!',
          },
        ],
      },
    ],
    lessonCount: 23,
    content: `
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Welcome to Claude Code Learning Path for Designers</h2>
      <p class="text-lg text-gray-700 mb-8">Claude Code is an AI-powered development tool that lets you build interactive prototypes, test design ideas in code, and collaborate with developers. Now with bidirectional Figma MCP integration — design-to-code and code-to-design. <strong>Complete this course in 39 minutes and go from zero to confident.</strong></p>

      <h3 class="text-3xl font-bold text-gray-900 mt-12 mb-3">What You'll Learn</h3>
      <p class="text-lg text-gray-700 mb-8">This learning path is structured in 5 sequential modules that build on each other. Complete all lessons in order for the best learning experience.</p>

      <!-- Enhanced Module Flow with Visual Hierarchy - Black & White Design -->
      <div class="mb-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <!-- Module 1: Setup -->
          <div class="group relative">
            <div class="flex flex-col h-full p-6 bg-white border-2 border-gray-900 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white font-bold text-lg mb-6 mx-auto">1</div>
              <h4 class="text-lg font-bold text-gray-900 mb-3 text-center">Setup</h4>
              <p class="text-sm text-gray-700 flex-grow text-center">Prepare your environment and get your API key ready</p>
              <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="text-xs font-semibold uppercase tracking-wide text-gray-900 border border-gray-900 px-3 py-1 rounded text-center block">Foundation</div>
              </div>
            </div>
            <div class="hidden lg:flex absolute -right-5 top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 1.5rem; height: 1.5rem;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          <!-- Module 2: Figma ↔ Code -->
          <div class="group relative">
            <div class="flex flex-col h-full p-6 bg-white border-2 border-gray-900 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white font-bold text-lg mb-6 mx-auto">2</div>
              <h4 class="text-lg font-bold text-gray-900 mb-3 text-center">Figma ↔ Code</h4>
              <p class="text-sm text-gray-700 flex-grow text-center">Design-to-code and code-to-design with Figma MCP</p>
              <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="text-xs font-semibold uppercase tracking-wide text-gray-900 border border-gray-900 px-3 py-1 rounded text-center block">Design-to-Code</div>
              </div>
            </div>
            <div class="hidden lg:flex absolute -right-5 top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 1.5rem; height: 1.5rem;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          <!-- Module 3: Prototype -->
          <div class="group relative">
            <div class="flex flex-col h-full p-6 bg-white border-2 border-gray-900 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white font-bold text-lg mb-6 mx-auto">3</div>
              <h4 class="text-lg font-bold text-gray-900 mb-3 text-center">Prototype</h4>
              <p class="text-sm text-gray-700 flex-grow text-center">Create your first interactive prototype with AI</p>
              <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="text-xs font-semibold uppercase tracking-wide text-gray-900 border border-gray-900 px-3 py-1 rounded text-center block">Build</div>
              </div>
            </div>
            <div class="hidden lg:flex absolute -right-5 top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 1.5rem; height: 1.5rem;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          <!-- Module 4: GitHub -->
          <div class="group relative">
            <div class="flex flex-col h-full p-6 bg-white border-2 border-gray-900 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white font-bold text-lg mb-6 mx-auto">4</div>
              <h4 class="text-lg font-bold text-gray-900 mb-3 text-center">GitHub</h4>
              <p class="text-sm text-gray-700 flex-grow text-center">Save and share your work with version control</p>
              <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="text-xs font-semibold uppercase tracking-wide text-gray-900 border border-gray-900 px-3 py-1 rounded text-center block">Collaborate</div>
              </div>
            </div>
            <div class="hidden lg:flex absolute -right-5 top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 1.5rem; height: 1.5rem;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          <!-- Module 5: Best Practices -->
          <div class="group relative">
            <div class="flex flex-col h-full p-6 bg-white border-2 border-gray-900 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white font-bold text-lg mb-6 mx-auto">5</div>
              <h4 class="text-lg font-bold text-gray-900 mb-3 text-center">Best Practices</h4>
              <p class="text-sm text-gray-700 flex-grow text-center">Learn professional workflows and optimization techniques</p>
              <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="text-xs font-semibold uppercase tracking-wide text-gray-900 border border-gray-900 px-3 py-1 rounded text-center block">Master</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Info - Black & White -->
        <div class="mt-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-900">
          <div class="flex items-center justify-center flex-wrap gap-12">
            <div class="text-center">
              <p class="text-xs font-semibold uppercase tracking-wide text-gray-600">Modules</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">5</p>
            </div>
            <div class="text-center">
              <p class="text-xs font-semibold uppercase tracking-wide text-gray-600">Lessons</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">23</p>
            </div>
          </div>
        </div>
      </div>

      <h3 class="text-2xl font-bold text-gray-900 mt-12 mb-6">What's in Each Module?</h3>
      <div class="overflow-x-auto mb-12">
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b-2 border-gray-900">
              <th class="text-left py-3 px-4 font-bold text-gray-900">Module</th>
              <th class="text-left py-3 px-4 font-bold text-gray-900">Description</th>
              <th class="text-left py-3 px-4 font-bold text-gray-900">Key Topics</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-gray-200">
              <td class="py-4 px-4 text-gray-900 font-semibold align-top">1. Setup</td>
              <td class="py-4 px-4 text-gray-700 align-top">Prepare your environment for success</td>
              <td class="py-4 px-4 text-gray-700 align-top">
                <ul class="space-y-1">
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Create an Anthropic account and get your API key</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Install Node.js on your computer</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Install and verify Claude Code</span></li>
                </ul>
              </td>
            </tr>
            <tr class="border-b border-gray-200">
              <td class="py-4 px-4 text-gray-900 font-semibold align-top">2. Figma ↔ Code</td>
              <td class="py-4 px-4 text-gray-700 align-top">Design-to-code and code-to-design with Figma MCP</td>
              <td class="py-4 px-4 text-gray-700 align-top">
                <ul class="space-y-1">
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Set up the Figma MCP server (desktop and remote)</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Turn Figma frames into working code</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Bring code back to Figma with Code to Canvas</span></li>
                </ul>
              </td>
            </tr>
            <tr class="border-b border-gray-200">
              <td class="py-4 px-4 text-gray-900 font-semibold align-top">3. Prototype</td>
              <td class="py-4 px-4 text-gray-700 align-top">Build your first interactive project</td>
              <td class="py-4 px-4 text-gray-700 align-top">
                <ul class="space-y-1">
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Launch Claude Code and start your first session</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Create a working prototype from scratch</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Test and iterate on your design</span></li>
                </ul>
              </td>
            </tr>
            <tr class="border-b border-gray-200">
              <td class="py-4 px-4 text-gray-900 font-semibold align-top">4. GitHub</td>
              <td class="py-4 px-4 text-gray-700 align-top">Save and collaborate on your work</td>
              <td class="py-4 px-4 text-gray-700 align-top">
                <ul class="space-y-1">
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Initialize Git and create a GitHub repository</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Commit and push your prototype code</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Learn version control best practices</span></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td class="py-4 px-4 text-gray-900 font-semibold align-top">5. Best Practices</td>
              <td class="py-4 px-4 text-gray-700 align-top">Master professional workflows</td>
              <td class="py-4 px-4 text-gray-700 align-top">
                <ul class="space-y-1">
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Write clear, specific prompts for better results</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Test across browsers and devices</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Hand off work to developers professionally</span></li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-2xl font-bold text-gray-900 mt-12 mb-4">Getting Started</h3>
      <p class="text-gray-700 mb-4">Choose the path that fits your needs:</p>
      <ul class="space-y-3 mb-8">
        <li class="p-4 bg-gray-50 rounded-lg text-gray-700"><strong class="text-gray-900">New to Claude Code?</strong> Start at the beginning and follow through sequentially to complete all lessons.</li>
        <li class="p-4 bg-gray-50 rounded-lg text-gray-700"><strong class="text-gray-900">Already have Claude Code installed?</strong> Jump straight to "Your First Prototype" and get hands-on immediately.</li>
        <li class="p-4 bg-gray-50 rounded-lg text-gray-700"><strong class="text-gray-900">Use Figma?</strong> Jump to Module 2 to connect your Figma designs directly to Claude Code via MCP — both design-to-code and code-to-design.</li>
        <li class="p-4 bg-gray-50 rounded-lg text-gray-700"><strong class="text-gray-900">Learn at your own pace</strong> — Pause between sections to practice and experiment with what you learned.</li>
      </ul>

      <div class="p-6 bg-gray-900 text-white rounded-lg">
        <h3 class="text-xl font-bold mb-2">Ready to Get Started?</h3>
        <p>Jump in and begin your Claude Code journey! Start with the first module or jump to where you need help.</p>
      </div>
    `,
    relatedPatterns: ['Contextual Assistance', 'Augmented Creation'],
  },
  {
    id: 'cursor-course',
    slug: 'cursor-learning-path',
    title: 'Cursor Guide for Designers',
    description: 'Master Cursor, the AI-powered code editor for designers.',
    excerpt: 'Your complete Cursor education: 12 sequential lessons covering setup, features, and advanced workflows. Unlock faster development with AI pair programming.',
    tool: 'Cursor',
    useCase: 'Learning Path',
    skillLevel: 'Beginner',
    designDomain: 'UX Design',
    readTime: 20,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    status: 'ready',
    thumbnail: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cursor_logo.png',
    tags: ['cursor', 'learning-path', 'getting-started', 'course', 'ai-editor'],
    lessons: [
      {
        id: 'lesson-1',
        title: 'Download and Install Cursor',
        duration: 2,
        order: 1,
        module: 'setup',
        sections: [
          {
            type: 'intro',
            content: 'Cursor is a modern code editor built on VS Code, with AI superpowers built right in. Getting it installed is quick and easy. By the end of this lesson, you\'ll have Cursor ready to use.',
            icon: 'download',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'System Requirements',
          },
          {
            type: 'text',
            content: 'Cursor works on Windows, macOS 10.15+, and Linux. You need at least 4 GB of RAM and 2 GB of free disk space. If you can run VS Code, you can run Cursor.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Step 1: Download Cursor',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Go to cursor.com',
                content: 'Visit the official Cursor website in your web browser.',
                icon: 'download',
              },
              {
                number: 2,
                title: 'Choose Your Platform',
                content: 'Click the button for your operating system: Windows, macOS (ARM64 for Apple Silicon or x64 for Intel), or Linux.',
                icon: 'monitor',
              },
              {
                number: 3,
                title: 'Wait for Download',
                content: 'The installer will download (usually 200-300 MB). This takes 1-5 minutes depending on your internet speed.',
                icon: 'download',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Step 2: Install Cursor',
          },
          {
            type: 'text',
            content: 'Once downloaded, the installation process depends on your operating system:',
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'On macOS',
          },
          {
            type: 'list',
            items: [
              'Double-click the .dmg file you downloaded',
              'Drag the Cursor icon to the Applications folder',
              'Wait for the copy to complete',
              'Open Applications folder and double-click Cursor to launch',
            ],
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'On Windows',
          },
          {
            type: 'list',
            items: [
              'Double-click the .exe installer file',
              'Click "Install" when the installer opens',
              'Choose your installation location (default is fine)',
              'Wait for the installation to complete',
              'Click "Launch" to open Cursor',
            ],
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'On Linux',
          },
          {
            type: 'list',
            items: [
              'Make the .AppImage executable: chmod +x cursor-*.AppImage',
              'Run it: ./cursor-*.AppImage',
              'Or use your package manager if available for your distro',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Step 3: Set Up Your Account',
          },
          {
            type: 'text',
            content: 'When Cursor launches for the first time, you\'ll see a welcome screen.',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Create or Sign In',
                content: 'Click "Sign up" to create a free Cursor account, or log in if you already have one.',
                icon: 'user',
              },
              {
                number: 2,
                title: 'Verify Your Email',
                content: 'Check your email inbox and click the verification link.',
                icon: 'mail',
              },
              {
                number: 3,
                title: 'Choose Your Plan',
                content: 'You\'ll automatically get a one-week Pro trial with full features. Explore everything! After the trial, the Free plan stays active.',
                icon: 'star',
              },
            ],
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Welcome to Cursor!',
            content: 'You now have Cursor installed and a one-week free trial of the Pro plan. This gives you access to all features—Tab completions, Chat, Composer, Agent mode, and more. Use this time to explore and see what\'s possible with AI-powered development.',
            icon: 'success',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Optional: Bring Over Your VS Code Settings',
          },
          {
            type: 'text',
            content: 'If you use VS Code already, you can import your settings, keybindings, and extensions:',
          },
          {
            type: 'list',
            items: [
              'Open Cursor',
              'Go to Settings (Cmd+, on Mac, Ctrl+, on Windows)',
              'Search for "Import"',
              'Follow the prompts to import from VS Code',
            ],
          },
          {
            type: 'completion',
            title: 'Installation Complete!',
            items: [
              'Cursor is installed on your computer',
              'Your account is set up and verified',
              'You have a one-week Pro trial',
              'All AI features are ready to use',
            ],
            message: 'Congratulations! You\'re ready to meet the Cursor interface and start learning AI-powered coding.',
          },
        ],
      },
      {
        id: 'lesson-2',
        title: 'Navigate the Interface',
        duration: 2,
        order: 2,
        module: 'setup',
        sections: [
          {
            type: 'intro',
            content: 'Cursor looks and feels like VS Code—because it\'s built on it. But it adds AI tools you won\'t find anywhere else. Let\'s explore where everything is.',
            icon: 'compass',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'The Main Layout',
          },
          {
            type: 'text',
            content: 'When you open Cursor, you\'ll see the familiar VS Code layout. The interface has these main areas:',
          },
          {
            type: 'list',
            items: [
              '**Left Sidebar**: File explorer, search, Git, and extensions',
              '**Main Editor**: Where your code lives. Open multiple files in tabs.',
              '**Right Side Panels**: Chat panel (AI assistant) and other tools',
              '**Bottom Panel**: Terminal, problems, output, and debug info',
            ],
          },
          {
            type: 'image',
            src: '/images/guides/cursor-learning-path/lesson-2/cursor-interface-layout.png',
            alt: 'Cursor interface layout showing sidebar, editor, chat panel, and terminal areas with labeled annotations',
            label: 'Overview of the main Cursor interface with AI-specific elements highlighted',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'AI-Specific Elements',
          },
          {
            type: 'text',
            content: 'Cursor adds special UI elements for AI features. Here\'s what\'s unique:',
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'The Chat Panel (Right Side)',
          },
          {
            type: 'text',
            content: 'This is your AI assistant. Open it with Cmd+L (Mac) or Ctrl+L (Windows). Ask questions, explain errors, or get code suggestions. You can close and reopen it anytime.',
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'The Prompt Bars',
          },
          {
            type: 'text',
            content: 'Three quick ways to invoke AI:',
          },
          {
            type: 'list',
            items: [
              '**Cmd+L (Chat)**: Ask AI a question in the Chat panel',
              '**Cmd+K (Inline Edit)**: Highlight code and press Cmd+K to edit it with natural language',
              '**Tab (Autocomplete)**: Start typing and the AI suggests the next line(s)',
            ],
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'Composer (Cmd+I)',
          },
          {
            type: 'text',
            content: 'This is your multi-file AI editor. It can create or modify multiple files at once. Opens as a floating window or full-screen mode. Perfect for generating entire components or features.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Essential Keyboard Shortcuts',
          },
          {
            type: 'text',
            content: 'Memorizing these will supercharge your workflow:',
          },
          {
            type: 'list',
            items: [
              '**Cmd+L** (Mac) / **Ctrl+L** (Windows): Open Chat panel',
              '**Cmd+K** / **Ctrl+K**: Inline edit with AI (highlight code first)',
              '**Cmd+I** / **Ctrl+I**: Open Composer (floating)',
              '**Cmd+Shift+I** / **Ctrl+Shift+I**: Open Composer (full-screen)',
              '**Cmd+Enter** / **Ctrl+Enter**: Give AI your full codebase as context',
              '**Cmd+P** / **Ctrl+P**: Quick file search and navigation',
              '**Cmd+/** / **Ctrl+**: Toggle comment on selected code',
              '**Tab**: Accept autocomplete suggestion',
              '**Escape**: Reject autocomplete or close panels',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'File Explorer (Left Sidebar)',
          },
          {
            type: 'text',
            content: 'This works just like VS Code. Browse your project files, create folders and files, and drag to organize. The top button opens a folder or creates a new project.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Terminal (Bottom)',
          },
          {
            type: 'text',
            content: 'Click the Terminal tab at the bottom to open the command line. You can run commands, start a dev server, or commit to Git. Press Ctrl+K (or Cmd+K) in the terminal to ask AI to generate a command.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Opening a Project',
          },
          {
            type: 'text',
            content: 'To start working:',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'File menu',
                content: 'Click File → Open Folder',
                icon: 'folder',
              },
              {
                number: 2,
                title: 'Choose your project',
                content: 'Navigate to where your code lives on your computer',
                icon: 'search',
              },
              {
                number: 3,
                title: 'Click Open',
                content: 'Cursor loads your project and shows all files in the left sidebar',
                icon: 'check',
              },
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            title: 'Pro Tip',
            content: 'You can also drag a folder onto the Cursor icon in your dock (Mac) or taskbar (Windows) to open it instantly.',
            icon: 'info',
          },
          {
            type: 'completion',
            title: 'Interface Mastery!',
            items: [
              'You understand the main layout and panels',
              'You know where the AI tools are (Chat, Composer, prompts)',
              'You\'ve learned the essential keyboard shortcuts',
              'You can open projects and navigate files',
            ],
            message: 'You\'re now comfortable navigating Cursor. Next, we\'ll learn how to edit code with AI assistance.',
          },
        ],
      },
      {
        id: 'lesson-3',
        title: 'Edit Code with AI Assistance',
        duration: 2,
        order: 3,
        module: 'setup',
        sections: [
          {
            type: 'intro',
            content: 'Now that you\'re comfortable in Cursor, let\'s learn the basics of editing code. You\'ll use the same tools as VS Code—but with AI magic behind the scenes.',
            icon: 'code',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Creating Your First File',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Open a project folder',
                content: 'File → Open Folder, then select a project or create a new folder',
                icon: 'folder',
              },
              {
                number: 2,
                title: 'Create a new file',
                content: 'In the left sidebar, right-click in the file explorer and select "New File"',
                icon: 'file',
              },
              {
                number: 3,
                title: 'Name it',
                content: 'Type a filename like "app.js" or "component.jsx". Cursor recognizes the file type by the extension.',
                icon: 'edit',
              },
              {
                number: 4,
                title: 'Start typing',
                content: 'Start writing code. You\'ll see autocomplete suggestions appear.',
                icon: 'keyboard',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Basic Editing Features (Just Like VS Code)',
          },
          {
            type: 'text',
            content: 'Cursor inherits all of VS Code\'s powerful editing features:',
          },
          {
            type: 'list',
            items: [
              '**Multi-cursor editing**: Hold Alt and click to place multiple cursors, then type once and edit multiple lines at once',
              '**Find and Replace**: Cmd+F (Mac) or Ctrl+F (Windows) to find text, Cmd+H to find and replace',
              '**Select code blocks**: Click the icon next to a function/class to expand/collapse it',
              '**Split view**: Drag a tab to the right edge to see two files side-by-side',
              '**Multiple tabs**: Open as many files as you want. Click tabs to switch between them',
              '**Auto-save**: By default, files save automatically (look for the dot on the tab to see unsaved changes)',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Git Integration (Version Control)',
          },
          {
            type: 'text',
            content: 'Cursor includes built-in Git support. Click the Git icon (branch symbol) in the left sidebar:',
          },
          {
            type: 'list',
            items: [
              'See which files changed (Source Control panel)',
              'Stage files by clicking the + button',
              'Write a commit message',
              'Click the checkmark to commit',
              'Push or pull from the command palette (Cmd+P)',
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            title: 'What\'s Git?',
            content: 'Git tracks changes to your code over time. Think of it like "save history" for programming. It\'s essential for collaboration and backup.',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Extensions (Add-ons)',
          },
          {
            type: 'text',
            content: 'Cursor uses the same VS Code extensions. Popular ones for designers include:',
          },
          {
            type: 'list',
            items: [
              '**Prettier**: Auto-formats your code to look clean',
              '**ESLint**: Catches code mistakes before they cause problems',
              '**Live Server**: Preview your code in a browser automatically',
              '**Thunder Client**: Test APIs without leaving the editor',
              '**Tailwind CSS IntelliSense**: Smart suggestions for Tailwind classes',
            ],
          },
          {
            type: 'text',
            content: 'To install extensions, click the Extensions icon (puzzle piece) on the left sidebar and search for what you need.',
          },
          {
            type: 'completion',
            title: 'Editing Fundamentals Ready!',
            items: [
              'You can create and edit files in Cursor',
              'You understand multi-cursor editing and find/replace',
              'You know how to use split view to see multiple files',
              'You\'re aware of Git for version control',
              'You can install extensions to customize your environment',
            ],
            message: 'Great! You now have the foundation to work with code. Next, we\'ll explore the AI features that make Cursor special.',
          },
        ],
      },
      {
        id: 'lesson-4',
        title: 'Use Tab Completions',
        duration: 2,
        order: 4,
        module: 'prototype',
        sections: [
          {
            type: 'intro',
            content: 'Tab autocomplete is Cursor\'s most powerful feature for speed. As you type, it predicts what comes next—often multiple lines at a time. The AI learns from your code and patterns.',
            icon: 'zap',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'How Tab Autocomplete Works',
          },
          {
            type: 'text',
            content: 'Start typing code. After a few characters, a suggestion appears grayed out. This is Cursor\'s AI predicting your next line(s). Press Tab to accept it.',
          },
          {
            type: 'image',
            src: '/images/guides/cursor-learning-path/lesson-4/tab-completion.png',
            alt: 'Cursor editor showing multi-line gray text suggestion as you type, demonstrating Tab autocomplete feature',
            label: 'Real Cursor Tab autocomplete with multi-line gray suggestions',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Accepting and Rejecting Suggestions',
          },
          {
            type: 'list',
            items: [
              '**Tab**: Accept the entire suggestion',
              '**Escape**: Reject and dismiss the suggestion',
              '**Ctrl+→ (or Cmd+→)**: Accept just the next word',
              '**Delete**: Clear the suggestion and keep typing your own code',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Pro Tips for Better Suggestions',
          },
          {
            type: 'text',
            content: 'The better context Cursor has, the better its suggestions:',
          },
          {
            type: 'list',
            items: [
              '**Write clear comments**: If you write "// Create a button with onClick handler", Cursor will suggest the code to match',
              '**Follow naming patterns**: Consistent names help Cursor predict what you\'re building',
              '**Keep related code nearby**: Don\'t spread imports and usage far apart',
              '**Write function signatures first**: Define the function name and parameters, Cursor suggests the body',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Example: React Component',
          },
          {
            type: 'text',
            content: 'Type this and watch Cursor autocomplete the component:',
          },
          {
            type: 'code',
            code: 'function Button({ label, onClick }) {',
            language: 'javascript',
            label: 'Start typing this...',
          },
          {
            type: 'text',
            content: 'Cursor will suggest the rest: return statement, Tailwind classes, etc.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Free vs Pro: Autocomplete Limits',
          },
          {
            type: 'text',
            content: 'On the Free plan, you get basic autocomplete. The Pro plan ($20/month) includes unlimited tab completions and longer context windows for smarter suggestions.',
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Pro Tip',
            content: 'Tab autocomplete works best on straightforward, predictable code (components, loops, API calls). For complex logic, use Chat (Cmd+L) instead.',
            icon: 'success',
          },
          {
            type: 'completion',
            title: 'Autocomplete Mastered!',
            items: [
              'You understand how Tab autocomplete predicts code',
              'You can accept, reject, and control suggestions',
              'You know how to write code that gets better suggestions',
              'You\'ve seen real examples of autocomplete in action',
            ],
            message: 'Excellent! Tab completion is your speed tool. Next, let\'s meet Chat—your conversational AI assistant.',
          },
        ],
      },
      {
        id: 'lesson-5',
        title: 'Chat with AI (Cmd+L)',
        duration: 2,
        order: 5,
        module: 'prototype',
        sections: [
          {
            type: 'intro',
            content: 'Chat (Cmd+L) is your AI pair programmer. Ask questions, explain errors, request code—it\'s a full conversation. Unlike autocomplete, Chat is perfect for explanations, debugging, and larger tasks.',
            icon: 'chat',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Opening Chat',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Press Cmd+L (Mac) or Ctrl+L (Windows)',
                content: 'The Chat panel opens on the right side.',
                icon: 'keyboard',
              },
              {
                number: 2,
                title: 'Type your question or request',
                content: 'Anything from "What does this function do?" to "Create a form component"',
                icon: 'edit',
              },
              {
                number: 3,
                title: 'Press Enter',
                content: 'Cursor AI responds with an answer, explanation, or code.',
                icon: 'send',
              },
            ],
          },
          {
            type: 'image',
            src: '/images/guides/cursor-learning-path/lesson-5/chat-panel.png',
            alt: 'Real Cursor Chat panel interface showing AI conversation with code context and apply feature',
            label: 'Cursor Chat (Cmd+L) interface with conversation and code suggestions',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Adding Code Context to Chat',
          },
          {
            type: 'text',
            content: 'To ask about specific code, highlight it first, then:',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Highlight code in your editor',
                content: 'Select the code you want to discuss.',
                icon: 'select',
              },
              {
                number: 2,
                title: 'Press Ctrl+L (add to Chat)',
                content: 'On macOS, this is Cmd+L. That code is added to the Chat input.',
                icon: 'add',
              },
              {
                number: 3,
                title: 'Type your question',
                content: 'Now ask about that code: "Why does this error occur?" or "How can I optimize this?"',
                icon: 'edit',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Ask Mode vs Edit Mode',
          },
          {
            type: 'text',
            content: 'Chat has two modes (toggle at the top of the Chat panel):',
          },
          {
            type: 'list',
            items: [
              '**Ask Mode**: Get suggestions and answers without changing your code',
              '**Edit Mode**: Let AI modify your code directly (great for refactoring)',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Example Questions You Can Ask',
          },
          {
            type: 'list',
            items: [
              '"Explain this JavaScript function in simple terms"',
              '"Why am I getting this error? [paste error message]"',
              '"How do I create a React component that does [what you want]?"',
              '"What\'s the best way to style this with Tailwind?"',
              '"Refactor this code to use async/await"',
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            title: 'Pro Tip',
            content: 'Be specific! "Create a button" is vague. "Create a React button component with a blue background, white text, and a hover effect that scales up" gives Cursor much better direction.',
            icon: 'info',
          },
          {
            type: 'completion',
            title: 'Chat Fluency Achieved!',
            items: [
              'You can open Chat and ask questions',
              'You can add code context to your questions',
              'You understand Ask vs Edit mode',
              'You\'re comfortable with the Chat workflow',
            ],
            message: 'Great! Chat is your AI partner for in-depth help. Next, let\'s learn Cmd+K for quick inline edits.',
          },
        ],
      },
      {
        id: 'lesson-6',
        title: 'Make Inline Edits (Cmd+K)',
        duration: 2,
        order: 6,
        module: 'prototype',
        sections: [
          {
            type: 'intro',
            content: 'Cmd+K is your quick-edit tool. Highlight code and press Cmd+K to refactor, fix, or modify it with natural language instructions. No Chat panel needed.',
            icon: 'edit',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'The Cmd+K Workflow',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Highlight code in your editor',
                content: 'Select the code you want to change.',
                icon: 'select',
              },
              {
                number: 2,
                title: 'Press Cmd+K (Mac) or Ctrl+K (Windows)',
                content: 'A prompt bar appears right above your code.',
                icon: 'keyboard',
              },
              {
                number: 3,
                title: 'Type your instruction',
                content: 'Tell the AI what to do: "Make it faster", "Add error handling", "Use Tailwind instead"',
                icon: 'edit',
              },
              {
                number: 4,
                title: 'Press Enter',
                content: 'Cursor edits the code inline and shows you the result.',
                icon: 'check',
              },
            ],
          },
          {
            type: 'image',
            src: '/images/guides/cursor-learning-path/lesson-6/cmdk-inline-edit.png',
            alt: 'Cursor editor showing smart rewrite feature with inline code transformation',
            label: 'Cmd+K inline editing: Smart rewrite transforming selected code',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Example Edits',
          },
          {
            type: 'text',
            content: 'Here\'s what Cmd+K can do. Select the code and try:',
          },
          {
            type: 'code',
            code: 'if (user) { alert("Welcome"); }',
            language: 'javascript',
            label: 'Original code',
          },
          {
            type: 'text',
            content: 'Cmd+K → "Convert to console.log instead of alert"',
          },
          {
            type: 'code',
            code: 'if (user) { console.log("Welcome"); }',
            language: 'javascript',
            label: 'After Cmd+K',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Cmd+K vs Chat (Cmd+L): When to Use Which',
          },
          {
            type: 'text',
            content: 'Both use AI, but for different situations:',
          },
          {
            type: 'list',
            items: [
              '**Cmd+K**: Quick changes to existing code (refactor, fix, adjust)',
              '**Chat (Cmd+L)**: Explanations, debugging, understanding code, creating new code from scratch',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Bonus: Cmd+K in Terminal',
          },
          {
            type: 'text',
            content: 'You can also use Cmd+K in the Terminal (bottom of Cursor) to generate shell commands from natural language:',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Click in the Terminal',
                content: 'Focus the terminal at the bottom of the screen.',
                icon: 'terminal',
              },
              {
                number: 2,
                title: 'Press Cmd+K (Mac) or Ctrl+K (Windows)',
                content: 'A prompt appears in the terminal.',
                icon: 'keyboard',
              },
              {
                number: 3,
                title: 'Describe what you want',
                content: '"Remove all node_modules folders" or "Restart the dev server"',
                icon: 'edit',
              },
              {
                number: 4,
                title: 'Press Enter',
                content: 'Cursor generates and runs the command.',
                icon: 'check',
              },
            ],
          },
          {
            type: 'callout',
            calloutType: 'warning',
            title: 'Review Terminal Commands',
            content: 'Always review terminal commands before pressing Enter. The AI might misunderstand, and bad terminal commands can cause problems.',
            icon: 'warning',
          },
          {
            type: 'completion',
            title: 'Inline Editing Mastered!',
            items: [
              'You can select code and use Cmd+K to edit it',
              'You understand the difference between Cmd+K and Chat',
              'You know how to use Cmd+K in the terminal',
              'You\'re confident with quick, targeted edits',
            ],
            message: 'Perfect! Cmd+K is your speed tool for edits. Next, meet Composer—the power tool for generating entire features.',
          },
        ],
      },
      {
        id: 'lesson-7',
        title: 'Build with Composer',
        duration: 2,
        order: 7,
        module: 'prototype',
        sections: [
          {
            type: 'intro',
            content: 'Composer is Cursor\'s superpower. While Tab handles single suggestions and Chat handles questions, Composer creates entire features—multiple files at once. This is where you build fast.',
            icon: 'sparkles',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Opening Composer',
          },
          {
            type: 'text',
            content: 'Two ways to open Composer:',
          },
          {
            type: 'list',
            items: [
              '**Cmd+I** (floating window): Smaller, dockable window while you work',
              '**Cmd+Shift+I** (full screen): Dedicated workspace, better for complex tasks',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Normal vs Agent Mode',
          },
          {
            type: 'text',
            content: 'Composer has two modes:',
          },
          {
            type: 'list',
            items: [
              '**Normal Mode**: You guide each step. You see the changes and approve them.',
              '**Agent Mode**: AI is autonomous. It gathers context, makes decisions, and iterates. Perfect for complex builds.',
            ],
          },
          {
            type: 'text',
            content: 'Toggle Agent Mode at the top of the Composer panel.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Adding Context to Composer',
          },
          {
            type: 'text',
            content: 'Help Composer understand your project by adding context:',
          },
          {
            type: 'list',
            items: [
              '**@filename**: Reference specific files (e.g., "@app.jsx" to include that file in context)',
              '**#filename**: Add entire files to Composer workspace',
              '**/** menu: Add all open editors, Git changes, PR info, etc.',
              '**Cmd+Enter**: Add your entire codebase to context (powerful!)',
            ],
          },
          {
            type: 'image',
            src: '/images/guides/cursor-learning-path/lesson-7/composer-interface.png',
            alt: 'Composer interface showing @-mentions and context references for multi-file generation',
            label: 'Composer with context added for generating related files',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Example: Create a React Component with Composer',
          },
          {
            type: 'text',
            content: 'Try this prompt in Composer:',
          },
          {
            type: 'code',
            code: 'Create a React card component with image, title, description, and a clickable button. Use Tailwind CSS for styling. Make it responsive. Save as Card.jsx',
            language: 'text',
            label: 'Composer prompt',
          },
          {
            type: 'text',
            content: 'Composer generates the complete component file, ready to use.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'YOLO Mode: Autonomous Iteration',
          },
          {
            type: 'text',
            content: 'Advanced feature: Enable YOLO Mode in settings. It lets Agent Mode:',
          },
          {
            type: 'list',
            items: [
              'Automatically run tests',
              'Build your code',
              'Fix errors and iterate until everything passes',
              'All without asking you each step',
            ],
          },
          {
            type: 'text',
            content: 'Perfect for rapid prototyping where you just want a working feature ASAP.',
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Pro Tip',
            content: 'Composer works best when you give it context about your project structure and dependencies. More context = better results.',
            icon: 'success',
          },
          {
            type: 'completion',
            title: 'Composer Power Unlocked!',
            items: [
              'You can open Composer in floating or full-screen mode',
              'You understand Normal vs Agent mode',
              'You know how to add context with @-mentions and #-files',
              'You\'ve created multi-file code with Composer',
            ],
            message: 'Excellent! You\'re now an AI developer. Next, we\'ll focus on design-to-code—converting designs into working React components.',
          },
        ],
      },
      {
        id: 'lesson-8',
        title: 'Convert Designs to Components',
        duration: 2,
        order: 8,
        module: 'design-to-code',
        sections: [
          {
            type: 'intro',
            content: 'This is where designers shine. Take a design from Figma (or any source), upload it to Cursor, and watch it transform into working React code. No manual translation needed.',
            icon: 'palette',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'The Design-to-Code Workflow',
          },
          {
            type: 'text',
            content: 'The process is simple:',
          },
          {
            type: 'list',
            items: [
              'Export your design as a screenshot (PNG, JPG)',
              'Open Chat in Cursor (Cmd+L)',
              'Upload the image',
              'Describe what you want (or let Cursor analyze it)',
              'Get working React code with Tailwind styling',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Step-by-Step: Figma Design to React',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Screenshot your design',
                content: 'In Figma, select the component/frame you want to convert. Take a clean screenshot without overlays or UI chrome.',
                icon: 'camera',
              },
              {
                number: 2,
                title: 'Open Chat (Cmd+L)',
                content: 'Open the Chat panel on the right side of Cursor.',
                icon: 'chat',
              },
              {
                number: 3,
                title: 'Upload image',
                content: 'Click the attachment icon or drag the screenshot into Chat.',
                icon: 'paperclip',
              },
              {
                number: 4,
                title: 'Describe or ask',
                content: 'Write: "Convert this design to a React component using Tailwind CSS. Make it responsive and match the design exactly."',
                icon: 'edit',
              },
              {
                number: 5,
                title: 'Get code',
                content: 'Cursor generates React code. Copy it or apply it directly to your project.',
                icon: 'code',
              },
            ],
          },
          {
            type: 'image',
            src: '/images/guides/cursor-learning-path/lesson-8/figma-to-react-new.png',
            alt: 'Cursor Chat showing code suggestions with apply button to accept generated React code from design',
            label: 'Cursor accepting and applying generated code from design input',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Iterative Refinement',
          },
          {
            type: 'text',
            content: 'The first version rarely perfect. Refine it:',
          },
          {
            type: 'list',
            items: [
              'Say "Make the button red instead of blue"',
              'Ask "Can you add an icon to the left of the text?"',
              'Request "Adjust spacing to match the design more closely"',
              'Each time, Cursor updates the code',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Pro Tips for Better Conversions',
          },
          {
            type: 'list',
            items: [
              '**Clear backgrounds**: Screenshot on a clean background for better AI understanding',
              '**High resolution**: Use clear, high-quality images',
              '**One component per screenshot**: Don\'t mix multiple designs in one image',
              '**Describe your stack**: Tell Cursor what framework/version you\'re using',
              '**Provide context**: Reference existing design tokens or style files in your project',
              '**Use Composer for multi-component**: Use Composer (Cmd+I) to generate a whole page with multiple components',
            ],
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Designer Superpower',
            content: 'You just converted a design to working code in minutes instead of hours. This is what AI development looks like for designers.',
            icon: 'success',
          },
          {
            type: 'completion',
            title: 'Design-to-Code Ninja!',
            items: [
              'You can convert Figma designs to React components',
              'You understand the iterative refinement process',
              'You know how to provide good context and descriptions',
              'You\'ve experienced the design-to-code workflow',
            ],
            message: 'Amazing! You now bridge design and code. Next, let\'s go deeper into frontend development with React and Tailwind.',
          },
        ],
      },
      {
        id: 'lesson-9',
        title: 'Build Frontend with React and Tailwind',
        duration: 2,
        order: 9,
        module: 'design-to-code',
        sections: [
          {
            type: 'intro',
            content: 'React and Tailwind are your power tools for modern web design. Cursor understands both deeply and can generate production-ready components with responsive design.',
            icon: 'rocket',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'React Fundamentals (For Designers)',
          },
          {
            type: 'text',
            content: 'React is JavaScript for building interactive user interfaces. Think of it like components in a design system:',
          },
          {
            type: 'list',
            items: [
              '**Components**: Reusable pieces (Button, Card, Header, etc.)',
              '**Props**: Data you pass to components (like component parameters)',
              '**State**: Data that changes and triggers UI updates',
              '**Events**: Click, hover, submit—interactive behaviors',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Example: Create a React Component with Cursor',
          },
          {
            type: 'text',
            content: 'Use Chat or Composer to generate:',
          },
          {
            type: 'code',
            code: 'Create a React button component with label prop, onClick handler, and styling with Tailwind CSS. Make it blue by default, with red variant. Include hover effects.',
            language: 'text',
            label: 'Your request to Cursor',
          },
          {
            type: 'text',
            content: 'Cursor generates working code immediately. No need to memorize React syntax.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Tailwind CSS: Utility-First Styling',
          },
          {
            type: 'text',
            content: 'Tailwind is CSS made easy for designers. Instead of writing custom CSS, use class names:',
          },
          {
            type: 'code',
            code: '<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">\n  Click me\n</button>',
            language: 'jsx',
            label: 'Tailwind classes for styling',
          },
          {
            type: 'text',
            content: 'bg-blue-500 = blue background, text-white = white text, px-4 = horizontal padding, hover:bg-blue-600 = darker on hover.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: '"Vibe Coding": Describe, Don\'t Code',
          },
          {
            type: 'text',
            content: 'The beauty of AI development: describe what you want, not how to code it.',
          },
          {
            type: 'list',
            items: [
              'Bad: "Use flexbox with justify-content center"',
              'Good: "Center items horizontally"',
              'Better: "Create a responsive grid of cards that show 3 columns on desktop, 2 on tablet, 1 on mobile"',
            ],
          },
          {
            type: 'text',
            content: 'Cursor translates your intent into Tailwind classes automatically.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Responsive Design (Mobile-First)',
          },
          {
            type: 'text',
            content: 'Build for mobile first, then enhance for bigger screens. Tailwind makes this easy:',
          },
          {
            type: 'code',
            code: '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">\n  {/* Cards go here */}\n</div>',
            language: 'jsx',
            label: 'Responsive grid: 1 column base, 2 on medium, 3 on large',
          },
          {
            type: 'code',
            code: 'export default function ProductCard({ image, title, price }) {\n  return (\n    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">\n      <img src={image} alt={title} className="w-full h-48 object-cover" />\n      <div className="p-4">\n        <h3 className="text-lg font-bold text-gray-900">{title}</h3>\n        <p className="text-2xl text-blue-600 font-semibold mt-2">${price}</p>\n        <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">\n          Add to Cart\n        </button>\n      </div>\n    </div>\n  );\n}',
            language: 'jsx',
            label: 'Complete product card component with Tailwind styling',
          },
          {
            type: 'image',
            src: '/images/guides/cursor-learning-path/lesson-9/react-tailwind.png',
            alt: 'Cursor editor showing generated React code example with syntax highlighting and component structure',
            label: 'Cursor generating React component code with Tailwind styling',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Accessibility: Important!',
          },
          {
            type: 'text',
            content: 'Cursor can generate accessible code. Just ask:',
          },
          {
            type: 'list',
            items: [
              '"Make sure this component is accessible (WCAG)"',
              '"Add proper alt text to images"',
              '"Ensure keyboard navigation works"',
              'Cursor adds aria labels, semantic HTML, and proper contrast',
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            title: 'Design System in .cursorrules',
            content: 'Create a .cursorrules file with your design tokens (colors, spacing, fonts). Cursor uses this to generate code that matches your brand automatically.',
            icon: 'info',
          },
          {
            type: 'completion',
            title: 'React & Tailwind Mastered!',
            items: [
              'You understand React components and props',
              'You know Tailwind utility classes for styling',
              'You can generate responsive, accessible components',
              'You\'re comfortable with "vibe coding"',
            ],
            message: 'Great! You can now build responsive, production-ready frontends with AI. Next, let\'s customize Cursor for your specific needs.',
          },
        ],
      },
      {
        id: 'lesson-10',
        title: 'Customize Your Workspace',
        duration: 2,
        order: 10,
        module: 'practices',
        sections: [
          {
            type: 'intro',
            content: 'Cursor is yours to customize. Set it up exactly how you work. Personalization makes you faster and happier.',
            icon: 'settings',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Editor Settings',
          },
          {
            type: 'text',
            content: 'Customize the look and feel:',
          },
          {
            type: 'list',
            items: [
              '**Theme**: Dark, light, or custom (Settings → Theme)',
              '**Font**: Change font family and size',
              '**Keybindings**: Remap keys to match your muscle memory',
              '**Tabs vs Spaces**: Choose your indentation style',
              '**Auto-save**: Enable/disable automatic saving',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Extensions: Power Up Your Editor',
          },
          {
            type: 'text',
            content: 'Extensions add capabilities. Click the Extensions icon (puzzle) in the left sidebar:',
          },
          {
            type: 'list',
            items: [
              '**Prettier**: Auto-format code to be clean and consistent',
              '**ESLint**: Catch code errors and style issues',
              '**Tailwind CSS IntelliSense**: Smart Tailwind class suggestions',
              '**Thunder Client**: Test APIs without leaving Cursor',
              '**Live Server**: Preview changes in browser in real-time',
              '**GitHub Copilot** (optional): Add GitHub\'s Copilot alongside Cursor\'s AI',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: '.cursorrules: Train Your AI',
          },
          {
            type: 'text',
            content: 'Create a .cursorrules file in your project root with instructions for the AI:',
          },
          {
            type: 'code',
            code: '# Design System\nUse Tailwind CSS for all styling. Primary color: blue-600. Secondary: gray-900.\n\n# Components\nAll components go in /components directory. Use PascalCase for names.\n\n# Testing\nWrite tests for all components using Vitest.\n\n# Best Practices\n- Use functional components with hooks\n- Keep components under 200 lines\n- Add proper error handling\n- Make components responsive\n- Include accessibility (WCAG AA)',
            language: 'text',
            label: '.cursorrules example',
          },
          {
            type: 'text',
            content: 'Cursor reads this file and uses it to guide code generation. Whenever it generates code, it follows your rules.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Rules for AI: Chat Settings',
          },
          {
            type: 'text',
            content: 'Go to Settings → Features → Chat & Composer → Rules for AI. Add custom instructions:',
          },
          {
            type: 'list',
            items: [
              '"Always add comments to complex code"',
              '"Prefer modern React hooks over class components"',
              '"Include TypeScript types"',
              '"Make accessibility a priority"',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Terminal Integration',
          },
          {
            type: 'text',
            content: 'The terminal at the bottom of Cursor is powerful:',
          },
          {
            type: 'list',
            items: [
              'Use Cmd+K to generate shell commands',
              'Run npm scripts, git commands, builds',
              'See output in real-time',
              'Stay in Cursor, no need to switch apps',
            ],
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Pro Tip',
            content: 'Import settings from VS Code if you have them. Cursor will preserve your themes, extensions, and keybindings.',
            icon: 'success',
          },
          {
            type: 'completion',
            title: 'Workspace Customized!',
            items: [
              'You\'ve customized the editor to match your style',
              'You\'ve installed key extensions',
              'You\'ve created a .cursorrules file for your project',
              'You understand Rules for AI in settings',
            ],
            message: 'Perfect! Cursor is now set up exactly how you work. Next, let\'s explore advanced AI features.',
          },
        ],
      },
      {
        id: 'lesson-11',
        title: 'Master Advanced Features',
        duration: 2,
        order: 11,
        module: 'practices',
        sections: [
          {
            type: 'intro',
            content: 'You\'ve learned the basics. Now, advanced features that take you to expert level: codebase indexing, multi-model AI, context management, and team collaboration.',
            icon: 'crown',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Codebase Indexing: AI Knows Your Code',
          },
          {
            type: 'text',
            content: 'When you open a project, Cursor automatically indexes it. The AI scans every file and creates a semantic understanding of your codebase. This is why it can suggest relevant code from anywhere in your project.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: '@-Mentions: Direct Context',
          },
          {
            type: 'text',
            content: 'In Chat or Composer, use @-mentions to reference specific files or symbols:',
          },
          {
            type: 'list',
            items: [
              '**@filename.jsx**: Reference a specific file',
              '**@functionName**: Reference a specific function',
              '**@className**: Reference a class',
              'Type @ and see all available options',
            ],
          },
          {
            type: 'image',
            src: '/images/guides/cursor-learning-path/lesson-11/at-mentions.png',
            alt: 'Cursor Chat showing @-mentions context menu with available files and symbols for reference',
            label: 'Real @-mentions context menu in Cursor Chat for adding codebase context',
          },
          {
            type: 'text',
            content: 'This tells the AI exactly what to consider when generating code.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Multi-Model AI: Choose Your Brain',
          },
          {
            type: 'text',
            content: 'Cursor supports multiple AI models. Switch between them in the Chat panel:',
          },
          {
            type: 'list',
            items: [
              '**Claude 3.5 Sonnet** (Anthropic): Best for analysis and refactoring',
              '**GPT-4o** (OpenAI): Great for creative code generation',
              '**Gemini** (Google): Good for general tasks',
              '**xAI models**: Latest experimental models',
            ],
          },
          {
            type: 'text',
            content: 'Different models excel at different tasks. Feel free to try different ones for different work.',
          },
          {
            type: 'code',
            code: '# .cursorrules - Tell Cursor about your project\n\nYou are an expert React developer working on a design system.\n\n## Code Style\n- Use TypeScript with strict mode\n- Use Tailwind CSS for styling (never write raw CSS)\n- Follow functional components with hooks\n- Component exports should be default exports\n\n## Design System\n- Primary color: #0066FF (blue-600)\n- Spacing: Use Tailwind spacing scale (gap-4, p-2, etc.)\n- Fonts: Use system fonts (font-sans) or Inter\n\n## Naming Conventions\n- Components: PascalCase (Button, Card, Header)\n- Variables: camelCase (buttonText, cardContent)\n- Files: kebab-case (button.jsx, card.jsx)\n\n## Testing\n- Always add JSDoc comments\n- Make components responsive mobile-first',
            language: 'markdown',
            label: 'Example .cursorrules file for a design system project',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Privacy Mode: Your Code Stays Private',
          },
          {
            type: 'text',
            content: 'Pro feature ($20/month): Enable Privacy Mode in Settings. Your code is never:',
          },
          {
            type: 'list',
            items: [
              'Sent to AI providers for training',
              'Logged or stored on servers',
              'Used to improve AI models',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Context Management: Work Smarter',
          },
          {
            type: 'text',
            content: 'AI works better with relevant context. Strategies:',
          },
          {
            type: 'list',
            items: [
              '**Close tabs**: Only open files you\'re actively using',
              '**Use @-mentions**: Reference specific files instead of context-dumping',
              '**Provide .cursorrules**: Let your project guidelines guide the AI',
              '**Use Cmd+Enter for full context**: When you truly need codebase-wide understanding',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Bugbot: AI Code Review',
          },
          {
            type: 'text',
            content: 'Advanced feature: Bugbot automatically reviews your GitHub PRs and suggests improvements:',
          },
          {
            type: 'list',
            items: [
              'Detects bugs and logic errors',
              'Suggests security fixes',
              'Recommends performance improvements',
              '​One-click "Fix in Cursor" to apply suggestions',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Team Features (Cursor Teams/Enterprise)',
          },
          {
            type: 'text',
            content: 'For teams ($40/user/month):',
          },
          {
            type: 'list',
            items: [
              'Shared .cursorrules across team',
              'Centralized billing and usage tracking',
              'SSO authentication',
              'Team-wide privacy settings',
              'Collaboration features',
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            title: 'Pro Tip',
            content: 'Always review AI-generated code before using it. AI is fast, but human judgment catches edge cases and security issues.',
            icon: 'info',
          },
          {
            type: 'completion',
            title: 'Advanced Features Unlocked!',
            items: [
              'You understand codebase indexing and how AI knows your code',
              'You can use @-mentions for precise context',
              'You know how to switch between multiple AI models',
              'You\'re aware of privacy features and team collaboration',
            ],
            message: 'Excellent! You\'re now using Cursor like an expert. The final lesson covers best practices and team workflows.',
          },
        ],
      },
      {
        id: 'lesson-12',
        title: 'Best Practices and Team Workflows',
        duration: 2,
        order: 12,
        module: 'practices',
        sections: [
          {
            type: 'intro',
            content: 'You\'ve learned the tools. Now, the philosophy: how to work WITH AI, not just use it. This is about sustainable, high-quality development.',
            icon: 'lightbulb',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Write Effective Prompts',
          },
          {
            type: 'text',
            content: 'Good prompts = better code. Structure:',
          },
          {
            type: 'list',
            items: [
              '**What**: What do you want? Be specific.',
              '**Context**: What technology/framework? Any constraints?',
              '**Details**: Colors, layout, behavior—the specifics matter.',
              '**Format**: Where should the code go? (component file, inline, etc.)',
            ],
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'Example of a Great Prompt',
          },
          {
            type: 'code',
            code: 'Create a React modal component that:\n- Shows a title and description\n- Has a Close button and a primary action button\n- Uses Tailwind CSS with blue primary button\n- Includes fade-in animation (use framer-motion if available)\n- Is accessible (keyboard support, aria-labels)\n- Saves as Modal.jsx in /components directory',
            language: 'text',
            label: 'Specific, detailed prompt',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Review AI Code Always',
          },
          {
            type: 'text',
            content: 'Never blindly accept AI-generated code:',
          },
          {
            type: 'list',
            items: [
              'Read the code. Understand what it does.',
              'Test it. Does it work as expected?',
              'Check for security: no hardcoded secrets, no SQL injection risks',
              'Performance: Is it efficient? Will it scale?',
              'Accessibility: Can keyboard users navigate? Do images have alt text?',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Test-Driven Development (TDD)',
          },
          {
            type: 'text',
            content: 'Write tests first, let AI implement:',
          },
          {
            type: 'list',
            items: [
              'Write test cases (what your code should do)',
              'Ask Cursor: "Write code that passes these tests"',
              'AI generates implementation',
              'Tests pass? You\'re done. Tests fail? Iterate.',
            ],
          },
          {
            type: 'text',
            content: 'This forces clarity and prevents AI mistakes.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Version Control: Git for Safety',
          },
          {
            type: 'text',
            content: 'Use Git to track changes:',
          },
          {
            type: 'list',
            items: [
              'Commit after each feature, not continuous',
              'Write clear commit messages ("Add Modal component" not "stuff")',
              'Push to GitHub regularly (backup and team visibility)',
              'Use branches for new features (don\'t work on main)',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Treat AI as a Pair Programmer',
          },
          {
            type: 'text',
            content: 'Best workflow: iterative dialogue',
          },
          {
            type: 'list',
            items: [
              'You: "Create a form with name and email fields"',
              'AI: Generates form',
              'You: "Add validation for email format"',
              'AI: Updates code',
              'You: "Make it mobile-responsive"',
              'AI: Refines the code',
            ],
          },
          {
            type: 'text',
            content: 'You\'re the driver. AI is the assistant. Never let AI make decisions without your direction.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Team Workflows',
          },
          {
            type: 'text',
            content: 'For teams using Cursor:',
          },
          {
            type: 'list',
            items: [
              'Share .cursorrules file (design system, code standards)',
              'PR reviews: Have humans and Bugbot review PRs',
              'Code pairing: Use Cursor together for better decisions',
              'Documentation: Let AI generate docs, humans refine them',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'When NOT to Use AI',
          },
          {
            type: 'text',
            content: 'AI isn\'t always the right tool:',
          },
          {
            type: 'list',
            items: [
              'Complex algorithms: AI struggles with novel logic. Think first.',
              'Security-critical code: Always hand-review before deployment',
              'Novel patterns: If you\'re pioneering something, guide AI more carefully',
              'Learning: Sometimes, you should code manually to learn',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Continuous Learning',
          },
          {
            type: 'text',
            content: 'Stay updated:',
          },
          {
            type: 'list',
            items: [
              'Check Cursor changelog (cursor.com/changelog)',
              'Try new features when released',
              'Experiment with different models and prompts',
              'Share learnings with your team',
            ],
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'You\'re Ready!',
            content: 'You\'ve mastered Cursor. You understand the tools, the workflows, and the mindset. Now go build something amazing.',
            icon: 'success',
          },
          {
            type: 'completion',
            title: 'Cursor Mastery Complete!',
            items: [
              'You write effective, specific prompts',
              'You review and test all AI-generated code',
              'You use TDD and Git for quality and safety',
              'You treat AI as a partner, not a replacement',
              'You understand team workflows and best practices',
            ],
            message: 'Congratulations! You\'ve completed the Cursor Learning Path. You\'re now equipped to be a productive, responsible AI developer. Keep experimenting, stay curious, and build amazing things.',
          },
        ],
      },
    ],
    content: `
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Welcome to Cursor Learning Path for Designers</h2>
      <p class="text-lg text-gray-700 mb-8">Cursor is the AI-powered code editor that lets you prototype, code, and collaborate with AI as your pair programmer. <strong>Complete this guide in 24 minutes and go from zero to confident building with AI.</strong></p>

      <h3 class="text-3xl font-bold text-gray-900 mt-12 mb-3">What You'll Learn</h3>
      <p class="text-lg text-gray-700 mb-8">This learning path is structured in 4 sequential modules that build on each other. Complete all lessons in order for the best learning experience.</p>

      <!-- Enhanced Module Flow with Visual Hierarchy - Black & White Design -->
      <div class="mb-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Module 1: Setup -->
          <div class="group relative">
            <div class="flex flex-col h-full p-6 bg-white border-2 border-gray-900 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white font-bold text-lg mb-6 mx-auto">1</div>
              <h4 class="text-lg font-bold text-gray-900 mb-3 text-center">Setup</h4>
              <p class="text-sm text-gray-700 flex-grow text-center">Download, install, and explore Cursor</p>
              <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="text-xs font-semibold uppercase tracking-wide text-gray-900 border border-gray-900 px-3 py-1 rounded text-center block">Foundation</div>
              </div>
            </div>
            <div class="hidden lg:flex absolute -right-5 top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 1.5rem; height: 1.5rem;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          <!-- Module 2: Prototype -->
          <div class="group relative">
            <div class="flex flex-col h-full p-6 bg-white border-2 border-gray-900 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white font-bold text-lg mb-6 mx-auto">2</div>
              <h4 class="text-lg font-bold text-gray-900 mb-3 text-center">AI Features</h4>
              <p class="text-sm text-gray-700 flex-grow text-center">Master Tab, Chat, Cmd+K, and Composer</p>
              <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="text-xs font-semibold uppercase tracking-wide text-gray-900 border border-gray-900 px-3 py-1 rounded text-center block">Build</div>
              </div>
            </div>
            <div class="hidden lg:flex absolute -right-5 top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 1.5rem; height: 1.5rem;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          <!-- Module 3: Design-to-Code -->
          <div class="group relative">
            <div class="flex flex-col h-full p-6 bg-white border-2 border-gray-900 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white font-bold text-lg mb-6 mx-auto">3</div>
              <h4 class="text-lg font-bold text-gray-900 mb-3 text-center">Design-to-Code</h4>
              <p class="text-sm text-gray-700 flex-grow text-center">Convert designs to React with Tailwind</p>
              <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="text-xs font-semibold uppercase tracking-wide text-gray-900 border border-gray-900 px-3 py-1 rounded text-center block">Create</div>
              </div>
            </div>
            <div class="hidden lg:flex absolute -right-5 top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 1.5rem; height: 1.5rem;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          <!-- Module 4: Advanced -->
          <div class="group relative">
            <div class="flex flex-col h-full p-6 bg-white border-2 border-gray-900 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white font-bold text-lg mb-6 mx-auto">4</div>
              <h4 class="text-lg font-bold text-gray-900 mb-3 text-center">Advanced</h4>
              <p class="text-sm text-gray-700 flex-grow text-center">Master customization and best practices</p>
              <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="text-xs font-semibold uppercase tracking-wide text-gray-900 border border-gray-900 px-3 py-1 rounded text-center block">Master</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Info - Black & White -->
        <div class="mt-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-900">
          <div class="flex items-center justify-center flex-wrap gap-12">
            <div class="text-center">
              <p class="text-xs font-semibold uppercase tracking-wide text-gray-600">Modules</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">4</p>
            </div>
            <div class="text-center">
              <p class="text-xs font-semibold uppercase tracking-wide text-gray-600">Lessons</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">12</p>
            </div>
            <div class="text-center">
              <p class="text-xs font-semibold uppercase tracking-wide text-gray-600">Duration</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">24 min</p>
            </div>
          </div>
        </div>
      </div>

      <h3 class="text-2xl font-bold text-gray-900 mt-12 mb-6">What's in Each Module?</h3>
      <div class="overflow-x-auto mb-12">
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b-2 border-gray-900">
              <th class="text-left py-3 px-4 font-bold text-gray-900">Module</th>
              <th class="text-left py-3 px-4 font-bold text-gray-900">Description</th>
              <th class="text-left py-3 px-4 font-bold text-gray-900">Key Topics</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-gray-200">
              <td class="py-4 px-4 text-gray-900 font-semibold align-top">1. Setup</td>
              <td class="py-4 px-4 text-gray-700 align-top">Get Cursor installed and explore the interface</td>
              <td class="py-4 px-4 text-gray-700 align-top">
                <ul class="space-y-1">
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Download and install Cursor for your OS</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Navigate the VS Code-based interface</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Learn basic code editing and Git</span></li>
                </ul>
              </td>
            </tr>
            <tr class="border-b border-gray-200">
              <td class="py-4 px-4 text-gray-900 font-semibold align-top">2. AI Features</td>
              <td class="py-4 px-4 text-gray-700 align-top">Master Cursor's four core AI tools</td>
              <td class="py-4 px-4 text-gray-700 align-top">
                <ul class="space-y-1">
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Tab completions for instant code suggestions</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Chat (Cmd+L) for conversational help</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Cmd+K for inline editing and Composer for multi-file generation</span></li>
                </ul>
              </td>
            </tr>
            <tr class="border-b border-gray-200">
              <td class="py-4 px-4 text-gray-900 font-semibold align-top">3. Design-to-Code</td>
              <td class="py-4 px-4 text-gray-700 align-top">Convert designs to working code</td>
              <td class="py-4 px-4 text-gray-700 align-top">
                <ul class="space-y-1">
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Transform Figma designs to React components</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Build responsive frontends with React and Tailwind</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Rapid prototyping and design iteration</span></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td class="py-4 px-4 text-gray-900 font-semibold align-top">4. Advanced</td>
              <td class="py-4 px-4 text-gray-700 align-top">Leverage advanced Cursor capabilities</td>
              <td class="py-4 px-4 text-gray-700 align-top">
                <ul class="space-y-1">
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Customize with extensions and .cursorrules</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Codebase indexing and @-mentions for smart context</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Best practices for sustainable AI development</span></li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-2xl font-bold text-gray-900 mt-12 mb-4">Getting Started</h3>
      <p class="text-gray-700 mb-4">Choose the path that fits your needs:</p>
      <ul class="space-y-3 mb-8">
        <li class="p-4 bg-gray-50 rounded-lg text-gray-700"><strong class="text-gray-900">New to Cursor?</strong> Start from the beginning and follow sequentially. You'll be building with AI in less than 30 minutes.</li>
        <li class="p-4 bg-gray-50 rounded-lg text-gray-700"><strong class="text-gray-900">Already have Cursor installed?</strong> Jump to Module 2 (AI Features) and start using Tab, Chat, and Composer right away.</li>
        <li class="p-4 bg-gray-50 rounded-lg text-gray-700"><strong class="text-gray-900">Want to design-to-code?</strong> Skip to Module 3 (Design-to-Code) to convert Figma designs to React components immediately.</li>
        <li class="p-4 bg-gray-50 rounded-lg text-gray-700"><strong class="text-gray-900">Build at your own pace</strong> — Each lesson takes 2 minutes. Pause between modules to practice and experiment.</li>
      </ul>

      <div class="p-6 bg-gray-900 text-white rounded-lg">
        <h3 class="text-xl font-bold mb-2">Ready to Get Started?</h3>
        <p>Jump in and begin your Cursor journey! Download Cursor, open the first lesson, and start building with AI.</p>
      </div>
    `,
    relatedPatterns: ['Contextual Assistance', 'Augmented Creation'],
  },
  {
    id: 'copilot-course',
    slug: 'github-copilot-learning-path',
    title: 'GitHub Copilot Guide for Designers',
    description: 'Master GitHub Copilot as a designer—learn to code faster, prototype interactively, and collaborate with developers.',
    excerpt: 'Your complete GitHub Copilot guide for designers: 10 lessons across 4 modules covering setup, code suggestions, prototyping workflows, and developer collaboration.',
    tool: 'GitHub Copilot',
    useCase: 'Learning Path',
    skillLevel: 'Beginner',
    designDomain: 'UX Design',
    readTime: 18,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    status: 'ready',
    thumbnail: 'https://commons.wikimedia.org/wiki/Special:FilePath/Microsoft_365_Copilot_Icon_one-color.svg',
    tags: ['copilot', 'learning-path', 'github', 'ai-coding', 'design-to-code', 'prototyping'],
    lessons: [
      {
        id: 'lesson-1',
        title: 'Install GitHub Copilot',
        duration: 2,
        order: 1,
        module: 'setup',
        sections: [
          { type: 'intro', content: 'Get GitHub Copilot running in minutes. Learn how to install the extension in VS Code and set up your account.', icon: 'download' },
          { type: 'text', content: 'GitHub Copilot is an AI pair programmer that helps you write code faster. As a designer, it\'s a powerful tool for turning your design ideas into interactive prototypes. Let\'s get it installed!' },
          { type: 'heading', level: 'h3', content: 'What You\'ll Need' },
          { type: 'list', items: ['VS Code (free download from code.visualstudio.com)', 'A GitHub account (free at github.com)', 'About 5 minutes'] },
          { type: 'heading', level: 'h3', content: 'Installation Steps' },
          { type: 'steps', steps: [
            { number: 1, title: 'Open VS Code Extensions', content: 'Click the Extensions icon in the left sidebar (looks like four squares), or press Ctrl+Shift+X (Windows) / Cmd+Shift+X (Mac)' },
            { number: 2, title: 'Search for GitHub Copilot', content: 'Type "GitHub Copilot" in the search box and click the first result from GitHub' },
            { number: 3, title: 'Click Install', content: 'Click the green "Install" button. VS Code will download and install the extension.' },
            { number: 4, title: 'Sign in with GitHub', content: 'After installation, you\'ll be prompted to sign in. Click "Sign in with GitHub" and authorize Copilot to use your account.' },
            { number: 5, title: 'You\'re Ready!', content: 'Once signed in, you\'ll see a small Copilot icon in VS Code. You\'re now ready to use AI-powered code suggestions!' }
          ] },
          { type: 'image', src: '/images/guides/github-copilot-learning-path/lesson-1/marketplace.png', alt: 'GitHub Copilot extension in VS Code marketplace with Install button visible', label: 'VS Code Extensions marketplace showing GitHub Copilot extension' },
          { type: 'callout', calloutType: 'info', title: 'About Copilot+', content: 'GitHub Copilot offers a free trial (60 minutes per month). After the trial, it\'s $10/month or $100/year. Individual plans are available—check github.com/copilot/plans for current pricing.' }
        ]
      },
      {
        id: 'lesson-2',
        title: 'Your First Code Suggestion',
        duration: 2,
        order: 2,
        module: 'setup',
        sections: [
          { type: 'intro', content: 'Experience the magic of AI-powered code completions. Get your first suggestion in just a few seconds.', icon: 'code' },
          { type: 'text', content: 'GitHub Copilot learns from what you\'re typing and suggests complete code in real-time. It works best when you give it context—add a comment describing what you want to do.' },
          { type: 'heading', level: 'h3', content: 'Your First AI Suggestion' },
          { type: 'steps', steps: [
            { number: 1, title: 'Create a New File', content: 'In VS Code, click File > New File, or press Ctrl+N (Windows) / Cmd+N (Mac)' },
            { number: 2, title: 'Save as HTML', content: 'Save the file as "index.html" (press Ctrl+S / Cmd+S, type the name, and hit Enter)' },
            { number: 3, title: 'Start with a Comment', content: 'Type this comment: // basic HTML page for a design portfolio' },
            { number: 4, title: 'Press Enter and Wait', content: 'Move to the next line. Copilot will automatically suggest HTML code. You should see gray suggestion text appear.' },
            { number: 5, title: 'Accept the Suggestion', content: 'Press Tab to accept the suggestion, or press Escape to reject it. Try a few suggestions to see what Copilot offers!' }
          ] },
          { type: 'image', src: '/images/guides/github-copilot-learning-path/lesson-2/suggestion.png', alt: 'VS Code editor showing Copilot suggestion for HTML page structure in gray text', label: 'Copilot suggesting HTML structure as you type' },
          { type: 'callout', calloutType: 'tip', title: 'Pro Tip: Better Comments = Better Suggestions', content: 'Copilot works best with clear, descriptive comments. Instead of "make a button," try "create a blue call-to-action button with hover effect." The more detail you provide, the better Copilot\'s suggestions.' }
        ]
      },
      {
        id: 'lesson-3',
        title: 'Workspace Setup for Designers',
        duration: 2,
        order: 3,
        module: 'setup',
        sections: [
          { type: 'intro', content: 'Configure Copilot for your design workflow. Learn settings and shortcuts that make coding faster.', icon: 'cog' },
          { type: 'text', content: 'Every designer codes differently. Let\'s customize VS Code and Copilot to match how you work. We\'ll enable keyboard shortcuts and adjust settings for comfort.' },
          { type: 'heading', level: 'h3', content: 'Essential Settings' },
          { type: 'steps', steps: [
            { number: 1, title: 'Open Settings', content: 'Click File > Preferences > Settings (or Ctrl+, / Cmd+,)' },
            { number: 2, title: 'Search for Copilot', content: 'Type "copilot" in the settings search box' },
            { number: 3, title: 'Enable Inline Suggestions', content: 'Make sure "Copilot: Inline Suggest: Enabled" is checked. This shows gray suggestions as you type.' },
            { number: 4, title: 'Customize Auto-suggestions', content: 'Look for "Copilot: Auto Suggest" and set it to your preference (on, off, or only on demand)' },
            { number: 5, title: 'Save and Restart', content: 'Settings save automatically. Restart VS Code for all changes to take effect.' }
          ] },
          { type: 'code', language: 'json', label: 'Recommended VS Code Settings', code: '{\n  "github.copilot.enable": {\n    "*": true,\n    "plaintext": false,\n    "markdown": false\n  },\n  "editor.inlineSuggest.enabled": true,\n  "editor.inlineSuggest.suppressSuggestions": false,\n  "editor.tabCompletion": "on"\n}' },
          { type: 'heading', level: 'h3', content: 'Key Keyboard Shortcuts' },
          { type: 'list', items: ['Tab = Accept suggestion', 'Escape = Reject suggestion', 'Alt+[ = See previous suggestion', 'Alt+] = See next suggestion', 'Ctrl+Enter / Cmd+Enter = Open Copilot Chat (quick explanations)'] },
          { type: 'callout', calloutType: 'warning', title: 'Privacy Tip', content: 'GitHub Copilot uses your code to improve suggestions. If you work on sensitive projects, you can disable Copilot for those files by adding them to .copilotignore in your project folder.' }
        ]
      },
      {
        id: 'lesson-4',
        title: 'Autocomplete & Code Completions',
        duration: 2,
        order: 4,
        module: 'features',
        sections: [
          { type: 'intro', content: 'Master inline code completions. Let Copilot finish your code while you keep typing.', icon: 'code' },
          { type: 'text', content: 'Autocomplete is Copilot\'s superpower. As you type HTML, CSS, or JavaScript, Copilot predicts what comes next and suggests it in gray. You can accept it (Tab), skip it (Escape), or keep typing to see other suggestions.' },
          { type: 'heading', level: 'h3', content: 'How Autocomplete Works' },
          { type: 'text', content: 'Copilot watches for patterns and context clues: your file type, existing code, comments, and even variable names. The more context you give it, the smarter its suggestions.' },
          { type: 'steps', steps: [
            { number: 1, title: 'Write Clear Comments', content: 'Start with a comment describing what you want to build, like "// responsive navigation bar with hover effects"' },
            { number: 2, title: 'Start the Code', content: 'Type the opening tag or function name: <nav class="navbar">' },
            { number: 3, title: 'Let Copilot Complete It', content: 'Wait a moment. Copilot will suggest the full structure. Use Tab to accept or cycle through suggestions with Alt+]' },
            { number: 4, title: 'Refine If Needed', content: 'If a suggestion isn\'t perfect, edit it. Copilot learns from your edits and improves next time.' }
          ] },
          { type: 'code', language: 'html', label: 'Example: Copilot Completing a Hero Section', code: '<!-- hero section with background image and centered text -->\n<section class="hero">\n  <div class="hero-content">\n    <h1>Welcome to My Design Portfolio</h1>\n    <p>Explore my latest projects and design work</p>\n    <button class="cta-button">View My Work</button>\n  </div>\n</section>\n\n<style>\n  .hero {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    min-height: 400px;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  }\n</style>' },
          { type: 'image', src: '/images/guides/github-copilot-learning-path/lesson-4/autocomplete.png', alt: 'VS Code showing autocomplete suggestion for CSS grid layout styling', label: 'Copilot autocomplete for CSS Grid patterns' },
          { type: 'callout', calloutType: 'success', title: 'Designer Win', content: 'This is huge for prototyping. You describe your design in comments, and Copilot builds the HTML/CSS. From design sketch to code in minutes!' }
        ]
      },
      {
        id: 'lesson-5',
        title: 'Chat for Design Questions',
        duration: 2,
        order: 5,
        module: 'features',
        sections: [
          { type: 'intro', content: 'Ask Copilot questions about code and design. Get instant explanations and suggestions.', icon: 'info' },
          { type: 'text', content: 'Copilot Chat is like having a developer in your editor. When you see code you don\'t understand, or need advice on implementation, open Chat and ask. Copilot will explain code, answer questions, and help you learn.' },
          { type: 'heading', level: 'h3', content: 'Opening Copilot Chat' },
          { type: 'steps', steps: [
            { number: 1, title: 'Open the Chat Panel', content: 'Press Ctrl+Alt+I (Windows) or Cmd+Alt+I (Mac), or click the Copilot icon in the top-right corner of the editor' },
            { number: 2, title: 'Ask Your Question', content: 'Type your question in the chat box at the bottom. Examples: "Explain this CSS Grid code" or "How do I make this button accessible?"' },
            { number: 3, title: 'Get Instant Help', content: 'Copilot responds with an explanation, code snippet, or suggestion. You can ask follow-up questions in the same chat.' }
          ] },
          { type: 'heading', level: 'h3', content: 'Great Questions to Ask as a Designer' },
          { type: 'list', items: [
            'What does this JavaScript code do?',
            'How do I create a responsive layout with Flexbox?',
            'Explain this CSS animation',
            'What\'s the difference between CSS Grid and Flexbox?',
            'How can I make this more accessible to screen readers?',
            'Generate a form with proper validation'
          ] },
          { type: 'image', src: '/images/guides/github-copilot-learning-path/lesson-5/chat-view.png', alt: 'GitHub Copilot Chat interface showing question about flexbox responsive design', label: 'Copilot Chat helping you understand design patterns' },
          { type: 'callout', calloutType: 'tip', title: 'Chat Tips for Designers', content: 'Copilot Chat is perfect for learning. You can ask "why" questions, request code explanations, or ask how to implement specific design patterns. It\'s like having a patient developer to teach you!' }
        ]
      },
      {
        id: 'lesson-6',
        title: 'Inline Code Explanations',
        duration: 2,
        order: 6,
        module: 'features',
        sections: [
          { type: 'intro', content: 'Understand developer code instantly. Ask Copilot to explain what code does.', icon: 'monitor' },
          { type: 'text', content: 'When reviewing code from developers or looking at examples, sometimes the code is confusing. Copilot can break it down into simple terms, perfect for designers who need to understand what developers are building.' },
          { type: 'heading', level: 'h3', content: 'How to Get Explanations' },
          { type: 'steps', steps: [
            { number: 1, title: 'Highlight the Code', content: 'Select (highlight) the code you don\'t understand' },
            { number: 2, title: 'Right-Click and Explain', content: 'Right-click on the selection and look for "Copilot: Explain This" option' },
            { number: 3, title: 'Read the Explanation', content: 'Copilot will break down what the code does in simple language, line by line' },
            { number: 4, title: 'Ask Follow-ups', content: 'If you still have questions, ask them in Copilot Chat (Ctrl+Alt+I / Cmd+Alt+I)' }
          ] },
          { type: 'code', language: 'javascript', label: 'Example Code That Needs Explanation', code: 'const handleFormSubmit = (e) => {\n  e.preventDefault();\n  const formData = new FormData(e.target);\n  const data = Object.fromEntries(formData);\n  fetch(\'/api/submit\', {\n    method: \'POST\',\n    headers: { \'Content-Type\': \'application/json\' },\n    body: JSON.stringify(data)\n  });\n};\n\n// Step by step:\n// 1. e.preventDefault() stops the form from refreshing the page\n// 2. FormData captures all the input values\n// 3. fetch sends the data to the server\n// 4. The server responds with confirmation' },
          { type: 'image', src: '/images/guides/github-copilot-learning-path/lesson-6/explanation.png', alt: 'VS Code showing Copilot explanation of JavaScript function alongside the code', label: 'Copilot explaining complex code in simple terms' },
          { type: 'heading', level: 'h3', content: 'Why This Matters for Designer-Developer Collaboration' },
          { type: 'text', content: 'Understanding what code does helps you make better design decisions. You\'ll know what\'s possible to build, what might take longer, and how to communicate with developers about implementation.' },
          { type: 'callout', calloutType: 'success', title: 'Skill Building', content: 'Every time you ask Copilot to explain code, you\'re learning. Over time, you\'ll understand more code patterns and be able to collaborate more effectively with developers.' }
        ]
      },
      {
        id: 'lesson-7',
        title: 'From Design to Interactive Prototype',
        duration: 2,
        order: 7,
        module: 'prototyping',
        sections: [
          { type: 'intro', content: 'Turn your Figma designs into clickable HTML/CSS prototypes. Learn the design-to-code workflow.', icon: 'download' },
          { type: 'text', content: 'This is the magic moment: you can now build interactive prototypes in minutes instead of hours. Using Copilot, you\'ll describe your design in code comments, and Copilot will generate the HTML/CSS to match.' },
          { type: 'heading', level: 'h3', content: 'The Designer-Friendly Workflow' },
          { type: 'steps', steps: [
            { number: 1, title: 'Create Your Design Brief', content: 'In VS Code, create a new HTML file. Add a detailed comment describing your design, including layout, colors, typography, and interactive elements.' },
            { number: 2, title: 'Let Copilot Generate HTML', content: 'Copilot will suggest semantic HTML. Review and refine it if needed. Accept with Tab and keep iterating.' },
            { number: 3, title: 'Add Your Styles', content: 'In a <style> tag or CSS file, add comments describing your design aesthetics: colors, spacing, fonts. Let Copilot generate CSS.' },
            { number: 4, title: 'Create Interactions', content: 'Use Copilot Chat to generate JavaScript for buttons, forms, animations, and hover effects.' },
            { number: 5, title: 'Test in Browser', content: 'Open your HTML file in a browser and test the prototype. Make adjustments to match your design.' }
          ] },
          { type: 'code', language: 'html', label: 'Design Brief as a Comment', code: '<!--\n  Hero section design:\n  - Full-width background with gradient (purple to blue)\n  - Centered headline and tagline\n  - Two buttons: primary (solid blue) and secondary (outline)\n  - Mobile: single column, buttons stack vertically\n  - Desktop: side-by-side buttons\n-->\n\n<section class="hero">\n  <!-- Copilot will complete this based on the brief -->\n</section>' },
          { type: 'image', src: '/images/guides/github-copilot-learning-path/lesson-7/design-to-code.png', alt: 'Split-screen showing Figma design on left and VS Code prototype on right matching the design', label: 'From design concept to working code prototype' },
          { type: 'callout', calloutType: 'success', title: 'Game Changer for Design', content: 'You\'re no longer waiting for developers to build your prototypes. You can iterate faster, test interactions yourself, and come to developers with working code that matches your vision.' }
        ]
      },
      {
        id: 'lesson-8',
        title: 'Building Responsive & Interactive Layouts',
        duration: 2,
        order: 8,
        module: 'prototyping',
        sections: [
          { type: 'intro', content: 'Create responsive designs that work on phones, tablets, and desktops. Add animations and interactions.', icon: 'monitor' },
          { type: 'text', content: 'Great designs work everywhere. Copilot can help you build responsive layouts with Flexbox and CSS Grid, plus smooth animations that impress stakeholders.' },
          { type: 'heading', level: 'h3', content: 'Responsive Design with Copilot' },
          { type: 'steps', steps: [
            { number: 1, title: 'Start with Mobile First', content: 'Design the mobile layout first. Use comments: "Mobile layout: single column, stacked cards, full width"' },
            { number: 2, title: 'Add Media Queries', content: 'In your CSS, add comments for each breakpoint: "Tablet (768px): two-column layout" and "Desktop (1024px): three-column grid"' },
            { number: 3, title: 'Use Flexbox or Grid', content: 'Copilot will suggest modern CSS layouts. Don\'t worry about browser compatibility—modern browsers support both!' },
            { number: 4, title: 'Add Animations', content: 'Use Copilot Chat: ask for CSS animations (fade in, slide up, bounce) or JavaScript for interactive effects.' }
          ] },
          { type: 'code', language: 'css', label: 'Responsive Layout with Copilot Help', code: '/* Mobile: single column */\n.card-grid {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n\n/* Tablet: 2 columns */\n@media (min-width: 768px) {\n  .card-grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n\n/* Desktop: 3 columns */\n@media (min-width: 1024px) {\n  .card-grid {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}' },
          { type: 'image', src: '/images/guides/github-copilot-learning-path/lesson-8/responsive.png', alt: 'Three browser windows showing the same design responsive on mobile, tablet, and desktop', label: 'Responsive design working across all device sizes' },
          { type: 'heading', level: 'h3', content: 'Adding Animations & Interactions' },
          { type: 'code', language: 'css', label: 'CSS Animations That Impress Stakeholders', code: '/* Smooth fade-in on page load */\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n\n.card {\n  animation: fadeIn 0.6s ease-in-out;\n}\n\n/* Hover effect with smooth transition */\n.button {\n  transition: all 0.3s ease;\n}\n\n.button:hover {\n  background-color: #0052cc;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n  transform: translateY(-2px);\n}' },
          { type: 'heading', level: 'h3', content: 'Popular Interactions to Try' },
          { type: 'list', items: [
            'Hover effects: color change, shadow, scale transform',
            'Smooth scroll behavior',
            'CSS animations: fade in, slide from left, bounce',
            'JavaScript: dropdown menus, modal dialogs, tabs',
            'Form validation with real-time feedback'
          ] },
          { type: 'callout', calloutType: 'tip', title: 'Testing Your Prototype', content: 'Use a free tool like Vercel, Netlify, or GitHub Pages to share your prototype online. Get feedback from stakeholders and team members before handing off to developers!' }
        ]
      },
      {
        id: 'lesson-9',
        title: 'Reviewing Developer Code',
        duration: 2,
        order: 9,
        module: 'collaboration',
        sections: [
          { type: 'intro', content: 'Understand what developers built. Review pull requests and code with confidence.', icon: 'github' },
          { type: 'text', content: 'When developers implement your designs, they might add features, fix bugs, or optimize code. Copilot helps you understand their changes and provide thoughtful feedback.' },
          { type: 'heading', level: 'h3', content: 'How to Review Code' },
          { type: 'steps', steps: [
            { number: 1, title: 'Read the PR Description', content: 'Developers will explain what changed. Read this first to understand the "why."' },
            { number: 2, title: 'Look at the Changes', content: 'GitHub shows green (added) and red (removed) lines. Scan for anything that looks off.' },
            { number: 3, title: 'Use Copilot to Understand', content: 'Highlight confusing code and right-click to "Explain This." Copilot breaks it down in simple language.' },
            { number: 4, title: 'Ask Smart Questions', content: 'Use Copilot Chat to generate thoughtful questions: "Will this animation work on older phones?" or "How does this form validation work?"' },
            { number: 5, title: 'Leave Feedback', content: 'Comment on the PR with specific feedback. Developers appreciate designers who understand the code!' }
          ] },
          { type: 'heading', level: 'h3', content: 'Questions to Ask During Code Review' },
          { type: 'list', items: [
            'Does this match the design I provided?',
            'Will this animation work on slow networks?',
            'How does this handle mobile screens?',
            'Is this accessible to screen readers?',
            'What happens if a user clicks this quickly twice?'
          ] },
          { type: 'image', src: '/images/guides/github-copilot-learning-path/lesson-9/pr-review.png', alt: 'GitHub pull request review screen showing code changes with Copilot Chat open', label: 'Using Copilot Chat to understand code changes in PRs' },
          { type: 'callout', calloutType: 'success', title: 'Level Up Your Collaboration', content: 'Developers will respect you more when you understand their code. You\'ll spot bugs earlier, prevent rework, and build trust as a collaborative partner.' }
        ]
      },
      {
        id: 'lesson-10',
        title: 'Communicating with Your Dev Team',
        duration: 2,
        order: 10,
        module: 'collaboration',
        sections: [
          { type: 'intro', content: 'Speak the developer\'s language. Share ideas, specs, and feedback clearly using code.', icon: 'user' },
          { type: 'text', content: 'The best designer-developer partnerships have clear communication. Copilot helps you write specs, generate code examples, and explain what you want built—in their language.' },
          { type: 'heading', level: 'h3', content: 'Using Code in Your Specs' },
          { type: 'steps', steps: [
            { number: 1, title: 'Write Clear Requirements', content: 'Instead of "make it look better," write: "Add 1rem padding inside the button and change the background color to #0066FF"' },
            { number: 2, title: 'Include Code Snippets', content: 'Use Copilot Chat to generate example code of what you want. Example: "Generate a loading spinner with a pulsing animation"' },
            { number: 3, title: 'Show Before & After', content: 'Create quick prototypes in CodePen or Figma that show the current state and desired state' },
            { number: 4, title: 'Document Edge Cases', content: 'Think through mobile, loading states, errors, and accessibility. Share these with developers upfront.' }
          ] },
          { type: 'code', language: 'markdown', label: 'Design Spec with Code Examples', code: '# Button Component Specification\n\n## States\n- **Default**: Blue background, white text, 1rem padding\n- **Hover**: Darker blue background, slight shadow\n- **Active**: Even darker, scale down slightly (0.98)\n- **Disabled**: Gray background, 50% opacity\n\n## Accessibility\n- Focus state: 2px outline with 2px offset\n- Minimum touch target: 44x44px\n- Color contrast: 4.5:1 or higher\n\n## Code Example\n```css\n.button {\n  background: #0066FF;\n  color: white;\n  padding: 1rem 1.5rem;\n  border-radius: 0.5rem;\n  transition: all 0.2s ease;\n}\n```' },
          { type: 'image', src: '/images/guides/github-copilot-learning-path/lesson-10/slack-spec.png', alt: 'Slack message from designer sharing design spec with code examples and screenshots', label: 'Sharing clear design specs with developers' },
          { type: 'heading', level: 'h3', content: 'After Building: What You\'ve Accomplished' },
          { type: 'completion', title: 'Congratulations!', items: [
            'You can install and configure GitHub Copilot',
            'You understand how AI code suggestions work',
            'You can write comments that generate good code',
            'You can ask Copilot questions and learn from answers',
            'You can build interactive prototypes independently',
            'You can review developer code with confidence',
            'You can communicate clearly with your dev team',
            'You\'re ready to speed up your design-to-code workflow!'
          ], message: 'You\'ve completed the GitHub Copilot guide for designers! You now have the skills to code prototypes, understand developer work, and collaborate more effectively with your team. Keep practicing and you\'ll be amazed at how much faster you can work.' }
        ]
      }
    ],
    content: `
      <div class="space-y-12">
        <!-- Hero Section -->
        <section class="mb-12">
          <h2 class="text-3xl font-bold mb-4">Master GitHub Copilot for Design & Prototyping</h2>
          <p class="text-xl text-gray-600 mb-6">
            Learn to code prototypes, understand developer code, and collaborate with your team like never before.
            Whether you're a designer who codes or learning to code for the first time, Copilot makes it possible.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 class="font-bold text-lg mb-2">✨ 10 Lessons</h3>
              <p>From setup to collaboration, all in about 18 minutes</p>
            </div>
            <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 class="font-bold text-lg mb-2">🎯 Beginner-Friendly</h3>
              <p>No coding experience needed. Learn at your own pace</p>
            </div>
            <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 class="font-bold text-lg mb-2">🚀 Practical Skills</h3>
              <p>Build prototypes, review code, and work better with devs</p>
            </div>
          </div>
        </section>

        <!-- Module Breakdown -->
        <section class="mb-12">
          <h3 class="text-2xl font-bold mb-8">What You'll Learn</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Module 1 -->
            <div class="border-l-4 border-blue-500 pl-6 py-4">
              <h4 class="text-xl font-bold mb-3">📦 Module 1: Setup & Installation (6 min)</h4>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start"><span class="mr-3">→</span> <span>Lesson 1: Install GitHub Copilot</span></li>
                <li class="flex items-start"><span class="mr-3">→</span> <span>Lesson 2: Your First Code Suggestion</span></li>
                <li class="flex items-start"><span class="mr-3">→</span> <span>Lesson 3: Workspace Setup for Designers</span></li>
              </ul>
            </div>

            <!-- Module 2 -->
            <div class="border-l-4 border-green-500 pl-6 py-4">
              <h4 class="text-xl font-bold mb-3">⚙️ Module 2: Core Features (6 min)</h4>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start"><span class="mr-3">→</span> <span>Lesson 4: Autocomplete & Code Completions</span></li>
                <li class="flex items-start"><span class="mr-3">→</span> <span>Lesson 5: Chat for Design Questions</span></li>
                <li class="flex items-start"><span class="mr-3">→</span> <span>Lesson 6: Inline Code Explanations</span></li>
              </ul>
            </div>

            <!-- Module 3 -->
            <div class="border-l-4 border-purple-500 pl-6 py-4">
              <h4 class="text-xl font-bold mb-3">🎨 Module 3: Prototyping Workflows (4 min)</h4>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start"><span class="mr-3">→</span> <span>Lesson 7: From Design to Interactive Prototype</span></li>
                <li class="flex items-start"><span class="mr-3">→</span> <span>Lesson 8: Building Responsive & Interactive Layouts</span></li>
              </ul>
            </div>

            <!-- Module 4 -->
            <div class="border-l-4 border-orange-500 pl-6 py-4">
              <h4 class="text-xl font-bold mb-3">🤝 Module 4: Developer Collaboration (2 min)</h4>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start"><span class="mr-3">→</span> <span>Lesson 9: Reviewing Developer Code</span></li>
                <li class="flex items-start"><span class="mr-3">→</span> <span>Lesson 10: Communicating with Your Dev Team</span></li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Why Designers Need This -->
        <section class="mb-12 bg-gray-50 p-8 rounded-lg">
          <h3 class="text-2xl font-bold mb-6">Why This Matters for Designers</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-bold text-lg mb-2">🚀 Build Prototypes in Minutes</h4>
              <p class="text-gray-700">Stop waiting for developers. Create clickable, interactive prototypes yourself. Test ideas faster and iterate based on real feedback.</p>
            </div>
            <div>
              <h4 class="font-bold text-lg mb-2">💬 Speak the Developer Language</h4>
              <p class="text-gray-700">Understand what developers build. Review code, ask smart questions, and collaborate as true partners—not just handoff specialists.</p>
            </div>
            <div>
              <h4 class="font-bold text-lg mb-2">✨ Better Design Decisions</h4>
              <p class="text-gray-700">Know what's possible to build, what takes effort, and how to design for implementation. Make smarter choices upfront.</p>
            </div>
            <div>
              <h4 class="font-bold text-lg mb-2">🎯 Stand Out in Your Role</h4>
              <p class="text-gray-700">Design + coding skills make you invaluable. From UX design to technical design, these skills open doors to career growth.</p>
            </div>
          </div>
        </section>

        <!-- Getting Started -->
        <section class="mb-12">
          <h3 class="text-2xl font-bold mb-6">Ready to Get Started?</h3>
          <p class="text-lg text-gray-700 mb-6">
            You'll need VS Code installed (free at code.visualstudio.com). GitHub Copilot offers a free trial with 60 minutes per month of AI assistance.
            That's enough to get started and see the value before deciding to upgrade.
          </p>
          <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
            <p class="font-bold mb-2">💡 Pro Tip</p>
            <p class="text-gray-700">Start with Lesson 1. You'll have Copilot installed and working within 5 minutes. Then jump into Lesson 2 to see your first AI suggestion in action!</p>
          </div>
        </section>
      </div>
    `,
    relatedPatterns: ['Contextual Assistance', 'Augmented Creation', 'Guided Learning'],
  },
  {
    id: 'github-course',
    slug: 'github-learning-path',
    title: 'GitHub Guide for Designers',
    description: 'Master GitHub for version control and collaboration with your development team.',
    excerpt: 'Your complete GitHub guide: 10 lessons covering account setup, repositories, version control basics, branching, pull requests, and design team workflows.',
    tool: 'GitHub',
    useCase: 'Learning Path',
    skillLevel: 'Beginner',
    designDomain: 'UX Design',
    readTime: 18,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    status: 'ready',
    thumbnail: 'https://commons.wikimedia.org/wiki/Special:FilePath/GitHub_Invertocat_Logo.svg',
    tags: ['github', 'learning-path', 'version-control', 'course', 'collaboration'],
    lessons: [
      // Setup Module (Lessons 1-3)
      {
        id: 'lesson-1',
        title: 'Create Your GitHub Account',
        duration: 2,
        order: 1,
        module: 'setup',
        iconType: 'user',
        sections: [
          {
            type: 'intro',
            content: 'GitHub is where developers and designers collaborate on code. As a designer, having a GitHub account lets you review code, track changes, and work more effectively with your development team.',
            icon: 'info',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Go to GitHub.com',
                content: [
                  'Open your web browser and go to github.com',
                  'Click the "Sign up" button in the top right corner',
                  'You\'ll see a form to create your account',
                ],
                icon: 'monitor',
              },
              {
                number: 2,
                title: 'Enter Your Information',
                content: [
                  'Enter your email address (use your work email for team projects)',
                  'Create a strong password',
                  'Choose a username (this will be visible publicly)',
                  'Complete the verification puzzle',
                ],
                icon: 'user',
              },
              {
                number: 3,
                title: 'Verify Your Email',
                content: [
                  'Check your email inbox for a verification message from GitHub',
                  'Click the verification link in the email',
                  'You\'ll be redirected back to GitHub',
                ],
                icon: 'check',
              },
              {
                number: 4,
                title: 'Complete Your Profile',
                content: [
                  'Add a profile photo so teammates can recognize you',
                  'Fill in your name and bio',
                  'Add your company or organization if applicable',
                ],
                icon: 'user',
              },
            ],
          },
          {
            type: 'callout',
            calloutType: 'tip',
            title: 'Pro Tip',
            content: 'Use the same email as your work Slack or communication tools. This makes it easier for teammates to find and add you to repositories.',
            icon: 'info',
          },
          {
            type: 'completion',
            title: 'Lesson Complete!',
            items: [
              'Created a GitHub account',
              'Verified your email address',
              'Set up your profile',
            ],
            message: 'You now have a GitHub account. Next, we\'ll install Git on your computer.',
          },
        ],
      },
      {
        id: 'lesson-2',
        title: 'Install Git on Your Computer',
        duration: 2,
        order: 2,
        module: 'setup',
        iconType: 'download',
        sections: [
          {
            type: 'intro',
            content: 'Git is the version control software that powers GitHub. You need Git installed locally to clone repositories, make changes, and push updates.',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'For Mac Users',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Open Terminal',
                content: [
                  'Press Cmd + Space to open Spotlight',
                  'Type "Terminal" and press Enter',
                  'A command line window will open',
                ],
                icon: 'terminal',
              },
              {
                number: 2,
                title: 'Check if Git is Installed',
                content: 'Type this command and press Enter to see if Git is already installed:',
                icon: 'code',
              },
            ],
          },
          {
            type: 'code',
            language: 'bash',
            code: 'git --version',
            label: 'Terminal',
          },
          {
            type: 'text',
            content: 'If you see a version number, Git is already installed. If not, macOS will prompt you to install the Xcode Command Line Tools which includes Git.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'For Windows Users',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Download Git',
                content: [
                  'Go to git-scm.com/download/win',
                  'The download should start automatically',
                  'If not, click the download link for your Windows version',
                ],
                icon: 'download',
              },
              {
                number: 2,
                title: 'Run the Installer',
                content: [
                  'Open the downloaded .exe file',
                  'Accept the license agreement',
                  'Use the default settings (just click Next)',
                  'Click Install when ready',
                ],
                icon: 'cog',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Configure Git with Your Identity',
          },
          {
            type: 'text',
            content: 'After installing Git, you need to tell it who you are. This information appears in your commits.',
          },
          {
            type: 'code',
            language: 'bash',
            code: 'git config --global user.name "Your Name"\ngit config --global user.email "your.email@example.com"',
            label: 'Terminal',
          },
          {
            type: 'callout',
            calloutType: 'warning',
            title: 'Use the Same Email',
            content: 'Make sure to use the same email address you used for your GitHub account. This links your commits to your GitHub profile.',
            icon: 'warning',
          },
          {
            type: 'completion',
            title: 'Lesson Complete!',
            items: [
              'Installed Git on your computer',
              'Configured your name and email',
              'Ready to clone repositories',
            ],
            message: 'Git is now set up on your machine. Next, we\'ll learn the basic Git concepts.',
          },
        ],
      },
      {
        id: 'lesson-3',
        title: 'Understanding Git Basics',
        duration: 2,
        order: 3,
        module: 'setup',
        iconType: 'code',
        sections: [
          {
            type: 'intro',
            content: 'Before diving into GitHub, let\'s understand the core concepts of Git. These fundamentals will help you navigate version control with confidence.',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Key Concepts',
          },
          {
            type: 'list',
            items: [
              'Repository (Repo): A folder containing your project files and their entire version history',
              'Commit: A snapshot of your project at a specific point in time, like saving a version',
              'Branch: A parallel version of your code for working on features without affecting the main code',
              'Clone: Creating a local copy of a remote repository on your computer',
              'Push: Uploading your local changes to the remote repository on GitHub',
              'Pull: Downloading the latest changes from GitHub to your local copy',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'The Git Workflow',
          },
          {
            type: 'text',
            content: 'Here\'s the typical flow when working with Git:',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Clone or Pull',
                content: 'Get the latest code from GitHub to your computer',
                icon: 'download',
              },
              {
                number: 2,
                title: 'Make Changes',
                content: 'Edit files, add features, or fix bugs in your local copy',
                icon: 'code',
              },
              {
                number: 3,
                title: 'Stage Changes',
                content: 'Select which changes you want to include in your next commit',
                icon: 'check',
              },
              {
                number: 4,
                title: 'Commit',
                content: 'Save a snapshot with a message describing what you changed',
                icon: 'check',
              },
              {
                number: 5,
                title: 'Push',
                content: 'Upload your commits to GitHub so others can see them',
                icon: 'upload',
              },
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            title: 'Why Version Control Matters for Designers',
            content: 'Version control lets you track every change, revert mistakes, and collaborate without overwriting others\' work. It\'s like having unlimited undo history that works across your entire team.',
            icon: 'info',
          },
          {
            type: 'completion',
            title: 'Lesson Complete!',
            items: [
              'Understand repositories, commits, and branches',
              'Know the basic Git workflow',
              'Ready to start working with GitHub',
            ],
            message: 'You now understand the fundamentals. Let\'s put this into practice!',
          },
        ],
      },
      // Core Features Module (Lessons 4-6)
      {
        id: 'lesson-4',
        title: 'Clone Your First Repository',
        duration: 2,
        order: 4,
        module: 'features',
        iconType: 'download',
        sections: [
          {
            type: 'intro',
            content: 'Cloning creates a local copy of a repository on your computer. This is usually the first step when joining a project or starting to work on existing code.',
            icon: 'info',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Find a Repository on GitHub',
                content: [
                  'Go to the repository page on GitHub',
                  'Look for the green "Code" button',
                  'Click it to see cloning options',
                ],
                icon: 'monitor',
              },
              {
                number: 2,
                title: 'Copy the Repository URL',
                content: [
                  'Make sure "HTTPS" is selected',
                  'Click the copy button next to the URL',
                  'The URL looks like: https://github.com/username/repository.git',
                ],
                icon: 'code',
              },
              {
                number: 3,
                title: 'Clone in Terminal',
                content: 'Open Terminal, navigate to where you want the project, and run:',
                icon: 'terminal',
              },
            ],
          },
          {
            type: 'code',
            language: 'bash',
            code: 'cd ~/Projects\ngit clone https://github.com/username/repository.git',
            label: 'Terminal',
          },
          {
            type: 'text',
            content: 'This creates a new folder with the repository name containing all the project files.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Using GitHub Desktop (Visual Alternative)',
          },
          {
            type: 'text',
            content: 'If you prefer a visual interface, GitHub Desktop makes cloning even easier:',
          },
          {
            type: 'list',
            items: [
              'Download GitHub Desktop from desktop.github.com',
              'Sign in with your GitHub account',
              'Click "Clone a Repository from the Internet"',
              'Select the repository and choose where to save it',
              'Click "Clone"',
            ],
          },
          {
            type: 'callout',
            calloutType: 'tip',
            title: 'Organize Your Projects',
            content: 'Create a dedicated folder like ~/Projects or ~/Code for all your repositories. This keeps everything organized and easy to find.',
            icon: 'info',
          },
          {
            type: 'completion',
            title: 'Lesson Complete!',
            items: [
              'Cloned a repository to your computer',
              'Understand HTTPS cloning',
              'Know about GitHub Desktop as an alternative',
            ],
            message: 'You can now get any repository onto your local machine!',
          },
        ],
      },
      {
        id: 'lesson-5',
        title: 'Making and Committing Changes',
        duration: 2,
        order: 5,
        module: 'features',
        iconType: 'code',
        sections: [
          {
            type: 'intro',
            content: 'Now that you have a local repository, let\'s learn how to make changes and save them as commits. Each commit is a checkpoint you can return to later.',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Check Repository Status',
          },
          {
            type: 'text',
            content: 'First, see what\'s changed in your repository:',
          },
          {
            type: 'code',
            language: 'bash',
            code: 'git status',
            label: 'Terminal',
          },
          {
            type: 'text',
            content: 'This shows modified files, new files, and files ready to commit.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Stage Your Changes',
          },
          {
            type: 'text',
            content: 'Before committing, you need to "stage" the changes you want to include:',
          },
          {
            type: 'code',
            language: 'bash',
            code: '# Stage a specific file\ngit add filename.txt\n\n# Stage all changed files\ngit add .',
            label: 'Terminal',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Create a Commit',
          },
          {
            type: 'text',
            content: 'Now save your staged changes with a descriptive message:',
          },
          {
            type: 'code',
            language: 'bash',
            code: 'git commit -m "Add new button styles to navigation"',
            label: 'Terminal',
          },
          {
            type: 'callout',
            calloutType: 'tip',
            title: 'Writing Good Commit Messages',
            content: 'Good commit messages describe WHAT changed and WHY. Start with a verb: "Add", "Fix", "Update", "Remove". Keep the first line under 50 characters.',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Push to GitHub',
          },
          {
            type: 'text',
            content: 'Upload your commits to GitHub so others can see them:',
          },
          {
            type: 'code',
            language: 'bash',
            code: 'git push',
            label: 'Terminal',
          },
          {
            type: 'completion',
            title: 'Lesson Complete!',
            items: [
              'Check status with git status',
              'Stage changes with git add',
              'Commit with git commit -m',
              'Push to GitHub with git push',
            ],
            message: 'You can now track and share your changes!',
          },
        ],
      },
      {
        id: 'lesson-6',
        title: 'Working with Branches',
        duration: 2,
        order: 6,
        module: 'features',
        iconType: 'code',
        sections: [
          {
            type: 'intro',
            content: 'Branches let you work on new features or experiments without affecting the main codebase. Think of them as parallel timelines for your project.',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Why Use Branches?',
          },
          {
            type: 'list',
            items: [
              'Work on features without breaking the main code',
              'Multiple people can work on different things simultaneously',
              'Easy to discard experiments that don\'t work out',
              'Clean history when merging completed features',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Create a New Branch',
          },
          {
            type: 'code',
            language: 'bash',
            code: '# Create and switch to a new branch\ngit checkout -b feature/new-navigation\n\n# Or with newer Git versions\ngit switch -c feature/new-navigation',
            label: 'Terminal',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Switch Between Branches',
          },
          {
            type: 'code',
            language: 'bash',
            code: '# Switch to an existing branch\ngit checkout main\n\n# See all branches\ngit branch',
            label: 'Terminal',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Branch Naming Conventions',
          },
          {
            type: 'text',
            content: 'Most teams use prefixes to categorize branches:',
          },
          {
            type: 'list',
            items: [
              'feature/ - New features (feature/user-profile)',
              'fix/ - Bug fixes (fix/login-error)',
              'design/ - Design changes (design/new-color-scheme)',
              'docs/ - Documentation (docs/api-guide)',
            ],
          },
          {
            type: 'callout',
            calloutType: 'warning',
            title: 'Always Know Your Branch',
            content: 'Before making changes, always check which branch you\'re on with "git branch" or look at your terminal prompt. Committing to the wrong branch is a common mistake!',
            icon: 'warning',
          },
          {
            type: 'completion',
            title: 'Lesson Complete!',
            items: [
              'Create branches for new work',
              'Switch between branches',
              'Understand branch naming conventions',
            ],
            message: 'You\'re ready to work safely with branches!',
          },
        ],
      },
      // Collaboration Module (Lessons 7-8)
      {
        id: 'lesson-7',
        title: 'Creating Pull Requests',
        duration: 2,
        order: 7,
        module: 'collaboration',
        iconType: 'user',
        sections: [
          {
            type: 'intro',
            content: 'Pull Requests (PRs) are how you propose changes and get them reviewed before merging into the main codebase. They\'re central to team collaboration on GitHub.',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Push Your Branch to GitHub',
          },
          {
            type: 'text',
            content: 'First, push your branch with its commits to GitHub:',
          },
          {
            type: 'code',
            language: 'bash',
            code: 'git push -u origin feature/new-navigation',
            label: 'Terminal',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Create the Pull Request',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Go to GitHub',
                content: [
                  'Navigate to your repository on GitHub',
                  'You\'ll see a prompt to create a PR for your recently pushed branch',
                  'Click "Compare & pull request"',
                ],
                icon: 'monitor',
              },
              {
                number: 2,
                title: 'Fill in the Details',
                content: [
                  'Write a clear title describing the change',
                  'Add a description explaining what you did and why',
                  'Reference any related issues (e.g., "Fixes #123")',
                  'Add reviewers if you know who should review',
                ],
                icon: 'code',
              },
              {
                number: 3,
                title: 'Create the PR',
                content: [
                  'Review your changes in the "Files changed" tab',
                  'Make sure everything looks correct',
                  'Click "Create pull request"',
                ],
                icon: 'check',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'What Makes a Good PR',
          },
          {
            type: 'list',
            items: [
              'Small and focused - one feature or fix per PR',
              'Clear description of what changed and why',
              'Screenshots for visual changes',
              'Links to related design files or issues',
            ],
          },
          {
            type: 'callout',
            calloutType: 'tip',
            title: 'Add Screenshots for Design Changes',
            content: 'When your PR includes visual changes, add before/after screenshots. Drag and drop images directly into the PR description. This helps reviewers understand the impact.',
            icon: 'info',
          },
          {
            type: 'completion',
            title: 'Lesson Complete!',
            items: [
              'Push branches to GitHub',
              'Create pull requests',
              'Write good PR descriptions',
            ],
            message: 'You can now propose changes for review!',
          },
        ],
      },
      {
        id: 'lesson-8',
        title: 'Reviewing and Merging PRs',
        duration: 2,
        order: 8,
        module: 'collaboration',
        iconType: 'check',
        sections: [
          {
            type: 'intro',
            content: 'Code review is a collaborative process where team members check each other\'s work. As a designer, you can review design-related changes and provide valuable feedback.',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Reviewing a Pull Request',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Open the PR',
                content: [
                  'Go to the "Pull requests" tab in the repository',
                  'Click on the PR you want to review',
                  'Read the description to understand the changes',
                ],
                icon: 'monitor',
              },
              {
                number: 2,
                title: 'Review the Code',
                content: [
                  'Click "Files changed" to see all modifications',
                  'Green lines are additions, red lines are deletions',
                  'Click on a line to add a comment',
                ],
                icon: 'code',
              },
              {
                number: 3,
                title: 'Submit Your Review',
                content: [
                  'Click "Review changes" button',
                  'Choose: Comment, Approve, or Request changes',
                  'Add a summary of your feedback',
                  'Click "Submit review"',
                ],
                icon: 'check',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Merging a Pull Request',
          },
          {
            type: 'text',
            content: 'Once approved and all checks pass, the PR can be merged:',
          },
          {
            type: 'list',
            items: [
              'Click the green "Merge pull request" button',
              'Choose merge method (usually "Squash and merge" for cleaner history)',
              'Click "Confirm merge"',
              'Optionally delete the branch after merging',
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            title: 'What Designers Should Review',
            content: 'Focus on CSS changes, component styling, spacing, colors, and anything that affects the visual appearance. You don\'t need to understand all the code - your design eye is valuable!',
            icon: 'info',
          },
          {
            type: 'completion',
            title: 'Lesson Complete!',
            items: [
              'Review pull requests',
              'Leave helpful comments',
              'Merge approved changes',
            ],
            message: 'You\'re now part of the code review process!',
          },
        ],
      },
      // Best Practices Module (Lessons 9-10)
      {
        id: 'lesson-9',
        title: 'Handling Merge Conflicts',
        duration: 2,
        order: 9,
        module: 'practices',
        iconType: 'warning',
        sections: [
          {
            type: 'intro',
            content: 'Merge conflicts happen when two people edit the same part of a file. They\'re normal and not scary once you understand how to resolve them.',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Why Conflicts Happen',
          },
          {
            type: 'text',
            content: 'Git is smart about merging changes, but it can\'t decide when two people modify the same lines. You need to tell Git which changes to keep.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'What a Conflict Looks Like',
          },
          {
            type: 'code',
            language: 'text',
            code: '<<<<<<< HEAD\nYour changes here\n=======\nTheir changes here\n>>>>>>> feature-branch',
            label: 'Conflict markers in file',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Resolving Conflicts',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Identify Conflicted Files',
                content: 'Git will tell you which files have conflicts. Look for files marked as "both modified".',
                icon: 'code',
              },
              {
                number: 2,
                title: 'Edit the File',
                content: [
                  'Open the conflicted file',
                  'Find the conflict markers (<<<<<<, =======, >>>>>>)',
                  'Decide which changes to keep (or combine both)',
                  'Remove the conflict markers',
                ],
                icon: 'code',
              },
              {
                number: 3,
                title: 'Save and Commit',
                content: 'After resolving, stage the file and commit:',
                icon: 'check',
              },
            ],
          },
          {
            type: 'code',
            language: 'bash',
            code: 'git add resolved-file.css\ngit commit -m "Resolve merge conflict in styles"',
            label: 'Terminal',
          },
          {
            type: 'callout',
            calloutType: 'tip',
            title: 'Use Visual Tools',
            content: 'VS Code and GitHub Desktop have built-in merge conflict resolvers that make this process much easier. They show changes side-by-side and let you click to choose which version to keep.',
            icon: 'info',
          },
          {
            type: 'completion',
            title: 'Lesson Complete!',
            items: [
              'Understand why conflicts happen',
              'Recognize conflict markers',
              'Resolve conflicts manually or with tools',
            ],
            message: 'Conflicts are no longer scary!',
          },
        ],
      },
      {
        id: 'lesson-10',
        title: 'GitHub Workflow for Design Teams',
        duration: 2,
        order: 10,
        module: 'practices',
        iconType: 'check',
        sections: [
          {
            type: 'intro',
            content: 'Now that you understand GitHub basics, let\'s look at how design teams can use GitHub effectively in their daily workflow.',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Design Team Best Practices',
          },
          {
            type: 'list',
            items: [
              'Use Issues to track design tasks and bug reports',
              'Link Figma files in PR descriptions for context',
              'Review CSS and style changes in pull requests',
              'Use GitHub Projects for design sprint planning',
              'Create a design-system repository for shared components',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Useful GitHub Features for Designers',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'GitHub Issues',
                content: 'Create tickets for design tasks, attach mockups, and track progress. Use labels like "design", "needs-review", or "approved".',
                icon: 'code',
              },
              {
                number: 2,
                title: 'GitHub Projects',
                content: 'Kanban-style boards to organize work. Create columns like "Design", "In Development", "Review", "Done".',
                icon: 'monitor',
              },
              {
                number: 3,
                title: 'GitHub Pages',
                content: 'Host design documentation, style guides, or component libraries directly from your repository.',
                icon: 'monitor',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Staying in Sync',
          },
          {
            type: 'text',
            content: 'Before starting work each day, pull the latest changes:',
          },
          {
            type: 'code',
            language: 'bash',
            code: 'git checkout main\ngit pull\ngit checkout your-branch\ngit merge main',
            label: 'Terminal',
          },
          {
            type: 'callout',
            calloutType: 'tip',
            title: 'Communication is Key',
            content: 'GitHub works best when combined with good team communication. Use Slack or your team chat to discuss PRs, mention when you\'re working on something, and ask for reviews.',
            icon: 'info',
          },
          {
            type: 'completion',
            title: 'Course Complete!',
            items: [
              'Know GitHub best practices for designers',
              'Can use Issues and Projects',
              'Understand daily Git workflow',
              'Ready to collaborate with your dev team',
            ],
            message: 'Congratulations! You\'ve completed the GitHub Guide for Designers. You\'re now equipped to collaborate effectively with your development team using version control.',
          },
        ],
      },
    ],
    content: `
      <div class="space-y-12">
        <!-- Hero Section -->
        <section class="mb-12">
          <h2 class="text-3xl font-bold mb-4">Master GitHub for Design Collaboration</h2>
          <p class="text-xl text-gray-600 mb-6">
            Learn to collaborate with developers, track design changes, and participate in code reviews.
            GitHub is essential for modern design teams working alongside development.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 class="font-bold text-lg mb-2">📚 10 Lessons</h3>
              <p>From account setup to team workflows, all in about 18 minutes</p>
            </div>
            <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 class="font-bold text-lg mb-2">🎯 Designer Focused</h3>
              <p>Learn what matters for design collaboration</p>
            </div>
            <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 class="font-bold text-lg mb-2">🤝 Team Ready</h3>
              <p>Work effectively with your dev team</p>
            </div>
          </div>
        </section>

        <!-- What You'll Learn -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold mb-6">What You'll Learn</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="border-l-4 border-blue-500 pl-4">
              <h3 class="font-bold mb-2">📦 Module 1: Setup (6 min)</h3>
              <ul class="space-y-1 text-gray-600">
                <li>→ Lesson 1: Create Your GitHub Account</li>
                <li>→ Lesson 2: Install Git on Your Computer</li>
                <li>→ Lesson 3: Understanding Git Basics</li>
              </ul>
            </div>
            <div class="border-l-4 border-green-500 pl-4">
              <h3 class="font-bold mb-2">⚙️ Module 2: Core Features (6 min)</h3>
              <ul class="space-y-1 text-gray-600">
                <li>→ Lesson 4: Clone Your First Repository</li>
                <li>→ Lesson 5: Making and Committing Changes</li>
                <li>→ Lesson 6: Working with Branches</li>
              </ul>
            </div>
            <div class="border-l-4 border-yellow-500 pl-4">
              <h3 class="font-bold mb-2">🤝 Module 3: Collaboration (4 min)</h3>
              <ul class="space-y-1 text-gray-600">
                <li>→ Lesson 7: Creating Pull Requests</li>
                <li>→ Lesson 8: Reviewing and Merging PRs</li>
              </ul>
            </div>
            <div class="border-l-4 border-purple-500 pl-4">
              <h3 class="font-bold mb-2">✅ Module 4: Best Practices (4 min)</h3>
              <ul class="space-y-1 text-gray-600">
                <li>→ Lesson 9: Handling Merge Conflicts</li>
                <li>→ Lesson 10: GitHub Workflow for Design Teams</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Getting Started -->
        <section>
          <h2 class="text-2xl font-bold mb-4">Getting Started</h2>
          <p class="text-gray-600 mb-4">Choose the path that fits your needs:</p>
          <div class="bg-white p-4 rounded-lg border border-gray-200 mb-3">
            <p class="text-gray-700">• <strong>Complete Beginner:</strong> Start at Lesson 1 and follow through sequentially.</p>
          </div>
          <div class="bg-white p-4 rounded-lg border border-gray-200 mb-3">
            <p class="text-gray-700">• <strong>Have Git Installed:</strong> Jump to Lesson 3 to learn the concepts.</p>
          </div>
          <div class="bg-white p-4 rounded-lg border border-gray-200 mb-3">
            <p class="text-gray-700">• <strong>Know the Basics:</strong> Skip to Module 3 for collaboration workflows.</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-600 mt-6">
            <h3 class="font-bold mb-2">Ready to Get Started?</h3>
            <p class="text-gray-700">Click on the Setup module below to begin your GitHub journey!</p>
          </div>
        </section>
      </div>
    `,
    relatedPatterns: ['Collaborative AI', 'Contextual Assistance'],
  },
  {
    id: 'conversational-ui-guide',
    slug: 'conversational-ui-guide',
    title: 'Build a Conversational UI',
    description:
      'Learn how to design and build conversational interfaces - from chat message bubbles and typing indicators to voice interaction, context management, and suggested prompts.',
    excerpt:
      'A practical guide to building conversational UIs: 11 lessons covering chat interfaces, voice assistants, streaming responses, conversation context, error recovery, agentic AI patterns, and accessibility. Includes code examples in React and design patterns used by ChatGPT, Claude, Slack, and Siri.',
    tool: 'Conversational UI' as const,
    useCase: 'Learning Path',
    skillLevel: 'Intermediate' as const,
    designDomain: 'UX Design',
    readTime: 39,
    author: 'Design Team',
    publishedDate: '2026-03-26',
    lastUpdatedDate: '2026-04-02',
    status: 'ready' as const,
    thumbnail: '/images/og/og-pattern-default.png',
    tags: [
      'conversational-ui',
      'chat-interface',
      'chatbot-design',
      'voice-assistant',
      'conversational-interface',
      'react-chat',
      'ai-chat',
      'conversational-ux',
      'learning-path',
    ],
    relatedPatterns: ['conversational-ui', 'contextual-assistance', 'progressive-disclosure', 'graceful-handoff', 'context-switching', 'multimodal-interaction'],
    lessons: [
      // Module 1: Foundations
      {
        id: 'lesson-1',
        title: 'What Is Conversational UI? (And What It Isn\'t)',
        duration: 6,
        order: 1,
        module: 'foundations',
        sections: [
          {
            type: 'intro',
            content: 'A conversational UI is any interface where users shape outcomes through natural-language turns — typing, speaking, or gesturing back and forth with a system. Not every chat widget qualifies, and most product moments are better served by a button or command than by chat at all.',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Conversation is overhead, not value',
          },
          {
            type: 'text',
            content: 'Before getting into how to build chat interfaces, here\'s a reframe worth keeping underneath every decision in this guide: conversation is overhead, not value. Every word a user types or reads is friction between their intent and the outcome they actually want. Chat is one tool — sometimes the right one — but never the goal.\n\nMost modern AI products are quietly moving away from chat-as-default. Vercel applies code suggestions with one click instead of a dialogue. GitHub Copilot offers slash commands like /fix and /explain. Google\'s Personal Intelligence works ambiently across Gmail and Photos without a chat surface at all. The lesson: the best AI experiences often eliminate the conversation entirely.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'The Conversational UI Spectrum',
          },
          {
            type: 'text',
            content: 'Conversational interfaces exist on a spectrum from scripted to free-form:\n\nScripted chatbots follow predefined flows - decision trees with buttons and quick replies. Think customer support bots that ask "What can I help you with?" and give you 4 options. These are reliable but rigid.\n\nAI-powered conversational UI accepts free-form natural language input. Users type or speak whatever they want, and the AI interprets intent. ChatGPT, Claude, and Google Gemini are examples. These are flexible but require careful error handling.\n\nHybrid interfaces combine both - free-form input with suggested prompts, buttons for common actions, and structured cards within the chat flow. This is where most modern AI products land, and it\'s the approach this guide focuses on.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Conversational UI vs Traditional UI - When to Use Which',
          },
          {
            type: 'text',
            content: 'Use conversational UI when:\n• The user\'s task is hard to express through forms and menus (e.g., "summarize this document focusing on the financial impact")\n• The interaction benefits from back-and-forth refinement (e.g., writing, brainstorming, debugging)\n• Users have varying levels of expertise and need different interaction depths\n• The system needs to ask clarifying questions before acting\n\nStick with traditional UI when:\n• The task has a fixed, predictable structure (e.g., filling out a shipping address)\n• Speed matters more than flexibility (e.g., toggling a setting)\n• The action space is small and well-defined (e.g., sorting a list)',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'The Intent-Clarity Spectrum',
          },
          {
            type: 'text',
            content: 'When intent is clear, conversation gets in the way. When intent is ambiguous, conversation is essential. This spectrum maps the four interaction models you should reach for, from least to most conversational. Reach for chat last, not first — most product moments live on the left side of this spectrum.',
          },
          {
            type: 'table',
            rows: [
              {
                label: 'One-click actions',
                content: 'Clear intent, single action. Vercel\'s "Apply" button on AI code suggestions is the canonical example — the user\'s intent is "fix this", there\'s nothing to discuss.',
              },
              {
                label: 'Structured commands',
                content: 'Clear intent, variable parameters. GitHub Copilot\'s /fix, /explain, /test. The user names the operation; the AI executes within scope.',
              },
              {
                label: 'Guided prompts',
                content: 'Clear intent, complex execution. Wizard-style flows where AI walks the user through structured choices. Better than open chat when there\'s a known shape to the work.',
              },
              {
                label: 'Open chat',
                content: 'Ambiguous or exploratory intent — brainstorming, writing, debugging, learning. This is where conversational UI genuinely earns its place.',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Should this even be conversational?',
          },
          {
            type: 'text',
            content: 'Five questions to ask before defaulting to chat. If three or more answers point away from chat, design something else.',
          },
          {
            type: 'table',
            rows: [
              {
                label: 'Can intent be inferred from context?',
                content: 'If the AI already knows what the user is trying to do, asking is overhead.',
              },
              {
                label: 'Is this a repeated or one-time interaction?',
                content: 'Repeated interactions reward shortcuts; one-offs can tolerate dialogue.',
              },
              {
                label: 'Must users understand the AI\'s reasoning?',
                content: 'If yes, surface explanation. If no, deliver the outcome.',
              },
              {
                label: 'How high are the stakes of failure?',
                content: 'High stakes call for reversible actions or explicit confirmation, not silent assumptions.',
              },
              {
                label: 'Is the context already available to the AI?',
                content: 'If you\'re asking the user to type information the AI could read from the surrounding app, you\'ve designed the wrong interface.',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Text vs Voice vs Multimodal',
          },
          {
            type: 'text',
            content: 'Text interfaces (ChatGPT, Claude, Slack AI) are best when:\n• Users need to input complex, specific requests\n• The output includes code, tables, or formatted content\n• Users want to review and edit the conversation\n\nVoice interfaces (Siri, Alexa, Gemini Voice) work best when:\n• Users\' hands or eyes are occupied (driving, cooking)\n• The interaction is quick and action-oriented ("set a timer")\n• The user is on a mobile device in a casual context\n\nMultimodal (Gemini, GPT-4V) combine text, voice, images, and structured UI - this is where the industry is heading. Design for one modality first, then expand.',
          },
          {
            type: 'callout',
            calloutType: 'warning',
            title: 'Three patterns that quietly ruin conversational UX',
            content: 'The accordion effect — users iterate prompts repeatedly to coax the right output, each cycle adding cognitive cost without proportional value.\n\nThe articulation barrier — the gap between what users want and the language they need to ask for it. Suggested prompts and structured commands exist to bridge this gap.\n\nThe context-switching tax — moving from app to chat and back drops productivity by up to 40% and takes around 23 minutes to refocus. Embedded AI beats destination AI almost every time.',
          },
          {
            type: 'callout',
            calloutType: 'tip',
            content: 'Don\'t start by choosing a technology - start by understanding what your users need to accomplish and how they naturally describe those tasks. Watch 5 users try to use your product and note what they type or say. That tells you whether conversational UI is the right pattern.',
          },
          {
            type: 'further-reading',
            links: [
              {
                title: 'AI is finally learning to shut up',
                url: 'https://medium.com/design-bootcamp/ai-is-finally-learning-to-shut-up-62af1d2c01c8',
                source: 'Medium',
                description:
                  'Why the best AI products often eliminate chat — the full argument behind the Intent-Clarity Spectrum and the cost-of-conversation framing.',
              },
            ],
          },
        ],
      },
      {
        id: 'lesson-2',
        title: 'Anatomy of a Chat Interface',
        duration: 5,
        order: 2,
        module: 'foundations',
        sections: [
          {
            type: 'intro',
            content: 'A chat interface is six stacked components: message area, input bar, suggested prompts, status indicators, header, and a disclosure surface for sources and context. The first five are the shell every team builds. The sixth is where most AI products quietly fail.',
            icon: 'layout',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'The Core Components',
          },
          {
            type: 'text',
            content: 'A chat interface has six essential components. The first five are the chat shell most teams already build; the sixth — the disclosure surface — is where most products quietly fail.',
          },
          {
            type: 'table',
            rows: [
              {
                label: 'Message area',
                content: 'The scrollable container showing the conversation history. User messages align right, AI messages align left. Each message has a bubble, optional avatar, and timestamp.',
              },
              {
                label: 'Input bar',
                content: 'Where users type their message. Includes a text field, send button, and optionally: file upload, voice input toggle, and character count.',
              },
              {
                label: 'Suggested prompts',
                content: 'Clickable chips or buttons showing example queries. These appear in the empty state (to help users start) and after AI responses (as follow-up suggestions).',
              },
              {
                label: 'Status indicators',
                content: 'Typing dots, "thinking" spinners, or streaming text that show the AI is processing. Critical for perceived responsiveness.',
              },
              {
                label: 'Header / toolbar',
                content: 'Shows the AI\'s name/avatar, conversation title, and actions (new chat, settings, history).',
              },
              {
                label: 'Disclosure surface',
                content: 'The always-visible signals that tell the user what the AI is, what it can see right now, and what it\'s authorized to do. Identity badge in the header, context indicators in the input bar, and an audit trail under each AI action. Without this surface, users feel surveilled rather than helped — and the product gets pulled.',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Message Bubble Design',
          },
          {
            type: 'text',
            content: 'Message bubbles are the visual backbone of your chat UI. Key decisions:\n\nAlignment: User messages right-aligned, AI messages left-aligned. This is a universal convention - don\'t break it.\n\nColor: User messages get the primary/accent color (filled). AI messages get a neutral background (white/gray or surface color). This creates instant visual scanning.\n\nWidth: Messages should have a max-width (60-75% of container). Full-width messages are hard to read. On mobile, allow up to 85%.\n\nRich content: AI responses often include code blocks, tables, lists, images, and buttons. Design these as first-class elements within the bubble - not as plain text dumped into a container.\n\nSpacing: 8-12px between messages from the same sender, 16-20px between sender changes. This creates natural visual grouping.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'The Empty State',
          },
          {
            type: 'text',
            content: 'The empty state (first visit, no messages) is the most important screen in your conversational UI. Users who don\'t know what to type will leave.\n\nInclude:\n• A welcome message explaining what the AI can do (1-2 sentences, not a paragraph)\n• 3-4 suggested prompts relevant to common use cases\n• A subtle capability list or examples section\n\nReal-world examples:\n• ChatGPT shows "How can I help you?" with prompt suggestions organized by capability\n• Claude shows a clean input with suggested starters\n• Perplexity shows trending topics and example queries',
          },
          {
            type: 'callout',
            calloutType: 'warning',
            content: 'Don\'t overload the empty state with features, tutorials, or marketing. Users came to chat - get them typing within 3 seconds of landing on the page.',
          },
          {
            type: 'further-reading',
            links: [
              {
                title: 'AI learned to shut up. It forgot to say what it was doing.',
                url: 'https://medium.com/p/91df21ad2742',
                source: 'Medium',
                description:
                  'Why disclosure is a first-class component of chat anatomy — and what happens to products that skip it (Microsoft Copilot, Meta internal agent, Deutsche Telekom + ElevenLabs).',
              },
            ],
          },
        ],
      },
      {
        id: 'lesson-3',
        title: 'Building Message Bubbles in React',
        duration: 4,
        order: 3,
        module: 'building',
        sections: [
          {
            type: 'intro',
            content: 'A message bubble in React is a styled div inside a scrollable list, rendered from a { role, content, timestamp } data shape. This lesson builds one from scratch with auto-scroll, avatars, and status states — the foundation under every chat UI.',
            icon: 'code',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Data Model',
          },
          {
            type: 'text',
            content: 'Start with a clean message type:',
          },
          {
            type: 'code',
            language: 'typescript',
            label: 'Message type definition',
            code: 'interface Message {\n  id: string;\n  role: \'user\' | \'assistant\';\n  content: string;\n  timestamp: Date;\n  status?: \'sending\' | \'sent\' | \'error\';\n}',
          },
          {
            type: 'text',
            content: 'Keep the model simple. You can extend it later with attachments, metadata, or citations, but the core is: who said what, and when.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Message Component',
          },
          {
            type: 'text',
            content: 'Each message is a flex container with conditional alignment:',
          },
          {
            type: 'code-preview',
            language: 'tsx',
            label: 'ChatMessage component',
            previewId: 'chat-message-bubbles',
            code: 'function ChatMessage({ message }: { message: Message }) {\n  const isUser = message.role === \'user\';\n  \n  return (\n    <div className={`flex gap-2 ${isUser ? \'justify-end\' : \'justify-start\'}`}>\n      {!isUser && <Avatar role="assistant" />}\n      <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${\n        isUser \n          ? \'bg-blue-500 text-white\' \n          : \'bg-gray-100 text-gray-900\'\n      }`}>\n        <div className="text-sm whitespace-pre-wrap">{message.content}</div>\n        <time className={`text-xs mt-1 block ${\n          isUser ? \'text-blue-200\' : \'text-gray-400\'\n        }`}>\n          {formatTime(message.timestamp)}\n        </time>\n      </div>\n      {isUser && <Avatar role="user" />}\n    </div>\n  );\n}',
          },
          {
            type: 'list',
            items: [
              'max-w-[75%] prevents full-width blobs that are hard to read',
              'rounded-2xl gives the modern bubble shape',
              'whitespace-pre-wrap preserves AI formatting and line breaks',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Auto-Scrolling',
          },
          {
            type: 'text',
            content: 'Chat interfaces must auto-scroll to the latest message - but only when the user is already at the bottom. If they\'ve scrolled up to read history, don\'t yank them down.',
          },
          {
            type: 'code',
            language: 'tsx',
            label: 'Smart auto-scroll hook',
            code: 'const messagesEndRef = useRef<HTMLDivElement>(null);\nconst containerRef = useRef<HTMLDivElement>(null);\n\nconst isNearBottom = () => {\n  const el = containerRef.current;\n  if (!el) return true;\n  return el.scrollHeight - el.scrollTop - el.clientHeight < 100;\n};\n\nuseEffect(() => {\n  if (isNearBottom()) {\n    messagesEndRef.current?.scrollIntoView({ behavior: \'smooth\' });\n  }\n}, [messages]);',
          },
          {
            type: 'text',
            content: 'The < 100 threshold gives a small buffer - users scrolled up slightly still get auto-scroll.',
          },
          {
            type: 'callout',
            calloutType: 'tip',
            content: 'Test auto-scroll on mobile especially. Touch scrolling has momentum - users may still be "scrolling" when a new message arrives. Use `behavior: \'smooth\'` to avoid jarring jumps.',
          },
        ],
      },
      {
        id: 'lesson-4',
        title: 'Typing Indicators & Streaming Responses',
        duration: 4,
        order: 4,
        module: 'building',
        sections: [
          {
            type: 'intro',
            content: 'Typing indicators and streaming responses solve the same problem: never make a user stare at a blank screen while the AI works. Indicators are right for waits under three seconds; streaming is the modern default everywhere else. This lesson covers both, with code.',
            icon: 'loading',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'The Three Response Patterns',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Typing Indicator (Three Bouncing Dots)',
                content: 'Use for short waits (< 3 seconds). Shows "the AI is thinking" without committing to a response format. This is what Slack and iMessage use. Build it with three small circles using animate-bounce with staggered delays.',
              },
              {
                number: 2,
                title: 'Streaming Text',
                content: 'The modern standard for AI chat. Tokens appear as they\'re generated, giving users something to read immediately. ChatGPT and Claude both use this. You consume a Server-Sent Events (SSE) stream and append tokens to the message.',
              },
              {
                number: 3,
                title: 'Status Phases',
                content: 'For complex tasks, show distinct phases: "Searching..." then "Reading 3 documents..." then "Writing response..." This is what Perplexity and research-focused AIs use. Each phase reassures the user that progress is happening.',
              },
            ],
          },
          {
            type: 'code-preview',
            language: 'tsx',
            label: 'Typing indicator (three bouncing dots)',
            previewId: 'typing-indicator',
            code: '<div className="flex gap-1.5 items-center">\n  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"\n       style={{ animationDelay: \'0ms\' }} />\n  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"\n       style={{ animationDelay: \'150ms\' }} />\n  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"\n       style={{ animationDelay: \'300ms\' }} />\n</div>',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Implementing Streaming',
          },
          {
            type: 'text',
            content: 'Most AI APIs (OpenAI, Anthropic, Google) support streaming via Server-Sent Events. Here\'s the pattern:',
          },
          {
            type: 'code',
            language: 'tsx',
            label: 'Stream response handler',
            code: 'async function streamResponse(userMessage: string, onToken: (token: string) => void) {\n  const response = await fetch(\'/api/chat\', {\n    method: \'POST\',\n    body: JSON.stringify({ message: userMessage }),\n  });\n\n  const reader = response.body?.getReader();\n  const decoder = new TextDecoder();\n\n  while (reader) {\n    const { done, value } = await reader.read();\n    if (done) break;\n    const text = decoder.decode(value);\n    onToken(text);\n  }\n}',
          },
          {
            type: 'text',
            content: 'In your component, create a "streaming" message and append tokens to it:',
          },
          {
            type: 'code-preview',
            language: 'tsx',
            label: 'Streaming text with cursor',
            previewId: 'streaming-text',
            code: 'const [streamingContent, setStreamingContent] = useState(\'\');\n\nawait streamResponse(input, (token) => {\n  setStreamingContent(prev => prev + token);\n});\n\n// In JSX:\n<div className="text-sm">\n  {streamingContent}\n  {isStreaming && <span className="animate-pulse">▊</span>}\n</div>',
          },
          {
            type: 'text',
            content: 'The message bubble shows streamingContent with a blinking cursor at the end.',
          },
          {
            type: 'callout',
            calloutType: 'tip',
            content: 'Add a subtle blinking cursor (▊) at the end of streaming text. It signals "more is coming" and prevents users from thinking the response is done mid-sentence.',
          },
        ],
      },
      {
        id: 'lesson-5',
        title: 'Suggested Prompts & Conversation Starters',
        duration: 4,
        order: 5,
        module: 'building',
        sections: [
          {
            type: 'intro',
            content: 'A blank input field is the biggest usability problem in conversational UI — users know what they want but not the words that produce it. Suggested prompts close that gap by offering the vocabulary inline. Done well, they become a navigation mechanism, not training wheels.',
            icon: 'lightbulb',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Prompts as articulation bridge',
          },
          {
            type: 'text',
            content: 'There\'s a gap users run into with every free-form AI interface — they know what they want, but not the exact words that will produce it. The "articulation barrier" is the cognitive distance between intent and prompt language, and it\'s the single biggest reason new users churn on chat-first products.\n\nSuggested prompts exist to close that gap. They show the vocabulary, the shape, and the granularity of a well-formed request — not by teaching it, but by offering it inline. The best prompt sets feel less like tutorials and more like visible commands: scannable options that turn an open text field into a guided surface without removing the user\'s freedom to type anything else.\n\nStructured commands like /fix and /explain are the precise end of this spectrum. They give power users a low-ambiguity shortcut once they\'ve figured out the articulation.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Three Types of Prompts',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Conversation Starters (Empty State)',
                content: [
                  'Shown when the chat is empty. Showcase the AI\'s range of capabilities:',
                  '"Summarize this document" (demonstrates analysis)',
                  '"Help me write an email to my team" (demonstrates creation)',
                  '"What are the pros and cons of..." (demonstrates reasoning)',
                  'Limit to 3-4 starters. More creates decision paralysis.',
                ],
              },
              {
                number: 2,
                title: 'Follow-Up Suggestions (After AI Responds)',
                content: [
                  'Shown after each AI message. These should be contextual - based on what was just discussed:',
                  'After a code explanation: "Show me an example", "What about edge cases?"',
                  'After a summary: "Go deeper on point 3", "Turn this into bullet points"',
                ],
              },
              {
                number: 3,
                title: 'Quick Actions (Persistent)',
                content: 'Always-visible buttons for common tasks: "New conversation", "Upload file", "Switch mode". These are traditional UI elements embedded in the conversational flow.',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Dynamic Prompt Generation',
          },
          {
            type: 'text',
            content: 'Static prompts get stale. The best conversational UIs update suggestions based on context:',
          },
          {
            type: 'code-preview',
            language: 'tsx',
            label: 'Suggested prompts with input bar',
            previewId: 'suggested-prompts',
            code: 'function getSuggestions(lastAiMessage: string, conversationTopic: string): string[] {\n  // After a code response, suggest code-related follow-ups\n  if (lastAiMessage.includes(\'```\')) {\n    return ["Explain this code", "Optimize this", "Add error handling"];\n  }\n  // After a list, suggest drilling deeper\n  if (lastAiMessage.includes(\'1.\') || lastAiMessage.includes(\'•\')) {\n    return ["Tell me more about #1", "Compare these options", "Which do you recommend?"];\n  }\n  // Default follow-ups\n  return ["Can you elaborate?", "Give me an example", "What should I do next?"];\n}',
          },
          {
            type: 'text',
            content: 'More sophisticated approaches: send the conversation to your AI with a meta-prompt asking it to generate 3 relevant follow-up questions.',
          },
          {
            type: 'callout',
            calloutType: 'tip',
            content: 'Place suggested prompts directly above the input bar, not below the AI\'s response. Users\' eyes naturally move from reading the response down to the input - prompts in that path get clicked 3-4x more than prompts near the message.',
          },
          {
            type: 'further-reading',
            links: [
              {
                title: 'AI is finally learning to shut up',
                url: 'https://medium.com/design-bootcamp/ai-is-finally-learning-to-shut-up-62af1d2c01c8',
                source: 'Medium',
                description:
                  'The articulation barrier in depth — and why structured commands like /fix often outperform open prompts for repeat users.',
              },
            ],
          },
        ],
      },
      {
        id: 'lesson-6',
        title: 'Managing Conversation Context',
        duration: 5,
        order: 6,
        module: 'advanced',
        sections: [
          {
            type: 'intro',
            content: 'Context management is how a chat remembers what was said five messages ago. Every AI model has a context window — GPT-4 holds ~128K tokens, Claude ~200K — but the design work is deciding what to keep verbatim, summarize, or drop without users noticing.',
            icon: 'brain',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'How AI Context Windows Work',
          },
          {
            type: 'text',
            content: 'Every AI model has a context window - the maximum amount of text it can "see" at once. GPT-4 handles ~128K tokens, Claude handles ~200K tokens. But larger context doesn\'t mean you should dump everything in.',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'System Prompt',
                content: 'Keep the personality and instructions - always included in every request.',
              },
              {
                number: 2,
                title: 'Recent Messages',
                content: 'Include the last N messages verbatim for immediate context.',
              },
              {
                number: 3,
                title: 'Compressed History',
                content: 'Summarize older messages to preserve context without using all the tokens.',
              },
              {
                number: 4,
                title: 'Retrieved Context (RAG)',
                content: 'Inject relevant search results or document snippets when the user references specific information.',
              },
            ],
          },
          {
            type: 'text',
            content: 'This sliding window approach keeps responses relevant without hitting token limits or increasing latency.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Designing for Multi-Turn Conversations',
          },
          {
            type: 'text',
            content: 'Users expect conversational AI to handle:\n\nPronoun resolution: "Write a function to sort a list" → "Now make it handle duplicates" - the AI must know "it" refers to the sorting function.\n\nTopic branching: A user discusses topic A, switches to topic B, then says "going back to what we were discussing before" - the AI should recall topic A.\n\nCorrection: "Actually, I meant Python not JavaScript" - the AI should reinterpret the previous request without re-asking for all the other details.\n\nDesign your context passing to preserve these conversation dynamics. The simplest approach: always send the full conversation history (up to the context limit) as the messages array to the API.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Conversation History UX',
          },
          {
            type: 'text',
            content: 'For products with persistent conversations, design the history experience:\n\nSidebar list: Show past conversations with auto-generated titles (ChatGPT pattern). The title should be derived from the first user message or the conversation topic, not "Conversation 1, Conversation 2."\n\nSearch: Let users search across all conversations. This is table stakes for any product where users will accumulate 50+ conversations.\n\nBranching: Some products (like ChatGPT) allow editing a previous message and regenerating from that point, creating a conversation branch. This is powerful but adds UI complexity - start without it.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Selective memory — make what you retain visible',
          },
          {
            type: 'text',
            content: 'Context is a system-design concern. Memory is a UX concern. Users must always be able to answer three questions about the AI in front of them: what can it see right now, what is it retaining for later, and how do I see or change that?\n\nWhen products get this wrong, the failure mode isn\'t usually "the AI remembered something it shouldn\'t" — it\'s "the AI retained state and never surfaced it." Users feel watched rather than helped, and the product gets pulled from the default surface. A well-designed conversational UI makes memory legible, not silent.',
          },
          {
            type: 'table',
            rows: [
              {
                label: 'Notion AI Meeting Notes',
                content: 'Sees audio + transcript during the session. Retains session-scoped context only. Shows a real-time waveform while listening, and a post-session panel with full transcript + conclusions + sources. Disclosure is continuous, not upfront.',
              },
              {
                label: 'Microsoft Copilot (screen AI)',
                content: 'Sees the current screen and voice input. Retains context across sessions. Only reveals context during active conversation — when the chat closes, the retention becomes invisible. This is the gap that led to the March 2026 feature rollback.',
              },
              {
                label: 'Meta internal agent',
                content: 'Saw engineer data beyond authorized scope. Retained indefinitely. Provided no visible permission boundary. An extreme case, but a useful contrast: when the disclosure surface is missing entirely, "capability" becomes surveillance.',
              },
            ],
          },
          {
            type: 'callout',
            calloutType: 'warning',
            title: 'Anti-pattern: Silent Context Retention',
            content: 'If the AI remembers something between turns or between sessions, say so — in the UI, not in the terms of service. Every retention you don\'t surface becomes a trust debt, and users cannot tell the difference between "remembers helpfully" and "watches quietly" without a visible signal.',
          },
          {
            type: 'text',
            content: 'Related AIUX patterns: The [Context Switching](/patterns/context-switching) pattern covers how to help users move between multiple AI conversations without losing state. [Selective Memory](/patterns/selective-memory) addresses giving users control over what the AI remembers across sessions. For preventing quality degradation in long conversations, see [Session Degradation Prevention](/patterns/session-degradation-prevention).',
          },
          {
            type: 'further-reading',
            links: [
              {
                title: 'AI learned to shut up. It forgot to say what it was doing.',
                url: 'https://medium.com/p/91df21ad2742',
                source: 'Medium',
                description:
                  'The disclosure layer framework (Before / During / Controls / After), with side-by-side product teardowns showing where memory visibility lives in the UI.',
              },
            ],
          },
        ],
      },
      {
        id: 'lesson-7',
        title: 'Error Handling & Fallback Design',
        duration: 4,
        order: 7,
        module: 'advanced',
        sections: [
          {
            type: 'intro',
            content: 'AI will fail. Responses come back wrong, APIs time out, and users ask for things the model can\'t do. This lesson walks through the four failure modes — misunderstanding, refusal, timeout, hallucination — and how to design each one so the conversation stays productive.',
            icon: 'shield',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'The Four Failure Modes',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: '"I Don\'t Understand"',
                content: [
                  'The AI can\'t interpret the user\'s request.',
                  'Ask a specific clarifying question: "I\'m not sure what you mean. Are you asking about X or Y?"',
                  'Never show a generic "I didn\'t understand that" without a next step.',
                ],
              },
              {
                number: 2,
                title: '"I Can\'t Do That"',
                content: [
                  'The request is outside the AI\'s capabilities.',
                  'Be honest and specific: "I can\'t access your calendar, but I can help you draft the meeting invite."',
                  'Always suggest an alternative that IS possible.',
                ],
              },
              {
                number: 3,
                title: '"Something Went Wrong"',
                content: [
                  'API error, timeout, or rate limit.',
                  'Show a retry button with the original message pre-filled.',
                  'If persistent, suggest: "Try again in a moment" with a countdown.',
                  'Never lose the user\'s message - save it in the input field.',
                ],
              },
              {
                number: 4,
                title: '"The Response Is Wrong"',
                content: [
                  'AI hallucination or incorrect answer.',
                  'Make it easy to regenerate: a "try again" button on every AI message.',
                  'Add feedback buttons (thumbs up/down) so users can flag bad responses.',
                  'If your product supports it, offer "edit and resend" on user messages.',
                ],
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Designing the Retry Pattern',
          },
          {
            type: 'code-preview',
            language: 'tsx',
            label: 'Error message with retry button',
            previewId: 'error-message-retry',
            code: 'function ErrorMessage({ error, onRetry, originalMessage }: {\n  error: string;\n  onRetry: () => void;\n  originalMessage: string;\n}) {\n  return (\n    <div className="flex gap-2 items-start">\n      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 max-w-[75%]">\n        <p className="text-sm text-red-800">{error}</p>\n        <button\n          onClick={onRetry}\n          className="mt-2 text-sm text-red-600 hover:underline"\n        >\n          ↻ Try again\n        </button>\n      </div>\n    </div>\n  );\n}',
          },
          {
            type: 'text',
            content: 'The key UX principle: errors should feel like a natural part of the conversation, not a system crash. Style them as messages, not modal dialogs.',
          },
          {
            type: 'callout',
            calloutType: 'warning',
            content: 'Never silently swallow errors. A message that disappears into a void with no response is the worst user experience. Even "Something went wrong - click to retry" is infinitely better than silence.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'When the AI doesn\'t know what it doesn\'t know',
          },
          {
            type: 'text',
            content: 'The four failure modes above assume the AI knows it failed. A harder class of error is when the AI gives a confident-sounding answer that happens to be wrong. These are the worst errors for conversational UI because users have no visible signal to distrust them — and the same interface used for correct answers is used for the confident-wrong ones.\n\nThree specific sub-patterns are worth naming:',
          },
          {
            type: 'table',
            rows: [
              {
                label: 'Competitor blending',
                content: 'When the AI can\'t read your product\'s content, it fills the gap with a rival\'s methodology, presented as if it were yours. No disclosure that content was substituted.',
              },
              {
                label: 'Narrative recycling',
                content: 'The AI surfaces outdated content (old blog posts, stale LinkedIn posts, prior-year pricing) as current. The timestamp is usually available but doesn\'t make it into the response.',
              },
              {
                label: 'Confident falsification',
                content: 'The AI generates plausible-looking but incorrect details (fake API endpoints, fabricated citations, invented features) with the same tone and confidence as accurate ones.',
              },
            ],
          },
          {
            type: 'callout',
            calloutType: 'tip',
            title: 'Pattern: Honest Uncertainty',
            content: 'Claude\'s approach to these failures is the design target: state access limits explicitly ("I can\'t read that page — paste the content and I\'ll help"), cite sources when available, and prefer a shorter honest answer over a longer fabricated one. In conversational UX: surface uncertainty as a first-class message element, not a disclaimer. A visible "I\'m inferring this from..." line is worth more than 400 confidently wrong words.',
          },
          {
            type: 'text',
            content: 'Related AIUX patterns: The [Error Recovery](/patterns/error-recovery) pattern covers graceful failure strategies in depth - including undo, retry, and fallback mechanisms with examples from ChatGPT, GitHub Copilot, and more. For situations where the AI should hand off to a human, see [Graceful Handoff](/patterns/graceful-handoff) and [Escalation Pathways](/patterns/escalation-pathways).',
          },
          {
            type: 'further-reading',
            links: [
              {
                title: 'Your design is invisible now',
                url: 'https://medium.com/p/c50e3695f01a',
                source: 'Medium',
                description:
                  'How AI agents fill content gaps by blending competitors, why "honest uncertainty" beats confident wrongness, and what designing for dual audiences (humans + agents) actually means.',
              },
            ],
          },
        ],
      },
      {
        id: 'lesson-8',
        title: 'Voice Interface Design Patterns',
        duration: 4,
        order: 8,
        module: 'advanced',
        sections: [
          {
            type: 'intro',
            content: 'Voice interfaces break most of the assumptions text chat makes. Responses need to be two or three sentences, not paragraphs; users will interrupt mid-reply; and screen-based feedback shifts to audio cues plus a pulsing-orb affordance. This lesson covers the patterns unique to voice.',
            icon: 'microphone',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Voice-Specific Design Principles',
          },
          {
            type: 'list',
            items: [
              'Keep responses short - 2-3 sentences max. If complex, chunk it: "Here\'s a quick answer. Want me to go deeper?"',
              'Confirm before acting - In voice, the AI hears what it hears. For destructive actions: "I\'ll delete the Monday meeting. Should I go ahead?"',
              'Handle interruptions - Users will cut the AI off mid-sentence. Stop immediately and listen - don\'t finish the response first.',
              'Provide visual feedback - Even voice-first interfaces need visual cues: a pulsing orb while listening, a spinner while processing, text transcription of what was heard.',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'The Voice Interaction Loop',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Wake / Trigger',
                content: 'User activates voice input via button press, wake word, or always-on listening.',
              },
              {
                number: 2,
                title: 'Listening',
                content: 'Show visual feedback (pulsing animation, waveform). Capture audio.',
              },
              {
                number: 3,
                title: 'Transcription',
                content: 'Show the transcribed text so users can verify what was heard.',
              },
              {
                number: 4,
                title: 'Processing',
                content: 'Show "thinking" state. Keep it short - voice users are less patient than text users.',
              },
              {
                number: 5,
                title: 'Response',
                content: 'Speak the response + show visual companion (text, card, image).',
              },
              {
                number: 6,
                title: 'Follow-up',
                content: 'Offer next actions or stay in listening mode for follow-up.',
              },
            ],
          },
          {
            type: 'text',
            content: 'Design each state explicitly. The transition between listening, processing, and responding should feel smooth, not jarring.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'When Voice Needs a Visual Companion',
          },
          {
            type: 'text',
            content: 'Some information doesn\'t work in voice-only:',
          },
          {
            type: 'list',
            items: [
              'Lists longer than 3 items ("Here are the 7 restaurants near you..." - no one remembers all 7)',
              'Anything with numbers, URLs, or code',
              'Comparisons ("Option A costs $45/month with 10GB, Option B costs...")',
            ],
          },
          {
            type: 'text',
            content: 'For these, the voice says a summary and the visual shows the detail: "I found 7 restaurants nearby. Here they are on your screen." This is the pattern Siri and Google Assistant use - voice for the headline, screen for the data.',
          },
        ],
      },
      {
        id: 'lesson-9',
        title: 'Accessibility in Conversational UI',
        duration: 3,
        order: 9,
        module: 'polish',
        sections: [
          {
            type: 'intro',
            content: 'Accessibility in chat UI comes down to four things: ARIA live regions so screen readers announce new messages, keyboard paths into every control (including prompt chips), focus management after sending, and WCAG AA contrast on bubble colors. This lesson covers each.',
            icon: 'accessibility',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Screen Reader Support',
          },
          {
            type: 'text',
            content: 'Chat interfaces are dynamic - messages appear, typing indicators pulse, and content streams in. Screen readers need explicit guidance.',
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'ARIA Live Regions for New Messages',
          },
          {
            type: 'code-preview',
            language: 'html',
            label: 'ARIA roles and live regions visualized',
            previewId: 'accessibility-annotations',
            code: '<div role="log" aria-live="polite" aria-label="Chat messages">\n  {messages.map(msg => <ChatMessage key={msg.id} ... />)}\n</div>',
          },
          {
            type: 'text',
            content: 'role="log" tells screen readers this is a chronological message list. aria-live="polite" announces new messages without interrupting current reading.',
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'Label Message Roles Clearly',
          },
          {
            type: 'code',
            language: 'html',
            label: 'Accessible message role labeling',
            code: '<div aria-label={`${message.role === \'user\' ? \'You\' : \'AI Assistant\'} said`}>\n  {message.content}\n</div>',
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'Announce Status Changes',
          },
          {
            type: 'code',
            language: 'html',
            label: 'Typing indicator announcement',
            code: '<div role="status" aria-live="assertive">\n  {isTyping ? \'AI is typing...\' : \'\'}\n</div>',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Keyboard Navigation',
          },
          {
            type: 'list',
            items: [
              'Input focus: Auto-focus the text input on page load. After sending a message, focus returns to the input.',
              'Message navigation: Let users Tab to messages for copy/action access. Arrow keys to navigate between messages.',
              'Suggested prompts: Make prompt chips keyboard-navigable with arrow keys and Enter to select.',
              'Send on Enter: Standard convention. Shift+Enter for newline. Make this configurable.',
            ],
          },
          {
            type: 'code',
            language: 'tsx',
            label: 'Enter to send, Shift+Enter for newline',
            code: 'const handleKeyDown = (e: React.KeyboardEvent) => {\n  if (e.key === \'Enter\' && !e.shiftKey) {\n    e.preventDefault();\n    handleSend();\n  }\n};',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Visual Accessibility',
          },
          {
            type: 'list',
            items: [
              'Contrast: Message bubbles must meet WCAG AA contrast ratios (4.5:1 for text). White text on light blue fails - use dark text on light backgrounds.',
              'Don\'t rely on color alone: Distinguish user vs AI by position (left/right), avatar, and label - not just color. Color-blind users may not see the difference.',
              'Readable font sizes: Chat text should be at least 14px. Timestamps can be 12px. Never go below 11px for any text.',
              'Motion sensitivity: Respect prefers-reduced-motion for animations (message slide-in, typing dots) and provide static alternatives.',
            ],
          },
        ],
      },
      {
        id: 'lesson-10',
        title: 'Putting It All Together - Architecture Checklist',
        duration: 5,
        order: 10,
        module: 'polish',
        sections: [
          {
            type: 'intro',
            content: 'A production-ready chat UI is eight components, three runtime concerns, and a short list of decisions you make before writing any code. This lesson lays out the component tree, architecture trade-offs, and the checklist that separates shipped prototypes from polished products.',
            icon: 'checklist',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Component Architecture',
          },
          {
            type: 'text',
            content: 'Organize your chat UI into these components:',
          },
          {
            type: 'code',
            language: 'tsx',
            label: 'Recommended component tree',
            code: '<ChatContainer>\n  <ChatHeader />           // Title, avatar, actions\n  <MessageList>            // Scrollable message area\n    <ChatMessage />        // Individual message bubble\n    <TypingIndicator />    // Three dots or streaming cursor\n  </MessageList>\n  <SuggestedPrompts />     // Contextual prompt chips\n  <ChatInput />            // Text field + send button\n</ChatContainer>',
          },
          {
            type: 'text',
            content: 'Keep state in ChatContainer. Messages, loading state, and suggestions flow down as props. User actions (send, retry, select prompt) flow up as callbacks.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Production Checklist',
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'Core Functionality',
          },
          {
            type: 'list',
            items: [
              'Message sending and receiving',
              'Streaming/typing indicator',
              'Auto-scroll (respecting user scroll position)',
              'Suggested prompts (empty state + contextual)',
              'Error handling with retry',
              'Conversation history (if multi-session)',
            ],
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'Polish',
          },
          {
            type: 'list',
            items: [
              'Keyboard shortcuts (Enter to send, Shift+Enter for newline)',
              'Message copy button',
              'Regenerate response button',
              'Mobile responsive layout',
              'Dark mode support',
              'Loading skeleton on initial load',
            ],
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'Accessibility',
          },
          {
            type: 'list',
            items: [
              'ARIA live regions for new messages',
              'Screen reader labels for message roles',
              'Keyboard navigation for all interactive elements',
              'WCAG AA contrast on message bubbles',
              'Reduced motion support',
            ],
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'Performance',
          },
          {
            type: 'list',
            items: [
              'Virtualized message list for long conversations (react-window)',
              'Debounced input for "user is typing" indicators',
              'Lazy load conversation history',
              'Optimistic UI for sent messages',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'What to Build Next',
          },
          {
            type: 'text',
            content: 'Once your core chat UI is solid, these AIUX design patterns will take it to the next level. Each one is a documented pattern with real-world examples, code demos, and implementation guidelines:\n\n[Multimodal Interaction](/patterns/multimodal-interaction) - Let users drag images, PDFs, or code files into the chat. Design for voice + text + visual input simultaneously.\n\n[Graceful Handoff](/patterns/graceful-handoff) - When the AI can\'t help, transfer to a human agent with full conversation context preserved. Critical for customer support.\n\n[Progressive Disclosure](/patterns/progressive-disclosure) - Start with a simple chat, then reveal advanced features (system prompts, temperature controls, model selection) as users become power users.\n\n[Context Switching](/patterns/context-switching) - Help users manage multiple conversations and switch between them without losing context.\n\n[Confidence Visualization](/patterns/confidence-visualization) - Show users how confident the AI is in its response. Especially important for high-stakes domains like healthcare or finance.\n\n[Feedback Loops](/patterns/feedback-loops) - Add thumbs up/down, regenerate, and edit mechanisms that help users correct the AI and improve responses over time.\n\nWant to see how your conversational UI stacks up? Use the free [AI UX Audit Tool](/audit) to score your interface against all 36 patterns.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Pre-launch questions',
          },
          {
            type: 'text',
            content: 'Before you ship, walk through these two checklists. The first covers boundary design (what the AI can and can\'t do). The second covers disclosure design (what the user knows about the AI). Most AI products that fail post-launch fail one of these, not the core capability.',
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'Boundary design',
          },
          {
            type: 'list',
            items: [
              'Where on the permission spectrum does this sit — human decides, shared decision, or AI decides? Map it in the actual interface, not the spec doc.',
              'Is the boundary designed or patched? If the "Cancel" button was added after a review raised concerns, it\'s patched.',
              'Who else does this affect? If the AI acts on behalf of one user but touches another user\'s data, consent design extends beyond the invoking user.',
              'What happens at 15x? If the AI gets faster or runs more often, does the human review step still work, or does it become rubber-stamping?',
            ],
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'Disclosure design',
          },
          {
            type: 'list',
            items: [
              'Does the user know the AI is present? Not in the terms of service — at the moment of use, every time.',
              'Does the user know what context the AI accesses? What data is being read, why, and for how long?',
              'Does the user know what the AI is authorized to do? What actions can it take, on whose behalf, within what boundaries?',
            ],
          },
          {
            type: 'callout',
            calloutType: 'tip',
            content: 'Ship the simplest version first: message bubbles, input, send, streaming response, and 4 suggested prompts. Every feature after that should be validated by watching real users interact with your chat UI.',
          },
          {
            type: 'further-reading',
            links: [
              {
                title: 'Who is designing the boundary for AI?',
                url: 'https://medium.com/p/3a51b18b5fc7',
                source: 'Medium',
                description:
                  'The permission spectrum in detail, the three conditions for safe autonomy (scope / stakes / reversibility), and why designed boundaries outperform patched ones.',
              },
              {
                title: 'AI learned to shut up. It forgot to say what it was doing.',
                url: 'https://medium.com/p/91df21ad2742',
                source: 'Medium',
                description:
                  'The Disclosure Layer Framework (Before / During / Controls / After) with the Notion Meeting Notes worked example that the disclosure checklist above is derived from.',
              },
            ],
          },
        ],
      },
      {
        id: 'lesson-11',
        title: 'Agentic Conversational UI - When AI Takes Actions',
        duration: 8,
        order: 11,
        module: 'polish',
        sections: [
          {
            type: 'intro',
            content: 'An agentic chat doesn\'t just answer — it sends emails, runs code, or modifies files on the user\'s behalf. That changes the interface fundamentally: irreversibility, trust calibration, and consent all become design problems. This lesson covers the patterns that make agentic AI safe to use.',
            icon: 'robot',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'What Makes Agentic UI Different',
          },
          {
            type: 'text',
            content: 'A regular chatbot generates text. An agentic AI generates text AND takes actions - sending emails, running code, making API calls, modifying documents. This creates new UX challenges:',
          },
          {
            type: 'list',
            items: [
              'Irreversibility - A wrong text response can be regenerated. A wrong email sent to your boss can\'t be unsent.',
              'Trust calibration - Users need to know when to trust the AI\'s judgment and when to verify.',
              'Transparency - Users need to see what the AI is doing, not just what it says.',
              'Control spectrum - Some users want full autonomy, others want approval on every action.',
            ],
          },
          {
            type: 'text',
            content: 'These aren\'t abstract concerns - they\'re the design challenges facing every AI coding assistant (Cursor, GitHub Copilot), AI email tool (Superhuman, Spark), and AI agent platform (ChatGPT with plugins, Claude with tools).',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Destination AI vs Ambient AI',
          },
          {
            type: 'text',
            content: 'The first design decision is not what the agent does — it\'s where it lives. A destination AI is a place users go to get help. An ambient AI is present where the work is already happening, and surfaces only when it\'s useful. Most agentic products work better ambient than destination, because the context-switching tax of "go to AI → get help → come back" eats into the productivity gain the agent was supposed to provide.',
          },
          {
            type: 'table',
            rows: [
              {
                label: 'Destination AI',
                content: 'A dedicated surface the user visits ("open ChatGPT", "go to the chat tab"). Good for exploratory tasks, brainstorming, and long sessions. Costly for repetitive actions embedded in daily workflows.',
              },
              {
                label: 'Ambient AI',
                content: 'The agent lives inside the tools the user is already in — Google Personal Intelligence across Gmail/Photos, Figma\'s Make embeds inline with designs, Vercel\'s apply-fix button inside the editor. Lower interaction cost, but demands stronger disclosure because users haven\'t "summoned" the AI.',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'The Permission Spectrum',
          },
          {
            type: 'text',
            content: 'Every agentic feature sits somewhere on a spectrum from "human decides" to "AI decides." Your job as a designer is to know where on the spectrum the feature lives, and whether the interface reflects that honestly. The most common failure is shipping something on the right end of the spectrum with an interface that implies the middle.',
          },
          {
            type: 'table',
            rows: [
              {
                label: 'Human decides',
                content: 'The user makes the call; the AI proposes or ranks. Perplexity Model Council (3 responses, user picks), Google Photos "Ask" suggestions, Gemini Deep Think research summaries. Safest default, lowest velocity.',
              },
              {
                label: 'Shared decision',
                content: 'The AI drafts, the user reviews before execution. Uber Eats cart assistant, Vercel feature flags, Figma Claude-produced code that designers keep or reject. This is the middle of the spectrum — and in practice, the middle is nearly empty. Most products skip straight from "AI suggests" to "AI acts."',
              },
              {
                label: 'AI decides',
                content: 'The agent acts inside a defined scope without per-action approval. Cursor autonomous coding agents, GitHub Agentic Workflows, Codex-Spark 15x code generation. Needs strong boundaries, strong disclosure, and genuine reversibility to be safe.',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Three conditions for safe autonomy',
          },
          {
            type: 'text',
            content: 'When you move a feature toward the right end of the spectrum, the three conditions below are what make autonomy safe rather than reckless. If any one of them breaks, pull the feature back toward "shared decision" before ship.',
          },
          {
            type: 'table',
            rows: [
              {
                label: 'Scope',
                content: 'Is the boundary of what the agent can touch explicit and visible to the user? Safe: "this agent can only modify files inside this repository." Unsafe: "this agent can read anything the logged-in user can read."',
              },
              {
                label: 'Stakes',
                content: 'Does the user understand the consequences of a wrong action at this point? Safe: a documentation update the agent can revert. Unsafe: sending an email, spending money, or modifying shared state without a preview.',
              },
              {
                label: 'Reversibility',
                content: 'Can the action be undone, and does the UI surface the undo? Safe: git revert, draft-that-never-sent, one-click rollback. Unsafe: data shared externally, message posted to a channel, payment processed.',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Designed boundaries vs patched boundaries',
          },
          {
            type: 'text',
            content: 'The most important design decision on any agentic feature is what the AI shouldn\'t do. If you find yourself adding confirmation dialogs after a review meeting flagged the risk, you\'re patching boundaries rather than designing them — and users can feel the difference.',
          },
          {
            type: 'table',
            rows: [
              {
                label: 'Designed boundary',
                content: 'Built in from the start. The boundary is the feature. "The repository boundary is the permission — the agent can\'t reach outside it, but inside that boundary it acts without asking." Feels integral, not additive.',
              },
              {
                label: 'Patched boundary',
                content: 'Added after the capability shipped (or after a review surfaced a concern). Confirmation modals, warning banners, off-by-default toggles. Feels like a speed bump, not a feature — and users learn to click through them.',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'The Disclosure Layer Framework',
          },
          {
            type: 'text',
            content: 'When the agent is ambient and partially autonomous, a single "consent event" at the start is not enough. Disclosure has to happen at four moments — before, during, controls, and after — and the design job is to make sure each moment has a real UI surface, not a buried settings toggle.',
          },
          {
            type: 'table',
            rows: [
              {
                label: 'Before',
                content: 'What will the AI do? What will it access? Named action + consent confirmation at the point of use, not in the onboarding flow. Notion AI Meeting Notes asks "Record this meeting?" each time, not once at account creation.',
              },
              {
                label: 'During',
                content: 'Persistent visible signal of active operation. Pulsing waveform while listening, real-time transcript, "AI is working" badge on the cursor. The user should never wonder whether the agent is active right now.',
              },
              {
                label: 'Controls',
                content: 'User visibility into — and adjustment of — what the agent can see and do. Consent toggles per data source, per mode, or per session. Cursor context retention visible from the sidebar, not buried under Settings > Advanced.',
              },
              {
                label: 'After',
                content: 'A structured record of what was used, what was produced, and how to undo. Notion\'s post-session panel shows the source transcript, the extracted conclusions, and the follow-up actions the agent took. This is where audit trail and reversibility meet disclosure.',
              },
            ],
          },
          {
            type: 'callout',
            calloutType: 'warning',
            title: 'Anti-pattern: Consent Theater',
            content: 'A terms-of-service checkbox is not consent design. Consent needs to match the actual scope of the action, and it needs to extend to people other than the invoking user when their data or attention is affected. Meta\'s smart-glasses name tag feature was a textbook case: the wearer opted in; the people being identified didn\'t. If your AI\'s actions reach beyond the person in front of it, the disclosure design has to reach there too.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'The Five Agentic Design Patterns',
          },
          {
            type: 'text',
            content: 'These patterns from the AIUX framework are essential for agentic conversational UIs:',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Intent Preview',
                content: 'Before the AI acts, show what it plans to do and let the user approve. "I\'m going to send this email to Sarah with the Q3 report attached. Should I proceed?" This is the most critical pattern for building trust.',
              },
              {
                number: 2,
                title: 'Plan Summary',
                content: 'For multi-step tasks, show the full plan upfront. Users can approve, modify, or reject the plan before execution begins.',
              },
              {
                number: 3,
                title: 'Agent Status Monitoring',
                content: 'While the AI works on a multi-step task, show real-time progress. Step indicators, current action, time estimates, and the ability to pause or cancel.',
              },
              {
                number: 4,
                title: 'Escalation Pathways',
                content: 'Define when the AI should stop acting autonomously and ask for human input. High-stakes decisions, ambiguous requests, and unfamiliar territory should trigger escalation.',
              },
              {
                number: 5,
                title: 'Trust Calibration',
                content: 'Gradually increase the AI\'s autonomy as users build trust. Start with "ask before every action" and let users unlock "act then notify" for routine tasks.',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Designing the Action Confirmation Flow',
          },
          {
            type: 'text',
            content: 'The most common agentic pattern in conversational UI is the confirmation flow:',
          },
          {
            type: 'code-preview',
            language: 'text',
            label: 'Intent Preview — action confirmation',
            previewId: 'intent-preview-card',
            code: 'User: "Schedule a meeting with Sarah for next Tuesday"\n\nAI: [Intent Preview Card]\n    Create Meeting\n    - With: Sarah Johnson\n    - Date: Tuesday, April 1 at 10:00 AM\n    - Duration: 30 minutes\n    - Location: Google Meet\n    \n    [Confirm]  [Edit]  [Cancel]',
          },
          {
            type: 'text',
            content: 'This is a structured card within the conversation flow - not a modal dialog. The user can confirm with one click, edit details inline, or cancel and rephrase.',
          },
          {
            type: 'code-preview',
            language: 'text',
            label: 'Plan Summary — multi-step execution',
            previewId: 'plan-summary-card',
            code: 'AI: [Plan Summary]\n    I\'ll refactor the auth module in 3 steps:\n    \n    Step 1: Extract token validation into utils/auth.ts\n    Step 2: Update 12 import statements\n    Step 3: Add unit tests for the new module\n    \n    Estimated time: ~2 minutes\n    \n    [Start]  [Modify Plan]  [Cancel]',
          },
          {
            type: 'text',
            content: 'As steps complete, checkboxes fill in and the current step highlights - giving users real-time visibility into agent progress.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'The Action Audit Trail',
          },
          {
            type: 'text',
            content: 'Every action the AI takes should be logged and reviewable. The Action Audit Trail pattern shows users exactly what happened:',
          },
          {
            type: 'list',
            items: [
              'What action was taken',
              'When it happened',
              'What data was affected',
              'How to undo it (if possible)',
            ],
          },
          {
            type: 'text',
            content: 'In a conversational UI, this can be a collapsible section under each AI action message: "View details" expands to show the full action log. For products with many automated actions, consider a dedicated activity feed or history panel.',
          },
          {
            type: 'callout',
            calloutType: 'tip',
            content: 'The golden rule of agentic conversational UI: the AI should never take an irreversible action without explicit user confirmation. For reversible actions (like drafting text), act first and let users undo. For irreversible actions (like sending an email), always preview and confirm.',
          },
          {
            type: 'text',
            content: 'Test your conversational UI: Use the free [AI UX Audit Tool](/audit) to score your interface against all 36 AIUX design patterns - including the agentic patterns covered in this lesson. Upload a screenshot and get instant feedback on which patterns are strong, weak, or missing.',
          },
          {
            type: 'further-reading',
            links: [
              {
                title: 'Who is designing the boundary for AI?',
                url: 'https://medium.com/p/3a51b18b5fc7',
                source: 'Medium',
                description:
                  'The permission spectrum mapped against 12 real products, the three conditions for safe autonomy, and why patched boundaries keep failing.',
              },
              {
                title: 'AI learned to shut up. It forgot to say what it was doing.',
                url: 'https://medium.com/p/91df21ad2742',
                source: 'Medium',
                description:
                  'The four disclosure moments (Before / During / Controls / After) with Notion Meeting Notes as the worked example and Microsoft Copilot as the failure case study.',
              },
              {
                title: 'AI is finally learning to shut up',
                url: 'https://medium.com/design-bootcamp/ai-is-finally-learning-to-shut-up-62af1d2c01c8',
                source: 'Medium',
                description:
                  'Why ambient AI beats destination AI for most agentic tasks — the context-switching tax and the economics of interaction cost.',
              },
            ],
          },
        ],
      },
    ],
    content: `
      <div class="prose max-w-none">
        <section class="mb-8">
          <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary)">Build a Conversational UI - From Chat Bubbles to Production</h2>
          <p class="text-text-secondary mb-4">
            This guide teaches you how to design and build conversational interfaces step by step - the same patterns used by ChatGPT, Claude, Slack AI, and Siri. Whether you're building a customer support chatbot, an AI coding assistant, or a voice-enabled product, you'll learn the design decisions and implementation techniques that make conversational UIs feel natural.
          </p>
          <p class="text-text-secondary mb-4">
            Across 11 lessons, you'll cover: the conversational UI spectrum (scripted vs AI-powered vs hybrid), chat interface anatomy, message bubbles in React, typing indicators and streaming responses, suggested prompts, conversation context management, error handling, voice interface patterns, accessibility, agentic AI patterns (intent preview, plan summary, agent monitoring), and a production-ready architecture checklist.
          </p>
        </section>

        <section class="mb-8">
          <h3 class="text-xl font-bold mb-3" style="color: var(--text-primary)">Who Is This Guide For?</h3>
          <div class="bg-background-secondary p-4 rounded-lg border border-border-primary mb-3">
            <p class="text-text-secondary">• <strong class="text-text-primary">Product designers</strong> building chat or voice interfaces for AI products</p>
          </div>
          <div class="bg-background-secondary p-4 rounded-lg border border-border-primary mb-3">
            <p class="text-text-secondary">• <strong class="text-text-primary">Frontend developers</strong> implementing conversational UIs in React, Vue, or similar frameworks</p>
          </div>
          <div class="bg-background-secondary p-4 rounded-lg border border-border-primary mb-3">
            <p class="text-text-secondary">• <strong class="text-text-primary">Product managers</strong> specifying requirements for AI chat features</p>
          </div>
        </section>

        <section class="mb-8">
          <h3 class="text-xl font-bold mb-3" style="color: var(--text-primary)">How to Use This Guide</h3>
          <div class="bg-background-secondary p-4 rounded-lg border border-border-primary mb-3">
            <p class="text-text-secondary">• <strong class="text-text-primary">Designing a chat UI?</strong> Start with Lessons 1-2 (foundations) then jump to Lesson 5 (suggested prompts) and 7 (error handling).</p>
          </div>
          <div class="bg-background-secondary p-4 rounded-lg border border-border-primary mb-3">
            <p class="text-text-secondary">• <strong class="text-text-primary">Building in React?</strong> Start at Lesson 3 and follow through sequentially to Lesson 10.</p>
          </div>
          <div class="bg-background-secondary p-4 rounded-lg border border-border-primary mb-3">
            <p class="text-text-secondary">• <strong class="text-text-primary">Adding voice?</strong> Read Lesson 1 for context, then skip to Lesson 8 (voice patterns).</p>
          </div>
          <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-600 mt-6">
            <h3 class="font-bold mb-2" style="color: var(--text-primary)">Ready to Build?</h3>
            <p class="text-text-secondary">Start with Module 1 below to understand the conversational UI landscape, then dive into building.</p>
          </div>
        </section>
      </div>
    `,
  },
];

/**
 * Export courses array with the single comprehensive course
 */
export const courses = guides;

/**
 * Get a guide by slug
 */
export function getGuideBySlug(slug: string): Guide | null {
  return guides.find((guide) => guide.slug === slug) || null;
}

/**
 * Filter guides based on criteria
 */
export function filterGuides(filter: GuideFilter): Guide[] {
  return guides.filter((guide) => {
    // Tool filter
    if (filter.tool && guide.tool !== filter.tool) {
      return false;
    }

    // Skill level filter
    if (filter.skillLevel && guide.skillLevel !== filter.skillLevel) {
      return false;
    }

    // Design domain filter
    if (filter.designDomain && guide.designDomain !== filter.designDomain) {
      return false;
    }

    // Tags filter (match any tag)
    if (filter.tags && filter.tags.length > 0) {
      const hasMatchingTag = filter.tags.some((tag) => guide.tags?.includes(tag));
      if (!hasMatchingTag) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Search guides by query (title, description, tags)
 */
export function searchGuides(query: string): Guide[] {
  const lowerQuery = query.toLowerCase();

  return guides.filter((guide) => {
    return (
      guide.title.toLowerCase().includes(lowerQuery) ||
      guide.description.toLowerCase().includes(lowerQuery) ||
      guide.excerpt?.toLowerCase().includes(lowerQuery) ||
      guide.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}

/**
 * Get all unique tools from guides
 */
export function getAllTools(): string[] {
  return Array.from(new Set(guides.map((guide) => guide.tool)));
}

/**
 * Get all unique skill levels from guides
 */
export function getAllSkillLevels(): string[] {
  return Array.from(new Set(guides.map((guide) => guide.skillLevel)));
}

/**
 * Get all unique design domains from guides
 */
export function getAllDesignDomains(): string[] {
  return Array.from(new Set(guides.map((guide) => guide.designDomain)));
}

/**
 * Get all guides for a specific pattern
 */
export function getGuidesForPattern(patternSlug: string): Guide[] {
  return guides.filter((guide) => guide.relatedPatterns?.includes(patternSlug));
}

/**
 * Get the previous guide in the learning path sequence
 */
export function getPreviousGuide(slug: string): Guide | null {
  const currentIndex = guides.findIndex((guide) => guide.slug === slug);
  if (currentIndex <= 0) return null;
  return guides[currentIndex - 1];
}

/**
 * Get the next guide in the learning path sequence
 */
export function getNextGuide(slug: string): Guide | null {
  const currentIndex = guides.findIndex((guide) => guide.slug === slug);
  if (currentIndex === -1 || currentIndex >= guides.length - 1) return null;
  return guides[currentIndex + 1];
}

/**
 * Get progress information for a guide in the learning path
 */
export function getGuideProgress(slug: string): { current: number; total: number; percentage: number } | null {
  const currentIndex = guides.findIndex((guide) => guide.slug === slug);
  if (currentIndex === -1) return null;

  return {
    current: currentIndex + 1,
    total: guides.length,
    percentage: ((currentIndex + 1) / guides.length) * 100,
  };
}
